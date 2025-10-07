"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  X, Download, Upload, CheckCircle2, AlertTriangle, Loader2,
  Settings as SettingsIcon, Music, Database, Info
} from "lucide-react";
import Logo from "../Logo";
import FlowGuardPanel from "./FlowGuardPanel";

const cx = (...a) => a.filter(Boolean).join(" ");

export default function SettingsModal({ open, onClose, onExport, onImport }) {
  if (!open) return null;

  const [tab, setTab] = useState("general");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const dropRef = useRef(null);
  const fileRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    const el = dropRef.current;
    if (!el) return;
    const stop = (e) => { e.preventDefault(); e.stopPropagation(); };
    const over = (e) => { stop(e); el.classList.add("ring-emerald-400"); };
    const leave = (e) => { stop(e); el.classList.remove("ring-emerald-400"); };
    const drop = async (e) => {
      stop(e); el.classList.remove("ring-emerald-400");
      const file = e.dataTransfer?.files?.[0];
      if (file) await handleImport(file);
    };
    el.addEventListener("dragenter", over);
    el.addEventListener("dragover", over);
    el.addEventListener("dragleave", leave);
    el.addEventListener("drop", drop);
    return () => {
      el.removeEventListener("dragenter", over);
      el.removeEventListener("dragover", over);
      el.removeEventListener("dragleave", leave);
      el.removeEventListener("drop", drop);
    };
  }, []);

  const tabs = useMemo(() => ([
    { id: "general", label: "General", icon: SettingsIcon },
    { id: "audio",   label: "Audio",   icon: Music },
    { id: "backup",  label: "Backup & Restore", icon: Database },
    { id: "about",   label: "About",   icon: Info },
  ]), []);

  async function handleExport() {
    setBusy(true); setMsg(null);
    try {
      const data = await onExport();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "K-Flow-backup.json"; a.click();
      URL.revokeObjectURL(url);
      setMsg({ kind: "success", text: "Backup berhasil diunduh." });
    } catch (e) {
      setMsg({ kind: "error", text: `Gagal membuat backup: ${e?.message || e}` });
    } finally { setBusy(false); }
  }

  async function handleImport(file) {
    if (!file) return;
    setBusy(true); setMsg(null);
    try {
      await onImport(file);
      setMsg({ kind: "success", text: "Restore selesai. Muat ulang jika data belum muncul." });
    } catch (e) {
      setMsg({ kind: "error", text: `Gagal restore: ${e?.message || e}` });
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div role="dialog" aria-modal="true" className="relative w-[min(94vw,960px)] max-h-[88vh] overflow-hidden rounded-3xl border border-white/10 bg-white/80 dark:bg-zinc-950/70 shadow-[0_10px_60px_-15px_rgba(0,0,0,.6)] backdrop-blur-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200/70 dark:border-white/10">
          <div className="flex items-center gap-3">
            <Logo className="h-6 w-6" />
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold">K-Flow</span>
              <span className="text-zinc-400">›</span>
              <span className="font-medium">Settings</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-zinc-100/70 dark:hover:bg-white/5" aria-label="Close settings">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-[220px_1fr] flex-1 min-h-0">
          <aside className="shrink-0 p-3 md:p-4 border-r border-zinc-200/70 dark:border-white/10 overflow-y-auto">
            <div className="space-y-1">
              {tabs.map(t => {
                const Active = tab === t.id;
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={cx(
                      "w-full text-left flex items-center gap-3 px-3 py-2 rounded-xl transition",
                      Active ? "bg-emerald-600 text-white" : "hover:bg-zinc-100/70 dark:hover:bg-white/5"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="text-sm">{t.label}</span>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="p-5 md:p-6 space-y-6 overflow-y-auto min-h-[520px] max-h-[80vh]">
            {tab === "general" && <GeneralTab />}
            {tab === "audio"   && <AudioTab />}
            {tab === "backup"  && (
              <BackupTab
                busy={busy}
                msg={msg}
                dropRef={dropRef}
                fileRef={fileRef}
                onExport={handleExport}
                onImport={handleImport}
              />
            )}
            {tab === "about"   && <AboutTab />}

            {busy && (
              <div className="h-0.5 w-full overflow-hidden rounded bg-zinc-200 dark:bg-white/10">
                <div className="h-full w-1/3 bg-emerald-500 animate-[progress_1.2s_ease_infinite]" />
              </div>
            )}
          </section>
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(50%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}

function Card({ title, desc, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/70 dark:bg-zinc-950/60 backdrop-blur p-4 ring-1 ring-zinc-200/70 dark:ring-white/10 shadow-sm">
      <div className="mb-3">
        <div className="font-medium">{title}</div>
        {desc && <div className="text-sm text-zinc-600 dark:text-zinc-400">{desc}</div>}
      </div>
      {children}
    </div>
  );
}

function GeneralTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">General</h3>

      <Card title="Theme" desc="Ikuti sistem atau pakai tema gelap/terang. (dummy)">
        <div className="flex gap-2">
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">System</button>
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">Light</button>
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">Dark</button>
        </div>
      </Card>

      <Card>
         <div className="max-w-[560px] w-full">
          <FlowGuardPanel embedded frameless showFooterNote={true} />
        </div>
      </Card>
    </div>
  );
}

function AudioTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Audio</h3>
      <Card title="Suara Notif" desc="Suara start / end fokus / end break.">
        <div className="flex flex-wrap gap-2">
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">start</button>
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">focus-end</button>
          <button className="px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10">break-end</button>
        </div>
      </Card>
    </div>
  );
}

function BackupTab({ busy, msg, dropRef, fileRef, onExport, onImport }) {
  return (
    <div className="space-y-5">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Backup &amp; Restore</h3>
      <Card title="Backup data lokal" desc="Ekspor semua data K-Flow ke file JSON.">
        <button
          onClick={onExport}
          disabled={busy}
          className={cx(
            "inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white shadow-sm",
            busy ? "bg-emerald-500/70" : "bg-emerald-600 hover:bg-emerald-700"
          )}
        >
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          <span>{busy ? "Menyiapkan…" : "Download backup (.json)"}</span>
        </button>
      </Card>

      <Card title="Restore dari file" desc="Impor file backup untuk mengembalikan data.">
        <div
          ref={dropRef}
          className="group rounded-2xl ring-1 ring-zinc-200 dark:ring-white/10 p-4 flex items-center justify-between gap-4 border border-dashed border-zinc-300/70 dark:border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="rounded-xl p-2 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300">
              <Upload className="h-5 w-5" />
            </div>
            <div className="text-sm">
              <div className="font-medium">Tarik & letakkan file di sini</div>
              <div className="text-zinc-500">atau pilih secara manual</div>
            </div>
          </div>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 cursor-pointer hover:bg-zinc-100/70 dark:hover:bg-white/5">
            <input
              ref={fileRef}
              type="file"
              accept=".json,application/json"
              hidden
              onChange={(e) => onImport(e.target.files?.[0])}
            />
            <span>Pilih File</span>
          </label>
        </div>
        <div className="text-xs text-zinc-500 mt-2">
          Format: <code>kflow-backup.json</code> disarankan &lt; 5&nbsp;MB.
        </div>
      </Card>

      {msg && (
        <div className="mt-3">
          <Banner kind={msg.kind}>{msg.text}</Banner>
        </div>
      )}
    </div>
  );
}

function Banner({ kind = "success", children }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/15 dark:text-emerald-300 dark:ring-emerald-900/40",
    error:   "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/15 dark:text-rose-300 dark:ring-rose-900/40",
    warn:    "bg-amber-50 text-amber-800 ring-amber-200 dark:bg-amber-900/15 dark:text-amber-300 dark:ring-amber-900/40",
  }[kind];
  const Icon = kind === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div className={cx("rounded-xl px-3 py-2 ring-1 flex items-start gap-2", styles)}>
      <Icon className="h-4 w-4 mt-0.5" /><div className="text-sm">{children}</div>
    </div>
  );
}

function AboutTab() {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-zinc-500">About</h3>
      <Card title="K-Flow" desc="Pomodoro yang peduli fokus—local-first, private by default.">
        <ul className="text-sm text-zinc-600 dark:text-zinc-400 list-disc pl-5 space-y-1">
          <li>Data disimpan di perangkatmu (IndexedDB + localStorage).</li>
          <li>Tidak ada akun, tidak ada server.</li>
          <li>Backup/Restore untuk pindah perangkat dengan aman.</li>
        </ul>
      </Card>
    </div>
  );
}
