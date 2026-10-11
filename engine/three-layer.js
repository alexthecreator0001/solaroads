// Clean 3D: extruded Solaro cells rendered with three.js into an offscreen WebGL canvas,
// then composited into the 2D film canvas.
import * as THREE from 'three';
import { RoomEnvironment } from '../node_modules/three/examples/jsm/environments/RoomEnvironment.js';
import { clamp } from './core.js';

export { THREE };

// Cell spec (x,y,w,h,r[tl,tr,br,bl], hole) in a y-down space -> THREE.Shape (y-up), centred at (cx, cy)
export function cellShape(c, cx = 0, cy = 0) {
  const s = new THREE.Shape();
  trace(s, c, cx, cy, false);
  if (c.hole && c.hole.w > 0.01) {
    const h = new THREE.Path();
    trace(h, c.hole, cx, cy, true);
    s.holes.push(h);
  }
  return s;
}

function trace(p, c, cx, cy, reverse) {
  const m = Math.min(c.w, c.h) / 2;
  const [tl, tr, br, bl] = c.r.map((v) => clamp(v, 0, m));
  // convert to y-up local coords
  const X = (x) => x - cx, Y = (y) => -(y - cy);
  const x0 = c.x, y0 = c.y, x1 = c.x + c.w, y1 = c.y + c.h;
  const pts = [];
  const arc = (ax, ay, r, a0, a1) => {
    if (r <= 0.001) { pts.push([ax + r * Math.cos(a0), ay + r * Math.sin(a0)]); return; }
    const n = Math.max(6, Math.ceil(Math.abs(a1 - a0) / (Math.PI / 24)));
    for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([ax + r * Math.cos(a), ay + r * Math.sin(a)]); }
  };
  // clockwise in y-down = counter-clockwise in y-up
  arc(x1 - tr, y0 + tr, tr, -Math.PI / 2, 0);
  arc(x1 - br, y1 - br, br, 0, Math.PI / 2);
  arc(x0 + bl, y1 - bl, bl, Math.PI / 2, Math.PI);
  arc(x0 + tl, y0 + tl, tl, Math.PI, Math.PI * 1.5);
  const seq = reverse ? pts.reverse() : pts;
  seq.forEach(([x, y], i) => (i ? p.lineTo(X(x), Y(y)) : p.moveTo(X(x), Y(y))));
  p.closePath();
}

export class Stage3D {
  constructor(w = 1080, h = 1080) {
    this.w = w; this.h = h;
    this.canvas = document.createElement('canvas');
    this.canvas.width = w; this.canvas.height = h;
    this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(w, h, false);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.NeutralToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    this.scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.03).texture;
    this.camera = new THREE.PerspectiveCamera(26, w / h, 1, 20000);
    this.camera.position.set(0, 0, 2000);
    this.key = new THREE.DirectionalLight(0xffffff, 1.6);
    this.key.position.set(-600, 900, 1400);
    this.scene.add(this.key);
    this.fill = new THREE.DirectionalLight(0xfff1e8, 0.5);
    this.fill.position.set(800, -300, 600);
    this.scene.add(this.fill);
  }
  material(color = 0xff4513) {
    return new THREE.MeshPhysicalMaterial({ color, roughness: 0.38, metalness: 0.0, clearcoat: 0.5, clearcoatRoughness: 0.3, envMapIntensity: 0.9 });
  }
  extrude(cell, { depth = 60, bevel = 7, cx, cy, material } = {}) {
    const ccx = cx ?? cell.x + cell.w / 2, ccy = cy ?? cell.y + cell.h / 2;
    const geo = new THREE.ExtrudeGeometry(cellShape(cell, ccx, ccy), {
      depth, bevelEnabled: bevel > 0, bevelThickness: bevel, bevelSize: bevel * 0.85, bevelSegments: 5, curveSegments: 24,
    });
    geo.translate(0, 0, -depth / 2);
    return new THREE.Mesh(geo, material || this.material());
  }
  render(ctx, dx, dy, dw, dh, alpha = 1) {
    this.renderer.render(this.scene, this.camera);
    ctx.save();
    ctx.globalAlpha *= alpha;
    ctx.drawImage(this.canvas, dx, dy, dw ?? this.w, dh ?? this.h);
    ctx.restore();
  }
}
