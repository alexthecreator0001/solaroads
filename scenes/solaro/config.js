// Shared configuration for the Solaro film: language, copy, type, anchor, word layouts.
// Every section imports from here so word geometry (and the orange letter in each word) is
// computed identically everywhere — section hand-offs depend on it.
import { loadFont, layoutHybrid } from '../../engine/text.js';

export const A = [540, 940];           // anchor: home of the orange element
export const FONT_URL = '../fonts/poppins/Poppins-Bold.ttf';
export const SIZE = 280;               // word size (px): x-height ≈ 156 px
export const TRACK = -0.01;            // tracking (em)

const q = new URLSearchParams(typeof location !== 'undefined' ? location.search : '');
export const LANG = (q.get('lang') || 'sk').toLowerCase() === 'en' ? 'en' : 'sk';

// Each beat: the word and which letter carries the orange element.
//  kind: 'a' (wordmark a ≈ pin cell), 'l' (wordmark l = rect), 'o' (wordmark o = ring), 'tittle' (i dot)
export const COPY = {
  sk: {
    spark: { word: 'iskra', hot: 4, kind: 'a' },
    bolt: { word: 'blesk', hot: 1, kind: 'l' },
    light: { word: 'svetlo', hot: 5, kind: 'o' },
    sun: { word: 'slnko', hot: 4, kind: 'o' },
    url: 'solaro.sk',
  },
  en: {
    spark: { word: 'spark', hot: 2, kind: 'a' },
    bolt: { word: 'bolt', hot: 2, kind: 'l' },
    light: { word: 'light', hot: 1, kind: 'tittle' },
    sun: { word: 'solar', hot: 1, kind: 'o' },
    url: 'solaro.sk',
  },
};
export const copy = (beat) => COPY[LANG][beat];

export let FONT = null;
export async function loadType() {
  if (!FONT) FONT = await loadFont(FONT_URL);
  return FONT;
}

// Word layout: centred horizontally on x=540 (or `cx`), x-height centred on the anchor's y,
// so an orange letter sits at y = 940 and only has to travel horizontally from A.
const cache = new Map();
export function word(beat, { cx = A[0], size = SIZE, yMid = A[1] } = {}) {
  const key = `${beat}|${cx}|${size}|${yMid}|${LANG}`;
  if (cache.has(key)) return cache.get(key);
  const c = copy(beat);
  const probe = layoutHybrid(FONT, c.word, size, { x: cx, y: 0, align: 'center', tracking: TRACK });
  const baseline = yMid + probe.xHeight / 2;
  const L = layoutHybrid(FONT, c.word, size, { x: cx, y: baseline, align: 'center', tracking: TRACK });
  const it = L.items[c.hot];
  let hot;
  if (c.kind === 'tittle') {
    // split the i into stem (ink) + tittle (orange): the tittle is the ring with the smallest top
    const rings = it.rings.slice().sort((r1, r2) => Math.min(...r1.map((p) => p[1])) - Math.min(...r2.map((p) => p[1])));
    const tit = rings[0], stem = rings.slice(1);
    const xs = tit.map((p) => p[0]), ys = tit.map((p) => p[1]);
    hot = { kind: 'tittle', rings: [tit], stemRings: stem, cx: (Math.min(...xs) + Math.max(...xs)) / 2, cy: (Math.min(...ys) + Math.max(...ys)) / 2, r: (Math.max(...xs) - Math.min(...xs)) / 2 };
  } else {
    hot = { kind: c.kind, rings: it.rings, cx: it.box.cx, cy: it.box.cy, box: it.box, path2d: it.path2d };
  }
  const out = { ...L, baseline, beat, hot, hotIndex: c.hot };
  cache.set(key, out);
  return out;
}
