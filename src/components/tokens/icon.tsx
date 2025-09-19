"use client";

import React, { forwardRef } from "react";
import { Tag, Store as LucideStore, Box, Receipt, type LucideIcon, type LucideProps } from "lucide-react";

const cn = (...a: Array<string | undefined | null | false>) =>
  a.filter(Boolean).join(" ");

export const Item: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <Box ref={ref} {...props} className={cn("h-5 w-5 text-violet-600", className)} />
  )
);

export const Purchase: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <Receipt ref={ref} {...props} className={cn("h-5 w-5 text-sky-700", className)} />
  )
);

export const Category: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <Tag ref={ref} {...props} className={cn("h-5 w-5 text-sky-600", className)} />
  )
);

export const Store: LucideIcon = forwardRef<SVGSVGElement, LucideProps>(
  ({ className, ...props }, ref) => (
    <LucideStore ref={ref} {...props} className={cn("h-5 w-5 text-emerald-600", className)} />
  )
);

Item.displayName = "ItemIcon";
Purchase.displayName = "PurchaseIcon";
Category.displayName = "CategoryIcon";
Store.displayName = "StoreIcon";

export const Icon = {
  Item, Purchase, Category, Store
}
