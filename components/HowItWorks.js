"use client";
import { Play, MousePointer, Star } from "lucide-react";
import Reveal from "../lib/Reveal";
import SpotlightCard from "./SpotlightCard";

export default function HowItWorks() {
  const items = [
    { title: "Tambahkan Tugas, Mulai Timer.", desc: "Tuliskan niat sesi", Icon: Play },
    { title: "Catat distraksi / auto tab-out.", desc: "1 klik, lanjut fokus.", Icon: MousePointer },
    { title: "Dapatkan Saran.", desc: "Terapkan sesi selanjutnya", Icon: Star },
  ];
  return (
    <section id="how" className="relative py-12 md:py-20">
      <div className="absolute inset-0 -z-10 opacity-[0.07] bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,.6)_1px,transparent_1px)] bg-[size:18px_18px]" />
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal><h2 className="text-2xl md:text-3xl font-semibold tracking-tight">Cara kerja</h2></Reveal>
        <div className="mt-6 grid gap-6 md:grid-cols-3">
          {items.map(({ title, desc, Icon }, i) => (
            <Reveal key={title} delay={i * 80}>
              <SpotlightCard Icon={Icon} title={title} desc={desc} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
