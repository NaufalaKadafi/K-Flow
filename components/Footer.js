"use client";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 dark:border-zinc-800">
      <div className="mx-auto max-w-6xl px-4 md:px-6 py-8 grid gap-6 text-sm
                      grid-cols-1 sm:grid-cols-2 md:grid-cols-3 items-center">
        
        <div className="flex items-center justify-center sm:justify-start">
          <span className="font-medium">K-Flow</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <a href="#privacy" className="hover:underline underline-offset-4">
            Privacy
          </a>
          <a href="#" className="hover:underline underline-offset-4">
            About
          </a>
          <a href="#" className="hover:underline underline-offset-4">
            GitHub
          </a>
        </nav>

        <p className="text-zinc-600 dark:text-zinc-400 text-center md:text-right">
          © {new Date().getFullYear()} Tuntasin
        </p>
      </div>
    </footer>
  );
}
