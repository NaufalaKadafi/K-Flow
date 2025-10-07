"use client";

import { useEffect } from "react";
import { LinkKerja } from "./LinkKerja";


export default function sfcmanager() {
  const { activeCount, wtl, _recalcEscalation } = useWorkLinks(s => ({
    activeCount: s.activeCount,
    wtl: s.wtl,
    _recalcEscalation: s._recalcEscalation,
  }));

  useEffect(() => {
    _recalcEscalation();
 
    const t = setInterval(() => _recalcEscalation(), 2000);
    return () => clearInterval(t);
  }, [_recalcEscalation]);


  useEffect(() => {
    _recalcEscalation();
  }, [wtl, _recalcEscalation]);

  const _ac = activeCount(); 
  useEffect(() => {
    _recalcEscalation();
  }, [_ac, _recalcEscalation]);

  return null;
}
