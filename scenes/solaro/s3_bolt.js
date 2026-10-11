import { A, word, LANG } from './config.js';
import { flame } from './spine.js';
import { drawCell } from '../../engine/shapes.js';
export default {
  name: 's3_bolt', f0: 222, f1: 344,
  async load() {},
  draw(ctx, f) { drawCell(ctx, flame(f)); ctx.fillStyle = '#000'; ctx.fillRect(538, 0, 4, 1920); ctx.fillRect(0, 938, 1080, 4); },
};
