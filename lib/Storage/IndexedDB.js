const DB_NAME = 'tuntasin-db';
const DB_VERSION = 1;

export const STORES = {
  sessions: 'sessions',
  events: 'events',
  rollups_daily: 'rollups_daily',
};

let _dbPromise = null;

export function openDB() {
  if (typeof window === 'undefined') throw new Error('IndexedDB hanya di browser');
  if (_dbPromise) return _dbPromise;

  _dbPromise = new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = () => {
      const db = req.result;

      if (!db.objectStoreNames.contains(STORES.sessions)) {
        const s = db.createObjectStore(STORES.sessions, { keyPath: 'id' });
        s.createIndex('start', 'start', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.events)) {
        const e = db.createObjectStore(STORES.events, { keyPath: 'id' });
        e.createIndex('session_id', 'session_id', { unique: false });
        e.createIndex('t', 't', { unique: false });
      }

      if (!db.objectStoreNames.contains(STORES.rollups_daily)) {
        db.createObjectStore(STORES.rollups_daily, { keyPath: 'date' });
      }
    };

    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

  return _dbPromise;
}

async function tx(store, mode) {
  const db = await openDB();
  return db.transaction(store, mode).objectStore(store);
}

function reqProm(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putSession(s) {
  const store = await tx(STORES.sessions, 'readwrite');
  await reqProm(store.put(s));
}

export async function getSession(id) {
  const store = await tx(STORES.sessions, 'readonly');
  return await reqProm(store.get(id));
}

export async function putEvent(e) {
  const store = await tx(STORES.events, 'readwrite');
  await reqProm(store.put(e));
}

export async function getEventsBySession(session_id) {
  const store = await tx(STORES.events, 'readonly');
  const idx = store.index('session_id');
  const req = idx.getAll(session_id);
  const items = await reqProm(req);
  return (items || []).sort((a, b) => a.t - b.t);
}

export async function putDailyRollup(r) {
  const store = await tx(STORES.rollups_daily, 'readwrite');
  await reqProm(store.put(r));
}

export async function getDailyRollup(date) {
  const store = await tx(STORES.rollups_daily, 'readonly');
  return await reqProm(store.get(date));
}

export async function listDailyRollups(startDate, endDate) {
  const store = await tx(STORES.rollups_daily, 'readonly');
  const all = (await reqProm(store.getAll())) || [];
  return all
    .filter((d) => d.date >= startDate && d.date <= endDate)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function ymdLocal(epochMs) {
  const d = new Date(epochMs);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function hourLocal(epochMs) {
  return new Date(epochMs).getHours();
}
