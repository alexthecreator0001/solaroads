#!/usr/bin/env python3
"""Image treatment for the Solaro ad: everything ends up as crisp black & white on pure white.

  python3 tools/imgproc.py engrave IN OUT [--lo 3] [--hi 82] [--gamma 1.0] [--max 2400] [--trim]
      line art / engravings: paper levelled to #FFFFFF, ink to near-black. Output: grayscale JPG/PNG.
  python3 tools/imgproc.py photo IN OUT [--mix 0.35,0.5,0.15] [--contrast 1.25] [--max 2400]
      photographs: channel-mixed B&W with an S-curve. Output: grayscale.
  python3 tools/imgproc.py cutout IN OUT [--photo] [--feather 1.0] [--max 2000]
      object/figure isolated with BiRefNet (MIT, onnx-community/BiRefNet-ONNX). Output: RGBA PNG
      (grayscale content, soft alpha), trimmed to the subject.
"""
import argparse, sys, os
import numpy as np
from PIL import Image, ImageOps, ImageFilter

MODEL = os.path.join(os.path.dirname(__file__), 'models', 'birefnet.onnx')
_sess = None


def load(path, maxside):
    im = Image.open(path)
    im = ImageOps.exif_transpose(im)
    if im.mode in ('P', 'LA', 'RGBA', 'I;16', 'I', 'F', 'CMYK', 'L'):
        if im.mode == 'RGBA' or im.mode == 'LA':
            bg = Image.new('RGB', im.size, (255, 255, 255))
            bg.paste(im.convert('RGBA'), mask=im.convert('RGBA').split()[-1])
            im = bg
        else:
            im = im.convert('RGB')
    else:
        im = im.convert('RGB')
    if maxside and max(im.size) > maxside:
        s = maxside / max(im.size)
        im = im.resize((round(im.width * s), round(im.height * s)), Image.LANCZOS)
    return im


def to_gray(im, mix=(0.299, 0.587, 0.114)):
    a = np.asarray(im).astype(np.float32) / 255.0
    g = a[..., 0] * mix[0] + a[..., 1] * mix[1] + a[..., 2] * mix[2]
    return np.clip(g / max(1e-6, sum(mix)), 0, 1)


def levels(g, lo, hi, gamma=1.0):
    x = np.clip((g - lo) / max(1e-6, hi - lo), 0, 1)
    return x ** gamma


def scurve(x, k=1.25):
    # contrast around mid grey, smooth (logistic-ish but exact at 0 and 1)
    y = 0.5 + (x - 0.5) * k
    y = np.clip(y, 0, 1)
    return y * y * (3 - 2 * y) * 0.35 + y * 0.65


def save_gray(arr, out):
    im = Image.fromarray((np.clip(arr, 0, 1) * 255 + 0.5).astype(np.uint8), 'L')
    if out.lower().endswith('.jpg') or out.lower().endswith('.jpeg'):
        im.save(out, quality=95, subsampling=0)
    else:
        im.save(out, optimize=True)


def trim_box(mask, pad=8, thr=0.02):
    ys, xs = np.where(mask > thr)
    if not len(xs):
        return 0, 0, mask.shape[1], mask.shape[0]
    return max(0, xs.min() - pad), max(0, ys.min() - pad), min(mask.shape[1], xs.max() + pad + 1), min(mask.shape[0], ys.max() + pad + 1)


def cmd_engrave(a):
    im = load(a.inp, a.max)
    g = to_gray(im)
    lo = np.percentile(g, a.lo) if a.lo_abs is None else a.lo_abs
    hi = np.percentile(g, a.hi) if a.hi_abs is None else a.hi_abs
    x = levels(g, lo, hi, a.gamma)
    if a.sharpen:
        pil = Image.fromarray((x * 255).astype(np.uint8)).filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))
        x = np.asarray(pil).astype(np.float32) / 255
    if a.trim:
        x0, y0, x1, y1 = trim_box(1 - x, pad=24, thr=0.25)
        x = x[y0:y1, x0:x1]
    save_gray(x, a.out)
    print(f'engrave {a.inp} -> {a.out} lo={lo:.3f} hi={hi:.3f} size={x.shape[1]}x{x.shape[0]}')


def cmd_photo(a):
    im = load(a.inp, a.max)
    mix = tuple(float(v) for v in a.mix.split(','))
    g = to_gray(im, mix)
    lo, hi = np.percentile(g, a.lo), np.percentile(g, a.hi)
    x = scurve(levels(g, lo, hi, a.gamma), a.contrast)
    save_gray(x, a.out)
    print(f'photo {a.inp} -> {a.out} size={x.shape[1]}x{x.shape[0]}')


def birefnet_mask(im):
    global _sess
    import onnxruntime as ort
    if _sess is None:
        so = ort.SessionOptions()
        so.intra_op_num_threads = os.cpu_count() or 4
        _sess = ort.InferenceSession(MODEL, so, providers=['CPUExecutionProvider'])
    x = np.asarray(im.resize((1024, 1024), Image.BICUBIC)).astype(np.float32) / 255.0
    x = (x - np.array([0.485, 0.456, 0.406], np.float32)) / np.array([0.229, 0.224, 0.225], np.float32)
    x = x.transpose(2, 0, 1)[None]
    y = _sess.run(None, {_sess.get_inputs()[0].name: x})[0][0, 0]
    if y.min() < 0 or y.max() > 1:
        y = 1 / (1 + np.exp(-y))
    m = Image.fromarray((y * 255).astype(np.uint8)).resize(im.size, Image.BICUBIC)
    return np.asarray(m).astype(np.float32) / 255.0


def cmd_cutout(a):
    im = load(a.inp, a.max)
    m = birefnet_mask(im)
    # tighten the matte: crush faint haze, keep soft edges
    m = np.clip((m - a.cut) / (1 - 2 * a.cut), 0, 1)
    if a.feather > 0:
        mp = Image.fromarray((m * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(a.feather))
        m = np.asarray(mp).astype(np.float32) / 255
    if a.photo:
        mix = tuple(float(v) for v in a.mix.split(','))
        g = to_gray(im, mix)
        sel = g[m > 0.5] if (m > 0.5).any() else g.ravel()
        lo, hi = np.percentile(sel, 1), np.percentile(sel, 99.5)
        g = scurve(levels(g, lo, hi, a.gamma), a.contrast)
    else:
        g = to_gray(im)
        lo, hi = np.percentile(g, 2), np.percentile(g, 85)
        g = levels(g, lo, hi, a.gamma)
    x0, y0, x1, y1 = trim_box(m, pad=6)
    rgba = np.dstack([g, g, g, m])[y0:y1, x0:x1]
    Image.fromarray((rgba * 255 + 0.5).astype(np.uint8), 'RGBA').save(a.out, optimize=True)
    # matte preview on white for review
    print(f'cutout {a.inp} -> {a.out} size={x1 - x0}x{y1 - y0} coverage={(m > 0.5).mean():.2f}')


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest='cmd', required=True)
    e = sub.add_parser('engrave'); e.add_argument('inp'); e.add_argument('out')
    e.add_argument('--lo', type=float, default=2); e.add_argument('--hi', type=float, default=60)
    e.add_argument('--lo-abs', type=float, default=None); e.add_argument('--hi-abs', type=float, default=None)
    e.add_argument('--gamma', type=float, default=1.0); e.add_argument('--max', type=int, default=2400)
    e.add_argument('--trim', action='store_true'); e.add_argument('--sharpen', action='store_true')
    ph = sub.add_parser('photo'); ph.add_argument('inp'); ph.add_argument('out')
    ph.add_argument('--mix', default='0.35,0.5,0.15'); ph.add_argument('--contrast', type=float, default=1.2)
    ph.add_argument('--lo', type=float, default=0.5); ph.add_argument('--hi', type=float, default=99.5)
    ph.add_argument('--gamma', type=float, default=1.0); ph.add_argument('--max', type=int, default=2400)
    c = sub.add_parser('cutout'); c.add_argument('inp'); c.add_argument('out')
    c.add_argument('--photo', action='store_true'); c.add_argument('--mix', default='0.35,0.5,0.15')
    c.add_argument('--contrast', type=float, default=1.2); c.add_argument('--gamma', type=float, default=1.0)
    c.add_argument('--feather', type=float, default=0.6); c.add_argument('--cut', type=float, default=0.04)
    c.add_argument('--max', type=int, default=2000)
    a = p.parse_args()
    {'engrave': cmd_engrave, 'photo': cmd_photo, 'cutout': cmd_cutout}[a.cmd](a)


if __name__ == '__main__':
    main()
