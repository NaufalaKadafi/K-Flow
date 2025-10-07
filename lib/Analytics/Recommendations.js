export function makeRecommendations(ins) {
  const recs = [];

  if (ins.jamEmas && ins.jamEmas.length > 0) {
    const times = ins.jamEmas.map(fmtHour).join(" & ");
    recs.push(`Jadwalkan 2×50m di jam emas: ${times}.`);
  }

  if (ins.jamRawan && ins.jamRawan.length > 0) {
    const t = ins.jamRawan.map(fmtHour).join(" & ");
    recs.push(`Aktifkan mode hening 60m pada jam rawan: ${t}.`);
  }
  if (ins.topDistractors && ins.topDistractors[0]) {
    const top = ins.topDistractors[0];

    const label = `${top.key}${isFinite(top.pct) ? ` (${top.pct.toFixed(0)}%)` : ""}`;
    recs.push(`Batasi sumber utama: ${label} selama fokus.`);
  }

  if (recs.length === 0) {
    recs.push("Tambah 1 sesi 50m pada slot pagi (sebelum 10:00).");
  }

  return recs.slice(0, 3);
}

export function fmtHour(h) {
  const hh = String(h).padStart(2, "0");
  return `${hh}:00`;
}
