"use client";

import React, { useEffect } from "react";
import FlowGuardPanel from "../components/settings/FlowGuardPanel";
import { X } from "lucide-react";

export default function FlowGuardModal({ open, onClose }) {

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-md"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        className="
          relative w-full max-w-2xl mx-4 sm:mx-6 rounded-3xl
          shadow-[0_30px_100px_-20px_rgba(16,185,129,.45)] ring-1 ring-emerald-400/25
          bg-gradient-to-br from-emerald-500/[0.10] via-white/70 to-cyan-500/[0.08]
          dark:via-zinc-900/70 backdrop-blur
          opacity-0 scale-[0.985] animate-[flowguard_in_.18s_ease-out_forwards]
        "
        data-show="true"
      >
        <button
          onClick={onClose}
          aria-label="Tutup"
          className="
            absolute right-3 top-3 z-[1] h-9 w-9 grid place-items-center rounded-xl
            bg-white/80 dark:bg-zinc-950/70 ring-1 ring-white/15 hover:bg-white/95
            dark:hover:bg-zinc-900 transition
          "
        >
          <X className="h-5 w-5" />
        </button>


        <div className="p-4 sm:p-6">
          <FlowGuardPanel />
        </div>


        <style>{`
          @keyframes flowguard_in {
            from { opacity: 0; transform: translateY(8px) scale(0.985); }
            to   { opacity: 1; transform: translateY(0)    scale(1); }
          }
        `}</style>
      </div>
    </div>
  );
}
