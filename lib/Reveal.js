"use client";
import React from "react";

export default function Reveal({ children, className = "", delay = 0, threshold = 0.2, once = false }) {
  const ref = React.useRef(null);
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) { setShow(true); return; }

    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setShow(true);
        if (once) obs.unobserve(el);
      } else if (!once) {
        setShow(false);
      }
    }, { threshold });

    obs.observe(el);
    return () => obs.disconnect();
  }, [once, threshold]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`will-change-transform transition-all duration-700 ease-[cubic-bezier(.2,.8,.2,1)] ${
        show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}
