
"use client";

import { createStore } from "zustand/vanilla";



function makeId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) return crypto.randomUUID();
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const WORK_TAB_NAME = "kflow-work";

export const linkKerjaStore = createStore()((set, get) => ({

  links: /** @type {Array<{id:string,title:string,url:string}>} */ ([]),

  addLink: (title, url) =>
    set((state) => ({
      links: [
        ...state.links,
        { id: makeId(), title: (title || url).trim(), url: String(url || "").trim() },
      ],
    })),

  removeLink: (id) => set((state) => ({ links: state.links.filter((l) => l.id !== id) })),


  openInWorkTab: (id) => {
    const link = get().links.find((l) => l.id === id);
    if (!link) return;


    try {
      window.dispatchEvent(
        new CustomEvent("kflow:work-link-open", {
          detail: { id: link.id, url: link.url, at: Date.now(), source: "panel" },
        })
      );
    } catch {}

    try {
      window.open(link.url, WORK_TAB_NAME);
    } catch {}
  },
}));
