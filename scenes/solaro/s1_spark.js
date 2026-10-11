// S1 — SPARK WORD (f72–137). Contract IN: orange DOT r17 at A on white.
// The dot rolls to the hot letter's slot, inflating into a ball, and opens into the orange
// wordmark 'a' (exact makeMorph circle -> a: the counter grows from its centre point, the stem
// grows out of the ball). The ink letters slam in (expoOut 3 f + smear, 1 f stagger, towards the a).
// Around the word two SPLIT windows (top = tile, bottom = leaf, big round corner facing A) grow
// from their corner points and swap fire-making images every 6 f (alternating), one ink paint
// accent (a circle drawn round Hooke's spark globule). End: windows shrink into their corner
// points, letters collapse to points, the orange 'a' stays alone at its slot (contract OUT).
import { E, clamp, lerp, COLORS } from '../../engine/core.js';
import { cellPath2D, circle, cellToRings, drawCell } from '../../engine/shapes.js';
import { makeMorph } from '../../engine/morph.js';
import { drawWord } from '../../engine/draw.js';
import { SPLIT } from './layouts.js';
import { A, LANG } from './config.js';
import { dot, DOT_R } from './spine.js';
import { ease, F, aSlot, cellGrad, fillRings, drawPlaced, strokeOpen } from './lib_s1s2.js';

const f0 = 72, f1 = 138;

// ---------------------------------------------------------------- timing
const T = {
  roll: [72, 78],      // dot travels A -> a slot and inflates to the a's bowl
  open: [78, 82],      // ball -> a (makeMorph)
  slam0: 76,           // first letter starts sliding in (1 f stagger)
  pushFrom: 82,        // word complete -> slow push
  topIn: [80, 85], botIn: [86, 91],
  out: [124, 128],     // windows shrink into their corner points
  collapse0: 127,      // first letter collapses (1 f stagger, farthest from the a first)
  settle: [126, 135],  // the a eases back from the push to its slot size
};
const PUSH = 1.002;    // word push per frame (about the a)
const WPUSH = 1.008;   // in-window image push per frame

// ---------------------------------------------------------------- windows & images
const TOP = SPLIT.top, BOT = SPLIT.bottom;
const TOP_PT = [324, 756], BOT_PT = [756, 1240];
// each window holds an image 12 f, the two windows alternate -> a swap every 6 f
// placement: image point pt (fractions) on screen point at, display scale s (screen px per image px);
// the in-window push is about `at`. Every crop covers its whole window (checked on stills).
const TOP_SHOTS = [
  { f: 80, key: 'hooke-fig1-s1s2', pt: [0.553, 0.478], at: [660, 430], s: 0.7, circle: { pt: [0.553, 0.478], r: 0.122, f: [82, 87] } },
  { f: 92, key: 'strike-stones-clean-s1s2', pt: [0.55, 0.7], at: [720, 420], s: 0.85 },
  { f: 104, key: 'tinderbox-eng-clean-s1s2', pt: [0.47, 0.45], at: [700, 380], s: 0.95 },
  { f: 116, key: 'fire-steel-oval-kulturparken', pt: [0.5, 0.5], at: [700, 400], s: 0.55 },
];
const BOT_SHOTS = [
  { f: 86, key: 'flint-striker-islamic-met', pt: [0.5, 0.45], at: [370, 1570], s: 1.0 },
  { f: 98, key: 'nine-bifaces-s1s2.cut', pt: [0.26, 0.42], at: [380, 1560], s: 0.65 },
  { f: 110, key: 'bow-drill-clean-s1s2', pt: [0.42, 0.45], at: [360, 1580], s: 0.62 },
  { f: 122, key: 'fire-steel-with-flint-badisches', pt: [0.3, 0.35], at: [380, 1540], s: 1.0 },
];
const shotAt = (shots, Fi) => { let s = null; for (const x of shots) if (Fi >= x.f) s = x; return s; };

// ---------------------------------------------------------------- geometry (built in load)
let G = null;
function build() {
  const S = aSlot();
  const L = S.L;
  const ball = circle(S.cx, S.cy, S.size / 2);
  const open = makeMorph(cellToRings(ball, 400), S.rings, { n: 400 });
  // letter order: farthest from the a first; slide direction: towards the a
  const ink = L.items.map((it, i) => ({ i, it, d: Math.abs(it.box.cx - S.cx), dir: Math.sign(S.cx - it.box.cx) })).filter((o) => o.i !== L.hotIndex);
  const byDist = ink.slice().sort((a, b) => b.d - a.d);
  const rank = new Map();
  // letters at equal-ish distance (EN: s & k, p & r) share a slot in the stagger
  let r = -1, lastD = null;
  for (const o of byDist) { if (lastD == null || Math.abs(o.d - lastD) > 40) { r++; lastD = o.d; } rank.set(o.i, r); }
  G = { S, L, open, ink, rank, nRank: r + 1 };
}

const pushK = (f) => {
  if (f <= T.pushFrom) return 1;
  const kTop = Math.pow(PUSH, T.settle[0] - T.pushFrom);
  if (f <= T.settle[0]) return Math.pow(PUSH, f - T.pushFrom);
  return Math.exp(Math.log(kTop) * (1 - ease(f, T.settle[0], T.settle[1], E.inOutCubic)));
};

// window group scale about its corner point: grow (outExpo 5 f) and shrink back (log, quad-in 4 f)
function winScale(f, [a, b]) {
  if (f < a) return 0;
  const g = ease(f, a, b, E.outExpo);
  const o = ease(f, T.out[0], T.out[1], E.inQuad);
  return g * Math.exp(Math.log(0.004) * o) * (o >= 1 ? 0 : 1);
}

function drawWindow(ctx, f, Fi, cell, pt, shots, inT) {
  const k = winScale(f, inT);
  if (k <= 0.002) return;
  const shot = shotAt(shots, Fi);
  if (!shot) return;
  ctx.save();
  ctx.translate(pt[0], pt[1]); ctx.scale(k, k); ctx.translate(-pt[0], -pt[1]);
  const clip = cellPath2D(cell);
  ctx.clip(clip);
  const push = Math.pow(WPUSH, f - inT[0]);
  const m = drawPlaced(ctx, shot, push);
  if (shot.circle) {
    const c = shot.circle;
    const [cx, cy] = m.map(c.pt[0], c.pt[1]);
    const rr = c.r * m.w; // r as a fraction of the displayed image width
    const pts = [];
    for (let i = 0; i <= 180; i++) { const a = -Math.PI / 2 + (i / 180) * Math.PI * 2; pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
    const p = ease(f, c.f[0], c.f[1]);
    strokeOpen(ctx, pts, 0, p, { width: 4 / k, color: COLORS.ink });
  }
  ctx.restore();
}

function drawLetters(ctx, f) {
  const { S, L, rank } = G;
  const K = pushK(f);
  ctx.save();
  ctx.translate(S.cx, S.cy); ctx.scale(K, K); ctx.translate(-S.cx, -S.cy);
  drawWord(ctx, L, {
    color: COLORS.ink,
    per: (i, it) => {
      if (i === L.hotIndex) return { hide: true };
      const rk = rank.get(i);
      const ts = T.slam0 + rk;
      if (f < ts) return { hide: true };
      const o = G.ink.find((x) => x.i === i);
      const dx = -o.dir * 150 * (1 - ease(f, ts, ts + 3, E.outExpo));
      const tc = T.collapse0 + rk;
      const c = ease(f, tc, tc + 5, E.inCubic);
      if (c >= 1) return { hide: true };
      return { dx, s: 1 - c };
    },
  });
  ctx.restore();
}

function drawHot(ctx, f) {
  const { S, open } = G;
  const grad = (cy, size) => cellGrad(ctx, cy, size);
  if (f < T.roll[1]) {
    // roll: A -> bowl centre, radius 17 -> bowl radius (log-scale), E.swift
    const p = ease(f, T.roll[0], T.roll[1], E.swift);
    const x = lerp(A[0], S.cx, p), y = lerp(A[1], S.cy, p);
    const r = Math.exp(lerp(Math.log(DOT_R), Math.log(S.size / 2), ease(f, T.roll[0], T.roll[1], E.inOutCubic)));
    if (f <= T.roll[0]) { drawCell(ctx, dot()); return; }
    drawCell(ctx, { ...dot(x, y, r) });
    return;
  }
  const K = pushK(f);
  ctx.save();
  ctx.translate(S.cx, S.cy); ctx.scale(K, K); ctx.translate(-S.cx, -S.cy);
  if (f < T.open[1]) {
    const p = ease(f, T.open[0], T.open[1], E.snap);
    fillRings(ctx, open(p), grad(S.cy, S.size));
  } else {
    fillRings(ctx, S.rings, grad(S.cy, S.size));
  }
  ctx.restore();
}

export default {
  name: 's1_spark', f0, f1,
  needs: [[78, 130, [...TOP_SHOTS, ...BOT_SHOTS].map((s) => s.key)]],
  blur: [[72, 79, 6], [76, 84, 5], [80, 92, 4], [124, 136, 5]],
  cues: [
    { f: 73, kind: 'whoosh', dur: 0.22, f0: 900, f1: 5200, q: 1.4, gain: -14, pan: LANG === 'sk' ? 0.25 : 0 },
    { f: 80, kind: 'pop', gain: -6 },
    { f: 79, kind: 'tick', gain: -14, pan: -0.4 }, { f: 81, kind: 'tick', gain: -15, pan: -0.2 },
    { f: 82, kind: 'whoosh', dur: 0.18, f0: 2500, f1: 600, q: 1.2, gain: -18, pan: 0.4 },
    { f: 84, kind: 'glint', gain: -12 },
    { f: 88, kind: 'whoosh', dur: 0.18, f0: 2500, f1: 600, q: 1.2, gain: -18, pan: -0.4 },
    { f: 94, kind: 'stone', freq: 2300, gain: -12, pan: 0.35 },
    { f: 98, kind: 'bell', freq: 1318.5, dur: 0.9, gain: -16 },
    { f: 100, kind: 'stone', freq: 2000, gain: -12, pan: -0.35 },
    { f: 106, kind: 'stone', freq: 2500, gain: -12, pan: 0.35 },
    { f: 112, kind: 'stone', freq: 2100, gain: -12, pan: -0.35 },
    { f: 118, kind: 'stone', freq: 2600, gain: -12, pan: 0.35 },
    { f: 124, kind: 'stone', freq: 2200, gain: -12, pan: -0.35 },
    { f: 125, kind: 'whoosh', dur: 0.25, f0: 4500, f1: 500, q: 1.3, gain: -15 },
    { f: 131, kind: 'tick', gain: -16 },
  ],
  async load() { build(); },
  draw(ctx, f) {
    if (!G) build();
    const Fi = F(f);
    drawWindow(ctx, f, Fi, TOP, TOP_PT, TOP_SHOTS, T.topIn);
    drawWindow(ctx, f, Fi, BOT, BOT_PT, BOT_SHOTS, T.botIn);
    drawLetters(ctx, f);
    drawHot(ctx, f);
  },
};
