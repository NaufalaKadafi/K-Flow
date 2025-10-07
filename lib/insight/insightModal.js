"use client";

import React from "react";
import { X, BarChart3 } from "lucide-react";
import WeeklySummary from "./WeeklySummary";
import TodaySummary from "./TodaySummary";
import DayDetailDrawer from "./DayDetail";
import { dayLabelFull } from "./insightUtils";

export default function InsightsModal({ open, loading, data, onClose }) {
  const [tab, setTab] = React.useState("weekly"); 
  const [dayOpen, setDayOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState(null);


  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onEsc = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onEsc);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onEsc);
    };
  }, [open, onClose]);

  function openDayDetail(d) {
    setSelectedDay(d);
    setDayOpen(true);
  }

  if (!open) return null;

  const days = data?.days || [];
  const todayYmd = data?.range?.endYmd;
  const today = days.find((d) => d.date === todayYmd) || null;

  const weekAvgFocus = days.reduce((s, d) => s + (d.focusMin || 0), 0) / Math.max(1, days.length);
  const weekAvgDistr = days.reduce((s, d) => s + (d.tabCount || 0), 0) / Math.max(1, days.length);

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center p-4 md:p-6">

      <div
        className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/50 to-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          relative w-full max-w-[1120px]
          max-h-[90vh] overflow-y-auto overscroll-contain
          rounded-3xl
          ring-1 ring-emerald-500/10
          shadow-[0_30px_120px_rgba(16,185,129,.25)]
          bg-zinc-950
        "
      >
        <div
          className="
            sticky top-0 z-10 p-6 md:p-7
            bg-[radial-gradient(1200px_600px_at_0%_-20%,rgba(16,185,129,.18),transparent),radial-gradient(800px_400px_at_100%_0%,rgba(14,165,233,.18),transparent)]
            bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-950/75
            border-b border-white/5
          "
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 p-2 rounded-full hover:bg-white/5 text-zinc-300"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>

          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                <BarChart3 className="h-5 w-5" />
              </span>
              <div>
                <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white">
                  Insight (7 hari)
                </h3>
                <p className="text-xs text-zinc-400">
                  Periode: {data?.range?.startYmd ?? "—"} s/d {data?.range?.endYmd ?? "—"}
                </p>
              </div>
            </div>

            <div className="mt-1">
              <div className="inline-flex rounded-xl overflow-hidden ring-1 ring-emerald-500/30 bg-zinc-900/60">
                <button
                  onClick={() => setTab("weekly")}
                  className={`px-4 py-2 text-sm transition ${
                    tab === "weekly"
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                  aria-pressed={tab === "weekly"}
                >
                  Mingguan
                </button>
                <button
                  onClick={() => setTab("today")}
                  className={`px-4 py-2 text-sm transition ${
                    tab === "today"
                      ? "bg-emerald-600 text-white"
                      : "text-zinc-300 hover:bg-zinc-900"
                  }`}
                  aria-pressed={tab === "today"}
                >
                  Hari ini
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-zinc-950">
          {loading && (
            <div className="p-6 md:p-7 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-28 rounded-2xl bg-gradient-to-r from-zinc-900 to-zinc-800/80 animate-pulse" />
              ))}
              <div className="col-span-full h-36 rounded-2xl bg-zinc-900 animate-pulse" />
            </div>
          )}

          {!loading && data && (
            <>
              {tab === "weekly" && (
                <WeeklySummary data={data} onOpenDay={openDayDetail} />
              )}
              {tab === "today" && (
                <TodaySummary
                  data={data}
                  today={today}
                  weekAvgFocus={weekAvgFocus}
                  weekAvgDistr={weekAvgDistr}
                />
              )}
            </>
          )}
        </div>

        <DayDetailDrawer
          open={dayOpen && !!selectedDay}
          day={selectedDay}
          weekAvgFocus={weekAvgFocus}
          weekAvgDistr={weekAvgDistr}
          onClose={() => setDayOpen(false)}
        />
      </div>
    </div>
  );
}
