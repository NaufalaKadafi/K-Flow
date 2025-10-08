"use client";

import React from "react";
import { MousePointerClick, Plus, X } from "lucide-react";
import { useTimer } from "./Center/TimerContext";

function fmtClock(t) {
  const d = new Date(t);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${hh}.${mm}.${ss}`;
}

function prettyLabel(item) {
  const raw = (item?.label || "").toLowerCase();
  if (item?.kind === "auto" && (raw === "tab_out" || raw === "tabout")) return "Nyasar tab";
  return item?.label || "lain-lain";
}

const QUICK = ["HP", "Chat", "Scroll", "Berisik", "Lainnya"];

export default function CatatDistraksi() {
  const { logDistraction, ledger, canLogDistraction } = useTimer();

  const [otherOpen, setOtherOpen] = React.useState(false);
  const [otherValue, setOtherValue] = React.useState("");
  const inputRef = React.useRef(null);

  React.useEffect(() => {
    if (otherOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 10);
      return () => clearTimeout(t);
    }
  }, [otherOpen]);

  React.useEffect(() => {
    if (!canLogDistraction) {
      setOtherOpen(false);
      setOtherValue("");
    }
  }, [canLogDistraction]);

  function submitOther() {
    const label = otherValue.trim();
    if (!label || !canLogDistraction) return;
    logDistraction(label);
    setOtherValue("");
    setOtherOpen(false);
  }

  function cancelOther() {
    setOtherValue("");
    setOtherOpen(false);
  }

  function handleQuick(q) {
    if (!canLogDistraction) return;
    if (q === "Lainnya") {
      setOtherOpen((v) => !v);
      return;
    }
    logDistraction(q);
  }

  const visibleLedger = (ledger ?? []).filter((it) => {
    const raw = (it?.label || "").toLowerCase();
    if (it?.kind === "auto" && (raw === "tab_in" || raw === "tabin")) return false;
    return true;
  });

  return (
    <section className="rounded-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <MousePointerClick className="h-4 w-4 text-emerald-600" />
          <h4 className="text-sm font-semibold tracking-tight">Catat Distraksi</h4>
        </div>
        {!canLogDistraction && (
          <span className="text-xs text-zinc-500 italic">(Hanya aktif saat fokus)</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {QUICK.map((q) => {
          const disabled = !canLogDistraction;
          return (
            <button
              key={q}
              onClick={() => handleQuick(q)}
              disabled={disabled}
              className={[
                "px-3 py-1.5 rounded-xl text-sm ring-1 transition-all",
                disabled
                  ? "opacity-50 cursor-not-allowed ring-zinc-300 dark:ring-zinc-800 bg-zinc-100 dark:bg-zinc-900"
                  : "ring-zinc-200 dark:ring-zinc-800 bg-white dark:bg-zinc-900 hover:bg-zinc-50 dark:hover:bg-zinc-800",
              ].join(" ")}
              aria-expanded={q === "Lainnya" ? otherOpen : undefined}
              title={disabled ? "Hanya bisa digunakan saat fokus" : `Catat distraksi: ${q}`}
            >
              {q === "Lainnya" ? (
                <span className="inline-flex items-center gap-1">
                  <Plus className="h-3.5 w-3.5" /> {q}
                </span>
              ) : (
                q
              )}
            </button>
          );
        })}
      </div>

      {otherOpen && canLogDistraction && (
        <div className="mt-3 flex items-center gap-2 p-2 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
          <input
            ref={inputRef}
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submitOther();
              if (e.key === "Escape") cancelOther();
            }}
            placeholder="Tulis distraksi lain…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-zinc-500"
            aria-label="Distraksi lainnya"
          />
          <div className="flex items-center gap-1.5">
            <button
              onClick={submitOther}
              disabled={!canLogDistraction}
              className={[
                "px-3 py-1.5 rounded-lg text-xs transition-all",
                canLogDistraction
                  ? "bg-emerald-600 text-white hover:bg-emerald-700"
                  : "bg-zinc-300 text-zinc-600 cursor-not-allowed",
              ].join(" ")}
            >
              Tambah
            </button>
            <button
              onClick={cancelOther}
              className="p-1.5 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Batal"
              title="Batal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 rounded-xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-zinc-50/80 dark:bg-zinc-900/50">
        <div className="text-xs text-zinc-500 mb-2">Terekam</div>
        {visibleLedger.length ? (
          <ul className="space-y-2">
            {visibleLedger
              .slice()
              .reverse()
              .map((item, i) => (
                <li
                  key={i}
                  className="flex items-center justify-between rounded-lg px-3 py-1.5 bg-white/70 dark:bg-zinc-900/70 ring-1 ring-zinc-200 dark:ring-zinc-800"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{prettyLabel(item)}</span>
                    {item?.kind === "auto" ? (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-600/15 text-emerald-400 ring-1 ring-emerald-600/20"
                        title="Dicatat otomatis"
                      >
                        auto
                      </span>
                    ) : (
                      <span
                        className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-600/10 text-zinc-500 ring-1 ring-zinc-600/20"
                        title="Dicatat manual"
                      >
                        manual
                      </span>
                    )}
                  </div>
                  <span className="text-xs text-zinc-500">
                    {item?.t ? fmtClock(item.t) : "—"}
                  </span>
                </li>
              ))}
          </ul>
        ) : (
          <div className="text-sm text-zinc-500">Belum ada catatan.</div>
        )}
      </div>
    </section>
  );
}
