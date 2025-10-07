"use client";
import { BarChart3 } from "lucide-react";

export default function InsightsButton() {
  return (
    <button
      onClick={() => window.dispatchEvent(new Event("tuntasin:open-insights"))}
      className="fixed z-[55] bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2 rounded-2xl
                 bg-emerald-600 text-white shadow-lg hover:bg-emerald-700"
      title="Buka Distraction Intelligence"
      aria-label="Buka Distraction Intelligence"
    >
      <BarChart3 className="h-4 w-4" />
      DI
    </button>
  );
}
