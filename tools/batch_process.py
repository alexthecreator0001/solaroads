#!/usr/bin/env python3
"""Batch B&W treatment of all sourced images into assets/processed/<era>/.
Engravings/prints/patents -> 'engrave' (paper levelled to pure white); photos -> 'photo';
museum objects on plain backgrounds -> 'cutout' (BiRefNet matte, RGBA PNG).
  python3 tools/batch_process.py [--only cutout|flat] [--force]
"""
import os, sys, subprocess, json, re
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW, OUT = os.path.join(ROOT, 'assets/raw'), os.path.join(ROOT, 'assets/processed')

ENGRAVE = re.compile(r'engraving|hough1890|hough1928|figuier|patent|-obi|-ia$|wellcome$|woodcut|rijks|micrographia|freiburg|radford|goltzius|prometheus|ignis|tarocchi|punch|allegory|currier|philosopher-kite|kircher|scheiner|trouvelot|sunspot|burning|universal-sundial|sun-sizes|tracking-burning')
PHOTO_FORCE = re.compile(r'nasa|loc$|flickr|unsplash|wordpress|usda|tekniska|carter|luna-park|pylons-tva|pylon-vertical|bolt-|tesla-colorado|cave-hand|aten-rays|spiral-filament|vacuum-tube|bakelite|woman-dressed|edison-etching|tesla-portrait|xray|discharge-tube|leyden-jars-three|machine-hauksbee|machine-plate|machine-small|faraday-sparking|volta-pile-original|volta-pile-griffin|thales|amber|torpedo|eclipse-corona|leyden-nollet|machine-guericke|leyden-battery-64|leyden-jar-hand|galvani|suspended-boy|richmann|strike-building|oersted|gray-wheler|first-spark|kite-romas|spark-discharge|davy|volta-pile-column|volta-pile-crown|machine-cuthbertson|faraday-iron')
CUTOUT = [
    # spark-fire
    'spark-fire-flint-nodule-kulturparken', 'spark-fire-flint-core-met', 'spark-fire-handaxe-teardrop-acheulean-met', 'spark-fire-handaxe-red-acheulean-met',
    'spark-fire-handaxe-egypt-met', 'spark-fire-handaxe-paleolithic-cleveland', 'spark-fire-oil-lamp-roman-sunrays-met', 'spark-fire-oil-lamp-roman-plain-met',
    'spark-fire-oil-lamp-roman-face-met', 'spark-fire-oil-lamp-bronze-roman-cleveland', 'spark-fire-hand-marble-holding-met', 'spark-fire-hand-of-god-rodin-met',
    'spark-fire-hand-reaching-cast-met', 'spark-fire-torch-bearing-arm-met', 'spark-fire-fire-steel-oval-kulturparken', 'spark-fire-flint-striker-islamic-met',
    'spark-fire-lantern-pierced-tin-met', 'spark-fire-tinderbox-met',
    # lightning-early
    'lightning-early-leyden-jar-battery-smithsonian', 'lightning-early-volta-pile-original-wellcome', 'lightning-early-volta-pile-griffin-wellcome',
    'lightning-early-machine-plate-galvani-wellcome', 'lightning-early-machine-small-plate-galvani-wellcome', 'lightning-early-machine-hauksbee-wellcome',
    'lightning-early-leyden-jars-three-galvani-wellcome', 'lightning-early-amber-head-cleveland', 'lightning-early-faraday-sparking-coil-wellcome',
    # electric-age
    'electric-age-edison-lamp-new-type-smithsonian', 'electric-age-edison-lamp-stopper-smithsonian', 'electric-age-edison-lamp-bamboo-filament-smithsonian',
    'electric-age-insulator-cp-cd121-smithsonian', 'electric-age-insulator-hemingray-cd154-smithsonian', 'electric-age-telegraph-key-morse-vail-smithsonian',
    'electric-age-xray-tube-on-stand-wellcome', 'electric-age-discharge-tube-teardrop-wellcome', 'electric-age-arc-lamp-brush-two-carbons-smithsonian',
    # sun-solar
    'sun-solar-sundial-universal-ring-brass-met', 'sun-solar-sundial-horizontal-gnomon-1793-met', 'sun-solar-sundial-ivory-diptych-1598-met',
    'sun-solar-butterfield-sundial-object-cma', 'sun-solar-early-module-round-cells-dark-tekniska', 'sun-solar-early-module-round-cells-tall-tekniska',
    'sun-solar-sunflower-head-black-bg-1-wellcome', 'sun-solar-vanguard-model-satellite-1958-loc',
    # client
    'solaro/ev_type2_plug_vertical', 'solaro/inverter_huawei_solaro_sticker', 'solaro/battery_pylontech_stack', 'solaro/switchboard_dc_orange_open',
    'solaro/inverter_solax_on_wall',
]


def find(stem):
    for ext in ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'):
        for era in os.listdir(RAW):
            p = os.path.join(RAW, era, os.path.basename(stem) + ext) if '/' not in stem else os.path.join(RAW, stem + ext)
            if os.path.exists(p):
                return p
    return None


def run(args):
    r = subprocess.run([sys.executable, os.path.join(ROOT, 'tools/imgproc.py')] + args, capture_output=True, text=True)
    print((r.stdout or r.stderr).strip()[:200])


def main():
    only = sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None
    force = '--force' in sys.argv
    if only in (None, 'flat'):
        for era in sorted(os.listdir(RAW)):
            d = os.path.join(RAW, era)
            if not os.path.isdir(d) or era == 'solaro':
                continue
            os.makedirs(os.path.join(OUT, era), exist_ok=True)
            for f in sorted(os.listdir(d)):
                stem, ext = os.path.splitext(f)
                if ext.lower() not in ('.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'):
                    continue
                out = os.path.join(OUT, era, stem + '.jpg')
                if os.path.exists(out) and not force:
                    continue
                if ENGRAVE.search(stem) and not PHOTO_FORCE.search(stem):
                    run(['engrave', os.path.join(d, f), out, '--lo', '1.5', '--hi', '55', '--max', '2400'])
                else:
                    run(['photo', os.path.join(d, f), out, '--max', '2400'])
    if only in (None, 'cutout'):
        for stem in CUTOUT:
            src = find(stem)
            if not src:
                print('missing', stem); continue
            era = os.path.basename(os.path.dirname(src))
            os.makedirs(os.path.join(OUT, era), exist_ok=True)
            out = os.path.join(OUT, era, os.path.basename(stem) + '.cut.png')
            if os.path.exists(out) and not force:
                continue
            run(['cutout', src, out, '--photo', '--max', '2000'])


if __name__ == '__main__':
    main()
