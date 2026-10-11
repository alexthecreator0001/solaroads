// Prototype of the orange "spine": mark -> spark -> flame -> bulb -> sun -> panel grid -> mark.
// Each state is a set of Solaro cells; transitions are exact cell interpolations.
import { W, H, E, ease, lerp, clamp, COLORS, deg } from '../engine/core.js';
import { MARK, MARK_ORDER, placeCell, mixCell, drawCell, circle } from '../engine/shapes.js';

const CX = W / 2, CY = H / 2;
const R = 102.046, r = 48.92;
const markAt = (s, cx = CX, cy = CY) => MARK_ORDER.map((k) => placeCell(MARK[k], cx - 224.5 * s, cy - 224.5 * s, s));
const dotCell = (rad, rot = 0, cx = CX, cy = CY) => ({ ...circle(cx, cy, rad), rot, hole: { x: cx, y: cy, w: 0, h: 0, r: [0, 0, 0, 0] } });
// pin = teardrop with hole; size = cell edge in px. rot: -135deg -> tip up (flame), +45deg -> tip down (bulb)
function pinCell(size, rot, cx = CX, cy = CY, tip = 0.0) {
  const k = size / 204.092;
  const c = { x: cx - size / 2, y: cy - size / 2, w: size, h: size, r: [R * k, R * k, tip * k, R * k], rot };
  const hs = 97.84 * k, hx = cx - size / 2 + (298.033 - 244.908) * k, hy = cy - size / 2 + (298.021 - 244.896) * k;
  c.hole = { x: hx, y: hy, w: hs, h: hs, r: [r * k, r * k, 0, r * k] };
  return c;
}
const ringAt = (size, cx = CX, cy = CY) => placeCell(MARK.ring, cx - size / 2, cy - size / 2, size / 204.092);
const square = (cx, cy, s, rad = 0) => ({ x: cx - s / 2, y: cy - s / 2, w: s, h: s, r: [rad, rad, rad, rad] });

function gridCells(cols, rows, cw, gap, cx = CX, cy = CY, rad = 4) {
  const out = [], Wt = cols * cw + (cols - 1) * gap, Ht = rows * cw + (rows - 1) * gap;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) out.push(square(cx - Wt / 2 + cw / 2 + i * (cw + gap), cy - Ht / 2 + cw / 2 + j * (cw + gap), cw, rad));
  return out;
}

export default {
  duration: 9,
  samples: () => 1,
  draw(ctx, t) {
    const f = t * 60;
    let cells = [];
    if (f < 40) {
      // mark collapses into one spark dot
      const m = markAt(0.8);
      cells = m.map((c, i) => mixCell(c, dotCell(18), ease(f, 8 + i * 2, 30 + i * 2, E.whip)));
    } else if (f < 110) {
      // spark -> flame (pin, tip up) with flicker
      const p = ease(f, 60, 84, E.snap);
      const flick = Math.sin(f * 0.9) * 0.5 + Math.sin(f * 2.3) * 0.3;
      const fl = pinCell(260 + flick * 6, deg(-135) + deg(flick * 2.5));
      fl.s = 1;
      cells = [mixCell(dotCell(18, deg(-135)), fl, p)];
    } else if (f < 180) {
      // flame -> bulb (rotate 180) + base
      const p = ease(f, 120, 150, E.swift);
      const fl = pinCell(260, deg(-135));
      const bulb = pinCell(300, deg(45), CX, CY - 60);
      const c = mixCell(fl, bulb, p);
      cells = [c];
      const bp = ease(f, 140, 165, E.snap);
      for (let i = 0; i < 3; i++) {
        const w = 120 - i * 14, y = CY - 60 + 212 * 0.94 + 26 + i * 34;
        cells.push(mixCell({ ...square(CX, y, 0, 0) }, { x: CX - w / 2, y: y - 12, w, h: 24, r: [12, 12, 12, 12] }, ease(f, 140 + i * 3, 160 + i * 3, E.punch)));
      }
    } else if (f < 260) {
      // bulb -> sun ring
      const p = ease(f, 190, 220, E.swift);
      const bulb = pinCell(300, deg(45), CX, CY - 60);
      cells = [mixCell(bulb, { ...ringAt(420), rot: deg(45) }, p)];
      const bp = 1 - ease(f, 186, 200, E.inCubic);
      for (let i = 0; i < 3; i++) {
        const w = (120 - i * 14) * bp, y = CY - 60 + 212 * 0.94 + 26 + i * 34;
        if (bp > 0) cells.push({ x: CX - w / 2, y: y - 12 * bp, w, h: 24 * bp, r: [12, 12, 12, 12] });
      }
    } else if (f < 420) {
      // sun ring -> square tile -> grid -> panel
      const ring = ringAt(420);
      const p1 = ease(f, 270, 296, E.swift);
      const tile = { ...square(CX, CY, 420, 0), hole: { x: CX, y: CY, w: 0, h: 0, r: [0, 0, 0, 0] } };
      if (f < 300) cells = [mixCell(ring, tile, p1)];
      else {
        const g2 = gridCells(2, 2, 204, 12);
        const g6 = gridCells(6, 10, 120, 10, CX, CY, 6);
        const p2 = ease(f, 300, 318, E.snap);
        const p3 = ease(f, 330, 360, E.swift);
        if (f < 330) cells = g2.map((c) => mixCell(square(CX, CY, 420, 0), c, p2));
        else cells = g6.map((c, i) => mixCell(g2[(c.y + c.h / 2 > CY ? 2 : 0) + (c.x + c.w / 2 > CX ? 1 : 0)], c, ease(f, 330 + (i % 6 + Math.floor(i / 6)) * 0.8, 352 + (i % 6 + Math.floor(i / 6)) * 0.8, E.swift)));
        // panel -> mark
        if (f >= 372) {
          const m = markAt(1.0);
          const p4 = ease(f, 372, 400, E.swift);
          const g = gridCells(6, 10, 120, 10, CX, CY, 6);
          cells = g.map((c, i) => {
            const q = (c.y + c.h / 2 > CY ? 2 : 0) + (c.x + c.w / 2 > CX ? 1 : 0);
            return mixCell(c, m[q], p4);
          });
        }
      }
    } else {
      cells = markAt(1.0);
    }
    for (const c of cells) drawCell(ctx, c);
  },
};
