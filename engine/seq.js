// Montage helpers: sequences of shots measured in frames.
import { FPS } from './core.js';

// shots: [{ f: durationFrames, ...data }]. Returns the active shot at time t (seconds) after start frame f0.
export function montage(t, f0, shots) {
  const frame = t * FPS - f0;
  if (frame < 0) return null;
  let acc = 0;
  for (let i = 0; i < shots.length; i++) {
    const d = shots[i].f;
    if (frame < acc + d) return { i, shot: shots[i], lf: frame - acc, lp: (frame - acc) / d, start: f0 + acc, n: shots.length };
    acc += d;
  }
  return null;
}
export const totalFrames = (shots) => shots.reduce((s, x) => s + x.f, 0);

// scene window helper: is frame time t within [f0, f1)?
export const within = (t, f0, f1) => t * FPS >= f0 && t * FPS < f1;
export const lt = (t, f0) => t - f0 / FPS; // local seconds since frame f0
