import Image from "next/image";

export default function Logo({ src="/K-FlowIcon.png", size=28, className="" }) {
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
