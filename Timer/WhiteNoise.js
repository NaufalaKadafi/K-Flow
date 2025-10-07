"use client";
import React from "react";
import { Volume2, VolumeX } from "lucide-react";
import { SOUNDS, makeWhiteNoise, unlockAudioOnce } from "../lib/sfx";


export default function WhiteNoise() {
  const noiseRef = React.useRef(null);
  const [noiseOn, setNoiseOn] = React.useState(false);


  const playNoise = React.useCallback(async (shouldPlay = true) => {
    try {
      await unlockAudioOnce();
      if (!noiseRef.current) {

        noiseRef.current = makeWhiteNoise(SOUNDS.WHITE_NOISE, 0.5);
      }
      const audio = noiseRef.current;
      if (shouldPlay) audio.play().catch(() => {});
      else audio.pause();
    } catch (err) {
      console.warn("White noise gagal diputar:", err);
    }
  }, []);

  const toggleNoise = React.useCallback(() => {
    const next = !noiseOn;
    setNoiseOn(next);
    playNoise(next);
  }, [noiseOn, playNoise]);


  React.useEffect(() => {
    return () => {
      try {
        noiseRef.current?.pause();
      } catch {}
    };
  }, []);

  return (
    <button
      onClick={toggleNoise}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm ring-1 transition",
        noiseOn
          ? "bg-emerald-50 ring-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:ring-emerald-900/40 dark:text-emerald-400"
          : "bg-white/80 dark:bg-zinc-900/70 ring-zinc-200 dark:ring-zinc-800"
      ].join(" ")}
      title="White noise"
    >
      {noiseOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
      <span>White noise</span>
    </button>
  );
}
