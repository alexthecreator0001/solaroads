# Reference teardown — "Claude · Keep thinking" (vertical spot)

Source: `research/reference/reference.mp4`. H.264 1080×1920, 60 fps CFR, 868 frames (14.467 s). AAC 48 kHz stereo, 14.528 s, −14.3 LUFS integrated, peak −0.5 dBFS.
Method: every frame decoded (540×960 JPGs in `research/reference/frames/`, git-ignored, plus a few full-res PNGs in `frames/full/`). Then three cut detectors: grey mean-abs-diff, histogram diff, and an optical-flow-compensated residual (Farnebäck warp error). Motion was measured with per-frame ECC affine registration, mask bounding boxes (white / #131313 black / orange), connected components and brute-force rotation search. Every easing named below comes from a least-squares fit against 22 standard curves.
Frame numbers are 0-based (`f0` = 0.000 s, `t = f/60`).
Data files: `data/shot_list.json` (all 102 shots), `data/frame_metrics.csv` (per-frame metrics), `data/easing_curves.json` (raw per-frame curves), `data/audio_hits.json`. Charts: `pacing.png`, `audio_overview.png`. Contact sheets: `sheets/01…10` (annotated, 60 fps strips).

---

## 1. Summary — 10 key learnings (with numbers)

1. **One anchor point rules the whole film.** An orange dot Ø33–34 px (3.1 % of width) sits at **(540, 940)**, 20 px above the true centre, in ≥ 20 separate segments. Almost every shape (circle, asterisks, 3D object, spiral end, "Keep thinking." period, final asterisk) grows out of this dot or collapses back into it. That is why 101 hard cuts feel like one continuous move.
2. **There are no dissolves or crossfades at all.** Every transition is either a hard cut (101 of them, many swapping images in place under a persistent overlay) or a **morph through the dot**: shrink to dot → dot travels → dot grows into the next thing.
3. **Pacing: median shot = 4 frames (67 ms), mean = 8.5 f.** 25 shots are 2 frames long, 55 of 102 are ≤ 4 f, and only 10 are ≥ 20 f. Image bursts alternate with text beats of about 1 s. The spiral montage accelerates **8 → 7 → 6 → 5 → 4 → 3 → 2 frames per image** (peak 15 cuts per 0.5 s at 10.0–10.5 s). The last 3.8 s slow right down (0–1 cuts per 0.5 s) to land the line and the logo.
4. **Nothing is static.** Almost every held image has a constant slow push of **+0.5 to +1.2 % per frame** (ECC median 1.0057–1.0094 ×/f). Exceptions: the busts zoom out at −0.6 %/f, the snowflakes at −2 %/f, and the end card is the only locked-off frame. The push carries across in-place swaps, so the camera feels continuous.
5. **Fast moves are exponential in scale space.** The logo exit is expo-in on log-scale. The pen-tip push-in is quad-in on log-scale: **6.1× in 8 frames**, per-frame ratio rising 1.03 → 1.51. Pops use overshoot (+6 %, settles in 4 f). Blooms use quart-out (24 f). Repositioning uses cubic in-out over 5 f. Every fast move carries one or two frames of real motion blur (directional, zoom or radial).
6. **The orange stroke is the brush.** The leading orange head (round cap, 32–34 px, the same as the dot) drags a black trail behind it: a dry-brush ring 20–23 px wide, a smooth spiral 10–12 px wide, constellation lines. A full 360° ring draws in **5–6 frames (~69°/frame, linear)**. The spiral is one dot drawing 767° over 138 frames across ~35 images, with speed rising linearly from 15 to 45 px/f.
7. **Text morphs reuse punctuation and dots as raw material.** In "ask" → "task", the "?" un-draws to its dot, the dot arcs over the word and grows into an orange "t", which turns black (14 f). In "draft" → "craft", proofreader marks (orange strike, caret, a handwritten "c") collapse the "d" to a dot, and the dot grows into an orange "c" that turns black (30 f). In "think" → "th / ink", the dotless ı takes the orange dot as its tittle, then the weight morphs Regular → Black in 7 f.
8. **Palette is three inks plus one tint.** Background is **#FFFFFF** (exact 255). Ink and type are **#131313**. Orange is **#CF6E58** (sampled; 3D faces #DA8F7D / #BD5C44). The only grey tints are the zoetrope disc #EFF0F2 and the 3D contact shadow, darkest #EDEEF1. Images are 100 % neutral grey (chroma median 0) cut out onto white paper. There are four **2-frame invert flashes** (bg #131313, orange untouched) at 1.167, 4.367, 9.100 and 10.683 s.
9. **Sound is foley-driven, not a beat track.** There are about 137 onset peaks (5–15 per second), no steady drum, and only a weak ~109 BPM pulse. Transients land **+41 ms (≈2.5 f) after the picture cut** on average: 75 % of cuts have a high-frequency hit 20–80 ms later, against 47 % for random times. Bass thumps mark chapter starts (0.56, 1.23, 1.76, 3.19, 6.39, 10.81 s). Near-silence (−40 dB) under the typing and painting is followed by a **D add9 chord at 12.795 s (f768)**, exactly when the painted asterisk turns into the logo asterisk.
10. **The end lockup is built in 30 frames and held for 71.** The asterisk spins, shrinks and slides left (16 f, log-scale cubic in-out) while the wordmark wipes left → right (16 f, quad-out), the two overlapping by about 8 f. The lockup is 83 % of width: asterisk 195 px + wordmark 662 px, cap height ≈ 145 px, vertical centre y ≈ 940. It is static from f797 to f867 (1.18 s). The very first frame of the film is the same end card, so the spot loops seamlessly.

---

## 2. Shot list (frame-exact)

"Shot" here means every hard cut, including in-place image swaps under a persistent overlay and the four 2-frame inversions. W = frame width (1080 px). "push x/f" is the ECC per-frame scale (>1 = zoom in). The blur column marks visible motion blur from a real move (zoom, slide, spin), not soft source images. The full JSON is `data/shot_list.json`.

| # | in f (s) | out f (s) | dur f | content & composition | motion | transition in | blur |
|---|---|---|---|---|---|---|---|
| 1 | 0 (0.000) | 29 (0.483) | 30 | Claude lockup, 83% W, centred (y 842-1037) | hold 16f; anticipation 1.00→1.03 (f16-18); expo-in shrink to 0 (f19-26, zoom blur); blank white f27-29 | — (loop start = end card) | yes |
| 2 | 30 (0.500) | 44 (0.733) | 15 | Giant black '?' bleeding off top (58% W) + orange dot Ø211 at anchor (540,940) | hold 4f; hook un-draws 6f; dot swells +10% then launches (Ø122→stretched stroke) and becomes the head of a black dry-brush ring drawn clockwise f42-47 (~69°/f, linear) | hard cut from 3 blank frames |  |
| 3 | 45 (0.750) | 50 (0.833) | 6 | Crystal (hex) image circle-masked inside ring, ring Ø905 (84% W) | continuous push 1.0024/f; black measurement arc with end ticks draws below | image pops in under the still-drawing ring |  |
| 4 | 51 (0.850) | 54 (0.900) | 4 | Radiolarian/seed-head, orange 12-ray asterisk grows at centre (441→505 px) | push 1.002/f (continuous across swaps) | in-place image swap (ring persists) |  |
| 5 | 55 (0.917) | 57 (0.950) | 3 | Feathery sphere variant; asterisk shrinking | push 1.003/f | in-place swap |  |
| 6 | 58 (0.967) | 62 (1.033) | 5 | Sea-urchin seed head; asterisk regrows | push 1.003/f | in-place swap |  |
| 7 | 63 (1.050) | 65 (1.083) | 3 | White rose filling ring; orange collapses to Ø33 dot | push 1.004/f | in-place swap |  |
| 8 | 66 (1.100) | 69 (1.150) | 4 | Snowflake; orange 6-pt star grows from dot | push 1.006/f | in-place swap |  |
| 9 | 70 (1.167) | 71 (1.183) | 2 | INVERTED frame: bg #131313, image white, orange untouched | push 1.007/f | 2-frame invert flash |  |
| 10 | 72 (1.200) | 75 (1.250) | 4 | Radiolarian with orange satellites; small black circle draws at right | push 1.006/f | in-place swap |  |
| 11 | 76 (1.267) | 77 (1.283) | 2 | Carved rosette, orange dots | push 1.007/f | in-place swap |  |
| 12 | 78 (1.300) | 101 (1.683) | 24 | Dürer proportion figure, 69-95% W; anchor dot at navel | ring un-draws f78-83; push ~1.005/f; orange dash slides along raised arm to fingertip f90-96 | in-place swap (dot registered) |  |
| 13 | 102 (1.700) | 115 (1.917) | 14 | 'ask' bold serif 47% W, x-height 165 px, centred y≈870 | slides in ~100 px from left (expoOut, 1 blurred frame); orange stroke arcs in, lands as dot, '?' strokes on f109-113 | hard cut; orange dash carries over from previous shot | yes |
| 14 | 116 (1.933) | 124 (2.067) | 9 | Celestial map cut-in at bottom (bleeds L/R/B); small rosette pops top-left f122 | push 1.006/f; black ring drawn round a detail f119-122 | element pop-in (text persists) |  |
| 15 | 125 (2.083) | 134 (2.233) | 10 | Collage: rosette + engraving rect (top), two Leonardo polyhedra (bottom), text centre | push 1.009/f; '?' un-draws f132-134 | element swap |  |
| 16 | 135 (2.250) | 148 (2.467) | 14 | Text only 'ask.' (dot) → 'task' | dot arcs over word (comet) f136-140, lands left f141, grows into orange 't' f143-145, recolours black f146; 'ask' shifts right 154 px (5f S-curve) | elements removed |  |
| 17 | 149 (2.483) | 154 (2.567) | 6 | Dürer draughtsman engraving (rect, bleeds left) under text | push 1.006/f; black ellipse draws f151-154 | element pop-in |  |
| 18 | 155 (2.583) | 157 (2.617) | 3 | + rhinoceros cut-out beside it | push 1.005/f | element pop-in |  |
| 19 | 158 (2.633) | 167 (2.783) | 10 | Re-layout: calligraphy band bleeding top, 2 small images under text | push 1.006/f; orange dot appears by 't' | relayout cut |  |
| 20 | 168 (2.800) | 186 (3.100) | 19 | Engraving: hand writing with quill, 94% W | orange ring draws 5f (Ø280); push-in f178-185: 6.1× in 8f (log-quadIn) with zoom blur into pen-tip dot | hard cut | yes |
| 21 | 187 (3.117) | 190 (3.167) | 4 | Large snowflake 100% W, dot at pen-tip position | zoom-out 0.980/f | MATCH CUT on dot |  |
| 22 | 191 (3.183) | 193 (3.217) | 3 | Same, step-zoomed 0.61×; neighbours appear | 0.980/f | stepped-zoom jump |  |
| 23 | 194 (3.233) | 196 (3.267) | 3 | Step 0.71× | 0.980/f | stepped-zoom jump |  |
| 24 | 197 (3.283) | 218 (3.633) | 22 | 3×4 grid of snowflakes (~26% W each) | orange brush ring around centre one f199-205 → black; others shrink to dots f207-209; centre re-centres + scales 1.3× (cubicInOut 5f) | stepped-zoom jump (0.82×) |  |
| 25 | 219 (3.650) | 242 (4.033) | 24 | Zoetrope: ≈16 horse-riders on pale disc #EFF0F2 (86%→100% W), anchor dot | animated on 2s: −22° every 2f (gallop cycle); push 1.012/f constant | hard cut |  |
| 26 | 243 (4.050) | 246 (4.100) | 4 | Same rider, tiny (22% W) at centre | push 1.009/f | hard cut (scale jump) |  |
| 27 | 247 (4.117) | 251 (4.183) | 5 | Same rider, large (81% W) | push 1.009/f | hard cut (scale jump ×3.7) |  |
| 28 | 252 (4.200) | 255 (4.250) | 4 | Stubbs horse écorché 85% W; ruler bar draws | push 1.009/f | hard cut |  |
| 29 | 256 (4.267) | 258 (4.300) | 3 | Deeper muscle layer, same outline | push 1.009/f | registered swap (dissection) |  |
| 30 | 259 (4.317) | 261 (4.350) | 3 | Skeleton, same outline; ellipse at hoof | push 1.009/f | registered swap |  |
| 31 | 262 (4.367) | 263 (4.383) | 2 | INVERTED skeleton | — | 2-frame invert flash |  |
| 32 | 264 (4.400) | 266 (4.433) | 3 | Skeleton normal | push 1.008/f | back from invert |  |
| 33 | 267 (4.450) | 271 (4.517) | 5 | Écorché man reaching, 76% W | orange+black pointer line extends along arm; push 1.015/f | hard cut |  |
| 34 | 272 (4.533) | 275 (4.583) | 4 | Female marble bust 100% W, bleeds bottom | orange dash runs along top, leaving hairline rule; zoom-OUT 0.994/f | hard cut |  |
| 35 | 276 (4.600) | 281 (4.683) | 6 | Male bust; rules accumulate; stroke drops to eye | 0.994/f | registered cut (eye line) |  |
| 36 | 282 (4.700) | 285 (4.750) | 4 | Bust 3; black ellipse draws round eye | 0.994/f | registered cut |  |
| 37 | 286 (4.767) | 289 (4.817) | 4 | Bust 4 — eye under same ellipse | 0.994/f | registered cut |  |
| 38 | 290 (4.833) | 294 (4.900) | 5 | Profile bust; ellipse on eye | 0.994/f | registered cut |  |
| 39 | 295 (4.917) | 303 (5.050) | 9 | Dürer head-proportion drawing; dot at eye | 0.994/f | registered cut |  |
| 40 | 304 (5.067) | 356 (5.933) | 53 | 'draft' bold 63% W, rules persist | slide-in (blur 1f); proofreading edit d→c f306-334; rules retract f339-345; dot slides to anchor f350-354; push-in expo f354-356 with blur | hard cut; overlay rules carry over | yes |
| 41 | 357 (5.950) | 359 (5.983) | 3 | Thin orange construction: circle in square + diagonals, 68→81% W | grows 1.05/f | hard cut on anchor |  |
| 42 | 360 (6.000) | 363 (6.050) | 4 | Letter 'A' construction engraving 100% W, orange overlay → black | push 1.010/f | hard cut |  |
| 43 | 364 (6.067) | 368 (6.133) | 5 | Letter 'C' construction; arrow arc draws | push 1.009/f | hard cut |  |
| 44 | 369 (6.150) | 378 (6.300) | 10 | Thin black radial spokes from anchor (36→85% W), ticks, outlined asterisk rays sketched | grow | hard cut |  |
| 45 | 379 (6.317) | 395 (6.583) | 17 | Flat orange 12-ray asterisk 80% W | overshoot to +6% (f383) and settle (f384-387); rays retract into Ø255 disc (f388-395, sine/quad InOut 8f) | hard cut (pop) |  |
| 46 | 396 (6.600) | 424 (7.067) | 29 | Disc → extruded 3D asterisk, soft cool shadow | 3D bloom 333→943 px (quartOut 24f) rotating oblique→face-on; collapse to Ø39 dot f420-423 | morph (disc gains depth) | yes |
| 47 | 425 (7.083) | 433 (7.217) | 9 | Sculpted hands cut-out (bottom); dot at fingertip | asterisk grows ray by ray; black curved arrow draws; push 1.009/f | hard cut (dot persists at anchor) |  |
| 48 | 434 (7.233) | 441 (7.350) | 8 | Sculpted head (Rodin-like), 75% W bleeding left/bottom | asterisk shape-shifts 12-ray → rounded 6-lobe | hard cut |  |
| 49 | 442 (7.367) | 449 (7.483) | 8 | Photo: child's hands | flower-asterisk; ellipse round finger; shrinks to dot | hard cut |  |
| 50 | 450 (7.500) | 451 (7.517) | 2 | Plaster hand, angle 1 | 2f per angle; ellipse rotation arrow draws; 5-pt star grows | hard cut |  |
| 51 | 452 (7.533) | 453 (7.550) | 2 | Plaster hand, angle 2 | — | turntable step (2f) |  |
| 52 | 454 (7.567) | 455 (7.583) | 2 | Plaster hand, angle 3 | — | turntable step (2f) |  |
| 53 | 456 (7.600) | 457 (7.617) | 2 | Plaster hand, angle 4 | — | turntable step (2f) |  |
| 54 | 458 (7.633) | 466 (7.767) | 9 | Hand gripping cylinder; star on top | star shrinks to dot; bracket draws; zoom-out 0.990/f | hard cut |  |
| 55 | 467 (7.783) | 475 (7.917) | 9 | Horizontal hand at top; dot at fingertip | ruler with ticks draws below; push 1.009/f | hard cut |  |
| 56 | 476 (7.933) | 484 (8.067) | 9 | Hand with big 6-ray asterisk | asterisk shrinks to dot; push-in with blur f482-484 | hard cut | yes |
| 57 | 485 (8.083) | 496 (8.267) | 12 | Inverted star field (black specks on white) | orange comet draws constellation (black trail, orange head) | hard cut on dot |  |
| 58 | 497 (8.283) | 504 (8.400) | 8 | Moon jar (porcelain) | spiral starts: dot at top-right (962,565) begins drawing; push 0.75%/f | hard cut |  |
| 59 | 505 (8.417) | 511 (8.517) | 7 | Veiled Madonna bust; eye ellipses | spiral continues | swap under persistent spiral |  |
| 60 | 512 (8.533) | 518 (8.633) | 7 | Carved rosette | spiral | swap |  |
| 61 | 519 (8.650) | 524 (8.733) | 6 | Horse anatomy head | spiral | swap |  |
| 62 | 525 (8.750) | 530 (8.833) | 6 | Ink/smoke splash | spiral | swap |  |
| 63 | 531 (8.850) | 536 (8.933) | 6 | Cellular line drawing | spiral | swap |  |
| 64 | 537 (8.950) | 541 (9.017) | 5 | Vesalius écorché | spiral | swap |  |
| 65 | 542 (9.033) | 545 (9.083) | 4 | Crack / lightning line | spiral | swap |  |
| 66 | 546 (9.100) | 547 (9.117) | 2 | INVERTED crack | — | 2-frame invert flash |  |
| 67 | 548 (9.133) | 552 (9.200) | 5 | Vitruvian figure (callback) | spiral | swap |  |
| 68 | 553 (9.217) | 557 (9.283) | 5 | Botanical fennel | spiral | swap |  |
| 69 | 558 (9.300) | 562 (9.367) | 5 | Dürer rhinoceros page (tilted rect) | spiral | swap |  |
| 70 | 563 (9.383) | 565 (9.417) | 3 | Head strip 1 (vertical third) over rhino | strip wipe-in | strip swap |  |
| 71 | 566 (9.433) | 568 (9.467) | 3 | Head strip 2 | strip wipe-in | strip swap |  |
| 72 | 569 (9.483) | 574 (9.567) | 6 | Head triptych; 2 rules draw | — | strip swap |  |
| 73 | 575 (9.583) | 578 (9.633) | 4 | Cone-shell engraving | spiral | swap |  |
| 74 | 579 (9.650) | 582 (9.700) | 4 | Spiral ornament + big ellipse | spiral | swap |  |
| 75 | 583 (9.717) | 586 (9.767) | 4 | Armillary ring (thick) | spiral | swap |  |
| 76 | 587 (9.783) | 590 (9.833) | 4 | Celestial map (callback) | spiral | swap |  |
| 77 | 591 (9.850) | 593 (9.883) | 3 | Allium flower photo | spiral | swap |  |
| 78 | 594 (9.900) | 596 (9.933) | 3 | Polyhedron (callback) | spiral | swap |  |
| 79 | 597 (9.950) | 599 (9.983) | 3 | Phrenology head | spiral | swap |  |
| 80 | 600 (10.000) | 602 (10.033) | 3 | Anatomy figure | spiral | swap |  |
| 81 | 603 (10.050) | 604 (10.067) | 2 | Hands | 2f | swap |  |
| 82 | 605 (10.083) | 606 (10.100) | 2 | Snowflake | 2f | swap |  |
| 83 | 607 (10.117) | 608 (10.133) | 2 | Letter A | 2f | swap |  |
| 84 | 609 (10.150) | 610 (10.167) | 2 | Bust | 2f | swap |  |
| 85 | 611 (10.183) | 612 (10.200) | 2 | Horse+rider | 2f | swap |  |
| 86 | 613 (10.217) | 614 (10.233) | 2 | Skeleton | 2f | swap |  |
| 87 | 615 (10.250) | 616 (10.267) | 2 | Sunflower | 2f | swap |  |
| 88 | 617 (10.283) | 618 (10.300) | 2 | Bust | 2f | swap |  |
| 89 | 619 (10.317) | 620 (10.333) | 2 | Fist | 2f | swap |  |
| 90 | 621 (10.350) | 622 (10.367) | 2 | Arm + quill | 2f | swap |  |
| 91 | 623 (10.383) | 624 (10.400) | 2 | Dandelion | 2f | swap |  |
| 92 | 625 (10.417) | 626 (10.433) | 2 | Hand | 2f | swap |  |
| 93 | 627 (10.450) | 628 (10.467) | 2 | Eye | 2f | swap |  |
| 94 | 629 (10.483) | 630 (10.500) | 2 | Proportion page | 2f | swap |  |
| 95 | 631 (10.517) | 632 (10.533) | 2 | Ammonite (spiral!) | 2f | swap |  |
| 96 | 633 (10.550) | 640 (10.667) | 8 | Spiral alone | spiral un-draws into dot f633-638; thin 8-ray asterisk appears f639-640 | images drop out |  |
| 97 | 641 (10.683) | 642 (10.700) | 2 | INVERTED: solid 6-pt star | — | 2-frame invert flash |  |
| 98 | 643 (10.717) | 644 (10.733) | 2 | Rounded 6-lobe 'flower' asterisk | shrinks 290→145→65 px | hard cut |  |
| 99 | 645 (10.750) | 669 (11.150) | 25 | 'th' (slides from right) / 'ink' (from left, f648); orange dot = tittle of dotless ı; em ≈530 px, crops right edge | weight Regular→Black f654-661 (S-curve 7f, ink +87%), dot Ø69→112; collapse into dot f664-668 | hard cut (dot persists) | yes |
| 100 | 670 (11.167) | 727 (12.117) | 58 | 'Keep / thinking.' regular serif; Keep cap-h 228 px, thinking x-h 116 px; lockup 64% W | typed by orange cursor: 1 letter/frame, carriage return 2f, cursor ends as period; hold 38f with push 1.006/f; collapse into period f724-726 | morph from dot | yes |
| 101 | 728 (12.133) | 780 (13.000) | 53 | Hand-painted orange asterisk at anchor | paint-on ray by ray 33f to 703 px (65% W); pulse +2% f765; morphs to logo asterisk f762-772; spins/shrinks/moves left with radial blur f773-780 | morph from dot | yes |
| 102 | 781 (13.017) | 867 (14.450) | 87 | Final lockup 83% W: asterisk 195 px + 'Claude' 662 px, cap-h ≈145 px | wordmark wipe L→R 16f (quadOut) while asterisk lands (log-scale cubicInOut 16f); hold f797-867 (71f = 1.18 s), static | morph |  |
### Act structure (`pacing.png`)

| Act | Frames | Time | Shots | Median shot | Character |
|---|---|---|---|---|---|
| 0 Logo out | 0–29 | 0.00–0.50 | 1 | 30 f | hold, anticipation, expo shrink, 3 blank frames |
| 1 "?" → circle | 30–101 | 0.50–1.70 | 11 | 4 f | first burst: 8 in-place swaps inside the ring (2–6 f each) + 1 invert |
| 2 ask → task | 102–167 | 1.70–2.80 | 7 | 10 f | text beat with pop-in collages |
| 3 observe & measure | 168–303 | 2.80–5.07 | 20 | 4 f | push-in → match cut → stepped zoom → zoetrope → dissection → eye-line busts |
| 4 draft → craft | 304–378 | 5.07–6.32 | 5 | 5 f | text beat (53 f hold), then letter-construction burst |
| 5 3D asterisk | 379–424 | 6.32–7.08 | 2 | 23 f | object moment: flat pop → disc → 3D bloom → dot |
| 6 hands | 425–484 | 7.08–8.08 | 10 | 8 f | asterisk variants on hands, 2-f turntable |
| 7 spiral montage | 485–640 | 8.08–10.68 | 40 | 3 f | climax: one line through ~35 images, accelerating to 2 f |
| 8 think → Keep thinking. | 641–727 | 10.68–12.13 | 4 | 13.5 f | landing: weight morph, type-on |
| 9 paint → logo | 728–867 | 12.13–14.47 | 2 | 70 f | paint-on, lockup, 1.18 s hold |

---

## 3. Easing measurements (per-frame data)

The raw arrays are in `data/easing_curves.json`. "Progress" is normalised 0→1. The best fit is the lowest-RMSE curve among linear, sine, quad, cubic, quart, quint, expo, circ and back (In / Out / InOut).

| # | Move | Frames | Per-frame values | Best fit (RMSE) | Notes |
|---|---|---|---|---|---|
| E1 | **Opening logo exit**, lockup width px | f15–27 | 898, 905, 918, 925, 923, 912, 882, 821, 719, 563, 346, 38, 0 | log-scale **expoIn** (0.026) | **Anticipation** first: +3.0 % over 3 f (f16–18), 1 f hang, then accelerating shrink to 0 in 8 f with zoom blur (f23–25). 3 pure-white frames (f27–29) before the hard cut. |
| E2 | "?" dot launch | f36–42 | Ø 211, 211, 219, 231 → 122 → stretched 120×169 → ring head | — | Squash/stretch: swells +10 % over 2 f (anticipation), then pops smaller and leaves as a stretched streak along its path. |
| E3 | **Brush ring draw-on**, head angle ° | f42–47 | 1.2, 64.5, 136.2, 211.7, 284.5, 346.6 | **linear** (0.012) | ~69°/f, so 360° in ~5.2 f (87 ms). Orange head ≈ 80–150 px long, black dry-brush trail. The ring then pushes in 1.0024 → 1.0069 ×/f (accelerating) across 8 image swaps. |
| E4 | "ask" slide-in, x0 px | f101–105 | (off) → 101, 196, 203, 204 | **expoOut** (0.045) | About 100 px of travel; 92 % is covered in the first frame, which is motion-blurred. "draft" (f304), "th" (f645) and "ink" (f648) enter the same way. |
| E5 | "ask" shifts right to make room for "t", x0 | f136–142 | 166, 174, 208, 282, 314, 320, 320 | in-out S-curve, ≈ cubicInOut | 154 px in 5 f. |
| E6 | **Pen-tip push-in**, orange ring Ø px | f177–185 | 289, 297, 325, 377, 463, 605, 821, 1167, 1761 | log-scale **quadIn** (0.009) | 6.1× in 8 f. Per-frame ratios 1.028, 1.094, 1.16, 1.23, 1.31, 1.36, 1.42, 1.51. The last 4 f carry heavy zoom blur, then a match cut on the dot. |
| E7 | **Stepped zoom-out**, centre snowflake height px | f187–197 | 1038, 1022, 1008, 990, \|606, 596, 584, \|416, 408, 400, \|326 | steps | Discrete scale jumps of **0.61×, 0.71×, 0.82×** (shrinking steps, i.e. decelerating) every 3–4 f, with a continuous 0.980 ×/f drift inside each step. |
| E8 | Grid collapse + re-centre, centre y px | f206–211 | 719, 729, 781, 889, 936, 944 | **cubicInOut** (0.011) | Moves 225 px and scales 1.3× in 5 f while the 11 other grid cells shrink to points in 3 f. |
| E9 | Zoetrope | f219–242 | scale 1.012 ×/f constant; rotation −22° every 2nd frame (0° on the in-between frames) | linear (constant-ratio zoom) | Animated "on twos" (30 fps steps). The 22° step equals one rider slot (so ≈16 riders), which turns the ring into a galloping cycle (a real zoetrope effect). |
| E10 | **Flat asterisk pop**, width px | f379–387 | 864, 869, 881, 901, 915, 912, 901, 899, 903 | overshoot / spring | Appears at 96 % of final size, overshoots to **101.3 %** at f383, settles at 100 % by f386–387 (one damped oscillation). |
| E11 | Rays retract into disc, width px | f387–395 | 903, 879, 802, 687, 553, 425, 321, 263, 255 | **quadInOut / sineInOut** (0.027) | 8 f. The rays shorten while the disc core stays. |
| E12 | **3D bloom**, width px | f396–419 | 256, 333, 414, 472, 605, 693, 761, 799, 827, 855, 873, 887, 901, 911, 922, 928, 932, 935, 936, 938, 940, 942, 942, 943 | width **quartOut** (0.032); log **quintOut** (0.022) | 24 f. Rotates from oblique (centroid swings +93 px right / −76 px up at f399) to face-on by f417. Motion blur f397–403. Front-face area peaks at f407 (460 k px) as the sides show, then drops to 357 k px face-on. In-plane rotation at the end is only 0.5°/f. |
| E13 | 3D collapse, width px | f419–423 | 943, 613, 317, 139, 39 | log **sineIn/quadIn** | 4 f, about ×0.5 per frame, blurred. Ends on the Ø39 anchor dot. |
| E14 | "craft" push-in, text width px | f346–356 | 749, 753, 759, 764, 769, 775, 781, 790, 824, 913, ≥1079 | expo-in (last 3 f) | Slow 0.75 %/f drift, then accelerates (×1.04, ×1.11, ×1.18+) with blur into a hard cut. |
| E15 | **Weight morph** th/ink, black px (ink coverage) | f651–668 | 145.9k, 148.2k, 149.2k, 153.8k, 164.4k, 186.6k, 221.3k, 247.9k, 263.4k, 268.8k, 271.0k, 271.0k, then 266k, 224k, 142k, 41.7k, 2.7k, 0 | S-curve ≈ **cubicInOut**, 7 f (f654–661) | Ink +87 % (Regular → Black). The orange tittle grows in sync, Ø69 → 112 px. Then a 4-frame collapse into the dot. |
| E16 | **Painted asterisk**, width px | f726–772 | 55, 67, 76, 87, 111, 139, 161, 180, 215, 247, 273, 295, 313, 329, 346, 384, 418, 446, 470, 505, 533, 557, 579, 607, 631, 651, 667, 678, 687, 693, 699, 701, 703 … 703, **719** (f765), 709, 701, 699 | near-linear, sineInOut (0.08) | Hand-timed frame-by-frame paint, 33 f. A +2.3 % "breath" pulse at f765, then the shape morphs to the logo asterisk (f762–772). |
| E17 | **Logo asterisk lands**, size px / centre x | f772–789 | size 699, 693, 683, 661, 627, 581, 523, 453, 375, 309, 267, 231, 217, 207, 200, 197, 195, 195; x 530 → 191 | log size **cubicInOut** (0.034) | 16 f, spinning with radial blur f777–780. |
| E18 | **Wordmark wipe**, revealed width px | f780–797 | 0, 78, 163, 239, 307, 368, 421, 470, 510, 544, 574, 598, 618, 634, 647, 656, 662, 662 | **quadOut** (0.034) | Hard-edged L → R mask, 16 f, starting at f781 while the asterisk is still travelling (≈8 f overlap). |
| E19 | Spiral dot path length | f495–633 | speed 15.2 + 0.216·f px/f (linear acceleration, 15 → 45 px/f) | **sineIn** (0.059) | 4130 px path, 767° total. Image hold shrinks in step with the rising dot speed. |
| E20 | Generic holds | most shots | ECC scale 1.005–1.012 ×/f | linear in log-scale | The constant-ratio slow push that keeps everything alive. |

**Takeaways for an easing kit:**
- Entrances: expoOut, 3 f, with a 1-frame blur smear on the first frame.
- Re-layouts: cubicInOut, 5–7 f.
- Object blooms: quart/quint-out, about 24 f.
- Pops: overshoot about +1–6 % and settle in about 4 f.
- Exits and push-throughs: expo/quad-in on *log-scale*, 4–8 f, ending blurred into a hard cut.
- Draw-ons: linear (the brush head moves at constant speed).
- Ambient: a constant-ratio push of 0.5–1.2 %/f.

---

## 4. Typography & text morphs

**Typefaces (best identification).** Everything except the wordmark is Anthropic's editorial serif: a Tiempos/Copernicus-style transitional serif with bracketed serifs, ball terminals on a/k/r, and moderate contrast.
- ask / task / draft / craft: Bold–Semibold.
- Keep thinking.: Regular / Text weight.
- th / ink: a variable weight animated from Regular to Black.
- "Claude" wordmark: the custom brand serif logotype (Regular-ish weight, slightly condensed C). In the published brand assets it is a drawn logotype, not live type.
- Colour #131313 throughout. Tracking is default-tight with no letter-spacing effects. No sans-serif and no eyebrow/label text anywhere: every word on screen is a hero word.

| Word(s) | Frame | Measured size (px @1080 W) | ≈ font size (em) | Width | Position |
|---|---|---|---|---|---|
| ask (+ orange "?") | f112 | x-height 165, ascender 241 | ≈ 330 px (31 % W) | 509 px (47 %) | baseline y≈990, centred incl. "?" |
| task | f146 | x-height 185, ascender 271 | ≈ 370 px | 705 px (65 %) | baseline y≈1003 |
| draft / craft | f305 / f350 | x-height 186, ascender 271 | ≈ 370 px | 681 → 769 px (63 → 71 %) | baseline y≈903 |
| th / ink | f655 | "ink" x-height 263; "th" ascender 386 | ≈ 530 px (49 % W) | crops off the right edge | "th" right-aligned above "ink" |
| Keep / thinking. | f700 | Keep cap-height 228; thinking x-height 116 | Keep ≈ 335 px, thinking ≈ 265 px | 697 px (64 %) | baselines 913 / 1153 (240 px leading, tight); orange period Ø25 |
| Claude (wordmark) | f800 | cap-height ≈ 145 | — | 662 px (61 %) | x 325–987; asterisk 195 px at x 90–285; 40 px gap |

**Morph mechanics, frame by frame** (see sheets 02, 05, 09, 10):

- **"?" (f30–44).** A giant static "?" in black (hook bleeding off the top) with an orange dot Ø211 for 4 f. The hook **un-draws along its own skeleton** from the tail back to the stem over 6 f (f34–39). The dot swells +10 %, pops to Ø122 and streaks away (f40–41) to become the brush head of the ring (f42).
- **ask → ask? (f102–113).** "ask" slides in (E4). The orange dash that travelled up the Vitruvian arm continues as a comet across the top of frame (f102–106: x 67 → 749). It curls down, parks as a Ø33 dot at the top of the future "?" (f107–108), then the **"?" glyph strokes on from top to bottom in 5 f** (f109–113, sineInOut) in orange. The stroke width (34 px) matches the dot.
- **ask? → task (f132–146).** The "?" un-draws back down into its dot (f132–135). The dot leaves as a comet arcing over the word from right to left (f136–140). It lands left of "a" as a stub (f141–142) and **grows into an orange lowercase "t" in 3 f** (f143–145), while "ask" slides right 154 px (E5). At f146 the "t" **recolours to black in 1 frame**. Total 14 f.
- **draft → craft (f304–334), done as proofreading:**
  - f304: "draft" slides in, blurred.
  - f306–308: the orange dot from the previous shot flies in as a comet.
  - f309–311: it lands left of the "d" at the x-height.
  - f312–315: an orange **strike-through** draws across the "d" only (208 px in 4 f, 32 px thick).
  - f316–318: the stroke flicks upward like a caret.
  - f319–322: a small **handwritten black "c"** draws on above the word (about 60 px tall, thin pen).
  - f323–325: the strike retracts and the **"d" scales down to nothing in 2 f**, leaving the orange dot (f326–329).
  - f330–333: the dot grows into an **orange "c"** while "raft" closes the gap (x0 225 → 191).
  - f334: the "c" turns black.
  - f339–345: the handwritten "c" and the ruled guide lines (carried over from the bust shots) retract.
  - f350–354: the dot slides under the word to the anchor point.
  - f354–356: expo push-through.
- **Spiral → think (f633–668):**
  - f633–638: the spiral un-draws into its centre dot.
  - Asterisk roulette at 2 f per form: thin 8-ray line asterisk (f639–640) → solid 6-point star on an inverted frame (f641–642) → rounded 6-lobe "flower" (f643–644) → dot.
  - f645: "th" slides in from the right with blur; f648: "ink" slides in from the left.
  - The orange dot becomes **the tittle of a dotless ı**. "Think" is literally split into th + ink.
  - f654–661: weight morph Regular → Black (E15) with the tittle growing in sync.
  - f664–668: everything collapses into the dot.
- **Keep thinking. (f670–686) is typed by the dot.** The orange dot becomes a horizontal **cursor pill** (≈100×33 px):
  - Each frame it moves right one letter and leaves a letter behind. The letter pops in at ≈50 % scale and reaches full size the next frame.
  - "Keep" = 4 letters in 4 f (f670–673).
  - Carriage return: the cursor drops (f674) and slides back left as a long dash (f675–676).
  - "thinking" = 8 letters in 8 f (f677–684).
  - The cursor shrinks into the **orange period** (f685).
  - The line holds 38 f with a 1.006 ×/f push. Then everything **collapses into the period** (f723–726): the text shrinks toward it while the period smears (177×119 px streak) and flies to the anchor (540, 940).
- **Logo (f728–797).**
  - The anchor dot is **hand-painted** into a 12-ray organic asterisk, ray by ray on ones (33 f, E16).
  - f765: one breath pulse.
  - f762–772: the painted rays morph into the clean logo asterisk.
  - f773–788: it spins with radial blur, shrinks to 195 px and travels left (E17).
  - f781–796: "Claude" is revealed by a hard-edged left-to-right wipe (E18).
  - From f797: hold.

---

## 5. Paint-on / vector elements

**Colours (sampled from decoded frames, mode of flat areas):**

| Role | Hex | Notes |
|---|---|---|
| Background | `#FFFFFF` | exactly 255 everywhere; no paper texture, no vignette |
| Ink / type / black strokes | `#131313` (19,19,19) | image blacks bottom out at 11–18 |
| Brand orange (flat) | `#CF6E58` (207,110,88) | as displayed after H.264; the brand nominal is likely ≈ #D97757 |
| 3D asterisk faces | highlight `#DA8F7D`, shade `#BD5C44` | soft key light top-left |
| 3D contact shadow | darkest `#EDEEF1` | about 7 % below white, cool-tinted (B +4), very soft, ellipse ≈ 600 px wide |
| Zoetrope disc | `#EFF0F2` | the only flat grey fill in the film |
| Invert-flash bg | `#131313` | image goes white, orange stays orange |

**Stroke widths (px @1080 W, via distance transform and run lengths):**

| Element | Width | Character |
|---|---|---|
| Orange brush / comet head, strike, "?" glyph stroke | **32–34** (= anchor dot Ø) | flat colour, round caps, soft 1–2 px edge |
| Black brush ring (circles round images) | **20–23** | dry-brush texture: ragged edges and white bristle streaks inside, like a scanned sumi stroke |
| Orange hand-drawn ring (pen-tip shot) | 17–38 | brushy, uneven pressure |
| Spiral / constellation line | **10–12** | smooth, uniform |
| Hand annotations (handwritten c, arrows, ellipses, brackets, ruler ticks) | ≈ 4–6 | thin pen, hand-drawn wobble |
| Orange construction lines | ≈ 4 | geometric (circle-in-square, diagonals) |
| Guide rules (bust / draft shots) | **2–3** | full-width hairlines at y ≈ 500, 683, 909, 1148, 1401 (spacing grows 183 → 253) |
| Final logo asterisk | 195 px wide | 12 tapered rays |

**Draw-on mechanics:**
- **The comet head.** Every major line is drawn by a moving orange head about 80–150 px long that leaves black behind it. The orange always leads and the black always trails. The leading edge is a round cap and there is no glow.
- **Speed.** Ring: 360° in 5–6 f (linear). Strike-through: 4 f. "?" glyph: 5 f. Measurement arcs and rulers: 4–6 f. Spiral: 138 f with linear acceleration.
- **Un-draw is the reverse of draw.** The tail retracts toward the dot (the "?" hook in 6 f, the ring opening at f78–83, the spiral collapsing in 5 f). This is how marks exit; they never fade.
- **Dot behaviour.** Pops between states in 1–3 f, squash-and-stretch on launch (+10 % swell, then a streak), and grows into shapes either ray by ray or by straight scale.
- **The asterisk as a shape-shifting glyph.** It cycles through 12-ray flat → extruded 3D → thin 8-ray line → solid 6-point star → rounded 6-lobe flower → 5-point star → thick 6-ray → hand-painted organic → logo. It changes form roughly every image in the hands section.
- **The hand-painted asterisk** (f728–760) is real frame-by-frame animation on ones: flat orange, softly feathered edges, **no bristle texture**, irregular petal-shaped rays with tapered tips. The rays are added in sequence, starting with the vertical ray, then the right side clockwise, then the left. It then shape-morphs into the geometric logo asterisk (10 f).
- **The 3D asterisk** is extruded about 8–10 % of its diameter (visual estimate) with bevelled ray ends and soft diffuse shading. It blooms out of a flat disc (the disc is frame f395–396, the 3D starts f397) with motion blur, swings from oblique to face-on over 20 f, and lands with a 0.5°/f settle. It is a single object on white, with a contact shadow and no environment.
- **The spiral.** One continuous line drawn by the dot across about 35 images. Image holds go 12 (star field), 8, 7, 7, 6, 6, 6, 5, 4, 2 (invert), 5, 5, 5, 3, 3, 6, 4, 4, 4, 4, 3, 3, 3, 3, then 15 images × 2 f, then 8 f of spiral alone. The line stays fixed on screen while each image underneath has its own slow push.

---

## 6. Image treatment

- **Fully desaturated** (chroma median 0, p95 ≤ 6) and levelled so paper = pure white (255) and blacks ≈ 11–18. Midtones are kept rich (p50 grey 120–190). Sources mix engravings (Dürer, Vesalius, Stubbs, Pacioli letter constructions, celestial maps), plaster and marble sculpture photos, macro nature photos (snowflakes, seed heads, allium, ammonite) and a few modern photos (child's hands, eye, moon jar).
- **Cut-outs on white** for objects (sculptures, hands, horses, flowers, busts). **Rectangles** are kept only for full engraved plates (draughtsman, rhino page tilted a few degrees, celestial map, proportion page), and since their paper is white too, the edges nearly vanish. Images inside the ring are **circle-masked**.
- **Scale.** Hero images are 75–100 % of width, often **bleeding off one or two edges** (busts bleed off the bottom, the map off three sides). Collage images are small, 15–25 % W (f116–167). The grid cells are about 26 % W (3 × 4). The tiny-rider jump cut is 22 % W → 81 % W (×3.7).
- **Several at once:**
  - text + 2–3 small images placed around it (top band, bottom pair);
  - a 3 × 4 grid that collapses to one cell;
  - a vertical-strip triptych of three heads wiping in left to right at 3 f per strip;
  - a crowded zoetrope ring.
- **Registration across cuts.** Images are aligned on the anchor dot, or on a feature: the eye line across 6 busts (persistent ellipse + rules), the horse outline across 3 dissection layers, and the pen tip → snowflake centre match cut.
- **Flash cadence.** In-ring swaps every 2–6 f. Busts every 4–6 f. Turntable 4 angles × 2 f. Spiral climax 2 f. The **invert flash** is always exactly 2 f.
- **White space.** Only 5–30 % of pixels are non-white in image shots. The frame always reads as a white page with one subject.

---

## 7. Audio & sync

`audio_overview.png` shows the spectrogram, RMS, band energies and spectral centroid with the cut lines. `data/audio_hits.json` lists 137 onset peaks with their nearest cut.

- **Palette.** Dense, bright **foley/SFX design** (spectral centroid ≈ 4.7 kHz average): pencil and brush scratches, paper, clicks, ticks, short whooshes on the push-ins (centroid spike to about 10 kHz at 5.7 s before the craft push-through), and tuned **pings** (D6 = 1175 Hz at about 0.9 s; 2.5–3.6 kHz glints at about 2.0 s). There are **low thumps** (30–150 Hz) at chapter starts: 0.563 s ("?"), 1.227 s (ring/invert), 1.757 s ("ask"), 3.192 s (snowflake match cut), 6.392 s (flat asterisk pop), 10.805 s (th/ink).
- **Ending:**
  - typing clicks (11.2–11.4 s, about −20 to −26 dBFS RMS);
  - near-silence (−45 dB) at 11.5–11.7 s;
  - a rising whistle **riser** (≈ A♯6 → C♯7/D7, 11.6–12.3 s);
  - a second dip (−40 dB, 12.2–12.7 s) under the paint-on;
  - a bright **D add9 chord** (D3 D4 A4 D5 E5 F♯5 A5 D6 E6 A6 D7) at **12.795 s = f768**, exactly as the painted asterisk becomes the logo asterisk, sustaining under the lockup and fading 13.6 → 14.5 s.
  - The key is consistent: the early pings are D too.
- **Tempo.** No kick or snare grid. The tracker reports ≈ 109 BPM (0.55 s), but onset autocorrelation is weak (r ≤ 0.09). Only 10 of 101 cuts fall within 2 f of a tracked "beat", so **the edit is not on a beat grid**; the sound is cut to picture.
- **Hit-to-cut correlation.**
  - Cross-correlating the cut impulse train with the onset envelope gives a sharp peak at **+41 ms** (high-passed envelope, z = 3.7) to +50 ms (spectral flux), meaning audio follows picture by about 2.5–3 f.
  - 75 % of cuts have an HF transient 20–80 ms after them, against 47 % for random times.
  - Within ±30 ms the figure is 57 %, about the same as chance at this onset density (≈ 7.4 per second).
  - The strongest hits split into two clusters: **0 ms** (f45, f58, f149, f262, f360, f597) and **+48–52 ms** (f30, f379, f425, f434, f467, f485, f505, f670).
- **Loudness.** −14.3 LUFS integrated, LRA 1.8 LU, peak −0.5 dBFS. Busy section (0.5–10.7 s) about −19.5 dBFS RMS.

---

## 8. Pacing

See `pacing.png` (top: every shot's length on a log scale; bottom: cuts per 0.5 s).
- Cuts per 0.5 s across the film: 0, 5, 6, 2, 3, 3, 4, 1, **8**, 6, 1, 1, 4, 1, 3, 7, 3, 5, **8**, 7, **15**, 5, 1, 0, 1, 0, 1, 0, 0.
- **Three accelerations:**
  - 0.5–1.4 s: ring swaps;
  - 4.0–5.0 s: zoetrope → dissection → busts;
  - 8.1–10.7 s: the spiral, a deliberate accelerando from 8 f to 2 f.
- **Holds between bursts:** text beats of 0.9–1.0 s (ask/task 1.10 s total; draft/craft 0.88 s for "draft" alone; Keep thinking 0.97 s) and the 3D object (0.76 s).
- **Landing.** After 10.7 s, cuts nearly stop. The last 3.8 s are three continuous morphs (th/ink → type-on → paint → lockup) plus a 1.18 s static hold. The film earns its slow ending by being dense before it.
- Text first appears at **1.70 s**. The logo is fully resolved at **13.28 s** (f797). The total story runtime before the hold is 13.3 s.

---

## 9. Techniques worth borrowing (re-skinned for Solaro)

1. **A persistent anchor element at a fixed screen point.** For Solaro, the **ring** from the mark (or a Ø≈34 px orange dot) at (540, 940): the spark, the filament glow, the sun, the dot that becomes the logo. Register every image to it, and cut *on* it.
2. **The comet stroke.** A hot orange head leading a black line. Reads naturally as **current, a fuse, a wire, a spark trail**. Use one continuous line that crosses the whole evolution montage (flint spark → fire → lightning → Leyden jar → Volta pile → Faraday → dynamo → bulb → pylons → sun → panels). Keep holds accelerating 8 → 2 f while the head speeds up linearly.
3. **Morph through the dot, never dissolve.** Shrink to point (expo/quad-in on log-scale, 4–8 f, blurred) → hard cut → grow from point (expo/quart-out).
4. **Stepped zoom** (0.6–0.8× jumps every 3 f) for "zooming out" from a solar cell → panel → roof → town grid → Earth/sun (NASA imagery), or the reverse.
5. **Registered "dissection" swaps.** The same outline in successive layers, 3–4 f each: a PV panel photo → exploded layer diagram → cell macro → circuit line drawing; or a bulb photo → patent drawing → filament macro.
6. **Punctuation and letter morphs.** A glyph dissolves into the dot, the dot flies, the dot grows into the replacement letter (orange first, then a 1-frame snap to black). Candidate swaps: **fire → wire** (f → w), **night → light**, **spark → park/stark**, **power → tower**, **sun ↔ solar**, **watt ↔ what**, **Volta → volt**. Also a variable-weight morph (Regular → Black in 7 f) for an emphasis word, and a dot-cursor type-on (1 letter per frame) for the end line, with the cursor becoming the period that the film then collapses into.
7. **Overshoot pops** (+1–6 %, 4 f settle), **3-frame expoOut entrances with a 1-frame blur smear**, and a **constant 0.5–1.2 %/f push on every hold**.
8. **One clean 3D object moment** (about 0.75 s): the Solaro mark, or a PV cell, extruded, blooming from a flat disc (quart-out 24 f), with a soft cool contact shadow, landing face-on.
9. **Two-frame invert flashes** (3–4 per film) as accents on big hits, e.g. lightning, the arc flash, the "switch on".
10. **Sound cut to picture.** Transients 0–3 f after the cut, bass thumps only on chapter starts, near-silence before the logo, and a single bright major chord exactly when the final mark resolves. The hold on the end card is about 1.2 s.

## 10. What a different design should change (so it does not read as a copy)

- **Colour.** Replace the dusty terracotta #CF6E58 with Solaro's hot **#FF5E2B → #FF3D00 gradient**, which is much more saturated. Allow it as **large fills** (a sun disc, full-bleed orange wipe frames); the reference never fills more than about 25 % of the frame with orange. Keep black #131313-ish and pure #FFFFFF; avoid the beige/greige tints entirely.
- **Type.** Not a book serif. Use a heavy geometric sans that matches the Solaro wordmark (repo `fonts/`: Lexend / Poppins). Design the morphs around sans geometry: circles of "o"/"e" becoming the ring of the mark, an "i" tittle becoming the sun. Do not reuse ask/task, draft/craft or th/ink.
- **Marks.** Replace the hand-painted asterisk and dry-brush rings with **clean, perfect vector geometry** derived from the Solaro mark (ring, quarter-round squares, teardrop pin): perfect circles, round caps, constant widths. The user asked for "clean and perfect", so drop the bristle textures and handwritten scribbles; use precise construction lines, arrows and dimension marks instead.
- **Ending.** Assemble the Solaro mark from its **4 shapes** (ring, two quarter-squares, pin), e.g. the four shapes fly in from the montage or the sun splits into them. Do not wipe in a left-aligned lockup the way the Claude end card does. Hold about 1.0–1.2 s.
- **Imagery.** Shift from Renaissance-scholar engravings to an **electricity story**: flint and fire, lightning photography, Leyden jars, the Volta pile, Faraday's disc, Tesla coils, Edison bulb patents, pylons and the grid, NASA sun (SDO), modern PV panels and roof installs. Still B&W cut-outs, but more modern photography and more industrial geometry (pylons, panels as grids, which suits the 3 × 4 grid trick).
- **Motifs.** Replace the spiral with a **current line / sine wave / cable** (or a sun-ray burst), the zoetrope with a **turbine/dynamo spin**, and the anatomy dissections with a **bulb or panel teardown**.
- **Sound.** Electric palette instead of pencil foley: flint strike, crackle, arc zap, relay click, **50 Hz hum** (the European grid), switch clunk, a sunrise swell; end on a warm, bright major chord.
- **Pacing.** Keep the dense-then-landing shape, but finish closer to 15 s: about 1 s more room for the logo build and the Solaro name.

## Appendix — file index

- `research/reference/sheets/01_open_logo_question_circle.jpg`: f14–59, logo anticipation and exit, "?" un-draw, dot launch, brush ring, in-ring swaps.
- `02_ask_to_task.jpg`: f100–147, "?" stroke-on and un-draw, comet, orange "t".
- `03_pushin_stepped_zoom.jpg`: f168–221, ring draw, log-quad push-in, match cut on dot, stepped zoom, grid collapse, zoetrope.
- `04_bust_eyeline_series.jpg`: f262–305, dissection layers, invert flash, eye-registered busts under persistent rules.
- `05_draft_to_craft.jpg`: f304–359, proofreading morph and push-through.
- `06_asterisk_flat_to_3d.jpg`: f376–427, overshoot pop, retract to disc, 3D bloom, collapse.
- `07_hands_asterisk_variants.jpg`: f425–486, hands, asterisk shape-shifts, 2 f turntable.
- `08_spiral_montage_firstframes.jpg`: first frame of each image in the spiral, labelled with hold length.
- `09_think_to_keep_thinking.jpg`: f633–689, asterisk roulette, th/ink, weight morph, dot type-on.
- `10_paint_asterisk_to_logo.jpg`: f720–802, collapse into the period, paint-on, logo lockup.
- `pacing.png`, `audio_overview.png`, `data/*.json|csv`.
- Frames (git-ignored): `research/reference/frames/f0001.jpg…f0868.jpg` (ffmpeg numbering = frame index + 1) and `frames/full/*.png`. Audio: `assets/raw/reference-audio.wav` (git-ignored).
