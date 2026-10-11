// S5 — SUN (f480–647): the bulb becomes the SUN ring (the mark's ring) over the night Earth in a
// disc window; every sun ever drawn flashes concentric under the ring (8→2 f accelerando, then a
// 2 f flurry of the whole history); rays; the ring flies into the "o" of the sun word (slnko/solar),
// the Tatras roof appears inside the o's counter, and the camera pushes THROUGH the counter.
import { W, H, E, ease, lerp, clamp, COLORS, deg } from '../../engine/core.js';
import { drawCell, mixCell, cellToRings } from '../../engine/shapes.js';
import { makeMorph, ringsToPath } from '../../engine/morph.js';
import { windowImage } from '../../engine/window.js';
import { reg } from '../../engine/assets.js';
import { strokePts } from '../../engine/draw.js';
import { A, word } from './config.js';
import { bulb, bulbBase, sun, SUN_R, fillOrangeRings } from './spine.js';
import { discPath } from './layouts.js';
import { drawInkWord } from './lib_words.js';

const DW = 420;                 // disc window radius
const TATRAS = 'solaro-roof_tatras_dramatic_sky_vertical';
// [key, hold frames]; r from assets/points/s5.json (fraction of image width): r ≥ .25 → the disc
// edge sits on the window (r 420); r < .25 → the disc/moon edge sits on the ring's outer edge (r 210)
const SUNS = [
  ['earth-at-night-europe-africa-black-marble-nasa', 24], ['kircher-sun-corpus-solis-plate-wellcome', 8],
  ['sdo-hmi-white-light-giant-sunspot-2014-nasa', 7], ['s5-course', 7], ['eclipse-2017-corona-nasa', 6],
  ['scheiner-rosa-ursina-grid-disc-ia', 6], ['sdo-aia171-corona-loops-2014-nasa', 5], ['trouvelot-total-eclipse-1878-ia', 5],
  ['sunflower-head-frontal-unsplash', 4], ['sundial-universal-ring-flat-met', 4], ['s5-nollet', 4], ['s5-degraag', 3],
  ['s5-lamp', 3], ['sunflower-head-black-bg-1-wellcome.cut', 3], ['s5-scheiner-grid', 3], ['s5-round-cells', 3],
  // the whole history replayed inside the sun, 2 f each
  ['flint-nodule-3d-render-b-zenodo', 2], ['handaxe-teardrop-acheulean-met.cut', 2], ['torch-bearing-arm-met.cut', 2],
  ['volta-pile-original-wellcome.cut', 2], ['edison-lamp-new-type-smithsonian.cut', 2], ['pylon-silhouette-dusk-sky-wordpress', 2],
  ['mouchot-solar-engine-paris-1878-tekniska', 2], ['cells-window-grid-fraunhofer-flickr', 2], ['iss-solar-array-sunburst-nasa', 2],
  ['sdo-hmi-white-light-giant-sunspot-2014-nasa', 16],
];
const SCHED = (() => { let f = 480; return SUNS.map(([k, d]) => { const s = { k, f0: f, f1: f + d }; f += d; return s; }); })();
const RING_GO = [612, 620], TATRAS_ON = 624, PUSH = [638, 648];

let L, ringToO, oCx, oCy, counter;

function sunImage(ctx, key, f, f0, clip) {
  const r = reg(key), d = r.s5 || { pt: [0.5, 0.5], r: 0.4 };
  const target = d.r >= 0.25 ? DW : SUN_R;
  windowImage(ctx, key, { mode: 'reg', clip, pt: d.pt, P: A, w: target / d.r, push: Math.pow(1.005, f - f0) });
}

export default {
  name: 's5_sun', f0: 480, f1: 648,
  needs: [...SCHED.map((s) => [s.f0, s.f1, [s.k]]), [610, 648, [TATRAS]]],
  blur: [[480, 496, 5], [612, 621, 6], [636, 648, 8]],
  cues: [
    { f: 481, kind: 'sub', dur: 0.7, freq: 41.2, gain: -8 },
    { f: 483, kind: 'whoosh', dur: 0.3, f0: 300, f1: 1500, gain: -16 },
    ...SCHED.slice(1, -1).map((s) => ({ f: s.f0 + 2, kind: 'tick', freq: 2600 + (s.f0 % 7) * 180, gain: s.f0 > 570 ? -17 : -14 })),
    { f: 576, kind: 'impact', dur: 0.8, gain: -14 },
    { f: 578, kind: 'glint', gain: -16 },
    { f: 614, kind: 'whoosh', dur: 0.15, f0: 3000, f1: 700, gain: -16 },
    { f: 620, kind: 'pop', gain: -15 },
    { f: 638, kind: 'whoosh', dur: 0.2, f0: 400, f1: 6000, shape: 'in', gain: -9 },
  ],
  async load() {
    L = word('sun');
    const h = L.hot;
    oCx = h.cx; oCy = h.cy;
    // ring (sun, at A) -> wordmark o rings, translated so the morph happens in place at A, then moved
    const local = h.rings.map((r) => r.map(([x, y]) => [x - oCx + A[0], y - oCy + A[1]]));
    ringToO = makeMorph(cellToRings(sun()), local, { n: 200 });
    // counter = the inner ring of the o (smallest area)
    counter = h.rings.slice().sort((a, b) => Math.abs(area(a)) - Math.abs(area(b)))[0];
  },
  draw(ctx, f) {
    const F = Math.round(f);
    // ---- the push through the counter: camera about the o centre, Tatras fixed in screen space
    if (F >= TATRAS_ON) {
      const p = clamp((f - PUSH[0]) / (PUSH[1] - PUSH[0] - 1));
      const s = f < PUSH[0] ? 1 : Math.exp(Math.log(46) * p * p);
      const tx = lerp(0, A[0] - oCx, E.inOutCubic(p)), ty = lerp(0, A[1] - oCy, E.inOutCubic(p));
      const m = new DOMMatrix().translate(oCx + tx, oCy + ty).scale(s).translate(-oCx, -oCy);
      const push = Math.pow(1.003, f - RING_GO[1]);
      const pm = new DOMMatrix().translate(A[0], A[1]).scale(push).translate(-A[0], -A[1]).multiply(m);
      // the photo, visible only through the counter
      const cp = new Path2D(); cp.addPath(ringsToPath([counter]), pm);
      windowImage(ctx, TATRAS, { mode: 'cov', clip: cp, box: { x: 0, y: 0, w: W, h: H } });
      ctx.save();
      ctx.setTransform(ctx.getTransform().multiply(pm));
      drawInkWord(ctx, L, f, { skip: L.hotIndex });
      fillOrangeRings(ctx, L.hot.rings);
      ctx.restore();
      return;
    }
    // ---- disc window with suns, under the ring
    const win = F < 612 ? DW * ease(f, 482, 492, E.snap) : lerp(DW, SUN_R, ease(f, 612, 616, E.inExpo));
    if (win > 2 && F < 616) {
      let cur = SCHED[0];
      for (const s of SCHED) if (F >= s.f0) cur = s;
      sunImage(ctx, cur.k, f, cur.f0, discPath(win));
    }
    // ---- rays (8 capsules) out at 576, back in at 612
    if (F >= 576 && F < 616) {
      const out = E.outExpo(clamp((f - 576) / 5)), back = E.inExpo(clamp((f - 610) / 5));
      for (let i = 0; i < 8; i++) {
        const a = deg(-90 + i * 45), st = clamp((f - 576 - i * 0.6) / 4);
        const r0 = 236 + 90 * back, r1 = 236 + 94 * E.outExpo(st) * (1 - back);
        if (r1 - r0 < 2) continue;
        strokePts(ctx, [[A[0] + Math.cos(a) * r0, A[1] + Math.sin(a) * r0], [A[0] + Math.cos(a) * r1, A[1] + Math.sin(a) * r1]], { width: 30, color: COLORS.orange });
      }
    }
    // ---- orange element: bulb -> ring (480–496), ring holds, ring -> o (612–620)
    if (F < 498) {
      const p = ease(f, 480, 496, E.swift);
      drawCell(ctx, mixCell(bulb(), { ...sun(), rot: deg(45) }, p));
      for (const c of bulbBase(undefined, A[0], A[1], 1 - E.inCubic(clamp((f - 480) / 6)))) drawCell(ctx, c);
    } else if (F < RING_GO[0]) {
      drawCell(ctx, sun());
    } else {
      const p = ease(f, RING_GO[0], RING_GO[1], E.inOutCubic);
      const rings = ringToO(p).map((r) => r.map(([x, y]) => [x + (oCx - A[0]) * p, y + (oCy - A[1]) * p]));
      fillOrangeRings(ctx, rings);
      drawInkWord(ctx, L, f, { skip: L.hotIndex, enter: [RING_GO[0] + 2, 4, 160] });
    }
  },
};

function area(r) { let a = 0; for (let i = 0; i < r.length; i++) { const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % r.length]; a += x1 * y2 - x2 * y1; } return a / 2; }
