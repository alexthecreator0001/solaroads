// Shared word choreography for S4/S5: letters slam in (expoOut, staggered, from a side offset)
// and collapse to points (inExpo, staggered). The hot letter is drawn by the caller.
import { E, clamp, COLORS } from '../../engine/core.js';
import { itemPath } from '../../engine/text.js';
import { ringsToPath } from '../../engine/morph.js';

// draw the ink letters of layout L (skipping the hot index) for frame f
// enter: [f0, dur, dx] slam-in; exit: [f0, dur] collapse (towards each letter's own centre)
export function drawInkWord(ctx, L, f, { skip = -1, enter = null, exit = null, stemRings = null, push = 1, pivot = null } = {}) {
  ctx.save();
  if (push !== 1 && pivot) { ctx.translate(pivot[0], pivot[1]); ctx.scale(push, push); ctx.translate(-pivot[0], -pivot[1]); }
  ctx.fillStyle = COLORS.ink;
  L.items.forEach((it, i) => {
    let dx = 0, s = 1;
    if (enter) {
      const [e0, ed, edx] = enter;
      const p = clamp((f - (e0 + i * 1)) / ed);
      if (p <= 0) return;
      dx = edx * (1 - E.outExpo(p)) * (i % 2 ? -1 : 1);
    }
    if (exit) {
      const [x0, xd] = exit;
      const q = clamp((f - (x0 + i * 1)) / xd);
      s = 1 - E.inExpo(q);
      if (s <= 0.001) return;
    }
    const b = it.box;
    ctx.save();
    ctx.translate(dx + b.cx, b.cy); ctx.scale(s, s); ctx.translate(-b.cx, -b.cy);
    if (i === skip) { if (stemRings) ctx.fill(ringsToPath(stemRings), 'evenodd'); }
    else ctx.fill(itemPath(it));
    ctx.restore();
  });
  ctx.restore();
}

export const circleRings = (cx, cy, r, n = 160) => [Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; })];
export const ringRings = (cx, cy, ro, ri, n = 160) => [circleRings(cx, cy, ro, n)[0], circleRings(cx, cy, ri, n)[0].slice().reverse()];
