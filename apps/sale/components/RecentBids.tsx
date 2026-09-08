"use client";
import { useEffect, useState } from "react";
import type { RecentBid } from "@/lib/db";

const fmt = (n: number) => "$" + Math.round(n).toLocaleString();

function ago(iso: string, now: number): string {
  const s = Math.max(0, Math.floor((now - new Date(iso).getTime()) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return m + "m ago";
  const h = Math.floor(m / 60);
  if (h < 24) return h + "h ago";
  return Math.floor(h / 24) + "d ago";
}

export default function RecentBids({ bids }: { bids: RecentBid[] }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 30000);
    return () => clearInterval(t);
  }, []);
  if (!bids.length) return null;
  return (
    <section className="recent" aria-label="Recent bids">
      <span className="recent-label"><span className="dot" aria-hidden="true" /> Recent bids</span>
      <ul>
        {bids.map((b) => (
          <li key={b.id} className={b.leading ? "leading" : ""}>
            <b>{b.first_name}</b> bid <b>{fmt(b.amount)}</b> on {b.item}
            {now != null && <span className="when"> · {ago(b.created_at, now)}</span>}
          </li>
        ))}
      </ul>
    </section>
  );
}
