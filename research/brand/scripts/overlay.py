import json, os, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont
FM = sys.argv[1]; out = sys.argv[2]
R = json.load(open(f'{FM}/results.json'))
H, W = 380, 1380
WM = np.unpackbits(np.load(f'{FM}/_wordmark.npy'))[:H * W].reshape(H, W).astype(bool)
pick = [('Poppins', 700), ('Lexend', 700), ('Chillax', 600), ('Clash Grotesk', 600), ('Sen', 800), ('Poppins', 800),
        ('Readex Pro', 700), ('Outfit', 700), ('Figtree', 800), ('Urbanist', 900), ('General Sans', 700), ('Satoshi', 900), ('Montserrat', 800), ('Poppins', 600)]
rows = []
for fam, w in pick:
    r = [x for x in R if x['family'] == fam and x['weight'] == w][0]
    rows.append(r)
sc = 0.62
rw, rh = int(W * sc), int(H * sc)
lab = 64
cols = 2
nrow = (len(rows) + 1 + cols - 1) // cols
img = Image.new('RGB', (cols * rw + 20, 90 + nrow * (rh + lab)), 'white')
d = ImageDraw.Draw(img)
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 15)
FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 17)
d.text((12, 10), 'Solaro wordmark vs candidate fonts (each glyph scaled to wordmark "o" height, baseline-aligned, centred on wordmark letter).', fill='black', font=FB)
d.text((12, 34), 'dark = overlap   orange = wordmark only   blue = font only.   aligned = IoU of word with letters at wordmark positions; word = native spacing + fitted tracking', fill=(60, 60, 60), font=F)
d.text((12, 56), 'letter IoU order S o l a r o  ("a" and "r" are custom-drawn in the wordmark, so every font loses there)', fill=(60, 60, 60), font=F)
def tile(mask_font):
    a = np.full((H, W, 3), 255, np.uint8)
    if mask_font is None:
        a[WM] = (28, 28, 28)
    else:
        a[WM & mask_font] = (28, 28, 28); a[WM & ~mask_font] = (255, 94, 43); a[~WM & mask_font] = (35, 166, 240)
    return Image.fromarray(a).resize((rw, rh), Image.LANCZOS)
items = [(None, 'SOLARO WORDMARK (reference, solaro-logo.svg)')] + [(r, None) for r in rows]
for i, (r, title) in enumerate(items):
    x = 10 + (i % cols) * rw; y = 90 + (i // cols) * (rh + lab)
    if r is None:
        img.paste(tile(None), (x, y)); d.text((x + 10, y + rh + 6), title, fill='black', font=FB)
        continue
    key = os.path.basename(r['file'])[:-4]
    m = np.unpackbits(np.load(f'{FM}/{key}_aligned.npy'))[:H * W].reshape(H, W).astype(bool)
    img.paste(tile(m), (x, y))
    rank = sorted(R, key=lambda q: -q['aligned_iou']).index(r) + 1
    d.text((x + 10, y + rh + 4), f"{r['family']} {r['weight']}   aligned IoU {r['aligned_iou']:.3f}  (#{rank})   word {r['word_iou']:.3f}", fill='black', font=FB)
    li = ' '.join(f'{v:.2f}' for v in r['letter_iou'])
    d.text((x + 10, y + rh + 26), f"letters {li}   S-height x{r['S_height_ratio']}  stem x{r['l_stem_ratio']}  tracking {r['tracking_em']:+.0f}/1000em", fill=(70, 70, 70), font=F)
img.save(out, optimize=True)
print(out, img.size, os.path.getsize(out) // 1024, 'KB')
