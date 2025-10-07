"use client";
import React from "react";

export default function WaveTop({ className = "" }) {
  return (
    <div aria-hidden className={`relative -mt-6 ${className}`}>
      <svg
        viewBox="0 0 1440 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block w-full h-[90px]"
        preserveAspectRatio="none"
      >
        <path
          d="M0 60C160 20 320 20 480 60C640 100 800 100 960 60C1120 20 1280 20 1440 60V90H0V60Z"
          className="fill-emerald-50 dark:fill-emerald-900/10"
        />
      </svg>
    </div>
  );
}
