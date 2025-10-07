"use client";

import { Zap, Check, X } from "lucide-react";
import { useTimer } from "./Center/TimerContext";

export default function FocusCard() {
  const { focusCardOpen, focusCardTitle, focusCardMessage, closeFocusCard } = useTimer();
  if (!focusCardOpen) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 z-[70] px-4">
      <div
        className="
          mx-auto w-full max-w-md rounded-2xl
          ring-1 ring-emerald-400/30 bg-emerald-500/10 backdrop-blur
          p-4 text-emerald-200 shadow-[0_20px_60px_rgba(16,185,129,.25)]
        "
        role="dialog"
        aria-live="polite"
      >
        <div className="flex items-start gap-3">
          <span className="inline-grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/20">
            <Zap className="h-4 w-4" />
          </span>

          <div className="flex-1">
            <div className="text-sm font-semibold">
              {focusCardTitle || "Back to focus"}
            </div>
            <div className="text-xs opacity-90">
              {focusCardMessage || "Selamat datang kembali. Ambil napas 3 detik, lanjutkan ke tugas 📌"}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={closeFocusCard}
              className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700"
              aria-label="Lanjut"
              title="Lanjut"
            >
              <Check className="h-3.5 w-3.5" />
              Lanjut
            </button>
            <button
              onClick={closeFocusCard}
              className="p-1 rounded-md hover:bg-white/10"
              aria-label="Tutup"
              title="Tutup"
            >
              <X className="h-3.5 w-3.5 text-emerald-200/80" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
