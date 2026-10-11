// Engine smoke test: cell morphs, glyph morph, 3D extruded mark, motion blur.
import { W, H, E, ease, lerp, COLORS } from '../engine/core.js';
import { MARK, MARK_ORDER, placeCell, mixCell, drawCell, drawMark, circle } from '../engine/shapes.js';
import { loadFont, layout } from '../engine/text.js';
import { makeMorph, ringsToPath } from '../engine/morph.js';
import { Stage3D } from '../engine/three-layer.js';

let font, morph, s3d, group;

export default {
  duration: 3,
  shutter: 0.5,
  samples: (t) => (t > 2 ? 6 : 1),
  async load() {
    font = await loadFont('../fonts/_test/Poppins-Bold.ttf');
    const a = layout(font, 'fire', 260, { x: W / 2, y: 1500, align: 'center' });
    const b = layout(font, 'wire', 260, { x: W / 2, y: 1500, align: 'center' });
    morph = { a, b, m: makeMorph(a.items[0].rings, b.items[0].rings, { n: 200 }) };
    s3d = new Stage3D(1080, 1080);
    group = new s3d.renderer.constructor === undefined ? null : null;
    const THREE = await import('three');
    group = new THREE.Group();
    for (const k of MARK_ORDER) {
      const c = MARK[k];
      const m = s3d.extrude(c, { cx: 224.5, cy: 224.5, depth: 70, bevel: 8 });
      group.add(m);
    }
    group.scale.setScalar(1.4);
    s3d.scene.add(group);
  },
  draw(ctx, t) {
    // 1) mark cell morph ring -> tile -> pin
    const s = 1.2, ox = W / 2 - 449 * s / 2, oy = 160;
    const p = ease(t, 0.2, 1.2, E.snap);
    for (const k of MARK_ORDER) {
      const from = placeCell(MARK[k], ox, oy, s);
      const to = { ...circle(W / 2, oy + 449 * s / 2, 120 + 40 * MARK_ORDER.indexOf(k)), rot: 0 };
      drawCell(ctx, mixCell(from, to, p), { alpha: 0.5 });
    }
    // 2) glyph morph f -> w
    const mp = ease(t, 0.5, 1.3, E.swift);
    ctx.fillStyle = COLORS.ink;
    ctx.fill(ringsToPath(morph.m(mp)), 'evenodd');
    for (let i = 1; i < morph.a.items.length; i++) ctx.fill(new Path2D(morph.a.items[i].d));
    // 3) 3D
    group.rotation.y = t * 2.2;
    group.rotation.x = Math.sin(t * 1.3) * 0.4;
    s3d.render(ctx, 0, 700, 1080, 1080);
  },
};
