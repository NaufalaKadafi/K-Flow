"use client";
import React from "react";

const uid = () =>
  (typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : String(Date.now() + Math.random()));

export function useTasks() {
  const [tasks, setTasks] = React.useState([]);
  const [activeTaskId, setActiveTaskId] = React.useState(null);

  function addTask(title, cyclesPlanned = 1) {
    const t = {
      id: uid(),
      title: String(title || "").trim(),
      cyclesPlanned: Math.max(1, parseInt(cyclesPlanned, 10) || 1),
      cyclesDone: 0,
      status: "active",
      createdAt: Date.now(),
    };
    setTasks(arr => [t, ...arr]);
    if (!activeTaskId) setActiveTaskId(t.id);
  }
  function removeTask(id) {
    setTasks(arr => arr.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  }
  function setActiveTask(id) {
    setActiveTaskId(id);
  }
  function clearDoneTasks() {
    setTasks(arr => arr.filter(t => t.status !== "done"));
    if (activeTaskId && tasks.find(t => t.id === activeTaskId)?.status === "done") {
      setActiveTaskId(null);
    }
  }

  return { tasks, activeTaskId, addTask, removeTask, setActiveTask, clearDoneTasks };
}
