import React from "react";
import type { ButtonHTMLAttributes, FC } from "react";
import { Trash2, Pencil, Eye, ShoppingCart, CircleOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type BaaseProps = {
  variant?: "primary"|"ghost"|"outline"|"danger",
  size?: "btn-sm"|"btn-md"|"btn-lg",
    ariaLabel?: string
}

type ButtonType = ButtonHTMLAttributes<HTMLButtonElement> & BaaseProps

export const Button: FC<ButtonType> = ({ className = "", variant = "primary", size = "btn-md", ...props }) => {
  const base = "cursor-pointer inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "text-slate-700 hover:bg-slate-100",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  const sizes: Record<string, string> = {
    "btn-sm": "",
    "btn-md": "px-3.5 py-2",
    "btn-lg": "px-4 py-2.5",
  }
  return <button className={`${base} ${styles[variant]} ${sizes[size]} ${className}`} {...props} />;
};

const IconButtonBase: FC<ButtonType & {IconComponent: LucideIcon}> = ({ IconComponent = Eye, size = "btn-md", ariaLabel = "IconButton", ...props }) => {
  const sizes: Record<string, string> = {
    "btn-sm": "h-2 w-2",
    "btn-md": "h-4 w-4",
    "btn-lg": "h-6 w-6",
  }
  return (
    <Button variant={props.variant} size={size} onClick={props.onClick} aria-label={ariaLabel}>
      <IconComponent className={sizes[size]} />
    </Button>
  )
};

const View: FC<ButtonType> = ({ ariaLabel = "View", ...props }) => (
  <IconButtonBase IconComponent={Eye} variant="outline" ariaLabel={ariaLabel} {...props} />
)

const Edit: FC<ButtonType> = ({ ariaLabel = "Edit", ...props }) => (
  <IconButtonBase IconComponent={Pencil} variant="outline" ariaLabel={ariaLabel} {...props} />
)

const Delete: FC<ButtonType> = ({ ariaLabel = "Delete", ...props }) => (
  <IconButtonBase IconComponent={Trash2} variant="danger" ariaLabel={ariaLabel} {...props} />
)

const Shop: FC<ButtonType> = ({ ariaLabel = "Shop", ...props }) => (
  <IconButtonBase IconComponent={ShoppingCart} ariaLabel={ariaLabel} {...props} />
)

const Cancel: FC<ButtonType> = ({ ariaLabel = "View", ...props }) => (
  <IconButtonBase IconComponent={CircleOff} variant="outline" ariaLabel={ariaLabel} {...props} />
)

export const IconButton = { View, Edit, Delete, Shop, Cancel }

