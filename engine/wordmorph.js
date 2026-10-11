// Word -> word transitions. Letters are aligned with an LCS so shared letters glide to
// their new positions; letters in the same gap morph outline-to-outline; leftovers
// exit / enter. Scenes can override choreography per op.
import { makeMorph, ringsToPath, transformRings, bbox } from './morph.js';
import { lerp, clamp, E, COLORS } from './core.js';
import { itemPath } from './text.js';

function lcs(a, b) {
  const n = a.length, m = b.length, T = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) T[i][j] = a[i] === b[j] ? T[i + 1][j + 1] + 1 : Math.max(T[i + 1][j], T[i][j + 1]);
  const pairs = [];
  let i = 0, j = 0;
  while (i < n && j < m) {
    if (a[i] === b[j]) { pairs.push([i, j]); i++; j++; }
    else if (T[i + 1][j] >= T[i][j + 1]) i++;
    else j++;
  }
  return pairs;
}

export function planWordMorph(A, B, { n = 180, caseInsensitive = false } = {}) {
  const sa = A.items.map((it) => (caseInsensitive ? it.ch.toLowerCase() : it.ch));
  const sb = B.items.map((it) => (caseInsensitive ? it.ch.toLowerCase() : it.ch));
  const keeps = lcs(sa, sb);
  const ops = [];
  let pi = 0, pj = 0;
  const flushGap = (i1, j1) => {
    const ga = [], gb = [];
    for (let i = pi; i < i1; i++) ga.push(i);
    for (let j = pj; j < j1; j++) gb.push(j);
    const k = Math.min(ga.length, gb.length);
    for (let x = 0; x < k; x++) {
      const a = A.items[ga[x]], b = B.items[gb[x]];
      ops.push({ type: 'morph', ia: ga[x], ib: gb[x], a, b, m: makeMorph(a.rings, b.rings, { n }) });
    }
    for (let x = k; x < ga.length; x++) ops.push({ type: 'out', ia: ga[x], a: A.items[ga[x]] });
    for (let x = k; x < gb.length; x++) ops.push({ type: 'in', ib: gb[x], b: B.items[gb[x]] });
  };
  for (const [i, j] of keeps) {
    flushGap(i, j);
    const a = A.items[i], b = B.items[j];
    const sameSize = Math.abs(a.box.h - b.box.h) < 0.01 * Math.max(1, a.box.h) && Math.abs(a.box.w - b.box.w) < 0.01 * Math.max(1, a.box.w);
    if (a.ch !== b.ch || !sameSize) ops.push({ type: 'morph', ia: i, ib: j, a, b, m: makeMorph(a.rings, b.rings, { n }) });
    else ops.push({ type: 'keep', ia: i, ib: j, a, b, dx: b.box.x - a.box.x, dy: b.box.y - a.box.y });
    pi = i + 1; pj = j + 1;
  }
  flushGap(A.items.length, B.items.length);
  return { A, B, ops };
}

// Default rendering of a plan at progress p in [0,1].
// opts.custom(op, p, ctx) -> true to skip default drawing of that op.
export function drawWordMorph(ctx, plan, p, { color = COLORS.ink, ease = E.swift, custom = null, stagger = 0.0 } = {}) {
  ctx.save();
  ctx.fillStyle = color;
  const nOps = plan.ops.length;
  plan.ops.forEach((op, k) => {
    const lp = ease(clamp((p - k * stagger) / Math.max(1e-6, 1 - stagger * (nOps - 1)) ));
    if (custom && custom(op, lp, ctx, p)) return;
    if (op.type === 'keep') {
      ctx.save();
      ctx.translate(op.dx * lp, op.dy * lp);
      ctx.fill(itemPath(op.a));
      ctx.restore();
    } else if (op.type === 'morph') {
      ctx.fill(ringsToPath(op.m(lp)), 'evenodd');
    } else if (op.type === 'out') {
      const s = 1 - E.inCubic(clamp(lp * 1.25));
      if (s > 0.001) {
        const b = op.a.box;
        ctx.save();
        ctx.translate(b.cx, b.cy); ctx.scale(s, s); ctx.translate(-b.cx, -b.cy);
        ctx.fill(itemPath(op.a));
        ctx.restore();
      }
    } else if (op.type === 'in') {
      const s = E.outBack(clamp(lp * 1.25 - 0.25));
      if (s > 0.001) {
        const b = op.b.box;
        ctx.save();
        ctx.translate(b.cx, b.cy); ctx.scale(s, s); ctx.translate(-b.cx, -b.cy);
        ctx.fill(itemPath(op.b));
        ctx.restore();
      }
    }
  });
  ctx.restore();
}
