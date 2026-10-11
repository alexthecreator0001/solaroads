#!/usr/bin/env python3
"""Build assets/registry.json from assets/processed/** (+ manual hot points in assets/registry-points.json).
Keys: '<name>' for the flat B&W version, '<name>.cut' for the cutout. Era prefixes are dropped
(e.g. 'spark-fire-oil-lamp-roman-plain-met' -> 'oil-lamp-roman-plain-met')."""
import os, json, re
from PIL import Image
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = os.path.join(ROOT, 'assets/processed')
reg = {}
for era in sorted(os.listdir(P)):
    d = os.path.join(P, era)
    if not os.path.isdir(d):
        continue
    for f in sorted(os.listdir(d)):
        if not re.search(r'\.(jpg|png)$', f):
            continue
        stem = f[:-4]
        key = re.sub(r'^(spark-fire|lightning-early|electric-age|sun-solar)-', '', stem)
        if era == 'solaro':
            key = 'solaro-' + key
        with Image.open(os.path.join(d, f)) as im:
            w, h = im.size
        reg[key] = {'file': f'assets/processed/{era}/{f}', 'w': w, 'h': h, 'era': era}
pts = os.path.join(ROOT, 'assets/registry-points.json')
if os.path.exists(pts):
    for k, v in json.load(open(pts)).items():
        if k in reg:
            reg[k].update(v)
        else:
            print('warning: hot point for unknown key', k)
json.dump(reg, open(os.path.join(ROOT, 'assets/registry.json'), 'w'), indent=1)
print(len(reg), 'images registered')
