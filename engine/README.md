# Solaro ad renderer — engine API

Deterministic frame renderer: a film module draws frame `t` (seconds) onto a 1080x1920 Canvas 2D context.
`tools/render.mjs` drives headless Chromium, captures raw RGBA per frame and pipes to ffmpeg.

```
node tools/render.mjs --film film --out out/solaro.mp4 [--audio audio/mix.wav] [--workers 2]
node tools/render.mjs --film film --frames 0,120,240 --png out/check      # stills
node tools/render.mjs --film film --from 300 --to 420 --png out/seq       # PNG sequence
```

A film module (`scenes/<name>.js`) default-exports:
```js
export default {
  duration: 14.8,                 // seconds
  shutter: 0.5,                   // motion-blur shutter (fraction of a frame)
  samples: (t) => 1,              // sub-frames averaged for motion blur at time t (1 = off; 4-8 on fast moves)
  async load() {},                // preload fonts / images / 3D
  draw(ctx, t) {},                // draw frame at time t (background already cleared to #FFFFFF)
};
```

## Modules
- `engine/core.js` — `W,H,FPS(60)`, `COLORS {paper #FFF, ink #1C1C1C, orange #FF3D00, orangeTop #FF5E2B}`,
  `clamp, lerp, invlerp, remap, smoothstep`, easing `E.*` (quad..expo, circ, back, sine, plus signature curves
  `E.snap` = cubic-bezier(.16,1,.3,1), `E.whip` = (.7,0,.2,1), `E.swift` = (.55,0,.1,1), `E.punch` overshoot),
  `bezier(x1,y1,x2,y2)`, `spring()`, `ease(t,t0,t1,fn)`, `track([[t,v,ease],...])`, `rng(seed)`.
- `engine/shapes.js` — **Solaro shape language**. A *cell* = `{x,y,w,h,r:[tl,tr,br,bl], hole?:cell, rot?, s?}`.
  `MARK` (ring, tile, leaf, pin in 449-unit space), `placeCell(cell, ox, oy, scale)`, `mixCell(a,b,t)` = **exact**
  interpolation of geometry/radii/hole (holes grow from/shrink to centre), `drawCell(ctx, cell, {fill, alpha, innerShadow})`
  fills with the brand vertical gradient, `drawMark(ctx, ox, oy, s)`, factories `circle(cx,cy,r)`, `ringCell(cx,cy,ro,ri)`,
  `rectCell(cx,cy,w,h,radii)`.
  Useful facts: the PIN/teardrop cell = circle with one square corner; rotated so the corner points UP it reads as a
  flame/drop, corner DOWN reads as a light-bulb glass / map pin. The RING = sun / "o". TILE & LEAF = quarter-round squares.
- `engine/morph.js` — SVG path parsing, `pathToRings(d)`, `makeMorph(ringsA, ringsB)` -> `t => rings` (handles holes,
  unmatched contours), `ringsToPath`, `transformRings`, polyline helpers `polyLength, polySlice, pointAt`.
- `engine/text.js` — `loadFont(url)`, `layout(font, str, size, {x,y,tracking,align})` -> glyph items with outlines (rings)
  and Path data, so every letter is geometry (can morph to other letters or to cells).
- `engine/wordmorph.js` — `planWordMorph(layoutA, layoutB)` (LCS: shared letters glide, gap letters morph, extras exit/enter)
  and `drawWordMorph(ctx, plan, p, {custom})` with per-op choreography override.
- `engine/draw.js` — `loadImages({key:url})`, `drawFit(ctx,key,cx,cy,h,{w,rot,alpha,blend})`,
  `drawCover(ctx,key,box,{clip:Path2D, focus, zoom})` (image masked by any path — e.g. a Solaro cell),
  polylines `arcPts, linePts, spiralPts, boltPts`, `strokePts(ctx, pts, {a,b,width,color})` (draw-on by arc length),
  `taperStroke` (painted tapered stroke, draw-on), `sparks(ctx,t,t0,x,y,{...})` (deterministic particle burst),
  `dot`, `camera(ctx,{s,fx,fy,tx,ty,rot}, fn)` (zoom about a focal point), `drawWord`.
- `engine/logo.js` — exact Solaro lockup: `WORDMARK` letters (S,o,l,a,r,o) as paths + rings, `drawLogo(ctx, ox, oy, s, {letters})`.
- `engine/three-layer.js` — `Stage3D` (three.js, offscreen WebGL, transparent), `extrude(cell, {depth, bevel})` builds a
  3D mesh from any cell (holes included), `render(ctx, x, y, w, h)` composites it. ~0.3-0.5 s/frame when used.

Performance: ~150-350 ms/frame per worker without 3D; 3D frames slower; motion-blur multiplies by `samples`.
