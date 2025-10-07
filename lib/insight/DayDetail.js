"use client";

import React from "react";
import { X } from "lucide-react";
import { fmtMin, dayLabelFull, ratioPct } from "./insightUtils";

export default function DayDetailDrawer({ open, day, weekAvgFocus, weekAvgDistr, onClose }) {
  if (!open || !day) return null;

  const total = (day.focusMin || 0) + (day.taboutMin || 0);
  const pct = ratioPct(day.focusMin || 0, total);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="pointer-events-auto absolute right-0 top-0 h-full w-full max-w-[380px] bg-zinc-950/98 ring-1 ring-emerald-500/20 backdrop-blur rounded-l-2xl shadow-[0_20px_80px_rgba(16,185,129,.25)]">
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div>
            <div className="text-xs text-zinc-500">Detail Hari</div>
            <div className="text-base font-semibold text-white">
              {dayLabelFull(day.date)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-300"
            aria-label="Tutup detail hari"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          <div className="rounded-xl p-4 ring-1 ring-emerald-500/20 bg-emerald-500/5">
            <div className="text-xs text-emerald-400">Fokus</div>
            <div className="mt-1 text-2xl font-semibold text-emerald-300">
              {fmtMin(day.focusMin)}
            </div>
            <div className="mt-2 text-[11px] text-emerald-400/80">
              Banding minggu: {fmtMin(weekAvgFocus)} (rata-rata)
            </div>
          </div>

          <div className="rounded-xl p-4 ring-1 ring-zinc-800/40">
            <div className="text-xs text-zinc-400">Distraksi</div>
            <div className="mt-1 text-2xl font-semibold text-white">
              {day.tabCount}
            </div>
            <div className="mt-2 text-[11px] text-zinc-500">
              Rata-rata mingguan: {Math.round(weekAvgDistr)}
            </div>
          </div>

          <div className="rounded-xl p-4 ring-1 ring-zinc-800/40">
            <div className="text-xs text-zinc-400">Rasio Fokus</div>
            <div className="mt-1 text-2xl font-semibold text-white">{pct}%</div>
            <div className="mt-2 h-2 rounded-full bg-zinc-800 overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${pct}%` }} />
            </div>
          </div>

          <div className="rounded-xl p-4 ring-1 ring-zinc-800/40">
            <div className="text-xs text-zinc-400 mb-2">Top Distraktor hari itu</div>
            <div className="flex flex-wrap gap-2">
              {Object.keys(day.topReasons || {}).length > 0 ? (
                Object.entries(day.topReasons)
                  .sort((a, b) => (b[1] || 0) - (a[1] || 0))
                  .slice(0, 6)
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
                  Tidak ada data distraktor.
                </span>
              )}
            </div>
          </div>

          <div className="rounded-xl p-4 ring-1 ring-emerald-500/20 bg-emerald-500/5">
            <div className="text-xs text-emerald-400 mb-1">Catatan Cepat</div>
            <ul className="text-[12px] text-zinc-300 list-disc pl-4 space-y-1.5">
              <li>
                {day.focusMin >= weekAvgFocus
                  ? "Fokus di atas rata-rata mingguan — pertahankan pola yang sama besok."
                  : "Fokus di bawah rata-rata — coba aktifkan Focus Mode dan matikan notifikasi jam rawan."}
              </li>
              <li>
                {day.tabCount > weekAvgDistr
                  ? "Distraksi lebih tinggi dari rata-rata — cek 3 distraktor teratas dan buat batasan 25 menit."
                  : "Distraksi terkontrol — mantap!"}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
