// S0 — OPEN (f0–71): the lockup (= last frame) → the wordmark is drawn into the mark → two stepped
// zooms turn the four cells into windows of stone (two live 3D flints, two museum flints) → hand-axe
// ripple → the windows SLAM shut: the white space left between them is exactly the ✦ → invert →
// the ✦ ignites orange, sparks fly, windows fly out → the ✦ collapses into the anchor DOT.
import { W, H, E, ease, lerp, clamp, invlerp, COLORS, deg, rng } from '../../engine/core.js';
import { MARK_ORDER, markCells, drawCell, cellPath2D, sparkPath, brandGradient, GAP, CELL, cellToRings } from '../../engine/shapes.js';
import { drawLogo, LOGO_W, LOGO_H } from '../../engine/logo.js';
import { windowImage } from '../../engine/window.js';
import { sparks, dot as drawDot } from '../../engine/draw.js';
import { makeMorph, ringsToPath } from '../../engine/morph.js';
import { Stage3D, THREE } from '../../engine/three-layer.js';
import { GLTFLoader } from '../../node_modules/three/examples/jsm/loaders/GLTFLoader.js';
import { A, FONT, COPY, LANG } from './config.js';
import { DOT_R } from './spine.js';

const S_LOCK = (W * 0.83) / LOGO_W;                  // lockup scale (83 % W)
const LOCK_X = A[0] - (LOGO_W * S_LOCK) / 2, LOCK_Y = A[1] - (LOGO_H * S_LOCK) / 2;
const MARK_C0 = [LOCK_X + 224.5 * S_LOCK, LOCK_Y + 224.5 * S_LOCK];
const URL_Y = 1190;

// window contents per cell: ring/tile = live 3D flints, leaf/pin = museum flints, then hand-axe ripple
const PHOTO = {
  leaf: [[0, 'flint-nodule-kulturparken.cut', [0.45, 0.45], 2.6], [38, 'handaxe-red-acheulean-met.cut', [0.5, 0.52], 2.1]],
  pin: [[0, 'flint-core-met.cut', [0.5, 0.5], 2.3], [36, 'handaxe-teardrop-acheulean-met.cut', [0.5, 0.6], 2.0]],
};

let s3d, flintA, flintB, star2dot;
const loadGLB = (url) => new Promise((res, rej) => new GLTFLoader().load(url, (g) => res(g.scene), undefined, rej));
function fitFlint(obj, size) {
  obj.traverse((o) => { if (o.isMesh) { o.geometry.computeVertexNormals(); o.material.roughness = 0.55; o.material.metalness = 0; } });
  const box = new THREE.Box3().setFromObject(obj), v = new THREE.Vector3(), c = new THREE.Vector3();
  box.getSize(v); box.getCenter(c);
  obj.position.sub(c);
  const norm = new THREE.Group(); norm.add(obj); norm.scale.setScalar(size / Math.max(v.x, v.y, v.z));
  const g = new THREE.Group(); g.add(norm);
  return g;
}

// mark geometry of the open as a function of frame: centre, scale (px per mark unit), gap
function markState(f) {
  if (f < 16) {
    const k = 1 + 0.03 * ease(f, 12, 15, E.outCubic);
    return { cx: A[0] + (MARK_C0[0] - A[0]) * k, cy: A[1] + (MARK_C0[1] - A[1]) * k, s: S_LOCK * k, g: GAP };
  }
  if (f < 28) {
    const p = ease(f, 16, 28, E.inOutCubic);
    const k = 1.03;
    return { cx: lerp(A[0] + (MARK_C0[0] - A[0]) * k, A[0], p), cy: lerp(A[1] + (MARK_C0[1] - A[1]) * k, A[1], p), s: Math.exp(lerp(Math.log(S_LOCK * k), Math.log(0.95), p)), g: GAP };
  }
  // stepped zooms: f28 → ×1.474 (C 286), f31 → M2 (C 420), then slow push
  const s1 = 286 / CELL, s2 = 420 / CELL;
  let s = f < 31 ? s1 * Math.pow(1.006, f - 28) : s2 * Math.pow(1.004, Math.min(f, 42) - 31);
  let g = GAP;
  if (f >= 42) g = lerp(GAP, 0, ease(f, 42, 48, E.inQuart));
  return { cx: A[0], cy: A[1], s, g };
}

export default {
  name: 's0_open', f0: 0, f1: 72,
  needs: [[0, 72, ['flint-nodule-kulturparken.cut', 'flint-core-met.cut', 'handaxe-red-acheulean-met.cut', 'handaxe-teardrop-acheulean-met.cut']]],
  blur: [[16, 28, 6], [42, 48, 5], [50, 52, 6], [52, 58, 12], [62, 70, 5]],
  cues: [
    { f: 12, kind: 'whoosh', dur: 0.35, f0: 300, f1: 1800, shape: 'in', gain: -16 },
    { f: 18, kind: 'whoosh', dur: 0.2, f0: 2500, f1: 600, shape: 'in', gain: -12 },
    { f: 30, kind: 'stone', gain: -6 },
    { f: 30, kind: 'sub', dur: 0.35, freq: 46.2, gain: -10 },
    { f: 33, kind: 'stone', freq: 2900, gain: -8 },
    { f: 38, kind: 'tick', gain: -14 }, { f: 40, kind: 'tick', gain: -15 },
    { f: 42, kind: 'whoosh', dur: 0.12, f0: 500, f1: 5000, shape: 'in', gain: -12 },
    { f: 49, kind: 'stone', freq: 3400, gain: -2 },
    { f: 49, kind: 'impact', dur: 1.2, gain: -6 },
    { f: 50, kind: 'crackle', dur: 0.9, density: 120, gain: -6 },
    { f: 66, kind: 'pop', gain: -14 },
  ],
  async load() {
    s3d = new Stage3D(W, H);
    const fov = 26, d = H / 2 / Math.tan((fov / 2) * Math.PI / 180);
    Object.assign(s3d.camera, { fov, aspect: W / H, near: 10, far: d * 4 });
    s3d.camera.position.set(0, 0, d); s3d.camera.updateProjectionMatrix();
    s3d.key.position.set(-500, 900, 1600); s3d.key.intensity = 2.2; s3d.fill.intensity = 0.35;
    flintA = fitFlint(await loadGLB('../assets/3d/flint-0370-lite.glb'), 1);
    flintB = fitFlint(await loadGLB('../assets/3d/flint-0373-lite.glb'), 1);
    s3d.scene.add(flintA, flintB);
    // ✦ (R 24) -> dot (r 17) exact outline morph
    const st = new Path2D();
    const R = 24, pts = [];
    // sample sparkPath outline analytically: four concave arcs
    const P = [[0, -R], [R, 0], [0, R], [-R, 0]], C = [[R, -R], [R, R], [-R, R], [-R, -R]];
    for (let i = 0; i < 4; i++) {
      const a = P[i], b = P[(i + 1) % 4], o = C[i];
      const a0 = Math.atan2(a[1] - o[1], a[0] - o[0]), a1 = Math.atan2(b[1] - o[1], b[0] - o[0]);
      let da = a1 - a0; if (da > 0) da -= Math.PI * 2;
      for (let k = 0; k < 40; k++) { const t = a0 + (da * k) / 40; pts.push([A[0] + o[0] + R * Math.cos(t), A[1] + o[1] + R * Math.sin(t)]); }
    }
    const circ = []; for (let k = 0; k < 160; k++) { const t = -Math.PI / 2 + (k / 160) * Math.PI * 2; circ.push([A[0] + DOT_R * Math.cos(t), A[1] + DOT_R * Math.sin(t)]); }
    star2dot = makeMorph([pts], [circ], { n: 160 });
  },
  draw(ctx, f) {
    const F = Math.round(f);           // integer frame: hard cuts/inverts never blend across motion-blur sub-frames
    const inv = F >= 48 && F < 50; // invert flash
    if (inv) { ctx.fillStyle = COLORS.ink; ctx.fillRect(0, 0, W, H); }
    const m = markState(f);

    // ---- f0–27: lockup -> wordmark drawn into the mark (clipped at the mark's right edge)
    if (f < 28) {
      const tq = f < 16 ? 0 : ease(f, 16, 26, E.inExpo);
      const k = f < 16 ? 1 + 0.03 * ease(f, 12, 15, E.outCubic) : 1.03;
      const s = S_LOCK * k, ox = A[0] - (LOGO_W * s) / 2, oy = A[1] - (LOGO_H * s) / 2;
      if (tq < 0.999) {
        ctx.save();
        const clipX = m.cx + (CELL + GAP / 2) * m.s; // right edge of the mark
        const cl = new Path2D(); cl.rect(clipX, 0, W, H); ctx.clip(cl);
        drawLogo(ctx, ox, oy, s, { markAlpha: 0, letters: (i, l) => ({ dx: (224.5 - l.box.cx) * tq, s: 1 - 0.85 * tq }) });
        ctx.restore();
      }
      // solaro.sk under the lockup (identical to the end card), wiped out right->left f12–15
      const wipe = ease(f, 12, 16, E.inQuad);
      if (wipe < 1) drawUrl(ctx, k, wipe);
      const cells = markCells(m.cx, m.cy, m.s, m.g);
      for (const kk of MARK_ORDER) drawCell(ctx, cells[kk], { innerShadow: f < 16 ? 1 : 1 - ease(f, 16, 22, E.linear), scale: m.s });
      return;
    }

    // ---- f28–57: the cells are windows of stone; slam; ignite; fly out
    const spread = f >= 50 ? 2400 * ease(f, 50, 58, E.inExpo) : 0;
    const cells = markCells(m.cx, m.cy, m.s, m.g, spread / m.s);
    if (F < 58) {
      // live 3D flints for ring + tile windows (rotating ~2°/f), museum flints for leaf + pin
      const ring = cells.ring, tile = cells.tile;
      flintA.scale.setScalar(ring.w * 2.25); flintA.position.set(ring.x + ring.w / 2 - W / 2, -(ring.y + ring.h / 2 - H / 2), 0);
      flintA.rotation.set(0.5 + f * 0.012, 0.9 + f * 0.035, -0.2);
      flintB.scale.setScalar(tile.w * 2.35); flintB.position.set(tile.x + tile.w / 2 - W / 2, -(tile.y + tile.h / 2 - H / 2), 0);
      flintB.rotation.set(-0.35, -0.5 - f * 0.03, 0.4 + f * 0.01);
      s3d.renderer.render(s3d.scene, s3d.camera);
      const filt = inv ? 'grayscale(1) contrast(1.2) invert(1)' : 'grayscale(1) contrast(1.2) brightness(1.04)';
      for (const kk of ['ring', 'tile']) {
        ctx.save(); ctx.clip(cellPath2D(cells[kk]), 'evenodd'); ctx.filter = filt;
        ctx.drawImage(s3d.canvas, 0, 0, W, H); ctx.restore();
      }
      for (const kk of ['leaf', 'pin']) {
        const seq = PHOTO[kk];
        let cur = seq[0];
        for (const e of seq) if (F >= e[0]) cur = e;
        const c = cells[kk];
        windowImage(ctx, cur[1], { mode: 'cov', clip: cellPath2D(c), box: c, focus: cur[2], zoom: cur[3], push: Math.pow(1.01, f - 28), filter: inv ? 'invert(1)' : null });
      }
      // the anchor dot sits in the gutter cross from f34 until the slam closes on it
      if (F >= 34 && F < 48) {
        const pop = 1 + 0.15 * Math.sin(Math.PI * clamp((f - 34) / 4));
        drawDot(ctx, A[0], A[1], DOT_R * pop * clamp((f - 33) / 1.5), COLORS.orange);
      }
    }

    // ---- ✦: ignites at f48 exactly in the negative space, overshoots, then collapses into the DOT
    if (F >= 48) {
      const R0 = (CELL / 2) * m.s; // = 210 at the slam
      let R = R0;
      if (f < 58) R = R0 * (1 + 0.1 * Math.sin(Math.PI * clamp((f - 50) / 7)) * (f >= 50 ? 1 : 0));
      else R = Math.exp(lerp(Math.log(R0), Math.log(24), ease(f, 58, 66, E.inOutCubic)));
      const rot = deg(90) * ease(f, 58, 66, E.inOutCubic);
      // sparks first, so they emerge from behind the ✦
      sparks(ctx, f / 60, 48 / 60, A[0], A[1], { count: 24, seed: 7, speed: 1900, spread: Math.PI * 2, gravity: 2400, life: 0.55, width: 10 });
      if (f < 66) {
        // fill 0.6 px oversize so no anti-aliased seam shows against the closed cells
        ctx.fillStyle = brandGradient(ctx, A[1] - R, A[1] + R);
        ctx.fill(sparkPath(A[0], A[1], R + (f < 50 ? 0.6 : 0), rot));
      } else {
        const p = ease(f, 66, 70, E.inOutCubic);
        ctx.fillStyle = brandGradient(ctx, A[1] - 24, A[1] + 24);
        ctx.fill(ringsToPath(star2dot(p)), 'evenodd');
      }
    }
  },
};

function drawUrl(ctx, k, wipe) {
  if (!FONT) return;
  const txt = COPY[LANG].url, size = 46 * k;
  const p = FONT.getPath(txt, 0, 0, size);
  const bb = p.getBoundingBox();
  const x0 = A[0] - (bb.x2 - bb.x1) / 2 - bb.x1, y0 = A[1] + (URL_Y - A[1]) * k;
  ctx.save();
  const cl = new Path2D(); cl.rect(0, 0, x0 + bb.x1 + (bb.x2 - bb.x1) * (1 - wipe), H); ctx.clip(cl);
  ctx.translate(x0, y0);
  ctx.fillStyle = COLORS.ink;
  ctx.fill(new Path2D(p.toPathData(2)));
  ctx.restore();
}
