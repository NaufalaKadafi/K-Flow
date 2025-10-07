import AppDemo from "../../Timer/AppDemo";

export const metadata = {
  title: "Timer",
  description: "Mulai sesi fokus, catat distraksi, dan review hasil.",
};

export default function TimerPage() {
  return (
    <div id="timer-app" className="mx-auto max-w-4xl px-4 md:px-6 py-10">
      <AppDemo />
    </div>
  );
}
