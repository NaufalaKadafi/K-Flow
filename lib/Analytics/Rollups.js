import {
  getDailyRollup,
  listDailyRollups,
  putDailyRollup,
  ymdLocal,
  hourLocal,
} from "../Storage/IndexedDB.js";
import { bucketDomain } from "../DomainBucketers.js";

function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }
function sum(arr) { return arr.reduce((s, v) => s + v, 0); }

export function pairTab(events) {
  const outs = (events || []).filter(e => e.type === "tab_out").sort((a,b)=>a.t-b.t);
  const ins  = (events || []).filter(e => e.type === "tab_in").sort((a,b)=>a.t-b.t);
  const pairs = [];
  let i = 0;
  for (const o of outs) {
    let pair = null;
    while (i < ins.length) {
      const cand = ins[i++];
      if (cand.t >= o.t) { pair = [o, cand]; break; }
    }
    if (pair) pairs.push(pair);
  }
  return pairs;
}

export function computeEndSession(session, events) {
  const dur = Math.max(0, (session.end - session.start) / 60000);
  const pairs = pairTab(events);

  let tabMin = 0;
  for (const [o, i] of pairs) {
    const delta = Math.max(0, (i.t - o.t) / 60000);
    tabMin += clamp(delta, 0, dur);
  }

  const manualCount = (events || []).filter(e => e.type === "manual_log").length;
  const tabCount = pairs.length + manualCount;
  const focusMin = Math.max(0, dur - tabMin);

  return {
    duration_min: dur,
    tabout_min: tabMin,
    tabout_count: tabCount,
    focus_min: focusMin,
  };
}
export async function accumulateDaily(session, events) {
  const stats = computeEndSession(session, events);
  const date = ymdLocal(session.start);

  const existing =
    (await getDailyRollup(date)) || {
      date,
      focus_min: 0,
      tabout_min: 0,
      tabout_count: 0,
      focus_by_hour: new Array(24).fill(0),
      tab_by_hour: new Array(24).fill(0),
      top_reasons: {},
    };

  const h = hourLocal(session.start);
  existing.focus_by_hour[h] += stats.focus_min;
  existing.tab_by_hour[h]   += stats.tabout_min;

  existing.focus_min    += stats.focus_min;
  existing.tabout_min   += stats.tabout_min;
  existing.tabout_count += stats.tabout_count;

  for (const ev of events || []) {
    if (ev.type === "manual_log") {
      const r = (ev.meta?.reason || "lain-lain").toLowerCase();
      existing.top_reasons[r] = (existing.top_reasons[r] || 0) + 1;
    }
    if (ev.type === "tab_out") {
      const dom = bucketDomain(ev.meta?.url || ev.meta?.domain || "");
      if (dom) existing.top_reasons[dom] = (existing.top_reasons[dom] || 0) + 1;
    }
  }

  await putDailyRollup(existing);
  return stats;
}

export function summarizeWeek(weekRollups, prevRollups) {
  const focusNow = sum((weekRollups || []).map(d => d.focus_min || 0));
  const tabNow   = sum((weekRollups || []).map(d => d.tabout_min || 0));
  const durNow   = focusNow + tabNow;

  const focusPrev = sum((prevRollups || []).map(d => d.focus_min || 0));
  const tabPrev   = sum((prevRollups || []).map(d => d.tabout_min || 0));
  const durPrev   = focusPrev + tabPrev;

  const tabRateNow  = durNow  > 0 ? tabNow  / durNow  : 0;
  const tabRatePrev = durPrev > 0 ? tabPrev / durPrev : 0;

  const deltaFocusPct   = focusPrev   > 0 ? ((focusNow - focusPrev) / focusPrev) * 100 : 0;
  const deltaTabRatePct = tabRatePrev > 0 ? ((tabRateNow - tabRatePrev) / tabRatePrev) * 100 : 0;

  const focusHour = new Array(24).fill(0);
  const tabHour   = new Array(24).fill(0);
  for (const d of weekRollups || []) {
    for (let i = 0; i < 24; i++) {
      focusHour[i] += d?.focus_by_hour?.[i] || 0;
      tabHour[i]   += d?.tab_by_hour?.[i]   || 0;
    }
  }

  const score = focusHour.map((f, i) => f - (tabHour[i] || 0));


  const entriesDesc = score.map((s,i)=>({i,s})).sort((a,b)=>b.s-a.s);
  const jamEmas = [];
  for (const e of entriesDesc) {
    if (jamEmas.length >= 2) break;
    if (focusHour[e.i] >= 30 && tabHour[e.i] <= 5) jamEmas.push(e.i);
  }


  const entriesAsc = score.map((s,i)=>({i,s})).sort((a,b)=>a.s-b.s);
  const jamRawan = entriesAsc.slice(0, 2).map(e => e.i);


  const reasonMap = {};
  for (const d of weekRollups || []) {
    for (const [k, v] of Object.entries(d.top_reasons || {})) {
      reasonMap[k] = (reasonMap[k] || 0) + (v || 0);
    }
  }
  const totalReasons = sum(Object.values(reasonMap));
  const topDistractors = Object.entries(reasonMap)
    .map(([key, count]) => ({ key, count, pct: totalReasons ? (count/totalReasons)*100 : 0 }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  return {
    jamEmas,
    jamRawan,
    topDistractors,
    deltaFocusPct,
    deltaTabRatePct,
    focusHour,
    tabHour,
  };
}


export async function getWeekWindows() {
  const today = new Date();
  const start = new Date(today); start.setDate(start.getDate() - 6);
  const prevStart = new Date(today); prevStart.setDate(prevStart.getDate() - 13);
  const prevEnd = new Date(today); prevEnd.setDate(prevEnd.getDate() - 7);

  const week = await listDailyRollups( ymdLocal(start), ymdLocal(today) );
  const prev = await listDailyRollups( ymdLocal(prevStart), ymdLocal(prevEnd) );

  return { week, prev };
}


export async function queryLast7d() {
  const today = new Date();
  const end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const start = new Date(end); start.setDate(end.getDate() - 6);
  const prevEnd = new Date(end); prevEnd.setDate(prevEnd.getDate() - 7);
  const prevStart = new Date(prevEnd); prevStart.setDate(prevStart.getDate() - 6);
  const startYmd     = ymdLocal(start);
  const endYmd       = ymdLocal(end);
  const prevStartYmd = ymdLocal(prevStart);
  const prevEndYmd   = ymdLocal(prevEnd);
  let rows = []; let prevRows = [];
  try { rows = await listDailyRollups(startYmd, endYmd); } catch {}
  try { prevRows = await listDailyRollups(prevStartYmd, prevEndYmd); } catch {}
  const byYmd = new Map(rows.map(r => [r.date, r]));
  const days = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const y = ymdLocal(d);
    const r = byYmd.get(y) || {
      date: y,
      focus_min: 0,
      tabout_min: 0,
      tabout_count: 0,
      focus_by_hour: new Array(24).fill(0),
      tab_by_hour: new Array(24).fill(0),
      top_reasons: {},
    };
    days.push({
      date: y,
      focusMin: Math.round(r.focus_min || 0),
      taboutMin: Math.round(r.tabout_min || 0),
      tabCount: Math.round(r.tabout_count || 0),
      topReasons: r.top_reasons || {},
    });
  }


  const hourBins = Array.from({ length: 24 }, () => 0);
  const byLabel = {};
  let totalFocusMin = 0;
  let totalDistractions = 0;

  for (const r of rows) {
    totalFocusMin += Number(r?.focus_min ?? 0);
    totalDistractions += Number(r?.tabout_count ?? 0);
    const fb = r?.tab_by_hour || r?.focus_by_hour || [];
    for (let i = 0; i < 24; i++) {
      const v = Number(fb[i] ?? 0);
      hourBins[i] += Number.isFinite(v) ? v : 0;
    }
    for (const [label, count] of Object.entries(r?.top_reasons || {})) {
      byLabel[label] = (byLabel[label] || 0) + (count || 0);
    }
  }

  const topDistractors = Object.entries(byLabel)
    .sort((a, b) => (b[1] || 0) - (a[1] || 0))
    .slice(0, 3)
    .map(([label, count]) => ({ label, count }));


  let prevFocus = 0, prevDistr = 0;
  for (const r of prevRows) {
    prevFocus += Number(r?.focus_min ?? 0);
    prevDistr += Number(r?.tabout_count ?? 0);
  }
  const pct = (cur, prev) => prev > 0 ? Math.round(((cur - prev) / prev) * 100) : null;

  return {
    range: { startYmd, endYmd },
    totalFocusMin: Math.max(0, Math.round(totalFocusMin)),
    totalDistractions: Math.max(0, Math.round(totalDistractions)),
    hourBins,
    topDistractors,
    trendFocusPct: pct(totalFocusMin, prevFocus),
    trendDistractPct: pct(totalDistractions, prevDistr),
    days, 
  };
}
