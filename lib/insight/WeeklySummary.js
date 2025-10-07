"use client";

import React from "react";
import { TrendingUp, ArrowUpRight, Clock3 } from "lucide-react";
import { fmtMin, dayLabel } from "./insightUtils";

export default function WeeklySummary({ data }) {
  const hourBins = data?.hourBins ?? [];
  const maxBin = hourBins.length ? Math.max(...hourBins) : 0;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 md:p-7">
        <div className="group relative overflow-hidden rounded-2xl p-5 ring-1 ring-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent transition-all hover:ring-emerald-400/40 hover:shadow-[0_12px_48px_rgba(16,185,129,.18)]">
          <div className="text-xs text-emerald-400">Total Fokus</div>
          <div className="mt-1 text-3xl font-semibold text-emerald-300 tracking-tight">
            {fmtMin(data?.totalFocusMin ?? 0)}
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-emerald-400/80">
            <TrendingUp className="h-3.5 w-3.5" />
            {data?.trendFocusPct == null
              ? "—"
              : `${data.trendFocusPct >= 0 ? "+" : ""}${data.trendFocusPct}% vs minggu lalu`}
          </div>
          <div className="pointer-events-none absolute -right-10 -bottom-10 h-36 w-36 rounded-full bg-emerald-500/10 blur-2xl transition-transform group-hover:scale-110" />
        </div>

        <div className="group relative overflow-hidden rounded-2xl p-5 ring-1 ring-zinc-800/40 bg-gradient-to-br from-zinc-800/30 via-zinc-900/40 to-zinc-950 transition-all hover:ring-zinc-700 hover:shadow-[0_12px_48px_rgba(0,0,0,.35)]">
          <div className="text-xs text-zinc-400">Distraksi</div>
          <div className="mt-1 text-3xl font-semibold text-white tracking-tight">
            {data?.totalDistractions ?? 0}
          </div>
          <div className="mt-4 flex items-center gap-1 text-xs text-zinc-400/80">
            <ArrowUpRight className="h-3.5 w-3.5" />
            {data?.trendDistractPct == null
              ? "—"
              : `${data.trendDistractPct >= 0 ? "+" : ""}${data.trendDistractPct}% vs minggu lalu`}
          </div>
          <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-zinc-500/10 blur-2xl transition-transform group-hover:scale-110" />
        </div>

        <div className="group relative overflow-hidden rounded-2xl p-5 ring-1 ring-zinc-800/40 bg-gradient-to-br from-zinc-800/30 via-zinc-900/40 to-zinc-950 transition-all hover:ring-zinc-700">
          <div className="text-xs text-zinc-400">Top Distraktor</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(data?.topDistractors ?? []).length === 0 ? (
              <span className="text-xs text-zinc-500">Tidak ada</span>
            ) : (
              data.topDistractors.map((d, i) => (
                <span
                  key={i}
                  className="px-2 py-1 rounded-lg text-xs ring-1 ring-zinc-700 text-zinc-200 bg-zinc-900/60 transition-colors hover:ring-emerald-600/40"
                  title={`${d.count} kali`}
                >
                  {d.label} • {d.count}
                </span>
              ))
            )}
          </div>
          <div className="pointer-events-none absolute right-0 top-0 h-20 w-20 bg-[radial-gradient(closest-side,rgba(255,255,255,.06),transparent)]" />
        </div>
      </div>

      <div className="px-6 md:px-7 pb-3">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
          <Clock3 className="h-3.5 w-3.5" />
          Jam Rawan Distraksi (akumulasi 7 hari)
        </div>
        <div className="flex items-end gap-1 h-24 rounded-2xl ring-1 ring-zinc-800/40 p-3 bg-zinc-900/40">
          {Array.from({ length: 24 }).map((_, i) => {
            const v = hourBins[i] || 0;
            const h = maxBin ? Math.max(2, Math.round((v / maxBin) * 80)) : 2;
            return (
              <div
                key={i}
                className="w-2 rounded bg-emerald-500/80 hover:bg-emerald-400 transition-[background-color] duration-200"
                style={{ height: `${h}px`, transition: "height .6s ease" }}
                title={`${i}:00 • ${v}`}
              />
            );
          })}
        </div>
        <div className="mt-1 flex justify-between text-[10px] text-zinc-500 px-1">
          <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
        </div>
      </div>

      <div className="p-6 md:p-7">
        <div className="text-sm font-medium text-zinc-300 mb-3">
          Ringkasan Harian (7 hari)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-3">
          {(data?.days ?? []).map((d, i) => {
            const total = (d.focusMin || 0) + (d.taboutMin || 0);
            const pctFocus = total > 0 ? Math.round((d.focusMin / total) * 100) : 0;
            const top = Object.entries(d.topReasons || {})
              .sort((a, b) => (b[1] || 0) - (a[1] || 0))[0];

            return (
              <div
                key={i}
                className="
                  text-left group rounded-2xl p-4 ring-1 ring-zinc-800/40
                  bg-gradient-to-br from-zinc-900/60 via-zinc-950 to-zinc-950
                  transition-all
                  hover:ring-emerald-500/40 hover:shadow-[0_10px_40px_rgba(16,185,129,.15)]
                  hover:-translate-y-0.5
                "
              >
                <div className="flex items-center justify-between">
                  <div className="text-[11px] text-zinc-500">
                    {dayLabel(d.date)}
                  </div>
                </div>
                <div className="mt-1 text-lg font-semibold text-white">
                  {fmtMin(d.focusMin)}
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">
                  Distraksi: {d.tabCount}
                </div>

                <div className="mt-3">
                  <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                    <div
                      className="h-full bg-emerald-500"
                      style={{ width: `${pctFocus}%`, transition: "width .6s ease" }}
                      title={`Fokus ${pctFocus}%`}
                    />
                  </div>
                  <div className="mt-1 text-[10px] text-zinc-500">{pctFocus}% fokus</div>
                </div>
                {top && (
                  <div className="mt-3">
                    <span className="px-2 py-1 rounded-lg text-[10px] ring-1 ring-zinc-700 text-zinc-300 bg-zinc-900/60 transition-colors group-hover:ring-emerald-600/40">
                      {top[0]} • {top[1]}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
