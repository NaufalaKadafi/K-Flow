"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Play, Menu, X, Settings } from "lucide-react";
import dynamic from "next/dynamic";
import Logo from "./Logo";
import InstallPWAButton from "./InstallPWAButton";

const SettingsModal = dynamic(() => import("./settings/SettingsModal"), { ssr: false });

export default function Header() {
  const [showShadow, setShowShadow] = useState(false);
  const [open, setOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  const onTimer = pathname === "/timer";
  const onLearn = pathname === "/learn";
  const onHome = pathname === "/";

  useEffect(() => {
    const onScroll = () => setShowShadow(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const NavItem = ({ hash, children }) => {
    if (!onHome) {
      return (
        <Link href={`/${hash}`} className="hover:underline underline-offset-4 block">
          {children}
        </Link>
      );
    }
    return (
      <a
        href={hash}
        className="hover:underline underline-offset-4 block"
        onClick={(e) => {
          e.preventDefault();
          document.querySelector(hash)?.scrollIntoView({ behavior: "smooth" });
          setOpen(false);
        }}
      >
        {children}
      </a>
    );
  };

  const handleCTA = (e) => {
    e.preventDefault();
    if (onTimer) {
      const el = document.getElementById("timer-app") || document.getElementById("app-demo");
      el?.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push("/timer");
    }
  };

  const onExport = async () => {
    const m = await import("../lib/Storage/backup");
    return m.downloadBackup();
  };
  const onImport = async (file) => {
    const m = await import("../lib/Storage/backup");
    return m.restoreFromFile(file);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-zinc-950/70 ${
          showShadow ? "shadow-sm border-b border-zinc-200/70 dark:border-zinc-800" : ""
        }`}
      >
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 h-16 flex items-center justify-between overflow-visible">
          <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-500/30 to-transparent" />

          <Link
            href="/"
            aria-label="K-Flow — kembali ke beranda"
            className="flex items-center gap-2 overflow-visible"
          >
            <Logo className="h-10 w-auto max-h-full" />
            <span className="font-semibold tracking-tight hidden sm:inline">K-Flow</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <NavItem hash="#how">How it works</NavItem>
            <NavItem hash="#features">Features</NavItem>
            <NavItem hash="#pricing">Pricing</NavItem>

            <Link
              href="/learn"
              className={`hover:underline underline-offset-4 ${
                onLearn ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""
              }`}
            >
              Learn More
            </Link>

            <Link
              href="/timer"
              className={`hover:underline underline-offset-4 ${
                onTimer ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""
              }`}
            >
              Timer
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <InstallPWAButton variant="outline" />

            <a
              href={onTimer ? "#timer-app" : "/timer"}
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
              aria-label={onTimer ? "Mulai fokus sekarang" : "Coba di browser"}
              onClick={handleCTA}
            >
              <Play className="h-4 w-4" />
              <span>Try for Free</span>
            </a>

            <button
              onClick={() => setShowSettings(true)}
              aria-label="Settings"
              className="hidden md:inline-flex p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>

            <button
              className="md:hidden p-2 text-emerald-600"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {open && (
          <div className="md:hidden bg-white dark:bg-zinc-950 border-t shadow-sm">
            <nav className="flex flex-col p-4 space-y-3 text-sm">
              <NavItem hash="#how">How it works</NavItem>
              <NavItem hash="#features">Features</NavItem>
              <NavItem hash="#pricing">Pricing</NavItem>

              <Link
                href="/learn"
                className={`hover:underline underline-offset-4 ${
                  onLearn ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                Learn More
              </Link>

              <Link
                href="/timer"
                className={`hover:underline underline-offset-4 ${
                  onTimer ? "font-semibold text-emerald-600 dark:text-emerald-400" : ""
                }`}
                onClick={() => setOpen(false)}
              >
                Timer
              </Link>

              <button
                onClick={() => {
                  setShowSettings(true);
                  setOpen(false);
                }}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-900"
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>

              <a
                href={onTimer ? "#timer-app" : "/timer"}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700"
                onClick={(e) => {
                  handleCTA(e);
                  setOpen(false);
                }}
              >
                <Play className="h-4 w-4" />
                <span>Try for Free</span>
              </a>
            </nav>
          </div>
        )}
      </header>

      {showSettings && (
        <SettingsModal
          key="settings"
          open={showSettings}
          onClose={() => setShowSettings(false)}
          onExport={onExport}
          onImport={onImport}
        />
      )}
    </>
  );
}
