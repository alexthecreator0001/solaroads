import sys, re, json, os
sys.path.insert(0, os.path.dirname(__file__))
import numpy as np
from geom import parse_path, raster, bbox, cubic, quad
from fontTools.ttLib import TTFont
from fontTools.pens.basePen import BasePen
import uharfbuzz as hb

OUT = sys.argv[1]
FONTS = json.load(open(sys.argv[2]))
svg = open('/home/user/solaroads/assets/solaro-logo.svg').read()
word = [p for p, f in re.findall(r'<path d="([^"]+)" fill="([^"]+)"', svg) if f == '#1C1C1C']
LET = ['S', 'o', 'l', 'a', 'r', 'o']
BASE = 375.372            # baseline (bottom of l / a / r)
OX, OY = 520, 40          # canvas origin offset in svg units
W, H = 1380, 380          # canvas
wsubs = [parse_path(d) for d in word]
wb = [bbox(s) for s in wsubs]
def shift(subs, dx, dy):
    return [[(x + dx, y + dy) for x, y in s] for s in subs]
WM = np.zeros((H, W), bool); WL = []
for s in wsubs:
    m = raster(shift(s, -OX, -OY), W, H, ss=2); WL.append(m); WM |= m
O_H = wb[1][3] - wb[1][1]       # 225.118 incl. overshoots
S_H = wb[0][3] - wb[0][1]
L_W = wb[2][2] - wb[2][0]
WORD_X0, WORD_X1 = wb[0][0], wb[5][2]

class FlatPen(BasePen):
    def __init__(self, gs):
        super().__init__(gs); self.subs = []; self.cur = None
    def _moveTo(self, p): self.cur = [p]; self.subs.append(self.cur)
    def _lineTo(self, p): self.cur.append(p)
    def _curveToOne(self, a, b, c):
        self.cur += [tuple(q) for q in cubic(np.array(self._getCurrentPoint()), np.array(a), np.array(b), np.array(c), 16)]
    def _qCurveToOne(self, a, b):
        self.cur += [tuple(q) for q in quad(np.array(self._getCurrentPoint()), np.array(a), np.array(b), 12)]
    def _closePath(self): pass
    def _endPath(self): pass

def glyph_subs(gs, name):
    p = FlatPen(gs); gs[name].draw(p); return [s for s in p.subs if len(s) > 2]

def iou(a, b):
    u = (a | b).sum(); return (a & b).sum() / u if u else 0

results = []
FSN = {'bespoke-sans':'Bespoke Sans','britney':'Britney','cabinet-grotesk':'Cabinet Grotesk','chillax':'Chillax','clash-display':'Clash Display','clash-grotesk':'Clash Grotesk','general-sans':'General Sans','panchang':'Panchang','plein':'Plein','satoshi':'Satoshi','supreme':'Supreme','switzer':'Switzer'}
GN = {re.sub(' ', '', g): g for g in ["Plus Jakarta Sans","Red Hat Display","DM Sans","Albert Sans","Kumbh Sans","Hanken Grotesk","Rethink Sans","Lexend Deca","Readex Pro","Golos Text","Nunito Sans","Be Vietnam Pro","League Spartan","Wix Madefor Display","Instrument Sans","Bricolage Grotesque","Space Grotesk","Palanquin Dark","Montserrat Alternates","Encode Sans","Work Sans","Mona Sans","Funnel Display","Host Grotesk"]}
for f in FONTS:
    try:
        tt = TTFont(f['file']); gs = tt.getGlyphSet(); cmap = tt.getBestCmap(); upm = tt['head'].unitsPerEm
        blob = hb.Blob.from_file_path(f['file']); face = hb.Face(blob); font = hb.Font(face)
        buf = hb.Buffer(); buf.add_str('Solaro'); buf.guess_segment_properties()
        hb.shape(font, buf, {'kern': True, 'liga': True})
        gnames = [tt.getGlyphName(i.codepoint) for i in buf.glyph_infos]
        adv = [p.x_advance for p in buf.glyph_positions]
        gl = [glyph_subs(gs, n) for n in gnames]
        gbb = [bbox(s) for s in gl]
        # scale: match 'o' height (font y-up)
        sc = O_H / (gbb[1][3] - gbb[1][1])
        # y transform: svg_y = BASE - y*sc ; o must be centred like wordmark o -> use baseline
        def place(subs, x):
            return [[(x + px * sc - OX, BASE - py * sc - OY) for px, py in s] for s in subs]
        # per-letter IoU: align bbox centre-x
        lets = []; FM_letters = []
        for k in range(6):
            cx_w = (wb[k][0] + wb[k][2]) / 2; cx_f = (gbb[k][0] + gbb[k][2]) / 2 * sc
            m = raster(place(gl[k], cx_w - cx_f), W, H, ss=2)
            lets.append(iou(m, WL[k])); FM_letters.append(m)
        # word: native advances + uniform tracking so total width matches wordmark
        pen_x = np.cumsum([0] + adv[:-1]) * sc
        left = pen_x[0] + gbb[0][0] * sc; right = pen_x[5] + gbb[5][2] * sc
        trk = ((WORD_X1 - WORD_X0) - (right - left)) / 5.0
        FM = np.zeros((H, W), bool)
        for k in range(6):
            x = WORD_X0 - left + pen_x[k] + k * trk
            FM |= raster(place(gl[k], x), W, H, ss=2)
        wi = iou(FM, WM)
        AL = np.zeros((H, W), bool)
        for m in FM_letters: AL |= m
        ai = iou(AL, WM)
        np.save(f"{OUT}/{os.path.basename(f['file'])[:-4]}_aligned.npy", np.packbits(AL))
        s_h = (gbb[0][3] - gbb[0][1]) * sc
        l_w = (gbb[2][2] - gbb[2][0]) * sc
        b = os.path.basename(f['file'])[:-4].split('_')
        fam = FSN.get(b[1], f['family']) if b[0] == 'F' else GN.get(b[1], b[1])
        r = dict(family=fam, weight=f['weight'], src=f['src'], file=f['file'], word_iou=round(wi, 4), aligned_iou=round(ai, 4),
                 letter_iou=[round(v, 4) for v in lets], mean_letter=round(float(np.mean(lets)), 4),
                 sol_iou=round(float(np.mean([lets[0], lets[1], lets[2], lets[5]])), 4),
                 S_height_ratio=round(s_h / S_H, 3), l_stem_ratio=round(l_w / L_W, 3),
                 tracking_em=round(trk / sc / upm * 1000, 1), glyphs=gnames)
        results.append(r)
        np.save(f"{OUT}/{os.path.basename(f['file'])[:-4]}_word.npy", np.packbits(FM))
        print(f"{r['family']:22s} {r['weight']} word {wi:.3f} aligned {ai:.3f} letters {r['mean_letter']:.3f} S,o,l,o {r['sol_iou']:.3f} Sh {r['S_height_ratio']} stem {r['l_stem_ratio']} trk {r['tracking_em']} {gnames[3]}", flush=True)
    except Exception as e:
        print('ERR', f['file'], repr(e)[:200], flush=True)
np.save(f"{OUT}/_wordmark.npy", np.packbits(WM))
json.dump(results, open(f"{OUT}/results.json", 'w'), indent=1)
