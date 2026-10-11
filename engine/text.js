// Text as geometry: opentype.js glyph outlines -> rings, so words can be laid out,
// animated per letter and morphed into other letters or Solaro shapes.
import opentype from '../node_modules/opentype.js/dist/opentype.module.js';
import { cmdsToRings, bbox } from './morph.js';

const cache = new Map();
export async function loadFont(url) {
  if (cache.has(url)) return cache.get(url);
  const buf = await (await fetch(url)).arrayBuffer();
  const f = opentype.parse(buf);
  cache.set(url, f);
  return f;
}

// Lay out a string. Returns glyphs with absolute rings (px) and the overall metrics.
// align: 'left' | 'center' | 'right'; y is the baseline.
export function layout(font, str, size, { x = 0, y = 0, tracking = 0, align = 'left', seg = 14 } = {}) {
  const scale = size / font.unitsPerEm;
  const glyphs = font.stringToGlyphs(str);
  let pen = 0;
  const items = glyphs.map((g, i) => {
    const kern = i > 0 ? font.getKerningValue(glyphs[i - 1], g) * scale : 0;
    pen += kern;
    const item = { ch: str[i], g, x: pen, adv: g.advanceWidth * scale };
    pen += item.adv + tracking * size;
    return item;
  });
  const width = pen - tracking * size;
  const x0 = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  for (const it of items) {
    it.x += x0;
    const path = it.g.getPath(it.x, y, size);
    it.cmds = path.commands;
    it.rings = cmdsToRings(path.commands, seg);
    it.box = it.rings.length ? bbox(it.rings) : { x: it.x, y, w: 0, h: 0, cx: it.x + it.adv / 2, cy: y };
    it.d = path.toPathData(3);
  }
  const asc = (font.ascender * scale), desc = (font.descender * scale);
  return { items, width, x0, y, size, asc, desc, xHeight: (font.tables.os2?.sxHeight || 0) * scale, capHeight: (font.tables.os2?.sCapHeight || 0) * scale };
}

export function glyphPath(item) {
  return new Path2D(item.d);
}

// Hybrid layout: letters that exist in the Solaro wordmark (S o l a r) are taken from the logo
// itself (custom single-storey 'a', flat-cut 'r'), everything else from the text font, matched
// on x-height so every word in the film carries the wordmark's DNA.
import { WORDMARK, WM } from './logo.js';
import { transformRings } from './morph.js';
const WM_GLYPHS = {};
for (const l of WORDMARK) if (!WM_GLYPHS[l.ch]) WM_GLYPHS[l.ch] = l;
const WM_X_HEIGHT = WM.baseline - WM.xTop; // 219.5 units

export function layoutHybrid(font, str, size, { x = 0, y = 0, tracking = 0, align = 'left', seg = 14, use = 'Solar' } = {}) {
  const scale = size / font.unitsPerEm;
  const xh = (font.tables.os2?.sxHeight || 548) * scale;
  const k = xh / WM_X_HEIGHT; // px per wordmark unit
  const gapWM = 37 * k; // average inter-letter gap in the wordmark
  const items = [];
  let pen = 0, prevG = null, prevWM = false;
  for (const ch of str) {
    const wm = use.includes(ch) ? WM_GLYPHS[ch] : null;
    if (wm) {
      const lsb = prevG || prevWM ? gapWM / 2 : 0;
      pen += lsb;
      const w = wm.box.w * k;
      items.push({ ch, wm, x: pen, adv: w, k });
      pen += w + gapWM / 2 + tracking * size;
      prevG = null; prevWM = true;
    } else {
      const g = font.charToGlyph(ch);
      if (prevG) pen += font.getKerningValue(prevG, g) * scale;
      if (prevWM) pen -= (g.leftSideBearing || 0) * scale * 0.0; // keep font sidebearing
      items.push({ ch, g, x: pen, adv: g.advanceWidth * scale });
      pen += g.advanceWidth * scale + tracking * size;
      prevG = g; prevWM = false;
    }
  }
  const width = pen - tracking * size - (items.length && items[items.length - 1].wm ? gapWM / 2 : 0);
  const x0 = align === 'center' ? x - width / 2 : align === 'right' ? x - width : x;
  for (const it of items) {
    it.x += x0;
    if (it.wm) {
      // wordmark glyph: map its bbox-left to it.x and baseline to y
      const m = new DOMMatrix().translate(it.x, y).scale(it.k).translate(-it.wm.box.x, -WM.baseline);
      it.rings = transformRings(it.wm.rings, { x: 0 }).map((r) => r.map(([px, py]) => { const p = m.transformPoint({ x: px, y: py }); return [p.x, p.y]; }));
      const p = new Path2D(); p.addPath(it.wm.path, m);
      it.path2d = p;
      it.d = null;
    } else {
      const path = it.g.getPath(it.x, y, size);
      it.cmds = path.commands;
      it.rings = cmdsToRings(path.commands, seg);
      it.d = path.toPathData(3);
    }
    it.box = it.rings.length ? bbox(it.rings) : { x: it.x, y, w: 0, h: 0, cx: it.x + it.adv / 2, cy: y };
  }
  return { items, width, x0, y, size, xHeight: xh, capHeight: (font.tables.os2?.sCapHeight || 0) * scale, asc: font.ascender * scale, desc: font.descender * scale };
}

// Path2D for any layout item (font glyph or wordmark glyph)
export function itemPath(it) {
  return it.path2d || new Path2D(it.d);
}
