"use client";

import { useMemo, useState } from "react";
import PriceSparkline from "@/components/price-spark-line";
import { LineChart } from "lucide-react";
import { formatDateForDisplay } from "@/lib/date-utils";
import { formatCurrency, pricePerUnit } from "@/lib/currency-utils";
import type { Purchase, PurchaseWithRelations, Store } from "@/types";
import { Icon } from "../tokens";

function latestByStore(purchases: Purchase[] | PurchaseWithRelations[]) {
  const map = new Map<string, Purchase | PurchaseWithRelations>();
  for (const p of purchases) {
    const k = p.storeId ?? "__none__";
    const time = new Date(p.dateBought ?? p.createdAt).getTime();
    const prev = map.get(k);
    const prevTime = prev ? new Date(prev.dateBought ?? prev.createdAt).getTime() : -Infinity;
    if (!prev || time > prevTime) map.set(k, p);
  }
  return Array.from(map.values());
}

export default function ItemDetail({
  purchases,
  stores,
}: {
  purchases: Purchase[] | PurchaseWithRelations[];
  stores: Store[] | [];
}) {
  const [storeFilter, setStoreFilter] = useState<string>("all");

  const storeOptions = useMemo(
    () => [{ id: "all", name: "All stores" }, ...stores],
    [stores]
  );

  const filtered = useMemo(
    () => purchases.filter((p) => (storeFilter === "all" ? true : p.storeId === storeFilter)),
    [purchases, storeFilter]
  );

  const sparkPoints = useMemo(() => {
    const seq = [...filtered].sort((a, b) => {
      const ta = new Date(a.dateBought ?? a.createdAt).getTime();
      const tb = new Date(b.dateBought ?? b.createdAt).getTime();
      return ta - tb;
    });
    return seq.map(pricePerUnit);
  }, [filtered]);

  const latest = useMemo(() => {
    const all = latestByStore(purchases);
    return storeFilter === "all" ? all : all.filter((p) => p.storeId === storeFilter);
  }, [purchases, storeFilter]);

  return (
    <div className="space-y-6">
      {/* Price over time + Filter */}
      <div className="rounded-2xl bg-white ring-1 ring-slate-200">
        <div className="flex items-center justify-between gap-4 px-5 py-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <LineChart className="h-4 w-4 text-sky-600" />
            <h3 className="text-sm font-semibold text-slate-700">Price over time</h3>
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-slate-500">Store</label>
            <select
              value={storeFilter}
              onChange={(e) => setStoreFilter(e.target.value)}
              className="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            >
              {storeOptions.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-5">
          <PriceSparkline points={sparkPoints} className="text-sky-600" />
          <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
            <span>
              Points: <b>{sparkPoints.length}</b>
            </span>
            {sparkPoints.length > 0 && (
              <>
                <span>
                  Min: <b>{formatCurrency(Math.min(...filtered.map((p) => p.price)))}</b>
                </span>
                <span>
                  Max: <b>{formatCurrency(Math.max(...filtered.map((p) => p.price)))}</b>
                </span>
                <span>
                  Last:{" "}
                  <b>
                    {formatCurrency(filtered[filtered.length - 1].price)} (
                    {formatCurrency(pricePerUnit(filtered[filtered.length - 1]))}/
                    {filtered[filtered.length - 1].unit})
                  </b>
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Latest by Store (respects filter) */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Icon.Store />
          <h2 className="text-sm font-semibold text-slate-700">Latest by Store</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {latest.map((purchase) => (
            <div key={purchase.storeId ?? "none"} className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon.Purchase />
                  <p className="text-sm font-medium text-slate-800">
                    {purchase.store?.name ?? "—"}
                  </p>
                </div>
                <p className="text-sm text-slate-500">{formatDateForDisplay(purchase.dateBought)}</p>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-slate-500">Brand</p>
                  <p className="font-medium text-slate-800">{purchase.brand || "—"}</p>
                </div>
                <div>
                  <p className="text-slate-500">Unit</p>
                  <p className="font-medium text-slate-800">
                    {purchase.amount} {purchase.unit}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">Quantity</p>
                  <p className="font-medium text-slate-800">{purchase.quantity}</p>
                </div>
                <div>
                  <p className="text-slate-500">Price</p>
                  <p className="font-semibold text-slate-900">
                    {formatCurrency(purchase.price)}
                    <span className="ml-1 text-xs text-slate-500">
                      ({formatCurrency(pricePerUnit(purchase))}/{purchase.unit})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
          {latest.length === 0 && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 text-sm text-slate-500">
              No purchases yet.
            </div>
          )}
        </div>
      </section>

      {/* Purchase History (respects filter) */}
      <section className="space-y-3">
        <div className="overflow-hidden rounded-xl ring-1 ring-slate-200 bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Store</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Brand</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Unit</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Qty</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Price</th>
                <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">$/Unit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {[...filtered]
                .sort((a, b) => {
                  const ta = new Date(a.dateBought ?? a.createdAt).getTime();
                  const tb = new Date(b.dateBought ?? b.createdAt).getTime();
                  return tb - ta;
                })
                .map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/60">
                    <td className="px-4 py-2 text-sm text-slate-700">{formatDateForDisplay(p.dateBought ?? p.createdAt)}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{p.store?.name ?? "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{p.brand || "—"}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">
                      {p.amount} {p.unit}
                    </td>
                    <td className="px-4 py-2 text-sm tabular-nums">{p.quantity}</td>
                    <td className="px-4 py-2 text-sm tabular-nums">{formatCurrency(p.price)}</td>
                    <td className="px-4 py-2 text-sm tabular-nums">
                      {formatCurrency(pricePerUnit(p))}/{p.unit}
                    </td>
                  </tr>
                ))}
              {filtered.length === 0 && (
                <tr>
                  <td className="px-4 py-6 text-sm text-slate-500" colSpan={7}>
                    No purchases for this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
