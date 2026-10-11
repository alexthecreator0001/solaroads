// Image registry + memory-bounded lazy loading.
// Scenes reference images by key; a film declares which keys it needs in which frame window,
// and prepare(t) keeps only the images needed around t decoded (≈90 photos would not fit at once).
import { FPS } from './core.js';

const cache = new Map(); // key -> ImageBitmap
const pending = new Map();
let REG = {};
let needs = []; // [{f0, f1, keys:Set}]

export async function loadRegistry(url = '../assets/registry.json') {
  REG = await (await fetch(url)).json();
  return REG;
}
export const reg = (k) => {
  const r = REG[k];
  if (!r) throw new Error(`registry: unknown image ${k}`);
  return r;
};

async function decode(k) {
  const r = reg(k);
  const blob = await (await fetch('../' + r.file)).blob();
  const bmp = await createImageBitmap(blob);
  cache.set(k, bmp);
  return bmp;
}
export function ensure(k) {
  if (cache.has(k)) return Promise.resolve(cache.get(k));
  if (!pending.has(k)) pending.set(k, decode(k).finally(() => pending.delete(k)));
  return pending.get(k);
}
export function get(k) {
  const b = cache.get(k);
  if (!b) throw new Error(`image not prepared: ${k}`);
  return b;
}

// declare usage: keys needed in frames [f0, f1)
export function need(f0, f1, keys) { needs.push({ f0, f1, keys: new Set(keys) }); }
export function clearNeeds() { needs = []; }

// make sure everything needed within ±margin frames of t is decoded; evict the rest
export async function prepare(t, margin = 20) {
  const f = t * FPS;
  const want = new Set();
  for (const n of needs) if (f + margin >= n.f0 && f - margin < n.f1) n.keys.forEach((k) => want.add(k));
  await Promise.all([...want].map(ensure));
  for (const k of [...cache.keys()]) if (!want.has(k)) { cache.get(k).close?.(); cache.delete(k); }
}
