"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import TaskAdder from "./TaskAdder";
import TaskList from "./TaskList";

const STORAGE_KEY = "tuntasin.tasks.v1";

function useTasks() {
  const [tasks, setTasks] = React.useState([]);
  const ready = React.useRef(false);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setTasks(JSON.parse(raw));
    } catch {}
    ready.current = true;
  }, []);

  React.useEffect(() => {
    if (!ready.current) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {}
  }, [tasks]);

  const addTask = (title, cycles = 2) => {
    const t = {
      id: crypto?.randomUUID?.() ?? String(Date.now()),
      title: title.trim(),
      cycles: Math.max(1, Math.min(12, Number(cycles) || 1)),
      done: 0,
      completed: false,
      createdAt: Date.now(),
      lastDone: 0,
    };
    setTasks((prev) => [...prev, t]);
  };

  const removeTask = (id) =>
    setTasks((prev) => prev.filter((t) => t.id !== id));

  const incDone = (id) =>
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              done: Math.min(t.cycles, t.done + 1),
              completed: t.done + 1 >= t.cycles,
            }
          : t
      )
    );

  const toggleComplete = (id) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        if (!t.completed) {
          return {
            ...t,
            lastDone: t.done,
            done: t.cycles,
            completed: true,
          };
        } else {

          return {
            ...t,
            done: t.lastDone ?? t.done,
            completed: false,
          };
        }
      })
    );

  const updateTask = (id, { title, cycles }) =>
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t;
        const nextCycles = Math.max(1, Math.min(12, Number(cycles ?? t.cycles)));
        const nextTitle = title !== undefined ? title.trim() : t.title;
        const nextDone = Math.min(t.done, nextCycles);
        return {
          ...t,
          title: nextTitle || t.title,
          cycles: nextCycles,
          done: nextDone,
          completed: nextDone >= nextCycles,
        };
      })
    );

  const clearAll = () => setTasks([]);
  const clearCompleted = () =>
    setTasks((prev) => prev.filter((t) => !t.completed));

  return {
    tasks,
    addTask,
    removeTask,
    incDone,
    toggleComplete,
    updateTask,
    clearAll,
    clearCompleted,
  };
}

function Menu({ open, anchorRef, onClose, children }) {
  const [pos, setPos] = React.useState({ top: 0, left: 0 });

  React.useLayoutEffect(() => {
    if (!open || !anchorRef?.current) return;
    const r = anchorRef.current.getBoundingClientRect();
    const PANEL_W = 256;
    const GAP = 8;
    const top = r.bottom + GAP;
    const left = Math.min(
      window.innerWidth - PANEL_W - 12,
      Math.max(12, r.right - PANEL_W)
    );
    setPos({ top, left });
  }, [open, anchorRef]);

  React.useEffect(() => {
    if (!open) return;
    const onEsc = (e) => e.key === "Escape" && onClose();
    const onRelayout = () => onClose();
    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onRelayout, { passive: true });
    window.addEventListener("resize", onRelayout, { passive: true });
    return () => {
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onRelayout);
      window.removeEventListener("resize", onRelayout);
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 z-[70]" onClick={onClose} />
      <div
        className="fixed z-[80] w-64 overflow-hidden rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/95 dark:bg-zinc-950/95 backdrop-blur shadow-[0_12px_48px_rgba(16,185,129,.15)]"
        style={{ top: pos.top, left: pos.left }}
        role="menu"
      >
        {children}
      </div>
    </>
  );
}

export default function TasksPanel() {
  const {
    tasks,
    addTask,
    removeTask,
    incDone,
    toggleComplete,
    updateTask,
    clearAll,
    clearCompleted,
  } = useTasks();

  const ordered = React.useMemo(
    () => [...tasks].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0)),
    [tasks]
  );

  React.useEffect(() => {
    function onBump(e) {
      const delta = Number(e?.detail?.delta ?? 1) || 1;
      const target = [...ordered].find((t) => !t.completed);
      if (!target) return;
      for (let i = 0; i < delta; i++) incDone(target.id);
    }
    window.addEventListener("kflow:task-progress", onBump);
    return () => window.removeEventListener("kflow:task-progress", onBump);
  }, [ordered, incDone]);

  // Edit state
  const [editingId, setEditingId] = React.useState(null);
  const [editTitle, setEditTitle] = React.useState("");
  const [editCyclesStr, setEditCyclesStr] = React.useState("2");

  const startEdit = (t) => {
    setEditingId(t.id);
    setEditTitle(t.title);
    setEditCyclesStr(String(t.cycles));
  };
  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCyclesStr("2");
  };
  const saveEdit = (id) => {
    const c = Math.max(1, Math.min(12, parseInt(editCyclesStr || "1", 10)));
    const name = editTitle.trim();
    if (!name) return;
    updateTask(id, { title: name, cycles: c });
    cancelEdit();
  };

  const [menuOpen, setMenuOpen] = React.useState(false);
  const menuBtnRef = React.useRef(null);

  const listShouldScroll = ordered.length > 3;

  return (
    <section aria-labelledby="tasks-heading">
      <div
        className="rounded-3xl border border-zinc-200/80 dark:border-zinc-800/80 
        bg-gradient-to-tr from-white/90 via-white/80 to-emerald-50/70 
        dark:from-zinc-950/90 dark:via-zinc-950/80 dark:to-emerald-950/20 
        backdrop-blur-xl p-6 md:p-7
        shadow-[0_20px_60px_rgba(16,185,129,.12)] relative overflow-hidden"
      >
        <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-emerald-400/20 blur-3xl" />

        {/* Header */}
        <div className="relative z-10 flex items-center justify-between gap-3">
          <div>
            <h3
              id="tasks-heading"
              className="text-xl md:text-2xl font-semibold tracking-tight"
            >
              Tugas Fokus
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-0.5">
              Ketik judul, atur siklus, lalu tekan Enter.
            </p>
          </div>

          <div className="relative" ref={menuBtnRef}>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="inline-flex items-center justify-center h-10 w-10 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-950/70 hover:bg-white dark:hover:bg-zinc-900 transition"
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              title="Pengaturan"
            >
              <MoreVertical className="h-4 w-4" />
            </button>

            <Menu
              open={menuOpen}
              anchorRef={menuBtnRef}
              onClose={() => setMenuOpen(false)}
            >
              <div className="p-2">
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (
                      confirm("Hapus SEMUA tugas? Tindakan ini tidak dapat dibatalkan.")
                    ) {
                      clearAll();
                    }
                  }}
                  className="w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Hapus semua tugas
                </button>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    if (confirm("Hapus semua tugas yang SUDAH SELESAI?")) {
                      clearCompleted();
                    }
                  }}
                  className="mt-1 w-full text-left rounded-xl px-3 py-2 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-900"
                >
                  Hapus tugas selesai saja
                </button>
              </div>
            </Menu>
          </div>
        </div>

        {/* Adder */}
        <div className="relative z-10 mt-4">
          <TaskAdder onAdd={(title, cycles) => addTask(title, cycles)} />
        </div>

        {/* List */}
        <TaskList
          tasks={ordered}
          listShouldScroll={listShouldScroll}
          onToggleComplete={toggleComplete}
          onStartEdit={startEdit}
          onRemove={removeTask}
          editingId={editingId}
          editTitle={editTitle}
          editCyclesStr={editCyclesStr}
          setEditTitle={setEditTitle}
          setEditCyclesStr={setEditCyclesStr}
          onSaveEdit={saveEdit}
          onCancelEdit={cancelEdit}
        />
      </div>
    </section>
  );
}
