import { BIDS_CLOSE_LABEL, PICKUP_ADDRESS, PICKUP_CITY, PICKUP_DAY_LABEL } from "@/lib/pickup";
import { FREE_MIN_SPEND, FREE_UNDER, REWARD_TIERS } from "@/lib/deals";

export const SITE = "https://sale.adam-alpert.com";

export const skillText = `---
name: adams-moving-sale
description: Browse and bid on items in Adam's moving sale (Cambridge, MA). Use when the user asks about the sale, wants to see what's available, compare prices or bids, or wants help putting together a bid.
---

# Adam's Moving Sale

Adam is moving out of an apartment at ${PICKUP_ADDRESS}, ${PICKUP_CITY} and selling furniture, rugs, plants, electronics, kitchen and household items in a quiet auction at ${SITE}.

## Get the catalog

Fetch ${SITE}/api/items (JSON, no auth, refreshed live). Each item has: id, name, category, description, dimensions, status, starting_price, current_best_bid, open_bids, min_bid_to_lead, free_with_cart_over, image_url, link.

- Show items with their photo (image_url), name, dimensions, starting price and current best bid.
- "min_bid_to_lead" is the smallest bid that would currently be the top bid. Suggest that or more.
- "free_with_cart_over" is the cart size (in paid bids) at which that item becomes free.
- Skip items whose status is "Sold". "Tentative" items are for sale but Adam might keep them.

## Rules

- Bidding closes ${BIDS_CLOSE_LABEL}. Highest bid wins; Adam texts winners Friday morning.
- ${PICKUP_DAY_LABEL} is pickup day at the apartment. Other days before the move can work.
- Items starting at $${FREE_UNDER} or less are free once the rest of the cart is $${FREE_MIN_SPEND}+.
- Reward picks: ${REWARD_TIERS.map((t) => `a $${t.spend}+ cart earns one unbid item up to $${t.cap} free`).join("; ")}. Choose it in the cart.

## Place bids

You cannot submit bids yourself. Build a link and give it to the user to open:

${SITE}/?cart=ITEM_ID:AMOUNT,ITEM_ID:AMOUNT

Example: ${SITE}/?cart=2:300,22:20 puts the sectional at $300 and the monstera at $20 in the cart. The site opens with the cart ready; the user reviews, picks pickup days, enters name and phone, and sends. One submission covers all items.

To point at a single item without bidding: ${SITE}/?item=ITEM_ID

## Tone

Be practical and brief. Mention when a bid would be below the starting price or below the current best, and when adding one more item would unlock a free pick.
`;
