#!/usr/bin/env python3
"""Original sound design for the Solaro ad — every sound is synthesised here (no samples,
no licensed audio). A cue sheet (JSON list of {t, kind, ...params}) is rendered to a stereo
48 kHz mix, then mastered with ffmpeg (loudnorm to -14 LUFS, -1 dBTP).

  python3 audio/synth.py audio/cues.json audio/solaro_mix.wav
"""
import json, sys, math
import numpy as np
from scipy import signal

SR = 48000
RNG = np.random.default_rng(7)


def t_axis(dur):
    return np.arange(int(dur * SR)) / SR


def env_adsr(n, a=0.002, d=0.1, s=0.0, r=0.05, sustain_time=0.0):
    a_n, d_n, s_n, r_n = int(a * SR), int(d * SR), int(sustain_time * SR), int(r * SR)
    e = np.concatenate([np.linspace(0, 1, max(1, a_n), endpoint=False), np.linspace(1, s, max(1, d_n), endpoint=False), np.full(s_n, s), np.linspace(s, 0, max(1, r_n))])
    if len(e) < n:
        e = np.concatenate([e, np.zeros(n - len(e))])
    return e[:n]


def expdecay(n, tau):
    return np.exp(-np.arange(n) / (tau * SR))


def bq(x, kind, f, q=0.707, order=2):
    f = np.clip(f, 20, SR / 2 - 100)
    if kind == 'lp':
        sos = signal.butter(order, f, 'lowpass', fs=SR, output='sos')
    elif kind == 'hp':
        sos = signal.butter(order, f, 'highpass', fs=SR, output='sos')
    elif kind == 'bp':
        bw = f / q
        sos = signal.butter(order, [max(20, f - bw / 2), min(SR / 2 - 100, f + bw / 2)], 'bandpass', fs=SR, output='sos')
    return signal.sosfilt(sos, x)


def sweep_filter(x, kind, f0, f1, q=1.0, blocks=64):
    """time-varying filter by block crossfade (cheap, smooth enough)"""
    n = len(x)
    out = np.zeros(n)
    edges = np.linspace(0, n, blocks + 1).astype(int)
    for i in range(blocks):
        a, b = edges[i], edges[i + 1]
        pad = min(a, 2048)
        f = f0 * (f1 / f0) ** ((i + 0.5) / blocks)
        y = bq(x[a - pad:b], kind, f, q)
        out[a:b] = y[pad:]
    return out


def noise(n, color='white'):
    w = RNG.standard_normal(n)
    if color == 'pink':
        b, a = [0.049922035, -0.095993537, 0.050612699, -0.004408786], [1, -2.494956002, 2.017265875, -0.522189400]
        w = signal.lfilter(b, a, w) * 4
    elif color == 'brown':
        w = np.cumsum(w)
        w = w - signal.savgol_filter(w, 4001 if n > 4001 else (n // 2) * 2 - 1, 2) if n > 11 else w
        w /= (np.abs(w).max() + 1e-9)
    return w


def saw(freq, t):
    ph = np.cumsum(np.broadcast_to(freq, t.shape) / SR)
    return 2 * (ph % 1) - 1


def norm(x, peak=1.0):
    m = np.abs(x).max()
    return x * (peak / m) if m > 0 else x


# ---------------------------------------------------------------- instruments (mono unless noted)

def kick(dur=0.45, f0=150, f1=42, punch=1.0):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.035)
    ph = 2 * np.pi * np.cumsum(f) / SR
    body = np.sin(ph) * expdecay(len(t), 0.16)
    click = bq(noise(len(t)), 'hp', 2500) * expdecay(len(t), 0.004) * 0.35 * punch
    return np.tanh((body + click) * 1.6) * 0.9


def tick(dur=0.05, f=3200, bright=1.0):
    t = t_axis(dur)
    n = bq(noise(len(t)), 'bp', f, q=2.5) * expdecay(len(t), 0.006) * 1.6
    blip = np.sin(2 * np.pi * f * 1.5 * t) * expdecay(len(t), 0.004) * 0.4 * bright
    return n + blip


def hat(dur=0.08, open_=False):
    t = t_axis(dur if not open_ else 0.3)
    x = bq(noise(len(t)), 'hp', 7000, order=4) * expdecay(len(t), 0.025 if not open_ else 0.11)
    return x * 0.6


def clap(dur=0.3):
    t = t_axis(dur)
    x = np.zeros(len(t))
    for k, off in enumerate([0, 0.011, 0.023, 0.034]):
        i = int(off * SR)
        seg = noise(len(t) - i) * expdecay(len(t) - i, 0.007 if k < 3 else 0.08)
        x[i:] += seg
    return bq(x, 'bp', 1400, q=0.8) * 0.9


def pop(dur=0.09, f0=1100, f1=320):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.012)
    return np.sin(2 * np.pi * np.cumsum(f) / SR) * expdecay(len(t), 0.03)


def stone(dur=0.35, f=2300):
    """two flint stones striking: hard resonant 'tok' + body"""
    t = t_axis(dur)
    hit = bq(noise(len(t)), 'bp', f, q=6) * expdecay(len(t), 0.012) * 2.2
    hit += bq(noise(len(t)), 'bp', f * 1.73, q=8) * expdecay(len(t), 0.008) * 1.2
    body = np.sin(2 * np.pi * 180 * t) * expdecay(len(t), 0.03) * 0.5
    return hit + body


def crackle(dur=0.6, density=90, seed=1, bright=1.0):
    """sparks: sparse micro-impulses, decaying density"""
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    x = np.zeros(n)
    count = int(density * dur)
    pos = (r.random(count) ** 2.2 * n).astype(int)
    for p in pos:
        L = int(r.uniform(0.0006, 0.004) * SR)
        if p + L >= n:
            continue
        x[p:p + L] += r.standard_normal(L) * np.exp(-np.arange(L) / (L * 0.25)) * r.uniform(0.3, 1.0) * (1 - p / n)
    return bq(x, 'hp', 1800 * bright) * 1.4


def whoosh(dur=0.5, f0=400, f1=4000, q=1.2, shape='swell'):
    n = int(dur * SR)
    x = sweep_filter(noise(n, 'pink'), 'bp', f0, f1, q=q)
    t = np.linspace(0, 1, n)
    e = np.sin(np.pi * t) ** 1.5 if shape == 'swell' else (t ** 2.5 if shape == 'in' else (1 - t) ** 2)
    return x * e * 1.5


def fire(dur=0.9):
    """'fwoomp' ignition: low noise swell + flutter"""
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    x = bq(noise(n, 'brown'), 'lp', 900) * 2.0
    flutter = 1 + 0.35 * np.sin(2 * np.pi * 13 * t * dur) * (1 - t)
    e = (1 - np.exp(-t * 25)) * np.exp(-t * 3.2)
    return x * e * flutter + crackle(dur, 60, seed=4) * 0.25


def thunder(dur=1.4):
    n = int(dur * SR)
    crack = bq(noise(n), 'hp', 1200) * expdecay(n, 0.03) * 1.5
    rumble = bq(noise(n, 'brown'), 'lp', 220, order=4) * expdecay(n, 0.45) * 3.0
    zap = np.sign(np.sin(2 * np.pi * (90 + 400 * np.exp(-np.arange(n) / (0.05 * SR))) * np.arange(n) / SR)) * expdecay(n, 0.05) * 0.35
    return crack + rumble + bq(zap, 'lp', 3500)


def buzz(dur=0.8, f=50.0, grit=0.6):
    """mains hum (50 Hz, Europe) with harmonics and flicker"""
    t = t_axis(dur)
    x = sum(np.sin(2 * np.pi * f * k * t + k) / k ** 0.9 for k in range(1, 14))
    x = np.tanh(x * (1 + grit * 2))
    x = bq(x, 'lp', 2600)
    flick = 0.75 + 0.25 * np.sign(np.sin(2 * np.pi * 7.3 * t + np.sin(2 * np.pi * 2.1 * t) * 3))
    return x * flick * env_adsr(len(t), 0.01, 0.05, 1.0, 0.08, dur - 0.14) * 0.6


def zap(dur=0.18, f0=2400, f1=180):
    t = t_axis(dur)
    f = f1 + (f0 - f1) * np.exp(-t / 0.03)
    x = np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * 0.5 + bq(noise(len(t)), 'hp', 3000) * 0.4
    return bq(x, 'lp', 7000) * expdecay(len(t), 0.05)


def bell(dur=1.2, f=880.0, bright=1.0):
    t = t_axis(dur)
    partials = [(1, 1.0, 0.9), (2.0, 0.45, 0.6), (2.76, 0.35, 0.45), (4.07, 0.2 * bright, 0.25), (5.4, 0.12 * bright, 0.15)]
    x = sum(a * np.sin(2 * np.pi * f * r * t) * expdecay(len(t), d * dur / 1.2) for r, a, d in partials)
    return x * env_adsr(len(t), 0.002, 0.01, 1.0, 0.01, dur)


def pluck(f, dur=0.35, cutoff=2400, detune=0.004):
    t = t_axis(dur)
    x = saw(f * (1 + detune), t) + saw(f * (1 - detune), t) + 0.5 * np.sin(2 * np.pi * f / 2 * t)
    x = sweep_filter(x, 'lp', cutoff, 220, blocks=24)
    return x * expdecay(len(t), dur * 0.35) * 0.5


def bass(f, dur=0.25, drive=1.4):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * f * t) + 0.3 * saw(f, t)
    x = bq(x, 'lp', 900)
    return np.tanh(x * drive) * env_adsr(len(t), 0.004, 0.08, 0.6, 0.05, max(0.0, dur - 0.14)) * 0.8


def pad(freqs, dur=2.0, cutoff0=500, cutoff1=4000, attack=0.6):
    t = t_axis(dur)
    x = np.zeros(len(t))
    for f in freqs:
        for d in (-0.006, 0.0, 0.007):
            x += saw(f * (1 + d), t) * 0.3
    x = sweep_filter(x, 'lp', cutoff0, cutoff1, blocks=48)
    return x * env_adsr(len(t), attack, 0.2, 0.85, 0.5, max(0.0, dur - attack - 0.7)) * 0.35


def riser(dur=1.5, f0=200, f1=3200):
    n = int(dur * SR)
    t = np.linspace(0, 1, n)
    nz = sweep_filter(noise(n, 'pink'), 'bp', f0 * 2, f1 * 2, q=1.5)
    tone = saw(f0 * (f1 / f0) ** t, t_axis(dur))
    tone = sweep_filter(tone, 'lp', f0 * 3, f1 * 3)
    return (nz * 1.2 + tone * 0.25) * t ** 2.2


def impact(dur=1.6):
    n = int(dur * SR)
    t = t_axis(dur)
    boom = np.sin(2 * np.pi * np.cumsum(38 + 80 * np.exp(-t / 0.08)) / SR) * expdecay(n, 0.5)
    crack = bq(noise(n), 'hp', 2000) * expdecay(n, 0.02)
    air = bq(noise(n, 'pink'), 'bp', 5000, q=0.7) * expdecay(n, 0.35) * 0.3
    return np.tanh((boom * 1.4 + crack * 0.8 + air)) * 0.95


def shimmer(dur=1.5, base=1318.5):
    t = t_axis(dur)
    x = np.zeros(len(t))
    for i, r in enumerate([1, 1.5, 2, 3, 4]):
        x += np.sin(2 * np.pi * base * r * t + i) * (0.5 / (i + 1)) * (1 + 0.3 * np.sin(2 * np.pi * (5 + i) * t))
    return x * env_adsr(len(t), 0.3, 0.2, 0.6, 0.6, max(0.0, dur - 1.1)) * 0.4


INSTR = dict(kick=kick, tick=tick, hat=hat, clap=clap, pop=pop, stone=stone, crackle=crackle, whoosh=whoosh, fire=fire,
             thunder=thunder, buzz=buzz, zap=zap, bell=bell, pluck=pluck, bass=bass, pad=pad, riser=riser, impact=impact, shimmer=shimmer)


def chord(dur=2.2, root=82.41, bright=1.0):
    """bright add9 voicing (E by default) - the logo resolve. Sines + soft saws + bell top."""
    t = t_axis(dur)
    ratios = [1, 2, 3, 4, 4.5, 5, 6, 8, 9, 12]  # E2 E3 B3 E4 F#4 G#4 B4 E5 F#5 B5
    x = np.zeros(len(t))
    for i, r in enumerate(ratios):
        f = root * r
        amp = 0.5 / (1 + i * 0.25)
        x += amp * np.sin(2 * np.pi * f * t + i * 0.7)
        if i < 6:
            x += amp * 0.12 * saw(f * 1.002, t)
    x = bq(x, 'lp', 6000)
    top = bell(dur, root * 16, bright) * 0.18 + bell(dur, root * 24, bright) * 0.1
    e = env_adsr(len(t), 0.004, 0.25, 0.55, 0.9, max(0.0, dur - 1.2))
    return (x * e + top) * 0.5


def sub(dur=0.6, f=41.2):
    t = t_axis(dur)
    x = np.sin(2 * np.pi * f * t) * env_adsr(len(t), 0.005, 0.1, 0.8, 0.25, max(0.0, dur - 0.36))
    return x


def clunk(dur=0.25):
    """switch / relay: metallic click + low knock"""
    t = t_axis(dur)
    click = bq(noise(len(t)), 'bp', 3800, q=4) * expdecay(len(t), 0.004) * 2.0
    knock = np.sin(2 * np.pi * 120 * t) * expdecay(len(t), 0.035)
    ring = np.sin(2 * np.pi * 2650 * t) * expdecay(len(t), 0.02) * 0.2
    return click + knock + ring


def glint(dur=0.5, f=2637.0):
    """sparkle on glass/panels: two high partials with fast shimmer"""
    t = t_axis(dur)
    x = np.sin(2 * np.pi * f * t) + 0.6 * np.sin(2 * np.pi * f * 1.5 * t + 1)
    return x * expdecay(len(t), 0.09) * (1 + 0.3 * np.sin(2 * np.pi * 31 * t)) * 0.35


INSTR.update(chord=chord, sub=sub, clunk=clunk, glint=glint)


# ---------------------------------------------------------------- reverb (synthetic stereo IR, FFT convolution)

def reverb_ir(dur=1.6, tau=0.45, lp=6000, seed=11):
    n = int(dur * SR)
    r = np.random.default_rng(seed)
    irs = []
    for ch in range(2):
        x = r.standard_normal(n) * np.exp(-np.arange(n) / (tau * SR))
        x = bq(x, 'lp', lp)
        x[: int(0.012 * SR)] *= np.linspace(0, 1, int(0.012 * SR))
        irs.append(x / np.sqrt((x ** 2).sum()))
    return np.stack(irs)


def render(cues, total):
    n = int(total * SR) + SR * 2
    dry = np.zeros((2, n))
    send = np.zeros((2, n))
    for c in cues:
        kind = c['kind']
        params = {k: v for k, v in c.items() if k not in ('t', 'f', 'kind', 'gain', 'pan', 'verb', 'notes', 'section', 'freq')}
        if 'freq' in c:
            params['f'] = c['freq']
        x = INSTR[kind](**params)
        g = 10 ** (c.get('gain', 0) / 20)
        pan = c.get('pan', 0.0)
        L, R = math.cos((pan + 1) * math.pi / 4), math.sin((pan + 1) * math.pi / 4)
        i0 = int(c['t'] * SR)
        if i0 < 0:
            x = x[-i0:]; i0 = 0
        i1 = min(n, i0 + len(x))
        seg = x[: i1 - i0] * g
        dry[0, i0:i1] += seg * L * math.sqrt(2)
        dry[1, i0:i1] += seg * R * math.sqrt(2)
        v = c.get('verb', 0.15)
        send[0, i0:i1] += seg * v
        send[1, i0:i1] += seg * v
    ir = reverb_ir()
    wet = np.stack([signal.fftconvolve(send[ch], ir[ch])[:n] for ch in range(2)])
    mix = dry + wet * 0.9
    # glue: gentle bus saturation, then cut to length with short fade
    mix = np.tanh(mix * 0.9) / 0.9
    L = int(total * SR)
    mix = mix[:, :L]
    fade = int(0.25 * SR)
    mix[:, -fade:] *= np.linspace(1, 0, fade) ** 2
    return mix


def write_wav(path, x):
    import wave
    x = np.clip(x, -1, 1)
    pcm = (x.T * 32767).astype('<i2')
    with wave.open(path, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes(pcm.tobytes())


if __name__ == '__main__':
    spec = json.load(open(sys.argv[1]))
    mix = render(spec['cues'], spec['duration'])
    mix = norm(mix, 0.89)
    write_wav(sys.argv[2], mix)
    print('wrote', sys.argv[2], mix.shape[1] / SR, 's')
