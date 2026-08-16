import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ArrowRightIcon } from "./icons";

/** A page section with a mono eyebrow label and optional trailing link. */
export function Section({
  id,
  label,
  title,
  action,
  children,
  className,
}: {
  id?: string;
  label?: string;
  title?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn("py-14 sm:py-20", className)}>
      {(label || title || action) && (
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            {label && (
              <p className="text-faint mb-2 font-mono text-xs tracking-wider uppercase">{label}</p>
            )}
            {title && <h2 className="text-2xl sm:text-3xl">{title}</h2>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

export function Tag({
  children,
  className,
  size = "md",
}: {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md";
}) {
  return (
    <span
      className={cn(
        "border-border bg-bg-subtle text-muted inline-flex items-center rounded-md border font-mono",
        size === "sm" ? "px-1.5 py-0.5 text-[11px]" : "px-2 py-1 text-xs",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function TagList({ items, limit }: { items: string[]; limit?: number }) {
  const shown = limit ? items.slice(0, limit) : items;
  const rest = limit ? items.length - shown.length : 0;

  return (
    <ul className="flex flex-wrap gap-1.5">
      {shown.map((item) => (
        <li key={item}>
          <Tag size="sm">{item}</Tag>
        </li>
      ))}
      {rest > 0 && (
        <li>
          <Tag size="sm" className="text-faint">
            +{rest}
          </Tag>
        </li>
      )}
    </ul>
  );
}

const buttonBase =
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 disabled:pointer-events-none disabled:opacity-50";

const buttonVariants = {
  primary: "bg-accent text-accent-fg hover:bg-accent-hover",
  secondary: "border border-border bg-surface text-text hover:bg-surface-hover",
  ghost: "text-muted hover:text-text hover:bg-surface-hover",
} as const;

const buttonSizes = {
  sm: "h-8 px-3",
  md: "h-10 px-4",
} as const;

export type ButtonVariant = keyof typeof buttonVariants;

export function buttonClass(
  variant: ButtonVariant = "primary",
  size: keyof typeof buttonSizes = "md",
  className?: string,
) {
  return cn(buttonBase, buttonVariants[variant], buttonSizes[size], className);
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<"button"> & { variant?: ButtonVariant; size?: "sm" | "md" }) {
  return <button className={buttonClass(variant, size, className)} {...props} />;
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ComponentProps<typeof Link> & { variant?: ButtonVariant; size?: "sm" | "md" }) {
  return <Link className={buttonClass(variant, size, className)} {...props} />;
}

/** Text link with an arrow that nudges on hover. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "text-muted hover:text-text group inline-flex items-center gap-1.5 font-mono text-sm transition-colors",
        className,
      )}
    >
      {children}
      <ArrowRightIcon className="size-3.5 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

/** Page-level heading block used by every non-home route. */
export function PageHeader({
  title,
  description,
  label,
}: {
  title: string;
  description?: string;
  label?: string;
}) {
  return (
    <header className="pt-12 pb-8 sm:pt-20 sm:pb-12">
      {label && (
        <p className="text-faint mb-3 font-mono text-xs tracking-wider uppercase">{label}</p>
      )}
      <h1 className="text-3xl sm:text-4xl">{title}</h1>
      {description && (
        <p className="text-muted mt-4 max-w-2xl text-base leading-relaxed">{description}</p>
      )}
    </header>
  );
}
