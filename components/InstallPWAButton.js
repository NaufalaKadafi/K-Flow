"use client";
import { useEffect, useState } from "react";

export default function InstallPWAButton({ variant = "solid" }) {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", handler);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || !deferredPrompt) return null;

  const base =
    "inline-flex items-center gap-2 px-4 py-2 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500";
  const className =
    variant === "outline"
      ? `${base} border border-emerald-600 text-emerald-700 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-400 dark:hover:bg-emerald-900/20`
      : `${base} bg-white text-emerald-700 border border-emerald-600 hover:bg-emerald-50 dark:bg-zinc-900 dark:text-emerald-400 dark:border-emerald-400`;

  return (
    <button
      aria-label="Install PWA"
      className={className}
      onClick={async () => {
        deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice && choice.outcome === "accepted") setDeferredPrompt(null);
      }}
    >
      <DownloadIcon className="h-4 w-4" />
      <span>Install PWA</span>
    </button>
  );
}

function DownloadIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden {...props}>
      <path d="M12 3v10m0 0l3.5-3.5M12 13L8.5 9.5M4 15v3a3 3 0 003 3h10a3 3 0 003-3v-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
