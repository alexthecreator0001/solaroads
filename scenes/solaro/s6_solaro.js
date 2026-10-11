// S6 — SOLARO (f648–735): the client's roof under the Tatras becomes the panel, the panel becomes the mark.
//  648      full-bleed Tatras (cover, static = S5's last frame); ambient push 1.003/f about A on the photo
//  650–654  orange DOT pops at A (E.punch)
//  654–659  white score lines draw along the 6x10 cut lines (horizontals L→R, verticals T→B, centre-out stagger)
//  660–671  GRID CUT frame → PANEL (E.snap): p = 0 is an invisible tiling, the photo stays put, cells are windows
//  670–682  PROOF: the cells swap to other Solaro installs in a diagonal 2 f wave from the centre (own cover-crops)
//  688–708  LIT 3D FLIP: 60 extruded slabs (16 px, 2 px bevel), photo front / satin orange back, square rings
//           from the centre 2x2 (11 f inOutCubic, 2.5 f stagger), panel leans back ≤ 12.6° X / 5.7° Y mid-flip;
//           continuous log zoom-out (674–709, inOutSine) to the proto_end box; the dot collapses into ring 0
//  709      invisible 3D → 2D hand-off (flat orange cells, ONE shared gradient = drawCellsShared)
//  709–727  proto_end: quadrants' 3x5 cells tile their squares (no seams), squares → mark radii + holes
//  727–735  gap breath: gap → 0 (white ✦ crisp on 730–732) → reopens with E.punch, ends on markEnd()
import { W, H, E, ease, lerp, clamp, invlerp } from '../../engine/core.js';
import { MARK_ORDER, drawCell, drawCellsShared, mixCell, cellPath2D, brandGradient, gridCut, GAP } from '../../engine/shapes.js';
import { windowImage } from '../../engine/window.js';
import { get, reg } from '../../engine/assets.js';
import { strokePts } from '../../engine/draw.js';
import { A } from './config.js';
import { PANEL_FRAME } from './layouts.js';
import { dot, markEnd, MARK_END_SCALE } from './spine.js';
import { panelCut, PANEL1, SCORE_X, SCORE_Y, manhattan, chebyshev, camApply, camCell, assignCrops, buildAtlas, Flip3D } from './lib_s6.js';

const F0 = 648, F1 = 736;
const TATRAS = 'solaro-roof_tatras_dramatic_sky_vertical';
const T = {
  dot: 650, dotLen: 4,
  score: 654, scoreLen: 4.5,
  cut: [660, 672],
  proof: 670, proofStep: 2,
  flip: 688, flipStep: 2.5, flipLen: 11,
  zoom: [674, 709],        // log-scale inOutSine, ends exactly when the last flip ring lands (FLIP_END)
  tilt: [-0.22, 0.10],     // peak panel lean (rad) mid-flip: X (top recedes, toward the sun), Y
  merge: [709, 719],       // panel -> 2x2 squares (inOutCubic)
  radii: [719, 727],       // squares -> mark radii / holes (E.snap)
  close: [726.6, 729.7],   // gap -> 0 (inQuart): the white ✦ holds crisp on 730-732
  reopen: [732.3, 735],    // gap -> GAP (E.punch), exact at 735
};
const PUSH = 1.003;                         // ambient push on the Tatras (per frame, about A)
const S_END = 600 / 1080;                   // 0.5556: PANEL -> proto_end box (600 x 1011 at A)
const HEROES = ['solaro-van_solaro_branded_house', 'solaro-roof_slate_panels_vertical', 'solaro-house_bluesky_panels', 'solaro-roof_orange_tiles_clouds'];

let CROPS = [], ASSIGN = null, ATLAS = null, flip3d = null, scale = 1;
const proofKeys = () => [...new Set(CROPS.map((c) => c.key))];

// --------------------------------------------------------------- timing helpers
const cutP = (f) => ease(f, T.cut[0], T.cut[1], E.snap);
const camS = (f) => Math.exp(Math.log(S_END) * ease(f, T.zoom[0], T.zoom[1], E.inOutSine));
const swapAt = (c) => T.proof + T.proofStep * manhattan(c.i, c.j);
const flipStart = (c) => T.flip + T.flipStep * chebyshev(c.i, c.j);
const flipTheta = (c, f) => Math.PI * ease(f, flipStart(c), flipStart(c) + T.flipLen, E.inOutCubic);
const FLIP_END = T.flip + T.flipStep * 4 + T.flipLen; // last ring lands
const tiltAt = (f) => { const u = invlerp(T.flip, FLIP_END, f), b = Math.sin(Math.PI * u) ** 2; return [T.tilt[0] * b, T.tilt[1] * b]; };
const DEBUG3D = new URLSearchParams(location.search).get('s6force3d') != null;
const gapAt = (f) => {
  if (f < T.close[0]) return GAP;
  if (f < T.reopen[0]) return GAP * (1 - ease(f, T.close[0], T.close[1], E.inQuart));
  if (f >= T.reopen[1]) return GAP;
  return GAP * ease(f, T.reopen[0], T.reopen[1], E.punch);
};

function ensureAtlas() {
  if (!ATLAS) ATLAS = buildAtlas(ASSIGN, get);
  return ATLAS;
}

// --------------------------------------------------------------- phase 1: Tatras, dot, score, cut, proof (2D)
function drawPanel2D(ctx, f, F) {
  const s = camS(f);
  const p = cutP(f);
  const cells = panelCut(p);
  const tat = new Path2D(), pro = new Path2D();
  let nPro = 0;
  for (const c of cells) {
    const path = cellPath2D(c);
    if (F >= swapAt(c)) { pro.addPath(path); nPro++; } else tat.addPath(path);
  }
  ctx.save();
  camApply(ctx, s);
  // Tatras through the not-yet-swapped windows (one screen-space photo, ambient push about A)
  if (nPro < 60) {
    ctx.save();
    ctx.clip(tat, 'nonzero');
    const k = Math.pow(PUSH, Math.max(0, f - F0));
    camApply(ctx, k);
    windowImage(ctx, TATRAS, { mode: 'cov', box: { x: 0, y: 0, w: W, h: H } });
    ctx.restore();
  }
  // proof photos (each cell its own cover-crop, pre-rendered at zoom-1 into the atlas)
  if (nPro > 0) {
    ctx.save();
    ctx.clip(pro, 'nonzero');
    ctx.drawImage(ensureAtlas(), 0, 0, W, H);
    ctx.restore();
  }
  // score lines: drawn on the exact cut lines (they ride the gutter centres while the cut opens)
  if (F >= T.score && F < T.cut[0] + 4) drawScore(ctx, f);
  ctx.restore();
}

function drawScore(ctx, f) {
  // horizontals L→R, verticals T→B, linear, staggered from the centre cross outward
  SCORE_X.forEach((x, n) => {
    const u = clamp((f - (T.score + 0.45 * Math.abs(n - 2))) / T.scoreLen);
    if (u > 0) strokePts(ctx, [[x, -4], [x, H + 4]], { b: u, width: 3, color: '#FFFFFF', cap: 'butt' });
  });
  SCORE_Y.forEach((y, n) => {
    const u = clamp((f - (T.score + 0.3 * Math.abs(n - 4))) / T.scoreLen);
    if (u > 0) strokePts(ctx, [[-4, y], [W + 4, y]], { b: u, width: 3, color: '#FFFFFF', cap: 'butt' });
  });
}

function drawDot(ctx, f) {
  let r = 0;
  if (f >= T.dot && f < T.flip) r = 17 * ease(f, T.dot, T.dot + T.dotLen, E.punch);
  else if (f >= T.flip) r = 17 * (1 - ease(f, T.flip, T.flip + 3, E.inQuad)); // collapses as the centre 2x2 turns
  if (r > 0.3) drawCell(ctx, dot(A[0], A[1], r));
}

// --------------------------------------------------------------- phase 3: panel -> 2x2 -> mark (2D, proto_end)
const QUAD = { ring: [0, 0], tile: [1, 0], leaf: [0, 1], pin: [1, 1] };
function drawMerge(ctx, f) {
  const g = gapAt(f);
  const fin = markEnd(g);
  const pm = ease(f, T.merge[0], T.merge[1], E.inOutCubic);
  const pr = ease(f, T.radii[0], T.radii[1], E.snap);
  const panel = PANEL1.map((c) => camCell(c, S_END));
  const py0 = panel[0].y, py1 = panel[59].y + panel[59].h;
  if (pm <= 0) { drawCellsShared(ctx, panel, py0, py1); return; }
  for (const k of MARK_ORDER) {
    const [qx, qy] = QUAD[k];
    const tgt = fin[k];
    const sq = { x: tgt.x, y: tgt.y, w: tgt.w, h: tgt.h, r: [0, 0, 0, 0] };
    if (pm < 1) {
      // exact tiling of the square; internal edges overlap by 1.5 px so no hairline survives the converge
      const tiles = gridCut(sq, 3, 5, 0).map((t, n) => {
        const ti = n % 3, tj = Math.floor(n / 3), e = 1.5;
        const x0 = t.x - (ti > 0 ? e : 0), x1 = t.x + t.w + (ti < 2 ? e : 0), y0 = t.y - (tj > 0 ? e : 0), y1 = t.y + t.h + (tj < 4 ? e : 0);
        return { ...t, x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
      });
      const cells = [];
      for (let j = 0; j < 5; j++) for (let i = 0; i < 3; i++) {
        const src = panel[(qy * 5 + j) * 6 + qx * 3 + i];
        cells.push(mixCell(src, tiles[j * 3 + i], pm));
      }
      // gradient: panel-wide -> this square's own (what drawCell uses for the final mark)
      drawCellsShared(ctx, cells, lerp(py0, sq.y, pm), lerp(py1, sq.y + sq.h, pm));
    } else {
      const from = { ...sq };
      if (tgt.hole) from.hole = { x: tgt.hole.x + tgt.hole.w / 2, y: tgt.hole.y + tgt.hole.h / 2, w: 0, h: 0, r: [0, 0, 0, 0] };
      drawCell(ctx, mixCell(from, tgt, pr));
    }
  }
}

export default {
  name: 's6_solaro', f0: F0, f1: F1,
  needs: [[F0, F1, [TATRAS]]],
  blur: [[654, 667, 4], [T.zoom[0] + 6, T.flip, 5], [T.flip, FLIP_END, 12], [T.merge[0], T.merge[1], 8], [727, 730, 4], [733, 735, 4]],
  cues: [
    { f: 648, kind: 'whoosh', dur: 1.4, f0: 180, f1: 900, q: 0.7, shape: 'swell', gain: -20 },      // wind
    { f: 650, kind: 'impact', dur: 1.2, gain: -12 },                                                 // soft impact
    { f: 652, kind: 'pop', f0: 1300, f1: 420, gain: -12 },                                           // dot pop
    { f: 656, kind: 'whoosh', dur: 0.12, f0: 4000, f1: 9000, q: 3, shape: 'swell', gain: -15 },      // pencil score "shhk"
    { f: 662, kind: 'whoosh', dur: 0.16, f0: 2600, f1: 700, q: 1.4, shape: 'out', gain: -12 },       // paper cut
    { f: 662, kind: 'tick', freq: 1800, gain: -18 },
    ...Array.from({ length: 7 }, (_, d) => ({ f: T.proof + 2 * d + 2, kind: 'hat', gain: -24 + d * 0.5 })), // proof shutters
    ...Array.from({ length: 5 }, (_, k) => ({ f: Math.round(T.flip + T.flipStep * k + T.flipLen) + 2, kind: 'tick', freq: 2400 + 300 * k, gain: -13 })), // tile clicks
    { f: T.flip + 4, kind: 'shimmer', dur: 0.7, base: 1318.5, gain: -16 },                           // shimmer swell
    { f: T.merge[1] + 2, kind: 'clunk', gain: -9 },                                                  // low thunk
    { f: T.merge[1] + 2, kind: 'sub', dur: 0.4, freq: 41.2, gain: -12 },
    { f: T.close[1] + 2, kind: 'stone', freq: 2600, gain: -14 },                                     // click
    { f: 735 + 1, kind: 'tick', freq: 3600, gain: -15 },                                             // clack
  ],
  async load(o = {}) {
    scale = o.scale || 1;
    CROPS = [];
    // crops come from the registry (assets/points/s6.json -> s6crop / s6kind)
    const regAll = await (await fetch('../assets/registry.json')).json();
    for (const [key, r] of Object.entries(regAll)) {
      if (!r.s6crop) continue;
      for (const [fx, fy, z] of r.s6crop) CROPS.push({ key, fx, fy, z, kind: r.s6kind || 'house' });
    }
    ASSIGN = assignCrops(CROPS, HEROES);
    this.needs = [[F0, F1, [TATRAS]], [T.proof - 4, FLIP_END + 1, proofKeys()]];
    flip3d = new Flip3D(scale);
  },
  draw(ctx, f) {
    const F = Math.round(f);
    if (F < T.flip && !DEBUG3D) {
      drawPanel2D(ctx, f, F);
      drawDot(ctx, f);
    } else if (F < FLIP_END || (DEBUG3D && F < T.flip)) {
      if (!flip3d.tex) flip3d.setAtlas(ensureAtlas());
      flip3d.render(ctx, camS(f), (k) => flipTheta(PANEL1[k], f), tiltAt(f));
      drawDot(ctx, f);
    } else {
      drawMerge(ctx, f);
    }
  },
};
