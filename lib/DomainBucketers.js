let BUCKET_CONFIG = {
  buckets: {
    sosmed: ["tiktok.com", "instagram.com", "x.com", "twitter.com", "facebook.com"],
    chat: ["web.whatsapp.com", "wa.me", "telegram.org", "discord.com", "messenger.com"],
    hiburan: ["netflix.com", "spotify.com", "wetv.vip", "viu.com"],
    game: ["steampowered.com", "store.steampowered.com", "roblox.com", "epicgames.com"],
    referensi: ["github.com", "docs.google.com", "notion.so", "stackoverflow.com", "medium.com"],
    akademik: ["scholar.google.com", "classroom.google.com", "sinta.kemdikbud.go.id"],
    belanja: ["tokopedia.com", "shopee.co.id", "bukalapak.com", "lazada.co.id"],
    "lain-lain": []
  },
  advanced: {
    youtube: { shorts: "short_video", watch: "long_video" },
    whitelist: [] 
  }
};

export function setBucketConfig(cfg) {
  if (!cfg || typeof cfg !== "object") return;
  BUCKET_CONFIG = { ...BUCKET_CONFIG, ...cfg };
}
export function getBucketConfig() {
  return BUCKET_CONFIG;
}

export function normalizeHost(urlOrDomain) {
  if (!urlOrDomain) return "";
  try {
    const u = new URL(urlOrDomain);
    return u.hostname.toLowerCase();
  } catch {
    return String(urlOrDomain).replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
  }
}

export function bucketDomain(urlOrDomain) {
  const host = normalizeHost(urlOrDomain);
  if (!host) return "lain-lain";

  const cfg = BUCKET_CONFIG;


  if (cfg.advanced?.whitelist?.length) {
    if (cfg.advanced.whitelist.some((w) => host.endsWith(w))) return "referensi";
  }
  if (host.endsWith("youtube.com")) {
    
    try {
      const u = new URL(urlOrDomain);
      if (u.pathname.startsWith("/shorts")) return cfg.advanced.youtube.shorts || "sosmed";
      if (u.pathname.startsWith("/watch")) return cfg.advanced.youtube.watch || "hiburan";
    } catch {
     
    }
  }


  for (const [bucket, domains] of Object.entries(cfg.buckets)) {
    if (domains.some((d) => host === d)) return bucket;
  }

  for (const [bucket, domains] of Object.entries(cfg.buckets)) {
    if (domains.some((d) => host.endsWith(d))) return bucket;
  }

  return "lain-lain";
}


export function reasonOrBucket({ reason, url, domain }) {

  if (reason && typeof reason === "string" && reason.trim()) return reason.toLowerCase();
  return bucketDomain(domain || url || "");
}
