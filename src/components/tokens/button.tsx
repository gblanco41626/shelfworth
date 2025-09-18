/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { forwardRef } from "react";
import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import { Loader2 } from "lucide-react";

/**
 * Shelfworth UI – Button
 * Path: src/components/tokens/button.tsx
 *
 * Design goals
 * - Blue + cool earthy tones
 * - Accessible focus ring & contrast
 * - Variants + sizes + icon slots
 * - Loading state with spinner
 * - As <button> or <a> via `as` prop
 */

function cn(...classes: Array<string | undefined | false | null>) {
  return classes.filter(Boolean).join(" ");
}

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "subtle"
  | "outline"
  | "ghost"
  | "link"
  | "destructive";

export type ButtonSize = "sm" | "md" | "lg" | "icon";

interface BaseProps {
  children?: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  pill?: boolean;
  loading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

type ButtonAsButton = BaseProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    as?: "button";
  };

type ButtonAsAnchor = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "className"> & {
    as: "a";
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

const baseStyles =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap select-none font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:scale-[.98]";

const sizeStyles: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-sm",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
  icon: "h-10 w-10 p-0",
};

const radius = {
  default: "rounded-xl",
  pill: "rounded-full",
};

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-blue-600 text-white shadow-sm hover:bg-blue-700 focus-visible:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus-visible:ring-blue-300",
  secondary:
    "bg-slate-800 text-white shadow-sm hover:bg-slate-900 focus-visible:ring-slate-400 dark:bg-slate-700 dark:hover:bg-slate-800 dark:focus-visible:ring-slate-300",
  subtle:
    "bg-stone-100 text-slate-900 hover:bg-stone-200 focus-visible:ring-blue-300 dark:bg-stone-800 dark:text-stone-50 dark:hover:bg-stone-700",
  outline:
    "border border-slate-300 text-slate-900 hover:bg-slate-100 focus-visible:ring-blue-300 dark:border-slate-600 dark:text-slate-100 dark:hover:bg-slate-800",
  ghost:
    "text-slate-800 hover:bg-slate-100 focus-visible:ring-blue-300 dark:text-slate-100 dark:hover:bg-slate-800",
  link:
    "text-blue-700 underline-offset-4 hover:underline focus-visible:ring-blue-300 dark:text-blue-400",
  destructive:
    "bg-rose-600 text-white shadow-sm hover:bg-rose-700 focus-visible:ring-rose-300 dark:bg-rose-500 dark:hover:bg-rose-600 dark:focus-visible:ring-rose-300",
};

function contentWithIcons(
  leftIcon: ReactNode,
  children: ReactNode,
  rightIcon: ReactNode,
  loading?: boolean
) {
  return (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
      {!loading && leftIcon ? <span className="shrink-0">{leftIcon}</span> : null}
      {children ? <span className="truncate">{children}</span> : null}
      {!loading && rightIcon ? <span className="shrink-0">{rightIcon}</span> : null}
    </>
  );
}

export const Button = forwardRef<HTMLButtonElement & HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      as = "button",
      children,
      variant = "primary",
      size = "md",
      fullWidth,
      pill,
      loading,
      leftIcon,
      rightIcon,
      className,
      ...rest
    }: ButtonProps,
    ref
  ) {
    const Comp: any = as;

    const classes = cn(
      baseStyles,
      sizeStyles[size],
      variantStyles[variant],
      pill ? radius.pill : radius.default,
      fullWidth && "w-full",
      loading && "pointer-events-none opacity-90",
      className
    );

    const isAnchor = as === "a";
    const ariaProps = loading
      ? { "aria-busy": true, "aria-live": "polite" as const }
      : undefined;

    return (
      <Comp
        ref={ref as any}
        className={classes}
        {...(isAnchor ? { role: "button" } : null)}
        {...ariaProps}
        {...(rest as any)}
      >
        {contentWithIcons(leftIcon, children, rightIcon, loading)}
      </Comp>
    );
  }
) as any;

// Attach convenience variants to Button object
Button.Primary = (props: Omit<ButtonProps, "variant">) => <Button variant="primary" {...props} />;
Button.Primary.displayName = "Button.Primary";

Button.Secondary = (props: Omit<ButtonProps, "variant">) => <Button variant="secondary" {...props} />;
Button.Secondary.displayName = "Button.Secondary";

Button.Subtle = (props: Omit<ButtonProps, "variant">) => <Button variant="subtle" {...props} />;
Button.Subtle.displayName = "Button.Subtle";

Button.Outline = (props: Omit<ButtonProps, "variant">) => <Button variant="outline" {...props} />;
Button.Outline.displayName = "Button.Outline";

Button.Ghost = (props: Omit<ButtonProps, "variant">) => <Button variant="ghost" {...props} />;
Button.Ghost.displayName = "Button.Ghost";

Button.Link = (props: Omit<ButtonProps, "variant">) => <Button variant="link" {...props} />;
Button.Link.displayName = "Button.Link";

Button.Destructive = (props: Omit<ButtonProps, "variant">) => <Button variant="destructive" {...props} />;
Button.Destructive.displayName = "Button.Destructive";

// Usage:
// <Button.Primary>Add Item</Button.Primary>
// <Button.Outline>Cancel</Button.Outline>
// <Button.Link href="#">Learn more</Button.Link>
