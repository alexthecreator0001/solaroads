import json, os, sys
import numpy as np
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageFilter
d = '/home/user/solaroads/assets/raw/solaro'
cr = json.load(open(f'{d}/credits.json'))
photos = [c for c in cr if '/' not in c['file']]
F = '/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
FB = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = ImageFont.truetype(F, 13); fontb = ImageFont.truetype(FB, 14)
cols, cw, ch, lab = 5, 360, 300, 58
rows = (len(photos) + cols - 1) // cols
sheet = Image.new('RGB', (cols * cw, rows * (ch + lab) + 50), 'white')
dr = ImageDraw.Draw(sheet)
dr.text((10, 12), 'SOLARO client photos (solaro.sk) - shown in B&W (ad treatment) with colour inset. sharp=Laplacian var @1024px, ctr=p95-p5 luma, orient=EXIF', fill='black', font=fontb)
stats = []
for i, c in enumerate(photos):
    im = Image.open(f"{d}/{c['file']}")
    exif_o = im.getexif().get(274, 1)
    im = ImageOps.exif_transpose(im).convert('RGB')
    g = im.convert('L'); g1 = g.copy(); g1.thumbnail((1024, 1024))
    a = np.asarray(g1, float)
    lap = a[1:-1, 1:-1] * 4 - a[:-2, 1:-1] - a[2:, 1:-1] - a[1:-1, :-2] - a[1:-1, 2:]
    sharp = lap.var(); ctr = np.percentile(a, 95) - np.percentile(a, 5)
    top = a[: a.shape[0] // 4]; sky_flat = top.std()
    bw = ImageOps.autocontrast(g, cutoff=1)
    bw.thumbnail((cw - 10, ch - 10)); col = im.copy(); col.thumbnail((110, 110))
    x, y = (i % cols) * cw, 50 + (i // cols) * (ch + lab)
    ox, oy = x + (cw - bw.width) // 2, y + (ch - bw.height) // 2
    sheet.paste(bw.convert('RGB'), (ox, oy))
    sheet.paste(col, (ox + bw.width - col.width - 4, oy + bw.height - col.height - 4))
    dr.rectangle((ox + bw.width - col.width - 5, oy + bw.height - col.height - 5, ox + bw.width - 4, oy + bw.height - 4), outline='white')
    w, h = c['width'], c['height']
    mp = w * h / 1e6
    q = 'A' if (min(w, h) >= 2000 and sharp > 150) else ('B' if min(w, h) >= 1100 else 'C')
    dr.text((x + 6, y + ch + 2), f"{i:02d} {c['file'][:40]}", fill='black', font=fontb)
    dr.text((x + 6, y + ch + 20), f"{w}x{h} ({mp:.1f}MP) tier {q}  orient={exif_o}", fill=(255, 61, 0), font=font)
    dr.text((x + 6, y + ch + 37), f"sharp {sharp:.0f}  ctr {ctr:.0f}  skyStd {sky_flat:.0f}", fill=(90, 90, 90), font=font)
    stats.append(dict(i=i, file=c['file'], w=w, h=h, sharp=round(sharp), ctr=round(ctr), sky=round(sky_flat), tier=q, exif=exif_o))
out = '/home/user/solaroads/research/brand/solaro-photos-contact.jpg'
q = 85
while True:
    sheet.save(out, quality=q, optimize=True)
    if os.path.getsize(out) < 1_450_000 or q < 40: break
    q -= 7
print(out, sheet.size, os.path.getsize(out) // 1024, 'KB', q)
json.dump(stats, open('/tmp/claude-0/-home-user-solaroads/66de83b3-0848-5724-84a9-906d826c8399/scratchpad/bs/photo_stats.json', 'w'), indent=1)
for s in stats: print(s)
