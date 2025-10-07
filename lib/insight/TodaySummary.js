"use client";

import React from "react";
import { fmtMin, ratioPct, dayLabelFull } from "./insightUtils";

export default function TodaySummary({ data, today, weekAvgFocus, weekAvgDistr }) {
  return (
    <div className="p-6 md:p-7">
      <div className="text-sm font-medium text-zinc-300 mb-3">
        Hari ini — {today ? dayLabelFull(today.date) : "—"}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
        <div className="flex flex-col justify-between rounded-2xl p-5 min-h-[140px] ring-1 ring-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent">
          <div>
            <div className="text-xs text-emerald-400">Fokus Hari Ini</div>
            <div className="mt-1 text-3xl font-semibold text-emerald-300">
              {fmtMin(today?.focusMin ?? 0)}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-emerald-400/80">
            Rata-rata 7 hari: {fmtMin(weekAvgFocus)}
          </div>
        </div>

        <div className="flex flex-col justify-between rounded-2xl p-5 min-h-[140px] ring-1 ring-zinc-800/40 bg-gradient-to-br from-zinc-800/30 via-zinc-900/40 to-zinc-950">
          <div>
            <div className="text-xs text-zinc-400">Distraksi</div>
            <div className="mt-1 text-3xl font-semibold text-white">
              {today?.tabCount ?? 0}
            </div>
          </div>
          <div className="mt-3 text-[11px] text-zinc-500">
            Rata-rata 7 hari: {Math.round(weekAvgDistr)}
          </div>
        </div>
        <div className="flex flex-col justify-between rounded-2xl p-5 min-h-[140px] ring-1 ring-zinc-800/40 bg-gradient-to-br from-zinc-800/30 via-zinc-900/40 to-zinc-950">
          <div>
            <div className="text-xs text-zinc-400">Rasio Fokus</div>
            {(() => {
              const total = (today?.focusMin || 0) + (today?.taboutMin || 0);
              const pct = ratioPct(today?.focusMin || 0, total);
              return (
                <div className="mt-1">
                  <div className="text-3xl font-semibold text-white">{pct}%</div>
                  <div className="mt-3">
                    <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                      <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>
          <div className="text-[11px] text-zinc-500 mt-2">
            Berdasarkan sesi hari ini
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl p-5 ring-1 ring-zinc-800/40 bg-zinc-900/40">
        <div className="text-xs text-zinc-400">Top Distraktor Hari Ini</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {today && Object.keys(today.topReasons || {}).length > 0 ? (
            Object.entries(today.topReasons)
              .sort((a, b) => (b[1] || 0) - (a[1] || 0))
              .slice(0, 5)
              .map(([label, count]) => (
                <span
                  key={label}
                  className="px-2 py-1 rounded-lg text-[10px] ring-1 ring-zinc-700 text-zinc-300 bg-zinc-900/60"
                >
                  {label} • {count}
                </span>
              ))
          ) : (
            <span className="text-[11px] text-zinc-500">
              Belum ada distraktor yang tercatat.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
