import subprocess, re, os, json, sys
UA = "SolaroAdResearch/1.0 (https://solaro.sk)"
out = sys.argv[1]
os.makedirs(out, exist_ok=True)
google = ["Poppins", "Outfit", "Urbanist", "Lexend", "Sora", "Figtree", "Onest", "Plus Jakarta Sans", "Red Hat Display", "Manrope",
          "Montserrat", "Geist", "DM Sans", "Albert Sans", "Kumbh Sans", "Gabarito", "Inter", "Hanken Grotesk", "Rethink Sans",
          "Lexend Deca", "Readex Pro", "Golos Text", "Mulish", "Nunito Sans", "Be Vietnam Pro", "Jost", "League Spartan",
          "Wix Madefor Display", "Instrument Sans", "Bricolage Grotesque", "Space Grotesk", "Epilogue", "Rubik", "Lato",
          "Palanquin Dark", "Hind", "Quicksand", "Nunito", "Afacad", "Gantari", "Arimo", "Questrial", "Varela Round",
          "Montserrat Alternates", "Encode Sans", "Sen", "Syne", "Unbounded", "Archivo", "Work Sans", "Raleway", "Mona Sans", "Funnel Display", "Host Grotesk", "Parkinsans", "SUSE"]
fontshare = ["satoshi", "general-sans", "clash-grotesk", "clash-display", "cabinet-grotesk", "switzer", "supreme", "chillax", "panchang", "plein", "britney", "bespoke-sans"]
weights = [500, 600, 700, 800, 900]
got = []
def curl(url, path=None):
    args = ["curl", "-sS", "-L", "--max-time", "60"]
    if path: args += ["-A", UA, "-o", path]
    args = [a for a in args]
    args += [url.replace(" ", "%20")]
    r = subprocess.run(args, capture_output=True, text=True)
    return r.stdout
for fam in google:
    for w in weights:
        fnx = f"{out}/G_{fam.replace(' ', '')}_{w}.ttf"
        if os.path.exists(fnx): got.append({'family': fam, 'weight': w, 'src': 'google', 'file': fnx, 'url': ''}); continue
        css = curl(f"https://fonts.googleapis.com/css2?family={fam.replace(' ', '+')}:wght@{w}")
        m = re.search(r"url\((https://fonts\.gstatic\.com/[^)]+\.ttf)\)", css)
        if not m: continue
        fn = f"{out}/G_{fam.replace(' ', '')}_{w}.ttf"
        curl(m.group(1), fn)
        got.append({"family": fam, "weight": w, "src": "google", "file": fn, "url": m.group(1)})
    print(fam, sum(1 for g in got if g['family'] == fam), flush=True)
for slug in fontshare:
    for w in weights:
        css = curl(f"https://api.fontshare.com/v2/css?f[]={slug}@{w}&display=swap")
        m = re.search(r"url\('(//cdn\.fontshare\.com/[^']+\.ttf)'\)", css)
        if not m: continue
        fam = re.search(r"font-family: '([^']+)'", css).group(1)
        fn = f"{out}/F_{slug}_{w}.ttf"
        curl("https:" + m.group(1), fn)
        if not os.path.exists(fn) or open(fn, 'rb').read(4) not in (b'\x00\x01\x00\x00', b'OTTO', b'true'):
            print('bad', fn); continue
        got.append({"family": fam, "weight": w, "src": "fontshare", "file": fn, "url": "https:" + m.group(1)})
    print(slug, sum(1 for g in got if g['src'] == 'fontshare' and slug in g['file']), flush=True)
json.dump(got, open(f"{out}/_fonts.json", "w"), indent=1)
print(len(got))
