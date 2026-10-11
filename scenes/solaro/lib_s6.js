// S6 helpers: panel geometry, the proof-photo atlas (one canvas, every cell's own cover-crop at its
// zoom-1 screen position) and the lit 3D flip wave (60 extruded slabs, three.js via Stage3D).
//
// The 3D stage is built so that both ends of the flip are pixel-identical to the 2D renders:
//  - camera fov 26°, z = 0 maps 1:1 to screen px at zoom 1; zoom-out = dolly (z = d / s), A stays fixed;
//  - the slab's visible cap always lies in z = 0 when flat (front at θ = 0, back at θ = 180°);
//  - thickness ramps in with |sin θ| so no perspective sliver of the side walls shows when flat;
//  - shading is a NORMALISED lambert: a face looking straight at the camera gets factor 1 exactly, so the
//    photo front equals the 2D atlas and the orange back equals drawCellsShared's one shared gradient;
//    the specular sheen is weighted by sin²θ (zero when flat).
import { THREE, Stage3D, cellShape } from '../../engine/three-layer.js';
import { gridCut, mixCell } from '../../engine/shapes.js';
import { W, H } from '../../engine/core.js';
import { PANEL_FRAME } from './layouts.js';
import { A } from './config.js';

export const GAP_P = 30.9, RAD_P = 17.9;
export const FRAME = { x: 0, y: 0, w: W, h: H };
// p = 1: the 6x10 PANEL (layouts.panel geometry)
export const PANEL1 = gridCut(PANEL_FRAME, 6, 10, 1, { gap: GAP_P, rad: RAD_P });
// p = 0: an exact tiling of the WHOLE frame whose seams are the PANEL's gutter centre-lines (outer cells reach
// the frame edges), so the score lines are drawn exactly where the gutters will open and A is the centre cross.
export const SCORE_X = [1, 2, 3, 4, 5].map((i) => (PANEL1[i - 1].x + PANEL1[i - 1].w + PANEL1[i].x) / 2);
export const SCORE_Y = [1, 2, 3, 4, 5, 6, 7, 8, 9].map((j) => (PANEL1[(j - 1) * 6].y + PANEL1[(j - 1) * 6].h + PANEL1[j * 6].y) / 2);
const X0 = [0, ...SCORE_X, W], Y0 = [0, ...SCORE_Y, H];
export const PANEL0 = PANEL1.map((c) => ({ x: X0[c.i], y: Y0[c.j], w: X0[c.i + 1] - X0[c.i], h: Y0[c.j + 1] - Y0[c.j], r: [0, 0, 0, 0] }));
export const panelCut = (p) => (p <= 0 ? PANEL0.map((a, k) => ({ ...a, i: PANEL1[k].i, j: PANEL1[k].j, k }))
  : PANEL1.map((b, k) => Object.assign(mixCell(PANEL0[k], b, p), { i: b.i, j: b.j, k })));

// rings around the centre 2x2: Manhattan (proof wave, diagonal fronts) and Chebyshev (flip, square fronts)
export const ringOf = (i, j) => [Math.abs(i - 2.5) - 0.5, Math.abs(j - 4.5) - 0.5];
export const manhattan = (i, j) => { const [a, b] = ringOf(i, j); return a + b; };
export const chebyshev = (i, j) => { const [a, b] = ringOf(i, j); return Math.max(a, b); };

// camera transform about A
export const camApply = (ctx, s) => { ctx.translate(A[0], A[1]); ctx.scale(s, s); ctx.translate(-A[0], -A[1]); };
export const camCell = (c, s) => ({
  ...c, x: A[0] + (c.x - A[0]) * s, y: A[1] + (c.y - A[1]) * s, w: c.w * s, h: c.h * s, r: c.r.map((v) => v * s),
});

// ------------------------------------------------------------------ proof photo assignment
// crops: [{key, fx, fy, z, kind}] — kind 'roof' | 'house' | 'kit' (equipment)
// Greedy, deterministic: visit cells centre-out; pick the least-used crop whose PHOTO is not already in the
// 8-neighbourhood (and never two 'kit' cells touching); the four centre cells get the hero list in order.
export function assignCrops(crops, heroes = []) {
  const order = PANEL1.map((c) => c).sort((a, b) => manhattan(a.i, a.j) - manhattan(b.i, b.j) || chebyshev(a.i, a.j) - chebyshev(b.i, b.j) || a.k - b.k);
  const out = new Array(60).fill(null);
  const uses = new Map(crops.map((c, n) => [n, 0]));
  const photoUses = new Map();
  let h = 0, salt = 0;
  for (const c of order) {
    const nb = [], nb2 = [];
    for (let dj = -2; dj <= 2; dj++) for (let di = -2; di <= 2; di++) {
      if (!di && !dj) continue;
      const ii = c.i + di, jj = c.j + dj;
      if (ii < 0 || ii > 5 || jj < 0 || jj > 9) continue;
      const o = out[jj * 6 + ii];
      if (o) (Math.abs(di) <= 1 && Math.abs(dj) <= 1 ? nb : nb2).push(o);
    }
    let pick = null;
    if (h < heroes.length && manhattan(c.i, c.j) === 0) { const hk = heroes[h++]; pick = crops.findIndex((x) => x.key === hk); }
    if (pick == null || pick < 0) {
      let best = Infinity;
      crops.forEach((cr, n) => {
        if (nb.some((o) => o.key === cr.key)) return;
        if (cr.kind === 'kit' && nb.some((o) => o.kind === 'kit')) return;
        const score = uses.get(n) * 100 + (photoUses.get(cr.key) || 0) * 10 + nb2.filter((o) => o.key === cr.key).length * 60
          + ((n * 7 + salt * 13) % 11) * 0.1;
        if (score < best) { best = score; pick = n; }
      });
    }
    salt++;
    const cr = crops[pick];
    uses.set(pick, uses.get(pick) + 1);
    photoUses.set(cr.key, (photoUses.get(cr.key) || 0) + 1);
    out[c.k] = cr;
  }
  return out;
}

// Draw every cell's crop into a W x H canvas at its zoom-1 PANEL position (with bleed so edge texels are photo).
export function buildAtlas(assign, getImage, bleed = 8) {
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const g = cv.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, W, H);
  g.imageSmoothingEnabled = true;
  g.imageSmoothingQuality = 'high';
  for (const c of PANEL1) {
    const cr = assign[c.k];
    const im = getImage(cr.key);
    const side = Math.min(im.width, im.height) / cr.z;
    let sx = cr.fx * im.width - side / 2, sy = cr.fy * im.height - side / 2;
    sx = Math.max(0, Math.min(im.width - side, sx));
    sy = Math.max(0, Math.min(im.height - side, sy));
    // the visible cell shows exactly the crop square; the bleed extends it proportionally
    const k = side / c.w;
    g.drawImage(im, sx - bleed * k, sy - bleed * k, side + 2 * bleed * k, side + 2 * bleed * k, c.x - bleed, c.y - bleed, c.w + 2 * bleed, c.h + 2 * bleed);
  }
  return cv;
}

// ------------------------------------------------------------------ 3D flip
const VS = /* glsl */ `
uniform vec2 uCenter;
varying vec3 vObjP;
varying vec3 vObjN;
varying vec3 vN;
varying vec3 vViewP;
varying vec3 vWorldP;
varying vec2 vUv;
void main() {
  vObjP = position;
  vObjN = normal;
  vN = normalize(normalMatrix * normal);
  vec4 wp = modelMatrix * vec4(position, 1.0);
  vWorldP = wp.xyz;
  vec4 vp = viewMatrix * wp;
  vViewP = vp.xyz;
  // texture coordinate = this point's zoom-1 screen position inside the atlas
  float sx = uCenter.x + position.x, sy = uCenter.y - position.y;
  vUv = vec2(sx / ${W.toFixed(1)}, 1.0 - sy / ${H.toFixed(1)});
  gl_Position = projectionMatrix * vp;
}`;

const FS = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uTop;
uniform vec3 uBot;
uniform float uY0;
uniform float uY1;
uniform vec3 uL;
uniform float uAmb;
uniform float uSpecW;
uniform float uSide;
varying vec3 vObjP;
varying vec3 vObjN;
varying vec3 vN;
varying vec3 vViewP;
varying vec3 vWorldP;
varying vec2 vUv;
void main() {
  vec3 N = normalize(vN);
  if (!gl_FrontFacing) N = -N;
  bool front = vObjN.z > 0.02 && vObjP.z > 0.0;     // front cap + front bevel: the photo
  bool side = abs(vObjN.z) <= 0.02;                 // straight walls
  float g = clamp((uY0 - vWorldP.y) / (uY0 - uY1), 0.0, 1.0);
  vec3 orange = mix(uTop, uBot, g);
  vec3 base = front ? texture2D(uMap, vUv).rgb : orange * (side ? uSide : 1.0);
  // normalised lambert: a face looking at the camera (normal +z) gets exactly 1.0
  float d0 = uAmb + (1.0 - uAmb) * max(uL.z, 0.0);
  float d = (uAmb + (1.0 - uAmb) * max(dot(N, uL), 0.0)) / d0;
  vec3 col = base * d;
  // satin sheen (Blinn), only while the slab is turning
  vec3 V = normalize(-vViewP);
  vec3 Hh = normalize(uL + V);
  float nh = max(dot(N, Hh), 0.0);
  float sp = front ? 0.18 * pow(nh, 30.0) : (0.30 * pow(nh, 14.0) + 0.35 * pow(nh, 90.0));
  col += vec3(sp * uSpecW);
  gl_FragColor = vec4(col, 1.0);
}`;

const hex3 = (h) => { const s = h.replace('#', ''); return new THREE.Vector3(...[0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16) / 255)); };

export class Flip3D {
  constructor(scale = 1, { depth = 12, bevel = 2, fov = 26 } = {}) {
    this.st = new Stage3D(Math.round(W * scale), Math.round(H * scale));
    this.st.renderer.toneMapping = THREE.NoToneMapping;
    this.fov = fov;
    this.d = H / 2 / Math.tan((fov / 2) * Math.PI / 180);
    const cam = this.st.camera;
    cam.fov = fov; cam.aspect = W / H; cam.updateProjectionMatrix();
    this.depth = depth; this.bevel = bevel; this.hz = depth / 2 + bevel;
    // one shared geometry: the PANEL cell inset by the bevel (the bevel grows it back to the exact cell)
    const c = PANEL1[0], b = bevel;
    const inset = { x: c.x + b, y: c.y + b, w: c.w - 2 * b, h: c.h - 2 * b, r: c.r.map((v) => v - b) };
    const geo = new THREE.ExtrudeGeometry(cellShape(inset, c.x + c.w / 2, c.y + c.h / 2), {
      depth, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 3, curveSegments: 8, steps: 1,
    });
    geo.translate(0, 0, -depth / 2);
    this.geo = geo;
    this.tex = null;
    this.group = new THREE.Group();
    this.group.position.set(0, H / 2 - A[1], 0); // pivot = A
    this.st.scene.add(this.group);
    // panel gradient span in world y (zoom-1 screen y -> world y = H/2 - y)
    const y0 = H / 2 - PANEL_FRAME.y, y1 = H / 2 - (PANEL_FRAME.y + PANEL_FRAME.h);
    const L = new THREE.Vector3(-0.42, 0.72, 0.55).normalize();
    this.meshes = PANEL1.map((cell) => {
      const mat = new THREE.ShaderMaterial({
        vertexShader: VS, fragmentShader: FS,
        uniforms: {
          uMap: { value: null }, uCenter: { value: new THREE.Vector2(cell.x + cell.w / 2, cell.y + cell.h / 2) },
          uTop: { value: hex3('#FF5E2B') }, uBot: { value: hex3('#FF3D00') }, uY0: { value: y0 }, uY1: { value: y1 },
          uL: { value: L }, uAmb: { value: 0.42 }, uSpecW: { value: 0 }, uSide: { value: 0.86 },
        },
        side: THREE.FrontSide,
      });
      const m = new THREE.Mesh(geo, mat);
      m.userData.cell = cell;
      // position relative to the pivot (A)
      m.position.set(cell.x + cell.w / 2 - A[0], A[1] - (cell.y + cell.h / 2), 0);
      this.group.add(m);
      return m;
    });
  }
  setAtlas(canvas) {
    if (this.tex) this.tex.dispose();
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.NoColorSpace;
    t.generateMipmaps = true;
    t.minFilter = THREE.LinearMipmapLinearFilter;
    t.magFilter = THREE.LinearFilter;
    t.anisotropy = 4;
    t.flipY = true;
    t.needsUpdate = true;
    this.tex = t;
    for (const m of this.meshes) m.material.uniforms.uMap.value = t;
  }
  // theta(k) -> flip angle of cell k (radians, 0..π); s = camera zoom about A; tilt = [rx, ry] of the panel
  render(ctx, s, theta, tilt = [0, 0]) {
    const cam = this.st.camera, z = this.d / s;
    cam.position.set(0, (H / 2 - A[1]) * (1 - 1 / s), z);
    cam.near = Math.max(10, z - 2500); cam.far = z + 2500;
    cam.updateProjectionMatrix();
    this.group.rotation.set(tilt[0], tilt[1], 0);
    for (const m of this.meshes) {
      const th = theta(m.userData.cell.k);
      const sn = Math.sin(th);
      const sz = Math.max(0.04, Math.min(1, Math.abs(sn) * 3)); // ≥ 0.6 px: no z-fight of the bevels when flat
      m.scale.set(1, 1, sz);
      m.rotation.set(th, 0, 0);
      m.position.z = -this.hz * sz;
      m.material.uniforms.uSpecW.value = sn * sn;
    }
    this.st.renderer.render(this.st.scene, cam);
    ctx.drawImage(this.st.canvas, 0, 0, W, H);
  }
}
