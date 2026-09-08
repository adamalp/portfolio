import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { z } from "zod";
import { zodOutputFormat } from "@anthropic-ai/sdk/helpers/zod";
import { publicItems } from "@/lib/db";
import { FREE_MIN_SPEND, FREE_UNDER } from "@/lib/deals";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const Picks = z.object({
  picks: z.array(z.object({
    item_id: z.number().int(),
    amount: z.number().int(),
    why: z.string(),
  })),
  note: z.string(),
});

/** Public: turn "I'm looking for..." into a suggested cart. */
export async function POST(req: Request) {
  if (!process.env.ANTHROPIC_API_KEY) return NextResponse.json({ error: "Picker is not configured." }, { status: 503 });
  const body = await req.json().catch(() => ({}));
  const query = String(body.query ?? "").trim().slice(0, 600);
  if (query.length < 3) return NextResponse.json({ error: "Tell me a bit more about what you need." }, { status: 400 });

  const items = (await publicItems()).filter((i) => i.status !== "Sold");
  const catalog = items
    .map((i) => `#${i.id} | ${i.name} | ${i.category} | starting $${i.asking_price ?? "?"} | current best ${i.best_offer ? "$" + i.best_offer : "none"} | ${i.dimensions || "-"} | ${i.description}`)
    .join("\n");

  const client = new Anthropic();
  const response = await client.messages.parse({
    // Sonnet 5 with thinking off: a 60-item catalog does not need deep reasoning, and shoppers are waiting on the button.
    model: "claude-sonnet-5",
    max_tokens: 1500,
    thinking: { type: "disabled" },
    output_config: { effort: "low", format: zodOutputFormat(Picks) },
    system: [{ type: "text", cache_control: { type: "ephemeral" }, text: [
      "You help shoppers at a friendly apartment moving sale build a cart. The seller wants everything to find a home.",
      "Given the shopper's request and the catalog, choose the items that fit. Be generous with useful adjacent items only when the request is broad (e.g. 'furnish a studio'); be precise when it is specific.",
      `For each pick suggest a bid amount: at least the starting price, and if there is a current best bid, at least $5 above it. Round to whole dollars. Items starting at $${FREE_UNDER} or less are free when the rest of the cart totals $${FREE_MIN_SPEND} or more, so feel free to add small useful ones at their starting price.`,
      "If the shopper gives a budget, keep the total of your suggested bids within it, prioritising what they asked for first.",
      "Write a 'why' of at most 12 words per pick, and a 'note' of at most two friendly sentences summarising the cart. Only use item ids from the catalog. If nothing fits, return no picks and explain in the note.",
      "",
      "Catalog (id | name | category | starting price | current best bid | dimensions | description):",
      catalog,
    ].join("\n") }],
    messages: [{ role: "user", content: query }],
  });

  if (response.stop_reason === "refusal" || !response.parsed_output) {
    return NextResponse.json({ error: "I couldn't put a cart together for that. Try describing the room or the items." }, { status: 422 });
  }
  const valid = new Map(items.map((i) => [i.id, i]));
  const picks = response.parsed_output.picks
    .filter((p) => valid.has(p.item_id))
    .map((p) => {
      const it = valid.get(p.item_id)!;
      const floor = Math.max(it.asking_price ?? 1, it.best_offer ? it.best_offer + 5 : 0, 1);
      return { item_id: p.item_id, amount: Math.max(Math.round(p.amount), floor), why: p.why.slice(0, 120) };
    });
  return NextResponse.json({ picks, note: response.parsed_output.note.slice(0, 400) });
}
