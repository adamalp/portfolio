interface TerminalCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

export function TerminalCard({
  children,
  title = "terminal",
  className = "",
}: TerminalCardProps) {
  return (
    <div
      className={`bg-surface border border-border rounded-lg overflow-hidden ${className}`}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 bg-background border-b border-border">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent/80" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
          <div className="w-3 h-3 rounded-full bg-secondary/80" />
        </div>
        <span className="text-xs font-mono text-muted ml-2">{title}</span>
      </div>
      {/* Terminal content */}
      <div className="p-4 font-mono text-sm">{children}</div>
    </div>
  );
}
