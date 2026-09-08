import { NextResponse } from "next/server";
import { publicItems } from "@/lib/db";
import { BIDS_CLOSE_ISO, BIDS_CLOSE_LABEL, PICKUP_ADDRESS, PICKUP_CITY, PICKUP_DAY_LABEL, PICKUP_DEADLINE_LABEL, biddingOpen } from "@/lib/pickup";
import { FREE_MIN_SPEND, FREE_UNDER, REWARD_TIERS, freeEligible, rewardEligible, rewardSpendFor } from "@/lib/deals";

export const dynamic = "force-dynamic";
const SITE = "https://sale.adam-alpert.com";
const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET, OPTIONS", "Cache-Control": "no-store" };

export function OPTIONS() { return new NextResponse(null, { status: 204, headers: cors }); }

/** Public, read-only catalog for AI assistants and scripts. No buyer identities. */
export async function GET() {
  const items = await publicItems();
  const out = items.map((i) => {
    const minBid = i.status === "Sold" ? null : Math.max(i.asking_price ?? 1, i.best_offer ? i.best_offer + 5 : 0, 1);
    return {
      id: i.id,
      name: i.name,
      category: i.category,
      description: i.description,
      dimensions: i.dimensions || null,
      qty: i.qty,
      status: i.status,
      starting_price: i.asking_price,
      current_best_bid: i.best_offer,
      open_bids: i.open_offers,
      min_bid_to_lead: minBid,
      sold_price: i.sold_price,
      free_with_cart_over: freeEligible(i) ? FREE_MIN_SPEND : rewardEligible(i) ? rewardSpendFor(i.asking_price) : null,
      image_url: i.image_url ? SITE + i.image_url : null,
      link: `${SITE}/?item=${i.id}`,
    };
  });
  return NextResponse.json({
    sale: {
      title: "Adam's Moving Sale",
      site: SITE,
      bidding_open: biddingOpen(),
      bids_close: BIDS_CLOSE_ISO,
      bids_close_label: BIDS_CLOSE_LABEL,
      pickup_day: PICKUP_DAY_LABEL,
      pickup_deadline: PICKUP_DEADLINE_LABEL,
      pickup_address: `${PICKUP_ADDRESS}, ${PICKUP_CITY}`,
      rules: {
        free_small_items: `Items with a starting price of $${FREE_UNDER} or less are free when the rest of the cart totals $${FREE_MIN_SPEND} or more.`,
        reward_picks: REWARD_TIERS.map((t) => `A cart of $${t.spend}+ in bids earns one unbid item priced up to $${t.cap} for free.`),
        bidding: "Highest bid at close wins. A bid must be at least the starting price; to lead it must beat the current best bid.",
      },
      how_to_bid: `Build a link the buyer can open: ${SITE}/?cart=ITEM_ID:AMOUNT,ITEM_ID:AMOUNT (e.g. ${SITE}/?cart=2:300,22:20). It opens the site with those items in the cart; the buyer reviews, enters name and phone, and sends.`,
      docs: `${SITE}/SKILL.md`,
    },
    items: out,
  }, { headers: cors });
}
