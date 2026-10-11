# SOLARO — "Od iskry po slnko" — FINAL storyboard (the bible)

Format 1080×1920, 60 fps, **888 frames (14.8 s)**, f887 ≡ f0 (loops). Anchor **A = (540, 940)**.
Backbone = `research/storyboards/B-editorial.md` (read it — its shot tables are the default detail for every
section) with the panel's required fixes (`research/storyboards/judges-*.txt`) applied as listed below.
Prototypes: `out/proto_open-01.jpg`, `out/proto_end-01.jpg`, `out/proto_strike-01.jpg`.

## 1. Concept & copy
The Solaro mark is the film's layout system (its cells are windows; cell:gap = 5:1; big round corners face A),
and ONE orange element — always a Solaro cell or a letter of the wordmark — evolves through the history of
electricity: ✦ spark → dot → the "a" of the spark word → flame → the "l" of the bolt word → lightning bolt →
dot → the "o"/tittle of the light word → bulb → sun ring → the "o" of the sun word → (dive into a Solaro roof) →
panel → mark → lockup.

| beat | SK (master) | EN (alt, frame-identical) | orange letter |
|---|---|---|---|
| spark | **iskra** | **spark** | wordmark **a** (≈ the mark's pin cell) |
| lightning | **blesk** | **bolt** | wordmark **l** (a rect) |
| light | **svetlo** | **light** | SK: wordmark **o** (ring) · EN: the **tittle** of i (dot) |
| sun | **slnko** | **solar** | wordmark **o** (ring) |
| end | **slnko → Solaro** | **solar → Solaro** | + `solaro.sk` (hard L→R wipe) |
`scenes/solaro/config.js` holds this table; `word(beat)` gives the layout (Poppins Bold 280 px + the logo's own
o/l/a/r glyphs, centred on x 540, x-height centred on y 940) and the hot (orange) letter geometry.
Render both: `--q "lang=sk"` (default) and `--q "lang=en"`.

## 2. Global rules (apply to every section)
- **Palette**: paper #FFFFFF, ink #1C1C1C, orange = brand gradient #FF5E2B→#FF3D00 (`brandGradient`/`drawCell`).
  B&W imagery only (`assets/processed/**`). Orange covers ≤ ~1/3 of the frame except the panel flip.
- **No dissolves / opacity fades / glows / grain / vignettes / drop shadows / brush textures.** Every change is a
  hard cut, an in-place swap inside an identical outline, a cell wipe, a camera step, or a morph (exact `mixCell`,
  or through a point). Marks exit by un-drawing or collapsing to a point, never by fading.
- **✦ rule**: the concave 4-point ✦ (`sparkPath`) appears only at the strike (f42–57, ≤ ~10 f orange) and in the
  final gap breath. It never docks next to type; it collapses to the round DOT first.
- **Inverts** (bg → #1C1C1C, images inverted, orange untouched): exactly three, 2 f each: **f48–49** (strike),
  **f264–265** (thunder), **f464–465** (Tesla sparks). Nowhere else.
- **Flicker cap**: no element may alternate orange↔image more than 3 times (bulb strobe = 2–3 alternations).
- **Motion**: ambient push on held images 1.006–1.010 ×/f (constant ratio, about A or the registration point);
  entrances expoOut 3 f with motion-blur smear; re-layouts cubicInOut 5–7 f; pops overshoot ≤ 6 % settle 4 f
  (`E.punch`); exits/push-throughs log-scale quad/expo-in 4–8 f with blur; draw-ons linear.
  Easing kit in `engine/core.js` (`E.snap`, `E.swift`, `E.whip`, `E.punch`, standard curves).
- **Motion blur**: declare `blur: [[f0,f1,samples]]` (4–6 samples) on every fast move (≥ ~25 px/f), shutter 0.5.
- **Type**: only via `config.word(beat)` (Poppins Bold + wordmark glyphs), ink, lowercase. Never text over images.
  Letters enter by slide/slam (expoOut + smear) or grow from a point; exit by collapsing to a point (inExpo).
  NO typing cursor, NO weight-morph surge, NO guide rules, NO letter-to-unrelated-letter outline morphs.
- **Images**: crop/retouch any readable text (titles, captions, plate numbers, logos, timestamps); never display an
  image above ~1.0× of the file's pixel density for > 4 f (if you need more, re-process from `assets/raw` at a
  higher `--max`); never show recognisable objects upside down; no blue skies (photo treatment is B&W anyway).
- **Paint on top of images**: clean vector only — orange strokes/`taperStroke` (round caps), ink #1C1C1C lines
  4 px (circles, ticks, offset keylines around the orange element, score lines), dots. Draw-on/un-draw by arc length.

## 3. Sections, frames, owners, hand-off contracts
| id | file | frames | content (B rows) | contract IN → OUT |
|---|---|---|---|---|
| S0 | `scenes/solaro/s0_open.js` | 0–71 | B #01–12: lockup → windows of stone (2 live 3D flint renders + 2 photo flints) → hand-axe ripple → SLAM → invert → ✦ → windows fly out → ✦ → DOT | lockup (= f887) → DOT r17 at A |
| S1 | `s1_spark.js` | 72–137 | spark word; DOT → orange wordmark **a**; SPLIT windows (top tile / bottom leaf) with fire-making images swapping every 6 f (B #14–22); letters collapse | DOT → orange a at its word slot, alone |
| S2 | `s2_fire.js` | 138–221 | a → FLAME at A (exact: makeMorph a→pin, then mixCell rotate to −135°, grow); registered fire montage, scale contrast (B #26–35 minus the upside-down lamps), offset ink keyline around the flame; short rest with the flame alone | orange a → FLAME (flame(f)) at A |
| S3 | `s3_bolt.js` | 222–343 | FLAME → orange wordmark **l** of the bolt word (mixCell pin→rect) as the other letters slam in; hold ≥ 30 f readable; l → constant-width BOLT polyline through A down the frame (letters collapse); invert f264; BOLT SPLIT with a true offset-polygon gutter (B #40–46); straighten → M2F (B #47–48); sequencer 3 f clockwise with orange gutter wires (B #49–60); windows shrink into the DOT (B #61) | FLAME → DOT at A |
| S4 | `s4_light.js` | 344–479 | light word with the orange o (SK) / tittle (EN); it flies to A and becomes the BULB as letters collapse; bulb-window strobe (≤ 3 alternations, B #64–71 trimmed) → ON + 8 ray capsules; stepped zoom-out on the Edison catalogue (title cropped, B #74–77); "light everywhere" registered montage around the bulb (B #78–91, Tesla invert f464) | DOT → BULB at A (+ base) |
| S5 | `s5_sun.js` | 480–647 | night Earth: BULB → SUN ring (mixCell) with the Earth's limb registered to the disc window; sun disc montage accelerating 8→2 f, concentric registration (B #93–118); rays; ring → the orange **o** of the sun word (makeMorph ring→o) as the word slides in; Tatras roof glimpsed in the o's counter; push THROUGH the counter (screen-space iris, B #120–122) | BULB → full-bleed Tatras (cover, static) |
| S6 | `s6_solaro.js` | 648–735 | Tatras full-bleed + DOT pop; white score lines; gridCut 6×10 (invisible at p=0); PROOF: the 60 cells swap to other Solaro client roofs in a diagonal 2 f wave; LIT 3D flip wave to orange (extruded cells, concentric), continuous log zoom-out (no stepped zoom during the flip); panel → 2×2 → mark radii/holes (proto_end) ; gap breath with white ✦ | Tatras → markEnd() |
| S7 | `s7_lockup.js` | 736–887 | mark → lockup; sun word slides out from behind the mark with an orange o; → **Solaro** (s→S makeMorph; shared letters glide; extra letters collapse to dots that grow into orange a/r/o; two-tone a & o orange for a beat), snap to ink on the chord f772 + ring pulse; `solaro.sk` hard wipe; static hold ≥ f800 | markEnd() → lockup (= f0) |

Contracts in code: `scenes/solaro/spine.js` (`dot()`, `flame(f)`, `bulb()`, `bulbBase()`, `sun()`, `markEnd()`).

## 4. Engineering conventions
- **Hard cuts vs motion blur**: with motion blur, `draw(ctx, f)` is called at sub-frame times f = N ± 0.25. Decide every
  discrete event (image swaps, cuts, inverts, appear/disappear) on the integer frame `F = Math.round(f)` so a blurred
  frame never blends two shots; use the continuous `f` only for motion.
- Section module default export: `{ name, f0, f1, needs: [[f0,f1,[keys]]], blur: [[f0,f1,n]], cues: [{f, kind, ...params, gain?, pan?}], async load(), draw(ctx, f) }`.
  `draw` gets the absolute frame `f` (float when motion-blurred). Composed by `scenes/film.js`.
- Images by registry key (`assets/registry.json`, built by `python3 tools/build_registry.py`): flat = `<name>`, cutout = `<name>.cut`.
  Put your hot points / disc radii / focus in `assets/points/<section>.json` and rebuild the registry.
  Draw with `engine/window.js` `windowImage(ctx, key, {mode:'reg'|'cov', clip, pt, P, w, box, focus, zoom, push})`.
- Test a section alone: `node tools/render.mjs --film film --q "only=s3" --from 222 --to 344 --out out/s3.mp4 --workers 2`
  then `python3 tools/review.py out/s3.mp4 out/s3 --from 222 --step 2` and LOOK at every sheet; also `--q "lang=en&only=s3"`.
  Stills: `--frames 230,250,264 --png out/s3png`.
- Sound cue kinds (audio/synth.py): kick, tick, hat, clap, pop, stone, crackle, whoosh, fire, thunder, buzz, zap, bell,
  pluck, bass, pad, riser, impact, shimmer, chord, sub, clunk, glint. Put transients 2 f after their picture event.
  IMPORTANT: `f` in a cue is the FRAME; pass an instrument's frequency as `freq` (e.g. {f: 300, kind: 'bell', freq: 1318}).
- Do not commit. Do not edit other sections' files or the engine core without saying so in your report.
