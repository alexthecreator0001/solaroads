// Prototype: panel grid -> 2x2 -> mark (radii) -> gap breath (✦) -> lockup, wordmark slides out
import { W, H, E, ease, lerp, clamp, COLORS, deg, invlerp } from '../engine/core.js';
import { MARK_ORDER, markCells, drawCell, gridCut, drawCellsShared, mixCell, sparkPath, brandGradient, GAP, CELL } from '../engine/shapes.js';
import { drawLogo, LOGO_W, LOGO_H, WORDMARK } from '../engine/logo.js';

const AX = 540, AY = 940;
export default {
  duration: 2.6,
  shutter: 0.5,
  samples: (t) => 1,
  draw(ctx, t) {
    const f = t * 60;
    const ms = 1.05; // mark scale while centred (449*1.05 = 471px)
    const S = CELL * ms, G = GAP * ms, side = 2 * S + G;
    // 0-24: 6x10 panel grid (cells) merges into 2x2 squares (gap = mark gap)
    const quadBox = { ring: [-1, -1], tile: [1, -1], leaf: [-1, 1], pin: [1, 1] };
    const final = markCells(AX, AY, ms, GAP);
    if (f < 40) {
      const pm = ease(f, 4, 24, E.inOutCubic); // grid -> 4 squares
      const pr = ease(f, 22, 38, E.snap); // squares -> mark radii/holes
      // panel: 6 cols x 10 rows over a portrait panel box; each quadrant's sub-cells merge into its square
      const panel = { x: AX - 300, y: AY - 500, w: 600, h: 1000 };
      for (const k of MARK_ORDER) {
        const [qx, qy] = quadBox[k];
        const sq = { x: AX + (qx < 0 ? -side / 2 : G / 2), y: AY + (qy < 0 ? -side / 2 : G / 2), w: S, h: S, r: [0, 0, 0, 0] };
        // the quadrant of the panel that maps to this square
        const qbox = { x: panel.x + (qx < 0 ? 0 : panel.w / 2), y: panel.y + (qy < 0 ? 0 : panel.h / 2), w: panel.w / 2, h: panel.h / 2 };
        if (pm < 1) {
          // 3x5 cells per quadrant, separated in panel; converge to an exact tiling of the square
          const cellsA = gridCut(sq, 3, 5, 0); // exact tiling of the target square
          const cellsB = gridCut(qbox, 3, 5, 1, { gap: 10, rad: 6, target: { x: qbox.x + 5, y: qbox.y + 5, w: qbox.w - 10, h: qbox.h - 10 } });
          const cells = cellsB.map((c, i) => mixCell(c, cellsA[i], pm));
          drawCellsShared(ctx, cells, AY - 520, AY + 520);
        } else {
          const tgt = { ...final[k] };
          drawCell(ctx, mixCell({ ...sq, hole: tgt.hole ? { x: tgt.hole.x + tgt.hole.w / 2, y: tgt.hole.y + tgt.hole.h / 2, w: 0, h: 0, r: [0, 0, 0, 0] } : undefined }, tgt, pr));
        }
      }
      return;
    }
    // 40-58: gap breath: close (✦ appears in white) then reopen with overshoot
    const close = ease(f, 40, 47, E.inQuart);
    const open = ease(f, 49, 60, E.punch);
    const g = GAP * (1 - close) + GAP * open * (close >= 1 ? 1 : 0);
    // 58-80: mark travels to lockup position, wordmark slides out from behind it
    const s1 = (W * 0.83) / LOGO_W;
    const lockX = AX - (LOGO_W * s1) / 2, lockY = AY - (LOGO_H * s1) / 2;
    const pl = ease(f, 60, 80, E.inOutCubic);
    const mcx = lerp(AX, lockX + 224.5 * s1, pl), mcy = lerp(AY, lockY + 224.5 * s1, pl);
    const sc = lerp(ms, s1, pl);
    if (f >= 60) {
      // letters slide out from the mark centre (reverse of the opening), clipped to the right of the mark
      const tq = 1 - ease(f, 64, 84, E.outExpo);
      ctx.save();
      const clip = new Path2D(); clip.rect(mcx + 230 * sc, 0, W, H); ctx.clip(clip);
      drawLogo(ctx, lockX, lockY, s1, { markAlpha: 0, letters: (i, l) => ({ dx: (224.5 - l.box.cx) * tq * (1 + i * 0.0) }) });
      ctx.restore();
    }
    const cells = markCells(mcx, mcy, sc, g);
    for (const k of MARK_ORDER) drawCell(ctx, cells[k], { innerShadow: ease(f, 80, 96, E.linear), scale: sc });
  },
};
