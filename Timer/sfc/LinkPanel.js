"use client";

import { useState, useCallback } from "react";
import { useStore } from "zustand";
import { ExternalLink, Trash2, Link as LinkIcon, Plus } from "lucide-react";
import { linkKerjaStore } from "./LinkKerja";

const cx = (...a) => a.filter(Boolean).join(" ");


function normalizeUrl(raw = "") {
  const s = String(raw).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  if (/^\/\//.test(s)) return "https:" + s;
  return "https://" + s;
}

export default function LinkPanel() {
  const links         = useStore(linkKerjaStore, (s) => s.links);
  const addLink       = useStore(linkKerjaStore, (s) => s.addLink);
  const removeLink    = useStore(linkKerjaStore, (s) => s.removeLink);
  const openInWorkTab = useStore(linkKerjaStore, (s) => s.openInWorkTab);

  const [title, setTitle] = useState("");
  const [url, setUrl]     = useState("");

  const onAdd = useCallback(() => {
    const nu = normalizeUrl(url);
    if (!nu) return;
    addLink(title, nu);
    setTitle("");
    setUrl("");
  }, [title, url, addLink]);

  const onKeyDown = (e) => { if (e.key === "Enter") onAdd(); };


  const proxyOpen = useCallback((e, id) => {
    if (e) {

      e.preventDefault?.();
      e.stopPropagation?.();
    }
    openInWorkTab(id);
  }, [openInWorkTab]);

  return (
    <div
      className="font-sans rounded-2xl border border-white/10 bg-white/75 dark:bg-zinc-950/60 backdrop-blur p-4 ring-1 ring-zinc-200/70 dark:ring-white/10 shadow-sm"

      onMouseDownCapture={() => {
        try { window.dispatchEvent(new CustomEvent("kflow:work-link-open", { detail: { at: Date.now(), source: "panel-intent" } })); } catch {}
      }}
      onContextMenuCapture={() => {
        try { window.dispatchEvent(new CustomEvent("kflow:work-link-open", { detail: { at: Date.now(), source: "panel-intent" } })); } catch {}
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="font-medium tracking-tight">Work Links</div>
      </div>


      <div className="flex flex-col sm:flex-row gap-2 mb-3">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Title (opsional)"
          className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-emerald-400/60"
        />
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="https://contoh.com"
          className="w-full px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 bg-transparent text-sm placeholder:text-zinc-400 focus:outline-none focus:ring-emerald-400/60"
        />
        <button
          onClick={onAdd}
          disabled={!normalizeUrl(url)}
          className={cx(
            "inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-white",
            normalizeUrl(url) ? "bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800"
                              : "bg-emerald-600/50 cursor-not-allowed"
          )}
          title="Tambah link"
        >
          <Plus className="h-4 w-4" />
          Add
        </button>
      </div>

      <div className="space-y-2">
        {links.length === 0 && (
          <div className="text-sm text-zinc-500">
            Tambahkan link kerja inti (docs, repo, tiket, referensi). Klik “Open” akan selalu pakai satu tab yang sama.
          </div>
        )}

        {links.map((link) => (
          <div
            key={link.id}
            className="flex items-center justify-between gap-3 px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-white/10 hover:bg-zinc-50 dark:hover:bg-zinc-900"
          >
            <div className="min-w-0">
              <div className="truncate font-medium tracking-tight">{link.title}</div>


              <a
                href={link.url}
                onClick={(e) => proxyOpen(e, link.id)}
                onAuxClick={(e) => proxyOpen(e, link.id)}  
                onKeyDown={(e) => { if (e.key === "Enter") proxyOpen(e, link.id); }}
                role="link"
                className="text-xs text-zinc-500 hover:underline cursor-pointer break-all"
                title="Buka di tab kerja (re-use)"
              >
                {link.url}
              </a>
            </div>

            <div className="flex items-center gap-1">
              <button
                className="inline-flex items-center gap-1 px-2 py-1 rounded-lg ring-1 ring-zinc-200 dark:ring-white/10 text-sm hover:bg-white/60 dark:hover:bg-white/5"
                onClick={() => openInWorkTab(link.id)}
                title="Open (re-use tab kerja)"
              >
                <ExternalLink className="h-4 w-4" />
                Open
              </button>

              <button
                className="inline-flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
                onClick={() => removeLink(link.id)}
                title="Hapus"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 text-xs text-zinc-500 flex items-center gap-2">
        <LinkIcon className="h-4 w-4" />
        Link dibuka/ditimpa di satu tab bernama <code>kflow-work</code>. Notifikasi tab-out diredam sesaat karena ini aksi yang disengaja.
      </div>
    </div>
  );
}
