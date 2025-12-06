"use client";

interface ScanlineOverlayProps {
  opacity?: number;
}

export function ScanlineOverlay({ opacity = 0.03 }: ScanlineOverlayProps) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-50"
      style={{
        opacity,
        backgroundImage: `repeating-linear-gradient(
          0deg,
          transparent,
          transparent 2px,
          rgba(0, 0, 0, 0.3) 2px,
          rgba(0, 0, 0, 0.3) 4px
        )`,
      }}
      aria-hidden="true"
    />
  );
}
