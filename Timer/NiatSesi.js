"use client";
import { useTimer } from "./Center/TimerContext";

export default function IntentionInput() {
  const { intention, setIntention } = useTimer();
  return (
    <label className="block">
      <div className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        Niat sesi
      </div>
      <input
        value={intention}
        onChange={(e) => setIntention(e.target.value)}
        placeholder="Contoh: Ngejar Deadline"
        className="w-full rounded-xl bg-white/80 dark:bg-zinc-900/70 ring-1 ring-zinc-200 dark:ring-zinc-800 px-3 py-2 focus:ring-emerald-500 outline-none"
      />
    </label>
  );
}
