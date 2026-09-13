"use client";

import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

export function RealTimeClock() {
  const [dateStr, setDateStr] = useState<string>("");
  const [timeStr, setTimeStr] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const d = now.toLocaleDateString("en-IN", {
        timeZone: "Asia/Kolkata",
        weekday: "short",
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const t = now.toLocaleTimeString("en-IN", {
        timeZone: "Asia/Kolkata",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
      setDateStr(d);
      setTimeStr(`${t} IST (Mumbai)`);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="topbar-item topbar-date inline-flex items-center gap-1.5 font-medium text-xs">
      <Calendar className="topbar-icon" />
      <span>{dateStr || "IST"}</span>
      <span className="opacity-40">&bull;</span>
      <Clock className="topbar-icon text-[#2D7FF9] animate-pulse" />
      <span className="font-mono text-[#2D7FF9] font-bold">{timeStr || "IST (Mumbai)"}</span>
    </div>
  );
}
