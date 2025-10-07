"use client";

import React from "react";

export default function CompactProgress({ done, total }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <div className="relative h-1.5 w-24 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
        <div
          className="absolute inset-y-0 left-0 rounded-full bg-emerald-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs tabular-nums text-zinc-600 dark:text-zinc-400">
        {done}/{total}
      </span>
    </div>
  );
}
