// Deterministic frame renderer: drives engine/index.html in headless Chromium,
// pulls raw RGBA pixels per frame over a local HTTP POST and pipes them to ffmpeg.
//
// Usage:
//   node tools/render.mjs --out out/solaro.mp4            full film (H.264)
//   node tools/render.mjs --from 120 --to 240 --out x.mp4 frame range
//   node tools/render.mjs --frames 0,60,333 --png out/check   single PNG stills
//   node tools/render.mjs --png out/frames --from 0 --to 900  PNG sequence
//   --workers N   split the range over N browser pages (default 2)
//   --scale 0.5   render at reduced resolution for fast previews
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node22/lib/node_modules/playwright');

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = Object.fromEntries(
  process.argv.slice(2).reduce((acc, a, i, all) => {
    if (a.startsWith('--')) acc.push([a.slice(2), all[i + 1] && !all[i + 1].startsWith('--') ? all[i + 1] : true]);
    return acc;
  }, [])
);

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.otf': 'font/otf', '.woff2': 'font/woff2', '.css': 'text/css' };

// frame sinks keyed by worker id
const sinks = new Map();

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      const url = new URL(req.url, 'http://x');
      if (req.method === 'POST' && url.pathname === '/frame') {
        const chunks = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', async () => {
          const buf = Buffer.concat(chunks);
          const sink = sinks.get(url.searchParams.get('w'));
          await sink(Number(url.searchParams.get('f')), buf);
          res.writeHead(200);
          res.end('ok');
        });
        return;
      }
      const p = path.join(ROOT, decodeURIComponent(url.pathname));
      if (!p.startsWith(ROOT) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) {
        res.writeHead(404);
        res.end();
        return;
      }
      res.writeHead(200, { 'Content-Type': MIME[path.extname(p).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      fs.createReadStream(p).pipe(res);
    });
    server.listen(0, '127.0.0.1', () => resolve(server));
  });
}

function ffmpegVideo(out, w, h, fps, crf) {
  const ff = spawn('ffmpeg', [
    '-y', '-loglevel', 'error',
    '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${w}x${h}`, '-r', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', String(crf), '-pix_fmt', 'yuv420p',
    '-x264-params', 'keyint=60:min-keyint=60', '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'inherit'] });
  return ff;
}

function writePng(file, w, h, buf) {
  return new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${w}x${h}`, '-i', '-', '-frames:v', '1', file]);
    ff.on('exit', (c) => (c === 0 ? resolve() : reject(new Error('ffmpeg png failed'))));
    ff.stdin.end(buf);
  });
}

async function main() {
  const server = await startServer();
  const port = server.address().port;
  const scale = Number(args.scale || 1);
  const browser = await chromium.launch({
    executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
    args: ['--use-gl=angle', '--use-angle=swiftshader-webgl', '--enable-unsafe-swiftshader', '--disable-gpu-vsync', '--force-color-profile=srgb', '--font-render-hinting=none', '--disable-lcd-text'],
  });
  const mkPage = async (wid) => {
    const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning' || args.verbose) console.log(`[page ${wid}] ${m.text()}`); });
    page.on('pageerror', (e) => console.error(`[page ${wid}] ERROR`, e));
    await page.goto(`http://127.0.0.1:${port}/engine/index.html?scale=${scale}&w=${wid}${args.film ? `&film=${args.film}` : ''}`);
    await page.waitForFunction(() => window.__ready === true, null, { timeout: 120000 });
    return page;
  };

  const probe = await mkPage('probe');
  const info = await probe.evaluate(() => window.__info());
  if (args.cues) { fs.writeFileSync(args.cues, JSON.stringify({ duration: info.duration, cues: await probe.evaluate(() => window.__cues()) }, null, 1)); console.log('wrote cues', args.cues); if (args.cuesOnly) { await browser.close(); server.close(); return; } }
  await probe.close();
  const W = info.width, H = info.height, FPS = info.fps;
  console.log(`film: ${info.frames} frames @ ${FPS}fps, ${W}x${H}`);

  let frames;
  if (args.frames) frames = String(args.frames).split(',').map(Number);
  else {
    const from = Number(args.from ?? 0), to = Number(args.to ?? info.frames);
    frames = [];
    for (let f = from; f < to; f++) frames.push(f);
  }

  const t0 = Date.now();
  if (args.png) {
    fs.mkdirSync(args.png, { recursive: true });
    const workers = Math.max(1, Math.min(Number(args.workers || 2), frames.length));
    let next = 0, done = 0;
    await Promise.all(Array.from({ length: workers }, async (_, wi) => {
      const wid = `p${wi}`;
      sinks.set(wid, async (f, buf) => {
        await writePng(path.join(args.png, `f${String(f).padStart(4, '0')}.png`), W, H, buf);
      });
      const page = await mkPage(wid);
      while (next < frames.length) {
        const f = frames[next++];
        await page.evaluate((f) => window.__frame(f), f);
        if (++done % 30 === 0) console.log(`  ${done}/${frames.length}  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
      }
      await page.close();
    }));
  } else {
    const out = args.out || path.join(ROOT, 'out', 'preview.mp4');
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const workers = Math.max(1, Math.min(Number(args.workers || 2), Math.ceil(frames.length / 30)));
    // split into contiguous chunks, each encoded separately (lossless intermediate), then concatenated
    const tmpDir = path.join(ROOT, 'out', 'tmp');
    fs.mkdirSync(tmpDir, { recursive: true });
    const chunk = Math.ceil(frames.length / workers);
    let done = 0;
    const parts = await Promise.all(Array.from({ length: workers }, async (_, wi) => {
      const part = frames.slice(wi * chunk, (wi + 1) * chunk);
      const file = path.join(tmpDir, `part${wi}.mkv`);
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgba', '-s', `${W}x${H}`, '-r', String(FPS), '-i', '-', '-c:v', 'ffv1', '-level', '3', '-pix_fmt', 'bgr0', file], { stdio: ['pipe', 'inherit', 'inherit'] });
      const closed = new Promise((r) => ff.on('exit', r));
      const wid = `v${wi}`;
      sinks.set(wid, (f, buf) => new Promise((r) => { if (!ff.stdin.write(buf)) ff.stdin.once('drain', r); else r(); }));
      const page = await mkPage(wid);
      for (const f of part) {
        await page.evaluate((f) => window.__frame(f), f);
        if (++done % 60 === 0) console.log(`  ${done}/${frames.length}  ${((Date.now() - t0) / done).toFixed(0)} ms/frame`);
      }
      ff.stdin.end();
      await closed;
      await page.close();
      return file;
    }));
    const list = path.join(tmpDir, 'list.txt');
    fs.writeFileSync(list, parts.map((p) => `file '${p}'`).join('\n'));
    const master = out.replace(/\.mp4$/, '.master.mkv');
    await new Promise((r, j) => spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', master], { stdio: 'inherit' }).on('exit', (c) => (c ? j(new Error('concat')) : r())));
    const enc = ['-y', '-loglevel', 'error', '-i', master];
    if (args.audio) enc.push('-i', args.audio, '-map', '0:v', '-map', '1:a', '-c:a', 'aac', '-b:a', '256k', '-shortest');
    enc.push('-vf', 'scale=out_color_matrix=bt709:out_range=tv:flags=spline+accurate_rnd+full_chroma_int', '-c:v', 'libx264', '-preset', 'slow', '-crf', String(args.crf || 12), '-pix_fmt', 'yuv420p', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-movflags', '+faststart', out);
    await new Promise((r, j) => spawn('ffmpeg', enc, { stdio: 'inherit' }).on('exit', (c) => (c ? j(new Error('encode')) : r())));
    console.log(`wrote ${out} (master ${master})`);
  }
  console.log(`rendered ${frames.length} frames in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
  await browser.close();
  server.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
