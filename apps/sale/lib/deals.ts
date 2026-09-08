/** Small items are free once the rest of the cart is big enough. */
export const FREE_UNDER = 15;      // items whose starting price is at or below this
export const FREE_MIN_SPEND = 100; // paid subtotal (other items) needed to unlock

export function freeEligible(item: { asking_price: number | null }): boolean {
  return item.asking_price != null && item.asking_price > 0 && item.asking_price <= FREE_UNDER;
}
