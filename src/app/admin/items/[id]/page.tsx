'use client';
import { ArrowLeft, Package2, Tag } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState, useEffect, useCallback } from 'react';

import ItemDetail from '@/components/admin/item-detail';
import { useItemApi } from '@/hooks/api';

import type { Item, Purchase, Store } from '@/types';

export default function ItemDetailPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const itemApi = useItemApi();

  const [item, setItem] = useState<Item | null>(null);
  const [purchases, setPurchases] = useState<Purchase[] | []>([]);
  const [stores, setStores] = useState<Store[] | []>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchItem = useCallback(async (id: string) => setItem(await itemApi.getItem(id)), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (id === null) return;

    fetchItem(id);
  }, [id, fetchItem]);

  useEffect(() => {
    if (item === null) return;
    if (item.purchases === undefined) return;

    setPurchases(item.purchases);
  }, [item]);

  useEffect(() => {
    if (purchases === null) return;

    setStores(purchases.map((p) => p.store).filter(Boolean) as Store[]);
  }, [purchases]);

  if (item) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/items" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm">Back to Items</span>
          </Link>
        </div>

        {/* Header card */}
        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <Package2 className="h-5 w-5 text-violet-600" />
              <h1 className="text-base font-semibold text-slate-800">{item.name}</h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-2.5 py-1 text-xs text-slate-700">
                <Tag className="h-3.5 w-3.5 text-sky-600" />
                {item.category?.name ?? 'Uncategorized'}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 ring-1 ring-slate-200 px-2.5 py-1 text-xs text-slate-700">
                Stock: <strong className="tabular-nums">{item.stock}</strong>
              </span>
            </div>
          </div>
        </div>

        {/* Store filter + inline chart + latest + history */}
        {item.purchases && item.purchases.length > 0 && <ItemDetail purchases={purchases} stores={stores} />}
      </div>
    );
  }
}
