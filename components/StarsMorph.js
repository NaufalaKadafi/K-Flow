"use client";

import React from "react";
import { Star } from "lucide-react";

function useInView(threshold = 0.2) {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return [ref, inView];
}

function seededRandom(seed = 42) {
  let x = seed >>> 0 || 123456789;
  return () => {
    // xorshift32
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 4294967296; // [0,1)
  };
}

export default function StarsMorph() {
  const [ref, inView] = useInView(0.2);
  const rand = React.useMemo(() => seededRandom(42), []);

  const init = React.useMemo(
    () =>
      Array.from({ length: 5 }, () => ({
        x: rand() * 100,
        y: rand() * 40 + 10,
        s: rand() * 0.6 + 0.8,
        r: rand() * 30 - 15,
      })),
    [rand]
  );

  const final = [
    { x: 38, y: 0, s: 1.0, r: 0 },
    { x: 44, y: 0, s: 1.0, r: 0 },
    { x: 50, y: -2, s: 1.2, r: 0 },
    { x: 56, y: 0, s: 1.0, r: 0 },
    { x: 62, y: 0, s: 1.0, r: 0 },
  ];

  return (
    <div ref={ref} className="relative h-20 md:h-24 my-10">
      {init.map((p, i) => {
        const f = final[i];
        const x = inView ? f.x : p.x;
        const y = inView ? f.y : p.y;
        const s = inView ? f.s : p.s;
        const r = inView ? f.r : p.r;

        return (
          <Star
            key={i}
            className="absolute text-amber-400 drop-shadow-[0_6px_18px_rgba(251,191,36,.35)]"
            style={{
              left: `${x}%`,
              top: `calc(50% + ${y}px)`,
              transform: `translate(-50%,-50%) rotate(${r}deg) scale(${s})`,
              transition: "all 900ms cubic-bezier(.2,.8,.2,1)",
            }}
            aria-hidden
            size={28}
            strokeWidth={1.5}
            fill="currentColor"
          />
        );
      })}
    </div>
  );
}
