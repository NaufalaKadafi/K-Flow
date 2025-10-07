"use client";
import React from "react";
import { SOUNDS, playSound } from "../../lib/sfx";
import { ensureNotifyPermission, sendNotifyPersistent } from "../../lib/notify";

const FLOW_GUARD = {
  enabled: true,
  cooldownMs: 8000,
  volume: 0.45,
};

export function useFlowGuard({
  stage, running, startedOnce,
  openFocusCard,
  setLedger
}) {
  const awayTimerRef = React.useRef(null);
  const awayActiveRef = React.useRef(false);
  const lastNotifyAtRef = React.useRef(0);
  const MIN_AWAY_MS = 300;

  React.useEffect(() => {
    function onHiddenArm() {
      if (!startedOnce) return;
      if (awayTimerRef.current) window.clearTimeout(awayTimerRef.current);
      awayTimerRef.current = window.setTimeout(() => {
        if (document.visibilityState !== "hidden" || awayActiveRef.current) return;
        awayActiveRef.current = true;

        if (stage === "focus" && running) {
          const ev = { t: Date.now(), label: "TabOut", kind: "auto" };
          setLedger(ls => [...ls, ev]);
          try { window.dispatchEvent(new CustomEvent("kflow:auto-ledger", { detail: ev })); } catch {}

          const nowTs = Date.now();
          if (FLOW_GUARD.enabled && nowTs - lastNotifyAtRef.current > FLOW_GUARD.cooldownMs) {
            ensureNotifyPermission().then(ok => {
              if (ok) sendNotifyPersistent("Tetap fokus?", "Kamu beralih dari K-Flow. Kembali untuk lanjutkan sesi.");
            });
            playSound(SOUNDS.NUDGE || SOUNDS.START, FLOW_GUARD.volume);
            lastNotifyAtRef.current = nowTs;
          }
        }
      }, MIN_AWAY_MS);
    }

    function onVisibleDisarm() {
      if (awayTimerRef.current) { window.clearTimeout(awayTimerRef.current); awayTimerRef.current = null; }
      if (awayActiveRef.current) {
        awayActiveRef.current = false;
        if (startedOnce && stage === "focus") {
          openFocusCard("Back to your Flow", "Kamu sempat tab-out. Yuk lanjutkan tugas ✨", 15000);
        }
      }
    }

    function onVisibilityChange() {
      if (document.visibilityState === "hidden") onHiddenArm();
      else if (document.visibilityState === "visible") onVisibleDisarm();
    }

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (awayTimerRef.current) window.clearTimeout(awayTimerRef.current);
    };
  }, [startedOnce, running, stage, openFocusCard]);
}
