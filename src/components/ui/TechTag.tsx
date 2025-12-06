interface TechTagProps {
  children: string;
  variant?: "primary" | "secondary" | "muted";
}

export function TechTag({ children, variant = "primary" }: TechTagProps) {
  const variants = {
    primary: "border-primary/30 text-primary bg-primary/5",
    secondary: "border-secondary/30 text-secondary bg-secondary/5",
    muted: "border-muted/30 text-muted bg-muted/5",
  };

  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-mono border rounded ${variants[variant]}`}
    >
      {children}
    </span>
  );
}
