// Prototype: lockup -> mark -> gap closes -> ✦ spark in the negative space -> cells fly out -> dot
import { W, H, E, ease, lerp, clamp, COLORS, deg, invlerp } from '../engine/core.js';
import { MARK_ORDER, markCells, drawCell, sparkPath, brandGradient, GAP, CELL } from '../engine/shapes.js';
import { drawLogo, LOGO_W, LOGO_H } from '../engine/logo.js';
import { dot } from '../engine/draw.js';

const AX = 540, AY = 940;
export default {
  duration: 1.2,
  shutter: 0.5,
  samples: (t) => { const f = t * 60; return (f > 18 && f < 30) || (f > 38 && f < 52) ? 6 : 1; },
  draw(ctx, t) {
    const f = t * 60;
    // lockup 83% width, centred at anchor
    const s0 = (W * 0.83) / LOGO_W;
    if (f < 18) {
      const k = 1 + 0.03 * ease(f, 10, 15, E.outCubic) - 0.03 * ease(f, 15, 18, E.inCubic);
      const s = s0 * k;
      drawLogo(ctx, AX - (LOGO_W * s) / 2, AY - (LOGO_H * s) / 2, s);
      return;
    }
    // f18-30: wordmark collapses into the mark while the mark glides to centre and scales up
    const p = ease(f, 18, 30, E.inOutCubic);
    const markS0 = s0, markS1 = 0.95; // mark-unit scale
    const lockX = AX - (LOGO_W * s0) / 2, lockY = AY - (LOGO_H * s0) / 2;
    const mcx0 = lockX + 224.5 * s0, mcy0 = lockY + 224.5 * s0;
    const ms = lerp(markS0, markS1, p);
    const mcx = lerp(mcx0, AX, p), mcy = lerp(mcy0, AY, p);
    if (f < 30) {
      const tp = ease(f, 18, 26, E.inExpo);
      const tq = ease(f, 18, 27, E.inExpo);
      drawLogo(ctx, lockX, lockY, s0, { markAlpha: 0, letters: (i, l) => ({ s: 1 - tq * 0.9, dx: (224.5 - l.box.cx) * tq, alpha: tq > 0.92 ? 0 : 1 }) });
    }
    // gap closes f26-34 (expo in -> slam), spark flashes at contact
    const g = lerp(GAP, 0, ease(f, 26, 33, E.inQuart));
    // f38+: cells fly out radially (expo in), leaving the spark
    const spread = 2200 * ease(f, 38, 48, E.inExpo);
    const cells = markCells(mcx, mcy, ms, g, spread / ms);
    for (const k of MARK_ORDER) drawCell(ctx, cells[k]);
    // spark star in the negative space appears when closed
    const sp = invlerp(37.5, 38.5, f);
    if (sp > 0) {
      const R = (CELL / 2) * ms;
      const grow = 1 + 0.12 * ease(f, 38, 44, E.outBack);
      const shrink = Math.exp(-4.2 * ease(f, 46, 56, E.inQuad));
      const rot = deg(45) * ease(f, 44, 58, E.inOutCubic);
      const Rs = R * grow * Math.max(0.0, shrink);
      ctx.save();
      ctx.fillStyle = brandGradient(ctx, mcy - Rs, mcy + Rs);
      if (Rs > 26) ctx.fill(sparkPath(mcx, mcy, Rs, rot));
      ctx.restore();
      if (Rs <= 26) dot(ctx, mcx, mcy, 17, COLORS.orange);
    }
  },
};
