"use client";

import { useState } from "react";

interface GlitchTextProps {
  children: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "h4" | "span" | "p";
}

export function GlitchText({
  children,
  className = "",
  as: Component = "span",
}: GlitchTextProps) {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <Component
      className={`relative inline-block ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <span className="relative z-10">{children}</span>
      {isHovering && (
        <>
          <span
            className="absolute inset-0 text-primary opacity-80 animate-glitch-1"
            style={{ clipPath: "inset(40% 0 20% 0)" }}
            aria-hidden="true"
          >
            {children}
          </span>
          <span
            className="absolute inset-0 text-accent opacity-80 animate-glitch-2"
            style={{ clipPath: "inset(20% 0 60% 0)" }}
            aria-hidden="true"
          >
            {children}
          </span>
        </>
      )}
      <style jsx>{`
        @keyframes glitch-1 {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(-2px, 2px);
          }
          40% {
            transform: translate(-2px, -2px);
          }
          60% {
            transform: translate(2px, 2px);
          }
          80% {
            transform: translate(2px, -2px);
          }
        }
        @keyframes glitch-2 {
          0%,
          100% {
            transform: translate(0);
          }
          20% {
            transform: translate(2px, -2px);
          }
          40% {
            transform: translate(2px, 2px);
          }
          60% {
            transform: translate(-2px, -2px);
          }
          80% {
            transform: translate(-2px, 2px);
          }
        }
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.3s infinite;
        }
      `}</style>
    </Component>
  );
}
