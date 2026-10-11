// SOLARO — "Od iskry po slnko" / "From the first spark to the sun". 888 frames @ 60 fps (14.8 s).
// Sections own contiguous frame ranges (see scenes/solaro/spine.js for the hand-off contracts).
// URL params: lang=sk|en, only=s3 (render one section, others blank) — for section-level work.
import { FPS } from '../engine/core.js';
import * as assets from '../engine/assets.js';
import { loadType } from './solaro/config.js';

const q = new URLSearchParams(location.search);
const ONLY = q.get('only');
const SECTION_FILES = ['s0_open', 's1_spark', 's2_fire', 's3_bolt', 's4_light', 's5_sun', 's6_solaro', 's7_lockup'];
const FRAMES = 888;

let sections = [];

export default {
  duration: FRAMES / FPS,
  shutter: 0.5,
  async load(o) {
    await assets.loadRegistry('../assets/registry.json');
    await loadType();
    for (const name of SECTION_FILES) {
      if (ONLY && !name.startsWith(ONLY)) continue;
      try {
        const mod = await import(`./solaro/${name}.js`);
        sections.push(mod.default);
      } catch (e) {
        if (!String(e).includes('Failed to fetch') && !String(e).includes('404')) throw e;
        console.warn(`section ${name} not built yet`);
      }
    }
    for (const s of sections) {
      if (s.load) await s.load(o);
      for (const [f0, f1, keys] of s.needs || []) assets.need(f0, f1, keys);
    }
  },
  async prepare(t) { await assets.prepare(t); },
  samples(t) {
    const f = t * FPS;
    let n = 1;
    for (const s of sections) for (const [a, b, k] of s.blur || []) if (f >= a && f < b) n = Math.max(n, k);
    return n;
  },
  draw(ctx, t) {
    const f = t * FPS;
    for (const s of sections) {
      if (f < s.f0 || f >= s.f1) continue;
      ctx.save();
      s.draw(ctx, f, t);
      ctx.restore();
    }
  },
  cues: () => sections.flatMap((s) => (s.cues || []).map((c) => ({ ...c, t: c.f / FPS, section: s.name }))),
};
