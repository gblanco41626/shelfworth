"use client"

import React, { useState } from "react";
import Items from "@/components/admin/Items";
import Categories from "@/components/admin/Categories";
import Stores from "@/components/admin/Stores";

type TabKey = 'items' | 'purchases' | 'categories' | 'stores';

const tabs: { key: TabKey; label: string }[] = [
  { key: "items", label: "Items" },
  { key: "purchases", label: "Purchases" },
  { key: "categories", label: "Categories" },
  { key: "stores", label: "Stores" }
]

export default function PageShell()  {
  const [tab, setTab] = useState<TabKey>('items');

  return (
    <div className="min-h-svh bg-slate-50/80">
      {/* Topbar */}
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex gap-4 border-t border-slate-100">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`-mb-px px-4 py-3 text-sm font-medium ${
                tab === t.key ? "text-sky-700 border-b-2 border-sky-600" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {tab == 'items' && <Items />}
        {tab == 'categories' && <Categories />}
        {tab == 'stores' && <Stores />}
      </section>
    </div>
  );
}
