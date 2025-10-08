"use client";

import { useEffect, useRef } from "react";
import { useDistractionStore } from "../lib/useDistractionStore.js";

export function useDistractionLogger() {
  const { current, logTabOut, logTabIn } = useDistractionStore();

  const phaseRef = useRef("in");
  const outAtRef = useRef(null);

  useEffect(() => {
    if (typeof document === "undefined" || typeof window === "undefined") return;
    if (!current) return;

    const FLAG = "__tuntasin_vis_logger_bound__";
    if (window[FLAG]) return;
    window[FLAG] = true;

    phaseRef.current = document.visibilityState === "hidden" ? "out" : "in";
    outAtRef.current = phaseRef.current === "out" ? Date.now() : null;

    const markOut = () => {
      if (phaseRef.current === "out") return;
      phaseRef.current = "out";
      outAtRef.current = Date.now();
      try { logTabOut?.({ reason: "vis_hidden", url: location.href }); } catch {}
      try {
        window.dispatchEvent(
          new CustomEvent("tuntasin:auto-ledger", {
            detail: { label: "TabOut", token: outAtRef.current }
          })
        );
      } catch {}
    };

    const markIn = () => {
      if (phaseRef.current === "in") return;
      const started = outAtRef.current;
      phaseRef.current = "in";
      outAtRef.current = null;
      try {
        logTabIn?.({
          reason: "vis_visible",
          url: location.href,
          dur_ms: started ? Math.max(0, Date.now() - started) : 0,
        });
      } catch {}
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") markOut();
      else markIn();
    };

    document.addEventListener("visibilitychange", onVisibility, { passive: true });

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window[FLAG] = false;
      if (phaseRef.current === "out" && outAtRef.current != null) {
        const started = outAtRef.current;
        phaseRef.current = "in";
        outAtRef.current = null;
        try {
          logTabIn?.({
            reason: "cleanup",
            url: location.href,
            dur_ms: started ? Math.max(0, Date.now() - started) : 0,
          });
        } catch {}
      }
    };
  }, [current, logTabOut, logTabIn]);
}
