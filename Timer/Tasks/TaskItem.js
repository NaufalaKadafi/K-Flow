"use client";

import React from "react";
import { Check, Pencil, Trash2, X } from "lucide-react";
import CompactProgress from "./CompactProgress";

function truncateTitle(str, max = 10) {
  if (typeof str !== "string") return "";
  return str.length > max ? str.slice(0, max) + "..." : str;
}

export default function TaskItem({
  task,
  isEditing,
  onToggleComplete,
  onStartEdit,
  onRemove,
  editTitle,
  editCyclesStr,
  setEditTitle,
  setEditCyclesStr,
  onSaveEdit,
  onCancelEdit,
}) {
  return (
    <li className="rounded-2xl border border-zinc-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 px-4 py-3 shadow-[0_8px_30px_rgba(0,0,0,.06)]">
      {!isEditing ? (
        <div className="flex items-center gap-3">
          {/* Toggle selesai */}
          <button
            onClick={onToggleComplete}
            className={[
              "h-9 w-9 grid place-items-center rounded-full ring-2 transition",
              task.completed
                ? "bg-emerald-600 ring-emerald-600 text-white"
                : "bg-white/80 dark:bg-zinc-900/80 ring-zinc-300 dark:ring-zinc-700 text-zinc-400",
            ].join(" ")}
            aria-label={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
            title={task.completed ? "Tandai belum selesai" : "Tandai selesai"}
          >
            <Check className="h-4 w-4" />
          </button>

          {/* Judul + progres */}
          <div className="flex-1 min-w-0">
            <div
              className={[
                "text-[15px] font-medium truncate",
                task.completed ? "line-through text-zinc-400" : "",
              ].join(" ")}
              title={task.title}
            >
              {truncateTitle(task.title, 10)}
            </div>
            <div className="mt-1">
              <CompactProgress done={task.done} total={task.cycles} />
            </div>
          </div>

          {/* Kontrol: edit + hapus (tanpa ±1) */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onStartEdit}
              className="h-9 w-9 grid place-items-center rounded-lg ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-600"
              aria-label="Edit tugas"
              title="Edit tugas"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={onRemove}
              className="ml-1 h-9 w-9 grid place-items-center rounded-lg ring-1 ring-zinc-300 dark:ring-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-zinc-500"
              aria-label="Hapus tugas"
              title="Hapus tugas"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        /* EDIT MODE — tombol bulat di dalam border */
        <div className="grid grid-cols-16 gap-4 md:gap-3">
          <div className="col-span-12 md:col-span-8">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && onSaveEdit()}
              className="w-full h-10 rounded-xl border border-zinc-300/70 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 px-3 text-[15px] focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <div className="col-span-12 md:col-span-4">
            <div className="h-10 rounded-2xl border border-zinc-300/70 dark:border-zinc-700 bg-white/80 dark:bg-zinc-900/80 flex items-center gap-2 px-2 md:px-3">
              <input
                inputMode="numeric"
                pattern="[0-9]*"
                value={editCyclesStr}
                onChange={(e) => setEditCyclesStr(e.target.value.replace(/\D/g, "").slice(0, 2))}
                onBlur={() =>
                  setEditCyclesStr(
                    String(Math.max(1, Math.min(12, parseInt(editCyclesStr || "1", 10))))
                  )
                }
                className="h-8 w-14 rounded-lg border border-transparent bg-transparent text-center text-[15px] outline-none focus:ring-0"
                aria-label="Jumlah siklus"
                placeholder="2"
              />

              <div className="ml-auto flex items-center gap-2">
                <button
                  onClick={onSaveEdit}
                  className="h-8 w-8 grid place-items-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                  title="Simpan"
                >
                  <Check className="h-4 w-4" />
                </button>
                <button
                  onClick={onCancelEdit}
                  className="h-8 w-8 grid place-items-center rounded-full bg-rose-600 text-white hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  title="Batal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </li>
  );
}
