# ERA 1: First spark & fire (`spark-fire`)

Folder: `assets/raw/spark-fire/` (40 images + 2 GLB 3D models in `3d/`), credits in `assets/raw/spark-fire/credits.json`.
Contact sheets: `research/sourcing/spark-fire-contact-1.jpg`, `research/sourcing/spark-fire-contact-2.jpg`.

Every file was opened and verified with Pillow, and its pixel size is recorded both here and in `credits.json`. Files are saved as JPEG q95 at the largest available rendition, except the 3D renders, which are PNGs with alpha. Licenses used: CC0, PD/PDM, US-Government PD, NASA PD, CC BY 4.0 and CC BY 2.0. Nothing is NC, ND or SA.

## Top 8 picks (★)

1. **flint-nodule-kulturparken**: a real raw flint nodule on white at 4000 px. It works as the first of the two striking stones and cuts out easily.
2. **flint-nodule-3d-render-b-zenodo.png + `3d/*.glb`**: a photogrammetry flint chunk (black glassy flint with a chalk cortex) delivered as a transparent PNG. The GLB lets the opening strike be animated in clean 3D with any angle or rotation.
3. **engraving-strike-a-light-stones-hough1890**: an 1890 engraving of five fire-striking stones, including a round pyrite nodule. It gives the opening "two stones" in the same engraving language as the rest of the spot.
4. **hooke-sparks-flint-steel-micrographia-wellcome**: Hooke (1665) put flint-and-steel sparks under a microscope and drew them as tiny spheres (Schem. V, Fig. 1, A–F; checked against the Observ. VIII text). That gives a spark → sphere → sun match that is also historically true.
5. **candle-flame-1g-vs-microgravity-nasa**: a teardrop candle flame next to a spherical microgravity flame. The flame → circle/sun morph is already in one frame.
6. **handaxe-teardrop-acheulean-met**: a pale teardrop biface whose shape matches the Solaro pin/teardrop.
7. **oil-lamp-roman-sunrays-met**: a top-down Roman lamp whose discus has a radiating rosette that reads as a sun. Lamp, circle and sun in one object.
8. **prometheus-torch-to-sun-met**: Prometheus lights his torch at the sun (1756 engraving), the story link from fire forward to the sun.

Strong runners-up: flint-core-met, aten-rays-hands-relief-met, hand-of-god-rodin-met, fire-steel-oval-kulturparken, engraving-bow-drill-hough1890, handaxes-nine-bifaces-met, torch-bearing-arm-met, cave-hand-stencils-gillow-flickr.

Treatment key: **cutout** = object on plain ground, mask it onto white. **engraving-clean** = level the paper to #FFFFFF and keep the black line. **card** = keep as a rectangular image. **texture** = use as overlay or pattern.

## Full table

| ★ | File (`spark-fire-…`) | Subject | Size px | License | Why useful | Treatment | Match-cut ideas |
|---|---|---|---|---|---|---|---|
| ★ | flint-nodule-kulturparken.jpg | Raw flint nodule (Kulturparken Småland M17000:2075) | 4000×2797 | CC BY 4.0 | Genuine raw flint stone on white, translucent grey flint plus cortex | cutout → B&W | Stone A in the opening strike; it rotates into the Solaro teardrop |
| ★ | flint-nodule-3d-render-b-zenodo.png | 3D flint chunk (model 0373), black flint face | 2225×1488 | CC BY 4.0 | Alpha PNG with a perfect edge; any angle is available from the GLB | cutout (already) | Stone B. Strike against the nodule, emit an orange spark, cut to Hooke's globules |
|  | flint-nodule-3d-render-a-zenodo.png | 3D flint nodule (model 0370), rounded cortex pebble | 2655×2269 | CC BY 4.0 | A rounder "pebble" option for the second stone | cutout (already) | Rounded stone → ring of the Solaro mark |
|  | flint-nodule-3d-render-c-zenodo.png | 3D flint chunk (model 0373), side view | 2646×1465 | CC BY 4.0 | Alternate angle of the same stone for a two-frame strike | cutout (already) | Pair with render-b for the impact frames |
|  | 3d/3d-flint-nodule-0370/0373-zenodo.glb | glTF 2.0 photogrammetry models (Draco, ~1.5M verts, textured) | 23 MB each | CC BY 4.0 | Clean 3D for the opening, which can be lit on white | 3D | Two stones collide in 3D, then the spark |
|  | flint-core-met.jpg | Knapped flint core, Predynastic Egypt | 2667×4000 | CC0 (Met) | Ovate flint stone on white, high resolution | cutout | Second striking stone; its oval reads as a pin/drop |
| ★ | engraving-strike-a-light-stones-hough1890.jpg | Strike-a-light flints and pyrites (Hough 1890, Fig. 44) | 1930×2290 | PD (US Gov) | Engraved striking stones, including a round pyrite nodule | engraving-clean | Round pyrite → spark globule → sun; can be split into 5 single stones |
|  | engraving-flint-and-steel-ring-hough1890.jpg | Flint + oval ring steel (Fig. 51) | 1510×1170 | PD (US Gov) | The literal flint-and-steel pair as line art | engraving-clean | Ring steel → Solaro ring; paint the orange arc of the strike |
|  | engraving-bow-drill-hough1890.jpg | Inuit bow drill with mouthpiece (Pl. LXXVI) | 2150×2020 | PD (US Gov) | Very clean geometric line art; the bow string and spindle give a crisp diagram | engraving-clean | Paint orange friction heat at the tip; spindle → filament/lightning rod |
|  | engraving-fire-drill-people-hough1890.jpg | Taveita Africans making fire with a hand drill (Fig. 20) | 1610×1180 | PD (US Gov) | Human hands making fire, a gesture shot | engraving-clean / card | Hands twirling → hands on the next era's crank/dynamo |
|  | engraving-tinderbox-hough1890.jpg | English tinderbox with flint, steel and spunks (Fig. 48) | 2090×1000 | PD (US Gov) | Round box from above, plus flint, steel and matches | engraving-clean | Round lid → ring; matches → filaments |
|  | fire-pistons-hough1928.jpg | Fire pistons, Malaysia (Proc. USNM 1928, Pl. 11) | 1540×1900 | PD (US Gov) | The only fire-piston image found; halftone on white | cutout (each piston) | Piston → syringe → battery/cylinder |
|  | bow-drill-madagascar-wellcome.jpg | Two people using a string/bow drill, West Madagascar | 4015×2629 | CC BY 4.0 | Clean line illustration on white at high resolution | engraving-clean | Two figures + drill as a centred "first fire" scene |
|  | fire-steel-oval-kulturparken.jpg | Oval iron fire steel (M17001:1853) | 4000×2738 | CC BY 4.0 | Closed-ring strike-a-light on white, large | cutout | Ring → Solaro ring / sun disc |
|  | fire-steel-with-flint-badisches.jpg | Horned fire steel + flint (Badisches Landesmuseum) | 1336×749 | CC0 | Flint and steel photographed together | cutout | Horned steel → crescent → sun-rise arc |
|  | flint-striker-islamic-met.jpg | Ornate C-shaped flint striker, 17th–18th c. | 1200×828 | CC0 (Met) | Elegant silhouette (minimum size) | cutout | C-curve → quarter-rounded square corner |
|  | tinderbox-met.jpg | Two round tin tinderboxes with candle sockets | 2626×2002 | CC0 (Met) | Archival B&W on white, already monochrome | cutout | Cylinders → battery cells |
| ★ | handaxe-teardrop-acheulean-met.jpg | Acheulean biface, pale teardrop | 2805×4000 | CC0 (Met) | Strong teardrop shape on grey | cutout | Hand axe → Solaro teardrop/pin → candle flame |
|  | handaxe-red-acheulean-met.jpg | Acheulean biface, red-brown flame shape | 3109×4000 | CC0 (Met) | Leaf/flame silhouette | cutout | Hand axe → flame → bulb |
|  | handaxes-nine-bifaces-met.jpg | Nine Acheulean bifaces on stands | 4000×2564 | CC0 (Met) | Ready-made group for a grid, or cut out each one | cutout / grid | 9-up grid that flips into 9 solar cells |
|  | handaxe-egypt-met.jpg | Lower Paleolithic ovate hand axe, Egypt | 2667×4000 | CC0 (Met) | Brown ovate on white | cutout | Oval → sun disc |
|  | handaxe-paleolithic-cleveland.jpg | Paleolithic hand axe (CMA 1915.41) | 3400×2206 | CC0 (Cleveland) | Golden flint, side-on | cutout | Grid filler |
| ★ | hooke-sparks-flint-steel-micrographia-wellcome.jpg | Hooke, *Micrographia* 1665, Schem. V (Fig. 1: sparks from flint and steel) | 4842×7376 | CC BY 4.0 | Scientific engraving of sparks as spheres. Crop Fig. 1 (upper left) | engraving-clean (crop) | Spark globule → star → sun; hollow spark D → ring |
| ★ | candle-flame-1g-vs-microgravity-nasa.jpg | Candle flame in 1g vs microgravity (GRC-1998-C-00485) | 2500×2000 | PD (NASA) | Teardrop flame next to spherical flame | texture / card (invert or knock out black) | Flame teardrop → circle → sun; split the two halves |
| ★ | oil-lamp-roman-sunrays-met.jpg | Roman/Cypriot terracotta lamp, radiating rosette on discus | 3379×4000 | CC0 (Met) | Top-down circle with rays | cutout | Lamp discus → sun with rays → solar panel |
|  | oil-lamp-roman-face-met.jpg | Roman terracotta lamp, face/bust on discus | 3809×4000 | CC0 (Met) | Top-down, very clean (the figure is not identified in the record) | cutout | Face in disc → sun face |
|  | oil-lamp-roman-plain-met.jpg | Roman terracotta lamp, late Imperial | 4000×3822 | CC0 (Met) | Circle-plus-nozzle silhouette, close to the Solaro pin | cutout | Lamp → pin shape → light bulb |
|  | oil-lamp-bronze-roman-cleveland.jpg | Roman bronze oil lamp, side view (CMA 2023.104) | 3400×2797 | CC0 (Cleveland) | Classic "Aladdin lamp" silhouette | cutout | Wick flame → bulb filament |
|  | lantern-pierced-tin-met.jpg | Pierced tin lantern, ca. 1825 | 1743×2587 | CC0 (Met) | Dark silhouette; the pierced pattern reads like a dot grid | cutout | Perforations → solar-cell grid / LED matrix |
|  | torch-bearing-arm-met.jpg | Bronze torch-bearing arm (sconce), 16th c.? | 4000×2984 | CC0 (Met) | A sculpted hand gripping a torch socket | cutout | Add an orange flame vector; the arm hands the torch to the next era |
|  | ignis-fire-element-met.jpg | "Fire" from *The Elements*, J. J. Preissler 1735 | 3531×2965 | CC0 (Met) | Engraved flames in a brazier held aloft, a fine line engraving | engraving-clean | Engraved flame → orange painted flame |
| ★ | prometheus-torch-to-sun-met.jpg | Minerva assisting Prometheus, B. Crivellari 1756 | 1689×3656 | CC0 (Met) | Torch reaching up to the sun's rays; tall vertical format | engraving-clean / card | Torch tip → sun → Solaro mark |
|  | prometheus-cort-1566-wellcome.jpg | Prometheus bound, Cornelis Cort after Titian 1566 | 2392×3208 | PDM | Dramatic, iconic engraving | engraving-clean / card | Fast cut card |
|  | prometheus-1558-met.jpg | Prometheus, Sebastiano de' Valentinis 1558 | 2483×3563 | CC0 (Met) | Engraving of Prometheus with the eagle | engraving-clean / card | Alternate Prometheus |
|  | aten-rays-hands-relief-met.jpg | Amarna relief: Aten rays ending in hands reach the queen | 4000×2709 | CC0 (Met) | Sun rays and hands in one relief | cutout / card | Rays with hands → orange sun rays → solar beams |
|  | apollo-sun-goltzius-met.jpg | Apollo with radiant sun halo, H. Goltzius 1588 | 1348×1832 | CC0 (Met) | Oval engraving with a sun halo (lower resolution) | engraving-clean | Halo → sun ring → Solaro ring |
|  | hand-of-god-rodin-met.jpg | Rodin, *The Hand of God* (marble) | 3318×3845 | CC0 (Met) | White marble hand creating from stone | cutout | Hand emerging from stone → hand holding a solar cell |
|  | hand-reaching-cast-met.jpg | Rodin, Study of a hand (plaster) | 3929×2940 | CC0 (Met) | White reaching hand on grey | cutout | Reaching hand → the spark (Creation-of-Adam gap) |
|  | hand-marble-holding-met.jpg | Antique marble hand gripping a box | 4000×3000 | CC0 (Met) | Gripping hand; composite a flint into it | cutout | Hand holding stone → hand holding bulb |
|  | cave-hand-stencils-gillow-flickr.jpg | Negative hand stencils on rock (photo, Mark Gillow) | 4608×3456 | CC BY 2.0 | Two clear spread-hand stencils | card or threshold to B&W | Hand stencil → modern hand → Solaro |
|  | cave-hand-stencils-many-gillow-flickr.jpg | Wall of ochre hand stencils (photo, Mark Gillow) | 4130×3097 | CC BY 2.0 | A "crowd of hands" texture | texture / card | Many hands → many solar panels (repetition) |

## Attribution needed in the end credits or video description (CC BY)

- Kulturparken Småland (flint nodule, oval fire steel), CC BY 4.0
- Wellcome Collection (Hooke *Micrographia* plate; Madagascar bow-drill illustration), CC BY 4.0
- Jacek Lech, "Chocolate flint: 3D documentation", Zenodo (10.5281/zenodo.18961132, 10.5281/zenodo.18966653), CC BY 4.0
- Mark Gillow, "Rock Art – Hand stencils" (Flickr), CC BY 2.0

## Sources used

- The Met Open Access API (`collectionapi.metmuseum.org/public/collection/v1.1/search`; v1 search was retired on 2026-10-01).
- Cleveland Museum of Art Open Access.
- Wellcome Collection IIIF.
- Europeana, which led to Kulturparken Småland, Badisches Landesmuseum and DigitaltMuseum (`dimension=max` gives up to 4000 px).
- Internet Archive: Walter Hough, *Fire-making apparatus in the U.S. National Museum*, 1890 and 1928 (US Government, PD). Plates were cropped from the jp2 page scans.
- NASA Images.
- Openverse, used to find the Flickr photos; their CC BY 2.0 license was re-confirmed on each Flickr page.
- Zenodo, for the 3D models.

## Gaps and notes

- **Smithsonian Open Access** returned 429 OVER_RATE_LIMIT for the shared DEMO_KEY for the whole session, and **Wikimedia** also returned 429. Hough's USNM plates stand in for the Smithsonian's fire-making collection. A personal api.data.gov key would open up NMNH/NMAH strike-a-lights and fire pistons in better resolution.
- **Cave art and hand stencils:** I found no clean B&W engraving I could use. Breuil's Altamira and Font-de-Gaume copies are still in copyright in the EU (Breuil died in 1961), so I skipped them. Only two colour Flickr photos are kept (CC BY 2.0). A Cueva de las Manos photo was dropped because it was only 1024 px.
- **Flames, campfire, sparks:** I found no clean campfire engraving and no free "sparks on black" photo (Unsplash, Pexels and Pixabay are blocked). Flames are covered by the NASA candle, the Ignis engraving and the torch arm. Sparks are best drawn as orange vectors, with Hooke's globules as the historical anchor.
- **Helios coin:** none found. The sun-link role is covered by the Goltzius Apollo, the Aten relief, the sun-rosette lamp and Prometheus reaching the sun.
- **Smaller files:** two items sit near the 1200 px floor: flint-striker-islamic (1200 px) and fire-steel-with-flint-badisches (1336 px).
- **Dropped:** I dropped three Kulturparken and Met flints that were only 600–800 px, plus an Aten-ray fragment and the Upplands fire steel, which were weaker. They were removed from the folder and from `credits.json`.
- **3D renders:** stills made with three.js r160 (SwiftShader) from the CC BY GLBs. The texture is soft at 100% crop but fine at on-screen size, and it can be re-rendered at any angle.
