"use client";

import React from "react";
import useParallax from "../lib/useParallax";
import Bubble from "./chat/Bubble";

function NameTag({ children }) {
  return (
    <span className="absolute bottom-2 right-3 z-20 rounded-full bg-white/90 text-zinc-900 text-xs font-medium px-2 py-1 shadow-sm">
      {children}
    </span>
  );
}

function ChatCard({
  imgSrc,
  alt,
  name,
  place = "top-right", 
  bubbleSide = "right",
  bubbleTitle = "",
  bubbleItems = [],
  bubbleAlignY = "top",
  offset = { x: 28, y: 24 },
  bubbleSize = "sm", 
  bubbleIcon = null,
}) {
  const atTopRight = place === "top-right";

  const cardPos = atTopRight
    ? "top-0 right-0 w-[62%] md:w-[58%]"
    : "bottom-0 left-0 w-[62%] md:w-[58%]";

  const bubbleStyle = {
    ...(bubbleSide === "right" ? { right: -offset.x } : { left: -offset.x }),
    ...(bubbleAlignY === "top" && { top: offset.y }),
    ...(bubbleAlignY === "bottom" && { bottom: offset.y }),
    ...(bubbleAlignY === "center" && { top: "50%", transform: "translateY(-50%)" }),
    zIndex: 30,
  };

  const tailSide = bubbleSide === "right" ? "left" : "right";

  return (
    <div className={`absolute isolate overflow-visible ${cardPos}`} style={{ zIndex: 2 }}>
      <figure className="relative rounded-2xl overflow-hidden border border-white/10 bg-zinc-900/20 shadow-[0_8px_30px_rgba(0,0,0,.25)]">
        <img
          src={imgSrc}
          alt={alt}
          className="block w-full h-auto aspect-[16/10] object-cover"
          loading="eager"
          decoding="async"
        />
        <NameTag>{name}</NameTag>
      </figure>

      <div className="absolute" style={bubbleStyle}>
        <Bubble
          side={tailSide}  
          title={bubbleTitle}
          items={bubbleItems}
          size={bubbleSize}
          icon={bubbleIcon}
        />
      </div>
    </div>
  );
}


export default function HeroDemoImage({ swap = false }) {
  const cardRef = useParallax(5);

  const CEWE = {
    img: "/CeweKerja.jpg",
    alt: "Syifa sedang fokus",
    name: "Syifa",
    title: "Sekarang aku lagi…",
    items: ["Merapikan catatan riset", "Membuat user flow homepage"],
  };

  const COWO = {
    img: "/CowoKerja.jpg",
    alt: "Nicholas sedang fokus",
    name: "Nicholas",
    title: "Sesi ini, aku…",
    items: ["Membuat presentasi penting", "Menjadwalkan meeting desain"],
  };

  const TOP = swap ? COWO : CEWE;
  const BOT = swap ? CEWE : COWO;

  return (
    <div
      ref={cardRef}
      className="relative w-full h-full overflow-visible [transform-style:preserve-3d] [perspective:1000px]"
      style={{ transform: "rotateX(var(--rx)) rotateY(var(--ry))" }}
    >
      <div
        aria-hidden
        className="absolute -inset-6 pointer-events-none"
        style={{
          background:
            "radial-gradient(600px 320px at 65% 35%, rgba(16,185,129,.15), transparent 60%)",
        }}
      />

      <ChatCard
        imgSrc={TOP.img}
        alt={TOP.alt}
        name={TOP.name}
        place="top-right"
        bubbleSide="left"          
        bubbleTitle={TOP.title}
        bubbleItems={TOP.items}
        bubbleAlignY="top"
        offset={{ x: 200, y: 26 }}
        bubbleSize="sm"
      />

      <ChatCard
        imgSrc={BOT.img}
        alt={BOT.alt}
        name={BOT.name}
        place="bottom-left"
        bubbleSide="right" 
        bubbleTitle={BOT.title}
        bubbleItems={BOT.items}
        bubbleAlignY="bottom"
        offset={{ x: 210, y: 29 }}
        bubbleSize="sm"
      />

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[.10]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'100\' height=\'100\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3CfeColorMatrix type=\'saturate\' values=\'0\'/%3E%3CfeComponentTransfer%3E%3CfeFuncA type=\'table\' tableValues=\'0 0.06\'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
        }}
      />
    </div>
  );
}
