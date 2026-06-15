import Link from "next/link";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
};

const variants = {
  primary:
    "bg-terracotta text-white hover:bg-terracotta-dark active:scale-[0.98] shadow-md shadow-terracotta/20",
  secondary:
    "bg-forest text-white hover:bg-forest-light active:scale-[0.98] shadow-md shadow-forest/20",
  outline:
    "border-2 border-terracotta text-terracotta hover:bg-terracotta/5 active:scale-[0.98]",
  ghost: "text-terracotta hover:bg-terracotta/5 active:scale-[0.98]",
  danger: "bg-coral text-white active:scale-[0.98]",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm rounded-lg",
  md: "px-5 py-2.5 text-base rounded-xl",
  lg: "px-6 py-3.5 text-lg rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

type LinkButtonProps = {
  href: string;
  variant?: ButtonProps["variant"];
  size?: ButtonProps["size"];
  fullWidth?: boolean;
  className?: string;
  children: React.ReactNode;
};

export function LinkButton({
  href,
  variant = "primary",
  size = "md",
  fullWidth,
  className = "",
  children,
}: LinkButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition-all ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {children}
    </Link>
  );
}

export function Card({
  children,
  className = "",
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-terracotta/10 bg-white p-4 shadow-sm ${hover ? "transition-shadow hover:shadow-md" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export function ContentBadge({ validated }: { validated: boolean }) {
  if (validated) return null;
  return (
    <span className="inline-flex items-center rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-earth-muted">
      Borrador
    </span>
  );
}
