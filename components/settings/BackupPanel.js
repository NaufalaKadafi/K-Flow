"use client";

import React from "react";
import { downloadBackup, restoreFromFile } from "../lib/Storage/backup";

export default function BackupRestorePanel() {
  const fileRef = React.useRef(null);
  const [busy, setBusy] = React.useState(false);
  const [msg, setMsg] = React.useState("");

  async function handleBackup() {
    try {
      setBusy(true);
      setMsg("Menyiapkan backup…");
      const filename = `kflow-backup-${new Date().toISOString().slice(0,10)}.json`;
      await downloadBackup(filename);
      setMsg("Backup terunduh.");
    } catch (e) {
      setMsg("Gagal backup: " + (e?.message || e));
    } finally {
      setBusy(false);
    }
  }

  function handlePickFile() {
    fileRef.current?.click();
  }

  async function handleRestore(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setBusy(true);
      setMsg("Memulihkan data…");
      await restoreFromFile(f);
      setMsg("Restore selesai. Memuat ulang UI…");
      window.location.reload();
    } catch (e2) {
      setMsg("Gagal restore: " + (e2?.message || e2));
    } finally {
      e.target.value = "";
      setBusy(false);
    }
  }

  return (
    <div
      className="space-y-3 p-4 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800"
      aria-busy={busy ? "true" : "false"}
    >
      <div className="font-medium">Backup & Restore — K-Flow</div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={busy}
          onClick={handleBackup}
          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-60"
        >
          {busy ? "Memproses…" : "Backup data"}
        </button>

        <button
          type="button"
          disabled={busy}
          onClick={handlePickFile}
          className="px-3 py-1.5 rounded-lg ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-60"
        >
          Restore dari file…
        </button>

        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleRestore}
        />
      </div>

      {!!msg && <div className="text-sm text-zinc-500">{msg}</div>}

      <p className="text-xs text-zinc-500">
        Catatan: restore akan menulis ulang localStorage & IndexedDB. Setelah selesai, halaman akan di-reload agar state timer ikut sinkron.
      </p>
    </div>
  );
}
