"use client"

const TIMER_LS_KEY = "kflow.timer.v1";
const LEGACY_DB = "tuntasin-db";
const BRAND_DB  = "kflow-db";
const DB_VERSION = 1;
const STORES = ["sessions", "events", "rollups_daily"];

function safeJsonParse(raw) {
  try { return JSON.parse(raw); } catch { return null; }
}

function downloadBlob(json, filename = "kflow-backup.json") {
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function hasIDBDatabases() {
  return typeof indexedDB !== "undefined" && typeof indexedDB.databases === "function";
}

async function listExistingDBNames() {
  if (!hasIDBDatabases()) {
    return [];
  }
  const dbs = await indexedDB.databases();
  return (dbs || []).map(d => d.name).filter(Boolean);
}

async function openExistingDB(dbName) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName);
    let created = false;
    req.onupgradeneeded = () => {
      created = true;
    };
    req.onsuccess = () => {
      if (created) {
        try { req.result.close(); } catch {}
        resolve(null);
      } else {
        resolve(req.result);
      }
    };
    req.onerror = () => reject(req.error);
  });
}

function tx(db, storeName, mode = "readonly") {
  return db.transaction(storeName, mode).objectStore(storeName);
}
function reqProm(req) {
  return new Promise((res, rej) => {
    req.onsuccess = () => res(req.result);
    req.onerror = () => rej(req.error);
  });
}

async function dumpStore(db, storeName) {
  if (!db.objectStoreNames.contains(storeName)) return [];
  const store = tx(db, storeName, "readonly");
  try {
    const all = await reqProm(store.getAll());
    return all || [];
  } catch {
    return [];
  }
}

async function collectIndexedDBAll() {
  const names = await listExistingDBNames();
  const targets = [BRAND_DB, LEGACY_DB].filter(n => names.includes(n));
  if (!targets.length) return null;

  const out = [];
  for (const name of targets) {
    const db = await openExistingDB(name);
    if (!db) continue;
    try {
      const [sessions, events, rollups] = await Promise.all([
        dumpStore(db, "sessions"),
        dumpStore(db, "events"),
        dumpStore(db, "rollups_daily"),
      ]);
      out.push({
        dbName: name,
        version: db.version,
        stores: {
          sessions,
          events,
          rollups_daily: rollups,
        },
      });
    } finally {
      try { db.close(); } catch {}
    }
  }
  return out.length ? out : null;
}

async function openDBForRestore(dbName = BRAND_DB) {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(dbName, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("sessions")) {
        const s = db.createObjectStore("sessions", { keyPath: "id" });
        try { s.createIndex("start", "start", { unique: false }); } catch {}
      }
      if (!db.objectStoreNames.contains("events")) {
        const e = db.createObjectStore("events", { keyPath: "id" });
        try {
          e.createIndex("session_id", "session_id", { unique: false });
          e.createIndex("t", "t", { unique: false });
        } catch {}
      }
      if (!db.objectStoreNames.contains("rollups_daily")) {
        db.createObjectStore("rollups_daily", { keyPath: "date" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function clearStore(db, storeName) {
  if (!db.objectStoreNames.contains(storeName)) return;
  const store = tx(db, storeName, "readwrite");
  await reqProm(store.clear());
}
async function bulkPut(db, storeName, items = []) {
  if (!db.objectStoreNames.contains(storeName)) return;
  const store = tx(db, storeName, "readwrite");
  for (const it of items) {
    await reqProm(store.put(it));
  }
}

export async function backupKFlow() {

  const timer = safeJsonParse(localStorage.getItem(TIMER_LS_KEY));
  const idbBundles = await collectIndexedDBAll();
  const bundle = {
    app: "K-Flow",
    kind: "backup",
    version: 1,
    createdAt: new Date().toISOString(),
    data: {
      local: {
        [TIMER_LS_KEY]: timer ?? null,
      },
      idb: idbBundles,
    },
  };
  return bundle;
}

export async function downloadBackup(filename = "kflow-backup.json") {
  const bundle = await backupKFlow();
  downloadBlob(bundle, filename);
  return bundle;
}


export async function restoreKFlowToStorage(bundle) {
  if (!bundle || typeof bundle !== "object") throw new Error("Bundle tidak valid");

  const local = bundle?.data?.local || {};

  if (local[TIMER_LS_KEY] !== undefined) {
    try {
      localStorage.setItem(TIMER_LS_KEY, JSON.stringify(local[TIMER_LS_KEY] ?? null));
    } catch {}
  }


  const idb = bundle?.data?.idb;
  if (Array.isArray(idb) && idb.length) {

    for (const unit of idb) {
      const dbName = unit?.dbName || BRAND_DB;
      const stores = unit?.stores || {};
      const db = await openDBForRestore(dbName);
      try {

        for (const s of STORES) await clearStore(db, s);

    
        await bulkPut(db, "sessions", stores.sessions || []);
        await bulkPut(db, "events", stores.events || []);
        await bulkPut(db, "rollups_daily", stores.rollups_daily || []);
      } finally {
        try { db.close(); } catch {}
      }
    }
  }
  return true;
}

export async function restoreFromFile(file) {
  const text = await file.text();
  const bundle = JSON.parse(text);
  return restoreKFlowToStorage(bundle);
}
