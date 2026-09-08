import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE = "sale_admin";

function secret() {
  const s = process.env.ADMIN_PASSCODE;
  if (!s) throw new Error("ADMIN_PASSCODE must be set");
  return s;
}
function token() {
  return createHmac("sha256", secret()).update("admin-session-v1").digest("hex");
}

export function isAdmin(): boolean {
  const c = cookies().get(COOKIE)?.value;
  if (!c) return false;
  const a = Buffer.from(c), b = Buffer.from(token());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function checkPasscode(p: string): boolean {
  const a = Buffer.from(p), b = Buffer.from(secret());
  return a.length === b.length && timingSafeEqual(a, b);
}

export function adminCookie() {
  return { name: COOKIE, value: token(), httpOnly: true, sameSite: "lax" as const, secure: true, path: "/", maxAge: 60 * 60 * 24 * 30 };
}
