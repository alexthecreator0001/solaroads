# Storyboard C: "Typography drives the story"

Key **C-typographic**. Vertical film, 1080×1920, 60 fps, **888 frames (f0–f887, 14.80 s)**. It loops: f887 → f0 is seamless.

- **Colours:** paper #FFFFFF, ink #1C1C1C, and the brand gradient #FF5E2B→#FF3D00 as the only colour.
- **Inverts:** four 2-frame flashes, at f48, f240, f408 and f552.
- **Type:** Poppins (Bold 700 for hero words; Light 300 for 22 frames as a "lights off" state) plus the logo's own wordmark glyphs S o l a r.
- **Anchor:** A = (540, 940). Every hero word's x-height band is centred on y 940.

All geometry below was measured from `fonts/poppins/*.ttf` and `assets/solaro-logo.svg`, using the same layout rules as `engine/text.js layoutHybrid`. It is not guessed.

---

## 1. Concept, copy, language

### Concept in 3 lines
1. **The letters of Solaro are older than electricity.** The **l** is a lightning bolt, the **a** is a flame and then a bulb, and the **o** is the sun. The mark's ring *is* the wordmark o and the mark's pin *is* the wordmark a.
2. **Six words tell the whole evolution: kameň → plameň → blesk → svetlo → slnko → Solaro.**
   - Each word turns into the next by *letter surgery*: a letter loses its arms, a letter grows from a spark, one leg is cut off.
   - In every word one orange **hot letter** becomes the object of its era, and fast B&W image bursts play under it.
3. **At the end the hot letters leave the word and become the mark.** The sun (o) becomes the ring and the flame (a) becomes the pin. Two solar cells grow from the point where the first spark was born. The logo is literally assembled from the story.

### Copy: every word that appears on screen

| frames | SK (primary) | meaning | EN alternate (same frames) |
|---|---|---|---|
| f0–24 | `solaro.sk`, then the `Solaro` wordmark, deleted by the cursor | – | same |
| f96–117 | **kameň** | stone | **flınt** (the spark lands as the tittle) |
| f118–123 | *lameň* (transient, 4 f, mid-surgery, never held) | – | (transient) |
| f124–155 | **plameň** | flame | **flame** |
| f220–245 | **blesk** | lightning | **bolt** |
| f388–399 | **svet** (typed, held 8 f) | world | – |
| f400–437 | **svetlo** | light | **glow** |
| f648–711 | **slnko** | sun | **solar** |
| f711–887 | **Solaro** (the real wordmark paths) | – | **Solaro** |
| f770–887 | **solaro.sk** (end card, SemiBold 44 px) | – | **solaro.sk** |

There is no other text: no eyebrows, captions, years, numbers or claims.

### Language: Slovak first, English as a drop-in alternate

**Why Slovak is primary:**
- **Audience.** Solaro sells only in Slovakia and its site speaks formal Slovak.
- **No grammar.** Every word is a bare noun, so there are no formal/informal or grammar problems.
- **The surgery only works in Slovak.**
  - **kameň / plameň** (stone / flame) rhyme, and the k → l surgery depends on that pair.
  - The last three words, **svetLO · SLnkO · SoLarO**, all contain the brand's own letters S, l and o. Across the final 4 seconds the l and o literally survive from word to word, so those morphs are glides, not distortions.
- **Rhythm.** Read aloud, the copy is a chant: KA-meň · PLA-meň · BLESK · SVET-lo · SLN-ko · SO-la-ro. The single-syllable *blesk* is the thunder clap.

**The EN alternate** uses the same frames and four of the five mechanisms: *flint → flame · bolt · glow · solar → Solaro*. Use it for tests outside SK. The deltas are in §8.

---

## 2. System sheet (every shot is built from these numbers)

### 2.1 Type slots (layoutHybrid: S o l a r come from the logo, the other letters from Poppins)

| slot | spec | x-height band | wordmark scale k | l (wordmark) | o (wordmark) |
|---|---|---|---|---|---|
| **T240** | Poppins Bold 240 px, baseline **1007**, centred | 873–1007 (centre 940) | 0.6101 | 39.6 × 187.5 | 140.5 × 137.4, counter 60 × 63 |
| **T300** (punch word) | Poppins Bold 300 px, baseline **1024** | 857–1024 (centre 940) | 0.7627 | 49.5 × 234.4 | – |
| **L240** (lights off) | Poppins **Light** 240 px, baseline 1007, centred, *pure Poppins* (no wordmark glyphs) | 876–1007 | – | Light l stem 16.8 × 177.6 | – |
| **HERO** | the wordmark paths at s 0.6101, origin (−192.8, 778.0) | baseline 1007 | 0.6101 | – | – |
| **LOCKUP** | the full logo at s **0.48** (83 % W), origin (92.3, 832.2), wordmark baseline 1012.4 | – | 0.48 | 31.2 × 147.5 | – |
| **URL** | Poppins SemiBold 44 px, baseline 1146, centred | – | – | stem 6.2 × 32.6 | – |

**Letter boxes (ink x-ranges, px).** This is the choreography data.

| word / slot | letters |
|---|---|
| kameň T240 | k 118–250 (stem 118–159, arms 159–250) · a 262–402 · m 428–654 · e 674–809 · ň 830–964 |
| plameň T240 | p 79–220 · l 239–278 · a 301–441 (bowl centre 371, 942) · m 467–692 · e 713–847 · ň 869–1002 |
| blesk T300 | b 149–326 · **l 348–398** · e 420–588 · s 606–751 · k 783–949 |
| svet L240 | s 307–406 · v 422–546 · e 561–687 · t 705–776 |
| svetl + bulb L240 | s 198–297 · v 313–437 · e 452–578 · t 596–667 · l 694–711 · bulb glass centre (825, 942) |
| svetlo T240 | s 176–292 · v 304–450 · e 459–594 · t 605–690 · l 709–749 · o-slot 771–912 (centre 841, 942) |
| slnko T240 | s 219–335 · l 356–396 · n 422–555 · k 584–716 · **o 728–869 (centre 799, 942)** |
| Solaro HERO | S 134.8–264.8 · o1 280.8–421.3 · l 446.1–485.7 · **a 510.6–650.6** · r 676.6–793.9 · **o2 804.7–945.2** |
| Solaro LOCKUP | S 350.1–452.3 · o1 465.0–575.5 · l 595.0–626.2 · a 645.8–755.9 · r 776.3–868.6 · o2 877.1–987.7 · mark x 92.3–307.9 |
| solaro.sk URL | x 439–641 (final), cursor after it at 645–651 |

**Poppins Bold k, measured by scanline.** The stem runs from x 62 to 233 units at every height. The arms lie entirely right of x 233 above and below the junction. The junction is at y ≈ 300 units, which is **screen y 935**. So the k splits cleanly along one vertical line, *k = stem ∪ arms*. The stem is a rectangle the same size as an l (41 × 178 px against the wordmark l's 39.6 × 187.5).

### 2.2 The orange element: states (each one is an exact Solaro cell, glyph or path)

| state | definition (screen px) | used |
|---|---|---|
| **dot** | circle r 17 at A | between all beats |
| **✦ white** | the negative space of `markCells(cx,cy,s,0)`: four quarter-circles of radius C/2 | f29–32, f757 |
| **✦ orange** | `sparkPath(cx, cy, R)` filled | f33–41 (R 91.8), f48–56 (R 120→60), f114–115 (R 56) |
| **cursor-L** | rect 31.2 × 147.5 (the wordmark l at the lockup scale) | f11–27 |
| **cursor-T** | rect 16.8 × 177.6 (the Poppins Light l) | f384–404 |
| **cursor-U** | rect 6.2 × 32.6 (the SemiBold l at 44 px) | f0–10, f770–887 |
| **ember** | circle r 9 in the a's counter: (332, 942), gliding to (371, 942) | f116–147 |
| **hot a** | wordmark a glyph with the brand gradient | f144–147, f705–745 |
| **flame** | pin cell, **C 236, rot −135°** (square corner up), cell centre (540, 962). Tip (540, 809), base y 1080, teardrop hole r 56.6 | f148–215 |
| **bar = l** | rect 49.5 × 234.4 at x 348.3–397.8, y 789.6–1024: exactly the l of *blesk* | f216–235 |
| **bolt** | stroke width 49.5 (the l stem), miter joins, butt caps, polyline **(455,−60)→(330,640)→(405,700)→(373,1024)** | f236–263 |
| **bulb (word)** | pin **C 137, rot +45°** (corner down), glass centre (825→841, 942). Tip y 1031. Base = 3 capsule cells, widths 66/55/44, height 10.3, centres y 1042/1060/1078 | f401–431 |
| **bulb (hero)** | pin C 300, rot +45°, glass centre (540, 900). Tip y 1095. Capsules 144/120/96 × 22.5 at y 1119/1158/1197. The hole (r 72) shows the photo's filament | f432–455 |
| **ring = sun** | ring cell C 300 → 640 at A, hole r = 0.2397 C (Ø 307 at C 640) | f456–503 |
| **sun cell** | ring cell C 174 at A, then a square cell 174 with r 20.3 (0.1164 C, the mark's small-corner ratio) | f576–641 |
| **hot o** | wordmark o glyph with the brand gradient | f648–745 |
| **mark** | `markCells(200.1, 940, 0.48, g)`, g 0 → 40.816 | f744–887 |

All fills use the vertical brand gradient over the shape's own bounding box, as in `drawCell`.

### 2.3 Paint-on vocabulary (the typesetter's tools; at most two per shot)

- **G (guides).** Two 2 px ink hairlines across the full width, at the current slot's baseline and x-height.
  - They draw left to right in 4 f (linear) just before a word lands and retract right to left in 4 f after it.
  - They appear at four word beats only. They are this film's signature, in place of the reference's ruled guides.
- **K (keyline).** The exact parallel offset of the hot shape. The same cell is redrawn with w/h + 2d and every corner radius + d, with d = 18 px. That makes it mathematically exact, not an approximation. It is a 4 px ink line that draws on from the tip in both directions over 6 f.
- **C (construction circle).** A 4 px ink circle that draws clockwise from 12 o'clock at about 80°/f and un-draws counter-clockwise.
- **R (rays).** 12 orange capsules, 12 px wide with round caps, from r 40 to r 260 around the dot. Out in 3 f (expoOut), in over 2 f.
- **Arc.** A 12 px orange stroke on a hand-placed polyline over an engraved arc, drawn on over 4 f (linear).
- **Pulse.** A 4 px ink hairline along a cable, plus a 70 px orange capsule running along it at 160 px/f.

### 2.4 Notation
- **`reg (u,v)→(X,Y) · w N%`.** The image point at fraction (u, v) of its width/height lands on screen point (X, Y). The image is displayed N % of 1080 px wide.
  - Values with ≈ were read off 10×10 grids drawn over the sources.
  - They go into `regs.json` and get one 2-hour registration pass (see §7).
- **Treatments:**
  - **[cut]**: the existing `assets/processed/<era>/<name>.cut.png`.
  - **[eng]**: engraving with the paper levelled to #FFFFFF.
  - **[ph]**: photo converted to B&W.
  - **[inv]**: B&W then inverted, so night skies and black backgrounds become white.
  - **[disc]**: circle-masked to the registered disc.
- **push p** is a constant camera scale ratio per frame about A, applied to images only unless stated.
- **Eases** use the engine names: E.snap, E.whip, E.swift, E.punch, expoIn/expoOut, cubicInOut, quadIn, quartOut. "log" means the ease is applied to log(scale).
- **Asset paths:** every image path is relative to `assets/raw/`. The full list is in §9.

### 2.5 The seven mechanisms (the whole film is these, reused)

| # | mechanism | engine base | used in |
|---|---|---|---|
| M1 | **TYPESET**: guides, expoOut slide-in with one blurred frame, centre-aligned typing (1 glyph/f, each pops 50 %→100 % over 2 f, the line re-centres every frame), backspace | `layoutHybrid`, `drawWord` | open, kameň, blesk, svetlo, slnko, URL |
| M2 | **LETTER SURGERY**: `planWordMorph` with custom ops. Glide; drop to a point; grow from an orange dot then snap to ink in 1 f; **split glyph** (k = stem + arms by a vertical clip); glyph↔glyph morphs **only between identical topologies** (s→S, n→r, Light→Bold) | `wordmorph.js` | kameň→plameň, svet→svetlo, slnko→Solaro |
| M3 | **HOT LETTER = CELL**: glyph↔cell `makeMorph` (a↔pin, o↔ring, both near-identical), then `mixCell` chains (pin↔bar↔bulb↔ring↔square) | `shapes.js`, `morph.js` | everywhere |
| M4 | **BURST**: `montage()` + `regs.json` + a constant push + a persistent overlay (dot / flame / bolt / bulb / disc) | `seq.js`, `draw.js` | 8 bursts |
| M5 | **COUNTER CAMERA**: push *through* a counter (log quadIn), pull *out of* a counter (log expoOut), stepped zoom | `camera()` | the o (f492), slnko (f648), jars (f288), Scheiner (f564) |
| M6 | **CELL GRID**: registered grids, `gridCut`, waves | `gridCut` | f564–647 |
| M7 | **3D**: Stage3D, GLB flints, extruded ring | `three-layer.js`, `proto_strike` | f40–57, f462–485 |

---

## 3. Beat map and music grid

### 3.1 Beat map

| # | section | frames | seconds | what it says |
|---|---|---|---|---|
| 0 | **OPEN: erase the brand** | 0–47 | 0.00–0.80 | The cursor backspaces `solaro.sk` and `Solaro`. The mark centres and closes, the ✦ is born, and it becomes the dot. |
| 1 | **STRIKE** | 48–95 | 0.80–1.60 | Two 3D flints hit the dot. Spark burst. 8 images of stones, sparks and hands. |
| 2 | **kameň → plameň** | 96–155 | 1.60–2.60 | The spark knocks the arms off the k (stone becomes flame). The a catches fire and becomes the flame. |
| 3 | **FIRE** | 156–215 | 2.60–3.60 | The flame is persistent over 9 lamps, candles and torches, ending on Prometheus reaching for the sun. |
| 4 | **blesk** | 216–263 | 3.60–4.40 | The flame whips into the l. The l bends into a bolt. Invert. 5 bolts. |
| 5 | **CURRENT** | 264–383 | 4.40–6.40 | 24 images: kite, jars, piles, Galvani, a Tesla flipbook, dynamos, pylons, and the Earth at night ending on Slovakia. |
| 6 | **svet·lo** | 384–455 | 6.40–7.60 | The dot becomes a cursor and types *svet* (world), then *lo*. The o arrives as a bulb. Switch: invert plus a Light→Bold weight surge. 5 Edison lamps. |
| 7 | **the o** | 456–503 | 7.60–8.40 | Bulb → ring → one clean 3D turn → we dive through the counter. |
| 8 | **SUNS** | 504–563 | 8.40–9.40 | 12 suns registered on one growing disc (8 → 2 f). |
| 9 | **GRID** | 564–587 | 9.40–9.80 | Grid of suns (Scheiner) → round PV cells → square cells. The orange sun cell becomes a solar cell. |
| 10 | **SOLARO** | 588–647 | 9.80–10.80 | 44 Solaro roofs in a cell grid with 2-frame waves, then one roof full frame (Tatras). |
| 11 | **slnko** | 648–695 | 10.80–11.60 | Pull back out of the o: the roof was inside the o of *slnko*. |
| 12 | **Solaro** | 696–743 | 11.60–12.40 | slnko → Solaro: the k loses its arms again, n → r, a and o are born. Hero wordmark with an orange a and o. |
| 13 | **LOCKUP** | 744–767 | 12.40–12.80 | o → ring and a → pin fly into the mark. Tile and leaf grow from the spark point. The gap breathes (✦ → +). |
| 14 | **HOLD** | 768–887 | 12.80–14.80 | Lockup plus `solaro.sk` for **2.0 s**. It loops into f0. |

### 3.2 Music grid: 150 BPM

- One beat = **24 f**, one bar = 96 f, so the film is 9¼ bars. Positions below are written bar.beat, counting from 1.
- The edit is **cut to picture**, as in the reference: foley transients land 0–3 f after the cut.
- The bed (low pulse and hum) is locked to 150 BPM, and every chapter thump sits on a beat.

| frame | bar.beat | hit |
|---|---|---|
| f0–24 | 1.1 | Tail of the previous loop's chord. Backspace ticks: a 9-tick roll (f2–10), then 6 ticks (f13–23). |
| f33 | – | Whoosh out (cells fly) |
| **f48** | **1.3** | **STRIKE**: flint clack, sub thump, crackle tail (invert) |
| **f96** | **2.1** | *kameň* slides in: low thump |
| f114 | 2.1 + 3/4 | Stone-chip "tink" as the k loses its arms, plus crackle (a syncopated 16th) |
| **f144** | **2.3** | **IGNITE**: gas "fwump" |
| f156–215 | – | Fire crackle bed. A thud on the hand-axe (f162). |
| **f216** | **3.2** | **WHIP** whoosh (flame → l) |
| **f240** | **3.3** | **THUNDER** crack plus sub (invert) |
| f264 | 3.4 | Bolt retract "zip", key tink |
| **f288** | **4.1** | 4 ratchet clacks on the stepped zoom (f288/291/294/297) |
| f324–339 | 4.2½ | **50 Hz hum** fades in. 8 whirr ticks on twos (the flipbook). |
| f356 | 4.3½ | Hum swell (pylons) |
| f378 | – | Hum drops out. A small "here" ping on Slovakia. |
| **f384** | **5.1** | Cursor tick, then 4 key clicks (f388–391), 8 f of silence, click (f400) |
| **f408** | **5.2** | **SWITCH**: relay clunk (invert), then a bright "on" tone and the hum returns |
| **f456** | **5.4** | Glass "ting" (bulb → ring). Airy whoosh during the 3D turn, "ting" at f485. |
| f492–503 | – | Push-in whoosh, then 2 f of air (the white counter) |
| **f504** | **6.2** | Into the sun: soft low boom. Paper ticks +1 f after every cut. |
| **f552** | **6.4** | Eclipse invert: reversed shimmer |
| **f576** | **7.1** | Orange "pop" (dot → sun cell) |
| **f600** | **7.2** | Riser starts. Ticks accelerate to every 2 f (the grid waves). |
| **f624** | **7.3** | Grid collapses: suck-in |
| **f648** | **7.4** | Pull back: reverse whoosh, then **near-silence** (room tone, −40 dB) to f695 |
| **f696** | **8.2** | Soft letter ticks, the k-arm "clink" |
| f720 | 8.3 | Warm pad enters under *Solaro* |
| **f744** | **8.4** | Two rising plinks (o and a lift off). Gap "whoomph" at f758. |
| **f768** | **9.1** | **CHORD**: D major add9 (D–A–E–F♯), bright and warm. It sustains and decays to −30 dB by f887 so it meets the loop. Typing ticks for `solaro.sk` at f770–778. |

### 3.3 Pacing (computed from the cut list below)

- 96 picture changes. **Median shot 4 f**, mean 8.8 f. 58 shots are 4 f or shorter.
- Cuts per 0.5 s, by half-second: 0 · 2 · 7 · 2 · 0 · 5 · 5 · 1 · **9 · 7 · 10 · 10** · 6 · 2 · 4 · 2 · 1 · 6 · 8 · 4 · 1 · 3 · 0 · 0 · 0 · 1 · 0 · 0 · 0 · 0.
- On top of that, the Solaro grid (f592–623) changes cells in 2-frame waves. That is the visual peak: 44 images changing, the equivalent of the reference's 15-cuts-per-0.5 s climax.
- **Text beats** (static read time): kameň 11 f · plameň 20 f · blesk 11 f · svetlo 15 f · slnko 24 f · Solaro 32 f. Each word beat is 30–60 f in total.
- **Shape:** dense, then breath, then denser, then landing. The last 2.4 s has 1 cut.

---

## 4. Shot table (f0–f887, no gaps)

Columns: frames are inclusive (in–out, duration).
- **Orange** = the orange element.
- **Paint** = paint-on.
- **Cam** = camera.
- **→** = transition into the next shot, and why it is seamless.
- **Blur** = motion blur (sub-frame samples).
- **Sfx** = sound.

### §0 OPEN: erase the brand (f0–47)
White, no images. Proto_open is kept from the gap-close onward. Its "wordmark sucked into the mark" is replaced by a typed backspace.

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S01 | 0–1 (2) | – | cursor-U on, right of `solaro.sk` (x 645–651, y 1113–1146) | – | LOCKUP (mark 92.3–307.9, wordmark 350.1–987.7) + `solaro.sk` URL x 439–641 | locked | identical to f887 (the loop) | off | chord tail |
| S02 | 2–10 (9) | – | cursor-U backspaces k s . o r a l o s at 1 glyph/f. Centre-aligned, so the line re-centres every frame. | – | `solaro.sk` → "" | locked | continuous | off | 9-tick roll |
| S03 | 11–12 (2) | – | The cursor jumps to the end of the wordmark (x 992, y 865–1012) and grows into cursor-L (E.snap) | – | – | – | continuous | 1 f smear | tick |
| S04 | 13–24 (12) | – | cursor-L backspaces o2, r, a, l, o1, S, 2 f per letter. Each letter vanishes on its first frame and the cursor jumps left in 1 f. | – | After each deletion the lockup re-centres (cubicOut 4 f, overlapping). The mark glides from centre x 200.1 to **540**. | – | the mark arrives at A | off | 6 ticks |
| S05 | 25–32 (8) | – | f25–27: the cursor slides left *behind* the cells and shrinks to 0 at the mark centre | – | – | Mark scales 0.48 → 0.9 about A (E.snap, f25–30). Gap G 40.8 → 0 units (E.inCubic, f29–32), leaving a **white ✦ R 91.8** in the negative space. | exact: `markCells(540,940,0.9,g)` | off | tuck plus tension swell |
| S06 | 33–41 (9) | – | f33: the ✦ fills orange. f37–41: it shrinks R 91.8 → 17 with a +45° turn (log expoIn); in the last 2 f, `makeMorph` ✦ → circle r 17 = **dot at A**. | – | – | f33–36: the four cells fly out along their diagonals 700 px (expoIn) | morph through a point | **on** f33–36 (4) | whoosh out |
| S07 | 42–47 (6) | **3D** `spark-fire/3d/spark-fire-3d-flint-nodule-0370-zenodo.glb` (left) and `…-0373-zenodo.glb` (right), via the lite GLBs in `assets/3d/`. B&W, each ≈ 40 % W, flying in along y 940 from f40 (expoIn 8 f). | dot at A | – | – | – | the stones meet exactly at f48 | **on** (stones, 4) | rising suction |

### §1 STRIKE (f48–95)
Defaults: dot at A. Images are in-place swaps registered with their hot spot on A, push 1.008/f. Spark particles from S08 keep falling over S09–S10.

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S08 | 48–57 (10) | 3D flints: contact at A on f48, then rebound ±40 px and ±4° (expoOut, f50–57) | ✦ R 120 (f48) → 60 (f50) → morph to dot (f56). 18 streaks: `sparks(t,0.8s,540,940,{count:18,speed:1400,gravity:2600})`, f48–70. | – | – | **f48–49 INVERT** (bg ink, stones negative, orange untouched) | hard cut, dot persists | radial on the ✦ (f48) | **STRIKE** (1.3) |
| S09 | 58–63 (6) | `spark-fire/spark-fire-hooke-sparks-flint-steel-micrographia-wellcome.jpg` [eng]: globule B reg (0.53,0.25)→A · w 160 % (globule ≈ Ø 240) | dot on Hooke's spark globule | **C** Ø 260 around the dot, draws f58–62 and persists to f85 | – | push 1.008 | in-place swap under dot + C | off | sizzle tail |
| S10 | 64–67 (4) | `spark-fire/spark-fire-engraving-strike-a-light-stones-hough1890.jpg` [eng]: left edge of the round pyrite (≈0.70,0.33)→A · w 160 % | dot | C | – | push | swap | off | tick |
| S11 | 68–71 (4) | `spark-fire/spark-fire-engraving-flint-and-steel-ring-hough1890.jpg` [eng]: striking edge inside the steel ring (≈0.62,0.50)→A · w 140 % | dot | C | – | push | swap | off | tick |
| S12 | 72–74 (3) | `spark-fire/spark-fire-fire-steel-oval-kulturparken.jpg` [cut]: ring centre (0.50,0.48)→A · w 95 %. The dot sits *inside* a ring: the first o. | dot | C | – | push | swap | off | tick |
| S13 | 75–77 (3) | `spark-fire/spark-fire-flint-striker-islamic-met.jpg` [cut]: inside of the C-curve (≈0.58,0.45)→A · w 90 % | dot | C | – | push | swap | off | tick |
| S14 | 78–81 (4) | `spark-fire/spark-fire-handaxes-nine-bifaces-met.jpg` [ph]: tip of the tall centre axe (≈0.50,0.20)→A · w 120 % (nine at once) | dot | C | – | push | swap | off | tick |
| S15 | 82–84 (3) | `spark-fire/spark-fire-cave-hand-stencils-gillow-flickr.jpg` [ph]: left palm centre (≈0.33,0.45)→A · w 150 % | dot | C | – | push | swap | off | tick |
| S16 | 85–89 (5) | `spark-fire/spark-fire-hand-reaching-cast-met.jpg` [cut]: index fingertip (≈0.95,0.60)→A · w 110 % (the arm bleeds off the left) | dot on the fingertip | C un-draws counter-clockwise f86–89 | – | push | cut to white | off | – |
| S17 | 90–95 (6) | – (white) | dot | **G** (1007/873) draws left to right f92–95 | – | static | the page is set for type | off | room tone, tick f92 |

### §2 kameň → plameň (f96–155)
Defaults: white. Push 1.003/f on the whole frame. Guides persist until f148.

| Shot | Frames | Image | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S18 | 96–98 (3) | – | The dot stays at A, over the m | G | **kameň** T240 slides in from x −110 px (expoOut 3 f) | push 1.003 | continuous | f96 (1 blurred frame) | slide plus thump (2.1) |
| S19 | 99–109 (11) | – | dot. f108–109: swells +12 % (anticipation). | G | read *kameň* | push | – | off | – |
| S20 | 110–113 (4) | – | **Comet.** The dot flies a quadratic arc A → ctrl (330,700) → **(160, 935)** = the k's arm junction. Speed is quadIn. A 6 px ink trail up to 120 px long retracts behind the orange head. | – | – | push | – | off | whistle-zip |
| S21 | 114–123 (10) | – | **f114 impact:** ✦ R 56 at (160,935) for 2 f, plus 8 streaks. **f116:** the ✦ splits. One spark lands at (150,940) and grows into an **orange p** (f120–123, E.snap), which snaps to ink at f124. The other drops into the a's counter as the **ember** (r 9 at 332,942). | – | **Surgery.** f114: the k is clipped at x 159 (the stem's right edge). The arms (x 159–250) fall: rot 0 → +38°, Δ(+70, +330), scale → 0 (quadIn, f114–121). f115–117: the stem rect morphs into the wordmark l (41 × 178 → 39.6 × 187.5, `mixCell`). f118–123: everything glides to the *plameň* layout (cubicInOut): l 118→239, a 262→301, m/e/ň +39. | push | one continuous move, so the word changes without a cut | arms: 2 samples | **k-arm "tink"** (f114) |
| S22 | 124–143 (20) | – | The ember pulses in the a's counter at (371,942): r 9 ±15 % every 6 f | G | read **plameň** | push | – | off | ember hiss |
| S23 | 144–147 (4) | – | **The a ignites.** Orange fills the a from the baseline up (clip top 1009 → 869, linear). The ember merges into it. | G | – | push | – | off | **IGNITE** (2.3) |
| S24 | 148–155 (8) | – | f148–151: the a → pin C 137 at (371, 942) (glyph→cell `makeMorph`, a near-identity because pin_BR = the wordmark a). f148–155: the pin turns −135° (tip up), grows C 137 → 236 and travels to the **flame** cell centre (540, 962) (E.snap with 4 % overshoot). | G retracts right to left f148–151 | p, l, m, e, ň shrink to their baseline centres (expoIn 4 f), staggered 1 f outward from the a (l and m, then p and e, then ň) | push | the flame settles in S25 (no cut) | pin: 2 samples f150–153 | rising flame whoosh |

### §3 FIRE (f156–215)
Defaults:
- The **flame** is persistent: pin C 236, rot −135°, centre (540, 962). It flickers in y only, ±3 %, about its base (540, 1080), with deterministic noise at about 7 Hz.
- Every image is registered so its wick or flame base lands on **(540, 1080)**, with push 1.008/f on the images.
- **K** (keyline) is persistent.

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S25 | 156–161 (6) | – (white) | The flame settles (overshoot back to 1.0 by f158) | **K** (d 18, 4 px ink) draws from the tip both ways f156–161 | – | static | – | off | crackle bed in |
| S26 | 162–167 (6) | `spark-fire/spark-fire-handaxe-red-acheulean-met.jpg` [cut]: axe centre (0.50,0.50)→(540,945) · w 46 % (the axe is ≈ 2× the flame) | The flame sits inside a stone teardrop: a **shape rhyme**, stone → flame | K | – | push 1.008 | in-place swap | off | stone thud |
| S27 | 168–173 (6) | `spark-fire/spark-fire-candle-flame-1g-vs-microgravity-nasa.jpg` [inv], left panel only: wick (0.27,0.65)→(540,1080) · w 150 %. The photo's flame (≈ 680 px tall, dark on white) wraps the orange one. | flame | K | – | push | swap | off | – |
| S28 | 174–178 (5) | `spark-fire/spark-fire-oil-lamp-roman-plain-met.jpg` [cut]: nozzle hole (≈0.50,0.78)→(540,1080) · w 75 % | flame | K | – | push | swap | off | – |
| S29 | 179–183 (5) | `spark-fire/spark-fire-oil-lamp-bronze-roman-cleveland.jpg` [cut]: spout tip (≈0.10,0.55)→(540,1080) · w 120 % (bleeds right) | flame | K | – | push | swap | off | – |
| S30 | 184–187 (4) | `spark-fire/spark-fire-tinderbox-met.jpg` [cut]: left candle socket (≈0.29,0.30)→(540,1080) · w 150 % | flame | K | – | push | swap | off | – |
| S31 | 188–191 (4) | `spark-fire/spark-fire-lantern-pierced-tin-met.jpg` [cut]: lantern centre (0.50,0.55)→(540,1000) · w 60 % | The flame is "inside" the lantern | K | – | push | swap | off | – |
| S32 | 192–196 (5) | `spark-fire/spark-fire-torch-bearing-arm-met.jpg` [cut]: socket mouth (≈0.85,0.08)→(540,1080) · w 150 % (the arm bleeds down-left) | The flame is the torch | K | – | push | swap | off | – |
| S33 | 197–201 (5) | `spark-fire/spark-fire-ignis-fire-element-met.jpg` [eng]: brazier flame base (≈0.19,0.20)→(540,1080) · w 260 % | flame | K | – | push | swap | off | – |
| S34 | 202–215 (14) | `spark-fire/spark-fire-prometheus-torch-to-sun-met.jpg` [eng]: torch tip (≈0.21,0.19)→(540,1080) · w 200 % (the sun's rays fall around the flame) | flame | K retracts f210–213 | – | push accelerates 1.006 → 1.03/f (quadIn) | hard cut to white plus the whip | zoom blur f212–215 | riser into the whip |

### §4 blesk (f216–263)

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S35 | 216–224 (9) | – (white) | **Flame → l.** f216–221: `mixCell` pin(C 236, rot −135°, centre 540,962) → rect 49.5 × 234.4, centre (373, 906.8), rot −180° (a rect at 180° looks identical), radii → 0, the hole collapses to its centre (E.whip 6 f) | **G** (1024/857) draws f218–221 | **Slam.** f220–224: b from the left (f220); e, s, k from the right (f221–223). Each is expoOut 3 f with one blurred frame. The result is **blesk** T300 with the l orange. | static | the flame *becomes* the letter | **on** f216–219 (4), 1 f per letter | **WHIP** (3.2) |
| S36 | 225–235 (11) | – | the orange l | G | read *blesk* | push 1.004 | – | off | low rumble |
| S37 | 236–239 (4) | – | **l → bolt.** The l is a 49.5 px stroke on the polyline (373,790)→(373,1024). P0 shoots to (455,−60) (expoOut 2 f). P1 moves to (330,640) and P2 to (405,700) (E.punch 4 f). P3 stays fixed at (373,1024), on the baseline. The width stays constant and the joins are mitred. | G | – | – | – | P0 1 f smear | crackle build |
| S38 | 240–241 (2) | – | bolt (orange) | G (white) | blesk (white) | **INVERT** | – | off | **THUNDER** (3.3) |
| S39 | 242–245 (4) | – | bolt | G retracts | b, e, s, k shrink to baseline points (expoIn 4 f; e first, then b and s, then k) | – | the bolt alone, ready for the photos | off | thunder tail |
| S40 | 246–250 (5) | `lightning-early/lightning-early-bolt-spokane-1914-loc.jpg` [inv]: channel top (≈0.57,0.00)→(455,−60), ground strike (≈0.52,0.72)→(373,1024) · w ≈ 90 % | the bolt persists as the overlay | – | – | push 1.009 (images) | in-place swap under the bolt | off | rain hiss |
| S41 | 251–254 (4) | `lightning-early/lightning-early-bolt-branched-night-nasa.jpg` [inv], crop x 0.1–0.9, y 0–0.62 (no logo or timestamp): top (≈0.43,0)→(455,−60), ground (≈0.35,0.60)→(373,1024) · w ≈ 210 % | bolt | – | – | push | swap | off | – |
| S42 | 255–257 (3) | `lightning-early/lightning-early-strike-building-engraving-wellcome.jpg` [eng]: zigzag origin (≈0.55,0.05)→(455,−60) · w 250 % | bolt | – | – | push | swap | off | – |
| S43 | 258–260 (3) | `lightning-early/lightning-early-richmann-killed-engraving-wellcome.jpg` [eng]: window bolt (≈0.72,0.25)→(405,700) · w 160 % | bolt | – | – | push | swap | off | – |
| S44 | 261–263 (3) | `lightning-early/lightning-early-bolt-jennings-1882-loc.jpg` [inv]: bolt foot (≈0.83,0.68)→(373,1024) · w 250 % | bolt | – | – | push | swap | off | – |

### §5 CURRENT (f264–383)
Defaults: dot at A. Images in-place, registered with the hot spot on A, push 1.008/f.

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S45 | 264–268 (5) | `lightning-early/lightning-early-franklin-kite-currier-ives-loc.jpg` [ph]: **the key** on the string (≈0.53,0.47)→A · w 300 % | The bolt un-draws from P0 down its own path into P3 (f264–266, linear). The head (dot) glides to A (f266–268, cubicInOut), landing on the key. | – | – | push | the dot carries over | off | zip plus key tink (3.4) |
| S46 | 269–271 (3) | `lightning-early/lightning-early-kite-romas-1753-figuier.jpg` [eng]: kite (≈0.85,0.15)→A · w 180 % | dot | – | – | push | swap | off | tick |
| S47 | 272–275 (4) | `lightning-early/lightning-early-leyden-jar-hand-discharger-adams-wellcome.jpg` [eng]: spark gap at the knob (≈0.38,0.33)→A · w 140 % | dot | – | – | push | swap | off | spark tick |
| S48 | 276–280 (5) | `lightning-early/lightning-early-leyden-nollet-spark-wellcome.jpg` [eng]: centre of the radiating ring (≈0.50,0.42)→A · w 170 % | dot | **R**: 12 orange rays out f276–278, in f279–280 | – | push | swap | off | zap |
| S49 | 281–287 (7) | `lightning-early/lightning-early-leyden-jar-battery-smithsonian.jpg` [cut]: centre of the four jars (≈0.50,0.45)→A · w 80 % (four jars = the mark's 2×2) | dot | – | – | push | swap | off | – |
| S50 | 288–299 (12) | `lightning-early/lightning-early-leyden-battery-64-jars-wellcome.jpg` [eng]: centre jar knob (≈0.48,0.10)→A. **Stepped zoom-out:** w 420 % (f288) → 230 % (f291) → 160 % (f294) → 128 % (f297), with a 0.985/f drift inside each step. | dot on the knob | – | – | stepped 0.55× / 0.70× / 0.80× | jump cuts; the whole box of 64 appears | off | 4 ratchet clacks (4.1) |
| S51 | 300–304 (5) | `lightning-early/lightning-early-volta-pile-original-wellcome.jpg` [cut]: top terminal (≈0.50,0.06)→A · w 50 % (the column hangs below the dot) | dot | – | – | push | swap | off | – |
| S52 | 305–307 (3) | `lightning-early/lightning-early-volta-pile-griffin-wellcome.jpg` [cut]: top terminal (≈0.52,0.06)→A · w 60 % | dot | – | – | push | swap | off | – |
| S53 | 308–310 (3) | `lightning-early/lightning-early-volta-pile-crown-of-cups-wellcome.jpg` [eng]: top of the first pile (≈0.30,0.30)→A · w 110 % | dot | – | – | push | swap | off | – |
| S54 | 311–314 (4) | `lightning-early/lightning-early-galvani-frog-legs-four-wellcome.jpg` [eng]: second figure's metal contact (≈0.38,0.30)→A · w 140 % | dot | – | – | push | swap | off | twitch tick |
| S55 | 315–318 (4) | `lightning-early/lightning-early-galvani-metal-arcs-wellcome.jpg` [ph, already on white]: apex of the big arc (≈0.50,0.18)→A · w 110 % | dot | **Arc**: orange 12 px along the big arc, left to right f315–318 | – | push | swap | off | – |
| S56 | 319–321 (3) | `lightning-early/lightning-early-machine-guericke-sulfur-globe-wellcome.jpg` [eng]: the globe (≈0.32,0.25)→A · w 220 % | dot | – | – | push | swap | off | – |
| S57 | 322–323 (2) | `lightning-early/lightning-early-machine-plate-galvani-wellcome.jpg` [cut]: disc centre (≈0.50,0.38)→A · w 85 % | dot | **C** Ø 520 snaps onto the disc rim | – | push | the disc becomes the ring that follows | off | – |
| S58 | 324–339 (16) | `electric-age/electric-age-patent-tesla-motor-rotating-field-1888.jpg` [eng]: **flipbook** of the eight ring figures in the right column (Fig 1a–8a at (0.51, 0.240 + 0.0723·k), k = 0…7), each ring centre → A · w 440 % (ring Ø ≈ 520), **2 f per figure** | The dot orbits on the ring (r 260), stepping 45° per figure, so the field visibly rotates | C Ø 520 stays | – | no push (animated on twos) | 8 registered jumps = **our zoetrope** | off | 50 Hz hum plus 8 whirr ticks |
| S59 | 340–343 (4) | `electric-age/electric-age-patent-stanley-induction-coil-1886.jpg` [eng]: Fig 3 ring centre (≈0.45,0.66)→A · w 300 % (ring ≈ Ø 520 = C) | The dot returns to A (2 f) | C un-draws f342–343 | – | push | swap | off | – |
| S60 | 344–347 (4) | `electric-age/electric-age-gramme-dynamo-engraving-obi.jpg` [eng]: armature centre (≈0.55,0.45)→A · w 160 % | dot | – | – | push | swap | off | – |
| S61 | 348–351 (4) | `electric-age/electric-age-pearl-street-station-dynamo-room-1882-engraving-ia.jpg` [eng]: front armature (≈0.32,0.55)→A · w 220 % | dot | – | – | push | swap | off | – |
| S62 | 352–355 (4) | `electric-age/electric-age-tesla-colorado-springs-sparks-wellcome.jpg` [ph]: the sphere on the coil (≈0.10,0.30)→A · w 200 % | dot | – | – | push | swap | off | crackle |
| S63 | 356–359 (4) | `electric-age/electric-age-pylon-silhouette-dusk-sky-wordpress.jpg` [ph, sky keyed to white]: top insulator (≈0.50,0.20)→A · w 100 % | dot | **Pulse** along the upper cable (left to right) | – | push | swap | off | hum swell |
| S64 | 360–362 (3) | `electric-age/electric-age-pylon-vertical-pa-nj-interconnection-habs-loc.jpg` [ph]: apex (≈0.50,0.06)→A · w 110 % | dot | – | – | push | swap | off | – |
| S65 | 363–365 (3) | `electric-age/electric-age-pylons-tva-chickamauga-sky-1942-loc.jpg` [ph]: nearest tower top (≈0.30,0.12)→A · w 120 % | dot | – | – | push | swap | off | – |
| S66 | 366–368 (3) | `electric-age/electric-age-luna-park-electric-tower-night-1905-loc.jpg` [ph]: tower top (≈0.47,0.12)→A · w 180 % | dot | – | – | push | swap | off | – |
| S67 | 369–371 (3) | `electric-age/electric-age-san-jose-electric-light-tower-night-engraving-obi.jpg` [eng]: lamp crown (≈0.50,0.08)→A · w 120 % | dot | – | – | push | swap | off | – |
| S68 | 372–383 (12) | `electric-age/electric-age-earth-at-night-europe-africa-black-marble-nasa.jpg` [disc: the globe circle-masked, Ø 760, a dark disc on white]: **Slovakia** (≈0.66,0.29)→A, so the globe centre lands near (372, 1121) | dot = Slovakia | – | – | push 1.004 f372–377. f378–383: the globe shrinks into the dot (log expoIn ×0.04). | morph through the point: **the world becomes the dot** | zoom blur f380–383 | hum out, "here" ping |

### §6 svet·lo (f384–455)

| Shot | Frames | Image · placement | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S69 | 384–387 (4) | – (white) | The dot stretches into **cursor-T** (16.8 × 177.6) standing on the baseline at x 540 (E.snap 2 f) | **G** (1007/876) draws f384–387 | – | static | – | off | cursor tick (5.1) |
| S70 | 388–399 (12) | – | The cursor rides at the end of the line. It blinks off f396–399. | G | **Typing L240, centre-aligned:** s (f388), v (389), e (390), t (391). Each pops 50→100 % about its baseline centre over 2 f, and the line re-centres every frame. Then *svet* is **held** f392–399 (s 307–406, v 422–546, e 561–687, t 705–776). | static | – | off | 4 key clicks, then silence |
| S71 | 400–407 (8) | – | f400: the cursor turns ink and **is the l** (x 694–711 after re-centring). A new cursor appears at f401 and morphs into the **bulb**: rect → pin C 137, rot +45° (`mixCell`, E.snap f401–404), glass centre (825, 942). The base capsules pop f404–405. Hold f406–407. | G | *svetl* + bulb (s 198–297, v 313–437, e 452–578, t 596–667, l 694–711) | static | – | off | click, glass tink |
| S72 | 408–409 (2) | – | bulb (stays orange) | G (white) | letters white | **INVERT = the switch** | – | off | **SWITCH** (5.2) |
| S73 | 410–416 (7) | – | The bulb glides 825 → 841 | the G x-height line moves 876 → 873 | **Weight surge Light → Bold** (cubicInOut 7 f). Per-glyph `makeMorph`: s, v, e and t are one contour in both weights, and the l is a rect in both (Light l → wordmark l). Positions interpolate to *svetlo* T240 (s 176–292 … l 709–749, o-slot 771–912). | static | "the lights came on" | off | "on" tone plus hum |
| S74 | 417–431 (15) | – | bulb in the o slot | G | read **svetlo** | push 1.004 | – | off | hum |
| S75 | 432–437 (6) | – | The bulb flies to the hero position and grows C 137 → 300, glass centre (841,942) → (540,900) (E.snap) | G retracts f432–435 | l, t, e, v, s shrink to baseline points (expoIn 4 f, staggered from the bulb outward) | – | – | 2 samples on the bulb | whoosh |
| S76 | 438–441 (4) | `electric-age/electric-age-edison-lamp-new-type-smithsonian.jpg` [cut]: glass centre (≈0.52,0.30)→(540,900) · w 56 % (glass Ø ≈ 300 = the orange glass) | Hero bulb. The teardrop hole shows the photo's own filament. | – | – | push 1.008 | in-place swap under the bulb | off | filament buzz |
| S77 | 442–444 (3) | `electric-age/electric-age-edison-lamp-engraving-obi.jpg` [eng, caption cropped]: glass centre (≈0.50,0.30)→(540,900) · w 50 % | bulb | – | – | push | swap | off | – |
| S78 | 445–447 (3) | `electric-age/electric-age-patent-edison-electric-lamp-1880.jpg` [eng]: Fig 1 glass (≈0.56,0.28)→(540,900) · w 140 % | bulb | – | – | push | swap | off | – |
| S79 | 448–450 (3) | `electric-age/electric-age-edison-lamp-stopper-smithsonian.jpg` [cut]: glass (≈0.50,0.25)→(540,900) · w 55 % | bulb | – | – | push | swap | off | – |
| S80 | 451–455 (5) | `electric-age/electric-age-edison-lamp-bamboo-filament-smithsonian.jpg` [cut]: glass (≈0.50,0.33)→(540,900) · w 62 % | bulb | – | – | push | cut to white | off | – |

### §7 The o (f456–503)

| Shot | Frames | Image | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S81 | 456–461 (6) | – | **Bulb → ring** (`mixCell`, E.swift). The pin's square corner rounds (28 → R) and the hole's sharp corner rounds (0 → r), so the rotation no longer matters. The capsules retract up into the glass (h → 0, 3 f). Centre (540,900) → A. Result: ring C 300, hole r 71.9. | – | – | static | morph | off | glass ting (5.4) |
| S82 | 462–485 (24) | **3D**: the ring extruded (`extrude(ring, {depth: 0.12C})`). Front face in the brand gradient; sides #E0481C → #C2370F, key light from the top left. Soft cool contact shadow, an ellipse (#ECEEF1) at y 1330, visible only while tilted. | **One clean turn.** Y 0° → 360° (quartOut 24 f), X-tilt 30° → 0°, C 300 → 640. Edge-on (≈ f468) the o reads as a thick l. | – | – | – | Lands face-on at f485 with shading off, pixel-equal to the 2D ring cell, so it swaps to 2D at f486 | **on** f462–468 (spin) | airy whoosh, ting at f485 |
| S83 | 486–491 (6) | – | Ring C 640 at A (hole Ø 307): **the sun as an o** | – | – | static | – | off | breath |
| S84 | 492–503 (12) | – | – | – | – | **Push through the counter:** ×1 → ×16 about A, log quadIn 12 f (per-frame ratios 1.04 → 1.42). The orange band sweeps out past the frame edges f497–501. **f502–503 are pure white** (we are inside the counter). | hard cut out of white | zoom blur f497–501 | whoosh in, then air |

### §8 SUNS (f504–563): inside the o
Defaults:
- The window is a **registered disc Ø(f) = 600 · 1.0045^(f−504) at A** (600 → 782 px). Every image is scaled so that its disc limb equals Ø(f) and its disc centre sits on A. *That is the push.*
- Overlay: **C** on the limb (4 px ink; draws f504–507, then persists and scales with Ø) and the dot at A.
- Plates and engravings around the disc stay visible. [disc] images are circle-masked.
- Paper tick sound +1 f after every cut.

| Shot | Frames | Image (disc centre (u,v), limb Ø as a fraction of image width) | Orange | Paint | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|
| S85 | 504–511 (8) | `sun-solar/sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg` [disc] (0.50,0.50), 0.88 | dot | C draws f504–507 | Ø 600 → 622 | in-place swap | off | soft boom (6.2) |
| S86 | 512–518 (7) | `sun-solar/sun-solar-kircher-sun-corpus-solis-plate-wellcome.jpg` [eng] (0.51,0.52), 0.62 | dot | C | Ø → 641 | swap | off | tick |
| S87 | 519–524 (6) | `sun-solar/sun-solar-scheiner-rosa-ursina-imago-solis-xvi-ia.jpg` [eng] (0.50,0.33), 0.75 | dot | C | → 658 | swap | off | tick |
| S88 | 525–529 (5) | `sun-solar/sun-solar-sunspot-course-disc-engraving-wellcome.jpg` [eng] (0.50,0.48), 0.85 | dot | C | → 672 | swap | off | tick |
| S89 | 530–533 (4) | `sun-solar/sun-solar-sdo-aia171-corona-loops-2014-nasa.jpg` [disc, B&W] (0.50,0.50), 0.88 | dot | C | → 683 | swap | off | tick |
| S90 | 534–537 (4) | `sun-solar/sun-solar-soho-handle-prominence-nasa.jpg` [disc, B&W] (0.50,0.50), 0.85 (the prominence loop breaks out of the circle at the upper right) | dot | C | → 695 | swap | off | tick |
| S91 | 538–540 (3) | `sun-solar/sun-solar-mouchot-solar-engine-paris-1878-tekniska.jpg` [eng]: mirror-cone mouth (≈0.53,0.37), 0.38 (the first solar machine) | dot | C | → 704 | swap | off | tick |
| S92 | 541–545 (5) | `sun-solar/sun-solar-eclipse-2017-corona-nasa.jpg` [inv]: moon (0.50,0.50), 0.18 (a white disc with a grey corona on white) | dot | C on the moon's limb | → 718 | swap | off | tick |
| S93 | 546–551 (6) | `sun-solar/sun-solar-eclipse-2017-diamond-ring-nasa.jpg` [inv]: ring (0.50,0.52), 0.12. The "diamond" is a spark on a ring, a callback to f48. | dot | C | → 740 | swap | off | tick |
| S94 | 552–553 (2) | `sun-solar/sun-solar-trouvelot-total-eclipse-1878-ia.jpg` [eng] (0.52,0.47), 0.17 | dot | C (white) | **INVERT** | – | off | reversed shimmer (6.4) |
| S95 | 554–556 (3) | same image, normal | dot | C | → 748 | swap | off | – |
| S96 | 557–560 (4) | `sun-solar/sun-solar-sunflower-head-frontal-unsplash.jpg` [disc, B&W]: head (0.50,0.50), petal tips 0.60 | dot | C | → 760 | swap | off | tick |
| S97 | 561–563 (3) | `sun-solar/sun-solar-sunflower-woodcut-degraag-rijks.jpg` [eng]: head (≈0.47,0.30), 0.50 | dot | C | → 782 | swap | off | tick |

### §9 GRID (f564–587): suns become cells

| Shot | Frames | Image · placement | Orange | Paint | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|
| S98 | 564–572 (9) | `sun-solar/sun-solar-scheiner-1612-sunspot-discs-grid-freiburg.jpg` [eng]: one small disc (≈0.55,0.71) on A. **Stepped zoom-out in 3 cuts:** disc Ø 391 (f564), 242 (f567), 174 (f570), with a 0.985/f drift. Scheiner's grid of 37 suns appears. | dot | C rides the chosen disc (391 → 242 → 174) | stepped 0.5× / 0.62× / 0.72× | jump cuts | off | 3 clacks |
| S99 | 573–581 (9) | `sun-solar/sun-solar-early-module-round-cells-dark-tekniska.jpg` [cut], rotated +12° so the rows are level: one round cell (≈0.50,0.52) on A, cell Ø 0.077 W → 174 · w 209 % | f576–579: the dot grows into an **orange ring cell C 174** (hole r 41.7) sitting exactly on the photo's ring-shaped PV cell (E.snap). *The sun is now a solar cell, and it is an o.* | C | push 1.004 | grid → registered grid | off | orange pop (7.1) |
| S100 | 582–587 (6) | `sun-solar/sun-solar-cells-window-grid-fraunhofer-flickr.jpg` [ph]: one square cell (≈0.55,0.52) on A, cell 0.12 W → 174 · w 134 % | f582–585: **the ring squares off** (`mixCell`: radii 87 → 20.3, hole → 0). It becomes a square solar cell, the shape of a Solaro tile. | C squares off with it (a rounded-square hairline) | push 1.004 | – | off | glass clack |

### §10 SOLARO (f588–647): the roofs
Grid geometry:
- **5 × 9 rounded-square cells**, C 174, r 20.3, gap 34.8 (= 0.2 C, the mark's own ratio), pitch 208.8, centred on A.
- Columns at x 122.4 / 331.2 / 540 / 748.8 / 957.6; rows at y 104.8 … 1775.2.
- 44 photo cells plus the orange centre cell.
- Photos are B&W and cover-cropped on the panels. They come from 18 Solaro files (each used 2–3 times, never adjacent):

`solaro/roof_flat_array_blocks.jpg`, `solaro/roof_flat_array_blocks_b.webp`, `solaro/roof_slate_panels_vertical.jpeg`, `solaro/roof_long_panel_row_vertical.jpg`, `solaro/roof_orange_tiles_clouds.jpeg`, `solaro/roof_dusk_dramatic_vertical.jpg`, `solaro/house_pergola_roof_panels.jpg`, `solaro/house_pergola_panel_canopy.webp`, `solaro/house_bluesky_panels.jpg`, `solaro/house_white_flatroof_panels.jpg`, `solaro/house_villa_garden_panels.jpg`, `solaro/house_cream_lowangle_panels.jpg`, `solaro/house_white_ladder_install.jpeg`, `solaro/house_orange_facade_panels_wide.jpg`, `solaro/house_white_garage_panels.jpg`, `solaro/house_bungalow_pool_panels.jpg`, `solaro/van_solaro_branded_house.webp`, `solaro/inverter_huawei_solaro_sticker.jpeg`.

| Shot | Frames | Image | Orange | Paint | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|
| S101 | 588–591 (4) | The Fraunhofer image cuts out. Photo cells **fill ring by ring from the centre** (Chebyshev rings 1–4 at f588 / 589 / 590 / 591: 8, 16, 10, 10 cells). | Orange sun cell at A | C un-draws f588–589 | static | – | off | cascade of 4 ticks |
| S102 | 592–623 (32) | **Living grid.** Each cell swaps to its next photo every 6 f, phase-shifted by its diagonal index, so **diagonal waves of change sweep the grid every 2 f** (the climax). | orange cell | – | push 1.008/f on the whole grid (×1.29: cells 174 → 225) | – | off | ticks accelerate to every 2 f, riser (7.2) |
| S103 | 624–629 (6) | The photo cells shrink to their centres (expoIn 3 f, f624–626): the reference's grid-collapse move | The orange cell scales ×1.3 (C 225 → 292, cubicInOut) | – | – | – | off | suck-in (7.3) |
| S104 | 630–641 (12) | `solaro/roof_tatras_dramatic_sky_vertical.jpeg` [ph] fills the cell from f633 (cover-fit, focus on the panel rows ≈0.5,0.72) | The centre cell grows C 292 → 2400 (log expoIn 12 f). It stays orange until f632 and shows the Tatras roof inside from f633 (the cell is ≈ 390 px then). | – | – | the cell passes the frame edges at ≈ f639 | zoom blur f636–641 | whoosh |
| S105 | 642–647 (6) | Tatras roof **full-bleed** (the cell is now bigger than the frame) | – | – | push 1.006 | see S106 | off | wind, air |

### §11 slnko (f648–695): out of the o

| Shot | Frames | Image | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S106 | 648–671 (24) | The same Tatras photo, now **inside the counter of the o** (cover-fit to the counter's bounding box, world space) | The o of *slnko* is orange (the wordmark o in the brand gradient) | **G** (1007/873) draws f668–671 | **slnko** T240 (s 219–335, l 356–396, n 422–555, k 584–716, o 728–869) | **Pull back:** ×40 → ×1, log expoOut 24 f. The focus is the counter centre (799, 942): it sits on A at ×40 and on itself at ×1 (lerped on log s). At ×40 the counter (2408 × 2536 px) covers the frame. The counter edge enters at the corners (≈ f650), then the orange o, then k, n, l, s slide in from the edges. | At f647 the Tatras frame equals the counter's photo at f648 (same photo, same scale). The window shape switches from rounded square to counter only while it is off-frame, so **there is no visible cut**. | zoom blur f648–653 | reverse whoosh, then **near-silence** (7.4) |
| S107 | 672–695 (24) | The roof stays inside the counter (≈ 60 px) | orange o | G | read **slnko**: the roof is inside the sun | push 1.003 | – | off | room tone, breath (8.1) |

### §12 slnko → Solaro (f696–743)

| Shot | Frames | Image | Orange | Paint | Text: letter surgery (custom `planWordMorph` ops) | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S108 | 696–711 (16) | The counter photo cuts to white at f696 | o2 stays orange and glides 728 → 804.7. **f705–710:** an orange **a** grows from a dot at (580.6, 942) (E.snap, 6 % overshoot) and *stays orange*. | G | **s → S**: `makeMorph`, start points aligned on the top terminal, E.swift 8 f (f696–703), x 219–335 → 134.8–264.8. **l** glides 356 → 446.1 (cubicInOut f696–705). **k**: the arms fall exactly as at f114 (f696–698) and the stem sinks into the baseline (height → 0, quadIn f697–700). **n → r**: `makeMorph` (same topology; the wordmark r is an n whose right leg is cut at y 934) plus a glide 422 → 676.6 (f698–707, starting 2 f late so it never touches the sinking k). **o1** grows from an orange dot at (351.1, 942) f704–709 and snaps to ink at f710. | static | the word becomes the wordmark in place | off | letter ticks, arm "clink" (8.2) |
| S109 | 712–743 (32) | – | **Sol·a·r·o**: the a (510.6–650.6) and o2 (804.7–945.2) are orange. This is the site's own two-tone habit. | G | read **Solaro** (HERO, x 134.8–945.2) | push 1.003 | – | off | warm pad (8.3) |

### §13 LOCKUP (f744–767): the letters become the mark

| Shot | Frames | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|
| S110 | 744–767 (24) | **f744–745:** o2 → ring cell C 140.5 and a → pin cell C 140 (`makeMorph`, 2 f, near-identity) lift off the word. The ink o2 and a pop in beneath them (50→100 %, 2 f).<br>**f744–759:** the ring flies **over** the word to the mark's top-left slot and the pin flies **under** it to the bottom-right. Both follow cubic Béziers (cubicInOut, log size → C 98.0). Targets with the gap closed: ring (151.1, 891.0), pin (249.1, 989.0).<br>**f748–757:** tile and leaf grow from the **mark centre (200.1, 940), the exact point where the open's ✦ was born**, to (249.1, 891.0) and (151.1, 989.0) (`mixCell` from zero size, E.snap).<br>**f757:** the four cells touch, leaving a white ✦ (R 49).<br>**f758–763:** the gap opens 0 → 46 → 40.8 units (E.punch): **the ✦ becomes the "+"**.<br>**f764:** the logo's inner shadows switch on. | G retracts f744–747 | f748–763: *Solaro* scales 0.6101 → 0.48 and slides into the lockup (origin (−192.8, 778.0) → (92.3, 832.2), cubicInOut on log scale) | – | mark and word land exactly on the LOCKUP of f0 | ring and pin: 2 samples f748–756 | two rising plinks; "whoomph" f758 (8.4) |

### §14 HOLD (f768–887)

| Shot | Frames | Image | Orange | Paint | Text | Cam | → | Blur | Sfx |
|---|---|---|---|---|---|---|---|---|---|
| S111 | 768–887 (120 = **2.0 s**) | – | Lockup static: mark in the gradient with its inner shadows. **cursor-U**: types the URL f770–778, then blinks 12 f on / 12 f off on the beat (on 779, 792–803, 816–827, 840–851, 864–875; off 876–887, so it is on again at f0). | – | f770–778: **solaro.sk** is typed centre-aligned (URL slot, final x 439–641) | locked | **f887 → f0**: the same lockup, URL and cursor phase, so the loop is invisible | off | **CHORD** (9.1), typing ticks |

---

## 5. Signature moments, and why each morph is geometrically perfect

1. **"kameň → plameň": the strike knocks the arms off the k (f110–155).**
   - **The split is exact.** The Poppins Bold k is split along one vertical line at the stem's right edge (x = 233/1000 em, checked by scanline at four heights). It is a clip, not a morph, so nothing distorts.
   - **Stem → l is exact.** The stem is a rectangle and the wordmark l is a rectangle. Stem → l is `mixCell` on two rect cells: 41 × 178 → 39.6 × 187.5.
   - **The p is born, not morphed.** It grows from the spark: scale from a point, then a 1-frame ink snap.
   - **The a → flame is two brand truths.** The wordmark a ≈ pin_BR (brand.md §7.8), so glyph → pin is a near-identity `makeMorph` of two one-hole shapes. Pin → flame is then a pure `mixCell` rotation and scale.
   - The same k surgery returns at f696 (slnko → Solaro), so the first and last morphs rhyme.
2. **"blesk": the l *is* the lightning (f216–263).**
   - **The flame whips into the letter** as a `mixCell` between two cells: pin → rect, −135° → −180°. A rect at 180° looks like a rect at 0°, so nothing flips.
   - **The l is treated as a 49.5 px stroke** on a 4-point polyline. The bolt is the same stroke with the interior points moved. Width, caps and joins stay constant, so the letter cannot "melt". It only bends.
   - Then a 2-frame invert on the thunder beat.
3. **"svet·lo": the cursor types the world, then light (f378–455).**
   - **The world becomes the cursor.** The Earth at night collapses into the dot on Slovakia, the dot stretches into a cursor, and the cursor types *svet* (world).
   - **The cursor becomes the l.** The caret is literally the l stem.
   - **The next cursor becomes the bulb.** This is a `mixCell` from a rect cell to a pin cell.
   - **The switch is a 2-frame invert plus a Light→Bold weight surge.** Each glyph morphs to *the same glyph* in another weight (identical topology, aligned start points), so it is the cleanest morph type that exists.
4. **Through the o and back out of the o (f456–671).**
   - **Into the o.** The bulb rounds into the ring (exact `mixCell`: corner 28 → R, hole corner 0 → r). It turns once in clean 3D, and we dive through its counter: a log-scale camera move, with no shape change at all.
   - **Inside, the sun becomes a solar cell.** The suns are registered on one disc. Scheiner's grid of suns becomes the 1979 module of round cells. The orange sun cell squares off into a solar cell (radii R → 0.1164 C, the mark's own ratio). It is surrounded by 44 real Solaro roofs and grows into one of them.
   - **Out of the o.** The camera pulls back out of the **o of *slnko***. The window changes shape only while it is larger than the frame, so the swap is invisible. *We went into light and came out of the sun, with a Solaro roof inside it.*
5. **The letters become the mark (f696–767).**
   - **slnko → Solaro is all safe ops.** The shared letters s, l and o glide (s → S is a same-topology morph). The k loses its arms again. The n becomes the r, which is truthfully an n with its leg cut. The new o1 and a are born from orange dots.
   - **The hot letters lift off.** The orange o and a come out of the word as the ring and pin cells (near-identity glyph → cell morphs).
   - **The other two cells come from the first spark's birthplace.** Tile and leaf grow from the mark centre, where the open's ✦ was born.
   - **The gap opens and the white ✦ becomes the "+".** This is the open played backwards, built on the same `markCells(…, g)` code, and it lands on exactly frame 0.

---

## 6. Risks, and how the board avoids slop

**What we deliberately do NOT do**
- **No transitions other than cuts, morphs and camera moves.** No crossfades, dissolves or opacity fades. Every change is a cut, a morph through a point, a camera move, or a draw-on / un-draw.
- **No blobby letter morphs.** We only morph between identical topologies: s→S, n→r, Light→Bold of the same glyph, a↔pin, o↔ring. Everything else drops to a point or grows from one, which is the honest move.
- **No glow, bloom, lens flare, light leak, grain, paper texture, vignette, beige or sepia.** Engravings are levelled to #FFFFFF, and the only grey is the 3D contact shadow (#ECEEF1, cool).
- **No brush textures, handwriting or "artsy" scribbles.** Every line is a vector with constant width, round or butt caps, and exact offsets.
- **No eyebrows, labels, years, captions, prices or numbers.** Six nouns and a URL.
- **No kinetic-type template moves:** no bouncy pop-in slideshows, glitch, RGB split or typewriter clichés. The typing is quiet, 1 glyph per frame.
- **No orange area above ≈ 25 % of the frame,** except two punctuations of 4 frames or less: the band sweep at f497–501 and the cell growth at f630–632.
- **No decorative 3D.** There are two 3D moments and both carry story: real photogrammetry stones, and the o turning into the sun.
- **No type over images.** Every word is read on white, and images never sit behind letters.
- **At most one hot letter per word,** except the deliberate two-tone *Sol·a·r·o* (f705–745) just before the lift-off.

**Risks and mitigations**

| risk | mitigation |
|---|---|
| Slovak words at speed | Each word is held still for 11–32 f and laid out at 240–300 px. Phone test at 100 % size. The EN alternate uses the same frames. |
| A seam at the k split | Clip 2 units right of the stem edge. The impact ✦ covers the seam on the split frame. |
| `makeMorph` start-point twist (s→S, n→r, weight) | Align the start points on the top-left extremum of each ring, n = 180 samples. Render check at 4 sub-frames. |
| Registration of 85 images (≈ values) | `regs.json` plus a 2-hour pass with an onion-skin view of the overlay. |
| Soft upscales | Tesla rings ×2 and the NASA bolt ×1.8 are line art or 4 f; the Scheiner disc ×1.6 lasts 3 f. Vectorise the Tesla rings with potrace if they look soft. |
| 44-cell grid cost and legibility | Pre-crop all cells to 256 px B&W. Never place the same photo in adjacent cells. |
| 3D render time | 24 + 10 frames at ≈ 0.5 s each. Pre-render to a PNG sequence. |
| Flash safety | Four 2-frame inverts, never more than one in any 1 s window. |
| Loop | f887 equals f0 including the cursor blink phase: (888 − 768) mod 24 = 0, so the cursor is on at f0. |

---

## 7. Build plan (one day)

| block | reuses | new code | hours |
|---|---|---|---|
| Type kit: guides, slide-in, centre typing, backspace, `splitGlyph(item, xClip)`, drop/grow ops, weight morph between two layouts | `layoutHybrid`, `planWordMorph` | ~150 lines | 2.0 |
| Hot letter ↔ cell (`cellToRings` for `makeMorph`), offset keyline (`offsetCell(c, d)`), bolt polyline | `mixCell`, `makeMorph` | ~60 lines | 0.75 |
| Bursts: `regs.json` → `drawFit` with push and overlays | `montage`, `drawFit`, `drawCover` | ~80 lines | 1.0 |
| Registration pass for 85 images | – | data | 2.0 |
| Counter camera (push-through and pull-back with lerped focus) and stepped zoom | `camera()` | ~40 lines | 0.5 |
| Grids (Scheiner step, 5 × 9 Solaro grid, waves, collapse) | `gridCut` | ~70 lines | 1.0 |
| 3D: the flint strike (proto_strike as is) and the ring turn | `Stage3D.extrude` | ~50 lines | 0.75 |
| Open and lockup (proto_open gap-close kept; backspace added; letters → cells added; proto_end's gap breath reused) | prototypes | ~80 lines | 1.0 |
| **Total** | | | **≈ 9 h** |

---

## 8. EN version: deltas (same frames, same mechanisms)

| frames | SK | EN change |
|---|---|---|
| f96–155 | kameň → plameň | **flınt** T240 (f 305–383, l 398–438, ı 460–509, n 535–668, t 687–771) is set *without* its tittle. The comet (f110–113) lands as **the tittle of the ı**: "the spark dots the i" (✦ at ≈ (485, 832) on f114). f118–123: **flint → flame**. f and l glide; the ı stem sinks; n and t shrink; the tittle drops into the a slot and **grows into the orange a**; m and e grow from dots. *flame*: f 187–265, l 281–321, a 343–483, m 509–735, e 755–890. Ignition and flame lift as in SK (the a's bowl centre is at 413, 942). |
| f216–263 | blesk | **bolt** T300 (b 255–432, o 454–630, **l 658–708**, t 728–834). The l becomes the bolt: polyline shifted +310 px, so (765,−60)→(640,640)→(715,700)→(683,1024). |
| f384–431 | svet·lo | **glow**, typed g (f388) and l (f389). The bulb arrives as the **o** (f390–393, glass at 549, 942, almost exactly A), then w (f394). The read is held f395–407 and the switch is unchanged. |
| f648–711 | slnko → Solaro | Pull back out of the **first o of solar** (o 360–501, centre 430, 942). **solar → Solaro**: s → S, o/l/a/r glide, and a new o grows at the end from a dot (ink). At f705 the a turns orange (fill rises, a flame callback). The lift-off uses o1 → ring and a → pin. |

All other shots are identical. The EN copy is: flint · flame · bolt · glow · solar · Solaro · solaro.sk.

---

## 9. Image manifest: 85 files (+ 2 GLB models)

All paths are relative to the repo root.

**STRIKE (8)**
1. `assets/raw/spark-fire/spark-fire-hooke-sparks-flint-steel-micrographia-wellcome.jpg`
2. `assets/raw/spark-fire/spark-fire-engraving-strike-a-light-stones-hough1890.jpg`
3. `assets/raw/spark-fire/spark-fire-engraving-flint-and-steel-ring-hough1890.jpg`
4. `assets/raw/spark-fire/spark-fire-fire-steel-oval-kulturparken.jpg` (cut: `assets/processed/spark-fire/…cut.png`)
5. `assets/raw/spark-fire/spark-fire-flint-striker-islamic-met.jpg` (cut)
6. `assets/raw/spark-fire/spark-fire-handaxes-nine-bifaces-met.jpg`
7. `assets/raw/spark-fire/spark-fire-cave-hand-stencils-gillow-flickr.jpg`
8. `assets/raw/spark-fire/spark-fire-hand-reaching-cast-met.jpg` (cut)

3D models: `assets/raw/spark-fire/3d/spark-fire-3d-flint-nodule-0370-zenodo.glb` and `assets/raw/spark-fire/3d/spark-fire-3d-flint-nodule-0373-zenodo.glb`. Render from the lite versions, `assets/3d/flint-0370-lite.glb` and `assets/3d/flint-0373-lite.glb`.

**FIRE (9)**
9. `assets/raw/spark-fire/spark-fire-handaxe-red-acheulean-met.jpg` (cut)
10. `assets/raw/spark-fire/spark-fire-candle-flame-1g-vs-microgravity-nasa.jpg`
11. `assets/raw/spark-fire/spark-fire-oil-lamp-roman-plain-met.jpg` (cut)
12. `assets/raw/spark-fire/spark-fire-oil-lamp-bronze-roman-cleveland.jpg` (cut)
13. `assets/raw/spark-fire/spark-fire-tinderbox-met.jpg` (cut)
14. `assets/raw/spark-fire/spark-fire-lantern-pierced-tin-met.jpg` (cut)
15. `assets/raw/spark-fire/spark-fire-torch-bearing-arm-met.jpg` (cut)
16. `assets/raw/spark-fire/spark-fire-ignis-fire-element-met.jpg`
17. `assets/raw/spark-fire/spark-fire-prometheus-torch-to-sun-met.jpg`

**BOLT (5)**
18. `assets/raw/lightning-early/lightning-early-bolt-spokane-1914-loc.jpg`
19. `assets/raw/lightning-early/lightning-early-bolt-branched-night-nasa.jpg`
20. `assets/raw/lightning-early/lightning-early-strike-building-engraving-wellcome.jpg`
21. `assets/raw/lightning-early/lightning-early-richmann-killed-engraving-wellcome.jpg`
22. `assets/raw/lightning-early/lightning-early-bolt-jennings-1882-loc.jpg`

**CURRENT (24)**
23. `assets/raw/lightning-early/lightning-early-franklin-kite-currier-ives-loc.jpg`
24. `assets/raw/lightning-early/lightning-early-kite-romas-1753-figuier.jpg`
25. `assets/raw/lightning-early/lightning-early-leyden-jar-hand-discharger-adams-wellcome.jpg`
26. `assets/raw/lightning-early/lightning-early-leyden-nollet-spark-wellcome.jpg`
27. `assets/raw/lightning-early/lightning-early-leyden-jar-battery-smithsonian.jpg` (cut)
28. `assets/raw/lightning-early/lightning-early-leyden-battery-64-jars-wellcome.jpg`
29. `assets/raw/lightning-early/lightning-early-volta-pile-original-wellcome.jpg` (cut)
30. `assets/raw/lightning-early/lightning-early-volta-pile-griffin-wellcome.jpg` (cut)
31. `assets/raw/lightning-early/lightning-early-volta-pile-crown-of-cups-wellcome.jpg`
32. `assets/raw/lightning-early/lightning-early-galvani-frog-legs-four-wellcome.jpg`
33. `assets/raw/lightning-early/lightning-early-galvani-metal-arcs-wellcome.jpg`
34. `assets/raw/lightning-early/lightning-early-machine-guericke-sulfur-globe-wellcome.jpg`
35. `assets/raw/lightning-early/lightning-early-machine-plate-galvani-wellcome.jpg` (cut)
36. `assets/raw/electric-age/electric-age-patent-tesla-motor-rotating-field-1888.jpg`
37. `assets/raw/electric-age/electric-age-patent-stanley-induction-coil-1886.jpg`
38. `assets/raw/electric-age/electric-age-gramme-dynamo-engraving-obi.jpg`
39. `assets/raw/electric-age/electric-age-pearl-street-station-dynamo-room-1882-engraving-ia.jpg`
40. `assets/raw/electric-age/electric-age-tesla-colorado-springs-sparks-wellcome.jpg`
41. `assets/raw/electric-age/electric-age-pylon-silhouette-dusk-sky-wordpress.jpg`
42. `assets/raw/electric-age/electric-age-pylon-vertical-pa-nj-interconnection-habs-loc.jpg`
43. `assets/raw/electric-age/electric-age-pylons-tva-chickamauga-sky-1942-loc.jpg`
44. `assets/raw/electric-age/electric-age-luna-park-electric-tower-night-1905-loc.jpg`
45. `assets/raw/electric-age/electric-age-san-jose-electric-light-tower-night-engraving-obi.jpg`
46. `assets/raw/electric-age/electric-age-earth-at-night-europe-africa-black-marble-nasa.jpg`

**BULBS (5)**
47. `assets/raw/electric-age/electric-age-edison-lamp-new-type-smithsonian.jpg` (cut)
48. `assets/raw/electric-age/electric-age-edison-lamp-engraving-obi.jpg`
49. `assets/raw/electric-age/electric-age-patent-edison-electric-lamp-1880.jpg`
50. `assets/raw/electric-age/electric-age-edison-lamp-stopper-smithsonian.jpg` (cut)
51. `assets/raw/electric-age/electric-age-edison-lamp-bamboo-filament-smithsonian.jpg` (cut)

**SUNS (12)**
52. `assets/raw/sun-solar/sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg`
53. `assets/raw/sun-solar/sun-solar-kircher-sun-corpus-solis-plate-wellcome.jpg`
54. `assets/raw/sun-solar/sun-solar-scheiner-rosa-ursina-imago-solis-xvi-ia.jpg`
55. `assets/raw/sun-solar/sun-solar-sunspot-course-disc-engraving-wellcome.jpg`
56. `assets/raw/sun-solar/sun-solar-sdo-aia171-corona-loops-2014-nasa.jpg`
57. `assets/raw/sun-solar/sun-solar-soho-handle-prominence-nasa.jpg`
58. `assets/raw/sun-solar/sun-solar-mouchot-solar-engine-paris-1878-tekniska.jpg`
59. `assets/raw/sun-solar/sun-solar-eclipse-2017-corona-nasa.jpg`
60. `assets/raw/sun-solar/sun-solar-eclipse-2017-diamond-ring-nasa.jpg`
61. `assets/raw/sun-solar/sun-solar-trouvelot-total-eclipse-1878-ia.jpg`
62. `assets/raw/sun-solar/sun-solar-sunflower-head-frontal-unsplash.jpg`
63. `assets/raw/sun-solar/sun-solar-sunflower-woodcut-degraag-rijks.jpg`

**GRID (3)**
64. `assets/raw/sun-solar/sun-solar-scheiner-1612-sunspot-discs-grid-freiburg.jpg`
65. `assets/raw/sun-solar/sun-solar-early-module-round-cells-dark-tekniska.jpg` (cut)
66. `assets/raw/sun-solar/sun-solar-cells-window-grid-fraunhofer-flickr.jpg`

**SOLARO (19)**
67. `assets/raw/solaro/roof_tatras_dramatic_sky_vertical.jpeg` (hero; inside the o)
68. `assets/raw/solaro/roof_flat_array_blocks.jpg`
69. `assets/raw/solaro/roof_flat_array_blocks_b.webp`
70. `assets/raw/solaro/roof_slate_panels_vertical.jpeg`
71. `assets/raw/solaro/roof_long_panel_row_vertical.jpg`
72. `assets/raw/solaro/roof_orange_tiles_clouds.jpeg`
73. `assets/raw/solaro/roof_dusk_dramatic_vertical.jpg`
74. `assets/raw/solaro/house_pergola_roof_panels.jpg`
75. `assets/raw/solaro/house_pergola_panel_canopy.webp`
76. `assets/raw/solaro/house_bluesky_panels.jpg`
77. `assets/raw/solaro/house_white_flatroof_panels.jpg`
78. `assets/raw/solaro/house_villa_garden_panels.jpg`
79. `assets/raw/solaro/house_cream_lowangle_panels.jpg`
80. `assets/raw/solaro/house_white_ladder_install.jpeg`
81. `assets/raw/solaro/house_orange_facade_panels_wide.jpg`
82. `assets/raw/solaro/house_white_garage_panels.jpg`
83. `assets/raw/solaro/house_bungalow_pool_panels.jpg`
84. `assets/raw/solaro/van_solaro_branded_house.webp`
85. `assets/raw/solaro/inverter_huawei_solaro_sticker.jpeg`

**Credits.** These sources are CC BY and need an end-credit or description line:
- Wellcome Collection: Hooke, Nollet, the 64-jar battery, the piles, Galvani, Guericke, the plate machine, Tesla Colorado Springs.
- Kulturparken Småland: the fire steel.
- Mark Gillow (Flickr): the hand stencils.
- Tekniska museet: the round-cell module.
- steel & silicon (Flickr): the Fraunhofer cells.
- Jacek Lech (Zenodo): the flint GLBs.

Everything else is PD, CC0, US-government work, NASA, or the Unsplash License, and the Solaro photos are the client's own.
