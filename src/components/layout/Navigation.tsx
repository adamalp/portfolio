"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/siteMap";

export function Navigation() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [clock, setClock] = useState<string>("");

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const hh = String(d.getHours()).padStart(2, "0");
      const mm = String(d.getMinutes()).padStart(2, "0");
      setClock(`Cambridge · ${hh}:${mm}`);
    };
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 border-b"
      style={{
        height: 64,
        background: "color-mix(in oklab, var(--ink) 80%, transparent)",
        backdropFilter: "blur(14px) saturate(140%)",
        WebkitBackdropFilter: "blur(14px) saturate(140%)",
        borderBottomColor: "var(--line)",
      }}
    >
      <nav
        className="h-full mx-auto flex items-center justify-between"
        style={{ maxWidth: "var(--max)", padding: "0 var(--gutter)" }}
      >
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 font-mono text-[13px]"
          style={{ letterSpacing: "0.04em" }}
        >
          <span
            className="grid place-items-center"
            style={{
              width: 26,
              height: 26,
              border: "1px solid var(--paper-dim)",
              fontFamily: "var(--font-serif)",
              fontStyle: "italic",
              fontSize: 17,
              lineHeight: 1,
              color: "var(--paper)",
            }}
          >
            A
          </span>
          <span style={{ color: "var(--paper)" }}>Adam Alpert</span>
          <span className="hidden sm:inline" style={{ color: "var(--mute)", marginLeft: 4 }}>
            / portfolio
          </span>
        </Link>

        {/* Desktop links */}
        <ul
          className="hidden md:flex items-center font-mono"
          style={{ gap: 4, fontSize: 12, letterSpacing: "0.04em" }}
        >
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full transition-colors"
                  style={{
                    color: active ? "var(--paper)" : "var(--mute)",
                  }}
                >
                  {active && (
                    <span
                      style={{
                        width: 4,
                        height: 4,
                        borderRadius: "50%",
                        background: "var(--ember)",
                      }}
                    />
                  )}
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: clock + CTA + mobile menu */}
        <div className="flex items-center" style={{ gap: 14 }}>
          <span
            className="hidden lg:inline font-mono"
            style={{ fontSize: 11, color: "var(--mute)", letterSpacing: "0.04em" }}
          >
            {clock || "— · —"}
          </span>
          <Link
            href="/contact"
            className="hidden md:inline-flex items-center gap-2 font-mono"
            style={{
              padding: "8px 14px 8px 18px",
              border: "1px solid var(--line-2)",
              borderRadius: 999,
              fontSize: 12,
              color: "var(--paper)",
              transition: "border-color .25s, background .25s",
            }}
          >
            Work with me <span aria-hidden>↗</span>
          </Link>

          <button
            className="md:hidden p-2"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            style={{ color: "var(--paper)" }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t"
          style={{
            borderTopColor: "var(--line)",
            background: "var(--ink)",
            padding: "16px var(--gutter)",
          }}
        >
          <ul className="flex flex-col gap-1 font-mono" style={{ fontSize: 13 }}>
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="block px-3 py-2 rounded transition-colors"
                  style={{
                    color: isActive(item.href) ? "var(--paper)" : "var(--mute)",
                  }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}
