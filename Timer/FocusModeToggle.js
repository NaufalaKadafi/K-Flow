"use client";
import { EyeOff, Eye } from "lucide-react";
import { useTimer } from "./Center/TimerContext";

export default function FocusModeToggle() {
  const { focusMode, setFocusMode } = useTimer();
  return (
    <button
      onClick={() => setFocusMode(!focusMode)}
      className={[
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm ring-1 transition",
        focusMode
          ? "bg-emerald-600 text-white ring-emerald-600"
          : "bg-white/80 dark:bg-zinc-900/70 ring-zinc-200 dark:ring-zinc-800"
      ].join(" ")}
      title="Focus mode"
    >
      {focusMode ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
      <span>{focusMode ? "Focus ON" : "Focus mode"}</span>
    </button>
  );
}
