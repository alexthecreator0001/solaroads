// Generic outline morphing: SVG path / glyph commands -> rings -> matched, resampled,
// rotation-aligned point sets that interpolate cleanly. Used for letter and icon morphs.
import { lerp } from './core.js';

// ---------------------------------------------------------------- SVG path parsing
export function parsePath(d) {
  const toks = d.match(/[a-zA-Z]|-?(?:\d+\.?\d*|\.\d+)(?:e[-+]?\d+)?/g) || [];
  const cmds = [];
  let i = 0, cmd = null, x = 0, y = 0, sx = 0, sy = 0, lcx = 0, lcy = 0, lqx = 0, lqy = 0, prev = '';
  const num = () => parseFloat(toks[i++]);
  while (i < toks.length) {
    if (/[a-zA-Z]/.test(toks[i])) cmd = toks[i++];
    const rel = cmd === cmd.toLowerCase();
    const C = cmd.toUpperCase();
    if (C === 'Z') { cmds.push({ type: 'Z' }); x = sx; y = sy; prev = 'Z'; continue; }
    if (C === 'M') {
      let nx = num(), ny = num();
      if (rel) { nx += x; ny += y; }
      x = sx = nx; y = sy = ny;
      cmds.push({ type: 'M', x, y });
      cmd = rel ? 'l' : 'L';
      prev = 'M';
      continue;
    }
    if (C === 'L' || C === 'H' || C === 'V') {
      let nx = x, ny = y;
      if (C === 'L') { nx = num(); ny = num(); if (rel) { nx += x; ny += y; } }
      else if (C === 'H') { nx = num(); if (rel) nx += x; }
      else { ny = num(); if (rel) ny += y; }
      x = nx; y = ny;
      cmds.push({ type: 'L', x, y });
      prev = 'L';
      continue;
    }
    if (C === 'C' || C === 'S') {
      let x1, y1;
      if (C === 'C') { x1 = num(); y1 = num(); if (rel) { x1 += x; y1 += y; } }
      else { x1 = prev === 'C' ? 2 * x - lcx : x; y1 = prev === 'C' ? 2 * y - lcy : y; }
      let x2 = num(), y2 = num(), nx = num(), ny = num();
      if (rel) { x2 += x; y2 += y; nx += x; ny += y; }
      cmds.push({ type: 'C', x1, y1, x2, y2, x: nx, y: ny });
      lcx = x2; lcy = y2; x = nx; y = ny; prev = 'C';
      continue;
    }
    if (C === 'Q' || C === 'T') {
      let x1, y1;
      if (C === 'Q') { x1 = num(); y1 = num(); if (rel) { x1 += x; y1 += y; } }
      else { x1 = prev === 'Q' ? 2 * x - lqx : x; y1 = prev === 'Q' ? 2 * y - lqy : y; }
      let nx = num(), ny = num();
      if (rel) { nx += x; ny += y; }
      cmds.push({ type: 'Q', x1, y1, x: nx, y: ny });
      lqx = x1; lqy = y1; x = nx; y = ny; prev = 'Q';
      continue;
    }
    if (C === 'A') {
      const rx = num(), ry = num(), rotA = num(), large = num(), sweep = num();
      let nx = num(), ny = num();
      if (rel) { nx += x; ny += y; }
      for (const c of arcToCubics(x, y, rx, ry, rotA, large, sweep, nx, ny)) cmds.push(c);
      x = nx; y = ny; prev = 'A';
      continue;
    }
    i++; // unknown token
  }
  return cmds;
}

function arcToCubics(x1, y1, rx, ry, phiDeg, fa, fs, x2, y2) {
  if (rx === 0 || ry === 0) return [{ type: 'L', x: x2, y: y2 }];
  const phi = (phiDeg * Math.PI) / 180, cos = Math.cos(phi), sin = Math.sin(phi);
  const dx = (x1 - x2) / 2, dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy, y1p = -sin * dx + cos * dy;
  rx = Math.abs(rx); ry = Math.abs(ry);
  const lam = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lam > 1) { rx *= Math.sqrt(lam); ry *= Math.sqrt(lam); }
  const sign = fa === fs ? -1 : 1;
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const co = sign * Math.sqrt(Math.max(0, num / (rx * rx * y1p * y1p + ry * ry * x1p * x1p)));
  const cxp = (co * rx * y1p) / ry, cyp = (-co * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2, cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const ang = (ux, uy, vx, vy) => { const a = Math.atan2(ux * vy - uy * vx, ux * vx + uy * vy); return a; };
  const th1 = ang(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  let dth = ang((x1p - cxp) / rx, (y1p - cyp) / ry, (-x1p - cxp) / rx, (-y1p - cyp) / ry);
  if (!fs && dth > 0) dth -= 2 * Math.PI;
  if (fs && dth < 0) dth += 2 * Math.PI;
  const segs = Math.ceil(Math.abs(dth) / (Math.PI / 2));
  const out = [];
  const d = dth / segs, k = (4 / 3) * Math.tan(d / 4);
  let t = th1;
  for (let s = 0; s < segs; s++) {
    const c1 = Math.cos(t), s1 = Math.sin(t), c2 = Math.cos(t + d), s2 = Math.sin(t + d);
    const p = (ex, ey) => [cos * rx * ex - sin * ry * ey + cx, sin * rx * ex + cos * ry * ey + cy];
    const [ax1, ay1] = p(c1 - k * s1, s1 + k * c1);
    const [ax2, ay2] = p(c2 + k * s2, s2 - k * c2);
    const [ex, ey] = p(c2, s2);
    out.push({ type: 'C', x1: ax1, y1: ay1, x2: ax2, y2: ay2, x: ex, y: ey });
    t += d;
  }
  return out;
}

// ---------------------------------------------------------------- flattening
// commands (M/L/Q/C/Z) -> array of rings, each ring = Float64Array-like [[x,y],...]
export function cmdsToRings(cmds, seg = 18) {
  const rings = [];
  let cur = null, x = 0, y = 0;
  const close = () => { if (cur && cur.length > 2) rings.push(dedupe(cur)); cur = null; };
  for (const c of cmds) {
    if (c.type === 'M') { close(); cur = [[c.x, c.y]]; x = c.x; y = c.y; }
    else if (c.type === 'L') { if (!cur) cur = [[x, y]]; cur.push([c.x, c.y]); x = c.x; y = c.y; }
    else if (c.type === 'Q') {
      if (!cur) cur = [[x, y]];
      for (let i = 1; i <= seg; i++) {
        const t = i / seg, mt = 1 - t;
        cur.push([mt * mt * x + 2 * mt * t * c.x1 + t * t * c.x, mt * mt * y + 2 * mt * t * c.y1 + t * t * c.y]);
      }
      x = c.x; y = c.y;
    } else if (c.type === 'C') {
      if (!cur) cur = [[x, y]];
      for (let i = 1; i <= seg; i++) {
        const t = i / seg, mt = 1 - t;
        cur.push([
          mt * mt * mt * x + 3 * mt * mt * t * c.x1 + 3 * mt * t * t * c.x2 + t * t * t * c.x,
          mt * mt * mt * y + 3 * mt * mt * t * c.y1 + 3 * mt * t * t * c.y2 + t * t * t * c.y,
        ]);
      }
      x = c.x; y = c.y;
    } else if (c.type === 'Z') close();
  }
  close();
  return rings;
}

function dedupe(r) {
  const out = [r[0]];
  for (let i = 1; i < r.length; i++) {
    const p = out[out.length - 1];
    if (Math.abs(p[0] - r[i][0]) > 1e-6 || Math.abs(p[1] - r[i][1]) > 1e-6) out.push(r[i]);
  }
  const f = out[0], l = out[out.length - 1];
  if (out.length > 1 && Math.abs(f[0] - l[0]) < 1e-6 && Math.abs(f[1] - l[1]) < 1e-6) out.pop();
  return out;
}

export const pathToRings = (d, seg) => cmdsToRings(parsePath(d), seg);

// ---------------------------------------------------------------- ring geometry
export function area(r) {
  let a = 0;
  for (let i = 0, n = r.length; i < n; i++) {
    const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % n];
    a += x1 * y2 - x2 * y1;
  }
  return a / 2;
}
export function centroid(r) {
  let cx = 0, cy = 0, a = 0;
  for (let i = 0, n = r.length; i < n; i++) {
    const [x1, y1] = r[i], [x2, y2] = r[(i + 1) % n];
    const f = x1 * y2 - x2 * y1;
    cx += (x1 + x2) * f; cy += (y1 + y2) * f; a += f;
  }
  if (Math.abs(a) < 1e-9) { const m = r.reduce((s, p) => [s[0] + p[0], s[1] + p[1]], [0, 0]); return [m[0] / r.length, m[1] / r.length]; }
  return [cx / (3 * a), cy / (3 * a)];
}
export function bbox(rings) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const r of rings) for (const [x, y] of r) { if (x < x0) x0 = x; if (y < y0) y0 = y; if (x > x1) x1 = x; if (y > y1) y1 = y; }
  return { x: x0, y: y0, w: x1 - x0, h: y1 - y0, cx: (x0 + x1) / 2, cy: (y0 + y1) / 2 };
}
function inside(pt, r) {
  let c = false;
  for (let i = 0, j = r.length - 1; i < r.length; j = i++) {
    const [xi, yi] = r[i], [xj, yj] = r[j];
    if ((yi > pt[1]) !== (yj > pt[1]) && pt[0] < ((xj - xi) * (pt[1] - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}
function perimeter(r) {
  let p = 0;
  for (let i = 0; i < r.length; i++) { const a = r[i], b = r[(i + 1) % r.length]; p += Math.hypot(b[0] - a[0], b[1] - a[1]); }
  return p;
}
export function resample(r, n) {
  const L = perimeter(r), step = L / n, out = [];
  let i = 0, acc = 0, a = r[0], b = r[1 % r.length], segL = Math.hypot(b[0] - a[0], b[1] - a[1]);
  for (let k = 0; k < n; k++) {
    const target = k * step;
    while (acc + segL < target && i < r.length) { acc += segL; i++; a = r[i % r.length]; b = r[(i + 1) % r.length]; segL = Math.hypot(b[0] - a[0], b[1] - a[1]); }
    const t = segL > 0 ? (target - acc) / segL : 0;
    out.push([lerp(a[0], b[0], t), lerp(a[1], b[1], t)]);
  }
  return out;
}

// Group rings into shapes {outer, holes[]} using even-odd nesting depth
export function structure(rings) {
  const info = rings.map((r) => ({ r, a: Math.abs(area(r)), c: centroid(r) }));
  const shapes = [];
  const depth = info.map((ri, i) => info.reduce((d, rj, j) => (j !== i && rj.a > ri.a && inside(ri.r[0], rj.r) ? d + 1 : d), 0));
  info.forEach((ri, i) => { if (depth[i] % 2 === 0) shapes.push({ outer: ri.r, holes: [], a: ri.a, c: ri.c }); });
  info.forEach((ri, i) => {
    if (depth[i] % 2 === 1) {
      let best = null;
      for (const s of shapes) if (inside(ri.r[0], s.outer) && (!best || s.a < best.a)) best = s;
      (best || shapes[0]).holes.push(ri.r);
    }
  });
  return shapes;
}

const orient = (r, cw) => ((area(r) > 0) === cw ? r : r.slice().reverse());

// Best cyclic shift of b to match a (position-centred), O(n^2/step) coarse-to-fine
function align(a, b) {
  const n = a.length;
  const ca = a.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0]);
  const cb = b.reduce((s, p) => [s[0] + p[0] / n, s[1] + p[1] / n], [0, 0]);
  const cost = (k) => {
    let s = 0;
    for (let i = 0; i < n; i += 2) {
      const p = a[i], q = b[(i + k) % n];
      const dx = p[0] - ca[0] - (q[0] - cb[0]), dy = p[1] - ca[1] - (q[1] - cb[1]);
      s += dx * dx + dy * dy;
    }
    return s;
  };
  let best = 0, bc = Infinity;
  for (let k = 0; k < n; k += 4) { const c = cost(k); if (c < bc) { bc = c; best = k; } }
  for (let k = best - 4; k <= best + 4; k++) { const kk = (k + n) % n, c = cost(kk); if (c < bc) { bc = c; best = kk; } }
  return b.slice(best).concat(b.slice(0, best));
}

const pointRing = (p, n) => Array.from({ length: n }, () => [p[0], p[1]]);

// nearest point on any ring of a shape to p
function nearestOn(shape, p) {
  let best = shape.outer[0], bd = Infinity;
  for (const q of shape.outer) { const d = (q[0] - p[0]) ** 2 + (q[1] - p[1]) ** 2; if (d < bd) { bd = d; best = q; } }
  return best;
}

// Pair two lists by minimal centroid distance (greedy on sorted pair distances)
function pairUp(A, B) {
  const pairs = [];
  for (let i = 0; i < A.length; i++) for (let j = 0; j < B.length; j++) pairs.push([Math.hypot(A[i].c[0] - B[j].c[0], A[i].c[1] - B[j].c[1]), i, j]);
  pairs.sort((x, y) => x[0] - y[0]);
  const ua = new Set(), ub = new Set(), out = [];
  for (const [, i, j] of pairs) if (!ua.has(i) && !ub.has(j)) { ua.add(i); ub.add(j); out.push([i, j]); }
  return { pairs: out, restA: A.map((_, i) => i).filter((i) => !ua.has(i)), restB: B.map((_, j) => j).filter((j) => !ub.has(j)) };
}

// Build a morph between two ring sets. Returns t -> rings (draw with evenodd).
export function makeMorph(ringsA, ringsB, { n = 160, offsetB = [0, 0] } = {}) {
  const sa = structure(ringsA), sb = structure(ringsB.map((r) => r.map(([x, y]) => [x + offsetB[0], y + offsetB[1]])));
  const { pairs, restA, restB } = pairUp(sa, sb);
  const tracks = []; // [ringA(n pts), ringB(n pts)]
  const addPair = (ra, rb) => {
    const A = resample(orient(ra, true), n), B = resample(orient(rb, true), n);
    tracks.push([A, align(A, B)]);
  };
  for (const [i, j] of pairs) {
    const A = sa[i], B = sb[j];
    addPair(A.outer, B.outer);
    const ha = A.holes.map((r) => ({ r, c: centroid(r) })), hb = B.holes.map((r) => ({ r, c: centroid(r) }));
    const hp = pairUp(ha, hb);
    for (const [x, y] of hp.pairs) addPair(ha[x].r, hb[y].r);
    for (const x of hp.restA) { const A2 = resample(orient(ha[x].r, true), n); tracks.push([A2, pointRing(centroid(ha[x].r), n)]); }
    for (const y of hp.restB) { const B2 = resample(orient(hb[y].r, true), n); tracks.push([pointRing(centroid(hb[y].r), n), B2]); }
  }
  for (const i of restA) {
    const A = resample(orient(sa[i].outer, true), n);
    const tgt = sb.length ? nearestOn(sb[0], sa[i].c) : sa[i].c;
    tracks.push([A, pointRing(tgt, n)]);
    for (const h of sa[i].holes) tracks.push([resample(orient(h, true), n), pointRing(tgt, n)]);
  }
  for (const j of restB) {
    const B = resample(orient(sb[j].outer, true), n);
    const src = sa.length ? nearestOn(sa[0], sb[j].c) : sb[j].c;
    tracks.push([pointRing(src, n), B]);
    for (const h of sb[j].holes) tracks.push([pointRing(src, n), resample(orient(h, true), n)]);
  }
  return (t) => tracks.map(([A, B]) => A.map((p, i) => [lerp(p[0], B[i][0], t), lerp(p[1], B[i][1], t)]));
}

export function ringsToPath(rings, m) {
  const p = new Path2D();
  for (const r of rings) {
    if (!r.length) continue;
    p.moveTo(r[0][0], r[0][1]);
    for (let i = 1; i < r.length; i++) p.lineTo(r[i][0], r[i][1]);
    p.closePath();
  }
  if (m) { const q = new Path2D(); q.addPath(p, m); return q; }
  return p;
}

export function transformRings(rings, { x = 0, y = 0, s = 1, sx, sy, rot = 0, ox = 0, oy = 0 } = {}) {
  const c = Math.cos(rot), si = Math.sin(rot), kx = sx ?? s, ky = sy ?? s;
  return rings.map((r) => r.map(([px, py]) => {
    const dx = (px - ox) * kx, dy = (py - oy) * ky;
    return [x + ox + dx * c - dy * si, y + oy + dx * si + dy * c];
  }));
}

// polyline helpers for draw-on strokes
export function polyLength(pts) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  return L;
}
export function polySlice(pts, a, b) {
  // returns sub-polyline between fractional lengths a..b (0..1)
  const L = polyLength(pts), A = a * L, B = b * L, out = [];
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], q = pts[i], l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    const s0 = acc, s1 = acc + l;
    if (s1 >= A && s0 <= B && l > 0) {
      const t0 = Math.max(0, (A - s0) / l), t1 = Math.min(1, (B - s0) / l);
      if (!out.length) out.push([lerp(p[0], q[0], t0), lerp(p[1], q[1], t0)]);
      out.push([lerp(p[0], q[0], t1), lerp(p[1], q[1], t1)]);
    }
    acc = s1;
    if (acc > B) break;
  }
  return out;
}
export function pointAt(pts, f) {
  const L = polyLength(pts), T = f * L;
  let acc = 0;
  for (let i = 1; i < pts.length; i++) {
    const p = pts[i - 1], q = pts[i], l = Math.hypot(q[0] - p[0], q[1] - p[1]);
    if (acc + l >= T) { const t = l ? (T - acc) / l : 0; return [lerp(p[0], q[0], t), lerp(p[1], q[1], t), Math.atan2(q[1] - p[1], q[0] - p[0])]; }
    acc += l;
  }
  const q = pts[pts.length - 1], p = pts[pts.length - 2] || q;
  return [q[0], q[1], Math.atan2(q[1] - p[1], q[0] - p[0])];
}
