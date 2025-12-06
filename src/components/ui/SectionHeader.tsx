interface SectionHeaderProps {
  children: string;
  subtitle?: string;
  className?: string;
}

export function SectionHeader({
  children,
  subtitle,
  className = "",
}: SectionHeaderProps) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl md:text-3xl font-mono text-text">
        <span className="text-muted">[</span>
        <span className="text-primary">{children}</span>
        <span className="text-muted">]</span>
      </h2>
      {subtitle && (
        <p className="mt-2 text-muted font-mono text-sm">// {subtitle}</p>
      )}
    </div>
  );
}
