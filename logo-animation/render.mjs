// Renders a Lottie file frame by frame with lottie-web in headless Chromium, so the videos are the Lottie itself.
//
//   node logo-animation/render.mjs --src solaro-logo.json --size 1920x1080 --box 1200 --hold 1 --out logo-animation/solaro-logo.mp4
//   node logo-animation/render.mjs --src solaro-logo.json --size 1920x462 --bg transparent --out out/solaro-logo.webm
//   node logo-animation/render.mjs --src solaro-logo.json --size 1920x1080 --png out/check --frames 0,20,40
//
//   --src           Lottie JSON (relative to logo-animation/); --out and --png are relative to the working directory
//   --size WxH      video frame size (px)
//   --box N         width of the Lottie inside the frame (px, centred); default = fills the frame
//   --bg            '#FFFFFF' (default) or 'transparent' (WebM / PNG only)
//   --hold S        seconds to hold the last frame at the end
//   --out           .mp4 (H.264, BT.709) or .webm (VP9, with alpha when --bg transparent)
//   --png DIR       write PNG stills instead; --frames picks which (default: all)
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, '..');
const { chromium } = require(fs.existsSync('/opt/node22/lib/node_modules/playwright') ? '/opt/node22/lib/node_modules/playwright' : 'playwright');
const CHROME = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const LOTTIE = path.join(ROOT, 'node_modules', 'lottie-web', 'build', 'player', 'lottie.min.js');

const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, [])
);

const src = path.resolve(HERE, args.src || 'solaro-logo.json');
const data = JSON.parse(fs.readFileSync(src, 'utf8'));
const [VW, VH] = String(args.size || '1920x1080').split('x').map(Number);
const bg = args.bg || '#FFFFFF';
const transparent = bg === 'transparent';
const boxW = Number(args.box || VW), boxH = (boxW * data.h) / data.w;
const holdFrames = Math.round(Number(args.hold || 0) * data.fr);

function encoder(out) {
  const common = ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', 'png', '-framerate', String(data.fr), '-i', '-'];
  if (out.endsWith('.webm')) {
    return spawn('ffmpeg', [...common,
      '-c:v', 'libvpx-vp9', '-pix_fmt', transparent ? 'yuva420p' : 'yuv420p', '-b:v', '0', '-crf', '22',
      '-row-mt', '1', '-auto-alt-ref', '0', '-deadline', 'good', '-cpu-used', '1', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  }
  if (transparent) throw new Error('MP4/H.264 has no alpha: use --out x.webm or a background colour');
  return spawn('ffmpeg', [...common,
    '-vf', 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p',
    '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '14',
    '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-color_range', 'tv',
    '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
}

const browser = await chromium.launch({
  ...(fs.existsSync(CHROME) ? { executablePath: CHROME } : {}),
  args: ['--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'],
});
const page = await browser.newPage({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
page.on('pageerror', (e) => console.error('[page]', e));
await page.setContent(`<!doctype html><html><body style="margin:0;background:${transparent ? 'transparent' : bg}">
  <div id="c" style="position:absolute;left:${(VW - boxW) / 2}px;top:${(VH - boxH) / 2}px;width:${boxW}px;height:${boxH}px"></div></body></html>`);
await page.addScriptTag({ path: LOTTIE });
await page.evaluate((animationData) => new Promise((resolve) => {
  window.anim = lottie.loadAnimation({ container: document.getElementById('c'), renderer: 'svg', loop: false, autoplay: false, animationData });
  if (window.anim.isLoaded) resolve(); else window.anim.addEventListener('DOMLoaded', resolve);
}), data);

const shot = async (f) => {
  await page.evaluate((f) => window.anim.goToAndStop(f, true), f);
  return page.screenshot({ type: 'png', omitBackground: transparent });
};

const total = data.op - data.ip;
if (args.png) {
  fs.mkdirSync(args.png, { recursive: true });
  const frames = args.frames ? String(args.frames).split(',').map(Number) : Array.from({ length: total }, (_, f) => f);
  for (const f of frames) fs.writeFileSync(path.join(args.png, `f${String(f).padStart(4, '0')}.png`), await shot(f));
  console.log(`wrote ${frames.length} PNGs to ${args.png}`);
} else {
  const out = path.resolve(args.out || 'out.mp4');
  const ff = encoder(out);
  const done = new Promise((resolve, reject) => ff.on('exit', (c) => (c === 0 ? resolve() : reject(new Error(`ffmpeg exited ${c}`)))));
  const write = (buf) => new Promise((r) => (ff.stdin.write(buf) ? r() : ff.stdin.once('drain', r)));
  let last;
  for (let f = 0; f < total; f++) await write((last = await shot(f)));
  for (let k = 0; k < holdFrames; k++) await write(last);
  ff.stdin.end();
  await done;
  console.log(`${path.relative(ROOT, out)}: ${VW}x${VH}, ${total + holdFrames} frames @ ${data.fr} fps (${((total + holdFrames) / data.fr).toFixed(2)} s), ${(fs.statSync(out).size / 1024).toFixed(0)} KB`);
}
await browser.close();
