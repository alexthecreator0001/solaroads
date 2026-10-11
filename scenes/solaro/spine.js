// The orange element's canonical states (all Solaro cells) and the hand-off contracts between
// sections. A section may animate freely inside its range but must START and END exactly on the
// contract states below, so the cut between two sections is invisible.
import { circle, ringCell, MARK, cellToRings, drawCell, brandGradient, markCells, GAP } from '../../engine/shapes.js';
import { ringsToPath } from '../../engine/morph.js';
import { deg, COLORS } from '../../engine/core.js';
import { A } from './config.js';

export const DOT_R = 17;
export const FLAME_S = 260;  // pin cell edge for the flame
export const BULB_S = 260;   // pin cell edge for the bulb
export const SUN_R = 210;    // outer radius of the sun ring (= M2 ring), hole ratio 0.479 like the logo

export const dot = (cx = A[0], cy = A[1], r = DOT_R) => ({ ...circle(cx, cy, r), hole: { x: cx, y: cy, w: 0, h: 0, r: [0, 0, 0, 0] } });

// pin = teardrop with teardrop hole (logo's bottom-right shape) of edge `size`, centred on (cx, cy)
export function pin(size, rot, cx = A[0], cy = A[1]) {
  const k = size / 204.092, R = 102.046 * k, r = 48.92 * k;
  const c = { x: cx - size / 2, y: cy - size / 2, w: size, h: size, r: [R, R, 28.237 * k, R], rot };
  const off = (298.033 - 244.908) * k;
  c.hole = { x: cx - size / 2 + off, y: cy - size / 2 + off, w: 97.843 * k, h: 97.844 * k, r: [r, r, 0, r] };
  return c;
}

// FLAME: pin rotated -135° (square corner up). flick(f) adds the living flicker (scale y about the base).
export function flame(f = null, size = FLAME_S, cx = A[0], cy = A[1]) {
  const c = pin(size, deg(-135), cx, cy);
  if (f != null) {
    // flicker: rotation wobble about the centre (stays on A) + screen-vertical stretch about the base
    c.rot += deg(2.5 * Math.sin(0.7 * f));
    c.ssy = 1 + 0.035 * (0.6 * Math.sin(0.9 * f) + 0.4 * Math.sin(2.3 * f));
    c.ssx = 1 - 0.015 * Math.sin(1.7 * f + 1);
    c.spx = cx; c.spy = cy + size * 0.5; // the flame's base (bottom of the round end)
  }
  return c;
}
// BULB: the same pin rotated +45° (corner down) + 3 base capsules
export const bulb = (size = BULB_S, cx = A[0], cy = A[1]) => pin(size, deg(45), cx, cy);
export function bulbBase(size = BULB_S, cx = A[0], cy = A[1], p = 1) {
  // tip of the rotated pin is at cy + size*0.5*sqrt2*(something); place capsules under the glass
  const k = size / 260, out = [];
  const y0 = cy + 191.5 * k - 60 * k; // first capsule centre (matches B-editorial: 1131.5 at size 260)
  for (let i = 0; i < 3; i++) {
    const w = (104 - 12 * i) * k * p, h = 21 * k * p;
    if (w > 0.5) out.push({ x: cx - w / 2, y: y0 + i * 30 * k - h / 2, w, h, r: [h / 2, h / 2, h / 2, h / 2] });
  }
  return out;
}
// SUN: the mark's ring at M2 scale (outer r 210, hole r 100.6)
export const sun = (r = SUN_R, cx = A[0], cy = A[1]) => ringCell(cx, cy, r, r * (48.921 / 102.046));

// END-OF-S6 contract: the mark centred on A at scale 1.05 with the logo gap
export const MARK_END_SCALE = 1.05;
export const markEnd = (g = GAP) => markCells(A[0], A[1], MARK_END_SCALE, g);

// draw orange rings (e.g. an orange letter) with the brand gradient over their own bbox
export function fillOrangeRings(ctx, rings, alpha = 1) {
  let y0 = Infinity, y1 = -Infinity;
  for (const r of rings) for (const p of r) { if (p[1] < y0) y0 = p[1]; if (p[1] > y1) y1 = p[1]; }
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = brandGradient(ctx, y0, y1);
  ctx.fill(ringsToPath(rings), 'evenodd');
  ctx.restore();
}

export { cellToRings, drawCell };

/* HAND-OFF CONTRACTS (frame = first frame owned by the next section)
   f72   S0->S1  orange DOT r17 at A.
   f138  S1->S2  the orange hot letter of copy('spark') (wordmark 'a') at its word position, full size,
                 other letters already gone. S2 morphs it to the FLAME at A.
   f222  S2->S3  FLAME (flame(f)) at A, flickering. S3 morphs it to the orange 'l' of copy('bolt').
   f344  S3->S4  orange DOT r17 at A, white frame.
   f480  S4->S5  BULB (bulb()) at A + bulbBase(), white frame (paint/registration marks allowed).
   f648  S5->S6  full-bleed Tatras roof photo (cover, static), no orange on screen (S6 pops the dot at f650).
   f736  S6->S7  markEnd() (mark centred on A, scale 1.05, logo gap), no inner shadow yet.
*/
