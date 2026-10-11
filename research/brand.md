# Solaro brand study

Sources: solaro.sk crawled 2026-10-11. Pages rendered in Chromium (Playwright) and read through the WP REST API (pages and media library, about 7,000 items). Pages covered: home, montaze, realizacie, fotovoltika-pre-firmy, ohrev-vody-na-kluc, tepelne-cerpadla-na-kluc, klimatizacie-na-kluc, kontakt, blog, zaruka, dotacia, online-kalkulacka. `/obchod/` and some category pages sit behind a Cloudflare challenge, which does not matter for this study.
Full-page screenshots (720 px wide JPEGs): `research/brand/screens/`.
Company: **innovecom s.r.o.**, trading as Solaro.sk. Seat and warehouse: Pálenica 3092, Bardejovská Nová Ves, 085 01 Bardejov (east Slovakia). Phone +421 54/202 8937, info@solaro.sk. Czech sister shop: Enerso.cz.

---

## 1. Palette (measured on the live site)

| Role | Hex | Where it comes from |
|---|---|---|
| **Solaro Orange (primary)** | **#FF5E2B** | `--wd-primary-color`, buttons, accent words, flat logo on the live site. It is the most frequent saturated pixel on every page. |
| Orange deep (gradient end) | **#FF3D00** | Bottom stop of the vertical gradient in the provided mark SVG (#FF5E2B at the top, #FF3D00 at the bottom) |
| Orange hover | #EC5727 | `--btn-accented-bgcolor-hover` |
| Orange ramp (stats tiles) | #FF6200 / #FD7F2C / #FD9346 / #FDA766 | "4,000+ / 30 dní / 400+ / 10+" block on /montaze/ |
| Burnt orange | #C4381C to #C6381E | discount badges, emphasis |
| Peach tints | #FFE7DF, #FFF1EB | light section backgrounds and the footer wash |
| **Ink (wordmark)** | **#1C1C1C** | wordmark fill in the logo SVG |
| Titles / body | #242424 / #262626 / #333333 | `--wd-title-color`, `--wd-text-color` |
| Secondary grey | #838383, #767676, #BBBBBB | small text, meta |
| Dark band | #212121 | USP strip ("Doručenie zdarma…") |
| Off-white panels | #F7F7F7, #F3F3F3, #FAFAFA | cards |
| Secondary accents (page-specific, not core) | yellow #FFDE59 / #FBBC34, green #61CE70 / #1FA463 (checkmarks, "Zelená domácnostiam"), navy #10243A (A/C pages) | |

**Ad palette:** pure white #FFFFFF, ink #1C1C1C, Solaro Orange #FF5E2B, with the #FF5E2B to #FF3D00 gradient only on the mark. Greys are for B&W photography only. Keep peach tints out of the frame, because they read as the beige "artsy" look the brief rules out.

## 2. Typography

**Site fonts (computed styles):** Poppins 400 for body text and Poppins 600 for titles, which accounts for about 90% of all text. Palanquin Dark 400 is used for product-card titles and widget titles. Hind 600 is used in the header nav. Lato 400 is the alternative theme font and is barely visible. Roboto 900 caps appear in the USP strip, Inter on the A/C pages, and Caveat (handwritten) as an accent on the B2B page ("Znížte náklady…", "MINI/MIDI/MAXI"). A recurring house habit is the **two-tone headline**: dark text with one keyword in #FF5E2B, for example "Fotovoltika **pre firmy** od Solaro.sk" or "**Kategórie** produktov".

**Wordmark identification.** I tested 66 families at weights 500–900, 273 fonts in total: Google Fonts plus Fontshare's Satoshi, General Sans, Clash, Cabinet, Switzer and others. Each glyph was scaled so its "o" height matches the wordmark "o" (225.1 units), aligned on the baseline, centred on the wordmark letter, and rasterised even-odd. IoU was then measured against the SVG wordmark paths. Overlay: `research/brand/font-match.png`. Full table: `research/brand/font-match.json`. Scripts: `research/brand/scripts/`.

| # | Font | aligned IoU | mean letter IoU | S,o,l,o IoU | word IoU (native spacing) | letters S / o / l / a / r / o | S-height ratio | stem ratio |
|---|---|---|---|---|---|---|---|---|
| 1 | Lexend 700 (= Lexend Deca 700) | 0.855 | 0.854 | 0.925 | 0.588 | 0.83 / 0.94 / 0.98 / 0.87 / 0.56 / 0.94 | 1.006 | 1.005 |
| 2 | Chillax 600 (Fontshare) | 0.851 | 0.843 | 0.913 | 0.580 | 0.82 / 0.95 / 0.93 / 0.95 / 0.46 / 0.95 | 1.021 | 0.941 |
| 3 | **Poppins 700 (Bold)** | **0.846** | 0.837 | 0.918 | **0.707** | **0.87** / 0.94 / 0.92 / 0.87 / 0.48 / 0.94 | 0.958 | 1.033 |
| 4 | Clash Grotesk 600 (Fontshare) | 0.825 | 0.842 | 0.882 | 0.696 | 0.75 / 0.92 / 0.93 / 0.70 / 0.82 / 0.93 | 1.009 | 0.988 |
| 5 | Sen 800 | 0.824 | 0.816 | 0.884 | 0.750 | 0.83 / 0.91 / 0.89 / 0.84 / 0.53 / 0.91 | 0.991 | 1.104 |
| 6 | Readex Pro 700 | 0.809 | 0.814 | 0.925 | 0.537 | 0.84 / 0.95 / 0.97 / 0.63 / 0.56 / 0.95 | 1.006 | 1.011 |
| 7 | Be Vietnam Pro 800 | 0.807 | 0.816 | 0.871 | 0.505 | 0.66 / 0.95 / 0.92 / 0.87 / 0.54 / 0.95 | 1.057 | 1.078 |
| 8 | Outfit 700 | 0.800 | 0.816 | 0.860 | 0.580 | 0.60 / 0.96 / 0.91 / 0.84 / 0.62 / 0.97 | 1.096 | 1.044 |
| 9 | Urbanist 900 | 0.798 | 0.797 | 0.845 | 0.540 | 0.74 / 0.85 / 0.94 / 0.90 / 0.50 / 0.85 | 1.053 | 0.987 |
| 10 | Onest 800 | 0.797 | 0.801 | 0.900 | 0.490 | | | |
| 11 | Figtree 800 | 0.797 | 0.804 | 0.906 | 0.571 | | | |
| … | Montserrat 800 0.778 · General Sans 700 0.787 · Satoshi 900 0.761 · Switzer 800 0.760 · Geist 900 0.756 · Sora 800 0.753 · Manrope 800 0.733 · Plus Jakarta 800 0.765 · Red Hat Display 900 0.786 | | | | | | | |

*Aligned IoU* places each glyph at the wordmark's own letter position. *Word IoU* uses the font's own advances and kerning plus one uniform tracking value. The wordmark's "a" and "r" are custom-drawn, so every font loses points on those two letters.

**Conclusion: the wordmark is built on Poppins Bold.**
- The S and o are near-identical. Poppins Bold has the best S of all 273 fonts (0.87).
- Poppins Bold's native spacing reproduces the wordmark spacing to within ±15/1000 em per pair, with a mean of +1/1000 em. That makes it the highest word-level IoU among the top four (0.707). Lexend's spacing is off by up to 36/1000 em.
- Stroke-to-x-height ratio: wordmark 0.303, Poppins Bold 0.306.
- The equivalent setting is Poppins Bold at font-size **392.2 units**, which is 0.8735 × the mark height. The S is drawn about 4% taller than Poppins' S and the l about 6% taller.
- "a" is single-storey: the bowl rounds over into the stem with no square shoulder, and the stem has a flat foot. "r" is a full arch (n-shape) whose right leg is cut flat at y≈255.
- Lexend 700 wins the per-glyph average by 0.009, thanks to its l and a, but its S is wider and its terminals are more open. It lands second.

**Recommendation for the ad**
- **Headlines: Poppins Bold (700)**, sentence case like the wordmark, tracking 0 to −10/1000 em, leading 1.0–1.05 for stacked lines. Ink #1C1C1C, with one accent word in #FF5E2B (the site's own two-tone habit).
- Use SemiBold 600 only for small secondary lines. Use ExtraBold 800 at most for one huge punch word; its stems are 18% heavier than the wordmark's.
- Hero words containing "a" or "r" can use the logo's custom a/r glyphs to feel bespoke. Scale = font-size / 392.2, with the baseline at y = 375.372 in the logo SVG.
- Never re-typeset "Solaro" itself. Always use the logo paths.
- Secondary/alternate: **Lexend (variable, wght 100–900)**. Use it if a weight-axis animation is wanted.
- Files in `fonts/poppins/` (Thin–Black + OFL.txt) and `fonts/lexend/` (Lexend[wght].ttf, static Bold and ExtraBold instances, OFL.txt). Both are SIL OFL 1.1, so commercial video use is fine.
- Fontshare fonts (Chillax, Clash) are under ITF FFL. That licence explicitly allows "Video, Broadcasting" but forbids modification and format conversion. Not needed here.

## 3. Logo geometry (from path data, 449 × 449 box, y down)

Diagram: `research/brand/mark-geometry.png`. Machine-readable: `research/brand/mark-geometry.json`. The parametric model below reproduces each SVG shape at IoU 0.997–0.998; the residual is anti-aliasing.

**Grid:** a 2 × 2 grid of cells, each **C = 204.092** wide.
- **Gap G = 40.816 = 0.2 C**, horizontal and vertical. Columns sit at x = 0 and 244.908; rows at y = 0 and 244.905.
- Centre of the mark: (224.5, 224.5).
- **R = C/2 = 102.046.** All arcs are true circles (cubic handle = 0.5523 r).

**One primitive builds all four shapes:** a C × C cell with per-corner radii [tl, tr, br, bl] in 0…R, plus an optional centred hole with its own radii.

| Shape | Cell origin | Corner radii [tl,tr,br,bl] | Hole | Notes |
|---|---|---|---|---|
| ring_TL | (0.023, 0) | [R,R,R,R] = circle | circle r **48.921** | annulus centred on (102.07, 102.046); band 53.125; hole/outer = 0.479 |
| quarter_TR | (244.836, 0.013) | [0, **23.753**, 0, **R**] | none | big quarter-round corner (centre 346.882, 102.059) faces the mark centre |
| quarter_BL | (0, 244.905) | [0, **R**, 0, **23.753**] | none | the TR shape rotated 180° |
| pin_BR | (244.908, 244.896) | [R, R, **28.237**, R] | r **48.922**, radii [r,r,**0**,r] | circle centred on (346.954, 346.943) with its BR quadrant squared off. The hole is a teardrop with a sharp corner at (395.876, 395.865). Reads as a map pin, or as the wordmark "a". |

- Every big rounded side faces the centre; sharp or small corners face outward.
- The negative space is a **"+" cross 40.8 wide**. If the gap closed to 0, the four inward curves would carve a **4-point star (sparkle)** at the centre.
- **Small-corner radii:** 23.753 = 0.1164 C on the quarter shapes, 28.237 = 0.1384 C on the pin.

**Fill and effects:**
- Each shape has its own vertical linear gradient, #FF5E2B (top of shape) to #FF3D00 (bottom).
- Per-shape inner shadow: dy 1.415, blur σ 4.174, black 25%. This is a soft top-edge inset.
- Group inner shadow: alpha eroded 4, offset (2, 3), blur σ 2.95, black 25%. This is a thin rim on the top-left inner edges and gives a slightly debossed look.
- Filters are in user units, so they scale with the SVG.
- The **live site logo** (`assets/raw/solaro/site-logos/logo-3.svg`) is flat #FF5E2B with no effects.

**Wordmark (solaro-logo.svg, 1866 × 449):**
- Fill #1C1C1C. **Baseline y = 375.372.**
- Round x-height incl. overshoot: 155.88 to 381 (219.5 above the baseline); flat x-height is about 213.9. Overshoot is 5.63.
- S runs from 86.62 to 381; flat cap height is about 283.1. The ascender (l top, y = 68) is 307.37 above the baseline.

Letter boxes (x0 to x1, width):

| Letter | x0 to x1 | Width |
|---|---|---|
| S | 537.0 to 750.0 | 213.0 |
| o | 776.26 to 1006.57 | 230.31 |
| l | 1047.2 to 1112.14 | 64.94 |
| a | 1152.95 to 1382.39 | 229.44 |
| r | 1424.99 to 1617.21 | 192.22 |
| o | 1634.91 to 1865.22 | 230.31 |

Gaps between letters: S-o 26.3, o-l 40.6, l-a 40.8, a-r 42.6, r-o 17.7.

Strokes:
- Vertical stems: l and r 64.94; o sides 65.80; a bowl 65.80; a stem foot 59.74.
- Horizontal strokes: o 60.61; S arcs 60.18. This mild contrast matches Poppins.

**Lockup:**
- Mark 0–449, then an 88-unit gap (0.196 × mark height), then S.
- The text block from l-top (68) to o-bottom (381) is centred exactly on the mark centre (224.5).
- The live-site lockup differs: the wordmark is about 9.7% larger relative to the mark, the gap is 126 units at 449 scale, and the baseline is at 389.6.

## 4. Tone of voice and key messages

**Tone:**
- Practical, confident, benefit-first and number-driven.
- Formal "Vy/Vám", sometimes capitalised.
- Short claims, frequent "na kľúč" (turnkey) and "od A po Z".
- No poetry. Proof through numbers, partners (Huawei, GoodWe, Deye, SolaX, Canadian Solar, JA Solar, Aiko, Pylontech) and subsidies.
- The visual voice is clean e-commerce: white background, orange CTAs, rounded 5 px buttons.

Verbatim lines from the site:

| SK (site) | EN |
|---|---|
| Všetko pre fotovoltaiku | Everything for solar PV (site title) |
| Fotovoltaická elektráreň na kľúč od A po Z | A turnkey solar power plant, A to Z |
| Radi Vám pomôžeme dosiahnuť energetickú nezávislosť. | We'll gladly help you reach energy independence. |
| Vyrábajte si elektrinu priamo zo slnka | Make your own electricity straight from the sun |
| Fotovoltaický systém je investícia na roky. Vyberte si rozumne. | A PV system is an investment for years. Choose wisely. |
| Nie sme tu na sezónu | We're not here just for a season |
| Montáž už do 30 dní | Installed within 30 days |
| Dotácia ihneď (vopred odpočítaná) | Subsidy straight away (deducted upfront) |
| Znížte náklady, zvýšte konkurencieschopnosť | Cut costs, boost competitiveness (B2B) |
| Kúrenie zo slnka – silná dvojica technológií | Heating from the sun: a powerful duo |
| Najlepšia cena na Slovensku | Best price in Slovakia |

These are copy hooks I propose for the ad; they are not on the site and need client sign-off.
- SK: "Od iskry po slnko." (From spark to sun.) · "Energia zo slnka. Na kľúč." · "Slnko → Solaro". Letter morph: **SLNKO → SOLARO**, which share S…o and an l.
- EN: "From first spark to sunlight." · "**solar → Solaro**" (add one "o") · "**fire → wire**" (one-letter swap, fire to electricity) · "**lightning → lighting**" (drop one "n": nature's power to man-made light).
- End card: Solaro logo plus "solaro.sk".

## 5. Services and proof points

**Services:**
- Turnkey PV for family houses (design, subsidy paperwork, installation and service, all Slovakia).
- PV for companies, with "Zelená podnikom" subsidy support: up to 45% of eligible costs / €50,000. Model sets: 20.25 kWp for €16,990, 30.25 kWp for €24,380, 60.5 kWp for €40,650, all ex-VAT.
- PV water heating on a turnkey basis (Antik 3 kW, 3150 Wp, €3,399 incl. VAT).
- Batteries: Huawei LUNA installed free (promo), Pylontech.
- Heat pumps (Hisense, turnkey, east Slovakia; subsidy €400/kW).
- Hisense air conditioning (turnkey, all Slovakia).
- EV chargers (wallboxes).
- Large e-shop and B2B distribution: panels, inverters, batteries, mounting, electrical parts, tools, solar garden.
- Financing: Tatra banka loan at 2.89% p.a.
- Authorised contractor for "Zelená domácnostiam" and "Zelená solidarita", with the subsidy deducted upfront.

**Numbers:**
- 4,000+ satisfied customers
- 400+ complete installations (map of the last 400; the B2B page says 100)
- 10+ years of experience
- Installation within 30 days of contract (max 2 months)
- Quote within 24 h
- Warranties: up to 30 yrs on panels, up to 20 yrs on inverters, up to 5 yrs on fire switches
- Free delivery from €99; 14-day returns

**Social:**
- Facebook: facebook.com/p/Solarosk-100087779300507 (login wall, contents not readable).
- YouTube: @solarosk, "SolaroSK", 11 subscribers, 2 videos, so negligible.
- No Instagram is linked from the site. "@solarosk" on Instagram exists ("Solar Osk") but is unverified and probably not theirs.
- Site videos in the media library (kv-video, controller16) are manufacturer marketing, not client footage.

## 6. Photo inventory (client-owned, `assets/raw/solaro/`, 37 photos + 4 logo files; `credits.json`)

Contact sheet (shown in B&W with a colour inset, with resolution, sharpness and contrast): `research/brand/solaro-photos-contact.jpg`. All images are the largest original (WordPress "-scaled" suffixes stripped).

**Overall quality:**
- Honest smartphone documentation: iPhone 12 MP wide-angle, with some WhatsApp-compressed 1600 px files.
- Real installs, but busy backgrounds (gardens, fences, ladders, cars), tilted horizons and wide-angle distortion. They are *not editorial* as-is.
- In B&W they work as **small or mid tiles in fast cuts, as cutouts, and as texture**. Full-bleed use is reserved for the few with dramatic skies or strong panel graphics.
- `inverter_battery_hallway_vertical.jpeg` has EXIF orientation 6. Always apply `exif_transpose`.

| Use | Files |
|---|---|
| **Best full-bleed / hero (B&W)** | `roof_tatras_dramatic_sky_vertical.jpeg` (4272×5712, already portrait, storm sky + Tatras; the best image) · `roof_slate_panels_vertical.jpeg` (3024×4032) · `roof_orange_tiles_clouds.jpeg` (1600×1200, cumulus + black panels, high contrast) · `roof_long_panel_row_vertical.jpg` (1200×1600, sun glint on the panel; a natural spot for an orange sun) · `roof_flat_array_blocks.jpg` (2048×1536, graphic cell grid for the "grid → panel" beat) |
| Houses with panels (tiles, several at once) | house_pergola_roof_panels (4032, very sharp) · house_orange_facade_panels_wide · house_white_flatroof_panels · house_villa_garden_panels · house_cream_lowangle_panels · house_white_ladder_install (install-in-progress feel) · house_bluesky_panels · house_bungalow_pool_panels · house_white_garage_panels · house_redroof_panels_sunset (soft, sharpness 73, use small) · roof_dusk_dramatic_vertical · roof_flat_array_blocks_b · house_pergola_panel_canopy |
| **Brand proof** | `van_solaro_branded_house.webp` (4000×1848, Solaro van + finished house) · `inverter_huawei_solaro_sticker.jpeg` (4032×3024, Solaro sticker on the inverter, clean white wall, good cutout) · `hq_bardejov_building.png` / `hq_bardejov_drone.png` (HQ with Solaro sign, 1377–1400 px, small use only) |
| **Cutout-ready products** (white or plain wall) | switchboard_dc_orange_open / _wide / _wide_b (already on white, with orange SPDs echoing the brand colour) · inverter_solax_on_wall (4000×3000) · ev_type2_plug_vertical (2268×4032, plug close-up, the "future" beat) · ev_wallbox_installed · battery_pylontech_stack · inverter_on_osb_board · inverter_goodwe_garage · inverter_corner_install · inverter_utility_room_vertical |
| Commercial roofs, **origin unverified** (may be stock; ask the client) | commercial_roof_panorama (1800×550) · commercial_roof_hero_bg (1920×979) · roof_commercial_array_small (761×482) |

Rejected and not downloaded or deleted:
- Stock or AI images: AdobeStock files, the "man with tablet" hero, the hard-hat worker cutout, the lightning stock pair 960/961.
- "ELITE"-shirt installer photos (another company's crew).
- Rendered houses, a personal portrait, product packshots of tools and cables, and duplicates.

## 7. Mark animation ideas (grounded in the real geometry)

All of these use the single primitive above (cell C, corner radii 0…R, optional hole r ≤ 48.92, gap G), so every morph is a smooth interpolation of a few numbers. There are no point-matching artefacts.

1. **Assembly: "squares learn to be round."**
   - Start with four plain 204 × 204 squares, gap 0.2 C (which already looks like a 2 × 2 solar cell).
   - Stagger 40 ms per shape and ease the radii to their final values. The ring and pin take R everywhere; the quarters take R on the inward corner and 23.75 on the outward one.
   - Then the holes open (r 0 → 48.92). The pin's hole opens with its sharp BR corner last.
   - About 0.5 s, crisp expo-out, no overshoot.
2. **Flint spark from the negative space.**
   - Close the gap G 40.8 → 0 while all four inward corners are R.
   - The white space at the centre becomes a perfect 4-point concave star.
   - Flash that star white-hot (orange glow), then snap the gap back open. The "+" becomes the spark's afterimage lines.
   - This is the first beat of the evolution: stone spark → Solaro.
3. **Flame.**
   - Isolate pin_BR, rotate it −135° so its squared corner points up, and close the hole.
   - Animate the tip radius 28.24 → 0 and stretch y by 1.25 to get a flame or teardrop.
   - Flicker with ±3% scale noise on y only. It reverses cleanly back into the pin.
4. **Lightning in the gap.**
   - Shear the grid: slide the top row +0.5 C and the bottom row −0.5 C (or shift TL/BR diagonally).
   - The 40.8-wide vertical gap becomes a Z-shaped bolt of negative space.
   - Flood the bolt with #FF5E2B for 2–3 frames, then snap back.
5. **Light bulb and power.**
   - Rotate pin_BR +45° (point down) to get the bulb glass. Its teardrop hole becomes the glowing filament area: fill it orange and blur it.
   - Quarter_BL shrinks (scale 0.35, radii → 23.75 all round) into the screw base under it.
   - Variant: trim ring_TL's annulus to a 300° arc and drop in a 40.8 × 110 capsule from the top to make the "⏻" power-on icon, the electric age.
6. **Grid → solar panel (clean 3D).**
   - Morph all radii → 0 to get a 2 × 2 cell module.
   - Recursively subdivide, keeping the gap at 0.2 × cell: 2×2 → 4×4 → 6×10 (a 60-cell panel).
   - Tilt in 3D (rotateX 55°, slight Y) onto one of the roof photos, aligning to `roof_flat_array_blocks` or `roof_tatras…`.
   - Reverse at the end: the panel collapses back to 2 × 2, the radii come back, and it becomes the logo.
7. **Sun.**
   - All corners → R gives four discs. They converge to the centre (G → −C) and merge into one big disc.
   - Rays are drawn out of the "+" gap and a 45° copy of it, as 8 capsules 40.8 wide (the gap width), in a quick stroke-on.
   - The sun can then "set" into ring_TL: hole opens to 48.92, scale down, dock top-left, and the other three shapes pop in behind it.
8. **Mark ↔ wordmark letters (end lockup).**
   - ring_TL is geometrically the wordmark "o" (both annuli). pin_BR is the wordmark "a" (a circle with a squared bottom-right).
   - On the final beat, the ring and pin fly into the "o" and "a" slots of "Solaro" (scale 230/204 ≈ 1.13, with the hole radius adjusted). The remaining letters type on in Poppins-matched paths.
   - The shapes then spring back into the mark as the full logo settles. For a perfect hold frame, end on the exact SVG paths.

## Files produced
- `research/brand.md` (this file)
- `research/brand/screens/*.jpg` (12 page screenshots)
- `research/brand/solaro-photos-contact.jpg`
- `research/brand/font-match.png` and `research/brand/font-match.json`
- `research/brand/mark-geometry.png` and `research/brand/mark-geometry.json`
- `research/brand/scripts/` (font matching, mark model and contact-sheet scripts)
- `assets/raw/solaro/` (git-ignored; 37 photos + `site-logos/` + `credits.json`)
- `fonts/poppins/`, `fonts/lexend/` (TTFs + OFL.txt)
