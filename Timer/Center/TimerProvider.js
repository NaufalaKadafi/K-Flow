"use client";
import React, { useEffect, useRef, useCallback, useState } from "react";
import { PRESETS, sec } from "../Utils";
import { ensureNotifyPermission } from "../../lib/notify";
import { useDistractionStore } from "../../lib/useDistractionStore";
import { useDistractionLogger } from "../../lib/useDistractionLogger";
import { TimerCtx } from "./TimerContext";
import { useTimerCore } from "./useTimerCore";
import { useFlowGuard } from "./useFlowGuard";
import { useTasks } from "./useTasks";

const STORAGE_KEY = "kflow.timer.v1";

export default function TimerProvider({ children }) {
  const [preset, setPreset] = useState(PRESETS[1]);
  const [stage, setStage] = useState("focus");
  const [running, setRun] = useState(false);
  const [remaining, setRem] = useState(sec(PRESETS[1].focusMin));
  const [targetAt, setTgt] = useState(null);
  const [cycles, setCycles] = useState(0);
  const [stageStartedAt, setStageStartedAt] = useState(null);
  const [activeMs, setActiveMs] = useState(0);
  const [tickStartAt, setTickStartAt] = useState(null);
  const startedOnce = !!stageStartedAt;

  const [focusMode, setFocusMode] = useState(false);
  const [intention, setIntention] = useState("");
  const [tags, setTags] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [showSummary, setShowSummary] = useState(false);
  const [summary, setSummary] = useState(null);


  const {
    tasks,
    setTasks,
    activeTaskId,
    setActiveTaskId,
    addTask,
    removeTask,
    setActiveTask,
    clearDoneTasks,
  } = useTasks();

  const store = useDistractionStore?.() ?? {};
  const { current: currentSession, endSession, logManual } = store;

  useDistractionLogger(); 

  const [focusCardOpen, setFocusCardOpen] = useState(false);
  const [focusCardTitle, setFocusCardTitle] = useState("");
  const [focusCardMessage, setFocusCardMessage] = useState("");
  const focusCardTimeoutRef = useRef(null);

  const openFocusCard = useCallback((title, message, ms = 20000) => {
    setFocusCardTitle(title || "Back to focus");
    setFocusCardMessage(message || "Selamat datang kembali.");
    setFocusCardOpen(true);
    if (focusCardTimeoutRef.current) window.clearTimeout(focusCardTimeoutRef.current);
    focusCardTimeoutRef.current = window.setTimeout(() => setFocusCardOpen(false), ms);
  }, []);

  const closeFocusCard = useCallback(() => {
    setFocusCardOpen(false);
    if (focusCardTimeoutRef.current) window.clearTimeout(focusCardTimeoutRef.current);
  }, []);


  useEffect(() => {
    ensureNotifyPermission().catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.classList.toggle("focus-mode", !!focusMode);
    }
  }, [focusMode]);


  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const s = JSON.parse(raw);

      Object.entries(s).forEach(([k, v]) => {
        switch (k) {
          case "presetId": {
            const found = PRESETS.find(p => p.id === v);
            if (found) setPreset(found);
            break;
          }
          case "stage": setStage(v); break;
          case "running": setRun(v); break;
          case "remaining": setRem(v); break;
          case "targetAt": setTgt(v); break;
          case "cycles": setCycles(v); break;
          case "focusMode": setFocusMode(v); break;
          case "intention": setIntention(v); break;
          case "tags": setTags(v); break;
          case "ledger": setLedger(v); break;
          case "tasks": setTasks(v); break;
          case "activeTaskId": setActiveTaskId(v); break;
          case "stageStartedAt": setStageStartedAt(v); break;
          case "activeMs": setActiveMs(v); break;
          case "tickStartAt": setTickStartAt(v); break;
          default: break;
        }
      });
    } catch {}
  }, [setTasks, setActiveTaskId]);


  useEffect(() => {
    const payload = {
      presetId: preset.id,
      stage, running, remaining, targetAt, cycles,
      focusMode, intention, tags, ledger, tasks, activeTaskId,
      stageStartedAt, activeMs, tickStartAt,
    };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {}
  }, [
    preset, stage, running, remaining, targetAt, cycles,
    focusMode, intention, tags, ledger, tasks, activeTaskId,
    stageStartedAt, activeMs, tickStartAt
  ]);


  useEffect(() => {
    if (running) return;
    setRem(stage === "focus" ? sec(preset.focusMin) : sec(preset.breakMin));
  }, [preset, stage]);


  const logDistraction = useCallback(async (label, kind = "manual") => {
    const entry = { kind, label, t: Date.now() };
    setLedger(prev => [...prev, entry]);
    try {
      await logManual?.(label);
    } catch (err) {
      console.warn("Gagal menyimpan distraksi:", err);
    }
  }, [logManual]);

  useEffect(() => {
    const onAutoLedger = (e) => {
      const label = e.detail?.label || "TabOut";
      logDistraction(label, "auto");
    };
    window.addEventListener("tuntasin:auto-ledger", onAutoLedger);
    return () => window.removeEventListener("tuntasin:auto-ledger", onAutoLedger);
  }, [logDistraction]);


  const timerCore = useTimerCore({
    preset, setPreset, stage, setStage, running, setRun,
    remaining, setRem, targetAt, setTgt, cycles, setCycles,
    stageStartedAt, setStageStartedAt, activeMs, setActiveMs,
    tickStartAt, setTickStartAt, intention, tags, ledger, setLedger,
    tasks, setTasks, activeTaskId, setActiveTaskId,
    setShowSummary, setSummary, currentSession, endSession,
  });

  useFlowGuard({ stage, running, startedOnce, openFocusCard, setLedger });


  const canEnd = !!stageStartedAt || running;

  const value = {
    preset, stage, running, remaining, cycles,
    focusMode, intention, tags, ledger,
    showSummary, summary,
    setFocusMode, setIntention, setTags,
    setShowSummary,
    focusCardOpen, focusCardTitle, focusCardMessage, closeFocusCard,
    tasks, activeTaskId,
    addTask, removeTask, setActiveTask, clearDoneTasks,
    canEnd,
    logDistraction,
    ...timerCore,
  };

  return <TimerCtx.Provider value={value}>{children}</TimerCtx.Provider>;
}
