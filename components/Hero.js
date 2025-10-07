"use client";
import { MousePointer, BookOpen } from "lucide-react";
import Link from "next/link";
import Reveal from "../lib/Reveal";
import InstallPWAButton from "./InstallPWAButton";
import HeroDemoImage from "./HeroDemoImage";

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-10 sm:pt-16 pb-12 sm:pb-20">
      <div className="grid gap-8 sm:gap-10 md:grid-cols-2 md:items-center">
        <div className="text-center md:text-left">
          <Reveal delay={0}>
            <h1 className="text-2xl/tight sm:text-3xl/tight md:text-5xl/tight font-semibold tracking-tight">
              Kurangi distraksi. <br className="hidden sm:block" />
              Naikkan jam fokus dengan bukti.
            </h1>
          </Reveal>

          <Reveal delay={80}>
            <p className="mt-3 sm:mt-4 text-zinc-600 dark:text-zinc-400 text-base sm:text-lg max-w-lg mx-auto md:mx-0">
              A micro intervention system to improve your study focus and
              concentration.
            </p>
          </Reveal>

          <Reveal delay={120}>
            <div className="mt-4 sm:mt-5 flex flex-wrap justify-center md:justify-start gap-2 tabular-nums">
              {["+32% jam fokus", "−27% distraksi", "97% sesi tuntas"].map(
                (t) => (
                  <span
                    key={t}
                    className="inline-flex items-center rounded-full border border-emerald-600/25 text-emerald-700 dark:text-emerald-400/90 bg-emerald-50/60 dark:bg-emerald-900/10 px-3 py-1 text-sm"
                  >
                    {t}
                  </span>
                )
              )}
            </div>
          </Reveal>

          <Reveal delay={160}>
            <div className="mt-6 flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-start gap-3">
              <Link
                href="/timer"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 w-full sm:w-auto justify-center"
                aria-label="Mulai 5 menit fokus — buka timer"
              >
                <MousePointer className="h-4 w-4" />
                <span>Start Focus</span>
              </Link>

              <a
                href="#how"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl ring-1 ring-zinc-300 text-zinc-800 hover:bg-zinc-50 dark:ring-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 w-full sm:w-auto justify-center"
                aria-label="Pelajari Pomodoro & cara mengatasi distraksi"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("how")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                title="Pelajari Pomodoro & Distraksi"
              >
                <BookOpen className="h-4 w-4" />
                <span>Learn More</span>
              </a>

              <InstallPWAButton className="w-full sm:w-auto justify-center" />
            </div>
          </Reveal>
        </div>

        <Reveal delay={140}>
          <div className="relative w-full [aspect-ratio:16/10] max-w-md md:max-w-full mx-auto md:mx-0 overflow-visible isolate">
            <HeroDemoImage />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
