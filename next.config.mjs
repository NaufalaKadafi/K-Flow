const isProd = process.env.NODE_ENV === "production";
// Nama repo GitHub — dipakai sebagai base path saat di-hosting di
// https://<user>.github.io/K-Flow/
const repoName = "K-Flow";
const basePath = isProd ? `/${repoName}` : "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // GitHub Pages cuma bisa serve file statis, jadi Next.js harus di-export
  // sebagai static site (hasilnya ada di folder `out/`).
  output: "export",
  // Project pages (bukan user/org page) selalu berada di sub-path /<repo>,
  // jadi semua link & asset perlu tahu prefix ini saat production.
  basePath,
  assetPrefix: isProd ? `/${repoName}/` : "",
  images: {
    // next/image butuh server untuk optimisasi on-the-fly, yang tidak ada
    // di static export / GitHub Pages.
    unoptimized: true,
  },
  env: {
    // Sudah dipakai lib/sfx.js & lib/notify.js untuk prefix path asset
    // publik yang di-hardcode (bukan lewat next/image atau next/link,
    // yang otomatis dapat basePath). Sebelumnya var ini tidak pernah
    // di-set, jadi selalu kosong bahkan saat build production.
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
