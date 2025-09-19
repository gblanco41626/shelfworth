"use client"

import React from "react";
import NavShell from "@/components/nav-shell";
import { Icon } from "@/components/tokens";
import type { SubTab } from "@/components/subtab-bar";

const tabs: SubTab[] = [
  { href: "/admin/items", label: "Items", icon: Icon.Item},
  { href: "/admin/purchases", label: "Purchases", icon: Icon.Purchase },
  { href: "/admin/categories", label: "Categories", icon: Icon.Category },
  { href: "/admin/stores", label: "Stores", icon: Icon.Store }
]

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavShell subTabs={tabs}>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {children}
      </section>
    </NavShell>
  );
}
