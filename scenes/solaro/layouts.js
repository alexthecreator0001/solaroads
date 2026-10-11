// Layout families built from the Solaro mark's own grid (cell : gap = 5 : 1, big round corners face A).
import { markCells, cellPath2D, gridCut, GAP, CELL } from '../../engine/shapes.js';
import { A } from './config.js';

// M2: the mark as a 2x2 window grid centred on A (C = 420 px, G = 84 px)
export const M2_SCALE = 420 / CELL;                 // 2.058
export const m2 = (g = GAP, spread = 0, s = M2_SCALE) => markCells(A[0], A[1], s, g, spread);

// M2F: full-bleed mark grid, cells reach the frame edges (C = 490.9, G = 98.2)
export const M2F_SCALE = 1080 / (2 * CELL + GAP);   // 2.4053
export const m2f = (g = GAP, spread = 0) => markCells(A[0], A[1], M2F_SCALE, g, spread);

// Holes closed versions (windows show images through the whole cell)
export const noHoles = (cells) => Object.fromEntries(Object.entries(cells).map(([k, c]) => [k, { ...c, hole: c.hole ? { ...c.hole, x: c.hole.x + c.hole.w / 2, y: c.hole.y + c.hole.h / 2, w: 0, h: 0 } : undefined }]));

// SPLIT: two giant quarter-round windows (top = tile, bottom = leaf), big corner facing A
export const SPLIT = {
  top: { x: 324, y: -84, w: 840, h: 840, r: [0, 97.8, 0, 420] },
  bottom: { x: -84, y: 1240, w: 840, h: 840, r: [0, 420, 0, 97.8] },
};

// DW: disc window centred on A
export const discPath = (r, cx = A[0], cy = A[1]) => { const p = new Path2D(); p.arc(cx, cy, r, 0, Math.PI * 2); return p; };

// PANEL: 6x10 Solaro grid over the full frame (cell : gap = 5 : 1, radius = 0.116 cell)
export const PANEL_FRAME = { x: 0, y: 29.7, w: 1080, h: 1820.6 };
export const panel = (p, opts = {}) => gridCut(PANEL_FRAME, 6, 10, p, { gap: 30.9, rad: 17.9, ...opts });

export { cellPath2D };
