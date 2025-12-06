import Link from "next/link";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  external?: boolean;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  external = false,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-primary hover:bg-primary/90 border-primary",
    secondary:
      "bg-transparent text-primary border-primary hover:bg-primary/10",
    ghost:
      "bg-transparent text-text border-border hover:border-muted hover:text-primary",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
  };

  const baseStyles = `
    inline-flex items-center justify-center gap-2
    font-mono font-semibold
    border rounded
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background
  `;

  const combinedClassName = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  // Force dark text color for primary variant
  const style = variant === "primary" ? { color: "#000000" } : undefined;

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={combinedClassName}
          style={style}
        >
          {children}
        </a>
      );
    }
    return (
      <Link href={href} className={combinedClassName} style={style}>
        {children}
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={combinedClassName} style={style}>
      {children}
    </button>
  );
}
