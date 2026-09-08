// Offer summary for Adam. Usage: node --env-file=.env.local scripts/summary.mjs [sinceISO]
const key = process.env.ADMIN_PASSCODE;
if (!key) { console.error("Set ADMIN_PASSCODE (use --env-file=.env.local)"); process.exit(1); }
const since = process.argv[2] || null;
const a = await (await fetch(`https://sale.adam-alpert.com/api/admin?key=${key}`, { cache: "no-store" })).json();
const open = [];
for (const i of a.items) for (const o of i.offers || []) if (o.status === "open")
  open.push({ id: i.id, item: i.name, start: +i.asking_price || 0, amount: +o.amount, buyer: o.buyer_name, contact: o.buyer_contact, note: (o.note || "").replace(/\n/g, " / "), at: o.created_at });
const byItem = {};
for (const o of open) (byItem[o.id] ??= { item: o.item, start: o.start, bids: [] }).bids.push(o);
const leaders = Object.values(byItem).map((v) => ({ ...v, top: v.bids.reduce((m, o) => (o.amount > m.amount ? o : m)) })).sort((x, y) => y.top.amount - x.top.amount);
const paidLeaders = leaders.filter((l) => l.top.amount > 0);
const sum = paidLeaders.reduce((s, l) => s + l.top.amount, 0);
const above = paidLeaders.filter((l) => l.top.amount >= l.start);
const unbid = a.items.filter((i) => i.status !== "Sold" && !byItem[i.id]);
console.log(`open bids: ${open.length} | buyers: ${new Set(open.map((o) => o.contact)).size} | items with a top bid: ${paidLeaders.length} (+${leaders.length - paidLeaders.length} free picks) of ${a.items.length}`);
console.log(`sum of top bids: $${sum} | at/above start: ${above.length} items worth $${above.reduce((s, l) => s + l.top.amount, 0)} | unbid starting value: $${unbid.reduce((s, i) => s + (+i.asking_price || 0), 0)} across ${unbid.length} items`);
console.log("\nTOP BIDS");
for (const l of leaders) console.log(`${l.item} | start $${l.start} | $${l.top.amount} ${l.top.buyer}${l.top.amount === 0 ? " (free pick)" : l.top.amount < l.start ? " (under start)" : ""} | ${l.bids.length} bid${l.bids.length > 1 ? "s" : ""}`);
const buyers = {};
for (const o of open) { const b = (buyers[o.contact] ??= { name: o.buyer, n: 0, sum: 0, pick: new Set() }); b.n++; b.sum += o.amount; const m = o.note.match(/Pickup: ([^/]+)/); if (m) b.pick.add(m[1].trim()); }
console.log("\nBUYERS");
for (const [c, b] of Object.entries(buyers).sort((x, y) => y[1].sum - x[1].sum)) console.log(`${b.name} | ${c} | ${b.n} bids | $${b.sum} | ${[...b.pick].join("; ") || "no pickup given"}`);
console.log("\nNO BIDS:", unbid.map((i) => `${i.name} ($${i.asking_price})`).join(" · "));
const qs = open.filter((o) => /\?/.test(o.note));
console.log("\nQUESTIONS:", qs.length ? qs.map((o) => `${o.buyer}: ${o.note}`).join(" || ") : "none");
if (since) { console.log(`\nNEW SINCE ${since}`); for (const o of open.filter((o) => o.at > since).sort((x, y) => x.at.localeCompare(y.at))) console.log(`${o.at.slice(11, 16)} | ${o.buyer} | ${o.contact} | ${o.item} | $${o.amount} | ${o.note}`); }
