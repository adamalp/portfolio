"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "@/lib/siteMap";

export function Navigation() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="font-mono text-lg font-bold text-primary hover:text-secondary transition-colors"
          >
            Adam Alpert
          </Link>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            <ul className="hidden md:flex items-center gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      px-3 py-2 text-sm font-mono rounded transition-colors
                      ${
                        isActive(item.href)
                          ? "text-primary bg-primary/10"
                          : "text-muted hover:text-text hover:bg-surface"
                      }
                    `}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <Link
              href="/contact"
              className="ml-4 px-4 py-2 text-sm font-mono font-semibold bg-primary rounded hover:bg-primary/90 transition-colors"
              style={{ color: "#000000" }}
            >
              Work with me
            </Link>
          </div>

          {/* Mobile menu button - simplified for now */}
          <button className="md:hidden p-2 text-muted hover:text-text">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </nav>
    </header>
  );
}
