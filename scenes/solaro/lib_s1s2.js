// Shared helpers for S1 (spark word) and S2 (fire): the orange 'a' slot, the a <-> pin morph
// geometry, the flame with ramped flicker, the offset keyline, registered/covered image drawing.
import { E, clamp, lerp, invlerp, COLORS, deg } from '../../engine/core.js';
import { cellToPath, brandGradient, cellToRings } from '../../engine/shapes.js';
import { ringsToPath, polySlice } from '../../engine/morph.js';
import { get } from '../../engine/assets.js';
import { WM } from '../../engine/logo.js';
import { A, word } from './config.js';
import { pin, flame, FLAME_S } from './spine.js';

export const ease = (f, f0, f1, fn = E.linear) => fn(clamp((f - f0) / (f1 - f0)));
export const F = (f) => Math.round(f); // integer frame for discrete events (cuts, swaps)

// ---------------------------------------------------------------- the orange 'a'
// Wordmark 'a' (logo units): bowl centre (1267.67, 268.44), bowl radius ~113.6, stem corner at
// (1382.39, 375.37) — i.e. the logo's pin cell (circle + one square corner, bottom-right).
const A_BOWL = [1267.67, 268.44], A_BOWL_R = 113.6;
export function aSlot() {
  const L = word('spark');
  const it = L.items[L.hotIndex];
  const k = it.k; // px per wordmark unit
  const cx = it.x + (A_BOWL[0] - it.wm.box.x) * k;
  const cy = L.baseline + (A_BOWL[1] - WM.baseline) * k;
  const size = 2 * A_BOWL_R * k;
  return { L, it, cx, cy, size, rings: it.rings, k };
}
// the pin cell that sits on the 'a' (rot 0: square corner bottom-right, like the a's stem foot)
export const aPin = () => { const s = aSlot(); return pin(s.size, 0, s.cx, s.cy); };

// gradient exactly like drawCell() for a (possibly rotated) square cell of edge `size` centred at cy
export function cellGrad(ctx, cy, size, rot = 0, ssy = 1) {
  const ext = (Math.abs(Math.cos(rot)) + Math.abs(Math.sin(rot))) * size / 2 * ssy;
  return brandGradient(ctx, cy - ext, cy + ext);
}
export function fillRings(ctx, rings, grad) {
  ctx.save();
  ctx.fillStyle = grad;
  ctx.fill(ringsToPath(rings), 'evenodd');
  ctx.restore();
}

// similarity transform of rings: scale k + rotation rot about (ox, oy), then move (ox,oy) -> (tx,ty)
export function simRings(rings, ox, oy, k, rot, tx, ty) {
  const c = Math.cos(rot), s = Math.sin(rot);
  return rings.map((r) => r.map(([x, y]) => {
    const dx = (x - ox) * k, dy = (y - oy) * k;
    return [tx + dx * c - dy * s, ty + dx * s + dy * c];
  }));
}
// screen-space scale (ssx, ssy) about (spx, spy), as cellPath2D applies it after rotation
export function ssRings(rings, ssx, ssy, spx, spy) {
  if (ssx === 1 && ssy === 1) return rings;
  return rings.map((r) => r.map(([x, y]) => [spx + (x - spx) * ssx, spy + (y - spy) * ssy]));
}

// ---------------------------------------------------------------- the flame
// spine.flame(f) with its flicker scaled by amp (amp = 1 is exactly the contract flame(f))
export function flameAmp(f, amp = 1, size = FLAME_S) {
  const base = flame(null, size), fl = flame(f, size);
  if (amp >= 1) return fl;
  return { ...fl, rot: lerp(base.rot, fl.rot, amp), ssx: lerp(1, fl.ssx, amp), ssy: lerp(1, fl.ssy, amp) };
}

// Parallel offset of a cell's outer contour by d (w/h + 2d, every radius + d), keeping its transform
export function offsetCell(c, d) {
  const o = { ...c, x: c.x - d, y: c.y - d, w: c.w + 2 * d, h: c.h + 2 * d, r: c.r.map((v) => v + d) };
  delete o.hole;
  return o;
}
// matrix exactly like engine/shapes.js cellPath2D
export function cellMatrix(c) {
  const px = c.px ?? c.x + c.w / 2, py = c.py ?? c.y + c.h / 2;
  const sx = c.sx ?? c.s ?? 1, sy = c.sy ?? c.s ?? 1;
  let m = new DOMMatrix().translate(px, py).rotate(((c.rot || 0) * 180) / Math.PI).scale(sx, sy).translate(-px, -py);
  if (c.ssx != null || c.ssy != null) {
    const spx = c.spx ?? c.x + c.w / 2, spy = c.spy ?? c.y + c.h / 2;
    m = new DOMMatrix().translate(spx, spy).scale(c.ssx ?? 1, c.ssy ?? 1).translate(-spx, -spy).multiply(m);
  }
  return m;
}
// closed outline polyline of a cell (outer contour) in screen space, starting at angle a0
// (radians, measured in the cell's local frame from its centre, clockwise on screen)
export function cellOutline(c, n = 360, startCorner = 'tr') {
  const local = { ...c, rot: 0, s: 1 };
  delete local.hole;
  const ring = cellToRings(local, n)[0];
  // rotate the ring start so the polyline begins at the requested corner's arc middle
  const cx = c.x + c.w / 2, cy = c.y + c.h / 2;
  const target = { tr: -Math.PI / 4, br: Math.PI / 4, bl: (3 * Math.PI) / 4, tl: (-3 * Math.PI) / 4 }[startCorner];
  let best = 0, bd = Infinity;
  ring.forEach(([x, y], i) => { const a = Math.atan2(y - cy, x - cx); const d = Math.abs(Math.atan2(Math.sin(a - target), Math.cos(a - target))); if (d < bd) { bd = d; best = i; } });
  const r = ring.slice(best).concat(ring.slice(0, best + 1));
  const m = cellMatrix(c);
  return r.map(([x, y]) => { const p = m.transformPoint({ x, y }); return [p.x, p.y]; });
}
export function strokeOpen(ctx, pts, a, b, { width = 4, color = COLORS.ink } = {}) {
  if (b - a <= 1e-4) return;
  const seg = a <= 0 && b >= 1 ? pts : polySlice(pts, a, b);
  if (seg.length < 2) return;
  ctx.save();
  ctx.lineWidth = width; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(seg[0][0], seg[0][1]);
  for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i][0], seg[i][1]);
  if (a <= 0 && b >= 1) ctx.closePath();
  ctx.stroke();
  ctx.restore();
}

// ---------------------------------------------------------------- images
// registered: image point pt (fractions) on screen point P, displayed width w, push k about P
export function drawReg(ctx, key, pt, P, w, k = 1) {
  const im = get(key);
  const ww = w * k, hh = (ww * im.height) / im.width;
  ctx.drawImage(im, P[0] - pt[0] * ww, P[1] - pt[1] * hh, ww, hh);
}
// cover placement of an image into box (like window.js cov), returns the image rect before push
export function covRect(key, box, focus = [0.5, 0.5], zoom = 1) {
  const im = get(key);
  const s = Math.max(box.w / im.width, box.h / im.height) * zoom;
  const dw = im.width * s, dh = im.height * s;
  let dx = box.x + box.w / 2 - focus[0] * dw, dy = box.y + box.h / 2 - focus[1] * dh;
  dx = clamp(dx, box.x + box.w - dw, box.x);
  dy = clamp(dy, box.y + box.h - dh, box.y);
  return { x: dx, y: dy, w: dw, h: dh, s };
}
// draw the covered image with a push k about (pcx, pcy); returns a mapper image-fraction -> screen
export function drawCov(ctx, key, box, { focus, zoom = 1, k = 1, pc = null } = {}) {
  const im = get(key);
  const R = covRect(key, box, focus, zoom);
  const [pcx, pcy] = pc || [box.x + box.w / 2, box.y + box.h / 2];
  const x = pcx + (R.x - pcx) * k, y = pcy + (R.y - pcy) * k, w = R.w * k, h = R.h * k;
  ctx.drawImage(im, x, y, w, h);
  return { map: (fx, fy) => [x + fx * w, y + fy * h], scale: w / im.width };
}

export { A, pin, flame, FLAME_S, cellToPath, deg, invlerp };

// explicit placement {key, pt, at, s}: image point pt lands on screen point at, scale s, push k about at
export function drawPlaced(ctx, shot, k = 1) {
  const im = get(shot.key);
  const w = im.width * shot.s * k, h = im.height * shot.s * k;
  const x = shot.at[0] - shot.pt[0] * w, y = shot.at[1] - shot.pt[1] * h;
  ctx.drawImage(im, x, y, w, h);
  return { map: (fx, fy) => [x + fx * w, y + fy * h], w, h, x, y };
}
