"use client";

import React from "react";
import { Plus, Check, X } from "lucide-react";

export default function TaskAdder({ onAdd }) {
  const [adding, setAdding] = React.useState(false);
  const [step, setStep] = React.useState(1);
  const [title, setTitle] = React.useState("");
  const [cyclesStr, setCyclesStr] = React.useState("2");
  const titleRef = React.useRef(null);
  const cyclesRef = React.useRef(null);

  React.useEffect(() => {
    if (!adding) return;
    (step === 1 ? titleRef : cyclesRef)?.current?.focus();
  }, [adding, step]);

  const clamp = (n) => Math.max(1, Math.min(12, Number.isFinite(n) ? n : 1));
  const commitCycles = (raw) => {
    const n = clamp(parseInt(raw || "1", 10));
    setCyclesStr(String(n));
    return n;
  };

  const open = () => {
    setAdding(true);
    setStep(1);
    setTitle("");
    setCyclesStr("2");
  };
  const cancel = () => {
    setAdding(false);
    setStep(1);
    setTitle("");
    setCyclesStr("2");
  };

  const goNextOrSave = () => {
    if (step === 1) {
      if (!title.trim()) return;
      setStep(2);
    } else {
      const n = commitCycles(cyclesStr);
      onAdd?.(title, n);
      cancel();
    }
  };

  if (!adding) {
    return (
      <button
        onClick={open}
        className="inline-flex items-center gap-2 rounded-2xl px-4 h-11 bg-emerald-600 text-white hover:bg-emerald-700"
      >
        <Plus className="h-4 w-4" />
        Tambahkan tugas
      </button>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
      {step === 1 ? (
        <>
          <div className="md:col-span-9">
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Judul tugas
            </label>
            <input
              ref={titleRef}
              type="text"
              placeholder="Contoh: Tulis outline Bab 2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && goNextOrSave()}
              className="w-full h-12 rounded-2xl border border-zinc-300/70 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-3.5 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="md:col-span-3 flex items-end gap-2">
            <button
              onClick={cancel}
              title="Batal"
              className="h-12 w-12 grid place-items-center rounded-full bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            >
              <X className="h-5 w-5" />
            </button>
            <button
              onClick={goNextOrSave}
              disabled={!title.trim()}
              title="Lanjut"
              className="h-12 w-12 grid place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
              <Check className="h-5 w-5" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="md:col-span-6">
            <label className="mb-1 block text-xs font-medium text-zinc-500 dark:text-zinc-400">
              Jumlah siklus (1–12)
            </label>
            <div className="h-12 rounded-2xl border border-zinc-300/70 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 flex items-center gap-2 px-2 justify-end">
              <input
                ref={cyclesRef}
                inputMode="numeric"
                pattern="[0-9]*"
                value={cyclesStr}
                onChange={(e) => setCyclesStr(e.target.value.replace(/\D/g, "").slice(0, 2))}
                onBlur={() => setCyclesStr(String(Math.max(1, Math.min(12, parseInt(cyclesStr || "1", 10)))))}
                onKeyDown={(e) => {
                  if (e.key === "Enter") goNextOrSave();
                  if (e.key === "Escape") cancel();
                }}
                className="h-10 w-16 rounded-lg border border-transparent bg-transparent text-center text-[15px] outline-none focus:ring-0"
                placeholder="2"
                aria-label="Jumlah siklus"
              />
              <button
                onClick={goNextOrSave}
                title="Simpan"
                className="h-10 w-10 grid place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                aria-label="Simpan tugas"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={cancel}
                title="Batal"
                className="h-10 w-10 grid place-items-center rounded-full bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
