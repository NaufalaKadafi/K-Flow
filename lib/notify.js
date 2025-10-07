import { playSound, SOUNDS } from "./sfx";

const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";
const ICON = `${BP}/K-FlowIcon.png`;

export function canNotify() {
  return typeof window !== "undefined" && "Notification" in window;
}

export async function ensureNotifyPermission() {
  if (!canNotify()) return false;
  if (Notification.permission === "granted") return true;
  if (Notification.permission === "denied") return false;
  try {
    const res = await Notification.requestPermission();
    return res === "granted";
  } catch { return false; }
}

export function sendNotifyPersistent(title, body) {
  if (!canNotify() || Notification.permission !== "granted") return false;
  try {
    new Notification(title, {
      body,
      tag: "kflow-tab-out",
      renotify: true,
      requireInteraction: true,
      silent: true,
      icon: ICON,
    });
    return true;
  } catch { return false; }
}

export function notifyWithSound(title, body, thirdArg) {
  let soundFile = SOUNDS.FOCUS_END;
  let notifOpts = { tag: "kflow-session", renotify: true, silent: false };

  if (typeof thirdArg === "string") {
    soundFile = thirdArg || soundFile;
  } else if (thirdArg && typeof thirdArg === "object") {
    if (thirdArg.soundFile) soundFile = thirdArg.soundFile;
    if (typeof thirdArg.tag !== "undefined") notifOpts.tag = thirdArg.tag;
    if (typeof thirdArg.renotify !== "undefined") notifOpts.renotify = !!thirdArg.renotify;
    if (typeof thirdArg.silent !== "undefined") notifOpts.silent = !!thirdArg.silent;
  }

  ensureNotifyPermission().then((ok) => {
    if (ok) {
      try {
        new Notification(title, {
          body,
          icon: ICON,
          tag: notifOpts.tag,
          renotify: notifOpts.renotify,
          silent: notifOpts.silent,
        });
      } catch {}
    }

    playSound(soundFile);
  });
}

export { SOUNDS };
