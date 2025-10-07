"use client";

import React from "react";
import { ClipboardList } from "lucide-react";
import TaskItem from "./TaskItem";

export default function TaskList({
  tasks,
  onToggleComplete,
  onStartEdit,
  onRemove,
  editingId,
  editTitle,
  editCyclesStr,
  setEditTitle,
  setEditCyclesStr,
  onSaveEdit,
  onCancelEdit,
}) {
  return (
    <ul className="relative z-10 mt-5 space-y-3">
      {tasks.length === 0 ? (
        <li className="rounded-2xl border border-dashed border-zinc-300 dark:border-zinc-700 bg-white/60 dark:bg-zinc-900/60 p-6 text-sm text-zinc-600 dark:text-zinc-400 flex items-center gap-3">
          <span className="inline-grid h-9 w-9 place-items-center rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
            <ClipboardList className="h-4 w-4" />
          </span>
          Belum ada tugas. Klik “Tambahkan tugas” untuk memulai.
        </li>
      ) : (
        tasks.map((t) => (
          <TaskItem
            key={t.id}
            task={t}
            isEditing={editingId === t.id}
            onToggleComplete={() => onToggleComplete(t.id)}
            onStartEdit={() => onStartEdit(t)}
            onRemove={() => onRemove(t.id)}
            editTitle={editTitle}
            editCyclesStr={editCyclesStr}
            setEditTitle={setEditTitle}
            setEditCyclesStr={setEditCyclesStr}
            onSaveEdit={() => onSaveEdit(t.id)}
            onCancelEdit={onCancelEdit}
          />
        ))
      )}
    </ul>
  );
}
