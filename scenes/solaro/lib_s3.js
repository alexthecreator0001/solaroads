// S3 helpers: constant-width polyline bands (true mitred offset polygons), regions cut along a
// polyline, and the 2-frame invert of everything drawn so far (images), leaving orange for later.
import { lerp } from '../../engine/core.js';

// unit left-normal of segment a->b (screen space, y down): for a downward segment it points to screen-left
const normal = (a, b) => {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1;
  return [-dy / L, dx / L];
};

// Mitred offset of an open polyline by d (d > 0 = left side). Each interior vertex is the exact
// intersection of the two neighbouring offset lines, so the offset stays at constant perpendicular
// distance d from every segment (no taper, no join flips while turn angles stay < ~150°).
export function offsetPolyline(P, d) {
  const n = P.length, N = [];
  for (let i = 0; i < n - 1; i++) N.push(normal(P[i], P[i + 1]));
  const out = [];
  for (let i = 0; i < n; i++) {
    if (i === 0) { out.push([P[0][0] + N[0][0] * d, P[0][1] + N[0][1] * d]); continue; }
    if (i === n - 1) { out.push([P[i][0] + N[i - 1][0] * d, P[i][1] + N[i - 1][1] * d]); continue; }
    const a = N[i - 1], b = N[i];
    const k = d / Math.max(0.2, 1 + a[0] * b[0] + a[1] * b[1]);
    out.push([P[i][0] + (a[0] + b[0]) * k, P[i][1] + (a[1] + b[1]) * k]);
  }
  return out;
}

const polyPath = (pts, p = new Path2D()) => {
  p.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) p.lineTo(pts[i][0], pts[i][1]);
  p.closePath();
  return p;
};

// band of constant width w centred on polyline P (butt ends): left offset + reversed right offset
export const bandPoly = (P, w) => offsetPolyline(P, w / 2).concat(offsetPolyline(P, -w / 2).reverse());
export const bandPath = (P, w) => polyPath(bandPoly(P, w));

// the region left of P (cut at the offset line d to the left of P) and right of P (cut at d to the right)
export function leftRegion(P, d) {
  const o = offsetPolyline(P, d);
  return polyPath([[-400, o[0][1]], ...o, [-400, o[o.length - 1][1]]]);
}
export function rightRegion(P, d) {
  const o = offsetPolyline(P, -d);
  return polyPath([[1480, o[0][1]], ...o, [1480, o[o.length - 1][1]]]);
}

export const bboxPts = (pts) => {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const [x, y] of pts) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0 };
};

// cumulative arc-length fractions of a polyline (0..1)
export function arcFractions(P) {
  const c = [0];
  for (let i = 1; i < P.length; i++) c.push(c[i - 1] + Math.hypot(P[i][0] - P[i - 1][0], P[i][1] - P[i - 1][1]));
  return c.map((v) => v / c[c.length - 1]);
}

export const lerpPts = (A, B, t) => A.map((p, i) => [lerp(p[0], B[i][0], t), lerp(p[1], B[i][1], t)]);

// Invert everything drawn so far on the canvas (B&W images on white) so that paper -> ink #1C1C1C and
// ink -> white: y = 28 + (255 - x) * 227/255. Exact per channel, done with three composite fills.
export function invertCanvas(ctx) {
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.filter = 'none';
  ctx.globalAlpha = 1;
  const w = ctx.canvas.width, h = ctx.canvas.height;
  ctx.globalCompositeOperation = 'difference';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'multiply';
  ctx.fillStyle = 'rgb(227,227,227)';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter';
  ctx.fillStyle = 'rgb(28,28,28)';
  ctx.fillRect(0, 0, w, h);
  ctx.restore();
}

// stroke an open polyline segment list as a constant-width capsule chain (round caps), for wires
export function wire(ctx, a, b, width, style) {
  if (Math.hypot(b[0] - a[0], b[1] - a[1]) < 0.01) return;
  ctx.save();
  ctx.strokeStyle = style;
  ctx.lineWidth = width;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(a[0], a[1]);
  ctx.lineTo(b[0], b[1]);
  ctx.stroke();
  ctx.restore();
}
