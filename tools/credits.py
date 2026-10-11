#!/usr/bin/env python3
"""Write CREDITS.md for every image actually used by the film: scans scenes/solaro/*.js for registry keys,
maps them to the sourcing agents' credits.json entries (assets/raw/<era>/credits.json) and lists licence +
attribution (CC BY requires it)."""
import os, re, json, glob
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
reg = json.load(open(os.path.join(ROOT, 'assets/registry.json')))
src = ''.join(open(p).read() for p in glob.glob(os.path.join(ROOT, 'scenes/solaro/*.js')))
used = sorted(k for k in reg if re.search(r"['\"`]" + re.escape(k) + r"['\"`]", src))
credits = {}
for cj in glob.glob(os.path.join(ROOT, 'assets/raw/*/credits.json')):
    era = os.path.basename(os.path.dirname(cj))
    try:
        data = json.load(open(cj))
    except Exception:
        continue
    items = data if isinstance(data, list) else data.get('items', data.get('files', []))
    if isinstance(items, dict):
        items = [dict(v, file=k) for k, v in items.items()]
    for it in items:
        f = os.path.splitext(os.path.basename(it.get('file', '')))[0]
        credits[(era, f)] = it
rows, byl = [], {}
for k in used:
    r = reg[k]
    era = r.get('era')
    stem = os.path.splitext(os.path.basename(r['file']))[0].replace('.cut', '')
    ALIAS = {'s5-course': 'sun-solar-sunspot-course-disc-engraving-wellcome', 's5-nollet': 'lightning-early-leyden-nollet-spark-wellcome',
             's5-degraag': 'sun-solar-sunflower-woodcut-degraag-rijks', 's5-lamp': 'spark-fire-oil-lamp-roman-sunrays-met',
             's5-scheiner-grid': 'sun-solar-scheiner-1612-sunspot-discs-grid-freiburg', 's5-round-cells': 'sun-solar-early-module-round-cells-dark-tekniska',
             'bow-drill-clean-s1s2': 'spark-fire-bow-drill-madagascar-wellcome', 'handaxe-teardrop-soft-s1s2': 'spark-fire-handaxe-teardrop-acheulean-met',
             'hooke-fig1-s1s2': 'spark-fire-hooke-sparks-flint-steel-micrographia-wellcome', 'nine-bifaces-s1s2': 'spark-fire-handaxes-nine-bifaces-met',
             'strike-stones-clean-s1s2': 'spark-fire-engraving-strike-a-light-stones-hough1890', 'tinderbox-eng-clean-s1s2': 'spark-fire-engraving-tinderbox-hough1890',
             'torch-arm-hires-s1s2': 'spark-fire-torch-bearing-arm-met'}
    for a, full in ALIAS.items():
        if stem.endswith(a):
            stem = full
    base = re.sub(r'-(s1s2|s3|s4|s5|s6|inv|crop|retouch|hi|v\d+)[\w-]*$', '', stem)
    it = credits.get((era, stem)) or credits.get((era, base)) or {}
    if not it:  # try prefix match
        for (e, f), v in credits.items():
            if e == era and (stem.startswith(f) or f.startswith(base)):
                it = v; break
    lic = it.get('license', 'Client-owned (solaro.sk)' if era == 'solaro' else '?')
    rows.append((era, k, it.get('title', ''), it.get('creator', ''), it.get('date', ''), lic, it.get('source_url', '')))
with open(os.path.join(ROOT, 'CREDITS.md'), 'w') as o:
    o.write('# Image credits\n\nAll archival images are public domain, CC0 or CC BY (attribution below); Solaro photos are client-owned. ')
    o.write('3D flint scans: Jacek Lech, Zenodo (CC BY 4.0). Typeface: Poppins (SIL OFL 1.1). All sound is synthesised.\n\n')
    o.write('| era | key | title | creator | date | licence | source |\n|---|---|---|---|---|---|---|\n')
    for r in rows:
        o.write('| ' + ' | '.join(str(x).replace('|', '/') for x in r) + ' |\n')
    cc = [r for r in rows if 'CC BY' in str(r[5]).upper()]
    o.write(f'\n**Attribution required (CC BY):** ' + '; '.join(f"{r[2] or r[1]} — {r[3] or '?'} ({r[5]})" for r in cc) + '\n')
print(len(rows), 'images credited;', sum(1 for r in rows if r[5] == '?'), 'without licence info')
