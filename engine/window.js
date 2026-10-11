// Image windows: any registered image drawn into any clip path (Solaro cells, split polygons,
// discs) in one of two modes:
//   cov — object-fit: cover a box, with a focus point and extra zoom
//   reg — registration: image point `pt` (fractions) lands on screen point `P`, displayed width `w` px
// `push` is an extra scale about the focus/registration point (ambient constant-ratio push).
import { get, reg } from './assets.js';
import { clamp } from './core.js';

export function windowImage(ctx, key, o = {}) {
  const im = get(key);
  const r = reg(key);
  const { clip = null, rule = 'evenodd', mode = 'cov', alpha = 1, rot = 0, push = 1, filter = null, blend = null } = o;
  ctx.save();
  ctx.globalAlpha *= alpha;
  if (blend) ctx.globalCompositeOperation = blend;
  if (clip) ctx.clip(clip, rule);
  if (filter) ctx.filter = filter;
  if (mode === 'reg') {
    const pt = o.pt || r.pt || [0.5, 0.5];
    const P = o.P;
    const w = (o.w ?? 1080) * push;
    const h = (w * im.height) / im.width;
    ctx.translate(P[0], P[1]);
    if (rot) ctx.rotate(rot);
    ctx.drawImage(im, -pt[0] * w, -pt[1] * h, w, h);
  } else {
    const box = o.box;
    const focus = o.focus || r.focus || [0.5, 0.5];
    const s = Math.max(box.w / im.width, box.h / im.height) * (o.zoom || 1);
    const dw = im.width * s, dh = im.height * s;
    let dx = box.x + box.w / 2 - focus[0] * dw, dy = box.y + box.h / 2 - focus[1] * dh;
    if (!o.free) { dx = clamp(dx, box.x + box.w - dw, box.x); dy = clamp(dy, box.y + box.h - dh, box.y); }
    // ambient push about the box centre
    const cx = box.x + box.w / 2, cy = box.y + box.h / 2;
    ctx.translate(cx, cy);
    if (rot) ctx.rotate(rot);
    ctx.scale(push, push);
    ctx.translate(-cx, -cy);
    ctx.drawImage(im, dx, dy, dw, dh);
  }
  ctx.restore();
}

export const bboxOfCell = (c) => ({ x: c.x, y: c.y, w: c.w, h: c.h });
