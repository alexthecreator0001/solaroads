// The Solaro shape language.
// Every shape of the Solaro mark is a 204-unit "cell": a rounded rectangle with
// independent corner radii (0, ~24 or 102 = full quarter circle) and an optional hole
// that is itself a cell. Morphing between any two cells is an exact interpolation of
// x, y, w, h, the four radii and the hole — no polygon approximation, no artefacts.
import { lerp, COLORS, clamp } from './core.js';

// Mark geometry, measured from assets/solaro-mark.svg (449 x 449 units)
export const MARK_SIZE = 449;
const R = 102.046, r = 48.92;
export const MARK = {
  ring: { x: 0.023, y: 0, w: 204.092, h: 204.092, r: [R, R, R, R], hole: { x: 53.148, y: 53.125, w: 97.843, h: 97.843, r: [r, r, r, r] } },
  tile: { x: 244.836, y: 0.0127, w: 204.092, h: 204.092, r: [0, 23.753, 0, R] },
  leaf: { x: 0, y: 244.905, w: 204.092, h: 204.094, r: [0, R, 0, 23.753] },
  pin: { x: 244.908, y: 244.896, w: 204.092, h: 204.094, r: [R, R, 28.237, R], hole: { x: 298.033, y: 298.021, w: 97.843, h: 97.844, r: [r, r, 0, r] } },
};
export const MARK_ORDER = ['ring', 'tile', 'leaf', 'pin'];

// Append a cell outline to a Path2D (or ctx). radii: [tl, tr, br, bl]. Clockwise.
export function cellPath(p, x, y, w, h, rad, ccw = false) {
  const m = Math.min(Math.abs(w), Math.abs(h)) / 2;
  const [tl, tr, br, bl] = rad.map((v) => clamp(v, 0, m));
  if (w <= 0.001 || h <= 0.001) return;
  if (!ccw) {
    p.moveTo(x + tl, y);
    p.lineTo(x + w - tr, y);
    if (tr > 0) p.arc(x + w - tr, y + tr, tr, -Math.PI / 2, 0);
    p.lineTo(x + w, y + h - br);
    if (br > 0) p.arc(x + w - br, y + h - br, br, 0, Math.PI / 2);
    p.lineTo(x + bl, y + h);
    if (bl > 0) p.arc(x + bl, y + h - bl, bl, Math.PI / 2, Math.PI);
    p.lineTo(x, y + tl);
    if (tl > 0) p.arc(x + tl, y + tl, tl, Math.PI, Math.PI * 1.5);
  } else {
    p.moveTo(x + tl, y);
    if (tl > 0) p.arc(x + tl, y + tl, tl, Math.PI * 1.5, Math.PI, true);
    p.lineTo(x, y + h - bl);
    if (bl > 0) p.arc(x + bl, y + h - bl, bl, Math.PI, Math.PI / 2, true);
    p.lineTo(x + w - br, y + h);
    if (br > 0) p.arc(x + w - br, y + h - br, br, Math.PI / 2, 0, true);
    p.lineTo(x + w, y + tr);
    if (tr > 0) p.arc(x + w - tr, y + tr, tr, 0, -Math.PI / 2, true);
  }
  p.closePath();
}

// A cell spec: {x,y,w,h,r:[4], hole?:{x,y,w,h,r}, rot?: radians about centre, s?: scale about centre}
export function cellToPath(c) {
  const local = new Path2D();
  cellPath(local, c.x, c.y, c.w, c.h, c.r);
  if (c.hole && c.hole.w > 0.01 && c.hole.h > 0.01) cellPath(local, c.hole.x, c.hole.y, c.hole.w, c.hole.h, c.hole.r, true);
  return local;
}

const holeAtCentre = (c) => ({ x: c.x + c.w / 2, y: c.y + c.h / 2, w: 0, h: 0, r: [0, 0, 0, 0] });
const lerpArr = (a, b, t) => a.map((v, i) => lerp(v, b[i], t));

// Interpolate two cells exactly. A missing hole grows from / shrinks to its centre point.
export function mixCell(a, b, t) {
  const out = {
    x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t), w: lerp(a.w, b.w, t), h: lerp(a.h, b.h, t),
    r: lerpArr(a.r, b.r, t),
    rot: lerp(a.rot || 0, b.rot || 0, t),
  };
  for (const k of ['s', 'sx', 'sy']) if (a[k] != null || b[k] != null) out[k] = lerp(a[k] ?? a.s ?? 1, b[k] ?? b.s ?? 1, t);
  for (const k of ['ssx', 'ssy']) if (a[k] != null || b[k] != null) out[k] = lerp(a[k] ?? 1, b[k] ?? 1, t);
  if (a.spx != null || b.spx != null) { out.spx = lerp(a.spx ?? a.x + a.w / 2, b.spx ?? b.x + b.w / 2, t); out.spy = lerp(a.spy ?? a.y + a.h / 2, b.spy ?? b.y + b.h / 2, t); }
  if (a.hole || b.hole) {
    const ha = a.hole || holeAtCentre(b.hole ? { ...b.hole } : a);
    const hb = b.hole || holeAtCentre(a.hole ? { ...a.hole } : b);
    // when only one side has a hole, collapse it towards its own centre (relative to the moving cell)
    const ra = a.hole ? ha : { ...ha, x: a.x + (hb.x + hb.w / 2 - b.x) * (a.w / b.w), y: a.y + (hb.y + hb.h / 2 - b.y) * (a.h / b.h) };
    const rb = b.hole ? hb : { ...hb, x: b.x + (ha.x + ha.w / 2 - a.x) * (b.w / a.w), y: b.y + (ha.y + ha.h / 2 - a.y) * (b.h / a.h) };
    out.hole = { x: lerp(ra.x, rb.x, t), y: lerp(ra.y, rb.y, t), w: lerp(ra.w, rb.w, t), h: lerp(ra.h, rb.h, t), r: lerpArr(ra.r, rb.r, t) };
  }
  return out;
}

// Scale/translate a cell spec (used to place mark cells in screen space)
export function placeCell(c, ox, oy, s) {
  const o = { x: ox + c.x * s, y: oy + c.y * s, w: c.w * s, h: c.h * s, r: c.r.map((v) => v * s), rot: c.rot || 0 };
  if (c.hole) o.hole = { x: ox + c.hole.x * s, y: oy + c.hole.y * s, w: c.hole.w * s, h: c.hole.h * s, r: c.hole.r.map((v) => v * s) };
  return o;
}

// Simple cell factories (centre-based), handy for building scenes
export const circle = (cx, cy, rad) => ({ x: cx - rad, y: cy - rad, w: rad * 2, h: rad * 2, r: [rad, rad, rad, rad] });
export const ringCell = (cx, cy, ro, ri) => ({ ...circle(cx, cy, ro), hole: circle(cx, cy, ri) });
export const rectCell = (cx, cy, w, h, rad = [0, 0, 0, 0]) => ({ x: cx - w / 2, y: cy - h / 2, w, h, r: rad });

// The orange gradient used by the brand (vertical, screen space over the given bbox)
export function brandGradient(ctx, y0, y1, top = COLORS.orangeTop, bottom = COLORS.orange) {
  const g = ctx.createLinearGradient(0, y0, 0, y1);
  g.addColorStop(0, top);
  g.addColorStop(1, bottom);
  return g;
}

// Screen-space Path2D of a cell including rotation (rot), uniform scale (s) or non-uniform
// scale (sx, sy) about a pivot (px, py; default = cell centre).
export function cellPath2D(c) {
  const local = cellToPath(c);
  const px = c.px ?? c.x + c.w / 2, py = c.py ?? c.y + c.h / 2;
  const sx = c.sx ?? c.s ?? 1, sy = c.sy ?? c.s ?? 1;
  let m = new DOMMatrix().translate(px, py).rotate(((c.rot || 0) * 180) / Math.PI).scale(sx, sy).translate(-px, -py);
  // optional screen-space scale (ssx, ssy) about a screen pivot (spx, spy), applied after rotation
  if (c.ssx != null || c.ssy != null) {
    const spx = c.spx ?? c.x + c.w / 2, spy = c.spy ?? c.y + c.h / 2;
    m = new DOMMatrix().translate(spx, spy).scale(c.ssx ?? 1, c.ssy ?? 1).translate(-spx, -spy).multiply(m);
  }
  const p = new Path2D();
  p.addPath(local, m);
  return p;
}

// Fill a cell in screen space with brand gradient (+ optional subtle inner shadow like the logo file)
export function drawCell(ctx, c, { fill, alpha = 1, innerShadow = 0, scale = 1 } = {}) {
  const p = cellPath2D(c);
  const cy = c.y + c.h / 2;
  const sy = c.sy ?? c.s ?? 1, sx = c.sx ?? c.s ?? 1;
  // extent of the rotated cell for the gradient span
  const ext = Math.abs((c.h / 2) * sy * Math.cos(c.rot || 0)) + Math.abs((c.w / 2) * sx * Math.sin(c.rot || 0));
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = fill || brandGradient(ctx, cy - ext, cy + ext);
  ctx.fill(p, 'evenodd');
  if (innerShadow > 0) innerShadowPath(ctx, p, innerShadow, scale);
  ctx.restore();
  return p;
}

// Inner shadow (matches the feOffset dy~1.4 / blur ~4 / 25% black filters of the logo)
export function innerShadowPath(ctx, p, strength = 1, scale = 1) {
  const t = ctx.getTransform();
  const k = Math.hypot(t.a, t.b) * scale; // device px per unit
  ctx.save();
  ctx.clip(p, 'evenodd');
  const big = new Path2D();
  big.rect(-1e4, -1e4, 3e4, 3e4);
  big.addPath(p);
  ctx.shadowColor = `rgba(0,0,0,${0.25 * strength})`;
  ctx.shadowBlur = 8.3 * k;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 1.4 * k;
  ctx.fillStyle = '#000';
  ctx.fill(big, 'evenodd');
  ctx.restore();
}

// Draw the full mark at (ox, oy) with mark-unit scale s
export function drawMark(ctx, ox, oy, s, { alpha = 1, innerShadow = 1 } = {}) {
  for (const k of MARK_ORDER) drawCell(ctx, placeCell(MARK[k], ox, oy, s), { alpha, innerShadow, scale: s });
}

// Cut a parent rect into a cols x rows grid. p=0: children tile the parent exactly (no gaps,
// square corners) so the cut is invisible; p=1: children separated by `gap` with corner radius `rad`,
// optionally inside a different target box {x,y,w,h}.
export function gridCut(parent, cols, rows, p, { gap = 8, rad = 4, target = null, order = null } = {}) {
  const T = target || parent;
  const out = [];
  const cw0 = parent.w / cols, ch0 = parent.h / rows;
  const cw1 = (T.w - gap * (cols - 1)) / cols, ch1 = (T.h - gap * (rows - 1)) / rows;
  for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
    const k = j * cols + i;
    const q = typeof p === 'function' ? p(i, j, k) : p;
    const a = { x: parent.x + i * cw0, y: parent.y + j * ch0, w: cw0, h: ch0, r: [0, 0, 0, 0] };
    const b = { x: T.x + i * (cw1 + gap), y: T.y + j * (ch1 + gap), w: cw1, h: ch1, r: [rad, rad, rad, rad] };
    out.push(Object.assign(mixCell(a, b, q), { i, j, k }));
  }
  return out;
}

// Draw many cells with ONE shared screen-space gradient (so a cut/merge never pops)
export function drawCellsShared(ctx, cells, y0, y1, { alpha = 1, fill = null } = {}) {
  const g = fill || brandGradient(ctx, y0, y1);
  for (const c of cells) drawCell(ctx, c, { fill: g, alpha });
}

// The concave 4-point "spark" star (✦) that appears in the negative space of the mark when the
// gap between its cells closes: bounded by four quarter-circle arcs of radius R centred on the
// diagonal neighbours (cx±R, cy±R). Points at (cx, cy±R), (cx±R, cy). rot rotates about the centre.
export function sparkPath(cx, cy, R, rot = 0, pinch = 1) {
  const p = new Path2D();
  // pinch < 1 pulls the arc centres in (fatter star), > 1 pushes out (thinner)
  const k = R * pinch;
  const pts = [[0, -R], [R, 0], [0, R], [-R, 0]];
  const ctrs = [[k, -k], [k, k], [-k, k], [-k, -k]];
  const c = Math.cos(rot), s = Math.sin(rot);
  const tr = ([x, y]) => [cx + x * c - y * s, cy + x * s + y * c];
  const [x0, y0] = tr(pts[0]);
  p.moveTo(x0, y0);
  for (let i = 0; i < 4; i++) {
    const a = pts[i], b = pts[(i + 1) % 4], o = ctrs[i];
    // arc around o from a to b (concave toward centre)
    const r = Math.hypot(a[0] - o[0], a[1] - o[1]);
    const a0 = Math.atan2(a[1] - o[1], a[0] - o[0]) + rot, a1 = Math.atan2(b[1] - o[1], b[0] - o[0]) + rot;
    const [ox, oy] = tr(o);
    p.arc(ox, oy, r, a0, a1, true);
  }
  p.closePath();
  return p;
}

// The mark rebuilt around a centre with a variable gap g (mark units; 40.816 = the real logo).
// g = 0 closes the cells together and reveals the ✦ spark in the negative space.
export const CELL = 204.092, GAP = 40.816;
export function markCells(cx, cy, s, g = GAP, spread = 0) {
  const half = (CELL + g) / 2; // offset of each cell centre from the mark centre
  const out = {};
  const quad = { ring: [-1, -1], tile: [1, -1], leaf: [-1, 1], pin: [1, 1] };
  for (const k of MARK_ORDER) {
    const m = MARK[k], [qx, qy] = quad[k];
    const ccx = cx + (qx * half + qx * spread) * s, ccy = cy + (qy * half + qy * spread) * s;
    const c = { x: ccx - (CELL / 2) * s, y: ccy - (CELL / 2) * s, w: CELL * s, h: CELL * s, r: m.r.map((v) => v * s) };
    if (m.hole) {
      const hx = (m.hole.x - m.x - CELL / 2) * s, hy = (m.hole.y - m.y - CELL / 2) * s;
      c.hole = { x: ccx + hx, y: ccy + hy, w: m.hole.w * s, h: m.hole.h * s, r: m.hole.r.map((v) => v * s) };
    }
    out[k] = c;
  }
  return out;
}

// Sample a cell (incl. rotation/scale about its centre) into polygon rings, so cells can be
// morphed against glyph outlines with morph.makeMorph. Outer ring clockwise, hole ring after it.
export function cellToRings(c, n = 160) {
  const ring = (x, y, w, h, rad) => {
    const m = Math.min(w, h) / 2;
    const [tl, tr, br, bl] = rad.map((v) => Math.max(0, Math.min(v, m)));
    const pts = [];
    const arc = (ax, ay, r, a0, a1, k) => { for (let i = 0; i <= k; i++) { const a = a0 + ((a1 - a0) * i) / k; pts.push([ax + r * Math.cos(a), ay + r * Math.sin(a)]); } };
    const k = Math.max(4, Math.round(n / 8));
    arc(x + w - tr, y + tr, tr, -Math.PI / 2, 0, k);
    arc(x + w - br, y + h - br, br, 0, Math.PI / 2, k);
    arc(x + bl, y + h - bl, bl, Math.PI / 2, Math.PI, k);
    arc(x + tl, y + tl, tl, Math.PI, Math.PI * 1.5, k);
    return pts;
  };
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2, rot = c.rot || 0, s = c.s ?? 1;
  const co = Math.cos(rot), si = Math.sin(rot);
  const tf = (r) => r.map(([x, y]) => { const dx = (x - cx) * s, dy = (y - cy) * s; return [cx + dx * co - dy * si, cy + dx * si + dy * co]; });
  const out = [tf(ring(c.x, c.y, c.w, c.h, c.r))];
  if (c.hole && c.hole.w > 0.5 && c.hole.h > 0.5) out.push(tf(ring(c.hole.x, c.hole.y, c.hole.w, c.hole.h, c.hole.r)));
  return out;
}
