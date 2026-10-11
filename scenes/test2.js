// Word morph test: each frame shows three morphs at progress p = frame/30
import { W, E, COLORS } from '../engine/core.js';
import { loadFont, layout } from '../engine/text.js';
import { planWordMorph, drawWordMorph } from '../engine/wordmorph.js';
import { drawLogo } from '../engine/logo.js';

let plans = [];
export default {
  duration: 0.6,
  async load() {
    const f = await loadFont('../fonts/_test/Poppins-Bold.ttf');
    const pairs = [['lightning', 'lighting', 170], ['fire', 'wire', 250], ['solar', 'Solaro', 230], ['spark', 'sun', 250]];
    plans = pairs.map(([a, b, size], i) => planWordMorph(
      layout(f, a, size, { x: W / 2, y: 300 + i * 380, align: 'center', tracking: -0.03 }),
      layout(f, b, size, { x: W / 2, y: 300 + i * 380, align: 'center', tracking: -0.03 }),
      { caseInsensitive: true }));
  },
  draw(ctx, t) {
    const p = Math.min(1, t / 0.5);
    plans.forEach((pl) => drawWordMorph(ctx, pl, p, { ease: E.inOutCubic }));
    drawLogo(ctx, 90, 1700, 0.48);
  },
};
