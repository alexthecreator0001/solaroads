# Solaro logo animation (website intro)

A short intro for the Solaro logo. It plays once on page load and stops on the finished logo.

| File | What |
|---|---|
| `solaro-logo.json` | Lottie, full lockup. 1866 × 449, 1.8 s at 60 fps, 10 KB, transparent |
| `solaro-mark.json` | Lottie, mark only. 449 × 449, 1.1 s, 4 KB, transparent |
| `solaro-logo.mp4` | 1920 × 1080 on white, logo centred. 1.8 s animation + 1 s hold, H.264 |
| `solaro-mark.mp4` | 1080 × 1080 on white. 1.1 s animation + 1 s hold, H.264 |
| `index.html` | Demo page (serve the folder, e.g. `npx serve logo-animation`) |
| `build.mjs` / `render.mjs` | Generator and renderer (see *Rebuild*) |

**Motion**
1. The four cells bloom out of the centre one after another, clockwise from the ring (the sun), with a slight swirl.
2. They land packed together with no gap, so their inner curves cut a white ✦ glint into the middle.
3. The cells spring apart to the real gap, and the ✦ opens into the "+" of the logo.
4. The letters of *Solaro* rise one by one from a hidden horizon at the baseline, like a sunrise.

The geometry is read from `assets/solaro-logo.svg`, so the last frame is the static logo: flat `#FF5E2B` mark and `#1C1C1C` wordmark.
Nothing moves outside the logo's own box (1866 × 449 / 449 × 449). The Lottie can take the exact slot of the static logo, at the same aspect ratio.

## Embed: Lottie (recommended: sharp at any size, transparent, 10 KB)

```html
<a href="/" class="site-logo" aria-label="Solaro"></a>

<style>.site-logo { display: block; width: 180px; aspect-ratio: 1866 / 449; }</style>
<script src="https://cdn.jsdelivr.net/npm/lottie-web@5.13.0/build/player/lottie_light.min.js"></script>
<script>
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const logo = lottie.loadAnimation({
    container: document.querySelector('.site-logo'),
    renderer: 'svg', loop: false, autoplay: !reduce,
    path: '/assets/solaro-logo.json',
  });
  // Visitors who turned animations off get the finished logo straight away
  if (reduce) logo.addEventListener('DOMLoaded', () => logo.goToAndStop(logo.totalFrames - 1, true));
</script>
```

The JSON also works as is in WordPress (Elementor's Lottie widget, LottieFiles plugin), Webflow, Framer and `<dotlottie-player>`. Set the player to *loop off* and *autoplay on*.

## Embed: MP4

```html
<video src="/assets/solaro-logo.mp4" autoplay muted playsinline
       style="width: 100%; height: auto; mix-blend-mode: multiply" aria-label="Solaro"></video>
```

- Browsers only autoplay video that is `muted`, and iOS also needs `playsinline`. Leave out `loop` so the video stops on the logo.
- MP4 cannot be transparent, so the frame is white. `mix-blend-mode: multiply` makes the white disappear on any light background. For dark backgrounds or a header logo, use the Lottie.

## Rebuild

```
npm install
node logo-animation/build.mjs
node logo-animation/render.mjs --src solaro-logo.json --size 1920x1080 --box 1200 --hold 1 --out logo-animation/solaro-logo.mp4
node logo-animation/render.mjs --src solaro-mark.json --size 1080x1080 --box 560 --hold 1 --out logo-animation/solaro-mark.mp4
```

The timing, easing curves and colours are constants at the top of `build.mjs`. `render.mjs` drives lottie-web in headless Chromium, so the videos are frame-for-frame renders of the Lottie. It can also write PNG frames (`--png DIR`) or a transparent VP9 WebM (`--bg transparent --out x.webm`). Safari does not show WebM alpha, though.
