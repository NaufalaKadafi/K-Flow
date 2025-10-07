
"use client";

import { Play, Pause, RotateCcw, SkipForward, Square } from "lucide-react";
import { useTimer } from "./Center/TimerContext";
import { mmss } from "./Utils";


import { useDistractionStore } from "../lib/useDistractionStore.js";
import { useDistractionLogger } from "../lib/useDistractionLogger.js";


export default function FocusTimer({ goal = "", plannedMin = 25 }) {
  const {
    stage, running, remaining, preset,
    start, pause, reset, skip, endNow,
    intention, canEnd,
  } = useTimer();

  const { current, startSession, endSession } = useDistractionStore();
  useDistractionLogger(); 

  async function handleStart() {
    if (!current) {
      const finalGoal = goal || intention || "";
      try { await startSession(finalGoal, Number(plannedMin) || 25); } catch {}
    }
    start(); 
  }

  async function handleEnd() {
    if (!canEnd) return; 
    try { endNow?.(); } catch {}
    try { await endSession(); } catch {}
  }


  const size = 240;
  const stroke = 12;
  const R = (size - stroke) / 2;
  const C = 2 * Math.PI * R;

  const totalSec = (() => {
    const focusSec = (preset?.focusMin ?? 25) * 60;
    const breakSec = (preset?.breakMin ?? 5) * 60;
    return stage === "focus" ? focusSec : breakSec;
  })();

  const progress = totalSec > 0 ? Math.max(0, 1 - (remaining / totalSec)) : 0;

  return (
    <div className="relative flex flex-col items-center">
      <div className="mb-3 flex items-center gap-2 text-xs">
        <span
          className={`px-2 py-1 rounded-full ring-1 ${
            stage === "focus"
              ? "bg-emerald-50 ring-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:ring-emerald-900/40 dark:text-emerald-400"
              : "bg-sky-50 ring-sky-200 text-sky-700 dark:bg-sky-900/20 dark:ring-sky-900/40 dark:text-sky-400"
          }`}
        >
          {stage === "focus" ? "Fokus" : "Istirahat"}
        </span>
        {current?.goal && (
          <>
            <span className="text-zinc-500">•</span>
            <span className="truncate max-w-[180px] text-zinc-500" title={current.goal}>
              🎯 {current.goal}
            </span>
          </>
        )}
      </div>


      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="rotate-[-90deg]">
          <circle
            cx={size/2} cy={size/2} r={R}
            stroke="currentColor" strokeOpacity="0.15" strokeWidth={stroke} fill="none"
          />
          <circle
            cx={size/2} cy={size/2} r={R}
            stroke="currentColor" strokeWidth={stroke} fill="none"
            className={stage === "focus" ? "text-emerald-500" : "text-sky-500"}
            strokeDasharray={C}
            strokeDashoffset={C * (1 - progress)}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute inset-0 grid place-items-center">
          <div className="text-5xl font-semibold tabular-nums">{mmss(remaining)}</div>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 w-full">
        {!running ? (
          <button
            onClick={handleStart}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700"
          >
            <Play className="h-4 w-4" /> Mulai
          </button>
        ) : (
          <button
            onClick={pause}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-800 dark:hover:bg-zinc-700"
          >
            <Pause className="h-4 w-4" /> Jeda
          </button>
        )}

        <button
          onClick={handleEnd}
          disabled={!canEnd}
          className={[
            "inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 text-sm transition",
            canEnd
              ? "ring-zinc-200 dark:ring-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/60"
              : "ring-zinc-800 bg-zinc-900/40 text-zinc-500 cursor-not-allowed"
          ].join(" ")}
          title={canEnd ? "Akhiri sesi sekarang" : "Mulai timer dulu"}
        >
          <Square className="h-4 w-4" /> End
        </button>

        <button
          onClick={skip}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800"
          title="Pindah ke fase berikutnya"
        >
          <SkipForward className="h-4 w-4" /> Skip
        </button>

        <button
          onClick={reset}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800"
          title="Reset fase sekarang"
        >
          <RotateCcw className="h-4 w-4" /> Reset
        </button>
      </div>
    </div>
  );
}
