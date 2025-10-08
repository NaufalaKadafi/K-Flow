"use client";
import React from "react";
import { PRESETS, sec } from "../Utils";
import { SOUNDS, playSound } from "../../lib/sfx";
import { notifyWithSound, ensureNotifyPermission } from "../../lib/notify";

const now = () => Date.now();

export function useTimerCore({
  preset, setPreset, stage, setStage,
  running, setRun, remaining, setRem,
  targetAt, setTgt, cycles, setCycles,
  stageStartedAt, setStageStartedAt,
  activeMs, setActiveMs, tickStartAt, setTickStartAt,
  intention, tags, ledger, setLedger,
  tasks, setTasks, activeTaskId, setActiveTaskId,
  setShowSummary, setSummary,
  currentSession, endSession
}) {
  function nextStage(clearLedger = true) {
    setStage(prev => {
      const next = prev === "focus" ? "break" : "focus";
      const nextDur = next === "focus" ? sec(preset.focusMin) : sec(preset.breakMin);
      setRem(nextDur);
      if (clearLedger) setLedger([]);
      return next;
    });
  }

  function cleanupForNextStage(clearLedger = true) {
    setActiveMs(0);
    setTickStartAt(null);
    if (clearLedger) setLedger([]);
    setStageStartedAt(null);
  }

  function finalizeFocusSummary(endedBy = "auto") {
    const extra = tickStartAt ? now() - tickStartAt : 0;
    const focusMs = Math.max(0, activeMs + extra);
    const focusMin = Math.max(0, Math.round(focusMs / 60000));

    if (activeTaskId) {
      setTasks(arr =>
        arr.map(t =>
          t.id === activeTaskId
            ? {
                ...t,
                done: Math.min(t.cycles, (t.done || 0) + 1),
                completed: (t.done || 0) + 1 >= t.cycles
              }
            : t
        )
      );
    }

    window.dispatchEvent(new CustomEvent("kflow:task-progress", { detail: { delta: 1 } }));

    setSummary({
      intention,
      tags,
      distractions: ledger,
      endedAt: new Date().toISOString(),
      preset: preset.label,
      focusMin,
      endedBy
    });

    setShowSummary(true);
    setCycles(c => c + 1);

    if (currentSession) {
      try { endSession?.(); } catch {}
    }
  }

  function handleStageEnd() {
    setRun(false);
    setTgt(null);

    if (stage === "focus") {
      notifyWithSound("Sesi Fokus Selesai 🎯", "Waktunya istirahat sejenak!", SOUNDS.FOCUS_END);
      finalizeFocusSummary("auto");
    } else {
      notifyWithSound("Istirahat Selesai ⏰", "Yuk balik fokus lagi!", SOUNDS.BREAK_END);
    }

    nextStage(true);
    cleanupForNextStage(true);
  }

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      if (!targetAt) return;
      const left = Math.ceil((targetAt - now()) / 1000);
      setRem(left);
      if (left <= 0) handleStageEnd();
    }, 250);
    return () => clearInterval(id);
  }, [running, targetAt, stage]);

  async function start() {
    if (running) return;
    const dur = remaining > 0
      ? remaining
      : stage === "focus"
        ? sec(preset.focusMin)
        : sec(preset.breakMin);

    const tgt = now() + dur * 1000;
    setTgt(tgt);
    setRun(true);
    setTickStartAt(now());
    setStageStartedAt(t => t ?? now());

    try { await ensureNotifyPermission(); } catch {}
    playSound(SOUNDS.START, 0.4);
  }

  function pause() {
    if (!running) return;
    setRun(false);
    if (targetAt) setRem(Math.max(0, Math.ceil((targetAt - now()) / 1000)));
    setTgt(null);
    if (tickStartAt) setActiveMs(ms => ms + (now() - tickStartAt));
    setTickStartAt(null);
  }

  function reset() {
    setRun(false);
    setTgt(null);
    const dur = stage === "focus" ? sec(preset.focusMin) : sec(preset.breakMin);
    setRem(dur);
    setStageStartedAt(null);
    setActiveMs(0);
    setTickStartAt(null);
    setLedger([]);
  }

  function skip() {
    setRun(false);
    setTgt(null);
    setActiveMs(0);
    setTickStartAt(null);
    const clear = stage === "focus";
    nextStage(clear);
  }

  function endNow() {
    if (!stageStartedAt) return;
    setRun(false);
    setTgt(null);

    if (stage === "focus") {
      notifyWithSound("Sesi Fokus Selesai", "Waktunya istirahat sejenak!", SOUNDS.FOCUS_END);
      finalizeFocusSummary("manual");
    } else {
      notifyWithSound("Istirahat Selesai", "Yuk balik fokus lagi!", SOUNDS.BREAK_END);
    }

    nextStage(true);
    cleanupForNextStage(true);
  }

  function addMinutes(m = 5) {
    if (stage !== "focus") return;
    setRem(r => r + m * 60);
    if (running && targetAt) setTgt(targetAt + m * 60 * 1000);
  }

  return {
    start,
    pause,
    reset,
    skip,
    endNow,
    addMinutes,
    pickPreset: setPreset
  };
}
