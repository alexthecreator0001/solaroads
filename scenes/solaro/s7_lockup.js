// S7 — LOCKUP (f736–887): the mark glides into the lockup; the sun word (slnko / solar, with its
// orange "o" = the sun) slides out from behind the mark at wordmark size and becomes "Solaro":
// shared letters glide, s→S is the only outline morph, unrelated letters collapse to dots and the
// dots inflate into the logo's own a / r / o. Two-tone Sol·a·r·o (orange o, a, o = the mark's ring
// and pin) → everything snaps to ink on the chord (f772) while the mark's ring and pin pulse.
// Hold on the exact lockup = frame 0.
import { W, H, E, ease, lerp, clamp, COLORS } from '../../engine/core.js';
import { MARK_ORDER, markCells, drawCell, GAP, CELL, brandGradient } from '../../engine/shapes.js';
import { drawLogo, layoutWordmark, LOGO_W, LOGO_H, WM } from '../../engine/logo.js';
import { layoutHybrid, itemPath } from '../../engine/text.js';
import { planWordMorph } from '../../engine/wordmorph.js';
import { makeMorph, ringsToPath } from '../../engine/morph.js';
import { A, FONT, COPY, LANG, copy, TRACK } from './config.js';
import { MARK_END_SCALE, fillOrangeRings } from './spine.js';

const S_LOCK = (W * 0.83) / LOGO_W;
const LOCK_X = A[0] - (LOGO_W * S_LOCK) / 2, LOCK_Y = A[1] - (LOGO_H * S_LOCK) / 2;
const MC = [LOCK_X + 224.5 * S_LOCK, LOCK_Y + 224.5 * S_LOCK]; // mark centre in the lockup
const URL_Y = 1190;
const F_GLIDE = [736, 756], F_SLIDE = [741, 757], F_MORPH = [754, 768], F_SNAP = 772, F_URL = [778, 788];
const ORANGE_FINAL = new Set([1, 3, 5]); // Solaro: o, a, o

let plan, dotGrow = new Map(), src, dst;

function markAt(f) {
  const p = ease(f, F_GLIDE[0], F_GLIDE[1], E.inOutCubic);
  const s = Math.exp(lerp(Math.log(MARK_END_SCALE), Math.log(S_LOCK), p));
  return { cx: lerp(A[0], MC[0], p), cy: lerp(A[1], MC[1], p), s };
}
const circleRing = (cx, cy, r, n = 120) => Array.from({ length: n }, (_, i) => { const a = -Math.PI / 2 + (i / n) * Math.PI * 2; return [cx + r * Math.cos(a), cy + r * Math.sin(a)]; });

export default {
  name: 's7_lockup', f0: 736, f1: 888,
  blur: [[736, 758, 6], [754, 768, 4]],
  cues: [
    { f: 738, kind: 'whoosh', dur: 0.3, f0: 1800, f1: 400, shape: 'swell', gain: -18 },
    { f: 758, kind: 'pop', f0: 900, f1: 500, gain: -16 },
    { f: 761, kind: 'pop', f0: 1100, f1: 600, gain: -17 },
    { f: 764, kind: 'pop', f0: 1300, f1: 700, gain: -17 },
    { f: 774, kind: 'chord', dur: 2.0, gain: -3 },
    { f: 774, kind: 'sub', dur: 0.8, freq: 41.2, gain: -9 },
    { f: 780, kind: 'tick', freq: 4200, gain: -22 },
  ],
  async load() {
    const c = copy('sun');
    // sun word at wordmark size: x-height = wordmark x-height × S_LOCK, left edge on the wordmark's S
    const xhTarget = (WM.baseline - WM.xTop) * S_LOCK;
    const size = xhTarget / ((FONT.tables.os2.sxHeight || 548) / FONT.unitsPerEm);
    const baseline = LOCK_Y + WM.baseline * S_LOCK;
    const probe = layoutHybrid(FONT, c.word, size, { x: 0, y: baseline, tracking: TRACK });
    src = layoutHybrid(FONT, c.word, size, { x: LOCK_X + WM.x0 * S_LOCK - (probe.items[0].box.x - 0), y: baseline, tracking: TRACK });
    dst = layoutWordmark(LOCK_X, LOCK_Y, S_LOCK);
    plan = planWordMorph(src, dst, { caseInsensitive: true, n: 180 });
    for (const op of plan.ops) {
      const sameLetter = op.a && op.b && op.a.ch.toLowerCase() === op.b.ch.toLowerCase();
      if (op.type === 'morph' && !sameLetter) op.type = 'swap';   // unrelated letters: collapse → dot → inflate
      if (op.type === 'swap' || op.type === 'in') {
        const b = op.b;
        dotGrow.set(op, makeMorph([circleRing(b.box.cx, b.box.cy, 7)], b.rings, { n: 180 }));
      }
    }
  },
  draw(ctx, f) {
    const F = Math.round(f);
    const m = markAt(f);
    const snapped = F >= F_SNAP;

    // ---- the word (behind the mark while it slides out)
    const clipX = m.cx + (CELL + GAP / 2) * m.s;
    ctx.save();
    const cl = new Path2D(); cl.rect(clipX, 0, W, H); ctx.clip(cl);
    const slide = (i) => 1 - ease(f, F_SLIDE[0] + i * 1.2, F_SLIDE[1] + i * 1.2, E.outExpo);
    const mp = (k) => clamp((f - F_MORPH[0]) / (F_MORPH[1] - F_MORPH[0]));
    const sunHot = COPY[LANG].sun.hot;
    for (const op of plan.ops) {
      const ia = op.ia, ib = op.ib;
      const fill = (orange, rings, path) => {
        if (orange && !snapped) fillOrangeRings(ctx, rings);
        else { ctx.fillStyle = COLORS.ink; ctx.fill(path || ringsToPath(rings), path ? 'nonzero' : 'evenodd'); }
      };
      if (f < F_MORPH[0]) {
        if (ia == null) continue;
        const it = op.a, dx = (m.cx - it.box.cx) * slide(ia);
        ctx.save(); ctx.translate(dx, 0);
        fill(ia === sunHot, it.rings, ia === sunHot ? null : itemPath(it));
        ctx.restore();
        continue;
      }
      // phase A (F_MORPH[0]..+6): s→S morph runs, letters to be replaced collapse to dots,
      //   shared letters glide to their final slots;
      // phase B (+5..end): dots travel to their target slots and inflate; new letters pop from a dot
      const T0 = F_MORPH[0], T1 = F_MORPH[1];
      const pg = ease(f, T0, T0 + 8, E.swift);          // glide / s→S
      const pc = clamp((f - T0) / 3.5);                 // collapse
      const pt = ease(f, T0 + 2, T0 + 7, E.swift);      // dot travel
      const pi = ease(f, T0 + 4, T1 - 2, E.snap);       // inflate
      const orangeB = ib != null && ORANGE_FINAL.has(ib);
      if (op.type === 'keep') {
        ctx.save(); ctx.translate(op.dx * pg, op.dy * pg);
        const orange = ia === sunHot || (orangeB && f >= T0 + 8);
        fill(orange, op.a.rings, orange ? null : itemPath(op.a));
        ctx.restore();
      } else if (op.type === 'morph') {           // s→S (or same letter at another size)
        fill(ia === sunHot, op.m(pg));
      } else if (op.type === 'swap') {
        if (pc < 1) {
          const sc = 1 - E.inExpo(pc), b = op.a.box;
          ctx.save(); ctx.translate(b.cx, b.cy); ctx.scale(sc, sc); ctx.translate(-b.cx, -b.cy);
          ctx.fillStyle = COLORS.ink; ctx.fill(itemPath(op.a)); ctx.restore();
        }
        if (f >= T0 + 2) {
          const tx = (op.a.box.cx - op.b.box.cx) * (1 - pt);
          const rings = dotGrow.get(op)(pi).map((r) => r.map(([x, y]) => [x + tx, y]));
          fill(orangeB, rings);
        }
      } else if (op.type === 'in') {
        if (f >= T0 + 4) fill(orangeB, dotGrow.get(op)(pi));
      }
    }
    ctx.restore();

    // ---- the mark (ring + pin pulse on the snap)
    const pulse = snapped ? 1 + 0.06 * Math.sin(Math.PI * clamp((f - F_SNAP) / 6)) : 1;
    const cells = markCells(m.cx, m.cy, m.s, GAP);
    for (const k of MARK_ORDER) {
      const c = { ...cells[k] };
      if (k === 'ring' || k === 'pin') c.s = pulse;
      drawCell(ctx, c, { innerShadow: snapped ? 1 : 0, scale: m.s });
    }

    // ---- solaro.sk (hard L→R wipe), identical to frame 0
    const wipe = ease(f, F_URL[0], F_URL[1], E.outQuad);
    if (wipe > 0) {
      const txt = COPY[LANG].url, size = 46;
      const pth = FONT.getPath(txt, 0, 0, size), bb = pth.getBoundingBox();
      const x0 = A[0] - (bb.x2 - bb.x1) / 2 - bb.x1;
      ctx.save();
      const c2 = new Path2D(); c2.rect(0, 0, x0 + bb.x1 + (bb.x2 - bb.x1) * wipe, H); ctx.clip(c2);
      ctx.translate(x0, URL_Y); ctx.fillStyle = COLORS.ink; ctx.fill(new Path2D(pth.toPathData(2)));
      ctx.restore();
    }
    // from the snap on, draw the exact logo file paths (guarantees f887 ≡ f0)
    if (F >= F_SNAP + 6) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, LOCK_Y - 20, W, LOGO_H * S_LOCK + 40);
      drawLogo(ctx, LOCK_X, LOCK_Y, S_LOCK);
    }
  },
};
