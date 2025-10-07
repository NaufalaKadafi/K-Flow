"use client";
import { Star, ClipboardList, Users, BadgeCheck, Trophy, Rocket } from "lucide-react";

const BASE_ITEMS = [
  { Icon: Star,          value: "400K+", label: "5-star reviews" },
  { Icon: ClipboardList, value: "600K+", label: "tasks daily" },
  { Icon: Users,         value: "15M+",  label: "downloads" },
  { Icon: BadgeCheck,    value: "500K+", label: "pro users" },
  { Icon: Trophy,        value: "Top 10", label: "productivity apps" },
  { Icon: Rocket,        value: "99.9%", label: "uptime SLA" },
];

function Strip({ items, duration, gap, endGap }) {

  return (
    <div
      className="marquee inline-flex will-change-transform"
      style={{
        animation: `marquee ${duration}s linear infinite`, 
      }}
      aria-hidden
    >
      {[0, 1].map((dup) => (
        <ul
          key={dup}
          className="flex shrink-0 items-center"
          style={{ columnGap: `${gap}px` }}
        >
          {items.map(({ Icon, value, label }, i) => (
            <li key={`${dup}-${i}`} className="flex items-center gap-4">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-emerald-50 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:ring-emerald-900/40">
                <Icon className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              </span>
              <div className="leading-tight">
                <div className="text-lg md:text-xl font-semibold tabular-nums">{value}</div>
                <div className="text-[13px] text-zinc-600 dark:text-zinc-400">{label}</div>
              </div>
            </li>
          ))}
          <li aria-hidden className="shrink-0" style={{ width: `${endGap}px`, height: 1 }} />
        </ul>
      ))}
    </div>
  );
}

export default function ProofTicker({
  items = BASE_ITEMS,
  speed = 28, 
  gap = 48,  
  endGap = 24,
  className = "",
}) {
  return (
    <section className={`relative z-20 ${className}`}>
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div
          className="relative overflow-hidden rounded-3xl bg-white/90 dark:bg-zinc-900/90
                     ring-1 ring-zinc-200/70 dark:ring-zinc-800 shadow-[0_16px_40px_rgba(0,0,0,.10)]
                     backdrop-blur px-6 md:px-8 py-5 md:py-6 pause-on-hover"
          style={{
            maskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent, black 6%, black 94%, transparent)",
          }}
        >
          <Strip items={items} duration={speed} gap={gap} endGap={endGap} />
        </div>
      </div>
    </section>
  );
}
