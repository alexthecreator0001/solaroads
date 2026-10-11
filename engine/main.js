// Page bootstrap: loads a film module, exposes window.__frame(f) for the capture tool
// and a scrubbable preview when opened in a normal browser.
import { W, H, FPS } from './core.js';

const q = new URLSearchParams(location.search);
const scale = Number(q.get('scale')) || 1;
const wid = q.get('w') || 'preview';
const filmName = q.get('film') || 'film';

const canvas = document.getElementById('c');
canvas.width = Math.round(W * scale);
canvas.height = Math.round(H * scale);
const ctx = canvas.getContext('2d', { willReadFrequently: true, colorSpace: 'srgb' });

const film = (await import(`../scenes/${filmName}.js`)).default;
await film.load?.({ scale });

function drawAt(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';
  ctx.filter = 'none';
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.fillStyle = '#FFFFFF';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.setTransform(scale, 0, 0, scale, 0, 0);
  film.draw(ctx, t);
}

const total = Math.round(film.duration * FPS);
let acc = null;

async function renderFrame(f) {
  const n = Math.max(1, Math.round(film.samples ? film.samples(f / FPS) : 1));
  const shutter = film.shutter ?? 0.5;
  if (film.prepare) await film.prepare(f / FPS);
  if (n === 1) {
    drawAt(f / FPS);
    return ctx.getImageData(0, 0, canvas.width, canvas.height);
  }
  const len = canvas.width * canvas.height * 4;
  if (!acc || acc.length !== len) acc = new Uint32Array(len);
  acc.fill(0);
  for (let k = 0; k < n; k++) {
    const t = (f + ((k + 0.5) / n - 0.5) * shutter) / FPS;
    if (film.prepare) await film.prepare(t);
    drawAt(t);
    const d = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let i = 0; i < len; i++) acc[i] += d[i];
  }
  const out = ctx.createImageData(canvas.width, canvas.height);
  const o = out.data;
  for (let i = 0; i < len; i++) o[i] = acc[i] / n;
  ctx.putImageData(out, 0, 0);
  return out;
}

window.__info = () => ({ width: canvas.width, height: canvas.height, fps: FPS, frames: total, duration: film.duration });
window.__cues = () => (film.cues ? film.cues() : []);
window.__frame = async (f) => {
  const img = await renderFrame(f);
  if (wid !== 'preview') await fetch(`/frame?f=${f}&w=${wid}`, { method: 'POST', body: new Blob([img.data]) });
  return true;
};

// interactive preview: ?film=x  (space = play/pause, arrows = step, click = scrub)
if (wid === 'preview') {
  let f = Number(q.get('f') || 0), playing = false;
  const show = async () => { await renderFrame(f); document.title = `${f} / ${total}  (${(f / FPS).toFixed(2)}s)`; };
  addEventListener('keydown', (e) => {
    if (e.key === ' ') playing = !playing;
    if (e.key === 'ArrowRight') f = Math.min(total - 1, f + (e.shiftKey ? 10 : 1));
    if (e.key === 'ArrowLeft') f = Math.max(0, f - (e.shiftKey ? 10 : 1));
    show();
  });
  canvas.addEventListener('click', (e) => { f = Math.floor((e.offsetX / canvas.clientWidth) * total); show(); });
  const loop = async () => { if (playing) { f = (f + 1) % total; await show(); } requestAnimationFrame(loop); };
  show();
  loop();
}

window.__ready = true;
