"use client";

import React from "react";
import {
  ShieldCheck, Bell, BellOff, Timer as TimerIcon,
  Minus, Plus, X
} from "lucide-react";
import { ensureNotifyPermission } from "../../lib/notify";

const cx = (...a) => a.filter(Boolean).join(" ");
const clamp = (v, min, max) => Math.max(min, Math.min(max, v));
const fmt = (n) =>
  Number.isFinite(n) ? (Number.isInteger(n) ? String(n) : String(+n.toFixed(1))) : "";

export function FlowGuardButton({ onOpen }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm bg-emerald-600 text-white ring-1 ring-emerald-500 hover:bg-emerald-700"
      title="Flow Guard"
    >
      <ShieldCheck className="h-4 w-4" />
      Flow Guard
    </button>
  );
}

export default function FlowGuardPanel({
  open,
  onClose,
  embedded = false,
  frameless = false,
  showFooterNote = true,
}) {
  const [mounted, setMounted] = React.useState(false);
  const [notif, setNotif] = React.useState("default");
  const [guardOn, setGuardOn] = React.useState(true);

  const [awaySec, setAwaySec] = React.useState(0.5);
  const [coolSec, setCoolSec] = React.useState(5);
  const [awayInput, setAwayInput] = React.useState("0.5");
  const [coolInput, setCoolInput] = React.useState("5");
  const [ignoreCount, setIgnoreCount] = React.useState(0);

  React.useEffect(() => {
    setMounted(true);
    try { setNotif(typeof Notification !== "undefined" ? Notification.permission : "default"); } catch {}
  }, []);

  React.useEffect(() => {
    try {
      const on  = JSON.parse(localStorage.getItem("kflow.guard.on") ?? "true");
      const dS  = parseFloat(localStorage.getItem("kflow.guard.awayDelaySec") ?? "0.5");
      const cS  = parseFloat(localStorage.getItem("kflow.guard.cooldownSec") ?? "5");
      const igc = parseInt(localStorage.getItem("kflow.guard.ignoreCount") ?? "0", 10);

      setGuardOn(Boolean(on));
      const dOk = Number.isFinite(dS) ? clamp(dS, 0.2, 5.0) : 0.5;
      const cOk = Number.isFinite(cS) ? clamp(cS, 1, 60)  : 5;

      setAwaySec(dOk); setAwayInput(fmt(dOk));
      setCoolSec(cOk); setCoolInput(fmt(cOk));
      setIgnoreCount(clamp(Number.isFinite(igc) ? igc : 0, 0, 10));
    } catch {}
  }, []);

  React.useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem("kflow.guard.on", JSON.stringify(guardOn));
      localStorage.setItem("kflow.guard.awayDelaySec", String(awaySec));
      localStorage.setItem("kflow.guard.cooldownSec", String(coolSec));
      localStorage.setItem("kflow.guard.ignoreCount", String(ignoreCount));

      window.dispatchEvent(new CustomEvent("kflow:guard-config", {
        detail: {
          guardOn,
          awayDelayMs: Math.round(awaySec * 1000),
          cooldownMs: Math.round(coolSec * 1000),
          ignoreCount,
        }
      }));
    } catch {}
  }, [mounted, guardOn, awaySec, coolSec, ignoreCount]);

  async function requestNotify() {
    try {
      const ok = await ensureNotifyPermission();
      setNotif(typeof Notification !== "undefined" ? Notification.permission : (ok ? "granted" : "default"));
    } catch {}
  }

  const revertAway = () => { if (awayInput.trim() === "") setAwayInput(fmt(awaySec)); };
  const revertCool = () => { if (coolInput.trim() === "") setCoolInput(fmt(coolSec)); };

  React.useEffect(() => {
    if (!open || embedded || frameless) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    const onClick = (e) => {
      const el = document.getElementById("fg-popover");
      if (el && !el.contains(e.target)) onClose?.();
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open, onClose, embedded, frameless]);

  if (!embedded && !frameless && !open) return null;

  const notifIcon = notif === "granted" ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />;

  const containerClass = (embedded || frameless)
    ? "relative w-full"
    : "absolute right-0 z-50 mt-2 w-[min(92vw,560px)]";

  const cardClass = frameless
    ? ""
    : "rounded-2xl p-4 ring-1 ring-emerald-400/25 bg-emerald-500/[0.06] backdrop-blur";

  const bodyClass = frameless
    ? "w-full"
    : "rounded-xl bg-white/80 dark:bg-zinc-950/70 ring-1 ring-white/10 p-3";

  return (
    <div id={embedded || frameless ? undefined : "fg-popover"} className={containerClass}>
      <div className={cardClass}>
        {(frameless || !embedded) && (
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-600 text-white ring-1 ring-emerald-300/70">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <div className="font-semibold tracking-tight leading-none">Flow Guard</div>
                <div className="text-xs text-emerald-900/70 dark:text-emerald-200/70 mt-0.5">
                  Penjaga Flow Kamu.
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setGuardOn(v => !v)}
                className={cx(
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs ring-1 transition",
                  guardOn
                    ? "bg-emerald-600 text-white ring-emerald-500 hover:bg-emerald-700"
                    : "bg-white/70 dark:bg-zinc-900/60 text-zinc-700 dark:text-zinc-200 ring-emerald-300/40 hover:bg-white/90 dark:hover:bg-zinc-900"
                )}
                title="Aktif/nonaktif Flow Guard"
              >
                <span className={cx("inline-block h-2 w-2 rounded-full", guardOn ? "bg-white" : "bg-emerald-400")} />
                {guardOn ? "ON" : "OFF"}
              </button>
              {!embedded && !frameless && (
                <button
                  type="button"
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-white/70 dark:hover:bg-zinc-900/60 ring-1 ring-emerald-300/40"
                  title="Tutup"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        )}

        <div className={bodyClass}>
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-3 ring-1 ring-emerald-200/60 dark:ring-emerald-300/20 bg-emerald-50/40 dark:bg-emerald-900/10">
                <div className="text-[11px] uppercase tracking-wide text-emerald-900/70 dark:text-emerald-200/70 flex items-center gap-2">
                  <TimerIcon className="h-3.5 w-3.5" /> Jeda Notifikasi
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number" inputMode="decimal" step="0.1" min="0.2" max="5"
                    value={awayInput}
                    onChange={(e) => {
                      const v = e.target.value; setAwayInput(v);
                      const n = parseFloat(v); if (Number.isFinite(n)) setAwaySec(clamp(n, 0.2, 5));
                    }}
                    onBlur={revertAway}
                    onKeyDown={(e) => { if (e.key === "Enter") revertAway(); }}
                    className="w-28 rounded-lg px-3 py-2 text-sm ring-1 ring-emerald-300/60 dark:ring-emerald-300/30 bg-white/70 dark:bg-zinc-950/60 focus:outline-none focus:ring-emerald-400"
                    placeholder={fmt(awaySec)}
                    aria-label="Jeda tab-out (detik)"
                  />
                  <span className="text-xs text-emerald-900/60 dark:text-emerald-200/60">detik</span>
                </div>
              </div>

              <div className="rounded-xl p-3 ring-1 ring-emerald-200/60 dark:ring-emerald-300/20 bg-emerald-50/40 dark:bg-emerald-900/10">
                <div className="text-[11px] uppercase tracking-wide text-emerald-900/70 dark:text-emerald-200/70 flex items-center gap-2">
                  <TimerIcon className="h-3.5 w-3.5" /> Cooldown
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    type="number" inputMode="decimal" step="0.5" min="1" max="60"
                    value={coolInput}
                    onChange={(e) => {
                      const v = e.target.value; setCoolInput(v);
                      const n = parseFloat(v); if (Number.isFinite(n)) setCoolSec(clamp(n, 1, 60));
                    }}
                    onBlur={revertCool}
                    onKeyDown={(e) => { if (e.key === "Enter") revertCool(); }}
                    className="w-28 rounded-lg px-3 py-2 text-sm ring-1 ring-emerald-300/60 dark:ring-emerald-300/30 bg-white/70 dark:bg-zinc-950/60 focus:outline-none focus:ring-emerald-400"
                    placeholder={fmt(coolSec)}
                    aria-label="Cooldown (detik)"
                  />
                  <span className="text-xs text-emerald-900/60 dark:text-emerald-200/60">detik</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="rounded-xl p-3 ring-1 ring-emerald-200/60 dark:ring-emerald-300/20 bg-emerald-50/40 dark:bg-emerald-900/10">
                <div className="text-[11px] uppercase tracking-wide text-emerald-900/70 dark:text-emerald-200/70">
                  Toleransi tab-out
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIgnoreCount(v => clamp(v - 1, 0, 10))}
                    className="p-2 rounded-lg ring-1 ring-emerald-300/60 dark:ring-emerald-300/30 bg-white/60 dark:bg-zinc-950/60 hover:bg-white/80 dark:hover:bg-zinc-900"
                    title="Kurangi"
                  ><Minus className="h-4 w-4" /></button>

                  <input
                    type="number" inputMode="numeric" min={0} max={10}
                    value={ignoreCount}
                    onChange={(e) => {
                      const n = parseInt(e.target.value || "0", 10);
                      setIgnoreCount(clamp(Number.isFinite(n) ? n : 0, 0, 10));
                    }}
                    className="w-16 text-center rounded-lg px-2 py-2 text-sm ring-1 ring-emerald-300/60 dark:ring-emerald-300/30 bg-white/70 dark:bg-zinc-950/60 focus:outline-none focus:ring-emerald-400"
                    aria-label="Jumlah tab-out diabaikan"
                  />

                  <button
                    type="button"
                    onClick={() => setIgnoreCount(v => clamp(v + 1, 0, 10))}
                    className="p-2 rounded-lg ring-1 ring-emerald-300/60 dark:ring-emerald-300/30 bg-white/60 dark:bg-zinc-950/60 hover:bg-white/80 dark:hover:bg-zinc-900"
                    title="Tambah"
                  ><Plus className="h-4 w-4" /></button>
                </div>
              </div>

              <button
                type="button"
                onClick={requestNotify}
                className="rounded-xl p-3 ring-1 ring-emerald-200/60 dark:ring-emerald-300/20 bg-emerald-50/40 dark:bg-emerald-900/10 flex items-center justify-between text-sm hover:bg-emerald-50/70 dark:hover:bg-emerald-900/20"
                title="Izin notifikasi sistem"
              >
                <span className="inline-flex items-center gap-2">
                  {notifIcon}
                  Notifikasi
                </span>
                <span className="font-medium">{mounted ? notif : "—"}</span>
              </button>
            </div>
          </div>

          {showFooterNote && (
            <p className="mt-3 text-xs text-emerald-900/75 dark:text-emerald-200/70">
              Saat <strong>Flow Guard</strong> aktif, K-Flow akan mengintervensi ketika kamu tab-out
              di fase fokus, mengikuti jeda &amp; cooldown di atas. “Toleransi tab-out”
              akan mengabaikan sejumlah tab-out pertama.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
