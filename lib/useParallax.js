"use client";
import { useEffect, useRef } from "react";

export default function useParallax(mult = 20) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handler = (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      el.style.setProperty("--rx", `${-(y * mult)}deg`);
      el.style.setProperty("--ry", `${x * mult}deg`);
      el.style.setProperty("--mx", `${x * 100}%`);
      el.style.setProperty("--my", `${y * 100}%`);
    };
    const leave = () => {
      el.style.setProperty("--rx", "0deg");
      el.style.setProperty("--ry", "0deg");
    };

    el.addEventListener("mousemove", handler);
    el.addEventListener("mouseleave", leave);
    return () => {
      el.removeEventListener("mousemove", handler);
      el.removeEventListener("mouseleave", leave);
    };
  }, [mult]);

  return ref;
}
