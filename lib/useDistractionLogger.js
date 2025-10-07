"use client";

import { useEffect, useRef } from "react";
import { useDistractionStore } from "../lib/useDistractionStore.js";

export function useDistractionLogger() {
  const { current, logTabOut, logTabIn } = useDistractionStore();

  // penanda kapan keluar & sumber terakhir (untuk dedup)
  const outAtRef = useRef(null);
  const lastOutSourceRef = useRef("");
  const lastStampRef = useRef(0);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    if (!current) return;

    const now = () => Date.now();

    const shouldDedup = (src) => {
      const t = now();
      const isSameSource = lastOutSourceRef.current === src;
      const withinBurst = t - lastStampRef.current < 250;
      lastOutSourceRef.current = src;
      lastStampRef.current = t;
      return isSameSource || withinBurst;
    };

    const markOut = (source) => {
      if (outAtRef.current != null) return;
      if (shouldDedup(source)) return;

      outAtRef.current = now();

      try {
        logTabOut?.({ reason: source, url: location.href });
      } catch {}

      try {
        window.dispatchEvent(
          new CustomEvent("tuntasin:auto-ledger", { detail: { label: "TabOut" } })
        );
      } catch {}
    };

    const markIn = (source) => {
      if (outAtRef.current == null) return;
      const started = outAtRef.current;
      outAtRef.current = null;

      try {
        logTabIn?.({
          reason: source,
          url: location.href,
          dur_ms: Math.max(0, now() - started),
        });
      } catch {}
    };

    const onVisibility = () => {
      if (document.visibilityState === "hidden") {
        markOut("vis_hidden");
      } else {
        markIn("vis_visible");
      }
    };

    const onBlur = () => markOut("blur");
    const onFocus = () => markIn("focus");

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    window.addEventListener("focus", onFocus);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      window.removeEventListener("focus", onFocus);
      if (outAtRef.current != null) {
        try {
          logTabIn?.({
            reason: "cleanup",
            url: location.href,
            dur_ms: Math.max(0, now() - outAtRef.current),
          });
        } catch {}
        outAtRef.current = null;
      }
    };
  }, [current, logTabOut, logTabIn]);
}
