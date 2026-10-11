// S4 — LIGHT (f344–479): the dot becomes the orange letter of the light word (SK svetlo: the "o";
// EN light: the tittle), flies back to A and becomes the BULB; history flickers inside the bulb's
// outline (≤ 2 alternations) → ON with rays → "light everywhere": each image's light source sits on
// the bulb (towers, arc lamps, pylons, Tesla sparks on the film's 3rd invert f464–465).
import { W, H, E, ease, lerp, clamp, COLORS, deg } from '../../engine/core.js';
import { drawCell, cellPath2D, cellToRings } from '../../engine/shapes.js';
import { makeMorph, ringsToPath } from '../../engine/morph.js';
import { windowImage } from '../../engine/window.js';
import { strokePts, arcPts } from '../../engine/draw.js';
import { A, word, LANG } from './config.js';
import { dot, bulb, bulbBase, DOT_R, fillOrangeRings, BULB_S } from './spine.js';
import { drawInkWord, circleRings } from './lib_words.js';

const ENTER = 346, HOLD_END = 380, TO_BULB = [380, 392];
const STROBE = [[392, 'edison-lamp-new-type-smithsonian.cut', [0.48, 0.30], 0.46], [396, null], [399, 'edison-lamp-stopper-smithsonian.cut', [0.5, 0.30], 0.42], [403, null]];
const ON = 403;
// "light everywhere": [frame, key, pt (light source), width px, invert?]
const MONT = [
  [420, 'pylon-silhouette-dusk-sky-wordpress-s4', [0.505, 0.105], 1500],
  [426, 'yablochkov-candle-arc-lamp-engraving-obi-s4', [0.33, 0.38], 1150],
  [431, 'paris-electric-searchlight-concorde-engraving-obi-s4', [0.905, 0.705], 3200],
  [436, 'arc-lamp-brush-two-carbons-smithsonian.cut', [0.5, 0.74], 520],
  [440, 'luna-park-electric-tower-night-1905-loc-s4inv', [0.555, 0.22], 1700],
  [444, 'pearl-street-station-dynamo-room-1882-engraving-ia-s4', [0.30, 0.50], 2900],
  [448, 'woman-dressed-in-light-bulbs-cabinet-card-met-s4', [0.42, 0.13], 1900],
  [451, 'pylon-insulators-against-sky-wordpress-s4', [0.42, 0.19], 1400],
  [454, 'edison-lamp-bamboo-filament-smithsonian.cut', [0.5, 0.33], 600],
  [457, 'xray-tube-on-stand-wellcome.cut', [0.5, 0.33], 900],
  [460, 'insulator-hemingray-cd154-smithsonian.cut', [0.45, 0.35], 800],
  [462, 'pylon-silhouette-dusk-sky-wordpress-s4', [0.505, 0.105], 760],
  [464, 'tesla-colorado-springs-sparks-wellcome-s4', [0.075, 0.375], 2600, true],
  [466, 'edison-lamp-new-type-smithsonian.cut', [0.48, 0.30], 300],
  [468, 'pearl-street-station-dynamo-room-1882-engraving-ia-s4', [0.62, 0.42], 3000],
  [470, null],
];

let L, hot0, toLetter, toBulb, tittleStem;

export default {
  name: 's4_light', f0: 344, f1: 480,
  needs: [[380, 410, ['edison-lamp-new-type-smithsonian.cut', 'edison-lamp-stopper-smithsonian.cut']], [415, 472, [...new Set(MONT.filter((m) => m[1]).map((m) => m[1]))]]],
  blur: [[344, 352, 5], [380, 393, 6]],
  cues: [
    { f: 348, kind: 'pop', gain: -12 }, { f: 349, kind: 'whoosh', dur: 0.15, f0: 2500, f1: 600, gain: -18 },
    { f: 382, kind: 'whoosh', dur: 0.2, f0: 800, f1: 3000, shape: 'in', gain: -16 },
    { f: 391, kind: 'clunk', gain: -10 }, { f: 391, kind: 'buzz', dur: 0.2, gain: -16 },
    { f: 394, kind: 'zap', gain: -20 }, { f: 401, kind: 'zap', gain: -20 },
    { f: 405, kind: 'clunk', gain: -6 }, { f: 405, kind: 'bell', freq: 1318.5, dur: 1.0, gain: -12 },
    ...MONT.filter((m) => m[1]).map((m) => ({ f: m[0] + 2, kind: m[4] ? 'zap' : 'tick', gain: m[4] ? -8 : -15 })),
  ],
  async load() {
    L = word('light');
    const h = L.hot;
    // dot -> hot letter (SK: ring 'o'; EN: tittle) and hot letter -> bulb
    const dotR = circleRings(A[0], A[1], DOT_R);
    const hc = [h.cx, h.cy];
    toLetter = makeMorph(dotR.map((r) => r.map(([x, y]) => [x + hc[0] - A[0], y + hc[1] - A[1]])), h.rings, { n: 180 });
    toBulb = makeMorph(h.rings, cellToRings(bulb()), { n: 200 });
    hot0 = hc;
  },
  draw(ctx, f) {
    const F = Math.round(f);
    const h = L.hot;
    // ---- word: slam in, hold, collapse
    if (F < TO_BULB[1] + 4) {
      drawInkWord(ctx, L, f, { skip: L.hotIndex, enter: [ENTER - 1, 4, 140], exit: [TO_BULB[0] + 1, 5], stemRings: h.kind === 'tittle' ? h.stemRings : null, push: Math.pow(1.003, Math.max(0, f - ENTER)), pivot: A });
    }
    // ---- orange element
    if (F < TO_BULB[0]) {
      // dot travels to the letter slot while growing into it
      const p = ease(f, 344, 352, E.snap);
      const tx = (A[0] - hot0[0]) * (1 - p), ty = (A[1] - hot0[1]) * (1 - p);
      const rings = toLetter(p).map((r) => r.map(([x, y]) => [x + tx, y + ty]));
      const push = Math.pow(1.003, Math.max(0, f - ENTER));
      fillOrangeRings(ctx, rings.map((r) => r.map(([x, y]) => [A[0] + (x - A[0]) * push, A[1] + (y - A[1]) * push])));
      return;
    }
    if (F < TO_BULB[1]) {
      const p = ease(f, TO_BULB[0], TO_BULB[1], E.swift);
      fillOrangeRings(ctx, toBulb(p));
      return;
    }
    // ---- bulb + base from here on
    const B = bulb();
    const baseP = E.punch(clamp((f - TO_BULB[1] + 2) / 6));
    let bulbFill = 'orange', strobeImg = null;
    if (F < ON) {
      let cur = STROBE[0];
      for (const s of STROBE) if (F >= s[0]) cur = s;
      if (cur[1]) strobeImg = cur;
    }
    // montage behind the bulb
    if (F >= MONT[0][0]) {
      let cur = null;
      for (const m of MONT) if (F >= m[0]) cur = m;
      if (cur && cur[1]) {
        const inv = !!cur[4] && (F === 464 || F === 465);
        if (inv) { ctx.fillStyle = COLORS.ink; ctx.fillRect(0, 0, W, H); }
        windowImage(ctx, cur[1], { mode: 'reg', pt: cur[2], P: A, w: cur[3], push: Math.pow(1.008, f - cur[0]), filter: inv ? 'invert(1)' : null });
      }
    }
    // registration ring (ink) around the bulb during the montage
    if (F >= 416) {
      const a = ease(f, 416, 421, E.linear), b = ease(f, 470, 476, E.inCubic);
      if (a > b) strokePts(ctx, arcPts(A[0], A[1] - 18, 168, -Math.PI / 2, Math.PI * 1.5, 120), { a: b, b: a, width: 4, color: (F === 464 || F === 465) ? '#FFFFFF' : COLORS.ink });
    }
    if (strobeImg) {
      windowImage(ctx, strobeImg[1], { mode: 'reg', clip: cellPath2D(B), pt: strobeImg[2], P: [A[0], A[1] - 0.0], w: (BULB_S / 2) / strobeImg[3] });
      ctx.save(); ctx.strokeStyle = COLORS.ink; ctx.lineWidth = 3; ctx.stroke(cellPath2D(B)); ctx.restore();
    } else drawCell(ctx, B);
    for (const c of bulbBase(BULB_S, A[0], A[1], baseP)) drawCell(ctx, c);
    // ON: 8 ray capsules pop and retract
    if (F >= ON && F < ON + 14) {
      const out = E.outExpo(clamp((f - ON) / 4)), back = E.inCubic(clamp((f - ON - 8) / 5));
      for (let i = 0; i < 8; i++) {
        const a = deg(-90 + i * 45);
        const r0 = 170 + 30 * back, r1 = 170 + 70 * out;
        if (r1 - r0 < 2) continue;
        strokePts(ctx, [[A[0] + Math.cos(a) * r0, A[1] - 10 + Math.sin(a) * r0], [A[0] + Math.cos(a) * r1, A[1] - 10 + Math.sin(a) * r1]], { width: 18, color: COLORS.orange });
      }
    }
  },
};
