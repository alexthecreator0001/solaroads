// The Solaro lockup, rebuilt exactly from assets/solaro-logo.svg (1866 x 449 units):
// the 4-cell mark (see shapes.js) + the "Solaro" wordmark letters as individual paths.
import { MARK, MARK_ORDER, placeCell, drawCell } from './shapes.js';
import { pathToRings, bbox } from './morph.js';
import { COLORS } from './core.js';

export const LOGO_W = 1866, LOGO_H = 449;

export const WORDMARK = [
  { ch: 'S', d: 'M643.498 381C580.292 381 538.299 346.799 537 291.819H605.401C605.401 309.568 616.224 320.824 643.498 320.824C670.772 320.824 681.595 309.568 681.595 291.819C681.595 273.203 659.949 268.874 633.974 264.112C593.712 256.752 542.195 247.228 542.195 178.394C542.195 124.712 582.889 86.6155 643.931 86.6155C703.241 86.6155 743.502 122.548 745.667 176.23H679.863C679.43 159.779 669.04 146.791 644.797 146.791C619.687 146.791 609.73 161.077 609.73 175.797C609.73 194.412 631.376 198.741 657.784 203.503C698.479 210.863 749.996 220.387 749.996 289.221C749.996 345.501 707.57 381 643.498 381Z' },
  { ch: 'o', d: 'M891.415 381C823.879 381 776.258 333.379 776.258 268.441C776.258 203.503 823.879 155.882 891.415 155.882C958.95 155.882 1006.57 203.503 1006.57 268.441C1006.57 333.379 958.95 381 891.415 381ZM891.415 320.391C920.853 320.391 940.767 299.178 940.767 268.441C940.767 237.704 920.853 216.491 891.415 216.491C861.976 216.491 842.062 237.704 842.062 268.441C842.062 299.178 861.976 320.391 891.415 320.391Z' },
  { ch: 'l', d: 'M1047.2 375.372V68H1112.14V375.372H1047.2Z' },
  { ch: 'a', d: 'M1256.42 381C1208.79 381 1152.95 345.501 1152.95 271.039C1152.95 202.205 1200.57 155.882 1268.54 155.882C1335.64 155.882 1382.39 200.473 1382.39 270.606V375.372H1322.65V339.873C1311.4 366.281 1287.15 381 1256.42 381ZM1268.1 320.391C1297.54 320.391 1317.46 299.178 1317.46 268.441C1317.46 237.704 1297.54 216.491 1268.1 216.491C1238.67 216.491 1218.75 237.704 1218.75 268.441C1218.75 299.178 1238.67 320.391 1268.1 320.391Z' },
  { ch: 'r', d: 'M1424.99 375.372V253.722C1424.99 187.053 1463.96 155.882 1521.1 155.882C1578.25 155.882 1616.78 186.62 1617.21 254.155V255.454H1552.27V253.722C1552.27 225.149 1539.28 216.491 1521.1 216.491C1502.92 216.491 1489.93 225.149 1489.93 253.722V375.372H1424.99Z' },
  { ch: 'o', d: 'M1750.06 381C1682.53 381 1634.91 333.379 1634.91 268.441C1634.91 203.503 1682.53 155.882 1750.06 155.882C1817.6 155.882 1865.22 203.503 1865.22 268.441C1865.22 333.379 1817.6 381 1750.06 381ZM1750.06 320.391C1779.5 320.391 1799.42 299.178 1799.42 268.441C1799.42 237.704 1779.5 216.491 1750.06 216.491C1720.63 216.491 1700.71 237.704 1700.71 268.441C1700.71 299.178 1720.63 320.391 1750.06 320.391Z' },
].map((l) => {
  const rings = pathToRings(l.d, 20);
  return { ...l, path: new Path2D(l.d), rings, box: bbox(rings) };
});

// Wordmark metrics in logo units
export const WM = { baseline: 375.4, xTop: 155.9, capTop: 86.6, x0: 537, x1: 1866 };

// Draw the full static lockup with its top-left at (ox, oy), scale s (px per logo unit)
export function drawLogo(ctx, ox, oy, s, { alpha = 1, markAlpha = 1, textAlpha = 1, letters = null } = {}) {
  ctx.save();
  ctx.globalAlpha *= alpha;
  for (const k of MARK_ORDER) drawCell(ctx, placeCell(MARK[k], ox, oy, s), { alpha: markAlpha, innerShadow: 1, scale: s });
  ctx.translate(ox, oy);
  ctx.scale(s, s);
  ctx.fillStyle = COLORS.ink;
  WORDMARK.forEach((l, i) => {
    const o = letters ? letters(i, l) || {} : {};
    if (o.hide) return;
    ctx.save();
    ctx.globalAlpha *= textAlpha * (o.alpha ?? 1);
    if (o.dx || o.dy || o.s != null) {
      const cx = l.box.cx, cy = WM.baseline;
      ctx.translate(cx + (o.dx || 0), cy + (o.dy || 0));
      ctx.scale(o.s ?? 1, o.s ?? 1);
      ctx.translate(-cx, -cy);
    }
    ctx.fill(l.path);
    ctx.restore();
  });
  ctx.restore();
}

// The wordmark as a layout() compatible object at lockup origin (ox, oy) and scale s,
// so a typed word can morph/glide onto the exact logo letters.
export function layoutWordmark(ox, oy, s) {
  const m = new DOMMatrix().translate(ox, oy).scale(s);
  const items = WORDMARK.map((l) => {
    const rings = l.rings.map((r) => r.map(([x, y]) => [ox + x * s, oy + y * s]));
    const p = new Path2D(); p.addPath(l.path, m);
    const box = bbox(rings);
    return { ch: l.ch, x: box.x, adv: box.w, rings, path2d: p, box, wm: l };
  });
  return { items, y: oy + WM.baseline * s, x0: ox + WM.x0 * s, width: (WM.x1 - WM.x0) * s, xHeight: (WM.baseline - WM.xTop) * s, size: 0 };
}
