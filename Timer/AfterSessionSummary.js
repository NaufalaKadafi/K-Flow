
"use client";

import { X, Lightbulb, Activity, Clock, Target } from "lucide-react";
import { useMemo } from "react";
import { useTimer } from "./Center/TimerContext";

function prettyLabel(item) {
  const raw = (item?.label || "").toLowerCase();
  if (item?.kind === "auto" && (raw === "tab_out" || raw === "tabout")) return "Nyasar tab";
  if (item?.kind === "auto" && (raw === "tab_in" || raw === "tabin")) return "Kembali ke tab";

  if (raw === "scroll") return "Scroll";
  if (raw === "berisik" || raw === "noise") return "Berisik";
  if (raw === "hp" || raw === "phone") return "HP";
  if (raw === "chat" || raw === "dm" || raw === "wa" || raw === "whatsapp") return "Chat";
  return item?.label || "Lainnya";
}


function buildSuggestions({ focusMin = 0, tally = {}, autoTabOutCount = 0 }) {
  const hp = tally["HP"] || 0;
  const chat = tally["Chat"] || 0;
  const scroll = tally["Scroll"] || 0;
  const noise = tally["Berisik"] || 0;
  const nyasar = (tally["Nyasar tab"] || 0) + autoTabOutCount;

  const rules = [
    {
      id: "tabout_burst",
      when: nyasar >= 2,
      msg:
        "Kamu sering nyasar tab. Tutup tab non-kerja & pakai jendela terpisah. Aktifkan Focus Mode selama sesi.",
      sev: 3,
    },
    {
      id: "phone_high",
      when: hp >= 2,
      msg: "HP mengganggu. Aktifkan mode pesawat / DND selama 25–30 menit.",
      sev: 2,
    },
    {
      id: "chat_high",
      when: chat >= 2,
      msg: "Chat ramai. Mute notifikasi 30 menit atau pindah ke perangkat lain untuk komunikasi.",
      sev: 2,
    },
    {
      id: "scroll_high",
      when: scroll >= 2,
      msg: "Scroll kebablasan. Aktifkan website blocker / reader mode saat sesi fokus.",
      sev: 2,
    },
    {
      id: "noise_high",
      when: noise >= 2,
      msg: "Lingkungan berisik. Nyalakan White Noise / gunakan earplug + cari tempat yang lebih tenang.",
      sev: 2,
    },
    {
      id: "low_focus",
      when: focusMin < 15, 
      msg: "Fokus hari ini masih pendek. Mulai lagi sesi 15–20 menit untuk bangun momentum.",
      sev: 1,
    },
  ];

  const picked = rules
    .filter((r) => r.when)
    .sort((a, b) => b.sev - a.sev)
    .slice(0, 2)
    .map((r) => r.msg);

  if (picked.length === 0) {
    return ["Mantap! Pertahankan ritme—coba tambah +5 menit di sesi berikutnya."];
  }
  return picked;
}

export default function AfterSessionSummary() {
  const { showSummary, setShowSummary, summary } = useTimer();

  const { autoTabOutCount, manualCount, chips, suggestions } = useMemo(() => {
    const items = Array.isArray(summary?.distractions) ? summary.distractions : [];

    const autoTabOut = items.filter(
      (d) => d?.kind === "auto" && (d?.label === "tab_out" || d?.label === "tabout")
    ).length;

    const manual = items.filter((d) => d?.kind !== "auto").length;

    const map = items.reduce((m, d) => {
      const key = prettyLabel(d);
      m[key] = (m[key] || 0) + 1;
      return m;
    }, {});
    const grouped = Object.entries(map).sort((a, b) => b[1] - a[1]);

    const focusMin = typeof summary?.focusMin === "number" ? Math.max(0, summary.focusMin) : 0;
    const sugg = buildSuggestions({
      focusMin,
      tally: map,
      autoTabOutCount: autoTabOut,
    });

    return {
      autoTabOutCount: autoTabOut,
      manualCount: manual,
      chips: grouped,
      suggestions: sugg,
    };
  }, [summary?.distractions, summary?.focusMin]);

  if (!showSummary || !summary) return null;

  const endedManually =
    summary.endedBy === "manual" || summary.endedBy === "manual_end";
  const focusMin =
    typeof summary.focusMin === "number" ? Math.max(0, summary.focusMin) : 0;

  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4">

      <div
        className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setShowSummary(false)}
      />


      <div
        className="
          relative z-10 w-full max-w-xl overflow-hidden
          rounded-3xl ring-1 ring-zinc-200 dark:ring-zinc-800
          bg-white dark:bg-zinc-950 shadow-[0_30px_100px_rgba(16,185,129,.20)]
        "
        role="dialog"
        aria-modal="true"
      >
   
        <div className="pointer-events-none absolute -top-32 -right-16 h-72 w-72 rounded-full bg-emerald-400/20 blur-3xl" />

       
        <button
          type="button"
          onClick={() => setShowSummary(false)}
          className="absolute right-3 top-3 z-20 p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
          aria-label="Tutup"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative z-10 p-6">
          
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl md:text-[22px] font-semibold tracking-tight">
                Sesi selesai
              </h3>
              {endedManually && (
                <span className="ml-1 rounded-full px-2 py-0.5 text-xs bg-zinc-100 dark:bg-zinc-900 ring-1 ring-zinc-200 dark:ring-zinc-800">
                  Ditutup manual
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1 flex items-center gap-2">
            <Target className="h-3.5 w-3.5" />
            Preset {summary.preset} • Niat:{" "}
            <span className="font-medium">
              {summary.intention?.trim() || "—"}
            </span>
          </p>

  
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-100 dark:ring-emerald-900/40 p-3">
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400">
                Fokus
              </div>
              <div className="text-xl font-semibold leading-tight">
                {focusMin} min
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
              <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Auto Tab-out
              </div>
              <div className="text-xl font-semibold leading-tight">
                {autoTabOutCount}
              </div>
            </div>

            <div className="rounded-2xl bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
              <div className="text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
                Catatan manual
              </div>
              <div className="text-xl font-semibold leading-tight">
                {manualCount}
              </div>
            </div>
          </div>

     
          <div className="mt-3 text-xs text-zinc-500 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" />
            {summary?.endedAt ? new Date(summary.endedAt).toLocaleTimeString() : "—"}
          </div>

   
          <div className="mt-5">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="h-4 w-4 text-emerald-600" />
              <div className="text-sm font-medium">Ledger sesi</div>
            </div>

            {!chips.length ? (
              <div className="text-sm text-zinc-500">
                Tidak ada distraksi tercatat.
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {chips.map(([label, count]) => (
                  <span
                    key={label}
                    className="
                      px-2.5 py-1 rounded-lg text-xs
                      ring-1 ring-zinc-200 dark:ring-zinc-800
                      bg-white/70 dark:bg-zinc-900/70
                    "
                    title={`${count} kali`}
                  >
                    {label} • {count}
                  </span>
                ))}
              </div>
            )}
          </div>


          <div className="mt-6 rounded-2xl ring-1 ring-amber-200 bg-amber-50 dark:bg-amber-900/20 dark:ring-amber-900/40 p-4">
            <div className="flex items-start gap-3">
              <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-semibold text-amber-700 dark:text-amber-400">
                  Saran
                </div>
                <ul className="mt-1 list-disc pl-5 space-y-1.5 text-sm text-amber-800/90 dark:text-amber-200/90">
                  {suggestions.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>


          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={() => setShowSummary(false)}
              className="
                inline-flex items-center gap-2 px-4 h-10
                rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800
                bg-white/70 dark:bg-zinc-900/70 hover:bg-zinc-50 dark:hover:bg-zinc-900
                text-sm
              "
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
