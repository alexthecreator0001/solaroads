#!/usr/bin/env python3
"""Arrange the Solaro soundtrack: picture-synced cues exported by the film (each section declares
its own foley cues) + a music/ambience bed written against the section map, then mix + master.

  node tools/render.mjs --film film --cues audio/cues_film.json --cuesOnly --q "lang=sk"
  python3 audio/arrange.py audio/cues_film.json audio/solaro_mix.wav

Mastering: ffmpeg loudnorm two-pass to -14 LUFS integrated, -1.0 dBTP (social placements).
"""
import json, sys, subprocess, os, math
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import synth
import numpy as np

FPS = 60
fr = lambda f: f / FPS

# section map (frames) — keep in sync with research/STORYBOARD.md
S = dict(open=(0, 72), spark=(72, 138), fire=(138, 222), bolt=(222, 344), light=(344, 480), sun=(480, 648), solaro=(648, 736), lockup=(736, 888))
E_HZ = 82.41  # key: E (the logo chord is E add9)


def bed():
    c = []
    add = lambda f, kind, **kw: c.append(dict(t=fr(f), kind=kind, **kw))
    # chapter thumps (sub) on every section start except the lockup (the chord lands there)
    for name, (a, b) in S.items():
        if name in ('open', 'lockup'):
            continue
        add(a + 1, 'kick', gain=-10, f0=120, f1=40, verb=0.05)
    # fire: low flutter bed under the montage
    add(140, 'fire', dur=1.35, gain=-14, verb=0.2)
    # lightning + early electricity: mains hum under the sequencer, rising bass pulse
    add(296, 'buzz', dur=0.85, gain=-19, verb=0.1)
    for i, f in enumerate(range(300, 344, 8)):
        add(f, 'bass', freq=E_HZ / 2 * (1 if i % 2 == 0 else 1.5), dur=0.12, gain=-12)
    # light: warm pad under the word, hum as the bulb forms
    add(350, 'pad', freqs=[E_HZ * 2, E_HZ * 2.5, E_HZ * 3], dur=1.4, cutoff0=400, cutoff1=2200, attack=0.25, gain=-18, verb=0.4)
    # grid montage: ticking 16ths that accelerate with the cuts
    t = 430
    while t < 480:
        add(t, 'hat', gain=-22, verb=0.05)
        t += 5 if t < 455 else 3
    # sun: riser + opening pad (E major colour), cut to air before the word
    add(486, 'riser', dur=(611 - 486) / FPS, f0=180, f1=2600, gain=-14, verb=0.3)
    add(482, 'pad', freqs=[E_HZ * 2, E_HZ * 3, E_HZ * 4, E_HZ * 5], dur=2.1, cutoff0=500, cutoff1=5200, attack=0.9, gain=-17, verb=0.5)
    t = 504
    while t < 600:
        add(t, 'hat', gain=-21)
        t += 6 if t < 560 else (3 if t < 580 else 2)
    add(612, 'shimmer', dur=0.6, base=1318.5, gain=-24, verb=0.6)
    # solaro: shimmer swell over the flip, low thunk at the merge
    add(686, 'shimmer', dur=0.9, base=1318.5, gain=-20, verb=0.5)
    add(712, 'sub', dur=0.5, freq=E_HZ / 2, gain=-12)
    return c


def main():
    src, out = sys.argv[1], sys.argv[2]
    spec = json.load(open(src))
    cues = []
    for c in spec['cues']:
        c = dict(c)
        c['t'] = c.get('t', c['f'] / FPS)
        cues.append(c)
    cues += bed()
    cues.sort(key=lambda c: c['t'])
    dur = spec.get('duration', 888 / FPS)
    mix = synth.render(cues, dur)
    mix = synth.norm(mix, 0.89)
    raw = out.replace('.wav', '.raw.wav')
    synth.write_wav(raw, mix)
    # two-pass loudnorm
    r = subprocess.run(['ffmpeg', '-hide_banner', '-i', raw, '-af', 'loudnorm=I=-14:TP=-1.0:LRA=7:print_format=json', '-f', 'null', '-'], capture_output=True, text=True)
    js = r.stderr[r.stderr.rfind('{'):r.stderr.rfind('}') + 1]
    m = json.loads(js)
    af = (f"loudnorm=I=-14:TP=-1.0:LRA=7:measured_I={m['input_i']}:measured_TP={m['input_tp']}:measured_LRA={m['input_lra']}:"
          f"measured_thresh={m['input_thresh']}:offset={m['target_offset']}:linear=true")
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', raw, '-af', af, '-ar', '48000', out], check=True)
    print('wrote', out, f"(in {m['input_i']} LUFS)")


if __name__ == '__main__':
    main()
