import Image from "next/image";

// next/image tidak menambahkan basePath sendiri saat images.unoptimized
// aktif (dipakai untuk static export), jadi prefix-nya dipasang manual
// seperti di lib/sfx.js & lib/notify.js.
const BP = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Logo({ src=`${BP}/K-FlowIcon.png`, size=28, className="" }) {
  return (
    <Image
      src={src}           
      alt="Tuntasin"
      width={size}
      height={size}
      priority
      className={className}
    />
  );
}
