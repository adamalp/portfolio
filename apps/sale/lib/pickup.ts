/** Move-out day. Pickups must happen before this date. */
export const MOVE_OUT = new Date(2026, 8, 15); // Tue Sept 15, 2026 (local)
export const PICKUP_DEADLINE_LABEL = "Monday, Sept 14";
export const MOVE_OUT_LABEL = "Tuesday, Sept 15";
/** Bidding closes here (America/New_York). Winners are texted the next morning. */
export const BIDS_CLOSE_ISO = "2026-09-14T17:00:00-04:00";
export const BIDS_CLOSE_LABEL = "Monday, Sept 14 at 5pm";
export const WINNERS_LABEL = "Monday evening";
export const PICKUP_DAY_KEY = "9/14";
export const PICKUP_DAY_LABEL = "Monday, Sept 14";
/** The window winners are asked to come in on pickup day. */
export const PICKUP_WINDOW_LABEL = "Monday between 6 and 8pm";
export function biddingOpen(now = Date.now()): boolean { return now < new Date(BIDS_CLOSE_ISO).getTime(); }
export const PICKUP_ADDRESS = "129 Franklin St, Central Square";
export const PICKUP_CITY = "Cambridge, MA";
export const PICKUP_MAP_URL = "https://maps.google.com/?q=129+Franklin+St,+Cambridge,+MA";

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
