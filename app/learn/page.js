import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Timer as TimerIcon,
  Zap,
  Target,
  Shield,
  Clock,
  Gauge,
  CircleHelp,
  BarChart3,
  CheckCircle2,
  BellRing,
} from "lucide-react";
import ClientCTA from "../learn/ClientCTA";

export const metadata = {
  title: "Learn More — K-Flow",
  description:
    "Pelajari Pomodoro secara menyeluruh: cara kerja, preskripsi sesi (20–10, 25–5, 50–10), taktik anti-distraksi, dan bagaimana Flow Guard menjaga ritmemu.",
};

export default function LearnPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 md:px-6 py-10 md:py-14">

      <section className="text-center">
        <h1 className="text-3xl md:text-5xl font-semibold tracking-tight leading-tight">
          Belajar Fokus yang Benar—Bukan Lebih Lama, tapi Lebih Pintar
        </h1>
        <p className="mt-4 text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto text-base md:text-lg">
          Halaman ini memandu kamu memahami <strong>Pomodoro</strong> dari dasar (apa &amp; bagaimana),
          cara menaklukkan distraksi, sampai <strong>Flow Guard</strong>—penjaga ritme yang mengingatkanmu saat tab-out
          dan mengajak kembali dengan halus.
        </p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <ClientCTA className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700">
            Coba Timer
            <ArrowRight className="h-4 w-4" />
          </ClientCTA>
        </div>
      </section>

      <section className="mt-12 grid md:grid-cols-3 gap-4">
        <IntroCard
          icon={<BookOpen className="h-4 w-4" />}
          accent="emerald"
          title="Pomodoro"
          desc="Pomodoro membagi kerja menjadi interval fokus yang pendek tapi dalam, diselingi istirahat singkat untuk memulihkan perhatian. Pola umum: 25 menit fokus + 5 menit istirahat. Setelah 3–4 siklus, ambil istirahat lebih panjang (15–30 menit)"
        />
        <IntroCard
          icon={<Zap className="h-4 w-4" />}
          accent="sky"
          title="Distraksi = biaya pindah konteks"
          desc="HP, chat, scroll, dan tab nyasar memboroskan energi mental. Kuncinya: sadari, catat, minimalisir."
        />
        <IntroCard
          icon={<Shield className="h-4 w-4" />}
          accent="amber"
          title="Flow Guard"
          desc="Fitur andalan K-Flow: mendeteksi tab-out saat fokus, kirim pengingat halus, dan memunculkan Focus Card saat kembali."
        />
      </section>

      {/* ===================== SECTION: POMODORO 101 ===================== */}
      <section className="mt-12 rounded-2xl p-6 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
        <Header icon={<TimerIcon className="h-4 w-4 text-emerald-600" />} title="Pomodoro 101 — Cara Kerja & Alur">
          <span className="text-xs text-zinc-500">Fundamental</span>
        </Header>

        {/* Stepper */}
        <ol className="mt-4 grid md:grid-cols-4 gap-4">
          <Step
            number={1}
            title="Tetapkan niat"
            body="Tulis 1 kalimat tujuan sesi: “Kerjakan outline tugas bab 2.” Niat yang spesifik = fokus lebih tajam."
          />
          <Step
            number={2}
            title="Pilih preset"
            body="Pakai 20–10, 25–5, atau 50–10 (lihat perbandingan di bawah)."
          />
          <Step
            number={3}
            title="Fokus tunggal"
            body="Hindari multitasking. Kerjakan hanya 1 hal. Jika terdistraksi, catat sebentar—lalu kembali."
          />
          <Step
            number={4}
            title="Istirahat singkat"
            body="Bangkit sebentar, minum, peregangan. Ulangi 3–4 siklus; lalu ambil istirahat lebih panjang."
          />
        </ol>

        {/* Preset Comparison */}
        <div className="mt-8">
          <h3 className="text-base md:text-lg font-semibold tracking-tight flex items-center gap-2">
            <Gauge className="h-4 w-4 text-emerald-600" />
            Pilihan Preset K-Flow
          </h3>
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
            Pilih sesuai stamina kognitif dan jenis tugas. Tidak ada satu ukuran untuk semua—mulai dari yang paling ringan.
          </p>

          <div className="mt-5 grid md:grid-cols-3 gap-4">
            <PresetCard
              label="20–10"
              badge="Ringan"
              points={[
                "Cocok saat baru memulai/energi rendah.",
                "Tugas berat tapi butuh banyak recovery.",
                "Kontras fokus–istirahat tinggi, aman dari burnout.",
              ]}
            />
            <PresetCard
              label="25–5"
              badge="Standar"
              highlighted
              points={[
                "Preset klasik—rata-rata paling nyaman.",
                "Baik untuk belajar, baca materi, menulis.",
                "Ritme cepat: fokus 25 menit, re-center 5 menit.",
              ]}
            />
            <PresetCard
              label="50–10"
              badge="Dalam"
              points={[
                "Untuk deep work ketika momentum sudah panas.",
                "Minim switching; butuh disiplin kuat.",
                "Ambil break sungguh-sungguh agar segar lagi.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* ===================== SECTION: DISTRAKSI ===================== */}
      <section className="mt-10 rounded-2xl p-6 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
        <Header icon={<Zap className="h-4 w-4 text-amber-600" />} title="Distraksi yang Sering Terjadi & Cara Mengatasinya">
          <span className="text-xs text-zinc-500">Taktik ringkas</span>
        </Header>

        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <Tactic
            title="HP (paling umum)"
            items={[
              "Mode pesawat saat fokus.",
              "Letakkan di luar jangkauan tangan.",
              "Matikan preview notifikasi di lockscreen.",
            ]}
          />
          <Tactic
            title="Chat (DM/GC)"
            items={[
              "Mute 30 menit (session-based).",
              "Balas secara batch di akhir 2 sesi.",
              "Set ekspektasi jam balas di bio/status.",
            ]}
          />
          <Tactic
            title="Scroll (feed/shorts)"
            items={[
              "Gunakan ekstensi pemblokir feed saat fokus.",
              "Pin tab kerja di window terpisah.",
              "Jadikan ‘scroll time’ hadiah setelah 2 sesi.",
            ]}
          />
          <Tactic
            title="Berisik (lingkungan)"
            items={[
              "Gunakan white noise atau earplug.",
              "Atur timer untuk break keluar ruangan 5 menit.",
              "Sinyalkan ke orang lain: ‘sedang sesi fokus’.",
            ]}
          />
          <Tactic
            title="Nyasar tab (tab-out)"
            items={[
              "Pisahkan window kerja vs non-kerja.",
              "Tutup tab yang tidak relevan sebelum mulai.",
              "Flow Guard akan mengingatkan saat kamu keluar.",
            ]}
          />
        </div>
      </section>

      {/* ===================== SECTION: FLOW GUARD ===================== */}
      <section className="mt-10 rounded-2xl p-6 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
        <Header icon={<Shield className="h-4 w-4 text-emerald-600" />} title="Flow Guard — Penjaga Ritme Fokus" />

        <div className="mt-4 grid md:grid-cols-3 gap-4">
          <FGCard
            icon={<Clock className="h-4 w-4" />}
            title="Mendeteksi tab-out saat fokus"
            body="Ketika timer berjalan di fase fokus dan tab K-Flow disembunyikan, sistem menandai itu sebagai tab-out."
          />
          <FGCard
            icon={<BellRing className="h-4 w-4" />}
            title="Pengingat halus"
            body="K-Flow mengirim notifikasi ringan agar kamu kembali. Tanpa marah-marah; hanya ajakan singkat."
          />
          <FGCard
            icon={<CheckCircle2 className="h-4 w-4" />}
            title="Focus Card saat kembali"
            body="Begitu kamu tab-in, muncul Focus Card untuk re-center—ambil napas 3 detik, lanjutkan target."
          />
        </div>

        <div className="mt-6 rounded-xl p-4 ring-1 ring-emerald-500/20 bg-emerald-500/10">
          <div className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Otomatis tercatat di insight
          </div>
          <p className="mt-1 text-sm text-emerald-800/90 dark:text-emerald-200/90">
            Setiap tab-out dihitung sebagai “Nyasar tab” (auto), tampil di after-session summary dan ringkasan harian.
            Kamu bisa membedakan: <em>auto</em> (sistem) vs <em>manual</em> (tombol catatan).
          </p>
        </div>
      </section>

      {/* ===================== SECTION: SCIENCE BOX ===================== */}
      <section className="mt-10 rounded-2xl p-6 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
        <Header icon={<BookOpen className="h-4 w-4 text-sky-600" />} title="Sedikit Ilmu di Balik Fokus" />
        <div className="grid md:grid-cols-3 gap-4">
          <Science
            title="Kapasitas perhatian itu terbatas"
            body="Otak cepat lelah bila terus menahan distraksi. Interval fokus-istirahat menjaga energi tetap stabil."
          />
          <Science
            title="Context switching menurunkan kinerja"
            body="Pindah tugas/tab membuat otak butuh ‘biaya start ulang’. Ritme Pomodoro mengurangi biaya ini."
          />
          <Science
            title="Feedback loop menang"
            body="Melihat catatan distraksi dan menit fokus harian memberi sinyal kemajuan—mendorong konsistensi."
          />
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section className="mt-10 rounded-2xl p-6 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
        <Header icon={<CircleHelp className="h-4 w-4 text-zinc-600" />} title="FAQ Singkat" />
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <QA
            q="Preset mana yang harus kupakai?"
            a="Mulai dari 25–5 (standar). Jika terasa berat, turun ke 20–10. Jika sedang ‘panas’ dan butuh ruang dalam, naik ke 50–10."
          />
          <QA
            q="Kalau aku tab-out untuk referensi belajar, apakah ini salah?"
            a="Tidak selalu. Catat sebagai ‘Nyasar tab’ (otomatis) lalu segera kembali. Jika memang perlu, pertimbangkan pecah tugas: sesi fokus untuk menulis, sesi berikutnya khusus riset."
          />
          <QA
            q="Apakah aku harus mencatat distraksi manual?"
            a="Tidak wajib, tapi membantu mengerti pola. K-Flow sudah otomatis mencatat ‘Nyasar tab’; tombol manual melengkapi konteks (HP/Chat/Scroll/Berisik)."
          />
          <QA
            q="Berapa siklus yang ideal dalam sehari?"
            a="3–6 siklus fokus biasanya realistis untuk kebanyakan orang. Yang penting: konsisten tiap hari, bukan banyak sekaligus lalu kehabisan tenaga."
          />
        </div>
      </section>

      {/* ===================== CTA BOTTOM ===================== */}
      <section className="mt-12 flex items-center justify-center">
        <ClientCTA className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700">
          Join Us for Free
          <ArrowRight className="h-4 w-4" />
        </ClientCTA>
      </section>
    </main>
  );
}

/* ===================== SMALL COMPONENTS ===================== */

function Header({ icon, title, children }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-lg md:text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function IntroCard({ icon, title, desc, accent = "emerald" }) {
  const accentMap = {
    emerald: "bg-emerald-500/15 text-emerald-600",
    sky: "bg-sky-500/15 text-sky-600",
    amber: "bg-amber-500/15 text-amber-600",
  };
  return (
    <div className="rounded-2xl p-5 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/80 dark:bg-zinc-900/70">
      <span className={`inline-grid h-9 w-9 place-items-center rounded-xl ${accentMap[accent]} mb-2`}>
        {icon}
      </span>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{desc}</p>
    </div>
  );
}

function Step({ number, title, body }) {
  return (
    <li className="rounded-2xl p-4 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-900/60">
      <div className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-600 text-sm font-semibold">
        {number}
      </div>
      <div className="mt-2 font-semibold">{title}</div>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">{body}</p>
    </li>
  );
}

function PresetCard({ label, badge, points = [], highlighted = false }) {
  return (
    <div
      className={`rounded-2xl p-5 ring-1 ${
        highlighted
          ? "ring-emerald-500/40 bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-transparent shadow-[0_12px_48px_rgba(16,185,129,.15)]"
          : "ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-900/60"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="text-xl font-semibold">{label}</div>
        <span
          className={`text-[11px] px-2 py-0.5 rounded-full ${
            highlighted
              ? "bg-emerald-600 text-white"
              : "bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300"
          }`}
        >
          {badge}
        </span>
      </div>
      <ul className="mt-3 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5">
        {points.map((p, i) => (
          <li key={i}>{p}</li>
        ))}
      </ul>
    </div>
  );
}

function Tactic({ title, items = [] }) {
  return (
    <div className="rounded-2xl p-5 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-900/60">
      <div className="text-sm font-semibold">{title}</div>
      <ul className="mt-2 space-y-1.5 text-sm text-zinc-700 dark:text-zinc-300 list-disc pl-5">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ul>
    </div>
  );
}

function FGCard({ icon, title, body }) {
  return (
    <div className="rounded-2xl p-5 ring-1 ring-emerald-500/20 bg-emerald-500/5">
      <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
        {icon}
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <p className="mt-2 text-sm text-emerald-800/90 dark:text-emerald-200/90">{body}</p>
    </div>
  );
}

function Science({ title, body }) {
  return (
    <div className="rounded-2xl p-5 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-900/60">
      <div className="text-sm font-semibold">{title}</div>
      <p className="mt-2 text-sm text-zinc-700 dark:text-zinc-300">{body}</p>
    </div>
  );
}

function QA({ q, a }) {
  return (
    <div className="rounded-2xl p-5 ring-1 ring-zinc-200 dark:ring-zinc-800 bg-white/70 dark:bg-zinc-900/60">
      <div className="font-semibold">{q}</div>
      <p className="mt-1 text-sm text-zinc-700 dark:text-zinc-300">{a}</p>
    </div>
  );
}
