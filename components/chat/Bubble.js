"use client";

export default function Bubble({
  side = "right",
  title = "",
  items = [],
  size = "sm",
  icon = null,
  className = "",
  children,
}) {
  const isRight = side === "right";

  const SIZES = {
    sm: { max: "max-w-[260px]", pad: "px-3 py-2.5", text: "text-[13px]" },
    md: { max: "max-w-[340px]", pad: "px-4 py-3",    text: "text-[14px]" },
    lg: { max: "max-w-[420px]", pad: "px-5 py-4",    text: "text-[15px]" },
  };
  const S = SIZES[size] ?? SIZES.sm;

  return (
    <div
      className={[
        "relative overflow-visible rounded-2xl bg-white text-zinc-900",
        "ring-1 ring-zinc-200 shadow-[0_8px_24px_rgba(0,0,0,0.06)]",
        S.max, S.pad, className,
      ].join(" ")}
      role="status"
      aria-live="polite"
    >
      <span
        aria-hidden
        className={[
          "absolute z-0 top-1/2 -translate-y-1/2 h-3 w-3 rotate-45 bg-white ring-1 ring-zinc-200",
          isRight ? "-right-1" : "-left-1",
        ].join(" ")}
        style={{ boxShadow: "0 1px 1px rgba(0,0,0,.05)" }}
      />

      {icon ? (
        <span className="absolute right-2 top-2 z-10 inline-flex h-6 w-6 items-center justify-center rounded-full bg-zinc-50 ring-1 ring-zinc-200 text-zinc-600">
          {icon}
        </span>
      ) : null}

      <div className="relative z-10">
        {title ? (
          <div className="text-[12px] leading-none font-medium text-zinc-500 mb-2 tracking-tight">
            {title}
          </div>
        ) : null}

        {items?.length > 0 && (
          <ul className="space-y-1.5">
            {items.map((t, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="mt-[3px] inline-block h-[12px] w-[12px] rounded-[3px] border-2 border-emerald-500" />
                <span className={`${S.text} leading-relaxed font-medium text-zinc-800`}>
                  {t}
                </span>
              </li>
            ))}
          </ul>
        )}

        {children}
      </div>
    </div>
  );
}
