"use client";
import Header from "../components/Header";
import Hero from "../components/Hero";
import ProofTicker from "../components/ProofTicker";
import HowItWorks from "../components/HowItWorks";
import USPGrid from "../components/USPGrid";
import ProofPanel from "../components/ProofPanel";
import Footer from "../components/Footer";
import AppDemo from "@/Timer/AppDemo";

export default function HomeClient() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 antialiased selection:bg-emerald-200/60 dark:selection:bg-emerald-500/30">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 bg-emerald-600 text-white px-3 py-2 rounded">
        Lewati ke konten utama
      </a>
      <main id="main">
        <Hero />
        <ProofTicker />
        <HowItWorks />
        <USPGrid />
        <ProofPanel />
      </main>
      <Footer />
    </div>
  );
}
