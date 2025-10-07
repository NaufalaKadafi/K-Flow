"use client";

import React from "react";
import { BarChart3 } from "lucide-react";

import TimerProvider from "./Center/TimerProvider";
import PresetPicker from "./PresetPicker";
import IntentionInput from "./NiatSesi";
import DistractionLedger from "./CatatDistraksi";
import WhiteNoise from "./WhiteNoise";
import FocusModeToggle from "./FocusModeToggle";
import FocusTimer from "./FocusTimer";
import AfterSessionSummary from "./AfterSessionSummary";
import TasksPanel from "./Tasks/TasksPanel";
import FocusCard from "./FocusCard";
import FlowGuardPanel from "../components/settings/FlowGuardPanel";


import { queryLast7d } from "../lib/Analytics/Rollups.js";

import InsightsModal from "../lib/insight/insightModal.js";

export default function AppDemo() {
  const [insOpen, setInsOpen] = React.useState(false);
  const [insData, setInsData] = React.useState(null);
  const [loadingIns, setLoadingIns] = React.useState(false);

  const openInsights = React.useCallback(async () => {
    setLoadingIns(true);
    try {
      const data = await queryLast7d();
      setInsData(data);
    } catch {
      setInsData(null);
    } finally {
      setLoadingIns(false);
      setInsOpen(true);
    }
  }, []);

  React.useEffect(() => {
    const fn = () => openInsights();
    window.addEventListener("tuntasin:open-insights", fn);
    return () => window.removeEventListener("tuntasin:open-insights", fn);
  }, [openInsights]);

  return (
    <section id="timer-app" className="py-0">
      <div className="mx-auto max-w-6xl px-4 md:px-6 -mt-4 md:-mt-6">
        <TimerProvider>

          <div className="mb-3 flex items-center justify-end">
            <button
              onClick={openInsights}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70 hover:bg-white dark:hover:bg-zinc-900 text-sm shadow-sm transition-all hover:shadow-[0_12px_40px_rgba(16,185,129,.15)]"
              title="Lihat ringkasan 7 hari"
            >
              <BarChart3 className="h-4 w-4" />
              Insight
            </button>
          </div>

  
          <div className="grid gap-6 lg:[grid-template-columns:1fr_1.25fr]">
         
            <div className="space-y-5">
              <div className="flex justify-center">
                <PresetPicker />
              </div>

              <FocusTimer />

     
              

              <div className="flex items-center justify-center gap-2">
                <WhiteNoise />
                <FocusModeToggle />
              </div>

       
              <div className="lg:hidden">
                <DistractionLedger />
              </div>
            </div>

     
            <aside className="lg:col-start-2">
              <div className="sticky top-20 space-y-5">
                <div className="rounded-2xl p-4 md:p-5 bg-gradient-to-br from-emerald-500/10 via-transparent to-sky-500/10 ring-1 ring-emerald-500/20 dark:ring-emerald-400/20 shadow-[0_10px_40px_-15px_rgba(16,185,129,.35)]">
           
                  <div className="mb-3 space-y-4">
                    <IntentionInput />
                    <TasksPanel />
                    </div>
                </div>

          
                <div className="hidden lg:block">
                  <DistractionLedger />
                </div>
              </div>
            </aside>
          </div>

          <AfterSessionSummary />
          <FocusCard />
        </TimerProvider>
      </div>

      <InsightsModal
        open={insOpen}
        loading={loadingIns}
        data={insData}
        onClose={() => setInsOpen(false)}
      />
    </section>
  );
}
