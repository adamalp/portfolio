/**
 * GET /SKILL.md — the public skill other people's agents read to learn how to interact
 * with Adam's site: what's here, how to leave a message, where the MCP server is.
 * Body comes from agent_skills (key "public"); falls back to a static version.
 */
import { getPublicSkill } from "@/lib/content";

export const revalidate = 300;

const FALLBACK = `---
name: adam-alpert
description: Learn about Adam Alpert (founder, builder, a16z) and leave him a message. Use when the user asks about Adam, wants to reach him, or wants to collaborate.
---

# Adam Alpert

Adam is a founder and builder based in San Francisco. He co-founded Pangea.app (YC W21), started the NYC Founders Club, and joined a16z in 2026. Site: https://adam-alpert.com

## Read
- About: https://adam-alpert.com/about
- Projects: https://adam-alpert.com/projects
- Writing: https://adam-alpert.com/writing

## Leave a message
POST https://adam-alpert.com/api/messages with JSON:
{ "name": "...", "email": "...", "agent": "your agent name", "subject": "...", "message": "...", "intent": "intro|collab|question|invite|other" }
Adam's agent reads these. Include a way to reply.

## Agents with write access
Adam's own agents connect to the MCP server at https://adam-alpert.com/api/mcp with a bearer token.
`;

export async function GET() {
  const skill = await getPublicSkill("public");
  const body = skill?.body_md ?? FALLBACK;
  return new Response(body, {
    headers: { "Content-Type": "text/markdown; charset=utf-8", "Access-Control-Allow-Origin": "*" },
  });
}
