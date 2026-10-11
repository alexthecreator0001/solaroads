export const meta = {
  name: 'solaro-storyboard-panel',
  description: 'Three independent frame-accurate storyboards for the Solaro ad, scored by three judges',
  phases: [
    { title: 'Boards', detail: '3 storyboard writers with different creative angles' },
    { title: 'Judge', detail: '3 judges (message, craft, feasibility) score all boards' },
  ],
}

const COMMON = `
You are a senior motion designer / art director writing a FRAME-ACCURATE storyboard for a 14.8 s vertical ad (1080x1920, 60 fps = 888 frames) for SOLARO (solaro.sk), a Slovak solar PV installer & e-shop. Brief from the client: "Make a fast-paced ad ~10-15 s (closer to 15). Bold, LIGHT MODE art reimagine. Clean and perfect: no beige 'artsy' look, no eyebrow labels. Paint elements on top of the images. Above all fast-paced and very creative. No slop. Study the reference closely (smoothness, timing, shot durations, fonts, elements); borrow techniques but the design must look like our own. Every morph has to be perfect. Ideas: clean varied logo-SVG animations, images small/bigger/several at once, morphing text, clean 3D, zooms. Show the evolution of electricity from the first stone spark to solar. End on the Solaro logo."

READ FIRST (all of them, carefully; look at the images with the Read tool):
- /home/user/solaroads/research/reference-analysis.md (+ the sheets in /home/user/solaroads/research/reference/sheets/ and pacing.png) — forensic teardown of the reference (Claude 'Keep thinking').
- /home/user/solaroads/research/brand.md (+ /home/user/solaroads/research/brand/*.png|jpg) — Solaro brand, logo geometry, typeface match (Poppins + the custom wordmark letters), client photos.
- /home/user/solaroads/research/sourcing/*.md and the contact sheets /home/user/solaroads/research/sourcing/*-contact*.jpg — the ACTUAL images we have (only use files that exist; reference them by file path under assets/raw/...). Client photos: /home/user/solaroads/research/brand/solaro-photos-contact.jpg (assets/raw/solaro/).
- /home/user/solaroads/research/storyboard-v0-seed.md — the art director's seed concept (one orange element built from the Solaro cell shapes evolves spark -> flame -> bulb -> sun -> panel grid -> mark).
- /home/user/solaroads/engine/README.md — what our renderer can do (exact cell morphs, glyph morphs, word morphs, masked images, tapered paint strokes, spark particles, camera zooms, three.js extrusions, motion blur). Prototype of the spine: /home/user/solaroads/out/spine/sheet.png.
- Working prototypes already built by the art director (look at them): /home/user/solaroads/out/proto_open-01.jpg (OPEN: lockup -> wordmark sucked into mark -> the 4 cells close their gap so the NEGATIVE SPACE forms a concave 4-point star ✦ (engine: shapes.js markCells(cx,cy,s,gap) + sparkPath) -> cells fly out -> the ✦ turns orange = the first spark -> shrinks to the anchor dot) and /home/user/solaroads/out/proto_end-01.jpg (END: 6x10 orange panel grid merges into 2x2 squares -> squares get the mark radii/holes -> gap 'breath' -> lockup, wordmark slides out from behind the mark = exactly the first frame, so the film loops). You may keep, improve or replace them.
- Extra assets: two photogrammetry 3D flint models (assets/raw/spark-fire/3d/*.glb, CC BY) that three.js can render in B&W for a real 3D stone strike; the brand study proposes 'slnko -> Solaro' (SK) and 'solar -> Solaro' (EN) morphs, and the pin cell IS the wordmark 'a', the ring IS the wordmark 'o'.
- Anchor point for the persistent orange element: (540, 940), as in the reference.

DELIVERABLE: write your storyboard to /home/user/solaroads/research/storyboards/<your-key>.md containing:
1. Concept in 3 lines + the copy (every word that appears on screen) + language choice (EN or SK, justify; you may propose both).
2. A beat map (sections with frame ranges) and the music grid you assume (BPM; where hits land).
3. A SHOT TABLE covering frames 0-888 with NO gaps: frame in/out, duration, image file(s) used (exact paths) + crop/anchor (which point of the image sits where on screen, scale as % of frame width), the orange element's state and motion, paint-on elements (lines/arcs/strokes/dots: where, width, draw-on frames), text (exact word, size px, position, how it animates/morphs letter by letter), camera (zoom factors, focal point, easing name), transition into the next shot (and why it's seamless), motion blur on/off, sound cue.
4. The 3-5 'signature moments' that make it memorable, and exactly how each morph stays geometrically perfect.
5. Risks & how you avoid slop (things you deliberately do NOT do).
Constraints: pure white #FFFFFF background (a 1-2 frame inversion is allowed as a punctuation), ink #1C1C1C, brand orange gradient #FF5E2B->#FF3D00 only as accent colour, B&W imagery only, Poppins + wordmark letters for type (heavy, lowercase), no eyebrow labels / captions / years / small text except an optional 'solaro.sk' on the end card. Median montage shot 3-6 frames, text beats 30-60 frames, logo hold >= 1.6 s. Use 60-90 images total across the film. It must be buildable by our engine in a day: prefer a few strong, reusable mechanisms over 40 one-off tricks.
Return a 15-line summary of your board (concept, copy, signature moments).`

const ANGLES = [
  { key: 'A-continuity', brief: `YOUR ANGLE — "one continuous thought": build directly on the seed. The orange element NEVER leaves the screen; every cut is a match-cut on it or a morph of it; image montages are anchored on its position (each image's hot spot under the orange element). Clarity of the evolution story at speed is your obsession. Keep the copy minimal.` },
  { key: 'B-editorial', brief: `YOUR ANGLE — "editorial graphic rhythm": a bolder, more graphic layout language than the reference: Solaro cells as image windows (photos masked by the ring / tile / leaf / pin shapes), 2x2 and larger grids of images at once, extreme scale contrast (tiny image vs. full-bleed), split layouts, stepped zooms, cell wipes as transitions. Still tell the spark->solar evolution, still end on the logo. Feel free to depart from the seed where your idea is stronger.` },
  { key: 'C-typographic', brief: `YOUR ANGLE — "typography drives the story": words and letterforms are the main transition devices. Exploit the wordmark DNA (Solaro's own letters S o l a r), letters that become objects (an i-dot spark, an o that is the sun, a flame that is a letter), word morph chains that make sense for an electricity timeline (e.g. lightning -> lighting, solar -> Solaro; and Slovak options like svet -> svetlo, solár -> Solaro), weight/scale morphs, typing with an orange cursor. Images support the words in fast bursts.` },
]

phase('Boards')
const boards = await parallel(ANGLES.map((a) => () => agent(`${COMMON}\n\n${a.brief}\nYour key: ${a.key} (file: /home/user/solaroads/research/storyboards/${a.key}.md).`, { label: `board:${a.key}`, phase: 'Boards' })))

phase('Judge')
const SCORE = {
  type: 'object',
  properties: {
    scores: { type: 'array', items: { type: 'object', properties: { board: { type: 'string' }, score: { type: 'number' }, why: { type: 'string' }, fatal_flaws: { type: 'array', items: { type: 'string' } } }, required: ['board', 'score', 'why', 'fatal_flaws'] } },
    best_ideas_to_graft: { type: 'array', items: { type: 'object', properties: { from: { type: 'string' }, idea: { type: 'string' }, frames: { type: 'string' } }, required: ['from', 'idea'] } },
    recommendation: { type: 'string' },
  },
  required: ['scores', 'best_ideas_to_graft', 'recommendation'],
}
const LENSES = [
  { key: 'message', brief: 'LENS: message & brand. Would a Slovak homeowner scrolling Instagram understand "from the first spark to the sun -> Solaro installs solar" in 15 s at this speed? Is the logo/brand present and memorable? Is the copy right (language, wording)? Does it feel premium and like Solaro, not like Claude?' },
  { key: 'craft', brief: 'LENS: motion craft vs. the reference. Compare against the reference teardown numbers (shot lengths, easing, motion blur, morph mechanics, pacing curve). Is it as smooth and as fast, with breathing room in the right places? Are the morphs geometrically sound (no blobby letter morphs, no popping)? Is it original enough (not a reskin of the reference)? Any slop (generic stock-y moves, gratuitous effects)?' },
  { key: 'feasibility', brief: 'LENS: feasibility & risk. Check every referenced asset path actually exists (ls) and suits the use (resolution, B&W, cutout-ability). Check the engine can do it (engine/README.md). Estimate build effort per mechanism; flag shots that would look cheap if executed imperfectly. Prefer boards that reuse a few mechanisms well.' },
]
const verdicts = await parallel(LENSES.map((l) => () => agent(`${COMMON.split('DELIVERABLE:')[0]}\nYou are a JUDGE. ${l.brief}\nRead all three storyboards in /home/user/solaroads/research/storyboards/ (A-continuity.md, B-editorial.md, C-typographic.md). Score each 0-10 under your lens, list fatal flaws, list the best ideas to graft into a final synthesis (with frame ranges), and recommend which board should be the backbone.`, { label: `judge:${l.key}`, phase: 'Judge', schema: SCORE })))

return { boards, verdicts }
