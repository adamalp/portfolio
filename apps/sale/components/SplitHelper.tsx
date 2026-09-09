"use client";
import { useState } from "react";

/** Roommate split on the receipt page. */
export default function SplitHelper({ total }: { total: number }) {
  const [n, setN] = useState(3);
  const per = total / n;
  return (
    <div className="split">
      <p>Splitting it with roommates?</p>
      <div className="split-row" role="group" aria-label="Number of people">
        {[2, 3, 4].map((k) => (
          <button type="button" key={k} aria-pressed={n === k} onClick={() => setN(k)}>{k} ways</button>
        ))}
        <output>${Number.isInteger(per) ? per : per.toFixed(2)}<small>each</small></output>
      </div>
    </div>
  );
}
