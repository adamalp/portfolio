/** Move-out day. Pickups must happen before this date. */
export const MOVE_OUT = new Date(2026, 8, 15); // Tue Sept 15, 2026 (local)
export const PICKUP_DEADLINE_LABEL = "Monday, Sept 14";
export const MOVE_OUT_LABEL = "Tuesday, Sept 15";

const DAY = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** Pickup days still available: today through the day before move-out. */
export function pickupDays(now = new Date()): { key: string; label: string }[] {
  const out: { key: string; label: string }[] = [];
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  while (d < MOVE_OUT) {
    out.push({ key: `${d.getMonth() + 1}/${d.getDate()}`, label: `${DAY[d.getDay()]} ${MON[d.getMonth()]} ${d.getDate()}` });
    d.setDate(d.getDate() + 1);
  }
  return out;
}

export const PICKUP_TIMES = ["Morning", "Afternoon", "Evening"] as const;
