# FomoDesk animated logo

| | Icon | Logo, black text (light bg) | Logo, white text (dark bg) |
|---|---|---|---|
| SVG (web) | `fomodesk-icon-animated.svg` | `fomodesk-logo-animated-black.svg` | `fomodesk-logo-animated-white.svg` |
| Lottie | `lottie/fomodesk-icon.json` | `lottie/fomodesk-logo-black.json` | `lottie/fomodesk-logo-white.json` |
| MP4 | `mp4/fomodesk-icon-on-white.mp4`, `mp4/fomodesk-icon-on-black.mp4` | `mp4/fomodesk-logo-black-on-white.mp4` | `mp4/fomodesk-logo-white-on-black.mp4` |

Intro takes ~1.6 s, then the candles float gently. `preview.html` shows the SVGs on light and dark.

**SVG**: use in an `<img>` or inline. Plays once on load, then floats; static logo under `prefers-reduced-motion`.

**Lottie**: 60 fps, 276 frames. Markers: `intro` (0–96) and `loop` (96–276, seamless). Looping the whole
file replays the intro every 4.6 s; to play the intro once and then keep floating (lottie-web):

```js
const anim = lottie.loadAnimation({ container, renderer: 'svg', loop: true, autoplay: false, path: 'fomodesk-icon.json' });
anim.addEventListener('DOMLoaded', () => anim.playSegments([[0, 96], [96, 276]], true));
```

On iOS/Android play `0…96` once, then loop `96…276` (or the `intro` / `loop` markers).
