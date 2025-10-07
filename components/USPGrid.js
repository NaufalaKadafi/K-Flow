"use client";
import { Brain, Bot, Shield, Gauge, BarChart2, Users } from "lucide-react";
import Reveal from "../lib/Reveal";
import SpotlightCard from "./SpotlightCard";

function WaveTop({ className = "" }) {
  return (
    <div className="relative -mt-6" aria-hidden>
      <svg className={`block w-full h-14 ${className}`} viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,0 L0,0 Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export default function USPGrid() {
  const items = [
    { title: "Distraction Analytics", desc: "Peta jam rawan & sumber gangguan → rencana mingguan.", Icon: Brain },
    { title: "Coach yang Bertindak", desc: "Coach berbasis AI siap untuk mengurangi distraksimu", Icon: Bot },
    { title: "Flow Guard", desc: "Anti-nyasar tab: Flow Guard menahan kebocoran fokus dan menjaga tempo belajar", Icon: Shield },
    { title: "Sesi Adaptif", desc: "Durasi menyesuaikan histori: turunkan saat banyak distraksi, panjangkan saat flow stabil.", Icon: Gauge },
    { title: "Offline-first", desc: "Jalankan K-Flow tanpa internet kapanpun dan dimanapun!", Icon: BarChart2 },
    { title: "Flow Together", desc: "Skuad ≤5, pre-commit 1 kalimat, tanpa chat saat fokus; akuntabilitas ringan.", Icon: Users },
  ];
  return (
    <section id="features" className="relative pt-0 pb-12 md:pb-20">
      <WaveTop className="text-emerald-600/10 dark:text-emerald-400/10" />
      <div className="relative py-12 md:py-20">
        <div className="absolute inset-0 -z-10 opacity-[0.06] bg-[repeating-linear-gradient(45deg,rgba(0,0,0,.5)_0_1px,transparent_1px_12px)]" />
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <Reveal>
            <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Keunggulan</h2>
          </Reveal>
          <div className="mt-6 grid gap-6 md:grid-cols-3">
            {items.map((it, i) => (
              <Reveal key={it.title} delay={i * 70}>
                <SpotlightCard {...it} />
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}



