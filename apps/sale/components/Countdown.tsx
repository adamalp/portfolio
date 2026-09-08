"use client";
import { useEffect, useState } from "react";
import { BIDS_CLOSE_ISO, BIDS_CLOSE_LABEL } from "@/lib/pickup";

function left(ms: number): string {
  if (ms <= 0) return "";
  const m = Math.floor(ms / 60000), h = Math.floor(m / 60), d = Math.floor(h / 24);
  if (d >= 1) return `${d}d ${h % 24}h`;
  if (h >= 1) return `${h}h ${m % 60}m`;
  return `${m}m`;
}

export default function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => { setNow(Date.now()); const t = setInterval(() => setNow(Date.now()), 30000); return () => clearInterval(t); }, []);
  const end = new Date(BIDS_CLOSE_ISO).getTime();
  const closed = now != null && now >= end;
  return (
    <div className={`deadline ${closed ? "closed" : ""}`}>
      {closed ? (
        <><b>Bidding has closed.</b> Winners are being texted. Thanks, everyone.</>
      ) : (
        <><b>Bidding closes {BIDS_CLOSE_LABEL}</b>{now != null && <span className="left"> · {left(end - now)} left</span>}</>
      )}
    </div>
  );
}
