// Drawing helpers: images (cover/fit, masked by Solaro cells), strokes with draw-on,
// arcs/zigzags as polylines, dots, camera transforms, text rendering.
import { lerp, clamp, COLORS, rng, TAU } from './core.js';
import { polySlice } from './morph.js';

// ---------------------------------------------------------------- images
const images = new Map();
export async function loadImages(map) {
  await Promise.all(Object.entries(map).map(async ([k, url]) => {
    const blob = await (await fetch(url)).blob();
    images.set(k, await createImageBitmap(blob));
  }));
}
export const img = (k) => {
  const i = images.get(k);
  if (!i) throw new Error(`image not loaded: ${k}`);
  return i;
};

// Draw image centred at (cx, cy) with given height (or width if h is null)
export function drawFit(ctx, k, cx, cy, h, { w = null, alpha = 1, rot = 0, blend = null, flip = false } = {}) {
  const im = img(k);
  const hh = h ?? (w * im.height) / im.width;
  const ww = w ?? (h * im.width) / im.height;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (blend) ctx.globalCompositeOperation = blend;
  ctx.translate(cx, cy);
  if (rot) ctx.rotate(rot);
  if (flip) ctx.scale(-1, 1);
  ctx.drawImage(im, -ww / 2, -hh / 2, ww, hh);
  ctx.restore();
  return { x: cx - ww / 2, y: cy - hh / 2, w: ww, h: hh };
}

// Fill a clip path (Path2D, in current space) with an image using object-fit: cover.
// focus: [fx, fy] in image fraction that should sit at the box centre; zoom >= 1 pushes in.
export function drawCover(ctx, k, box, { clip = null, focus = [0.5, 0.5], zoom = 1, alpha = 1, blend = null, rule = 'evenodd' } = {}) {
  const im = img(k);
  const s = Math.max(box.w / im.width, box.h / im.height) * zoom;
  const dw = im.width * s, dh = im.height * s;
  let dx = box.x + box.w / 2 - focus[0] * dw, dy = box.y + box.h / 2 - focus[1] * dh;
  // keep the image covering the box
  dx = clamp(dx, box.x + box.w - dw, box.x);
  dy = clamp(dy, box.y + box.h - dh, box.y);
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (blend) ctx.globalCompositeOperation = blend;
  if (clip) ctx.clip(clip, rule);
  else { const p = new Path2D(); p.rect(box.x, box.y, box.w, box.h); ctx.clip(p); }
  ctx.drawImage(im, dx, dy, dw, dh);
  ctx.restore();
}

// ---------------------------------------------------------------- polylines
export function arcPts(cx, cy, r, a0, a1, n = 96, ry = r) {
  const out = [];
  for (let i = 0; i <= n; i++) { const a = lerp(a0, a1, i / n); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * ry]); }
  return out;
}
export function linePts(x0, y0, x1, y1, n = 2) {
  const out = [];
  for (let i = 0; i < n; i++) out.push([lerp(x0, x1, i / (n - 1)), lerp(y0, y1, i / (n - 1))]);
  return out;
}
export function spiralPts(cx, cy, r0, r1, turns, a0 = 0, n = 400) {
  const out = [];
  for (let i = 0; i <= n; i++) { const t = i / n, a = a0 + t * turns * TAU, r = lerp(r0, r1, t); out.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]); }
  return out;
}
// lightning: jagged path between two points with seeded branches
export function boltPts(x0, y0, x1, y1, { seed = 3, segs = 9, jitter = 0.22 } = {}) {
  const R = rng(seed), L = Math.hypot(x1 - x0, y1 - y0), nx = -(y1 - y0) / L, ny = (x1 - x0) / L;
  const out = [[x0, y0]];
  for (let i = 1; i < segs; i++) {
    const t = i / segs, off = (R() - 0.5) * 2 * jitter * L / segs * 2.2;
    out.push([lerp(x0, x1, t) + nx * off, lerp(y0, y1, t) + ny * off]);
  }
  out.push([x1, y1]);
  return out;
}

export function strokePts(ctx, pts, { a = 0, b = 1, width = 6, color = COLORS.ink, cap = 'round', join = 'round', alpha = 1 } = {}) {
  if (b <= a || pts.length < 2) return;
  const seg = a <= 0 && b >= 1 ? pts : polySlice(pts, a, b);
  if (seg.length < 2) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.lineWidth = width;
  ctx.lineCap = cap;
  ctx.lineJoin = join;
  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(seg[0][0], seg[0][1]);
  for (let i = 1; i < seg.length; i++) ctx.lineTo(seg[i][0], seg[i][1]);
  ctx.stroke();
  ctx.restore();
}

export function dot(ctx, x, y, r, color = COLORS.orange, alpha = 1) {
  if (r <= 0) return;
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, TAU);
  ctx.fill();
  ctx.restore();
}

// ---------------------------------------------------------------- camera
// zoom about focal point (fx, fy) in screen space; s = scale; (tx, ty) extra translation
export function camera(ctx, { s = 1, fx = 540, fy = 960, tx = 0, ty = 0, rot = 0 } = {}, fn) {
  ctx.save();
  ctx.translate(fx + tx, fy + ty);
  if (rot) ctx.rotate(rot);
  ctx.scale(s, s);
  ctx.translate(-fx, -fy);
  fn();
  ctx.restore();
}

// ---------------------------------------------------------------- text
// draw a layout() result; per(i, item) may return {dx, dy, s, alpha, color, rot}
export function drawWord(ctx, lay, { color = COLORS.ink, per = null, alpha = 1 } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  lay.items.forEach((it, i) => {
    const o = per ? per(i, it) || {} : {};
    if (o.hide) return;
    const p = it.path2d || new Path2D(it.d);
    ctx.save();
    ctx.globalAlpha *= o.alpha ?? 1;
    const cx = it.box.cx, cy = lay.y - lay.xHeight / 2;
    ctx.translate((o.dx || 0) + cx, (o.dy || 0) + cy);
    if (o.rot) ctx.rotate(o.rot);
    if (o.s != null) ctx.scale(o.s, o.sy ?? o.s);
    ctx.translate(-cx, -cy);
    ctx.fillStyle = o.color || color;
    ctx.fill(p);
    ctx.restore();
  });
  ctx.restore();
}

// ---------------------------------------------------------------- tapered "painted" strokes
// width(u) gives the stroke width at normalised arc position u in [0,1] of the visible part
export function taperStroke(ctx, pts, { a = 0, b = 1, width = 10, profile = (u) => Math.sin(Math.PI * Math.min(1, Math.max(0, u))) ** 0.35, color = COLORS.orange, alpha = 1, n = 80 } = {}) {
  if (b - a <= 1e-4 || pts.length < 2) return;
  const seg = polySlice(pts, a, b);
  if (seg.length < 2) return;
  const P = resampleOpen(seg, n);
  const L = [], R = [];
  for (let i = 0; i < P.length; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[Math.min(P.length - 1, i + 1)];
    let nx = -(p1[1] - p0[1]), ny = p1[0] - p0[0];
    const l = Math.hypot(nx, ny) || 1; nx /= l; ny /= l;
    const w = (width * profile(i / (P.length - 1))) / 2;
    L.push([P[i][0] + nx * w, P[i][1] + ny * w]);
    R.push([P[i][0] - nx * w, P[i][1] - ny * w]);
  }
  ctx.save();
  ctx.globalAlpha *= alpha;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(L[0][0], L[0][1]);
  for (let i = 1; i < L.length; i++) ctx.lineTo(L[i][0], L[i][1]);
  for (let i = R.length - 1; i >= 0; i--) ctx.lineTo(R[i][0], R[i][1]);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

export function resampleOpen(pts, n) {
  const segs = [];
  let total = 0;
  for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); segs.push(l); total += l; }
  const out = [];
  let si = 0, acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / (n - 1)) * total;
    while (si < segs.length - 1 && acc + segs[si] < target) { acc += segs[si]; si++; }
    const t = segs[si] ? (target - acc) / segs[si] : 0;
    const p = pts[si], q = pts[si + 1] || pts[si];
    out.push([lerp(p[0], q[0], clamp(t)), lerp(p[1], q[1], clamp(t))]);
  }
  return out;
}

// ---------------------------------------------------------------- deterministic spark particles
// burst at (x, y) starting at time t0; returns nothing, draws streaks for time t
export function sparks(ctx, t, t0, x, y, { count = 18, seed = 5, speed = 1400, spread = Math.PI * 2, dir = -Math.PI / 2, gravity = 2600, drag = 2.2, life = 0.55, width = 7, color = COLORS.orange, streak = 0.035 } = {}) {
  const dt = t - t0;
  if (dt < 0) return;
  const R = rng(seed);
  for (let i = 0; i < count; i++) {
    const a = dir + (R() - 0.5) * spread, v = speed * (0.35 + R() * 0.65), L = life * (0.5 + R() * 0.5), wsc = 0.5 + R() * 0.7;
    if (dt > L) continue;
    const pos = (tt) => {
      const k = (1 - Math.exp(-drag * tt)) / drag;
      return [x + Math.cos(a) * v * k, y + Math.sin(a) * v * k + 0.5 * gravity * tt * tt * 0.35];
    };
    const p1 = pos(dt), p0 = pos(Math.max(0, dt - streak));
    const fade = 1 - (dt / L) ** 2;
    taperStroke(ctx, [p0, p1], { width: width * wsc * fade + 0.5, color, profile: (u) => 0.25 + 0.75 * u, n: 6 });
  }
}

// Place an image so that its anchor (ax, ay as fractions of the image) lands on screen point (sx, sy).
// h = drawn height in px. Returns the drawn rect.
export function drawAnchored(ctx, k, ax, ay, sx, sy, h, { alpha = 1, rot = 0, blend = null, clip = null } = {}) {
  const im = img(k);
  const w = (h * im.width) / im.height;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (blend) ctx.globalCompositeOperation = blend;
  if (clip) ctx.clip(clip, 'evenodd');
  ctx.translate(sx, sy);
  if (rot) ctx.rotate(rot);
  ctx.drawImage(im, -ax * w, -ay * h, w, h);
  ctx.restore();
  return { x: sx - ax * w, y: sy - ay * h, w, h };
}
