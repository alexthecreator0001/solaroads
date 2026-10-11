# Storyboard B: "Editorial graphic rhythm"

Key: **B-editorial**. 1080×1920, 60 fps, **888 frames (f0–f887, 14.80 s)**. f887 is identical to f0, so the film loops.
Palette: background pure #FFFFFF (two-frame inversions to #1C1C1C at f48, f243 and f464), ink #1C1C1C, and the brand gradient #FF5E2B→#FF3D00 as the only colour. All imagery is black and white.
Anchor **A = (540, 940)**.

---

## 1. Concept, copy, language

**Concept in 3 lines**
1. The Solaro mark is a layout system. Its four cells are **windows**, and its 5:1 cell-to-gap ratio is the grid for every layout in the film (2×2, full-bleed 2×2, split, 6×10).
2. History plays inside those windows: stone, fire, lightning, Leyden jars, bulbs, the lit Earth, every sun ever drawn. One orange shape at the anchor evolves exactly: the spark that the gap leaves (✦) → flame → bolt → bulb → sun ring → the letter "o".
3. We dive through that "o" into a real Solaro roof under the Tatras. The roof is cut into a 6×10 panel, flips orange, collapses into the mark, and "slnko" (sun) becomes **"Solaro"**.

**Copy: every word on screen**

| beat | SK (primary) | EN (alternate, same timing) |
|---|---|---|
| spark | **ıskra**: the orange ✦ is the tittle of the dotless ı | **spark**, with the ✦ as a superscript ornament after the k |
| fire | **oheň** | **fire** |
| light | **svetlo** | **light** |
| sun | **slnko**: the orange sun ring is its "o" | **solar**: the orange sun ring is its "o" |
| end card | **slnko → Solaro** (the logo wordmark) + optional **solaro.sk** | **solar → Solaro** + optional **solaro.sk** |

There is nothing else on screen: no eyebrows, captions, years or numbers.

**Language: SK first, EN as a drop-in alternate.**
- Solaro sells in Slovakia, the site speaks formal Slovak, and the target is a Slovak homeowner.
- The best payoff only works in Slovak. *slnko → Solaro* reads as "the sun becomes Solaro". The two words share S·l·o, so the morph is mostly letters gliding, not letters distorting.
- *ıskra* has an i, so the spark can literally dot it.
- The four words are short (4–6 letters) and the images carry the story, so non-Slovak viewers still follow.
- EN keeps the same frames. *solar → Solaro* is a one-letter addition, the cleanest possible logo morph.

---

## 2. System sheet (shared geometry, so every shot is buildable from data)

| element | exact definition |
|---|---|
| Lockup **L83** | Logo at 83 % W, scale s1 = 0.48039 px/unit. Box (91.8, 832.2)–(988.2, 1047.8). Mark 215.7 px, centre (199.6, 940). Wordmark x 349.8–988.2, baseline 1012.5, x-height 105.4 px. |
| **M2** (mark grid) | `markCells(540, 940, 2.058, g)`: C = 420, G = 84. ring (78,478)–(498,898); tile (582,478)–(1002,898); leaf (78,982)–(498,1402); pin (582,982)–(1002,1402). Ring hole r 100.7. |
| **M2F** (full-bleed) | `markCells(540, 940, 2.4053)`: C = 490.9, G = 98.2. ring (0,400)–(490.9,890.9); tile (589.1,400)–(1080,890.9); leaf (0,989.1)–(490.9,1480); pin (589.1,989.1)–(1080,1480). Window holes closed (hole size 0, exact `mixCell`). Small radii are 57.1 (tile/leaf) and 67.9 (pin). |
| **SPLIT** | TOP = tile cell, C 840, box (324,−84)–(1164,756), radii [0, 97.8, 0, 420]. BOTTOM = leaf cell, C 840, box (−84,1240)–(756,2080), radii [0, 420, 0, 97.8]. In both, the big round corner faces A (the mark's own rule). |
| **FIELD** | Registered image montage clipped to y < 1240. A white band below holds the low word. |
| **DW** (disc window) | Circle r 420 centred on A. "disc-reg" = sun disc edge → r 420. "ring-reg" = disc or moon edge → r 210, so the corona or rays fill the window around the ring. |
| **BOLT P** | Polyline (628,−40) (566,190) (650,330) (540,560) (612,700) **(540,940)** (470,1150) (560,1330) (446,1560) (520,1720) (452,1960). |
| **PANEL** | `gridCut(frame → (0,29.7)–(1080,1850.3), 6×10)`: c 154.3, gap 30.9 (5:1), radius 17.9 (0.116 c, the mark's small-corner ratio). After the 0.556 zoom the panel is 600 × 1011 at A (the proto_end start box). A is the centre gutter cross. |
| **End mark** | `markCells(A, 1.05)`: C 214.3, G 42.9, block (304.3,704.3)–(775.7,1175.7) (proto_end). |
| Type | Poppins Bold 700, lowercase, ink, tracking 0. `layoutHybrid(use='Solar')`, so o, l, a, r are the logo's own glyphs. Font 280 px: x-height 156, ascender 207 (the wordmark l is 219). |
| Type slots | **TC** baseline 1140 (ıskra: tittle centre lands at y 940). **TS** baseline 1016 (slnko: o centre at y 940). **TL** baseline 1520 (oheň, svetlo). All type sits between y 797 and y 1520, inside the Reels/TikTok safe zone. |

**Orange element states.** Every state is a Solaro cell, so every transition is an exact `mixCell` or a pass through a point.

| state | definition |
|---|---|
| dot | circle r 17 at A |
| ✦ | `sparkPath(A, R)`, R 210 → 34 |
| flame | pin cell S 260, rot −135° (tip up), centre A. Spans x 410–670, y 771–1070, teardrop hole r 62.3. Flame base **B = (540, 1070)**. |
| bulb | pin cell S 260, rot +45° (tip down), centre A. Glass circle r 130, tip y 1109. Base capsules at y 1131.5 / 1161.5 / 1191.5, widths 104/92/80, h 21, r 10.5. |
| ring (sun) | ring cell Ø420 at A (outer r 210, hole r 100.7). This is exactly the ring of M2. |
| o | wordmark "o" at 280 px: 163.9 × 160.2, counter 70.2 × 73.9 |

**Image treatment tags** (output of `tools/batch_process.py`):

| tag | treatment | output |
|---|---|---|
| [cut] | BiRefNet cutout | `assets/processed/<era>/<name>.cut.png` |
| [eng] | engraving, paper levelled to #FFF | |
| [ph] | photo, channel-mixed B&W + S-curve | |
| [inv] | [ph] then inverted, so night skies go white and bolts and bulb outlines go dark | |
| [3d] | Zenodo photogrammetry render, desaturated | |

**Placement notation**
- `reg(fx,fy)→P, w N%`: image point (fx, fy), as a fraction of the image, sits on screen point P. Displayed width = N % of 1080.
- `cov(fx,fy)×z`: cover-fit into the window's bounding box, with focus (fx, fy) and extra zoom z.
- `push r`: constant per-frame scale about A, or about the registration point if the image is registered.
- In every montage, each image pushes **1.008–1.010 per frame**, and words push **1.002–1.004 per frame**. This is the reference's "nothing is static" rule.

---

## 3. Beat map and music grid

| sec | frames | dur | era / idea | layout | orange element | text | cut rate |
|---|---|---|---|---|---|---|---|
| 0 OPEN | 0–71 | 72 | logo → stone windows → strike | L83 → M2 | mark → dot → ✦ | — | 2–6 f |
| 1 ISKRA | 72–137 | 66 | spark | SPLIT T/B + centre word | ✦ = tittle | ıskra (60 f) | 6 f |
| 2 OHEŇ | 138–239 | 102 | fire | FIELD, registered, scale contrast | flame | oheň (46 f) | 5–8 f |
| 3 BLESK | 240–287 | 48 | lightning | bolt split → M2F | bolt = the gutter | — | 3 f |
| 4 ELEKTRINA | 288–329 | 42 | Leyden, Volta, Galvani | M2F sequencer | dot + gutter wire | — | 3 f |
| 5 SVETLO | 330–431 | 102 | the bulb | bulb-window strobe → word → stepped zoom-out | bulb | svetlo (40 f) | 3–4 f |
| 6 SIEŤ | 432–479 | 48 | light everywhere, the grid | FIELD, registered | small bulb + ring | — | 5 → 2 f |
| 7 SLNKO | 480–647 | 168 | lit Earth → every sun → word → dive | DW under the ring, centre word | ring = sun = "o" | slnko (34 f) | 8 → 2 f |
| 8 SOLARO | 648–735 | 88 | Slovak roof → panel → mark | full-bleed → 6×10 → 2×2 → mark | dot → panel → mark | — | landing |
| 9 LOCKUP | 736–887 | 152 | slnko → Solaro, hold | L83 | mark | Solaro (+ solaro.sk) | static hold 120 f |

**Music grid: 150 BPM in E major.** One beat = 24 f, one bar = 96 f, a 16th = 6 f, a 32nd = 3 f. The pulse is felt in half-time, and cut-synced foley (stone, fire, electric) sits on top. As in the reference, **every transient lands at its picture event + 2 f**.

| bar (downbeat) | hits |
|---|---|
| 1 (f0) | loop tail / room tone. f28 and f31 stone "tok". **f48 (beat 3) flint crack + sub** (the strike). f72 (beat 4) swish. |
| 2 (f96) | ✦ ping (E6). **f144 (beat 3) fire whoomp.** |
| 3 (f192) | "oheň" swish. **f240 (beat 3) thunder crack** + invert. |
| 4 (f288) | Leyden zap + bass; the sequencer ticks on 32nds (3 f). f330 relay click, filament buzz (50 Hz). f369 switch clunk + ping. |
| 5 (f384) | warm pad under "svetlo". f414/f418/f422 shutter clacks. f432 (beat 3) grid hum rises. |
| 6 (f480) | **sub thump (Earth), riser starts.** Ticks follow every cut (8 → 2 f). |
| 7 (f576) | hit + 2-f ticks; the riser peaks at f611. **f612 cut to near-silence (air)** under "slnko". f638–647 whoosh into the o. f648 (beat 4) soft impact + wind. |
| 8 (f672) | cascade of 60 tile clicks + shimmer. f702 low thunk. f730 click-clack. f736–767 near-silence. |
| 9 (f768) | **bright E add9 chord exactly as the lockup turns black.** It decays through the hold and is near-silent at f887, so the loop is clean. |

The pacing curve:
- **Three accelerations**: lightning and Leyden (3 f), the grid montage (5 → 2 f) and the sun flurry (2 f). The open has a smaller burst of its own: a 2 f ripple.
- **Three rest beats on white**: oheň (f210–233), svetlo (f372–407) and slnko (f620–637).
- **A long landing**: the panel and the logo, f648–887.

This is the reference's dense-then-land shape, finishing at 14.8 s.

---

## 4. Shot table (f0–f887, contiguous, no gaps)

Columns: # · frames (dur) · layout / images / placement · orange element · paint-on · text · camera / easing · transition → next (why it is seamless) · motion blur (sub-samples) · sound. A blank cell means "same as the row above".

### 0 — OPEN (f0–71)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 01 | 0–11 (12) | L83 lockup on white (exact logo SVG) | lockup mark | — | wordmark; optional **solaro.sk** (Poppins SemiBold 44 px, baseline 1190, orange ".") | locked | identical to f887, so the loop is seamless | off | chord tail / room tone |
| 02 | 12–15 (4) | same | same | — | solaro.sk wipes out right→left (inQuad 4 f) | lockup scales 1.00→1.03 about A (outCubic f12–14), hangs f15 | anticipation | off | soft inhale |
| 03 | 16–27 (12) | Wordmark letters slide into the mark centre, scale 1→0.1 (inExpo), clipped at the mark's right edge so they vanish behind it (proto_open) | mark glides (199.6,940)→A, scale 0.480→0.95 (inOutCubic) | — | wordmark consumed | — | the end card in reverse | 6 f20–27 | reverse whoosh, "suck" click f28 |
| 04 | 28–30 (3) | **Step-zoom 1**: mark → scale 1.40 (C 286). The four cells become **windows** (exact outlines, holes open): ring ← `assets/raw/spark-fire/spark-fire-flint-nodule-3d-render-a-zenodo.png` [3d] cov(0.48,0.52)×1.9 · tile ← `assets/raw/spark-fire/spark-fire-flint-nodule-3d-render-b-zenodo.png` [3d] cov(0.50,0.55)×1.9 · leaf ← `assets/raw/spark-fire/spark-fire-flint-nodule-kulturparken.jpg` [cut] cov(0.42,0.45)×1.8 · pin ← `assets/raw/spark-fire/spark-fire-flint-core-met.jpg` [cut] cov(0.50,0.50)×1.7. Stone texture fills every window. | none (the cells are stone) | — | — | hard jump ×1.474 about A; in-window push 1.010/f | orange→image swap inside identical outlines | off | stone "tok" + low thump |
| 05 | 31–35 (5) | **Step-zoom 2** → **M2** (C 420, G 84), same 4 stones | **dot** Ø34 pops at A at f34 (punch 1→1.15→1, 4 f) in the white gutter cross | — | — | jump ×1.47; push continues | stepped zoom, same images | off | 2nd "tok", 3 semitones up |
| 06 | 36–37 (2) | M2 ripple: ring ← `assets/raw/spark-fire/spark-fire-handaxe-egypt-met.jpg` [cut] cov(0.50,0.52)×1.5 | dot | — | — | push | clockwise in-place swap | off | tick |
| 07 | 38–39 (2) | tile ← `assets/raw/spark-fire/spark-fire-handaxe-red-acheulean-met.jpg` [cut] cov(0.48,0.52)×1.5 | dot | | | | same | off | tick |
| 08 | 40–41 (2) | pin ← `assets/raw/spark-fire/spark-fire-handaxe-teardrop-acheulean-met.jpg` [cut] cov(0.50,0.53)×1.5 | dot | | | | same | off | tick |
| 09 | 42–47 (6) | leaf ← `assets/raw/spark-fire/spark-fire-handaxe-paleolithic-cleveland.jpg` [cut] cov(0.50,0.45)×1.4 at f42. **STRIKE**: gap G 84→0, inQuart (84, 83.9, 81.8, 73.1, 49.6, 0). The four stone windows slam together; each slides 42 px diagonally. | dot inside the shrinking white ✦-shaped space | — | — | — | the slam closes on the exact ✦ (section 5, S1) | 4 f44–47 | rising stone scrape |
| 10 | 48–49 (2) | **INVERT FLASH**: paper → #1C1C1C, images negative. The white negative space `sparkPath(A,210)` floods orange. | **✦ R 210** (gradient over its bbox) | `sparks()` burst at A: 22 streaks, 1700 px/s, gravity 2600, life 0.55 s, width 9 px, seed 7 | — | static | ignition in the gap | off | **flint crack (HF) + sub thump** (beat 3) |
| 11 | 50–57 (8) | normal polarity; the 4 windows fly out radially (spread 0→2200 px, inExpo) | ✦ overshoots R 210→235 (outBack f50–53), settles to 210 (f54–57) | sparks arc with gravity | — | — | the windows leave, the ✦ stays | radial 6 f50–57 | crackle |
| 12 | 58–71 (14) | white | ✦ shrinks R 210→34 (log-scale inOutCubic f58–69) and rotates 0→90° (inOutCubic), holds f70–71 | sparks die by f81 | — | — | ✦ ready to dock | off | crackle tail, ping (E6) at f72 |

### 1 — ISKRA (f72–137)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 13 | 72–77 (6) | white | ✦ R34 glides A → **(205.6, 940)** (inOutCubic) | — | **ıskra** (dotless ı, wordmark r and a) at TC: x 160.6–919.4, baseline 1140. Slides in from the left by −120 px (expoOut, 92 % there on f72). EN: "spark" x 104–976; the ✦ glides to (1016, 940) | — | the ✦ docks as the ı tittle, so the word completes itself | 8 on f72 (smear), 4 f74–76 | swish (beat 4); tick on dock f79 |
| 14 | 78–83 (6) | **SPLIT TOP** wipes in, scaling 0→1 from its corner point (324,756) (outExpo 5 f). Image ← `assets/raw/spark-fire/spark-fire-hooke-sparks-flint-steel-micrographia-wellcome.jpg` [eng] cov(0.33,0.28)×2.6 (Hooke's Fig. 1 spark globules) | ✦ twinkle +15 % (punch 4 f) | orange 6 px circle Ø120 round the largest globule (image ≈ (0.37,0.27)), drawn 360° clockwise f79–83 (linear, 72°/f) | ıskra holds, push 1.002/f about (540,1040) | window push 1.008/f | cell wipe from the window's own corner | off | paper tick + glint |
| 15 | 84–89 (6) | **SPLIT BOTTOM** wipes in from (756,1240). Image ← `assets/raw/spark-fire/spark-fire-fire-steel-with-flint-badisches.jpg` [cut] cov(0.50,0.55)×1.3 | ✦ | circle holds | holds | push | same | off | tick |
| 16 | 90–95 (6) | TOP ← `assets/raw/spark-fire/spark-fire-engraving-flint-and-steel-ring-hough1890.jpg` [eng] cov(0.70,0.50)×1.2 (circle leaves with Hooke) | twinkle | — | | | in-place swap | off | tick |
| 17 | 96–101 (6) | BOTTOM ← `assets/raw/spark-fire/spark-fire-flint-striker-islamic-met.jpg` [cut] cov(0.45,0.50)×1.2 | | | | | | off | E6 ping (bar 2) + tick |
| 18 | 102–107 (6) | TOP ← `assets/raw/spark-fire/spark-fire-fire-steel-oval-kulturparken.jpg` [cut] cov(0.50,0.50)×1.4 | twinkle | | | | | off | tick |
| 19 | 108–113 (6) | BOTTOM ← `assets/raw/spark-fire/spark-fire-engraving-tinderbox-hough1890.jpg` [eng] cov(0.40,0.50)×1.2 | | | | | | off | tick |
| 20 | 114–119 (6) | TOP ← `assets/raw/spark-fire/spark-fire-engraving-strike-a-light-stones-hough1890.jpg` [eng] cov(0.50,0.45)×1.1 | twinkle | | | | | off | tick |
| 21 | 120–125 (6) | BOTTOM ← `assets/raw/spark-fire/spark-fire-cave-hand-stencils-gillow-flickr.jpg` [ph] cov(0.45,0.42)×1.3 | | | | | | off | tick |
| 22 | 126–131 (6) | TOP ← `assets/raw/spark-fire/spark-fire-handaxes-nine-bifaces-met.jpg` [cut] cov(0.50,0.55)×1.0 | twinkle | | | | | off | tick |
| 23 | 132–137 (6) | Both windows shrink back into their corner points (inExpo 4 f, f132–135) | ✦ glides back to A (inOutCubic f134–137) | — | letters collapse into the ✦ (scale→0 toward it, inExpo, 1 f stagger a→s) | — | everything returns to one point | 4 f132–137 | zip-in |

### 2 — OHEŇ (f138–239)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 24 | 138–141 (4) | white | ✦ R34 → 0 at A (inExpo) | — | — | — | morph through a point | off | inhale |
| 25 | 142–149 (8) | white | **FLAME born**: pin S 0→260, rot −135°, centre A (E.snap, ~90 % by f145). Flicker from f146: sy = 1 + 0.03·(0.6 sin 0.9f + 0.4 sin 2.3f) about B; rot ±2.5° | — | — | — | grows from the same point | 4 f142–145 | **whoomp** (beat 3 = f144) |
| 26 | 150–155 (6) | FIELD ← `assets/raw/spark-fire/spark-fire-torch-bearing-arm-met.jpg` [cut] reg(0.82,0.13)→B, **w 170 %** (arm bleeds left and to the y 1240 edge) | flame burns in the torch cup | — | — | push 1.010/f about B | flame registered on the object's hot spot | off | crackle, tick |
| 27 | 156–160 (5) | `assets/raw/spark-fire/spark-fire-oil-lamp-bronze-roman-cleveland.jpg` [cut] reg(0.215,0.585)→B, **w 38 %** | flame on the nozzle | | | | scale jump ×0.22 (tiny after huge) | off | tick |
| 28 | 161–166 (6) | `assets/raw/spark-fire/spark-fire-ignis-fire-element-met.jpg` [eng card] reg(0.27,0.14)→A, **w 260 %**: engraved flames lick around the orange flame | | | | | | off | tick |
| 29 | 167–171 (5) | `assets/raw/spark-fire/spark-fire-tinderbox-met.jpg` [cut] reg(0.26,0.355)→B, **w 42 %** | flame on the candle socket | | | | | off | tick |
| 30 | 172–179 (8) | `assets/raw/spark-fire/spark-fire-handaxe-teardrop-acheulean-met.jpg` [cut] reg(0.50,0.53)→A, **w 33 %**: a 360 px axe behind the 299 px flame, so the first tool rhymes with the first flame | | | | | shape rhyme | off | low thud |
| 31 | 180–185 (6) | `assets/raw/spark-fire/spark-fire-lantern-pierced-tin-met.jpg` [cut] reg(0.48,0.55)→A, **w 60 %** | flame inside the lantern | | | | | off | tick |
| 32 | 186–191 (6) | `assets/raw/spark-fire/spark-fire-prometheus-torch-to-sun-met.jpg` [eng card] reg torch (0.23,0.135)→A, **w 260 %** (Prometheus's torch with the engraved sun rays) | flame = the torch flame | | | | | off | tick |
| 33 | 192–197 (6) | `assets/raw/spark-fire/spark-fire-oil-lamp-roman-plain-met.jpg` [cut] **rotated 180°**, reg nozzle (0.50,0.71)→B, **w 50 %**; the body hangs below the flame, cropped at y 1240 | | | **oheň** (wordmark o) at TL: x 176.5–903.5, baseline 1520. Slides in from the right, +120→0 (expoOut, 1 f smear). EN: "fire". | | | 8 on f192 | swish (bar 3) |
| 34 | 198–203 (6) | `assets/raw/spark-fire/spark-fire-oil-lamp-roman-face-met.jpg` [cut] rotated 180°, reg nozzle (0.50,0.68)→B, **w 50 %** | | | holds | | | off | tick |
| 35 | 204–209 (6) | `assets/raw/spark-fire/spark-fire-hand-reaching-cast-met.jpg` [cut] reg fingertip (0.90,0.58)→(452,1030), **w 140 %**: the plaster arm reaches in from the left to the flame | | | holds | | | off | tick |
| 36 | 210–233 (24) | white, FIELD empty (**rest beat**) | flame alone, flickering | — | oheň holds | flame + word push 1.003/f about A | — | off | low fire bed |
| 37 | 234–239 (6) | white | flame → dot Ø34 (`mixCell`, inExpo f234–237); dot alone f238–239 | — | oheň letters collapse into the flame/dot (inExpo 4 f, 1 f stagger) | — | to the dot, then 2 f of stillness | 4 f234–237 | suck → 2 f of silence |

### 3 — BLESK (f240–287)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 38 | 240–242 (3) | white | (the bolt is the orange) | **BOLT**: `taperStroke` along P, 34 px, round head, drawn on top→bottom linearly (0→.4→.8→1.0), passing through the dot | — | — | the stroke swallows the dot | directional 4 | **thunder crack** (beat 3) |
| 39 | 243–244 (2) | **INVERT FLASH** (paper → ink) | bolt untouched | — | — | — | punctuation | off | crack tail |
| 40 | 245–250 (6) | **BOLT SPLIT**: the frame is cut along P into L and R regions, which move −d / +d with d 17→34 (outExpo); the band between them is the gutter. L ← `assets/raw/lightning-early/lightning-early-franklin-kite-currier-ives-loc.jpg` [eng] cover the L bbox (0–650 × 1920), focus (0.47,0.40). R ← `assets/raw/lightning-early/lightning-early-bolt-spokane-1914-loc.jpg` [inv] cover the R bbox (446–1080), focus (0.62,0.30) | **gutter band = the bolt** (2d wide, gradient top→bottom) | — | — | images push 1.010/f | at f245 the band width = the stroke width (34), so nothing pops | 4 f245–247 | rumble |
| 41 | 251–253 (3) | L ← `assets/raw/lightning-early/lightning-early-kite-romas-1753-figuier.jpg` [eng] focus (0.60,0.35) (its drawn zig-zag) | band | | | | in-place swap | off | zap |
| 42 | 254–256 (3) | R ← `assets/raw/lightning-early/lightning-early-bolt-branched-night-nasa.jpg` [inv] focus (0.40,0.32)×1.3 (crops out the logo and timestamp) | | | | | | off | zap |
| 43 | 257–259 (3) | L ← `assets/raw/lightning-early/lightning-early-strike-building-engraving-wellcome.jpg` [eng] focus (0.45,0.30) | | | | | | off | zap |
| 44 | 260–262 (3) | R ← `assets/raw/lightning-early/lightning-early-bolt-single-night-nasa.jpg` [inv] focus (0.57,0.32)×1.3 | | | | | | off | zap |
| 45 | 263–265 (3) | L ← `assets/raw/lightning-early/lightning-early-richmann-killed-engraving-wellcome.jpg` [eng] focus (0.50,0.38) | | | | | | off | zap |
| 46 | 266–268 (3) | R ← `assets/raw/lightning-early/lightning-early-bolt-jennings-1882-loc.jpg` [ph] focus (0.80,0.40)×1.4 | | | | | | off | zap |
| 47 | 269–275 (7) | **The bolt straightens**: every vertex of P lerps to x = 540 (inOutCubic); the gutter grows 68→98.2 px and turns white; a horizontal gutter at y 890.9–989.1 opens (0→98.2). The halves become 4 quarters (TL/BL show Richmann, TR/BR show Jennings) | the orange band **un-draws from both ends into A** (inQuad 5 f) → dot Ø34 | — | — | — | the bolt becomes the grid's gutter | 4 | discharge zip into the dot |
| 48 | 276–287 (12) | Quarter rectangles → **M2F** mark cells (`mixCell` rect→cell, E.snap f276–285), holes closed | dot at the gutter cross | — | — | — | exact rect→cell interpolation | 4 f276–281 | settle "clack" |

### 4 — ELEKTRINA (f288–329): M2F sequencer, one window swaps every 3 f, clockwise ring → tile → pin → leaf

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 49 | 288–290 (3) | ring ← `assets/raw/lightning-early/lightning-early-leyden-nollet-spark-wellcome.jpg` [eng] cov(0.50,0.33)×2.2 (ring + rays centred) | dot pulses +20 % on every swap (3 f) | — | — | in-window push 1.010/f | sequencer swap | off | **zap + bass** (bar 4) |
| 50 | 291–293 (3) | tile ← `assets/raw/lightning-early/lightning-early-volta-pile-original-wellcome.jpg` [cut] cov(0.47,0.45)×1.0 | | | | | | off | tick |
| 51 | 294–296 (3) | pin ← `assets/raw/lightning-early/lightning-early-davy-arc-vacuum-figuier.jpg` [eng+inv] cov(0.47,0.42)×1.8 (the glass egg in the teardrop) | | | | | | off | tick |
| 52 | 297–299 (3) | leaf ← `assets/raw/lightning-early/lightning-early-galvani-frog-legs-four-wellcome.jpg` [eng] cov(0.18,0.50)×1.6 | | | | | | off | tick |
| 53 | 300–302 (3) | ring ← `assets/raw/lightning-early/lightning-early-machine-plate-galvani-wellcome.jpg` [cut] cov(0.48,0.42)×1.0 (glass disc in the disc window) | | **WIRE**: orange 12 px lines run from A along the 4 gutter centre-lines to the grid edges (linear 6 f, f300–305) | | | | off | zap + hum on |
| 54 | 303–305 (3) | tile ← `assets/raw/lightning-early/lightning-early-leyden-jar-battery-smithsonian.jpg` [cut] cov(0.50,0.55)×1.1 | | wire holds | | | | off | tick |
| 55 | 306–308 (3) | pin ← `assets/raw/lightning-early/lightning-early-leyden-jars-three-galvani-wellcome.jpg` [cut] cov(0.40,0.50)×1.1 | | | | | | off | tick |
| 56 | 309–311 (3) | leaf ← `assets/raw/lightning-early/lightning-early-machine-guericke-sulfur-globe-wellcome.jpg` [eng] cov(0.82,0.38)×2.0 (the sulphur globe) | | | | | | off | tick |
| 57 | 312–314 (3) | ring ← `assets/raw/lightning-early/lightning-early-galvani-metal-arcs-wellcome.jpg` [cut] cov(0.50,0.60)×1.0 | | | | | | off | zap |
| 58 | 315–317 (3) | tile ← `assets/raw/lightning-early/lightning-early-volta-pile-griffin-wellcome.jpg` [cut] cov(0.50,0.55)×1.0 | | | | | | off | tick |
| 59 | 318–320 (3) | pin ← `assets/raw/lightning-early/lightning-early-faraday-sparking-coil-wellcome.jpg` [cut] cov(0.50,0.40)×1.1 | | wire un-draws back into A (f318–323) | | | | off | tick |
| 60 | 321–323 (3) | leaf ← `assets/raw/lightning-early/lightning-early-volta-pile-crown-of-cups-wellcome.jpg` [eng] cov(0.50,0.45)×1.0 | | | | | | off | tick |
| 61 | 324–329 (6) | the 4 windows shrink about A (scale 1→0, log-scale inExpo) and vanish under the dot | dot | — | — | — | cell wipe out into the anchor | 6 f326–329 | suck |

### 5 — SVETLO (f330–431)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 62 | 330–341 (12) | white | dot → **BULB**: `mixCell`(circle r17 @45°, pin S260 @+45°), E.snap; base capsules pop (punch, 3 f stagger, f334–342) | — | — | — | exact cell morph from the dot | 4 f330–333 | relay click + filament buzz (50 Hz) |
| 63 | 342–347 (6) | white | bulb orange | — | — | push 1.004/f | — | off | buzz |
| 64 | 348–350 (3) | **BULB WINDOW**: the same outline (with hole) now shows `assets/raw/electric-age/electric-age-edison-lamp-new-type-smithsonian.jpg` [cut] reg glass centre (0.50,0.25)→A, **w 51 %** (glass r 1246 source px → 130 px; the neck falls exactly into the pin tip) | bulb = window; capsules stay orange | — | — | — | fill swap, identical outline | off | buzz cut |
| 65 | 351–353 (3) | white | **ORANGE** | | | | | off | buzz |
| 66 | 354–356 (3) | WINDOW ← `assets/raw/electric-age/electric-age-edison-lamp-engraving-obi.jpg` [eng] reg (0.50,0.20)→A, w 40 % | window | | | | | off | buzz cut |
| 67 | 357–359 (3) | white | **ORANGE** | | | | | off | buzz |
| 68 | 360–362 (3) | WINDOW ← `assets/raw/electric-age/electric-age-patent-edison-electric-lamp-1880.jpg` [eng] reg Fig. 1 globe (0.55,0.27)→A, w 172 % | window | | | | | off | buzz cut |
| 69 | 363–365 (3) | white | **ORANGE** | | | | | off | buzz |
| 70 | 366–368 (3) | WINDOW ← `assets/raw/electric-age/electric-age-edison-lamp-stopper-smithsonian.jpg` [cut] reg globe (0.51,0.215)→A, w 61 % | window | | | | | off | buzz cut |
| 71 | 369–371 (3) | white | **ON**: orange for good | 8 ray capsules (w 18, l 44, starting at r 160, at 0°, 45°, …) pop (punch 4 f) | — | — | — | off | **switch clunk + ping** |
| 72 | 372–407 (36) | white (**rest beat**) | bulb, push 1.004/f | rays un-draw into the glass f380–383 | **svetlo** (wordmark l and o) at TL: x 106.4–973.6, baseline 1520. Slides in from the left (expoOut, 1 f smear). EN: "light". | — | text beat on white | 8 on f372 | warm pad (bar 5 at f384) |
| 73 | 408–413 (6) | white | bulb | — | svetlo collapses into the bulb base (inExpo 4 f, 1 f stagger) | — | to the bulb | 4 | suck |
| 74 | 414–417 (4) | **Step zoom-out 1** (×0.55 about A). Behind the bulb: `assets/raw/electric-age/electric-age-edison-lamps-catalog-poster-1903-loc.jpg` [eng], registered so the poster bulb glass (0.484,0.45)→A and its glass r (226 source px) = 71.5 px → **w 107 %** | the orange bulb sits exactly on one catalogue bulb | — | — | hard step, then drift 0.994/f | registered on the glass | off | shutter clack |
| 75 | 418–421 (4) | **Step 2** (×0.62): poster w 67 % | same | | | same | | off | clack |
| 76 | 422–425 (4) | **Step 3** (×0.75): poster w 50 %, the whole sheet visible (tiny poster vs. huge before) | bulb, effective S 66.5 | | | same | | off | clack |
| 77 | 426–431 (6) | poster cut away; small bulb alone on white | small bulb (glass r 33) | **registration ring**: orange 6 px circle Ø220 round A, drawn 360° (linear 5 f, f426–430) | — | static | — | off | tick, hum swells |

### 6 — SIEŤ (grid) (f432–479): each image's light source is registered on the bulb glass at A; the ring persists

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 78 | 432–436 (5) | FIELD (no clip, no word) ← `assets/raw/electric-age/electric-age-san-jose-electric-light-tower-night-engraving-obi.jpg` [eng card] reg light (0.50,0.08)→A, **w 160 %** | small bulb + ring | ring | — | push 1.008/f about A | registered on the light source | off | hum + tick (beat 3) |
| 79 | 437–441 (5) | `assets/raw/electric-age/electric-age-luna-park-electric-tower-night-1905-loc.jpg` [inv] reg tower top (0.47,0.07)→A, w 190 % | | | | | | off | tick |
| 80 | 442–445 (4) | `assets/raw/electric-age/electric-age-arc-lamp-brush-two-carbons-smithsonian.jpg` [cut] reg arc gap (0.48,0.74)→A, **w 45 %** | | | | | | off | arc fzzt |
| 81 | 446–449 (4) | `assets/raw/electric-age/electric-age-yablochkov-candle-arc-lamp-engraving-obi.jpg` [eng] reg globe (0.38,0.30)→A, w 120 % | | | | | | off | tick |
| 82 | 450–453 (4) | `assets/raw/electric-age/electric-age-paris-electric-searchlight-concorde-engraving-obi.jpg` [eng card] reg beam apex (0.80,0.66)→A, w 230 % | | | | | | off | tick |
| 83 | 454–457 (4) | `assets/raw/electric-age/electric-age-pylon-insulators-against-sky-wordpress.jpg` [ph, sky levelled white] reg insulator (0.72,0.42)→A, w 150 % | | | | | | off | tick |
| 84 | 458–460 (3) | `assets/raw/electric-age/electric-age-pylon-silhouette-dusk-sky-wordpress.jpg` [cut] reg top (0.50,0.12)→A, **w 60 %** | | | | | | off | tick |
| 85 | 461–463 (3) | `assets/raw/electric-age/electric-age-pylons-tva-chickamauga-sky-1942-loc.jpg` [ph] reg top (0.56,0.42)→A, w 140 % | | | | | | off | tick |
| 86 | 464–465 (2) | **INVERT FLASH** (ink frame): `assets/raw/electric-age/electric-age-tesla-colorado-springs-sparks-wellcome.jpg` [ph, as is] reg coil top (0.07,0.38)→A, w 220 % | bulb + ring untouched | | | | punctuation | off | **zap** |
| 87 | 466–468 (3) | `assets/raw/electric-age/electric-age-pearl-street-station-dynamo-room-1882-engraving-ia.jpg` [eng card] reg (0.50,0.45)→A, w 200 % | | | | | | off | tick |
| 88 | 469–471 (3) | `assets/raw/electric-age/electric-age-gramme-dynamo-engraving-obi.jpg` [eng] reg (0.50,0.45)→A, **w 70 %** | | | | | | off | tick |
| 89 | 472–474 (3) | `assets/raw/electric-age/electric-age-patent-stanley-induction-coil-1886.jpg` [eng] reg Fig. 3 ring (0.57,0.68)→A, w 360 % (its ring ≈ Ø200 sits inside the orange ring) | | | | | ring rhyme | off | tick |
| 90 | 475–476 (2) | `assets/raw/electric-age/electric-age-patent-tesla-motor-rotating-field-1888.jpg` [eng] reg Fig. 1″ ring (0.62,0.15)→A, w 520 % | | | | | | off | tick |
| 91 | 477–479 (3) | `assets/raw/electric-age/electric-age-woman-dressed-in-light-bulbs-cabinet-card-met.jpg` [ph] reg head bulbs (0.50,0.12)→A, w 120 % | | | | | | off | tick |

### 7 — SLNKO (f480–647)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 92 | 480–503 (24) | **DW** (circle r 420 at A) ← `assets/raw/electric-age/electric-age-earth-at-night-europe-africa-black-marble-nasa.jpg` [ph] reg globe centre (0.50,0.505)→A, globe r 0.42 W → 420 px (**w 93 %**), so the limb is the window edge | bulb S 66→260 (E.snap f480–487), capsules → 0 (f480–485); **BULB → RING** `mixCell`(pin@45°, ring Ø420@45°), E.swift f486–501 | registration ring cut at f480 | — | DW push 1.004/f | exact spine morph; the ring = M2's ring | 4 f486–493 | **sub thump** (bar 6), riser starts |
| 93 | 504–511 (8) | DW ← `assets/raw/sun-solar/sun-solar-kircher-sun-corpus-solis-plate-wellcome.jpg` [eng] disc-reg, centre (0.50,0.50), r 0.31 W | **ring (sun)**, constant | — | — | DW push 1.006/f | in-place swap, concentric | off | tick + riser |
| 94 | 512–518 (7) | `assets/raw/sun-solar/sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg` [ph] disc-reg (0.50,0.50), r 0.47 W | | | | | | off | tick |
| 95 | 519–525 (7) | `assets/raw/sun-solar/sun-solar-sunspot-course-disc-engraving-wellcome.jpg` [eng] disc-reg (0.51,0.50), r 0.43 W | | | | | | off | tick |
| 96 | 526–531 (6) | `assets/raw/sun-solar/sun-solar-eclipse-2017-corona-nasa.jpg` [ph] **ring-reg** moon (0.485,0.47), r 0.17 W: the orange ring lands exactly on the moon disc and the corona fills DW | | | | | | off | tick |
| 97 | 532–537 (6) | `assets/raw/sun-solar/sun-solar-scheiner-rosa-ursina-grid-disc-ia.jpg` [eng] disc-reg (0.50,0.36), r 0.42 W | | | | | | off | tick |
| 98 | 538–542 (5) | `assets/raw/sun-solar/sun-solar-sdo-aia171-corona-loops-2014-nasa.jpg` [ph] disc-reg (0.50,0.50), r 0.47 W | | | | | | off | tick |
| 99 | 543–547 (5) | `assets/raw/sun-solar/sun-solar-trouvelot-total-eclipse-1878-ia.jpg` [eng] ring-reg moon (0.50,0.40), r 0.10 W | | | | | | off | tick |
| 100 | 548–551 (4) | `assets/raw/sun-solar/sun-solar-sunflower-head-frontal-unsplash.jpg` [ph] ring-reg floret disc (0.47,0.47), r 0.255 W | | | | | | off | tick |
| 101 | 552–555 (4) | `assets/raw/sun-solar/sun-solar-sundial-universal-ring-flat-met.jpg` [ph] disc-reg ring (0.50,0.49), r 0.40 W | | | | | | off | tick |
| 102 | 556–559 (4) | `assets/raw/lightning-early/lightning-early-leyden-nollet-spark-wellcome.jpg` (callback of #49) ring-reg engraved ring (0.50,0.33), r 0.06 W | | | | | | off | tick |
| 103 | 560–562 (3) | `assets/raw/sun-solar/sun-solar-eclipse-corona-1842-wellcome.jpg` [eng] ring-reg disc (0.51,0.38), r 0.25 W | | | | | | off | tick |
| 104 | 563–565 (3) | `assets/raw/sun-solar/sun-solar-sunflower-woodcut-degraag-rijks.jpg` [eng] ring-reg head (0.53,0.30), r 0.07 W | | | | | | off | tick |
| 105 | 566–568 (3) | `assets/raw/spark-fire/spark-fire-oil-lamp-roman-sunrays-met.jpg` [cut] ring-reg rosette (0.52,0.47), r 0.15 W (the sun that was on the fire-era lamp) | | | | | | off | tick |
| 106 | 569–571 (3) | `assets/raw/sun-solar/sun-solar-scheiner-1612-sunspot-discs-grid-freiburg.jpg` [eng] cov(0.50,0.72)×1.4: a grid of little suns | | | | | | off | tick |
| 107 | 572–573 (2) | `assets/raw/sun-solar/sun-solar-sunflower-head-black-bg-1-wellcome.jpg` [ph] ring-reg head (0.50,0.38), r 0.17 W | | | | | | off | tick |
| 108 | 574–575 (2) | `assets/raw/sun-solar/sun-solar-iss-solar-array-sunburst-nasa.jpg` [ph] reg sun star (0.66,0.53)→A, w 220 % (the sun between panels) | | | | | | off | tick |
| 109 | 576–577 (2) | `assets/raw/sun-solar/sun-solar-early-module-round-cells-dark-tekniska.jpg` [ph] cov(0.50,0.50)×1.15 (round cells = little suns) | ring | **RAYS**: 8 orange capsules (w 34, r 236→330) drawn outward 4 f each, clockwise from 12 o'clock, 1 f stagger (f576–587) | | | **2 f callback flurry** | off | **hit (bar 7)**, ticks every 2 f |
| 110 | 578–579 (2) | `assets/raw/spark-fire/spark-fire-flint-nodule-3d-render-b-zenodo.png` (callback: stone) cov(0.50,0.55)×1.6 | | rays drawing | | | | off | tick |
| 111 | 580–581 (2) | `assets/raw/spark-fire/spark-fire-handaxe-teardrop-acheulean-met.jpg` (callback) cov(0.50,0.53)×1.2 | | | | | | off | tick |
| 112 | 582–583 (2) | `assets/raw/spark-fire/spark-fire-torch-bearing-arm-met.jpg` (callback) reg cup (0.82,0.13)→A, w 120 % | | | | | | off | tick |
| 113 | 584–585 (2) | `assets/raw/lightning-early/lightning-early-volta-pile-original-wellcome.jpg` (callback) cov(0.47,0.45)×1.0 | | | | | | off | tick |
| 114 | 586–587 (2) | `assets/raw/electric-age/electric-age-edison-lamp-new-type-smithsonian.jpg` (callback) reg (0.50,0.25)→A, w 70 % | | | | | | off | tick |
| 115 | 588–589 (2) | `assets/raw/electric-age/electric-age-pylon-silhouette-dusk-sky-wordpress.jpg` (callback) cov(0.50,0.40)×1.0 | | | | | | off | tick |
| 116 | 590–591 (2) | `assets/raw/sun-solar/sun-solar-mouchot-solar-engine-paris-1878-tekniska.jpg` [eng] cov(0.62,0.38)×1.8 (the first solar engine's mirror) | | | | | | off | tick |
| 117 | 592–593 (2) | `assets/raw/sun-solar/sun-solar-cells-window-grid-fraunhofer-flickr.jpg` [ph] cov(0.50,0.50)×1.0 | | | | | | off | tick |
| 118 | 594–595 (2) | `assets/raw/electric-age/electric-age-earth-at-night-europe-africa-black-marble-nasa.jpg` (callback, registered as in #92) | | | | | | off | tick |
| 119 | 596–611 (16) | `assets/raw/sun-solar/sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg` (callback) disc-reg: a clean white sun | ring + 8 rays complete | rays hold | — | DW + ring push 1.006/f | hold before the dive | off | riser peaks f611 |
| 120 | 612–619 (8) | DW irises shut into the ring (r 420→210, inExpo f612–615) | rays un-draw inward (f612–615). **RING travels A → (841.8, 940)**, shrinking Ø420→Ø164 (log-scale cubicInOut f612–619). f616–619: ring-cell rings → wordmark-"o" rings (`makeMorph`, sizes matched within 4 px) | — | **slnk** (wordmark l) slides in from the left to TS: x 156.2–746.7, baseline 1016 (f614–617, expoOut, smear). EN: "s" + ring + "lar"; the ring goes to (412, 940), x 160.7–919.4 | — | **the sun becomes the letter o** | 6 f612–617 | riser cuts to **near-silence (air)** |
| 121 | 620–637 (18) | white. At f626 the o's **counter becomes a window** onto `assets/raw/solaro/roof_tatras_dramatic_sky_vertical.jpeg` [ph], screen-space full-frame cover (scale 0.336, x offset −178): a 70 px glimpse of a Slovak roof | **o is orange** (the sun in the word) | — | **slnko** holds (s, l, n, k in ink; o orange) | word push 1.003/f about A | the roof glimpsed through the o | off | air; faint wind at f626 |
| 122 | 638–647 (10) | **PUSH THROUGH THE COUNTER**: camera scale 1→32 about the o centre (log-scale quadIn, per-frame ratio 1.05→1.9) while translating the o centre to A (inOutCubic). The counter iris grows over the static full-bleed Tatras; the orange o band rushes off-frame by f646. | o band | — | the word flies out with the camera | — | the iris is the exact counter path | **zoom blur 8 f640–647** | whoosh into the o |

### 8 — SOLARO (f648–735)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 123 | 648–653 (6) | Tatras full-bleed (same cover) | dot Ø34 pops at A at f650 (punch) | — | — | push 1.004/f about A | — | 4 on f648 | soft impact + wind (beat 4) |
| 124 | 654–659 (6) | Tatras + **white score lines** (3 px) drawn along the 6×10 gutter centre-lines (horizontals left→right, verticals top→bottom, linear 6 f) | dot | score lines | — | push | the grid is drawn before it is cut | off | pencil score "shhk" |
| 125 | 660–671 (12) | **GRID CUT**: `gridCut`(frame → PANEL, 6×10, p 0→1, E.snap). Gutters 3→30.9 px, radii 0→17.9. The image stays fixed and the cells are windows. | dot in the centre gutter cross | — | — | — | p = 0 is an invisible tiling | off | paper "shk" |
| 126 | 672–677 (6) | **FLIP WAVE** (three.js, clean 3D): 60 slabs (cell outline, depth 6 px), rotateX 0→180° (inOutCubic 10 f). Front = its own Tatras tile; back = orange, one panel-wide screen-space gradient, unlit. Concentric order k = max(row ring, col ring) out from the centre 2×2; start = 672 + 3k (k 0–4). | the centre 4 cells flip first and swallow the dot | — | — | camera 1.0 | — | 2 on flipping tiles | **tile-click cascade** (bar 8) |
| 127 | 678–683 (6) | flip wave continues | | | | **step ×0.80** about A | stepped zoom-out | 2 | clicks |
| 128 | 684–689 (6) | flip wave continues | | | | **step ×0.64** | | 2 | clicks |
| 129 | 690–701 (12) | flips finish f694. From f695 every slab is flat and orange, so 3D swaps to 2D `drawCellsShared` (identical pixels) | **orange panel 600×1011** (x 240–840, y 434.3–1445.7) | | | **step ×0.556** at f690 | invisible 3D→2D swap | off | shimmer swell |
| 130 | 702–715 (14) | Panel → 2×2: each quadrant's 3×5 cells converge to tile its square exactly (proto_end, inOutCubic), one shared gradient | squares at end-mark scale (C 214.3, G 42.9) | | | | no seams, because one gradient spans all cells | 4 f705–712 | low thunk |
| 131 | 716–729 (14) | Squares → **mark** radii and holes (E.snap, exact). The gradient re-maps from panel-wide to per-shape (lerp); inner shadow fades in f722–736 | mark | | | | | off | soft ping |
| 132 | 730–735 (6) | **Gap breath**: G 42.9→0 (inQuart f730–732, a white ✦ appears) → reopens with overshoot (punch f733–738) | mark | | | | callback to the strike | off | click-clack |

### 9 — LOCKUP (f736–887)

| # | frames | layout · images · placement | orange | paint-on | text | camera | transition → | blur | sound |
|---|---|---|---|---|---|---|---|---|---|
| 133 | 736–751 (16) | the mark travels A → (199.6, 940), scale 1.05→0.4804 (inOutCubic f736–755) | mark | — | **slnko** at lockup size (Poppins Bold 189 px = wordmark x-height 105.4) **slides out from behind the mark** (clipped to the right of the mark, outExpo f740–755): baseline 1012.5, x0 349.8 (s 349.8–455.2, l 464.1–495.3, n 504.2–631.6, k 631.6–748.4, o 757.3–867.9). Its **o is orange** (callback to the sun). | — | the open in reverse | 4 f740–751 | near-silent breath |
| 134 | 752–763 (12) | lockup forming | mark lands f755 | — | **slnko → Solaro**. s→S by `makeMorph` (f752–761, E.swift). l glides 464.1→594.9; o glides 757.3→877.2. n and k collapse to orange dots Ø14 (inExpo f752–754), slide to the a and r slots (f755–758) and grow into **orange wordmark a and r** (E.snap f758–763). A new orange dot pops between S and l at f756 and grows into the **orange 2nd o** (f758–763). | — | no outline-to-outline morph except s→S | 4 f752–757 | three soft plucks (a, r, o) |
| 135 | 764–767 (4) | same | mark | — | "Solaro": S and l in ink; o, a, r, o orange | — | anticipation | off | silence |
| 136 | 768–887 (120) | **FINAL LOCKUP L83** = exact logo SVG (identical to f0). **Hold 2.00 s.** | mark | optional **solaro.sk** revealed by a hard left→right wipe f780–787 (quadOut) | the orange letters **snap to #1C1C1C at f768** (1 frame) | locked off | loops to f0 | off | **E add9 chord at f768**, decays to −40 dB by f887 |

**EN deltas** (same frames):
- #13: "spark", with the ✦ going to (1016, 940).
- #33: "fire". #72: "light".
- #120–122: "solar", with the ring docking at (412, 940) and the push centred there.
- #133–134: "solar" slides out with an orange o (s 349.8–455.2, o 464.1–574.7, l 592.6–623.8, a 641.5–751.7, r 769.5–861.9). The glides to the final letters are all ≤ 7 px, s→S morphs, and one orange dot right of the r grows into the final o (877.2–987.8).

---

## 5. Signature moments (and why each morph is geometrically perfect)

1. **The strike: the spark is the space between the cells** (f28–71).
   - The four mark cells are windows full of flint. They slam shut and the white gap left between them ignites orange.
   - *Exact:* at gap 0, the inward corners of ring, tile, leaf and pin are all quarter-circles of radius R = C/2 = 210, centred on (540 ± 210, 940 ± 210).
   - Those are exactly the four arcs of `sparkPath(A, 210)`, so the orange ✦ equals the hole the cells leave, to the pixel. The ✦ is filled 0.5 px oversize under the cells to kill anti-alias seams.
   - The ✦ then shrinks and docks as the **tittle of the dotless ı** in "ıskra" (tittle centre = baseline − 198 = y 940).

2. **Lightning in the gutter** (f240–287).
   - One polyline P does three jobs: it is the painted bolt, the cut line of the split, and (offset ±d) the orange gutter between two archives.
   - Its vertices then lerp to x = 540, the bolt becomes the vertical gutter of the full-bleed Solaro grid, and the four quarters interpolate (`mixCell`, rect → cell) into the four mark cells.
   - Every frame is computed from the same P and the same cell numbers. At the hand-off the band width equals the stroke width (34 px), so nothing pops.

3. **History flickers inside the bulb** (f348–371).
   - The orange bulb (pin cell, tip down) strobes between orange and an image every 3 f: an Edison lamp, an engraving, the patent, the "stopper" lamp.
   - Each image is registered so its glass circle equals the pin's circle (r 130 at A), and the neck falls into the pin tip.
   - The outline never changes, only the fill, so there is zero morph error. It reads as the first bulbs flickering on, and it lands on the switch clunk.

4. **Every sun, one ring, into the o** (f480–647).
   - The bulb becomes the ring (`mixCell`, the spine prototype).
   - 26 suns (engravings, NASA, eclipses, sunflowers, a Roman lamp's rosette, round PV cells) flash under it, all **concentric**. "disc-reg" puts the disc edge on r 420; "ring-reg" puts the disc or moon edge exactly on the ring's outer edge, r 210.
   - The ring then docks as the **o of "slnko"**. The ring cell and the wordmark o both have two contours, outer and counter, with sizes matched within 4 px, so the morph runs over 4 f with `makeMorph`.
   - Inside the counter is a Solaro roof under the Tatras, and the camera dives through the exact counter path.

5. **Roof → panel → mark → name** (f648–768).
   - The client's roof photo is scored and cut into a 6×10 Solaro grid. At p = 0, `gridCut` is an invisible tiling.
   - 60 slabs flip to orange in concentric square waves out from the anchor. This is the film's one **clean 3D** moment; it uses unlit materials with the same screen-space gradient as 2D, so the 3D→2D hand-off is invisible.
   - proto_end merges each 3×5 quadrant into one square under one gradient (no seams) and grows the exact mark radii and holes. The gap breathes into a ✦ once, as a callback to the strike.
   - The mark slides into the lockup, and **"slnko" becomes "Solaro"**: the n and k leave as dots, and the dots grow into an orange a and r. The pin and ring of the mark are literally the a and o of the wordmark. Everything snaps black on the chord.

---

## 6. Risks and how this avoids slop

**What we deliberately do NOT do**
- No dissolves, cross-fades or opacity fades. Every change is a hard cut, an in-place swap, a cell wipe, a camera step, or a morph through a point.
- No glow, bloom, lens flares, light leaks, grain, paper texture, vignette or drop shadows. The only shadow is the logo's own inner shadow.
- No beige or sepia. Engravings are levelled to #FFFFFF, night photos are inverted to white, and no peach tint ever appears.
- No colour other than the brand orange. No blue skies: sky in the photos is levelled to white.
- No outline-to-outline letter morphs between unrelated letters. The only glyph morphs are s→S and ring→o, both with the same topology and near-identical shape. Everything else glides, collapses to a point, or grows from a point.
- No text over images. Words sit on white, in the centre band or the low band.
- No handwritten scribbles or dry-brush textures. Paint-on elements are clean geometry: the bolt, circles, gutter wires, ray capsules, score lines.
- No camera shake, Dutch tilt or Ken Burns pans. Only constant-ratio pushes and stepped zooms about A.
- No stock "happy family" footage, no AI imagery. Client photography arrives only at the payoff (the Tatras roof), where it means "this is your roof".
- No eyebrow labels, years, numbers or captions. No more than one orange element on screen, except the four orange letters in the lockup for 16 f.
- Orange never covers more than about a third of the frame, except the flip wave (≤ 44 % for under 12 f, already zooming out).

**Risks and mitigations**

| risk | mitigation |
|---|---|
| Too many layouts feel incoherent | Every layout is one 5:1 Solaro grid at a different scale, and every window turns its big round corner toward A. Only four layout families exist: mark 2×2, split, registered field/disc, panel. |
| 3-frame windows are illegible | Images are chosen for a central, high-contrast subject. Render a contact strip per section and swap out anything that doesn't read at 3 f. |
| Registration drifts (~40 registered images) | All hot points live in one `b-registry.json` (point, disc radius, rotation), checked with an overlay render (crosshair at A + circles r 130/210/420) before the final render. |
| The bolt split reads as a "torn paper" cliché | Hard vector edges, flat brand gradient, 7 f of life, then it straightens into the brand grid. |
| The 3D flip looks uncanny | Unlit `MeshBasicMaterial`, flat gradient, depth only 6 px, fake shade = 0.82 + 0.18·\|cos θ\|. 2D fallback: scaleY(cos θ) per cell. |
| ring→o and s→S morphs wobble | Both are single-topology `makeMorph` with n = 180 and aligned start points. Fallback: dimension-matched hard swap at the morph's end frame, since the sizes are already equal within 4 px. |
| Push through a 70 px counter aliases | The iris is the analytic Path2D of the counter, not a bitmap. Zoom blur covers the last 8 frames. |
| Slovak copy loses non-SK viewers | The images carry the story; the EN variant is frame-identical. |
| Busy middle section | Three white rest beats (f210–233, f372–407, f620–637) and two hold-alone beats for the orange element (f58–71, f238–239). |

---

## 7. Build plan (one day, few mechanisms)

| # | mechanism | engine | used in | effort |
|---|---|---|---|---|
| 1 | **Window**: image clipped to any cell (rotated Path2D), mode `cov` or `reg` | `shapes.cellToPath`, `draw.drawCover` / `drawAnchored` | ~90 % of all shots | 1 h |
| 2 | **Layouts**: M2, M2F, SPLIT, FIELD, DW, BOLT (polygon P ± d), PANEL | `markCells`, `gridCut`, `mixCell`, a small polygon helper | all | 2 h |
| 3 | **Schedules**: one JSON per section `[{f, cell, img, mode, pt/focus, w/zoom, rot, treat}]` + `b-registry.json` | `seq.montage`, `film.makeFilm` (blur windows and sound cues in the same table) | all montages | 1.5 h |
| 4 | **Camera**: stepped zoom table + log-scale push | `draw.camera` | #04–05, #74–76, #122, #127–129 | 0.5 h |
| 5 | **Orange spine**: ✦ / dot / flame / bulb / ring / o | `spine.js` states + `sparkPath` | throughout | 1 h |
| 6 | **Type**: slide-in, collapse to a point, dock; lockup word morph with custom ops | `text.layoutHybrid`, `wordmorph.drawWordMorph({custom})`, `morph.makeMorph` | #13, 33, 72, 120, 133–136 | 2 h |
| 7 | **Paint**: bolt `taperStroke`, wires, circles and rays (`strokePts`), `sparks` | `draw.js` | #10, 14, 38, 53, 71, 77, 109, 124 | 1 h |
| 8 | **3D flip**: 60 slabs, per-cell UVs on one texture, unlit gradient back face | `three-layer.Stage3D(1080,1920)`, camera z 4158, FOV 26° | #126–129 | 2 h |
| 9 | Registration pass (overlay sheet) | `tools/review.py` | — | 1.5 h |

Total ≈ 12.5 h.

**Prototypes**
- **proto_open is kept and extended.** It keeps the suck-in, `markCells` gap → 0 and `sparkPath`. It adds two stepped zooms, the stone windows, the invert flash and sparks, and the ✦ now docks as a tittle instead of fading to a dot.
- **proto_end is kept** (grid → 2×2 → radii → breath → lockup), but it is now fed by the 3D photo panel, and the plain wordmark slide is replaced by the slnko → Solaro morph.
- The GLB flints are optional: the ring and tile windows in #04–05 can be live three.js renders turning 2°/f instead of the PNG renders.

---

## 8. Image ledger and stats

**85 unique files**, 9 of them reused as callbacks; every path verified with `ls`.

| era | count |
|---|---|
| spark-fire | 27 |
| lightning-early | 20 |
| electric-age | 20 |
| sun-solar | 17 |
| solaro (client photo) | 1 |

**Shots**: 136 (cuts + in-place swaps + inversions), parsed from the table and contiguous f0–f887. Median shot = **4 f**, mean 6.5 f. Shots ≤ 8 f: n = 118, median 4 f. Shortest 2 f; longest 120 f (the logo hold).

**Cuts per 0.5 s** (all 30 bins): 4, 8, 3, 5, 5, 5, 5, 2, **10**, 5, 9, 6, 5, 3, 6, **10**, 2, 5, 8, **13**, 2, 3, 4, 3, 2, 3, 0, 0, 0, 0.
- Three accelerations: the lightning split (4.0 s), the grid (7.5 s) and the 2 f sun flurry (9.5 s).
- The last 4 s are a landing: three continuous moves and a 2.0 s static hold.

**Text beats**:

| word | frames | length |
|---|---|---|
| ıskra | f72–131 | 60 f |
| oheň | f192–237 | 46 f |
| svetlo | f372–411 | 40 f |
| slnko | f614–647 | 34 f |
| Solaro | final from f768 | logo hold 120 f = 2.0 s (≥ 1.6 s) |
