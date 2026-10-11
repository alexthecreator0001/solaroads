#!/usr/bin/env python3
"""Overlay a labelled fractional grid on images so anchor points (hot spots) can be read off.
  python3 tools/gridview.py OUT.jpg IMG [IMG ...]   (tiles up to 6 images, each 600px tall)
"""
import sys
from PIL import Image, ImageDraw, ImageFont

out, paths = sys.argv[1], sys.argv[2:]
tiles = []
for p in paths:
    im = Image.open(p)
    if im.mode == 'RGBA':
        bg = Image.new('RGB', im.size, (255, 255, 255)); bg.paste(im, mask=im.split()[-1]); im = bg
    im = im.convert('RGB')
    s = 600 / im.height
    im = im.resize((max(1, round(im.width * s)), 600))
    d = ImageDraw.Draw(im)
    for i in range(1, 10):
        x = im.width * i / 10; y = im.height * i / 10
        c = (0, 160, 255) if i != 5 else (255, 0, 120)
        d.line([(x, 0), (x, im.height)], fill=c, width=1)
        d.line([(0, y), (im.width, y)], fill=c, width=1)
        d.text((x + 2, 2), f'.{i}', fill=c)
        d.text((2, y + 2), f'.{i}', fill=c)
    d.text((4, im.height - 14), p.split('/')[-1][:60], fill=(255, 0, 0))
    tiles.append(im)
W = sum(t.width for t in tiles) + 10 * (len(tiles) - 1)
sheet = Image.new('RGB', (W, 600), (40, 40, 40))
x = 0
for t in tiles:
    sheet.paste(t, (x, 0)); x += t.width + 10
sheet.save(out, quality=90)
print(out, sheet.size)
