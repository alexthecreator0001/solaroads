"""Shared helpers: SVG path parsing/flattening + even-odd rasterisation."""
import re
import numpy as np
from PIL import Image, ImageDraw

TOK = re.compile(r'[MmLlHhVvCcSsQqZz]|-?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?')

def cubic(p0, p1, p2, p3, n=24):
    t = np.linspace(0, 1, n + 1)[1:, None]
    return ((1 - t) ** 3 * p0 + 3 * (1 - t) ** 2 * t * p1 + 3 * (1 - t) * t ** 2 * p2 + t ** 3 * p3).tolist()

def quad(p0, p1, p2, n=16):
    t = np.linspace(0, 1, n + 1)[1:, None]
    return ((1 - t) ** 2 * p0 + 2 * (1 - t) * t * p1 + t ** 2 * p2).tolist()

def parse_path(d):
    """Absolute+relative M/L/H/V/C/Z -> list of subpath polylines (list of (x,y))."""
    toks = TOK.findall(d)
    i = 0; cmd = None; cur = np.array([0., 0.]); start = cur.copy(); subs = []; pts = []
    def num():
        nonlocal i
        v = float(toks[i]); i += 1; return v
    while i < len(toks):
        if re.match(r'[A-Za-z]', toks[i]):
            cmd = toks[i]; i += 1
            if cmd in 'Zz':
                if pts: subs.append(pts); pts = []
                cur = start.copy(); continue
        rel = cmd.islower(); c = cmd.upper()
        if c == 'M':
            p = np.array([num(), num()]) + (cur if rel else 0)
            if pts: subs.append(pts)
            pts = [p.tolist()]; cur = p; start = p.copy(); cmd = 'l' if rel else 'L'
        elif c == 'L':
            p = np.array([num(), num()]) + (cur if rel else 0); pts.append(p.tolist()); cur = p
        elif c == 'H':
            x = num() + (cur[0] if rel else 0); cur = np.array([x, cur[1]]); pts.append(cur.tolist())
        elif c == 'V':
            y = num() + (cur[1] if rel else 0); cur = np.array([cur[0], y]); pts.append(cur.tolist())
        elif c == 'C':
            a = np.array([num(), num()]); b = np.array([num(), num()]); e = np.array([num(), num()])
            if rel: a, b, e = a + cur, b + cur, e + cur
            pts += cubic(cur, a, b, e); cur = e
        else:
            raise ValueError('unsupported cmd ' + cmd)
    if pts: subs.append(pts)
    return subs

def raster(subs, W, H, tx=0.0, ty=0.0, s=1.0, ss=1):
    """Even-odd fill of polylines (after p*s + t) into a WxH bool mask; ss = supersampling factor."""
    acc = np.zeros((H * ss, W * ss), bool)
    for poly in subs:
        if len(poly) < 3: continue
        im = Image.new('1', (W * ss, H * ss), 0)
        ImageDraw.Draw(im).polygon([((x * s + tx) * ss, (y * s + ty) * ss) for x, y in poly], fill=1)
        acc ^= np.asarray(im, bool)
    if ss > 1:
        acc = acc.reshape(H, ss, W, ss).mean(axis=(1, 3)) >= 0.5
    return acc

def bbox(subs):
    a = np.array([p for s in subs for p in s]); return a[:, 0].min(), a[:, 1].min(), a[:, 0].max(), a[:, 1].max()
