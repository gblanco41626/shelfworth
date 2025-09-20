"use client"

import React from "react";
import NavShell from "@/components/nav-shell";

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <NavShell>
      <section className="mx-auto max-w-7xl py-8 space-y-6">
        {children}
      </section>
    </NavShell>
  );
}
