import { create } from "zustand";
import {
  putSession,
  putEvent,
  getEventsBySession,
} from "../lib/Storage/IndexedDB.js";
import { accumulateDaily } from "../lib/Analytics/Rollups";

export const useDistractionStore = create((set, get) => ({
  current: undefined, 
  events: [], 


  async startSession(goal, plannedMin) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const s = { id, start: now, end: now, goal: goal || "", plannedMin: plannedMin || 25 };
    set({ current: s, events: [] });
    await putSession(s);
  },


  async endSession() {
    const s = get().current;
    if (!s) return;
    const end = Date.now();
    const updated = { ...s, end };

    await putSession(updated);
    const events = await getEventsBySession(s.id);


    await accumulateDaily(updated, events);


    set({ current: undefined, events: [] });
  },


  async logManual(reason = "lain-lain", note = "") {
    const s = get().current;
    if (!s) return;
    const ev = {
      id: crypto.randomUUID(),
      session_id: s.id,
      t: Date.now(),
      type: "manual_log",
      meta: { reason, note },
    };
    await putEvent(ev);
    set({ events: [...get().events, ev] });
  },


  async logTabOut(meta = {}) {
    const s = get().current;
    if (!s) return;
    const ev = {
      id: crypto.randomUUID(),
      session_id: s.id,
      t: Date.now(),
      type: "tab_out",
      meta,
    };
    await putEvent(ev);
    set({ events: [...get().events, ev] });
  },


  async logTabIn(meta = {}) {
    const s = get().current;
    if (!s) return;
    const ev = {
      id: crypto.randomUUID(),
      session_id: s.id,
      t: Date.now(),
      type: "tab_in",
      meta,
    };
    await putEvent(ev);
    set({ events: [...get().events, ev] });
  },
}));
