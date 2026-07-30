"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode, RefObject } from "react";
import { useMagnetic } from "@/hooks/use-magnetic";
import { cn } from "@/lib/utils";

type CommonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary";
  className?: string;
};

type ButtonProps = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: undefined };

type LinkProps = CommonProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

const base =
  "relative inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium transition-colors duration-300 disabled:pointer-events-none disabled:opacity-50";

const variants = {
  primary: "text-white",
  secondary: "border",
};

function variantStyle(variant: "primary" | "secondary") {
  if (variant === "primary") {
    return { backgroundColor: "var(--color-accent)" };
  }
  return { borderColor: "var(--color-border)", color: "var(--color-ink)" };
}

/**
 * Button/link with a magnetic hover pull. Renders an <a> when `href` is
 * given, otherwise a <button>, so it can serve both CTA and nav roles.
 */
export function MagneticButton({ children, variant = "primary", className, href, ...rest }: ButtonProps | LinkProps) {
  const ref = useMagnetic<HTMLAnchorElement | HTMLButtonElement>({ strength: 0.3 });

  if (href) {
    return (
      <a
        ref={ref as RefObject<HTMLAnchorElement>}
        href={href}
        data-cursor="pointer"
        className={cn(base, variants[variant], className)}
        style={variantStyle(variant)}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={ref as RefObject<HTMLButtonElement>}
      data-cursor="pointer"
      className={cn(base, variants[variant], className)}
      style={variantStyle(variant)}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
