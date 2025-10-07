"use client";

import { useEffect } from "react";
import { AlertTriangle, Target, Sparkles } from "lucide-react";
import {LinkKerja } from "./LinkKerja";

export default function sfcnudge() {
  const { escalation, clearEscalation, wtl, activeCount } = useWorkLinks(s => ({
    escalation: s.escalation,
    clearEscalation: s.clearEscalation,
    wtl: s.wtl,
    activeCount: s.activeCount,
  }));

  const active = activeCount();
  const over = Math.max(0, active - wtl);


  useEffect(() => {
    if (escalation.level === 1 && active <= wtl) {
      const t = setTimeout(() => clearEscalation(), 6000);
      return () => clearTimeout(t);
    }
  }, [escalation.level, active, wtl, clearEscalation]);

  if (escalation.level === 0) return null;

  if (escalation.level === 1) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[90]">
        <div className="rounded-xl bg-amber-50 text-amber-900 ring-1 ring-amber-200 px-4 py-2 shadow">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            <div className="text-sm">
              Soft Hint: aktif {active} &gt; WTL {wtl}. Turunkan ke ≤ {wtl}.
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (escalation.level === 2) {
    return (
      <div className="fixed inset-0 z-[95] pointer-events-none flex items-start justify-center pt-16">
        <div className="pointer-events-auto rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur ring-1 ring-black/10 dark:ring-white/10 p-4 shadow-xl max-w-md w-[92%]">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-5 w-5 text-emerald-600" />
            <div className="font-semibold">Focus Card</div>
          </div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Kamu punya <b>{active}</b> item aktif, melebihi WTL <b>{wtl}</b> ({over} ekstra).
            Tutup atau tandai selesai beberapa link agar fokus tetap tajam.
          </p>
          <div className="mt-3 text-right">
            <button
              onClick={clearEscalation}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
            >
              Oke, paham
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[95] pointer-events-none flex items-start justify-center pt-16">
      <div className="pointer-events-auto rounded-2xl bg-white/95 dark:bg-zinc-900/95 backdrop-blur ring-1 ring-black/10 dark:ring-white/10 p-5 shadow-2xl max-w-lg w-[92%]">
        <div className="flex items-center gap-3 mb-2">
          <Sparkles className="h-5 w-5 text-emerald-600" />
          <div className="font-semibold">Action+</div>
        </div>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Masih melebihi WTL. Pilih aksi cepat:
        </p>
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
          <button
            onClick={() => {

              alert("Preset fokus di-switch (dummy).");
            }}
            className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left"
          >
            Switch Preset
            <div className="text-xs text-zinc-500">Pakai preset fokus minimalis.</div>
          </button>
          <button
            onClick={() => {
              alert("Micro-reset 60 detik (dummy).");
            }}
            className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-left"
          >
            Micro-reset
            <div className="text-xs text-zinc-500">Hening sejenak, tatap target utama.</div>
          </button>
        </div>
        <div className="mt-3 text-right">
          <button
            onClick={clearEscalation}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
}
