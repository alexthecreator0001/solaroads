import { W, E, COLORS } from '../engine/core.js';
import { loadFont, layout, layoutHybrid } from '../engine/text.js';
import { drawWord } from '../engine/draw.js';
import { planWordMorph, drawWordMorph } from '../engine/wordmorph.js';
import { drawLogo } from '../engine/logo.js';
let L = [], plan;
export default {
  duration: 0.6,
  async load() {
    const f = await loadFont('../fonts/_test/Poppins-Bold.ttf');
    const words = ['spark', 'fire', 'lightning', 'solar'];
    words.forEach((w, i) => { L.push(layout(f, w, 220, { x: 270, y: 260 + i * 300, align: 'center', tracking: -0.02 })); L.push(layoutHybrid(f, w, 220, { x: 810, y: 260 + i * 300, align: 'center', tracking: -0.02 })); });
    plan = planWordMorph(layoutHybrid(f, 'solar', 260, { x: W / 2, y: 1500, align: 'center', tracking: -0.02 }), layoutHybrid(f, 'Solaro', 260, { x: W / 2, y: 1500, align: 'center', tracking: -0.02 }), { caseInsensitive: true });
  },
  draw(ctx, t) {
    L.forEach((l) => drawWord(ctx, l, { color: COLORS.ink }));
    drawWordMorph(ctx, plan, Math.min(1, t / 0.5), { ease: E.inOutCubic });
    drawLogo(ctx, 540 - 0.5 * 1866 * 0.5, 1700, 0.5);
  },
};
