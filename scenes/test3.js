// 3D material look test: 4 variants side by side
import { W, H } from '../engine/core.js';
import { MARK, MARK_ORDER } from '../engine/shapes.js';
import { Stage3D, THREE } from '../engine/three-layer.js';
let stages = [];
const VARIANTS = [
  { tone: THREE.NoToneMapping, env: 0.6, rough: 0.35, cc: 0.4, emis: 0.0 },
  { tone: THREE.NoToneMapping, env: 0.35, rough: 0.5, cc: 0.2, emis: 0.12 },
  { tone: THREE.ACESFilmicToneMapping, env: 0.8, rough: 0.3, cc: 0.6, emis: 0.1 },
  { tone: THREE.NoToneMapping, env: 0.5, rough: 0.28, cc: 0.8, emis: 0.18 },
];
export default {
  duration: 0.2,
  async load() {
    for (const v of VARIANTS) {
      const s = new Stage3D(540, 540);
      s.renderer.toneMapping = v.tone;
      const g = new THREE.Group();
      for (const k of MARK_ORDER) {
        const mat = new THREE.MeshPhysicalMaterial({ color: new THREE.Color('#FF4A12'), roughness: v.rough, clearcoat: v.cc, clearcoatRoughness: 0.25, envMapIntensity: v.env, emissive: new THREE.Color('#FF3D00'), emissiveIntensity: v.emis });
        g.add(s.extrude(MARK[k], { cx: 224.5, cy: 224.5, depth: 70, bevel: 9, material: mat }));
      }
      g.rotation.set(-0.35, 0.55, 0.05);
      g.scale.setScalar(0.7);
      s.scene.add(g);
      stages.push(s);
    }
  },
  draw(ctx) {
    stages.forEach((s, i) => s.render(ctx, (i % 2) * 540, Math.floor(i / 2) * 540 + 300, 540, 540));
    // reference swatches
    const g = ctx.createLinearGradient(0, 1500, 0, 1700); g.addColorStop(0, '#FF5E2B'); g.addColorStop(1, '#FF3D00');
    ctx.fillStyle = g; ctx.fillRect(140, 1500, 800, 200);
  },
};
