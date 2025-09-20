import React from "react";
import type { ButtonHTMLAttributes, FC } from "react";
import { Trash2, Pencil, Eye } from "lucide-react";

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost"|"outline"|"danger" }> = ({ className = "", variant = "primary", ...props }) => {
  const base = "cursor-pointer inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400 disabled:opacity-50 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "bg-sky-600 text-white hover:bg-sky-700",
    ghost: "text-slate-700 hover:bg-slate-100",
    outline: "border border-slate-300 text-slate-700 hover:bg-slate-50",
    danger: "bg-rose-600 text-white hover:bg-rose-700",
  };
  return <button className={`${base} ${styles[variant]} ${className}`} {...props} />;
};

const View:  FC<ButtonHTMLAttributes<HTMLButtonElement> & {ariaLabel?: string}> = ({ ariaLabel = "EViewdit", ...props }) => (
  <Button variant="outline" onClick={props.onClick} aria-label={ariaLabel}>
    <Pencil className="h-4 w-4" />
  </Button>
);

const Edit: FC<ButtonHTMLAttributes<HTMLButtonElement> & {ariaLabel?: string}> = ({ ariaLabel = "Edit", ...props }) => (
  <Button variant="outline" onClick={props.onClick} aria-label={ariaLabel}>
    <Eye className="h-4 w-4" />
  </Button>
);

const Delete: FC<ButtonHTMLAttributes<HTMLButtonElement> & {ariaLabel?: string}> = ({ ariaLabel = "Delete", ...props }) => (
  <Button variant="danger" onClick={props.onClick} aria-label={ariaLabel}>
    <Trash2 className="h-4 w-4" />
  </Button>
);

export const IconButton = { View, Edit, Delete }

