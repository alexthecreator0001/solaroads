// Core constants, math and easing for the Solaro ad renderer.
// Everything is a pure function of time so any frame can be rendered in isolation.

export const W = 1080;
export const H = 1920;
export const FPS = 60;

export const COLORS = {
  paper: '#FFFFFF',
  ink: '#1C1C1C',
  orange: '#FF3D00',
  orangeTop: '#FF5E2B',
  orangeLight: '#FF7A4D',
};

export const clamp = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
export const lerp = (a, b, t) => a + (b - a) * t;
export const invlerp = (a, b, x) => clamp((x - a) / (b - a));
export const remap = (x, a, b, c, d) => lerp(c, d, invlerp(a, b, x));
export const smoothstep = (a, b, x) => { const t = invlerp(a, b, x); return t * t * (3 - 2 * t); };
export const fr = (n) => n / FPS; // frames -> seconds

// ---------------------------------------------------------------- easing
const pow = Math.pow;
export const E = {
  linear: (t) => t,
  inQuad: (t) => t * t,
  outQuad: (t) => 1 - (1 - t) * (1 - t),
  inOutQuad: (t) => (t < 0.5 ? 2 * t * t : 1 - pow(-2 * t + 2, 2) / 2),
  inCubic: (t) => t * t * t,
  outCubic: (t) => 1 - pow(1 - t, 3),
  inOutCubic: (t) => (t < 0.5 ? 4 * t * t * t : 1 - pow(-2 * t + 2, 3) / 2),
  inQuart: (t) => t * t * t * t,
  outQuart: (t) => 1 - pow(1 - t, 4),
  inOutQuart: (t) => (t < 0.5 ? 8 * pow(t, 4) : 1 - pow(-2 * t + 2, 4) / 2),
  inQuint: (t) => pow(t, 5),
  outQuint: (t) => 1 - pow(1 - t, 5),
  inOutQuint: (t) => (t < 0.5 ? 16 * pow(t, 5) : 1 - pow(-2 * t + 2, 5) / 2),
  inExpo: (t) => (t <= 0 ? 0 : pow(2, 10 * t - 10)),
  outExpo: (t) => (t >= 1 ? 1 : 1 - pow(2, -10 * t)),
  inOutExpo: (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? pow(2, 20 * t - 10) / 2 : (2 - pow(2, -20 * t + 10)) / 2),
  inCirc: (t) => 1 - Math.sqrt(1 - t * t),
  outCirc: (t) => Math.sqrt(1 - pow(t - 1, 2)),
  inOutCirc: (t) => (t < 0.5 ? (1 - Math.sqrt(1 - pow(2 * t, 2))) / 2 : (Math.sqrt(1 - pow(-2 * t + 2, 2)) + 1) / 2),
  inOutSine: (t) => -(Math.cos(Math.PI * t) - 1) / 2,
  outSine: (t) => Math.sin((t * Math.PI) / 2),
  inSine: (t) => 1 - Math.cos((t * Math.PI) / 2),
  outBack: (t, s = 1.70158) => 1 + (s + 1) * pow(t - 1, 3) + s * pow(t - 1, 2),
  inBack: (t, s = 1.70158) => (s + 1) * t * t * t - s * t * t,
};

// CSS-style cubic-bezier easing (same solver as WebKit's UnitBezier)
export function bezier(x1, y1, x2, y2) {
  const cx = 3 * x1, bx = 3 * (x2 - x1) - cx, ax = 1 - cx - bx;
  const cy = 3 * y1, by = 3 * (y2 - y1) - cy, ay = 1 - cy - by;
  const sx = (t) => ((ax * t + bx) * t + cx) * t;
  const sy = (t) => ((ay * t + by) * t + cy) * t;
  const dx = (t) => (3 * ax * t + 2 * bx) * t + cx;
  return (x) => {
    if (x <= 0) return 0;
    if (x >= 1) return 1;
    let t = x;
    for (let i = 0; i < 8; i++) {
      const e = sx(t) - x;
      if (Math.abs(e) < 1e-6) return sy(t);
      const d = dx(t);
      if (Math.abs(d) < 1e-6) break;
      t -= e / d;
    }
    let lo = 0, hi = 1;
    t = x;
    while (lo < hi) {
      const v = sx(t);
      if (Math.abs(v - x) < 1e-6) break;
      if (x > v) lo = t; else hi = t;
      t = (lo + hi) / 2;
      if (hi - lo < 1e-7) break;
    }
    return sy(t);
  };
}

// Signature motion curves used across the film
E.snap = bezier(0.16, 1, 0.3, 1);      // fast attack, long silky settle (expo-ish out)
E.whip = bezier(0.7, 0, 0.2, 1);       // anticipation-free in-out with hard middle
E.swift = bezier(0.55, 0, 0.1, 1);     // general purpose in-out
E.punch = bezier(0.3, 1.45, 0.4, 1);   // overshoot pop

// Damped spring step response (normalised so spring(1) ~= 1)
export function spring(t, { stiffness = 180, damping = 14, mass = 1, duration = 1 } = {}) {
  const w0 = Math.sqrt(stiffness / mass);
  const zeta = damping / (2 * Math.sqrt(stiffness * mass));
  const x = t * duration;
  if (zeta < 1) {
    const wd = w0 * Math.sqrt(1 - zeta * zeta);
    return 1 - Math.exp(-zeta * w0 * x) * (Math.cos(wd * x) + ((zeta * w0) / wd) * Math.sin(wd * x));
  }
  return 1 - Math.exp(-w0 * x) * (1 + w0 * x);
}

// progress of t inside [t0, t1] through an easing fn
export const ease = (t, t0, t1, fn = E.snap) => fn(invlerp(t0, t1, t));

// keyframe track: [[time, value, easeToNext?], ...] -> value(t); values may be numbers or arrays
export function track(keys) {
  return (t) => {
    if (t <= keys[0][0]) return keys[0][1];
    for (let i = 0; i < keys.length - 1; i++) {
      const [t0, v0, fn = E.swift] = keys[i];
      const [t1, v1] = keys[i + 1];
      if (t <= t1) {
        const p = fn(invlerp(t0, t1, t));
        if (Array.isArray(v0)) return v0.map((a, j) => lerp(a, v1[j], p));
        return lerp(v0, v1, p);
      }
    }
    return keys[keys.length - 1][1];
  };
}

// deterministic PRNG
export function rng(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const TAU = Math.PI * 2;
export const deg = (d) => (d * Math.PI) / 180;
export const dist = (ax, ay, bx, by) => Math.hypot(bx - ax, by - ay);

export function mixColor(a, b, t) {
  const pa = hex(a), pb = hex(b);
  const c = pa.map((v, i) => Math.round(lerp(v, pb[i], t)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
export function hex(h) {
  const s = h.replace('#', '');
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
