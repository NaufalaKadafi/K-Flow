"use client";
import useParallax from "../lib/useParallax";

export default function SpotlightCard({ Icon, title, desc }) {
  const ref = useParallax(8);
  return (
    <div
      ref={ref}
      className="group relative rounded-2xl border border-zinc-200/70 dark:border-zinc-800/70 bg-white/70 dark:bg-zinc-950/60 p-5 md:p-6 overflow-hidden [transform-style:preserve-3d] [perspective:1000px] will-change-transform"
      style={{ transform: "rotateX(var(--rx)) rotateY(var(--ry))" }}
    >
      <div
        className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            "radial-gradient(240px circle at calc(50% + var(--mx)) calc(50% + var(--my)), rgba(16,185,129,.18), transparent 60%)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 rounded-2xl border border-transparent group-hover:[border-image:linear-gradient(90deg,transparent,rgba(16,185,129,.5),transparent)_1]" />
      <div className="h-12 w-12 rounded-xl grid place-items-center bg-emerald-600/10 text-emerald-700 dark:text-emerald-400 mb-4">
        <Icon className="h-6 w-6" aria-hidden />
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{desc}</p>
    </div>
  );
}
