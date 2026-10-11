// Solaro logo intro, written out as Lottie JSON (bodymovin 5.x schema, plays in lottie-web / iOS / Android).
// Geometry is read straight from assets/solaro-logo.svg, so the last frame is the static logo, unit for unit.
//
// Motion (60 fps):
//   1. the four mark cells pop in clockwise around the centre while the mark turns a quarter turn;
//      they arrive packed together (gap 0), so their inner curves cut a white ✦ glint in the middle
//   2. the cells spring apart to the real 0.2-cell gap: the ✦ opens into the "+" of the logo
//   3. the wordmark letters rise one by one from a hidden horizon at the baseline, like a sunrise
//
//   node logo-animation/build.mjs   ->  logo-animation/solaro-logo.json, logo-animation/solaro-mark.json
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SVG = fs.readFileSync(path.join(HERE, '..', 'assets', 'solaro-logo.svg'), 'utf8');

const FPS = 60;
const ORANGE = '#FF5E2B'; // flat brand orange, as on solaro.sk
const INK = '#1C1C1C'; // wordmark fill in solaro-logo.svg
const W = 1866, H = 449; // lockup box (solaro-logo.svg viewBox)
const MARK = 449, MC = 224.5; // mark box and its centre
const GAP = 40.816; // gap between the cells (0.2 cell)
const BASELINE = 375.372;

// Easing curves, as CSS cubic-bezier(x1, y1, x2, y2)
const EASE = {
  outQuint: [0.22, 1, 0.36, 1],
  outBack: [0.34, 1.32, 0.64, 1],
  outExpo: [0.16, 1, 0.3, 1],
  inOut: [0.65, 0, 0.35, 1],
  snap: [0.55, 0, 0.1, 1],
  linear: [0, 0, 1, 1],
};

// ---------- SVG path -> Lottie bezier shapes ----------

function contours(d) {
  const toks = d.match(/[MmLlHhVvCcZz]|-?(?:\d*\.\d+|\d+\.?)(?:[eE][-+]?\d+)?/g);
  const out = [];
  let i = 0, cmd = null, x = 0, y = 0, cur = null;
  const n = () => parseFloat(toks[i++]);
  const last = () => cur.pts[cur.pts.length - 1];
  const lineTo = (nx, ny) => { x = nx; y = ny; cur.pts.push({ v: [x, y], i: [0, 0], o: [0, 0] }); };
  while (i < toks.length) {
    if (/[a-z]/i.test(toks[i])) cmd = toks[i++];
    const rel = cmd !== cmd.toUpperCase();
    const ox = rel ? x : 0, oy = rel ? y : 0;
    switch (cmd.toUpperCase()) {
      case 'M':
        x = n() + ox; y = n() + oy;
        cur = { pts: [{ v: [x, y], i: [0, 0], o: [0, 0] }], c: false };
        out.push(cur);
        cmd = rel ? 'l' : 'L';
        break;
      case 'L': { const nx = n() + ox, ny = n() + oy; lineTo(nx, ny); break; }
      case 'H': lineTo(n() + ox, y); break;
      case 'V': lineTo(x, n() + oy); break;
      case 'C': {
        const c1 = [n() + ox, n() + oy], c2 = [n() + ox, n() + oy], p = [n() + ox, n() + oy];
        const a = last();
        a.o = [c1[0] - a.v[0], c1[1] - a.v[1]];
        cur.pts.push({ v: p, i: [c2[0] - p[0], c2[1] - p[1]], o: [0, 0] });
        [x, y] = p;
        break;
      }
      case 'Z': {
        cur.c = true;
        const f = cur.pts[0], l = last();
        if (cur.pts.length > 1 && Math.hypot(f.v[0] - l.v[0], f.v[1] - l.v[1]) < 1e-3) { f.i = l.i; cur.pts.pop(); }
        [x, y] = f.v;
        break;
      }
      default: throw new Error(`unsupported path command ${cmd}`);
    }
  }
  return out;
}

const r3 = (v) => Math.round(v * 1000) / 1000;
const pt = (p) => p.map(r3);
const bbox = (cs) => {
  const xs = cs.flatMap((c) => c.pts.map((p) => p.v[0])), ys = cs.flatMap((c) => c.pts.map((p) => p.v[1]));
  return { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
};

const paths = [...SVG.matchAll(/<path d="([^"]+)"/g)].map((m) => { const cs = contours(m[1]); return { cs, box: bbox(cs) }; });
if (paths.length !== 10) throw new Error(`expected 4 mark + 6 letter paths in solaro-logo.svg, got ${paths.length}`);
const markPaths = paths.filter((p) => p.box.x1 <= MARK + 1);
const cell = (right, bottom) => markPaths.find((p) => (p.box.x0 > MC) === right && (p.box.y0 > MC) === bottom);
// Clockwise from the ring (the sun): ring TL, quarter TR, pin BR, quarter BL. dir = direction away from the centre.
const CELLS = [
  { nm: 'Ring', p: cell(false, false), dir: [-1, -1] },
  { nm: 'Quarter TR', p: cell(true, false), dir: [1, -1] },
  { nm: 'Pin', p: cell(true, true), dir: [1, 1] },
  { nm: 'Quarter BL', p: cell(false, true), dir: [-1, 1] },
];
const LETTERS = paths.filter((p) => p.box.x0 > MARK + 1).sort((a, b) => a.box.x0 - b.box.x0);
['S', 'o', 'l', 'a', 'r', 'o'].forEach((ch, k) => { LETTERS[k].ch = ch; });

// ---------- Lottie building blocks ----------

const rgba = (hex) => [1, 3, 5].map((k) => r3(parseInt(hex.slice(k, k + 2), 16) / 255)).concat(1);
const st = (k) => ({ a: 0, k });
const arr = (v) => (Array.isArray(v) ? v : [v]);

// Keyframed property. keys: [[frame, value, easing-to-next-key], ...]; the last key needs no easing.
function anim(keys) {
  return {
    a: 1,
    k: keys.map(([t, v, e], j) => {
      const s = arr(v), kf = { t, s };
      if (j < keys.length - 1) {
        const [x1, y1, x2, y2] = e || EASE.linear;
        kf.o = { x: s.map(() => x1), y: s.map(() => y1) };
        kf.i = { x: s.map(() => x2), y: s.map(() => y2) };
      }
      return kf;
    }),
  };
}

const shPath = (c, nm) => ({ ty: 'sh', nm, ks: st({ i: c.pts.map((p) => pt(p.i)), o: c.pts.map((p) => pt(p.o)), v: c.pts.map((p) => pt(p.v)), c: c.c }) });
const fill = (hex) => ({ ty: 'fl', nm: 'Fill', c: st(rgba(hex)), o: st(100), r: 1, bm: 0 });

function group(nm, items, { p = [0, 0], a = [0, 0], s = [100, 100], r = 0, o = 100 } = {}) {
  const prop = (v) => (v && v.a === 1 ? v : st(v));
  return {
    ty: 'gr', nm, np: items.length, cix: 2, bm: 0,
    it: [...items, { ty: 'tr', nm: 'Transform', p: prop(p), a: prop(a), s: prop(s), r: prop(r), o: prop(o), sk: st(0), sa: st(0) }],
  };
}

function layer(ind, nm, shapes, op, { p = [0, 0, 0], a = [0, 0, 0], s = [100, 100, 100], r = 0, o = 100 } = {}, extra = {}) {
  const prop = (v) => (v && v.a === 1 ? v : st(v));
  return { ddd: 0, ind, ty: 4, nm, sr: 1, ks: { o: prop(o), r: prop(r), p: prop(p), a: prop(a), s: prop(s) }, ao: 0, shapes, ip: 0, op, st: 0, bm: 0, ...extra };
}

// ---------- the animation ----------

// The mark, starting at frame t0. Each cell blooms out of the centre (scale + a swirl about the mark centre),
// packed against its neighbours; once all four are in, they spring apart to the real gap.
// Nothing ever leaves the 449 box, so the Lottie can sit in the exact slot of the static logo.
function markLayer(ind, t0, op) {
  const POP = 24, STAGGER = 3, SWIRL = -40;
  const OPEN = [t0 + 34, t0 + 54];
  const groups = CELLS.map(({ nm, p, dir }, k) => {
    const tk = t0 + k * STAGGER;
    const packed = [MC - (dir[0] * GAP) / 2, MC - (dir[1] * GAP) / 2];
    return group(nm, [...p.cs.map((c, j) => shPath(c, `${nm} ${j + 1}`)), fill(ORANGE)], {
      a: [MC, MC],
      p: anim([[OPEN[0], packed, EASE.snap], [OPEN[1], [MC, MC]]]),
      s: anim([[tk, [0, 0], EASE.outBack], [tk + POP, [100, 100]]]),
      r: anim([[tk, SWIRL, EASE.outQuint], [tk + POP, 0]]),
    });
  });
  return layer(ind, 'Mark', groups, op);
}

// Wordmark letters rising out of a horizon line just under the baseline.
function wordmarkLayer(ind, t0, op) {
  const RISE = 330, DUR = 36, STAGGER = 4, FADE = 8;
  const groups = LETTERS.map(({ ch, cs }, k) => {
    const tk = t0 + k * STAGGER;
    return group(`Letter ${ch}`, [...cs.map((c, j) => shPath(c, `${ch} ${j + 1}`)), fill(INK)], {
      p: anim([[tk, [0, RISE], EASE.outExpo], [tk + DUR, [0, 0]]]),
      o: anim([[tk, 0, EASE.linear], [tk + FADE, 100]]),
    });
  });
  const x0 = MARK + 20, y1 = BASELINE + 8; // horizon sits under the round letters' overshoot (y 381)
  const horizon = { c: true, v: [[x0, -40], [W + 40, -40], [W + 40, y1], [x0, y1]], i: [[0, 0], [0, 0], [0, 0], [0, 0]], o: [[0, 0], [0, 0], [0, 0], [0, 0]] };
  return layer(ind, 'Wordmark', groups, op, {}, {
    hasMask: true,
    masksProperties: [{ nm: 'Horizon', inv: false, mode: 'a', pt: st(horizon), o: st(100), x: st(0) }],
  });
}

function comp(nm, w, h, op, layers) {
  return { v: '5.7.4', fr: FPS, ip: 0, op, w, h, nm, ddd: 0, assets: [], layers, markers: [] };
}

const LOGO_OP = 108; // 1.8 s
const MARK_OP = 66; // 1.1 s
const logo = comp('Solaro logo intro', W, H, LOGO_OP, [wordmarkLayer(1, 44, LOGO_OP), markLayer(2, 0, LOGO_OP)]);
const mark = comp('Solaro mark intro', MARK, MARK, MARK_OP, [markLayer(1, 0, MARK_OP)]);

for (const [file, data] of [['solaro-logo.json', logo], ['solaro-mark.json', mark]]) {
  fs.writeFileSync(path.join(HERE, file), JSON.stringify(data));
  console.log(`${file}: ${data.w}x${data.h}, ${data.op} frames @ ${FPS} fps (${(data.op / FPS).toFixed(2)} s), ${(fs.statSync(path.join(HERE, file)).size / 1024).toFixed(1)} KB`);
}
