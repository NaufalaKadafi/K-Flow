"use client";
import React from "react";

export default function NoiseTexture({ intensity = 0.04, className = "" }) {
  const svg = encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/>
        <feColorMatrix type='saturate' values='0'/>
        <feComponentTransfer>
          <feFuncA type='table' tableValues='0 ${intensity}'/>
        </feComponentTransfer>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)'/>
    </svg>`
  );

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 opacity-50 mix-blend-multiply dark:mix-blend-soft-light ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,${svg}")` }}
    />
  );
}
