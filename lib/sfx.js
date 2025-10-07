
const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";


export const SOUNDS = {
  START:      `${BP}/sounds/session-start.mp3`,
  FOCUS_END:  `${BP}/sounds/focus-end.mp3`,
  BREAK_END:  `${BP}/sounds/break-end.mp3`,
  WHITE_NOISE:`${BP}/sounds/white-noise.mp3`,
  NUDGE:      `${BP}/sounds/nudge.mp3`,
};

let _ctx = null;
function getCtx() {
  if (_ctx) return _ctx;
  if (typeof window === "undefined") return null;
  const Ctx = window.AudioContext || window.webkitAudioContext;
  try { _ctx = new Ctx(); } catch {}
  return _ctx;
}

function makeBeep() {
  return (freq = 880, ms = 140) => {
    const ctx = getCtx();
    if (!ctx) return;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    o.connect(g); g.connect(ctx.destination);
    g.gain.value = 0.04;
    o.start();
    setTimeout(() => o.stop(), ms);
  };
}
const beep = makeBeep();

export async function unlockAudioOnce() {
  const ctx = getCtx();
  try { await ctx?.resume?.(); } catch {}

  const primeList = [SOUNDS.START, SOUNDS.FOCUS_END, SOUNDS.BREAK_END, SOUNDS.WHITE_NOISE];
  for (const src of primeList) {
    try {
      const a = new Audio(src);
      a.preload = "auto";
      a.volume = 0;

      await a.play().catch(() => {});
      a.pause();
      a.currentTime = 0;
    } catch {}
  }
}

export function playSound(file = SOUNDS.FOCUS_END, volume = 0.6) {
  const src = file || SOUNDS.FOCUS_END;
  try {
    const a = new Audio(src);
    a.preload = "auto";
    a.volume = Math.max(0, Math.min(1, Number(volume) || 0));
    const p = a.play();
    if (p && typeof p.then === "function") {
      p.then(() => {
      }).catch(err => {
        console.warn("[Audio] blocked:", src, err?.message || err);
        beep(880, 140);
      });
    }
  } catch (e) {
    console.warn("[Audio] error:", src, e);
    beep(880, 140);
  }
}


export function makeWhiteNoise(src = SOUNDS.WHITE_NOISE, volume = 1.0) {
  const a = new Audio(src);
  a.loop = true;
  a.preload = "auto";
  a.volume = Math.max(0, Math.min(1, Number(volume) || 1));
  return a;
}


const _whiteNoiseMap = new WeakMap();
export function makeWhiteNoiseChain(src = SOUNDS.WHITE_NOISE, baseVolume = 1.0, boost = 1.5) {
  const el = new Audio(src);
  el.loop = true;
  el.preload = "auto";
  el.volume = Math.max(0, Math.min(1, Number(baseVolume) || 1));

  const ctx = getCtx();
  if (ctx) {
    try {
      const node = ctx.createMediaElementSource(el);
      const g = ctx.createGain();
      g.gain.value = Math.max(0, Number(boost) || 1); 
      node.connect(g).connect(ctx.destination);
      _whiteNoiseMap.set(el, g);
    } catch (e) {
      console.warn("[Audio] white-noise chain fallback:", e?.message || e);
    }
  }
  return el;
}
export function setWhiteNoiseBoost(el, boost = 1.0) {
  const g = _whiteNoiseMap.get(el);
  if (g) g.gain.value = Math.max(0, Number(boost) || 0);
}
