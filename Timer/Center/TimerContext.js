"use client";
import React from "react";

export const TimerCtx = React.createContext(null);
export function useTimer() {
  return React.useContext(TimerCtx);
}
