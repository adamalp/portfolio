/** Small items are free once the rest of the cart is big enough. */
export const FREE_UNDER = 15;      // items whose starting price is at or below this
export const FREE_MIN_SPEND = 100; // paid subtotal (other items) needed to unlock

export function freeEligible(item: { asking_price: number | null }): boolean {
  return item.asking_price != null && item.asking_price > 0 && item.asking_price <= FREE_UNDER;
}

/** Reward picks: spend this much in bids, choose one unbid item up to `cap` for free. */
export const REWARD_TIERS: { spend: number; cap: number }[] = [
  { spend: 200, cap: 30 },
  { spend: 300, cap: 60 },
  { spend: 500, cap: 100 },
];

/** Highest reward tier unlocked by a paid subtotal, or null. */
export function rewardTier(paid: number) {
  let t: { spend: number; cap: number } | null = null;
  for (const tier of REWARD_TIERS) if (paid >= tier.spend) t = tier;
  return t;
}

/** The cart size at which an item of this price becomes a free pick, or null if it never does. */
export function rewardSpendFor(price: number | null): number | null {
  if (price == null || price <= FREE_UNDER) return null;
  const tier = REWARD_TIERS.find((t) => price <= t.cap);
  return tier ? tier.spend : null;
}

/** Can this item be chosen as a free reward pick at all? */
export function rewardEligible(item: { asking_price: number | null; status: string; open_offers?: number }): boolean {
  return (item.status === "Available" || item.status === "Tentative") && !item.open_offers && rewardSpendFor(item.asking_price) != null;
}
