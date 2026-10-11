// S3 — BLESK / BOLT + ELEKTRINA (f222–343)
//  222–228  the FLAME whips into the orange wordmark l of the bolt word (exact mixCell pin → rect,
//           hole collapses, −135° → −180°) while the ink letters slam in (expoOut 3 f, smeared)
//  228–261  read the word (slow push about A)
//  259–263  the l's centre-line bends into the bolt polyline P (constant width, mitred offset
//           polygon); letters collapse to points (inExpo)
//  264–265  INVERT (the split images appear inside the flash)
//  264–291  BOLT SPLIT: the frame is cut along P, two archives left/right, the orange bolt IS the gutter
//  291–304  the bolt straightens to x = 540, the halves cut into quarters that morph (mixCell) into
//           the full-bleed mark windows; the band un-draws into A → DOT
//  304–333  SEQUENCER: one window swaps every 3 f, clockwise; orange wires from A to the frame edges
//  334–343  the windows shrink into the DOT (log-scale inExpo). OUT: dot() at A on white.
import { E, ease, lerp, clamp, invlerp, COLORS, deg } from '../../engine/core.js';
import { mixCell, cellPath2D, drawCell, brandGradient, rectCell } from '../../engine/shapes.js';
import { windowImage } from '../../engine/window.js';
import { reg } from '../../engine/assets.js';
import { A, word, LANG } from './config.js';
import { flame, dot, DOT_R } from './spine.js';
import { m2f, noHoles } from './layouts.js';
import { bandPath, leftRegion, rightRegion, arcFractions, lerpPts, invertCanvas, wire, bboxPts } from './lib_s3.js';

// ------------------------------------------------------------------ timing (absolute frames)
const T = {
  morph: [222, 228],      // flame → l (inOutCubic; the hole closes by 60 %)
  slam0: 225.5,           // first letter slam (expoOut 3 f, 1 f stagger by distance from the l)
  push0: 222,             // word push origin
  fold: 259,              // letters start collapsing (log-scale inQuad 4 f, 0.5 f stagger)
  bend: [259, 263],       // l → bolt
  inv: [264, 266],        // invert frames 264, 265
  split: 264,             // images appear (inside the invert)
  straight: [291, 297],   // vertices → x = 540
  cells: [297, 304],      // quarters → M2F cells (inOutCubic)
  undraw: [297, 303],     // band un-draws into A
  seq: 304,               // first sequencer swap
  wireOn: [306, 312], wireOff: [325, 331],
  shrink: [334, 342],     // windows → DOT
};
const WORD_PUSH = 1.0025;
const SPLIT_PUSH = 1.009;
const SEQ_PUSH = 1.010;

// The bolt polyline: 11 vertices, from above the frame top through A (vertex 5) to below the bottom.
const P = [
  [640, -90], [580, 190], [690, 290], [520, 560], [630, 650], [540, 940],
  [440, 1130], [570, 1215], [480, 1520], [590, 1630], [530, 2010],
];
const KA = 5; // index of A in P

// ------------------------------------------------------------------ images
// split: [frame, side, key]  (focus/zoom live in assets/points/s3.json)
const SPLIT = [
  [264, 'L', 'franklin-kite-currier-ives-loc-s3'],
  [264, 'R', 'bolt-spokane-1914-loc-s3inv'],
  [270, 'L', 'kite-romas-1753-figuier-s3'],
  [273, 'R', 'bolt-jennings-1882-loc-s3inv'],
  [276, 'L', 'strike-building-engraving-wellcome-s3'],
  [279, 'R', 'richmann-killed-engraving-wellcome-s3'],
  [282, 'L', 'suspended-boy-hausen-wellcome-s3'],
  [285, 'R', 'gray-wheler-1729-figuier-s3'],
];
// sequencer: [frame, cell, key] — clockwise ring → tile → pin → leaf, one window every 3 f
const SEQ = [
  [304, 'ring', 'leyden-nollet-spark-wellcome-s3'],
  [307, 'tile', 'leyden-jar-battery-smithsonian-s3'],
  [310, 'pin', 'volta-pile-original-wellcome-s3'],
  [313, 'leaf', 'galvani-frog-hand-arc-wellcome-s3'],
  [316, 'ring', 'machine-cuthbertson-disc-wellcome-s3'],
  [319, 'tile', 'machine-guericke-sulfur-globe-wellcome-s3'],
  [322, 'pin', 'leyden-jars-three-galvani-wellcome-s3'],
  [325, 'leaf', 'leyden-battery-64-jars-wellcome-s3'],
  [328, 'ring', 'machine-hauksbee-wellcome-s3'],
  [331, 'tile', 'volta-pile-griffin-wellcome-s3'],
];
const focusOf = (k) => reg(k).focus || [0.5, 0.5];
const zoomOf = (k) => reg(k).zoom || 1;

// ------------------------------------------------------------------ geometry
let W0, HOT, LBOX, BOLT_W, L_PTS, BOX_L, BOX_R;
const sWord = (f) => Math.pow(WORD_PUSH, Math.max(0, f - T.push0));
const scaleAbout = (x, y, s) => [A[0] + (x - A[0]) * s, A[1] + (y - A[1]) * s];

// the l as a rect cell at frame f (pushed about A)
function lRect(f) {
  const s = sWord(f);
  const [cx, cy] = scaleAbout(LBOX.cx, LBOX.cy, s);
  return { ...rectCell(cx, cy, LBOX.w * s, LBOX.h * s), rot: deg(-180) };
}

// bolt centre-line at frame f (after the l stage)
function boltPts(f) {
  if (f < T.bend[1]) return lerpPts(L_PTS, P, ease(f, T.bend[0], T.bend[1], E.outExpo));
  if (f < T.straight[0]) return P;
  const p = ease(f, T.straight[0], T.straight[1], E.inOutCubic);
  return P.map(([x, y]) => [lerp(x, A[0], p), y]);
}
const bandWidth = (f) => lerp(BOLT_W, 2 * DOT_R, ease(f, T.straight[0], T.straight[1], E.inOutCubic));

function fillOrange(ctx, path, y0, y1) {
  ctx.save();
  ctx.fillStyle = brandGradient(ctx, y0, y1);
  ctx.fill(path, 'nonzero');
  ctx.restore();
}

// last image of each split side at integer frame F
function splitAt(F, side) {
  let cur = null;
  for (const s of SPLIT) if (s[1] === side && s[0] <= F) cur = s;
  return cur;
}
function seqAt(F, cell) {
  let cur = null;
  for (const s of SEQ) if (s[1] === cell && s[0] <= F) cur = s;
  return cur;
}

function drawSplitImage(ctx, s, f, clip) {
  const [f0, side, key] = s;
  windowImage(ctx, key, { mode: 'cov', clip, box: side === 'L' ? BOX_L : BOX_R, focus: focusOf(key), zoom: zoomOf(key), push: Math.pow(SPLIT_PUSH, f - f0) });
}

// M2F target cells (holes closed) and the quarter rects they grow from
const QUAD = { ring: 'TL', tile: 'TR', leaf: 'BL', pin: 'BR' };
function quarterRect(q, g) {
  const x0 = q[1] === 'L' ? 0 : A[0] + g / 2, x1 = q[1] === 'L' ? A[0] - g / 2 : 1080;
  const y0 = q[0] === 'T' ? 0 : A[1], y1 = q[0] === 'T' ? A[1] : 1920;
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, r: [0, 0, 0, 0] };
}

export default {
  name: 's3_bolt', f0: 222, f1: 344,
  needs: [
    [264, 304, [...new Set(SPLIT.map((s) => s[2]))]],
    [300, 344, [...new Set(SEQ.map((s) => s[2]))]],
  ],
  blur: [[223, 232, 12], [259, 264, 16], [291, 297, 4], [297, 304, 8], [335, 342, 10]],
  cues: [
    { f: 224, kind: 'whoosh', dur: 0.22, f0: 900, f1: 5000, shape: 'in', gain: 0.5 },
    { f: 227, kind: 'clap', gain: 0.35 },
    { f: 240, kind: 'sub', dur: 0.9, freq: 41.2, gain: 0.3 },
    { f: 259, kind: 'crackle', dur: 0.12, density: 220, gain: 0.6 },
    { f: 266, kind: 'thunder', dur: 1.6, gain: 1.0 },
    ...SPLIT.filter((s) => s[0] > 264).map((s) => ({ f: s[0] + 2, kind: 'zap', dur: 0.08, gain: 0.35, pan: s[1] === 'L' ? -0.4 : 0.4 })),
    { f: 299, kind: 'zap', dur: 0.2, f0: 3000, f1: 120, gain: 0.5 },
    { f: 305, kind: 'clunk', gain: 0.6 },
    ...SEQ.map((s, i) => ({ f: s[0] + 2, kind: i % 4 === 0 ? 'zap' : 'tick', gain: i % 4 === 0 ? 0.4 : 0.5, pan: { ring: -0.35, tile: 0.35, pin: 0.35, leaf: -0.35 }[s[1]] })),
    { f: 308, kind: 'buzz', dur: 0.42, freq: 50, gain: 0.25 },
    { f: 334, kind: 'whoosh', dur: 0.16, f0: 4000, f1: 300, shape: 'in', gain: 0.55 },
    { f: 343, kind: 'pop', gain: 0.4 },
  ],
  async load() {
    W0 = word('bolt');
    HOT = W0.items[W0.hotIndex];
    LBOX = HOT.box;
    BOLT_W = LBOX.w * sWord(T.bend[0]);
    // the l's centre-line (pushed, at the bend start) subdivided into collinear points that map onto P by arc length
    const r = lRect(T.bend[0]);
    const fr = arcFractions(P);
    L_PTS = fr.map((u) => [r.x + r.w / 2, r.y + u * r.h]);
    const xs = P.map((p) => p[0]);
    BOX_L = { x: 0, y: 0, w: Math.max(...xs) + 20, h: 1920 };
    BOX_R = { x: Math.min(...xs) - 20, y: 0, w: 1080 - (Math.min(...xs) - 20), h: 1920 };
  },
  draw(ctx, f) {
    const F = Math.round(f);

    // ---------------------------------------------------------------- word + flame → l + bend
    if (F < T.split) {
      const sw = sWord(f);
      ctx.save();
      ctx.translate(A[0], A[1]); ctx.scale(sw, sw); ctx.translate(-A[0], -A[1]);
      W0.items.forEach((it, i) => {
        if (i === W0.hotIndex) return;
        const d = i - W0.hotIndex, dist = Math.abs(d);
        // slam in from the side the letter sits on
        const t0 = T.slam0 + (dist - 1);
        if (f < t0 - 0.5) return;
        const pin = ease(f, t0 - 0.5, t0 + 2.5, E.outExpo);
        const dx = (d < 0 ? -1 : 1) * 340 * (1 - pin);
        // collapse to a point (inExpo, staggered outward)
        const c0 = T.fold + (dist - 1) * 0.5;
        const sc = Math.exp(Math.log(0.004) * ease(f, c0, c0 + 4, E.inQuad));
        if (sc <= 0.004) return;
        const p = it.path2d || new Path2D(it.d);
        ctx.save();
        ctx.translate(it.box.cx + dx, it.box.cy);
        ctx.scale(sc, sc);
        ctx.translate(-it.box.cx, -it.box.cy);
        ctx.fillStyle = COLORS.ink;
        ctx.fill(p);
        ctx.restore();
      });
      ctx.restore();
    }

    // ---------------------------------------------------------------- images (split → quarters → windows)
    if (F >= T.split) {
      if (F < T.cells[0]) {
        const pts = boltPts(f), w = bandWidth(f);
        const d = w / 2 - 1.5; // regions tuck 1.5 px under the band (no seams)
        drawSplitImage(ctx, splitAt(F, 'L'), f, leftRegion(pts, d));
        drawSplitImage(ctx, splitAt(F, 'R'), f, rightRegion(pts, d));
      } else {
        const cells = noHoles(m2f());
        const pc = ease(f, T.cells[0], T.cells[1], E.inOutCubic);
        const g0 = 2 * DOT_R - 3;
        const shrink = f >= T.shrink[0] ? Math.exp(Math.log(0.012) * ease(f, T.shrink[0], T.shrink[1], E.inExpo)) : 1;
        if (F < T.shrink[1]) {
          ctx.save();
          ctx.translate(A[0], A[1]); ctx.scale(shrink, shrink); ctx.translate(-A[0], -A[1]);
          for (const k of ['ring', 'tile', 'leaf', 'pin']) {
            const c = mixCell(quarterRect(QUAD[k], g0), cells[k], pc);
            const clip = cellPath2D(c);
            const sq = seqAt(F, k);
            if (sq) {
              const [f0, , key] = sq;
              windowImage(ctx, key, { mode: 'cov', clip, box: { x: cells[k].x, y: cells[k].y, w: cells[k].w, h: cells[k].h }, focus: focusOf(key), zoom: zoomOf(key), push: Math.pow(SEQ_PUSH, f - f0) });
            } else {
              drawSplitImage(ctx, splitAt(F, QUAD[k][1]), f, clip);
            }
          }
          // wires: A → frame edges along the gutter centre-lines
          const on = ease(f, T.wireOn[0], T.wireOn[1], E.linear), off = ease(f, T.wireOff[0], T.wireOff[1], E.linear);
          const k = on * (1 - off);
          if (k > 0.001) {
            const g = brandGradient(ctx, 0, 1920);
            for (const [ex, ey] of [[A[0], 0 - 8], [A[0], 1920 + 8], [-8, A[1]], [1088, A[1]]]) wire(ctx, A, [lerp(A[0], ex, k), lerp(A[1], ey, k)], 12, g);
          }
          ctx.restore();
        }
      }
      if (F >= T.inv[0] && F < T.inv[1]) invertCanvas(ctx);
    }

    // ---------------------------------------------------------------- orange element
    if (f < T.morph[1]) {
      const t = ease(f, T.morph[0], T.morph[1], E.inOutCubic);
      const c = mixCell(flame(f), lRect(f), t);
      // the teardrop hole closes a little ahead of the outline so the finished l never carries a dot
      if (c.hole) {
        const k = Math.max(0, 1 - t / 0.6) / Math.max(1e-6, 1 - t), h = c.hole;
        c.hole = { x: h.x + (h.w * (1 - k)) / 2, y: h.y + (h.h * (1 - k)) / 2, w: h.w * k, h: h.h * k, r: h.r.map((v) => v * k) };
      }
      drawCell(ctx, c);
    } else if (f < T.bend[0]) {
      drawCell(ctx, lRect(f));
    } else if (F < T.cells[0] || f < T.undraw[1]) {
      if (f < T.undraw[0]) {
        const pts = boltPts(f), w = bandWidth(f);
        const bb = bboxPts(pts);
        fillOrange(ctx, bandPath(pts, w), Math.max(-100, bb.y), Math.min(2020, bb.y + bb.h));
      } else {
        // straight capsule (round caps, ends off-frame) un-drawing into A
        const u = ease(f, T.undraw[0], T.undraw[1], E.inQuad);
        const y0 = lerp(P[0][1] - 40, A[1], u), y1 = lerp(P[P.length - 1][1] + 40, A[1], u);
        ctx.save();
        ctx.fillStyle = brandGradient(ctx, y0 - DOT_R, y1 + DOT_R);
        const p = new Path2D();
        p.roundRect(A[0] - DOT_R, y0 - DOT_R, 2 * DOT_R, y1 - y0 + 2 * DOT_R, DOT_R);
        ctx.fill(p);
        ctx.restore();
      }
    } else {
      // DOT, pulsing on sequencer swaps
      let pulse = 0;
      for (const s of SEQ) if (F >= s[0]) pulse = Math.max(0, 1 - (f - s[0]) / 3) ** 2;
      drawCell(ctx, dot(A[0], A[1], DOT_R * (1 + 0.2 * pulse)));
    }
  },
};
