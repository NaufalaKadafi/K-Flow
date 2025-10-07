export function fmtMin(m) {
  const n = Math.max(0, Number(m) || 0);
  const h = Math.floor(n / 60);
  const r = n % 60;
  return h > 0 ? `${h}j ${r}m` : `${r}m`;
}

export function dayLabel(ymd) {
  const [y, m, d] = (ymd || "").split("-").map(Number);
  if (!y || !m || !d) return "—";
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, { weekday: "short", day: "2-digit" });
}

export function dayLabelFull(ymd) {
  const [y, m, d] = (ymd || "").split("-").map(Number);
  if (!y || !m || !d) return "—";
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString(undefined, {
    weekday: "long",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function ratioPct(part, total) {
  const a = Math.max(0, Number(part) || 0);
  const b = Math.max(0, Number(total) || 0);
  return b > 0 ? Math.round((a / b) * 100) : 0;
}
