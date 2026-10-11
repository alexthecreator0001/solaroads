# Sourcing: ERA 4 - THE SUN & SOLAR (`sun-solar`)

Folder: `assets/raw/sun-solar/` - **64 kept files** (all verified to open; pixel sizes below), credits in `assets/raw/sun-solar/credits.json` (file, title, creator, date, source_url, license, notes, width, height, download_url).  
Contact sheets: `research/sourcing/sun-solar-contact-1.jpg`, `sun-solar-contact-2.jpg` (alphabetical).  
Solaro's own client rooftop photos (`assets/raw/solaro/`) were not duplicated; this set is historical sun imagery, sundials, sunflowers, solar machines, NASA sun/arrays, early PV and generic PV textures.

Sources used: Wellcome Collection (IIIF), Internet Archive (Trouvelot/NYPL plates, Rosa Ursina, Radford 1908), UB Freiburg (Scheiner 1612), Tekniska museet via Europeana/DigitaltMuseum, NASA Images API, Helioviewer API (SDO data), Library of Congress, Cleveland Museum of Art, The Met Open Access, Rijksmuseum Linked-Art API, Openverse -> Flickr originals, Unsplash (via Unsplash Lite dataset on Hugging Face -> images.unsplash.com).

## Top 8 picks

1. **`sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg`** (3400x3400) - Natively B&W, 3400 px, clean disc on black - the hero sun. Match-cut: Kircher/Scheiner disc -> HMI disc (same composition); disc -> Solaro ring.
2. **`sun-solar-kircher-sun-corpus-solis-plate-wellcome.jpg`** (5000x4452) - THE iconic early-modern sun engraving; 5000 px, big round disc with flaming rim. Match-cut: spark/star -> Kircher sun -> SDO HMI sun (same circle, 360 years apart); disc = Solaro ring.
3. **`sun-solar-scheiner-1612-sunspot-discs-grid-freiburg.jpg`** (3150x2698) - Ready-made GRID of suns (snowflake-grid equivalent); first published sunspot series. Match-cut: grid of sun discs -> grid of round solar cells (Tekniska) -> panel grid.
4. **`sun-solar-mouchot-solar-engine-paris-1878-tekniska.jpg`** (3543x2440) - THE first solar-power 'aha' image: giant cone mirror driving a press; 3543 px wood engraving. Match-cut: cone dish -> eclipse ring -> parabolic dish -> panel.
5. **`sun-solar-eclipse-2017-corona-nasa.jpg`** (3186x2527) - Perfect black disc + corona on black; ring motif, iconic. Match-cut: eclipse ring -> Solaro ring (direct shape match).
6. **`sun-solar-early-module-round-cells-dark-tekniska.jpg`** (3543x3543) - Perfect CIRCLE GRID, isolated object; bridges sun discs -> PV. Match-cut: Scheiner disc grid -> round-cell grid -> modern square cells.
7. **`sun-solar-iss-solar-array-sunburst-nasa.jpg`** (4288x2848) - Sun + panel in ONE frame - the thesis of the ad. Match-cut: star burst -> sun -> panel grid.
8. **`sun-solar-sunflower-head-frontal-unsplash.jpg`** (4500x3000) - Sun-face circle; heliotropism beat; 4500 px. Match-cut: sunflower -> sun disc -> Solaro ring.

Runners-up worth a look: `vanguard-model-satellite-1958-loc` (Vanguard 1 itself, B&W), `trouvelot-solar-prominences-1873-ia` (flame->prominence), `carter-white-house-solar-panels-1979-loc`, `sunflower-follows-sun-emblem-flamen-rijks` (heliotropism in one engraving), `eclipse-2017-diamond-ring-nasa` (spark-on-a-ring), `cells-window-grid-fraunhofer-flickr` (already black squares on white).

## All kept files

Treatment key: **engraving-clean** = level paper to #FFFFFF, keep line work; **cutout** = isolate object on white; **card** = keep as rectangular photo card; **texture** = full-bleed grid/surface; **invert** = black-sky astro image inverted to dark-on-white.

### Historical sun

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-kircher-sun-corpus-solis-plate-wellcome.jpg` | Kircher, Mundus Subterraneus: the Sun as a fiery, spotted globe (fold-out plate) | 5000x4452 | PDM (Wellcome Collection) | THE iconic early-modern sun engraving; 5000 px, big round disc with flaming rim | engraving-clean (crop disc off the page/fold, level paper) | spark/star -> Kircher sun -> SDO HMI sun (same circle, 360 years apart); disc = Solaro ring |
| **TOP** `sun-solar-scheiner-1612-sunspot-discs-grid-freiburg.jpg` | Scheiner 1612 plate 'Maculae in Sole apparentes' - ~37 small sun discs with spots | 3150x2698 | PDM 1.0 (Universitatsbibliothek Freiburg) | Ready-made GRID of suns (snowflake-grid equivalent); first published sunspot series | engraving-clean; cut discs out individually for an animated grid | grid of sun discs -> grid of round solar cells (Tekniska) -> panel grid |
|  `sun-solar-kircher-burning-lens-beam-wellcome.jpg` | Kircher: sunbeam focused through a burning lens onto an apparatus | 1204x1768 | PDM (Wellcome Collection) | Proto 'solar power' idea in one diagram: sun -> lens -> machine; paint the beam orange | engraving-clean; small (1204 px) - use mid-size | beam line -> power line; lens circle -> sun |
|  `sun-solar-scheiner-rosa-ursina-frontispiece-ia.jpg` | Scheiner, Rosa Ursina (1626-30) engraved frontispiece | 2952x4152 | PDM 1.0 | Iconic title page of the great sunspot book; rays, sun, bear/rose emblem | card (busy) or crop the radiant sun at top | rays -> Solaro mark burst |
|  `sun-solar-scheiner-rosa-ursina-grid-disc-ia.jpg` | Rosa Ursina: circular coordinate grid for plotting the solar disc | 2784x3888 | PDM 1.0 | Precise circle-in-grid diagram - the sun measured | engraving-clean; diagram to animate/paint | polar grid -> solar-panel cell grid; circle -> Solaro ring |
|  `sun-solar-scheiner-rosa-ursina-helioscope-ia.jpg` | Rosa Ursina: helioscope - telescope projecting the Sun onto a board | 2904x3888 | PDM 1.0 | Science apparatus diagram: telescope beam to projected disc; great for orange line paint-over | engraving-clean, crop figure from text | projected disc -> panel; beam -> cable |
|  `sun-solar-scheiner-rosa-ursina-imago-solis-xvi-ia.jpg` | Rosa Ursina 'Imago Solis XVI': sunspot tracks across the disc, 1625 | 2800x3888 | PDM 1.0 | Large engraved circle with rows of dots - sun as data | engraving-clean, crop disc | dot rows -> cell rows; circle -> ring |
|  `sun-solar-sun-sizes-from-planets-wellcome.jpg` | Diagram: the Sun as seen from each planet - shrinking discs | 1771x4135 | PDM (Wellcome Collection) | Row of circles of decreasing size on black - ready-made zoom/scale gag | card or cut out discs (invert) | shrinking circles -> zoom into Solaro ring |
|  `sun-solar-sunspot-course-disc-engraving-wellcome.jpg` | Engraving: 'The course of the solar maculae over the sun's disk' | 2445x2769 | PDM (Wellcome Collection) | Clean circle with spot rows on a crosshair - diagram feel | engraving-clean | disc+crosshair -> Solaro ring; dots -> cells |
|  `sun-solar-sunspot-langley-closeup-wellcome.jpg` | Process print after Langley: a typical sunspot (granulation) | 1866x3102 | PDM (Wellcome Collection) | Organic granular texture of the solar surface | texture (B&W) | sun granulation -> macro sunflower florets -> cell texture |
|  `sun-solar-tarocchi-genius-of-the-sun-engraving-cma.jpg` | Tarocchi engraving c.1465: Genius holds up a radiant sun | 2502x3400 | CC0 1.0 (Cleveland Museum of Art Open Access) | HAND HOLDING THE SUN - gesture shot in fine line engraving | engraving-clean, cutout figure | hand holding sun -> hand holding solar cell/panel |
|  `sun-solar-trouvelot-solar-prominences-1873-ia.jpg` | Trouvelot: solar protuberances (prominences), 5 May 1873 | 4709x5133 | Public Domain (PDM 1.0; originally NYPL public-domain scan) | Flame-like prominences on red - converts to dramatic white flames on black | B&W invert/level; texture/card | flame (fire era) -> solar prominence (match-cut!) |
|  `sun-solar-trouvelot-sunspots-1875-ia.jpg` | Trouvelot: group of sunspots and veiled spots, 17 Jun 1875 (pastel chromolithograph) | 5133x4944 | Public Domain (PDM 1.0; originally NYPL public-domain scan) | NYPL's famous Trouvelot plate; swirling texture, very high res (5133 px) | convert to B&W; crop the spot group as texture/card | sunspot swirl -> flame -> filament |
|  `sun-solar-trouvelot-total-eclipse-1878-ia.jpg` | Trouvelot: total eclipse of 29 Jul 1878, Wyoming | 4943x4583 | Public Domain (PDM 1.0; originally NYPL public-domain scan) | Black disc + radiating corona rays - iconic ring | B&W; cutout disc+corona onto white (invert) | ring -> Solaro ring; eclipse -> bulb filament |

### Solar machines

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-mouchot-solar-engine-paris-1878-tekniska.jpg` | Mouchot-Pifre solar engine at Paris 1878 (Le Monde Illustre engraving) | 3543x2440 | PDM 1.0 | THE first solar-power 'aha' image: giant cone mirror driving a press; 3543 px wood engraving | engraving-clean; card or cut out the dish | cone dish -> eclipse ring -> parabolic dish -> panel |
|  `sun-solar-burning-mirrors-engraving-wellcome.jpg` | Engraving: Archimedes-style faceted burning mirror + concave mirror with sun rays | 2300x2922 | PDM (Wellcome Collection) | Faceted mirror looks like a solar panel grid; ray lines to paint orange | engraving-clean | faceted mirror grid -> PV panel grid |
|  `sun-solar-tracking-burning-glass-engraving-wellcome.jpg` | Engraving: sun-tracking burning glass (lens on gimbal) | 2350x3037 | PDM (Wellcome Collection) | Proto solar tracker; precise apparatus | engraving-clean cutout | lens circle -> sun; tracking -> sunflower heliotropism |

### Sundials

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
|  `sun-solar-butterfield-sundial-object-cma.jpg` | Butterfield pocket sundial (France, 1700s), octagon | 3400x3093 | CC0 1.0 (Cleveland Museum of Art Open Access) | Isolated silver object on grey - hero cutout | cutout | octagon dial -> clock -> sun |
|  `sun-solar-sundial-horizontal-gnomon-1793-met.jpg` | Horizontal garden sundial with gnomon, 1793 | 4000x4000 | CC0 1.0 | Disc + triangle silhouette on plain bg, 4000 px | cutout | gnomon shadow -> clock hand -> panel tilt |
|  `sun-solar-sundial-ivory-diptych-1598-met.jpg` | Ivory diptych pocket sundial, 1598 | 1920x1812 | CC0 1.0 | Delicate object for a sundial grid | cutout / grid tile | open diptych -> laptop/panel tilt |
|  `sun-solar-sundial-square-dial-1800-met.jpg` | Square sundial c.1800, frontal, strong black gnomon | 1886x1873 | CC0 1.0 | Flat frontal tile (quarter-square friendly) | cutout / grid tile | square dial -> quarter-rounded square of Solaro mark |
|  `sun-solar-sundial-universal-ring-brass-met.jpg` | Universal (armillary) ring sundial, brass | 4000x4000 | CC0 1.0 | Interlocking rings - ring motif, 4000 px | cutout | rings -> Solaro ring -> eclipse ring |
|  `sun-solar-sundial-universal-ring-flat-met.jpg` | Universal ring sundial, flat B&W photo | 1988x1988 | CC0 1.0 | Already B&W, perfect ring | cutout | ring -> Solaro ring |
|  `sun-solar-universal-sundial-engraving-wellcome.jpg` | Engraving: universal sundial with globe and compass | 1268x2212 | PDM (Wellcome Collection) | Engraved instrument - fits engraving look | engraving-clean cutout (1268 px) | globe -> sun |

### Eclipse

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-eclipse-2017-corona-nasa.jpg` | 2017 total eclipse corona, Madras OR (NASA/Gemignani) | 3186x2527 | PD - NASA image | Perfect black disc + corona on black; ring motif, iconic | invert/cutout -> black ring on white | eclipse ring -> Solaro ring (direct shape match) |
|  `sun-solar-eclipse-2017-diamond-ring-nasa.jpg` | 2017 eclipse 'diamond ring' (NASA/Carla Thomas) | 5046x3364 | PD - NASA image | Ring + flash point = spark on a ring | invert/cutout | spark (era 1) -> diamond ring flash -> sun |
|  `sun-solar-eclipse-corona-1842-wellcome.jpg` | Total eclipse 8 Jul 1842 - drawn corona | 2500x2924 | PDM (Wellcome Collection) | Big dark disc with prominences, historic | engraving-clean card | black disc -> Solaro ring fill |
|  `sun-solar-eclipse-corona-1878-wellcome.jpg` | Total eclipse 29 Jul 1878 - corona from photographs | 2111x3078 | PDM (Wellcome Collection) | Small disc with wing-like corona - elegant | card / invert | corona wings -> lightning streamers |
|  `sun-solar-eclipse-ring-clouds-unsplash.jpg` | Eclipse ring through clouds (photo) | 3079x4311 | Unsplash License | Moody photo ring; Unsplash | card / invert | ring -> Solaro ring |

### Modern sun

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-sdo-hmi-white-light-giant-sunspot-2014-nasa.jpg` | SDO/HMI white-light Sun with giant sunspot AR2192, 24 Oct 2014 | 3400x3400 | PD - NASA SDO data | Natively B&W, 3400 px, clean disc on black - the hero sun | cutout disc (pure circle) / invert | Kircher/Scheiner disc -> HMI disc (same composition); disc -> Solaro ring |
|  `sun-solar-sdo-aia171-corona-loops-2014-nasa.jpg` | SDO/AIA 171A Sun, same day - magnetic loop texture | 3400x3400 | PD - NASA SDO data | Rich texture disc; B&W gives glowing filigree | B&W texture / cutout disc | loops -> filament coil |
|  `sun-solar-soho-handle-prominence-nasa.jpg` | SOHO EIT 304 full disc with handle-shaped prominence (ESA/NASA) | 2100x2034 | PD - NASA image | Classic 'sun with flame' image | B&W cutout | prominence loop -> flame -> bulb filament |

### Space solar arrays

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-iss-solar-array-sunburst-nasa.jpg` | ISS solar arrays with the Sun bursting behind (Don Pettit 2012) | 4288x2848 | PD - NASA image | Sun + panel in ONE frame - the thesis of the ad | card / B&W | star burst -> sun -> panel grid |
|  `sun-solar-artemis-solar-array-wing-technician-nasa.jpg` | Artemis I Orion solar array wing with technician reaching up (6720 px) | 6720x4480 | PD - NASA image | Human scale + huge cell grid in clean white room | cutout person+wing / card | hand reaching -> hand on Solaro roof |
|  `sun-solar-gloved-hands-solar-panel-nasa.jpg` | Gloved hands on a spacecraft solar panel | 3008x2000 | PD - NASA image | HANDS + cells gesture | card / crop hands | hand (spark-making) -> hand on panel |
|  `sun-solar-iss-p6-array-grid-gold-nasa.jpg` | ISS P6 solar array wing - golden cell grid receding (2000) | 3021x1988 | PD - NASA image | Grid texture with perspective | texture | grid -> grid of sun discs |
|  `sun-solar-iss-p6-array-wing-perspective-nasa.jpg` | ISS P6 wing perspective, blue cells, Earth | 3016x1996 | PD - NASA image | Leading-line grid, dramatic | texture/card | receding grid -> zoom-through |
|  `sun-solar-iss-solar-array-earth-black-nasa.jpg` | ISS solar array wing over Earth limb, black space | 4928x3280 | PD - NASA image | Strong diagonal geometric panel, 4928 px | card / cutout wing on black | wing diagonal -> lightning/power line diagonal |
|  `sun-solar-skylab-solar-wings-black-sky-nasa.jpg` | Skylab with solar wings against black sky (1973) | 3820x3900 | PD - NASA image | Clean silhouette, cut-out ready | cutout (black bg) | cross shape -> spark star |

### Early PV

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-early-module-round-cells-dark-tekniska.jpg` | Early module of 34 round silicon cells (Philips, c.1978-80) on dark bg | 3543x3543 | CC BY 4.0 | Perfect CIRCLE GRID, isolated object; bridges sun discs -> PV | cutout / texture | Scheiner disc grid -> round-cell grid -> modern square cells |
|  `sun-solar-carter-white-house-solar-panels-1979-loc.jpg` | Jimmy Carter unveils White House solar panels, 20 Jun 1979 | 4549x3060 | No known restrictions on publication | Iconic B&W 'solar goes mainstream' moment | card | lectern -> home rooftop |
|  `sun-solar-early-module-round-cells-tall-tekniska.jpg` | Early 36-round-cell 12 V module (Solar Power Corp, c.1978-80) | 2000x3008 | CC BY 4.0 | Vertical circle-grid strip, isolated | cutout | column of circles -> sun sizes diagram |
|  `sun-solar-early-module-round-cells-twin-tekniska.jpg` | ARCO Solar module with round mono-Si cells (1980-81) | 3008x2000 | CC BY 4.0 | Three columns of circles - isolated | cutout | circle columns -> panel rows |
|  `sun-solar-thin-film-solar-cells-1966-researcher-nasa.jpg` | NASA Lewis 1966: researcher compares thin-film vs normal solar cells | 2048x1536 | PD - NASA image | Archival B&W, hands + cells, human 'invention' moment | card / cutout | hands holding cell -> hands holding bulb |
|  `sun-solar-vanguard-model-satellite-1958-loc.jpg` | Vanguard 1 satellite model at Cape Canaveral, 19 Mar 1958 (2 days after launch) | 5399x3609 | No known restrictions on publication | First solar-powered satellite: sphere + 6 antennae + square solar-cell windows; B&W | card / cutout sphere | sphere -> sun; antennae -> rays |

### Modern PV

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
|  `sun-solar-cell-panel-closeup-cc0-flickr.jpg` | Monocrystalline panel close-up against sky and tree (CC0) | 4608x3072 | CC0 1.0 (https://creativecommons.org/publicdomain/zero/1.0/) | Crisp cell grid with busbars, 4608 px | texture / B&W | grid -> Solaro quarter squares |
|  `sun-solar-cells-window-grid-fraunhofer-flickr.jpg` | Solar cells laminated in glazing, Fraunhofer ISE | 3072x2304 | CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/) | High-contrast black squares on white - already graphic B&W | texture (perfect on white) | black squares -> Solaro quarter-rounded squares |
|  `sun-solar-farm-rows-dusk-usda-flickr.jpg` | Aerial solar farm rows at dusk (USDA, PD) | 4032x3024 | PDM 1.0 (https://creativecommons.org/publicdomain/mark/1.0/) | Rows radiating toward horizon | card | rows -> rays |
|  `sun-solar-first-panels-house-roof-flickr.jpg` | First rooftop panels on a family house | 5212x3468 | CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/) | Residential rooftop, blue sky - 'your home' photo | card / B&W | Radford house drawing -> real house with panels |
|  `sun-solar-installer-long-roof-array-1010-flickr.jpg` | Installer walking along a long roof array (Grange Farm) | 4160x3120 | CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/) | Installer at work on roof, strong perspective | card | perspective rows -> rails/power lines |
|  `sun-solar-installer-portrait-renovus-flickr.jpg` | Solar installer portrait, hard hat, under array | 3840x5760 | CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/) | Human face of the trade (vertical 3840x5760) | cutout person | workman (electric era) -> installer |
|  `sun-solar-panel-surface-diagonal-usda-flickr.jpg` | Low-angle panel surface, diagonal busbar lines (USDA, PD) | 8000x5334 | PDM 1.0 (https://creativecommons.org/publicdomain/mark/1.0/) | Big 8000 px texture with leading lines | texture | diagonals -> power lines |
|  `sun-solar-rooftops-neighbourhood-amersfoort-eneco-flickr.jpg` | Amersfoort Nieuwland solar neighbourhood - rows of PV-roofed family houses | 4288x2848 | CC BY 2.0 (https://creativecommons.org/licenses/by/2.0/) | Many homes with solar = scale/community beat | card | grid of houses -> grid of cells |
|  `sun-solar-solar-farm-aerial-stripes-unsplash.jpg` | Aerial: diagonal stripes of panels on grass | 3500x2333 | Unsplash License | Graphic aerial grid, abstract | texture / B&W | stripes -> sunspot rows -> grid |

### Sunflowers

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
| **TOP** `sun-solar-sunflower-head-frontal-unsplash.jpg` | Sunflower head, frontal, fills frame | 4500x3000 | Unsplash License | Sun-face circle; heliotropism beat; 4500 px | B&W cutout disc | sunflower -> sun disc -> Solaro ring |
|  `sun-solar-sunflower-against-sky-unsplash.jpg` | Single sunflower against pale sky | 4500x3000 | Unsplash License | Easy cutout, upward-facing (turning to sun) | cutout | head turning -> panel tilting |
|  `sun-solar-sunflower-botanical-watercolour-rijks.jpg` | Botanical drawing of a single sunflower (c.1690) | 4032x6924 | CC0 1.0 (Rijksmuseum, public domain) | Isolated on plain paper; tall stem | cutout | stem -> filament/pole |
|  `sun-solar-sunflower-follows-sun-emblem-flamen-rijks.jpg` | Emblem 'Usque sequar' (Flamen 1672): sunflower turning to the sun | 3374x4566 | CC0 1.0 (Rijksmuseum, public domain) | Heliotropism CONCEPT in a 17th-c engraving - flower faces sun in clouds | engraving-clean | flower following sun -> panel tracking sun |
|  `sun-solar-sunflower-head-black-bg-1-wellcome.jpg` | Sunflower on black background (Wellcome, CC BY) | 2912x4368 | CC BY 4.0 (credit: Wellcome Collection) | Clean background = instant cutout | cutout (credit Wellcome / Dr Henry Oakeley) | sunflower -> sun |
|  `sun-solar-sunflower-macro-spiral-unsplash.jpg` | Ultra-macro sunflower florets (Fibonacci spiral) | 4500x3000 | Unsplash License | Texture with spiral geometry | texture | spiral -> coil; florets -> cells |
|  `sun-solar-sunflower-vase-woodcut-rijks.jpg` | Mesquita woodcut: sunflower in round black vase (1914) | 3118x5170 | CC0 1.0 (Rijksmuseum, public domain) | Circle-on-circle graphic | engraving-clean | flower disc + vase circle -> sun + Earth |
|  `sun-solar-sunflower-woodcut-degraag-rijks.jpg` | Julie de Graag woodcut, sunflowers (1919) | 5000x6434 | CC0 1.0 (Rijksmuseum, public domain) | Bold B&W woodcut graphic, 5000 px | engraving-clean (level paper) | radial petals -> sun rays |

### Home

| file | subject | px | license | why useful | treatment | match-cut ideas |
|---|---|---|---|---|---|---|
|  `sun-solar-house-foursquare-radford-1908-ia.jpg` | Radford 1908 foursquare family house (drawing on white) | 2164x3013 | PD | Archetypal 'home' silhouette, vignetted on white | cutout (crop house from page) | house roof -> Solaro panels painted on; house -> Solaro pin mark |
|  `sun-solar-house-gabled-cottage-radford-1908-ia.jpg` | Radford 1908 gabled cottage with porch | 2164x3013 | PD | Big roof plane facing viewer - paint panels on it | cutout | gable roof -> panel triangle |

## Attribution required (CC BY)

- `sun-solar-sunflower-head-black-bg-1-wellcome.jpg`: "Helianthus annuus Greene Asteraceae. Sunflower, Marigold of Peru, Floure of the Sun. Distr" by Dr Henry Oakeley / Wellcome Collection - CC BY 4.0 - https://wellcomecollection.org/works/h33294sm
- `sun-solar-first-panels-house-roof-flickr.jpg`: "First ten panels on the roof!" by joncallas - CC BY 2.0 - https://www.flickr.com/photos/19745294@N06/5320535709
- `sun-solar-installer-long-roof-array-1010-flickr.jpg`: "Solar installation at Grange Farm" by 1010 Climate Action - CC BY 2.0 - https://www.flickr.com/photos/39570195@N08/16208029168
- `sun-solar-cells-window-grid-fraunhofer-flickr.jpg`: "Solar cells on window at Fraunhofer ISE, Freiburg" by steel & silicon - CC BY 2.0 - https://www.flickr.com/photos/47624016@N03/4505103629
- `sun-solar-rooftops-neighbourhood-amersfoort-eneco-flickr.jpg`: "Solar energy, Amersfoort" by Eneco Group Media - CC BY 2.0 - https://www.flickr.com/photos/52771707@N07/5600325194
- `sun-solar-installer-portrait-renovus-flickr.jpg`: "Renovus Solar" by 100isNow - CC BY 2.0 - https://www.flickr.com/photos/149368236@N06/33882287775
- `sun-solar-early-module-round-cells-dark-tekniska.jpg`: "Solcellsmodul (TEKS0047935) - 34 stycken små och runda solceller monterade i en modul.  Mo" (object made by Philips Inc) - photo: Tekniska museet, CC BY 4.0 - https://digitaltmuseum.se/021026361104
- `sun-solar-early-module-round-cells-tall-tekniska.jpg`: "Solcellsmodul (TEKS0047937) - Solcellspanel Solar power corporation, 20 Cabot Road, Woburn" (object made by Solar Power Corporation) - photo: Tekniska museet, CC BY 4.0 - https://digitaltmuseum.se/021026361106
- `sun-solar-early-module-round-cells-twin-tekniska.jpg`: "Solcellsmodul (TEKS0047939) - Solcellspaneler, Arco solar Inc, 20554 Plummer St, Chatswort" (object made by ARCO Solar Inc) - photo: Tekniska museet, CC BY 4.0 - https://digitaltmuseum.se/021026361108

Unsplash files: Unsplash License (no attribution required; photographer recorded in credits). Rijksmuseum / Met / Cleveland: CC0. NASA/SDO/SOHO: public domain (SOHO is ESA & NASA - credit 'ESA/NASA/SOHO'). LoC items: 'No known restrictions on publication' (U.S. News & World Report collection).

## Gaps and leads

- **Charles Fritts' 1883 selenium cell** - no public-domain image found (Wikimedia Commons returned HTTP 429 all session; no hit in Wellcome/Europeana/LoC/NASA). Nothing downloaded; the early-module round-cell objects (Tekniska) and the 1966 NASA thin-film cell photo are the nearest stand-ins. Lead: Fritts' paper *On a New Form of Selenium Cell*, American Journal of Science 1883 (vol. 26), or the 1884 *La Lumiere electrique* article, for a figure.
- **Bell Labs 1954 'solar battery'** - only partly covered. LoC has the iconic 1955 Americus, GA photo of the Bell Solar Battery on a telephone pole (https://www.loc.gov/item/2002713367/), but its rights field says 'Rights status not evaluated', so I skipped it. LOOK 1955 'Solar energy' photos (round-cell Bell panel, solar furnaces; e.g. https://www.loc.gov/item/2023630094/) say 'Publication may be restricted', so I skipped those too. The Smithsonian Open Access API (DEMO_KEY) was rate-limited (429). NMAH lists 'Sapan solar battery' and 'Hoffman HSB 6.0 solar battery' objects but returned no media. Worth a retry with a real api.data.gov key.
- **Vanguard 1** - covered by the LoC 1958 B&W photo of the model satellite (`vanguard-model-satellite-1958-loc`). NASA has almost nothing on it.
- **Installers on pitched family-house roofs** - permissive examples are thin: there is a flat or commercial roof walker and an installer portrait. Solaro's own photos should cover this beat.
- **Wikimedia Commons** (Rosa Ursina plates, Mouchot photos, the Bell battery) could not be used: the API and upload.wikimedia.org returned 429 on every attempt.
- Rejected or duplicate candidates were moved out of the raw folder and are not listed here (29 files, e.g. low-res Flickr originals at 1020 px, SDO 1024 px renders, redundant sundials and eclipses).
