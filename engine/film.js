// Film assembly: layers on a frame timeline, motion-blur windows and sound cues defined in the
// same place, so picture and sound can never drift apart.
import { FPS } from './core.js';

export function makeFilm({ frames, layers, blur = [], cues = [], load, shutter = 0.5 }) {
  const sorted = layers.map((l, i) => ({ z: 0, ...l, _i: i })).sort((a, b) => a.z - b.z || a._i - b._i);
  return {
    duration: frames / FPS,
    shutter,
    async load(o) { if (load) await load(o); },
    samples(t) {
      const f = t * FPS;
      let n = 1;
      for (const [a, b, s] of blur) if (f >= a && f < b) n = Math.max(n, s);
      return n;
    },
    draw(ctx, t) {
      const f = t * FPS;
      for (const l of sorted) {
        if (f < l.f0 || f >= l.f1) continue;
        ctx.save();
        l.draw(ctx, { f, lf: f - l.f0, t, lt: (f - l.f0) / FPS, p: (f - l.f0) / (l.f1 - l.f0), len: l.f1 - l.f0 });
        ctx.restore();
      }
    },
    cues: () => cues.map((c) => ({ ...c, t: c.f / FPS })),
    layers: sorted,
  };
}

// constant-ratio ambient push (reference: +0.5..1.2 % per frame)
export const push = (lf, rate = 1.008) => Math.pow(rate, lf);
