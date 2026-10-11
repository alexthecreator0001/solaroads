import sys, re, json
sys.path.insert(0, sys.argv[1])
import numpy as np
from geom import parse_path, raster
from PIL import Image, ImageDraw, ImageFont
svg = open('/home/user/solaroads/assets/solaro-mark.svg').read()
paths = re.findall(r'<path d="([^"]+)"', svg)
S = 4  # px per unit
N = 449 * S
yy, xx = (np.mgrid[0:N, 0:N] + 0.5) / S
# parametric model (units of the 449 box)
C = 204.092; G = 40.816; R = C / 2; r = 48.92; rc = 23.753; rp = 28.237
def rrect(x0, y0, x1, y1, radii):  # radii: tl,tr,br,bl
    m = (xx >= x0) & (xx <= x1) & (yy >= y0) & (yy <= y1)
    for (cx, cy, sx, sy), rad in zip([(x0, y0, -1, -1), (x1, y0, 1, -1), (x1, y1, 1, 1), (x0, y1, -1, 1)], radii):
        if rad <= 0: continue
        ccx, ccy = cx - sx * rad, cy - sy * rad
        corner = ((xx - ccx) * sx > 0) & ((yy - ccy) * sy > 0)
        m &= ~(corner & ((xx - ccx) ** 2 + (yy - ccy) ** 2 > rad ** 2))
    return m
x2 = C + G
ring = (((xx - R) ** 2 + (yy - R) ** 2) <= R * R) & (((xx - R) ** 2 + (yy - R) ** 2) >= r * r)
qbl = rrect(0, x2, C, x2 + C, [0, R, 0, rc])
qtr = rrect(x2, 0, x2 + C, C, [0, rc, 0, R])
cx = cy = x2 + R
outer = rrect(x2, x2, x2 + C, x2 + C, [R, R, rp, R])
inner = rrect(cx - r, cy - r, cx + r, cy + r, [r, r, 0, r])
pin = outer & ~inner
model = [ring, qbl, qtr, pin]
names = ['ring_TL', 'quarter_BL', 'quarter_TR', 'pin_BR']
res = {}
for n, d, m in zip(names, paths, model):
    t = raster(parse_path(d), N, N, s=S)
    i = (t & m).sum() / (t | m).sum()
    res[n] = round(float(i), 5); print(n, 'IoU model vs svg', round(float(i), 5), 'area units^2', round(t.sum() / S / S, 1))
json.dump(res, open(sys.argv[2], 'w'))
# annotated diagram
img = Image.new('RGB', (1720, 1180), 'white'); d = ImageDraw.Draw(img)
k = 2.2; ox, oy = 90, 120
F = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf', 17); FB = ImageFont.truetype('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf', 22)
allm = ring | qbl | qtr | pin
small = Image.fromarray((allm * 255).astype(np.uint8)).resize((int(449 * k), int(449 * k)), Image.LANCZOS)
orange = Image.new('RGB', small.size, (255, 77, 21))
img.paste(orange, (ox, oy), small)
def P(x, y): return (ox + x * k, oy + y * k)
blue = (20, 110, 230)
d.text((ox, 20), 'Solaro mark - rebuilt parametrically (box 449 x 449, y down). Model IoU vs SVG: ' + ', '.join(f'{n} {v:.4f}' for n, v in res.items()), fill='black', font=F)
d.text((ox, 50), f'cell C={C}  gap G={G} (=0.2C)  R=C/2={R}  hole r={r} (ring band {R-r:.2f})  small corner rc={rc}  pin corner rp={rp}', fill='black', font=F)
for v in [0, C, x2, 449]:
    d.line([P(v, -8), P(v, 457)], fill=blue, width=1); d.line([P(-8, v), P(457, v)], fill=blue, width=1)
d.ellipse([P(R - 3, R - 3), P(R + 3, R + 3)], fill='black'); d.text(P(R + 6, R - 20), f'c=({R:.2f},{R:.2f})', fill='black', font=F)
d.ellipse([P(cx - 3, cy - 3), P(cx + 3, cy + 3)], fill='black'); d.text(P(cx - 40, cy - 30), f'c=({cx:.2f},{cy:.2f})', fill='black', font=F)
d.line([P(R, R), P(R + R, R)], fill='black', width=2); d.text(P(R + 50, R + 4), f'R {R:.3f}', fill='black', font=F)
d.line([P(R, R), P(R - r * 0.7071, R + r * 0.7071)], fill='black', width=2); d.text(P(R - 30, R + 10), f'r {r}', fill='black', font=F)
d.text(P(C / 2 - 20, x2 + C / 2), 'quarter_BL', fill='white', font=FB); d.text(P(x2 + 30, C / 2 - 20), 'quarter_TR', fill='white', font=FB)
d.text(P(x2 + 105, x2 + 168), 'pin_BR', fill='white', font=FB)
lx = ox + 449 * k + 40; ly = 140
lines = [
 'ring_TL: annulus, centre (102.07,102.05), R 102.046, r 48.921',
 '  (outer bbox 0.023..204.115 x 0..204.092)',
 'quarter_TR: 204.09 sq at (244.84,0.01);',
 '  BL corner = quarter circle R 102.046',
 '  (centre 346.88,102.06), TR corner r 23.753,',
 '  TL/BR sharp.  = quarter_BL rotated 180 deg',
 'quarter_BL: 204.09 sq at (0,244.91);',
 '  TR corner quarter circle R 102.046',
 '  (centre 102.05,346.95), BL corner r 23.753',
 'pin_BR: circle c (346.95,346.94) R 102.046',
 '  whose BR quadrant is squared off',
 '  (corner r 28.237);  hole = circle r 48.922',
 '  with BR quadrant squared (sharp corner',
 '  at 395.88,395.87)',
 '',
 'Big round sides of all 4 shapes face the',
 'centre (224.5,224.5); sharp/small corners',
 'face outward. Negative space = a "+"',
 'cross 40.8 wide through the centre.',
 '',
 'Fill: per-shape vertical linear gradient',
 '  #FF5E2B (top of shape) -> #FF3D00 (bottom)',
 'Shape inner shadow: dy 1.415, blur sd 4.174,',
 '  black 25% (top-edge inset)',
 'Group inner shadow: erode 4, offset (2,3),',
 '  blur sd 2.95, black 25% (top-left rim)',
 'Live site (logo-3.svg): flat #FF5E2B, no fx',
]
for i, t in enumerate(lines):
    d.text((lx, ly + i * 30), t, fill='black', font=F)
img.save(sys.argv[3], optimize=True); print('saved')
