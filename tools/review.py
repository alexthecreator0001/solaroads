#!/usr/bin/env python3
"""Review sheets from a rendered video: every Nth frame, labelled with frame number / time.
  python3 tools/review.py VIDEO OUT_PREFIX [--from F] [--to F] [--step 2] [--cols 10] [--w 216]
Writes OUT_PREFIX-01.jpg, -02.jpg ... (max ~40 tiles per sheet).
"""
import argparse, subprocess, os, tempfile, glob
from PIL import Image, ImageDraw

ap = argparse.ArgumentParser()
ap.add_argument('video'); ap.add_argument('out')
ap.add_argument('--from', dest='f0', type=int, default=0); ap.add_argument('--to', dest='f1', type=int, default=10**6)
ap.add_argument('--step', type=int, default=2); ap.add_argument('--cols', type=int, default=10)
ap.add_argument('--w', type=int, default=216); ap.add_argument('--per', type=int, default=40)
a = ap.parse_args()
tmp = tempfile.mkdtemp()
subprocess.run(['ffmpeg', '-v', 'error', '-i', a.video, '-vf', f"select='between(n,{a.f0},{a.f1})*not(mod(n-{a.f0},{a.step}))',scale={a.w}:-1", '-vsync', '0', f'{tmp}/%06d.png'], check=True)
files = sorted(glob.glob(f'{tmp}/*.png'))
h = Image.open(files[0]).height if files else 0
for s in range(0, len(files), a.per):
    chunk = files[s:s + a.per]
    rows = (len(chunk) + a.cols - 1) // a.cols
    sheet = Image.new('RGB', (a.cols * (a.w + 4), rows * (h + 18)), (30, 30, 30))
    d = ImageDraw.Draw(sheet)
    for i, f in enumerate(chunk):
        n = a.f0 + (int(os.path.basename(f)[:-4]) - 1) * a.step
        x, y = (i % a.cols) * (a.w + 4), (i // a.cols) * (h + 18)
        sheet.paste(Image.open(f).convert('RGB'), (x, y + 16))
        d.text((x + 2, y + 2), f'f{n}  {n / 60:.2f}s', fill=(255, 220, 80))
    sheet.save(f'{a.out}-{s // a.per + 1:02d}.jpg', quality=88)
    print(f'{a.out}-{s // a.per + 1:02d}.jpg')
