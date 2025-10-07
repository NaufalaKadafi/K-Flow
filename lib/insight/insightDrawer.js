"use client";
import React from "react";
import { X } from "lucide-react";
import { useTimer } from "../../Timer/Center/TimerProvider";
import { queryLast7d } from "../Analytics/Rollups.js"; 

function fmtMin(m) {
  const n = Math.max(0, Number(m) || 0);
  const h = Math.floor(n / 60);
  const r = n % 60;
  return h > 0 ? `${h}j ${r}m` : `${r}m`;
}

function riskFromHourBins(bins = []) {
  const h = new Date().getHours();
  const max = bins.length ? Math.max(...bins, 1) : 1;
  const raw = bins[h] || 0;
  const pct = Math.round((raw / max) * 100);
  let label = "Rendah";
  if (pct >= 66) label = "Tinggi";
  else if (pct >= 33) label = "Sedang";
  return { pct, label, hour: h, raw, max };
}

export default function InsightsDrawer() {
  const [open, setOpen] = React.useState(false);
  const [tab, setTab] = React.useState("realtime");
  const [weekly, setWeekly] = React.useState(null);

  const { ledger, summary, intention } = useTimer();

  React.useEffect(() => {
    const onOpen = () => {
      try { setWeekly(queryLast7d()); } catch { setWeekly(null); }
      setOpen(true);
    };
    window.addEventListener("tuntasin:open-insights", onOpen);
    return () => window.removeEventListener("tuntasin:open-insights", onOpen);
  }, []);

  if (!open) return null;

  const t = weekly || {};
  const rb = riskFromHourBins(t.hourBins || []);
  const top = t.topDistractors?.[0];

  return (
    <div className="fixed inset-0 z-[60]">
      <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-md
                   bg-white dark:bg-zinc-950 ring-1 ring-zinc-200 dark:ring-zinc-800
                   shadow-2xl p-5 overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Distraction Intelligence</h3>
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900"
            aria-label="Tutup"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 text-sm">
          {[
            { id: "realtime", label: "Realtime" },
            { id: "session", label: "Sesi Ini" },
            { id: "weekly", label: "7 Hari" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={[
                "px-3 py-1.5 rounded-lg ring-1",
                tab === t.id
                  ? "bg-emerald-600 text-white ring-emerald-600"
                  : "bg-white/70 dark:bg-zinc-900/70 ring-zinc-200 dark:ring-zinc-800",
              ].join(" ")}
              aria-pressed={tab === t.id}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === "realtime" && (
          <div className="mt-5 space-y-3">
            <div
              className={[
                "px-3 py-2 rounded-xl ring-1 w-fit",
                rb.label === "Tinggi"
                  ? "bg-rose-50 ring-rose-200 text-rose-700 dark:bg-rose-900/20 dark:ring-rose-900/40 dark:text-rose-300"
                  : rb.label === "Sedang"
                  ? "bg-amber-50 ring-amber-200 text-amber-700 dark:bg-amber-900/20 dark:ring-amber-900/40 dark:text-amber-300"
                  : "bg-emerald-50 ring-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:ring-emerald-900/40 dark:text-emerald-300",
              ].join(" ")}
              title={`Jam ${rb.hour}:00 • skor ${rb.raw}/${rb.max}`}
            >
              Risiko jam ini: {rb.label} ({rb.pct}%)
            </div>

            <div className="text-sm">
              <div className="text-zinc-500 mb-1">Top distraktor 7 hari</div>
              <div className="px-3 py-2 rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800 w-fit">
                {top ? `${top.label} • ${top.count}` : "—"}
              </div>
            </div>

            <div className="text-sm">
              <div className="text-zinc-500 mb-1">Distraksi sesi berjalan</div>
              <div className="px-3 py-2 rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800 w-fit">
                {ledger?.length ?? 0} kali
              </div>
            </div>
          </div>
        )}

        {tab === "session" && (
          <div className="mt-5 space-y-3">
            <div className="text-sm text-zinc-600 dark:text-zinc-400">
              <div>Niat: <span className="font-medium">{intention || "—"}</span></div>
              <div>Distraksi: <span className="font-medium">{ledger?.length ?? 0}</span></div>
            </div>

            {/* Ringkasan setelah-sesi versi ringkas */}
            {summary ? (
              <div className="grid grid-cols-3 gap-3">
                <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-100 dark:ring-emerald-900/40 p-3">
                  <div className="text-xs text-emerald-700 dark:text-emerald-400">Fokus</div>
                  <div className="text-lg font-semibold">{fmtMin(summary.focusMin ?? 0)}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Distraksi</div>
                  <div className="text-lg font-semibold">{summary.distractions?.length ?? 0}</div>
                </div>
                <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                  <div className="text-xs text-zinc-600 dark:text-zinc-400">Waktu</div>
                  <div className="text-lg font-semibold">{new Date(summary.endedAt).toLocaleTimeString()}</div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-zinc-500">Belum ada ringkasan. Akhiri satu sesi untuk melihat.</div>
            )}
          </div>
        )}

        {tab === "weekly" && (
          <div className="mt-5">
            <div className="text-xs text-zinc-500">
              Periode: {t?.range?.startYmd ?? "—"} s/d {t?.range?.endYmd ?? "—"}
            </div>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-100 dark:ring-emerald-900/40 p-3">
                <div className="text-xs text-emerald-700 dark:text-emerald-400">Total Fokus</div>
                <div className="text-lg font-semibold">{fmtMin(t?.totalFocusMin ?? 0)}</div>
                <div className="text-[11px] text-emerald-700/70 dark:text-emerald-400/70">
                  {t?.trendFocusPct == null ? "—" : `${t.trendFocusPct >= 0 ? "+" : ""}${t.trendFocusPct}% vs minggu lalu`}
                </div>
              </div>
              <div className="rounded-xl bg-zinc-50 dark:bg-zinc-900/40 ring-1 ring-zinc-200 dark:ring-zinc-800 p-3">
                <div className="text-xs text-zinc-600 dark:text-zinc-400">Distraksi</div>
                <div className="text-lg font-semibold">{t?.totalDistractions ?? 0}</div>
                <div className="text-[11px] text-zinc-600/70 dark:text-zinc-400/70">
                  {t?.trendDistractPct == null ? "—" : `${t.trendDistractPct >= 0 ? "+" : ""}${t.trendDistractPct}% vs minggu lalu`}
                </div>
              </div>
            </div>


            <div className="mt-4">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">
                Jam Rawan Distraksi (akumulasi 7 hari)
              </div>
              <div className="flex items-end gap-1 h-20">
                {Array.from({ length: 24 }).map((_, i) => {
                  const v = (t?.hourBins ?? [])[i] || 0;
                  const max = (t?.hourBins ?? []).length ? Math.max(...t.hourBins) : 0;
                  const h = max ? Math.max(2, Math.round((v / max) * 72)) : 2;
                  return <div key={i} className="w-2 rounded bg-emerald-500/70" style={{ height: `${h}px` }} title={`${i}:00 • ${v}`} />;
                })}
              </div>
              <div className="mt-1 flex justify-between text-[10px] text-zinc-500">
                <span>0</span><span>6</span><span>12</span><span>18</span><span>23</span>
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">Top Distraktor</div>
              <div className="flex flex-wrap gap-2">
                {(t?.topDistractors ?? []).length === 0 ? (
                  <span className="text-xs text-zinc-400">Tidak ada</span>
                ) : (
                  t.topDistractors.map((d, i) => (
                    <span key={i} className="px-2 py-1 rounded-lg text-xs ring-1 ring-zinc-200 dark:ring-zinc-800" title={`${d.count} kali`}>
                      {d.label} • {d.count}
                    </span>
                  ))
                )}
              </div>
            </div>

            <div className="mt-4">
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mb-2">Rekomendasi</div>
              <ul className="list-disc pl-5 text-sm space-y-1">
                <li>Mute chat saat jam {rb.hour}:00 — periode risiko {rb.label.toLowerCase()} minggu ini.</li>
                <li>{top ? `Kurangi ${top.label} dengan batasan 10 menit antara sesi.` : "Pilih satu distraktor utama dan tetapkan aturan sederhana."}</li>
                <li>Tutup tab non-kerja sebelum mulai sesi berikutnya.</li>
              </ul>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
