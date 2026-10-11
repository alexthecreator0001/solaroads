// 3D flint test: two photogrammetry flints approach and strike
import { W, H, E, ease, lerp } from '../engine/core.js';
import { Stage3D, THREE } from '../engine/three-layer.js';
import { GLTFLoader } from '../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
let s3d, A, B;
async function loadGLB(url) {
  return new Promise((res, rej) => new GLTFLoader().load(url, (g) => res(g.scene), undefined, rej));
}
function fit(obj, size) {
  obj.traverse((o) => { if (o.isMesh) { o.geometry.computeVertexNormals(); o.material.roughness = 0.55; o.material.metalness = 0; } });
  const box = new THREE.Box3().setFromObject(obj), v = new THREE.Vector3(); box.getSize(v);
  const c = new THREE.Vector3(); box.getCenter(c);
  const k = size / Math.max(v.x, v.y, v.z);
  const g = new THREE.Group(); obj.position.sub(c); g.add(obj); g.scale.setScalar(k); return g;
}
export default {
  duration: 1, samples: () => 1,
  async load() {
    s3d = new Stage3D(1080, 1920);
    s3d.camera.aspect = 1080 / 1920; s3d.camera.updateProjectionMatrix();
    s3d.camera.position.set(0, 0, 3200);
    A = fit(await loadGLB('../assets/3d/flint-0370-lite.glb'), 520);
    B = fit(await loadGLB('../assets/3d/flint-0373-lite.glb'), 520);
    s3d.scene.add(A, B);
  },
  draw(ctx, t) {
    const p = ease(t, 0, 0.5, E.inCubic);
    A.position.set(lerp(-900, -250, p), 40, 0); A.rotation.set(0.3, t * 2, 0.2);
    B.position.set(lerp(900, 250, p), -40, 0); B.rotation.set(-0.2, -t * 2, 0.4);
    s3d.renderer.render(s3d.scene, s3d.camera);
    ctx.save(); ctx.filter = 'grayscale(1) contrast(1.15)'; ctx.drawImage(s3d.canvas, 0, 0, W, H); ctx.restore();
  },
};
