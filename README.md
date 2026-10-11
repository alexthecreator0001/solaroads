# Solaro — "Od iskry po slnko" / "From the first spark to the sun"

A 14.8 s vertical (1080×1920, 60 fps) ad for [solaro.sk](https://solaro.sk): the evolution of electricity — from
the first stone spark, through fire, lightning, the light bulb and the grid, to the sun and solar — ending on the
Solaro logo. Rendered by a deterministic code pipeline (no stock motion templates, no AI imagery).

Deliverables are in `out/final/` (see the latest commit message for the exact files).

## How it is built
- **Engine** (`engine/`): a frame-exact renderer. Each frame is drawn on a Canvas 2D (+ three.js for 3D) by a pure
  function of time, captured from headless Chromium (`tools/render.mjs`) and encoded with ffmpeg; motion blur =
  sub-frame accumulation. Highlights:
  - `shapes.js` — the **Solaro shape language**: every shape of the mark is a 204-unit cell with per-corner radii and an
    optional hole, so all logo morphs (spark ✦, flame, bulb, sun ring, panel grid, mark) are *exact* parameter
    interpolations; the ✦ spark is the mark's own negative space when its gap closes.
  - `logo.js` — the lockup rebuilt from the supplied SVG paths; `text.js` — Poppins Bold + the logo's own o/l/a/r glyphs.
  - `morph.js` / `wordmorph.js` — outline morphs and letter-level word transitions.
- **Film** (`scenes/film.js`, `scenes/solaro/*.js`): eight sections with hand-off contracts (`spine.js`), copy in
  `config.js` (Slovak master `lang=sk`, English `lang=en`).
- **Images** (`tools/imgproc.py`, `tools/batch_process.py`): public-domain / CC0 / CC BY archival imagery and Solaro's
  own photos, levelled to pure black & white, objects cut out with BiRefNet (MIT). Credits: `CREDITS.md`.
- **Sound** (`audio/synth.py`, `audio/arrange.py`): 100 % synthesised foley + music, cued from the same timeline as
  the picture, mastered to −14 LUFS / −1 dBTP.
- **Research** (`research/`): reference teardown, brand study, sourcing reports, storyboards and the final bible
  (`research/STORYBOARD.md`).

## Logo animation for the website
`logo-animation/`: a 1.8 s intro of the Solaro logo for page load, as Lottie (`solaro-logo.json`, `solaro-mark.json`) and MP4,
built from the same SVG paths. Embed snippets and rebuild steps are in `logo-animation/README.md`.

## Render
```
npm install                      # three, opentype.js
python3 tools/batch_process.py   # B&W treatment + cutouts (needs assets/raw/** and tools/models/birefnet.onnx)
python3 tools/build_registry.py
node tools/render.mjs --film film --q "lang=sk" --cues audio/cues_sk.json --cuesOnly
python3 audio/arrange.py audio/cues_sk.json audio/solaro_sk.wav
node tools/render.mjs --film film --q "lang=sk" --audio audio/solaro_sk.wav --out out/final/solaro_sk.mp4 --workers 3
```
