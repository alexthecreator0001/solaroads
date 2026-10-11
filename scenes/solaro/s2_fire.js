// S2 — FIRE (f138–221). Contract IN: the orange wordmark 'a' alone at its spark-word slot.
// The a becomes the FLAME at A exactly: makeMorph a -> pin cell (same slot, square corner = the a's
// stem foot), then the pin moves / rotates (0 -> -135°, rolling) / grows to the flame cell (an exact
// similarity, = mixCell), motion-blurred, and starts to flicker (spine.flame). A 4 px ink OFFSET
// KEYLINE (parallel offset of the pin, d 22) draws on round it. Registered fire montage: every
// image's fire point sits under the orange flame (hard in-place cuts every 5–8 f, scale contrast:
// 177 % W torch arm vs a 38 % W lamp …), engraved plates sit in a flame-shaped window (the pin cell
// at 520 px, concentric). The keyline un-draws, the flame rests alone on white (12 f).
// Contract OUT (f221): spine.flame(f) at A, nothing else.
import { E, lerp, deg } from '../../engine/core.js';
import { cellPath2D, drawCell, mixCell, cellToRings } from '../../engine/shapes.js';
import { makeMorph } from '../../engine/morph.js';
import { reg } from '../../engine/assets.js';
import { A } from './config.js';
import { pin, flame, FLAME_S } from './spine.js';
import { ease, F, aSlot, aPin, cellGrad, fillRings, simRings, flameAmp, offsetCell, cellOutline, strokeOpen, drawReg } from './lib_s1s2.js';

const f0 = 138, f1 = 222;
const T = { morph: [138, 143], fly: [140, 150], amp: [148, 158], keyOn: [150, 156], keyOff: [204, 210] };
const KEY_D = 22;
const BASE = [540, 1062];             // fire point for objects the flame stands on (just inside its round foot)
const WIN = (() => { const c = pin(520, deg(-135)); delete c.hole; return c; })(); // flame-shaped window
const PUSH = 1.010;                   // per-shot push about the registration point

const SHOTS = [
  { f: 150, key: 'torch-arm-hires-s1s2.cut', P: BASE, w: 1915 },            // huge: the fist round the torch cup
  { f: 158, key: 'oil-lamp-bronze-roman-cleveland.cut', P: BASE, w: 410 },  // tiny: lamp nozzle
  { f: 163, key: 'ignis-hires-s1s2', P: BASE, w: 2800, win: true },         // engraved fire round the flame
  { f: 169, key: 'tinderbox-met.cut', P: BASE, w: 930 },                    // tiny: candle socket
  { f: 174, key: 'handaxe-teardrop-soft-s1s2.cut', P: A, w: 480 },          // teardrop rhyme behind the flame
  { f: 179, key: 'handaxe-red-acheulean-met.cut', P: A, w: 440 },
  { f: 184, key: 'lantern-pierced-tin-met.cut', P: A, w: 600 },             // the flame inside the lantern
  { f: 190, key: 'prometheus-torch-hires-s1s2', P: BASE, w: 1689, win: true }, // Prometheus' torch
  { f: 196, key: 'hand-of-god-rodin-met.cut', P: A, w: 1150 },              // a hand holding the fire
  { f: 202, key: 'hand-reaching-cast-met.cut', P: [410 - KEY_D - 6, 955], w: 1512 }, // fingertip to the keyline
  { f: 210, key: null },
];
const shotAt = (Fi) => { let s = null; for (const x of SHOTS) if (Fi >= x.f) s = x; return s; };

let G = null;
function build() {
  const S = aSlot();
  const p0 = aPin();
  const morph = makeMorph(S.rings, cellToRings(p0, 400), { n: 400 });
  G = { S, p0, morph };
}

// the orange element at frame f
function hotCell(f) {
  const amp = ease(f, T.amp[0], T.amp[1], E.inOutSine);
  const v = ease(f, T.fly[0], T.fly[1], E.swift);
  return { v, cell: mixCell(G.p0, flameAmp(f, amp), v) };
}

function drawHot(ctx, f) {
  const { S, p0, morph } = G;
  const u = ease(f, T.morph[0], T.morph[1], E.inOutSine);
  const { v, cell } = hotCell(f);
  if (u < 1) {
    // morph in the pin's own frame, carried by the same similarity the pin cell follows
    const size = lerp(p0.w, FLAME_S, v), rot = lerp(0, deg(-135), v);
    const cx = lerp(S.cx, A[0], v), cy = lerp(S.cy, A[1], v);
    const rings = simRings(morph(u), S.cx, S.cy, size / p0.w, rot, cx, cy);
    fillRings(ctx, rings, cellGrad(ctx, cy, size, rot));
    return cell;
  }
  drawCell(ctx, cell);
  return cell;
}

function drawKeyline(ctx, f, cell) {
  const on = ease(f, T.keyOn[0], T.keyOn[1]);
  const off = ease(f, T.keyOff[0], T.keyOff[1]);
  if (on <= 0 || off >= 1) return;
  const pts = cellOutline(offsetCell(cell, KEY_D), 360, 'br'); // starts at the flame's tip, clockwise
  strokeOpen(ctx, pts, off, on, { width: 4 });
}

function drawShot(ctx, f, Fi) {
  const s = shotAt(Fi);
  if (!s || !s.key) return;
  const k = Math.pow(PUSH, f - s.f);
  const pt = reg(s.key).pt;
  ctx.save();
  if (s.win) ctx.clip(cellPath2D(WIN));
  drawReg(ctx, s.key, pt, s.P, s.w, k);
  ctx.restore();
}

export default {
  name: 's2_fire', f0, f1,
  needs: [[138, 222, SHOTS.filter((s) => s.key).map((s) => s.key)]],
  blur: [[139, 141, 6], [141, 150, 8], [150, 151, 4]],
  cues: [
    { f: 139, kind: 'whoosh', dur: 0.32, f0: 300, f1: 2600, q: 1.1, gain: -14 },
    { f: 146, kind: 'fire', gain: -3 },
    { f: 146, kind: 'sub', gain: -9 },
    { f: 152, kind: 'glint', gain: -18 },
    { f: 152, kind: 'crackle', dur: 1.0, gain: -15 },
    { f: 160, kind: 'tick', gain: -14, pan: 0.3 },
    { f: 165, kind: 'tick', gain: -14, pan: -0.3 },
    { f: 171, kind: 'tick', gain: -14, pan: 0.2 },
    { f: 176, kind: 'stone', freq: 900, gain: -9 },
    { f: 181, kind: 'stone', freq: 1100, gain: -12 },
    { f: 184, kind: 'crackle', dur: 0.9, seed: 3, gain: -16 },
    { f: 186, kind: 'tick', gain: -14, pan: -0.2 },
    { f: 192, kind: 'tick', gain: -13, pan: 0.3 },
    { f: 198, kind: 'tick', gain: -14, pan: -0.3 },
    { f: 204, kind: 'tick', gain: -13 },
    { f: 206, kind: 'whoosh', dur: 0.2, f0: 3000, f1: 900, q: 1.3, gain: -20 },
    { f: 212, kind: 'fire', dur: 0.9, gain: -16 },
  ],
  async load() { build(); },
  draw(ctx, f) {
    if (!G) build();
    const Fi = F(f);
    drawShot(ctx, f, Fi);
    const { v, cell } = hotCell(f);
    if (v >= 1) drawKeyline(ctx, f, cell);
    drawHot(ctx, f);
  },
};
