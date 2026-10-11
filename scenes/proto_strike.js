// Prototype: two real (photogrammetry) flints strike at the anchor dot -> orange spark burst
import { W, H, E, ease, lerp, clamp, COLORS, rng } from '../engine/core.js';
import { Stage3D, THREE } from '../engine/three-layer.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { sparks, dot, taperStroke } from '../engine/draw.js';
import { sparkPath, brandGradient } from '../engine/shapes.js';

const AX = 540, AY = 940;
let s3d, A, B;
const loadGLB = (url) => new Promise((res, rej) => new GLTFLoader().load(url, (g) => res(g.scene), undefined, rej));
function fit(obj, size) {
  obj.traverse((o) => { if (o.isMesh) { o.geometry.computeVertexNormals(); o.material.roughness = 0.5; o.material.metalness = 0; } });
  const box = new THREE.Box3().setFromObject(obj), v = new THREE.Vector3(), c = new THREE.Vector3();
  box.getSize(v); box.getCenter(c);
  obj.position.sub(c);
  const g = new THREE.Group(); g.add(obj); g.scale.setScalar(size / Math.max(v.x, v.y, v.z));
  return g;
}
// world units == px at z=0 for this camera
function setupCamera(cam) {
  const fov = 26, d = H / 2 / Math.tan((fov / 2) * Math.PI / 180);
  cam.fov = fov; cam.aspect = W / H; cam.position.set(0, 0, d); cam.near = 10; cam.far = d * 4; cam.updateProjectionMatrix();
}
const HIT = 14; // impact frame

export default {
  duration: 1.0,
  shutter: 0.5,
  samples: (t) => { const f = t * 60; return f > 6 && f < 20 ? 5 : 1; },
  async load() {
    s3d = new Stage3D(W, H);
    setupCamera(s3d.camera);
    s3d.key.position.set(-500, 900, 1600); s3d.key.intensity = 2.2; s3d.fill.intensity = 0.35;
    A = fit(await loadGLB('../assets/3d/flint-0370-lite.glb'), 560);
    B = fit(await loadGLB('../assets/3d/flint-0373-lite.glb'), 600);
    s3d.scene.add(A, B);
  },
  draw(ctx, t) {
    const f = t * 60;
    const shake = f >= HIT && f < HIT + 6 ? (rng(Math.floor(f))() - 0.5) * 14 * (1 - (f - HIT) / 6) : 0;
    // approach (accelerating) -> hit -> recoil apart slowly
    const inP = ease(f, 0, HIT, E.inCubic);
    const out = f > HIT ? E.outCubic(clamp((f - HIT) / 40)) : 0;
    const gapA = lerp(1000, 290, inP) + 180 * out, gapB = lerp(1000, 300, inP) + 200 * out;
    A.position.set(-gapA, 30 + shake, 0); A.rotation.set(0.35 + f * 0.01, 0.9 + f * 0.035, -0.25 - out * 0.4);
    B.position.set(gapB, -20 + shake, 0); B.rotation.set(-0.3, -0.6 - f * 0.03, 0.5 + out * 0.5);
    s3d.renderer.render(s3d.scene, s3d.camera);
    ctx.save();
    ctx.filter = 'grayscale(1) contrast(1.25) brightness(1.05)';
    ctx.drawImage(s3d.canvas, 0, 0, W, H);
    ctx.restore();
    // spark: dot before hit; burst at hit
    if (f < HIT) dot(ctx, AX, AY, 17, COLORS.orange);
    else {
      const k = (f - HIT);
      const R = 120 * E.outExpo(clamp(k / 5)) * Math.exp(-k / 14);
      if (R > 4) { ctx.fillStyle = brandGradient(ctx, AY - R, AY + R); ctx.fill(sparkPath(AX, AY, R, k * 0.04)); }
      sparks(ctx, t, HIT / 60, AX, AY, { count: 26, seed: 9, speed: 2200, spread: Math.PI * 2, gravity: 2400, life: 0.6, width: 9 });
      dot(ctx, AX, AY, 17 * (1 + 0.6 * Math.exp(-k / 6)), COLORS.orange);
    }
  },
};
