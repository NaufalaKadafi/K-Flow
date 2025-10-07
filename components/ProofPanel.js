"use client";

import React from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import Reveal from "../lib/Reveal";
import dynamic from "next/dynamic";
const StarsMorph = dynamic(() => import("./StarsMorph"), { ssr: false });


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


function Sparkline({ values = [2,4,6,8,7,9,10,9,11,12,13,12], width = 160, height = 48 }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const stepX = width / (values.length - 1 || 1);
  const pts = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - min) / (max - min || 1)) * height;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="text-emerald-600 dark:text-emerald-400">
      <defs>
        <linearGradient id="gradLine" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <polyline fill="none" stroke="url(#gradLine)" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" points={pts} />
    </svg>
  );
}


function Metric({ kpi, desc, trend = "↑", tone = "pos" }) {
  const toneClass =
    tone === "pos"
      ? "text-emerald-700 bg-emerald-50 ring-emerald-100 dark:text-emerald-400/90 dark:bg-emerald-900/20 dark:ring-emerald-900/40"
      : "text-rose-700 bg-rose-50 ring-rose-100 dark:text-rose-400/90 dark:bg-rose-900/20 dark:ring-rose-900/40";
  return (
    <div className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 ring-1 ${toneClass}`}>
      <span className="text-base font-semibold tabular-nums">{trend} {kpi}</span>
      <span className="text-sm text-zinc-600/80 dark:text-zinc-400/90">{desc}</span>
    </div>
  );
}


function Avatar({ src, name }) {
  const [ok, setOk] = React.useState(true);
  const initials = (name || "?").split(" ").map(s => s[0]).slice(0,2).join("").toUpperCase();
  return ok && src ? (
    <img
      src={src}
      alt={name}
      onError={() => setOk(false)}
      className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80 dark:ring-zinc-900"
    />
  ) : (
    <div className="h-12 w-12 rounded-full grid place-items-center bg-gradient-to-br from-emerald-500 to-teal-500 text-white font-semibold ring-2 ring-white/80 dark:ring-zinc-900">
      {initials}
    </div>
  );
}

function TestimonialCard({ t, emphasis = "center" }) {
  const scale = emphasis === "center" ? "scale-100" : "scale-[.92]";
  const ring = emphasis === "center"
    ? "ring-emerald-300/50"
    : "ring-zinc-200/60 dark:ring-zinc-800/60";

  return (
    <figure
      className={[
        "max-w-[420px] w-[86vw] md:w-[420px]",
        "rounded-2xl bg-white text-black",   
        "shadow-[0_20px_60px_rgba(0,0,0,.12)] p-6 ring-1",
        ring, scale,
        "transition-transform duration-500",
      ].join(" ")}
    >
      <Quote className="h-6 w-6 text-emerald-500" />
      <blockquote className="mt-3 text-lg leading-relaxed">
        “{t.quote}”
      </blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <Avatar src={t.avatar} name={t.name} />
        <div>
          <div className="font-semibold">{t.name}</div>
          <div className="text-sm text-zinc-600">{t.role}</div>
        </div>
      </figcaption>
    </figure>
  );
}


const TESTIMONIALS = [
  { name: "Syifa Putri",  role: "UI Designer",  quote: "Lebih gampang mulai; 25 menit pertama jadi kebiasaan.", avatar: "/avatars/syifa.jpg" },
  { name: "Nicholas Tan", role: "Data Analyst", quote: "Tab-out auto log bikin sadar kapan terdistraksi—fokus time naik tanpa terasa.", avatar: "/avatars/nicholas.jpg" },
  { name: "Raka Dwi",     role: "CS Student",   quote: "Ledger 1-ketuk itu genius. Catat distraksi tanpa memecah flow.", avatar: "/avatars/raka.jpg" },
  { name: "Sinta Ayu",    role: "Accountant",   quote: "Review mingguan kasih resep jelas, bukan sekadar grafik. Impact-nya kebukti.", avatar: "/avatars/sinta.jpg" },
  { name: "Bayu H.",      role: "Law Student",  quote: "Sesi adaptif ngikutin ritme. Pas flow, durasi otomatis lebih panjang.", avatar: "/avatars/bayu.jpg" },
];

function Carousel() {
  const [idx, setIdx] = React.useState(0);
  const len = TESTIMONIALS.length;
  const left   = (idx - 1 + len) % len;
  const center = idx;
  const right  = (idx + 1) % len;


  const wrapRef = React.useRef(null);
  const pausedRef = React.useRef(false);

  React.useEffect(() => {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) return;
    const tick = () => setIdx(p => (p + 1) % len);
    let id = setInterval(tick, 4500);
    const el = wrapRef.current;
    const onEnter = () => { pausedRef.current = true; clearInterval(id); };
    const onLeave = () => { pausedRef.current = false; id = setInterval(tick, 4500); };
    el?.addEventListener("mouseenter", onEnter);
    el?.addEventListener("focusin", onEnter);
    el?.addEventListener("mouseleave", onLeave);
    el?.addEventListener("focusout", onLeave);
    return () => {
      clearInterval(id);
      el?.removeEventListener("mouseenter", onEnter);
      el?.removeEventListener("focusin", onEnter);
      el?.removeEventListener("mouseleave", onLeave);
      el?.removeEventListener("focusout", onLeave);
    };
  }, [len]);

  const go = (d) => setIdx((p) => (p + d + len) % len);

  const onKey = React.useCallback((e) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  }, []);

  React.useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    el.addEventListener("keydown", onKey);
    return () => el.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <div
      ref={wrapRef}
      tabIndex={0}
      className="relative mx-auto max-w-6xl focus:outline-none"
      aria-roledescription="carousel"
      aria-label="Testimoni pengguna"
    >

      <div className="relative h-[420px] md:h-[440px]">

        <div
          className="absolute left-1/2 top-1/2 z-30 transition-transform duration-500"
          style={{ transform: "translateX(-50%) translateY(-50%) scale(1)" }}
          aria-current="true"
        >
          <TestimonialCard t={TESTIMONIALS[center]} emphasis="center" />
        </div>
        <div
          className="absolute left-1/2 top-1/2 z-20 transition-transform duration-500 [--off:120px] md:[--off:240px]"
          style={{ transform: "translateX(calc(-50% - var(--off))) translateY(-50%) scale(.92)" }}
        >
          <TestimonialCard t={TESTIMONIALS[left]} emphasis="side" />
        </div>
        {/* right */}
        <div
          className="absolute left-1/2 top-1/2 z-20 transition-transform duration-500 [--off:120px] md:[--off:240px]"
          style={{ transform: "translateX(calc(-50% + var(--off))) translateY(-50%) scale(.92)" }}
        >
          <TestimonialCard t={TESTIMONIALS[right]} emphasis="side" />
        </div>
      </div>


      <div className="absolute inset-y-0 left-0 right-0 -translate-y-1/2 top-1/2 flex items-center justify-between px-2">
        <button
          onClick={() => go(-1)}
          className="h-10 w-10 grid place-items-center rounded-full bg-white/90 ring-1 ring-zinc-200 hover:scale-105 hover:ring-emerald-300/60 transition"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="h-5 w-5 text-zinc-700" />
        </button>
        <button
          onClick={() => go(1)}
          className="h-10 w-10 grid place-items-center rounded-full bg-white/90 ring-1 ring-zinc-200 hover:scale-105 hover:ring-emerald-300/60 transition"
          aria-label="Berikutnya"
        >
          <ChevronRight className="h-5 w-5 text-zinc-700" />
        </button>
      </div>


      <div className="mt-6 flex justify-center gap-2">
        {TESTIMONIALS.map((_, i) => (
          <button
            key={i}
            aria-label={`Slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={[
              "h-1.5 rounded-full transition-all",
              i === idx ? "w-6 bg-emerald-500" : "w-2 bg-zinc-300 dark:bg-zinc-700",
            ].join(" ")}
          />
        ))}
      </div>
    </div>
  );
}


export default function ProofPanel() {
  return (
    <section className="relative py-16 md:py-24">

      <div
        aria-hidden
        className="absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(800px 400px at 20% -10%, rgba(16,185,129,.10), transparent 60%), radial-gradient(700px 360px at 80% 110%, rgba(59,130,246,.10), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 -z-10 opacity-[.05] bg-[repeating-linear-gradient(45deg,rgba(0,0,0,.6)_0_1px,transparent_1px_14px)]" />

      <div className="mx-auto max-w-6xl px-4 md:px-6">

        <Reveal>
          <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 p-6 md:p-8 bg-white/80 dark:bg-zinc-950/70 backdrop-blur">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
                  Dampak yang bisa dibuktikan
                </h2>
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                  Bukan sekadar janji—hasilnya terlihat dalam 7 hari.
                </p>
              </div>
              <Sparkline />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Metric kpi="+32%" desc="jam fokus" trend="↑" tone="pos" />
              <Metric kpi="−27%" desc="distraksi" trend="↓" tone="neg" />
              <Metric kpi="97%" desc="sesi tuntas" trend="↑" tone="pos" />
            </div>
          </div>
        </Reveal>


        <div className="mt-10">
          <Reveal>
            <Carousel />
          </Reveal>
        </div>


        <StarsMorph />
      </div>
    </section>
  );
}
