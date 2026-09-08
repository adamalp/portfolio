import { skillText } from "@/lib/skillText";
export const dynamic = "force-static";
export function GET() {
  return new Response(skillText, { headers: { "Content-Type": "text/markdown; charset=utf-8", "Access-Control-Allow-Origin": "*" } });
}
