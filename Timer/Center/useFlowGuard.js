"use client";

import React from "react";
import { ensureNotifyPermission, sendNotifyPersistent } from "../../lib/notify";
import { SOUNDS, playSound } from "../../lib/sfx";

const DEFAULTS = {
  enabled: true,
  awayDelayMs: 300,
  cooldownMs: 8000,
  volume: 0.45,
  ignoreCount: 0,
};

function readInitialConfig() {
  try {
    const on = JSON.parse(localStorage.getItem("kflow.guard.on") ?? "true");
    const awayS = parseFloat(localStorage.getItem("kflow.guard.awayDelaySec") ?? "0.3");
    const coolS = parseFloat(localStorage.getItem("kflow.guard.cooldownSec") ?? "8");
    const igc = parseInt(localStorage.getItem("kflow.guard.ignoreCount") ?? "0", 10);
    return {
      enabled: !!on,
      awayDelayMs: Number.isFinite(awayS) ? Math.max(200, Math.round(awayS * 1000)) : DEFAULTS.awayDelayMs,
      cooldownMs: Number.isFinite(coolS) ? Math.max(0, Math.round(coolS * 1000)) : DEFAULTS.cooldownMs,
      volume: DEFAULTS.volume,
      ignoreCount: Number.isFinite(igc) ? Math.max(0, Math.min(igc, 10)) : DEFAULTS.ignoreCount,
    };
  } catch {
    return { ...DEFAULTS };
  }
}

export function useFlowGuard({
  stage,
  running,
  startedOnce,
  openFocusCard,
  setLedger,
}) {
  const cfgRef = React.useRef(readInitialConfig());
  const phaseRef = React.useRef("in");
  const outAtRef = React.useRef(null);
  const armTimerRef = React.useRef(null);
  const ignoredCountRef = React.useRef(0);
  const lastInAtRef = React.useRef(0);

  const canLogDistraction = stage === "focus";
  const logDistraction = React.useCallback(
    (label, kind = "manual") => {
      if (!canLogDistraction) return;
      setLedger((ls) => [...ls, { t: Date.now(), label, kind }]);
    },
    [canLogDistraction, setLedger]
  );

  React.useEffect(() => {
    const onCfg = (e) => {
      const d = e?.detail || {};
      const next = { ...cfgRef.current, ...d };
      if (typeof d.guardOn === "boolean") next.enabled = d.guardOn;
      cfgRef.current = next;
    };
    window.addEventListener("kflow:guard-config", onCfg);
    return () => window.removeEventListener("kflow:guard-config", onCfg);
  }, []);

  React.useEffect(() => {
    phaseRef.current = "in";
    outAtRef.current = null;
    if (armTimerRef.current) {
      clearTimeout(armTimerRef.current);
      armTimerRef.current = null;
    }
    if (stage === "focus") ignoredCountRef.current = 0;
  }, [stage]);

  React.useEffect(() => {
    if (typeof document === "undefined") return;

    const appendAuto = () => {
      const ev = { t: Date.now(), label: "TabOut", kind: "auto" };
      setLedger((ls) => [...ls, ev]);
      try {
        window.dispatchEvent(new CustomEvent("kflow:auto-ledger", { detail: ev }));
      } catch {}
    };

    const actNow = async () => {
      const cfg = cfgRef.current;
      const now = Date.now();
      if (!cfg.enabled) return;
      if (now - lastInAtRef.current < (cfg.cooldownMs ?? DEFAULTS.cooldownMs)) return;
      if ((cfg.ignoreCount ?? 0) > 0 && ignoredCountRef.current < cfg.ignoreCount) {
        ignoredCountRef.current += 1;
        return;
      }
      appendAuto();
      try {
        const ok = await ensureNotifyPermission();
        if (ok) {
          sendNotifyPersistent("Tetap fokus?", "Kamu beralih dari K-Flow. Kembali untuk lanjutkan sesi.");
        }
      } catch {}
      try {
        const nudge = SOUNDS.NUDGE || SOUNDS.START;
        playSound(nudge, cfg.volume ?? DEFAULTS.volume);
      } catch {}
    };

    const armHidden = () => {
      if (!startedOnce || !running || stage !== "focus") return;
      if (armTimerRef.current) clearTimeout(armTimerRef.current);
      const delay = Math.max(200, cfgRef.current.awayDelayMs || DEFAULTS.awayDelayMs);
      armTimerRef.current = setTimeout(() => {
        if (document.visibilityState !== "hidden") return;
        if (phaseRef.current === "out") return;
        phaseRef.current = "out";
        outAtRef.current = Date.now();
        actNow();
      }, delay);
    };

    const disarmVisible = () => {
      if (armTimerRef.current) {
        clearTimeout(armTimerRef.current);
        armTimerRef.current = null;
      }
      if (phaseRef.current === "out") {
        phaseRef.current = "in";
        outAtRef.current = null;
        lastInAtRef.current = Date.now();
        if (startedOnce && stage === "focus") {
          try {
            openFocusCard?.("Back to your Flow", "Kamu sempat tab-out. Yuk lanjutkan tugas ✨", 15000);
          } catch {}
        }
      } else {
        lastInAtRef.current = Date.now();
      }
    };

    const onVis = () => {
      if (document.visibilityState === "hidden") armHidden();
      else disarmVisible();
    };

    document.addEventListener("visibilitychange", onVis, { passive: true });
    return () => {
      document.removeEventListener("visibilitychange", onVis);
      if (armTimerRef.current) clearTimeout(armTimerRef.current);
    };
  }, [stage, running, startedOnce, openFocusCard, setLedger]);

  return { logDistraction, canLogDistraction };
}
