"use client";

export const PRESETS = [
  { id: "20_10", label: "20–10", focusMin: 20, breakMin: 10 },
  { id: "25_5",  label: "25–5",  focusMin: 25, breakMin: 5  },
  { id: "50_10", label: "50–10", focusMin: 50, breakMin: 10 },
];

export function mmss(totalSeconds) {
  const s = Math.max(0, Math.floor(totalSeconds));
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m.toString().padStart(2,"0")}:${r.toString().padStart(2,"0")}`;
}

export function sec(nMin) {
  return Math.round(nMin * 60);
}
