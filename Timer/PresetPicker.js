"use client";
import { PRESETS } from "./Utils";
import { useTimer } from "./Center/TimerContext";

export default function PresetPicker() {
  const { preset, pickPreset, running } = useTimer();
  return (
    <div className="flex flex-wrap gap-2">
      {PRESETS.map((p) => {
        const active = preset.id === p.id;
        return (
          <button
            key={p.id}
            disabled={running}
            onClick={() => pickPreset(p)}
            className={[
              "px-3 py-1.5 rounded-xl text-sm ring-1 transition",
              active
                ? "bg-emerald-600 text-white ring-emerald-600"
                : "bg-white/80 dark:bg-zinc-900/70 ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900",
              running ? "opacity-60 cursor-not-allowed" : ""
            ].join(" ")}
            aria-pressed={active}
            title={running ? "Pause dulu untuk ganti preset" : `Pilih ${p.label}`}
          >
            {p.label}
          </button>
        );
      })}
    </div>
  );
}
