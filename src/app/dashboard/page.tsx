'use client';

import { useState, useEffect, useCallback } from 'react';

import { Card, Icon, IconButton } from '@/components/tokens';
import { useItemApi, useStoreApi } from '@/hooks/api';

import type { Item, Store } from '@/types';

export default function HomePage() {
  const [outOfStock, setOutOfStock] = useState<Item[]>([]);
  const [shoppingList, setShoppingList] = useState<Item[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const itemApi = useItemApi();
  const storeApi = useStoreApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchOutOfStock = useCallback(async () => setOutOfStock(await itemApi.getOutOfStockItems()), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchShoppingList = useCallback(async () => setShoppingList(await itemApi.getShoppingList()), []);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchStores = useCallback(async () => setStores(await storeApi.getStores()), []);

  const refreshList = useCallback(() => {
    fetchShoppingList();
    fetchOutOfStock();
  }, [fetchOutOfStock, fetchShoppingList]);

  const addToShoppingList = async (id: string) => {
    await itemApi.addToShoppingList(id);
    refreshList();
  };

  const removeFromShoppingList = async (id: string) => (await itemApi.removeFromShoppingList(id));

  const addToStoreCart = async (id: string, storeId: string) => {
    await itemApi.addItemToStoreCart(id, storeId);
    refreshList();
  };

  useEffect(() => {
    refreshList();
    fetchStores();
  }, [refreshList, fetchStores]);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card
        title="Shopping List"
        icon={<Icon.Cart />}
        actions={<span className="text-xs text-slate-500">{shoppingList.length} items</span>}
      >
        {shoppingList.length === 0 ? (
          <div className="text-sm text-slate-500">Your shopping list is empty.</div>
        ) : (
          <ul className="space-y-3">
            {shoppingList.map((item) => (
                <li key={item.id} className="flex flex-col justify-between rounded-xl ring-1 ring-slate-200 p-3">
                  <div className='flex items-center justify-between gap-3'>
                    <p className="font-medium text-sm text-slate-800">{item.name}</p>
                    <div className="flex gap-2 items-center">
                      <select
                        className="rounded-lg border-slate-300 text-sm"
                        onChange={(e) => e.target.value && addToStoreCart(item.id, e.target.value)}
                        required
                      >
                        <option value="">Add to store...</option>
                        {stores.map((s) => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <IconButton.Delete onClick={() => removeFromShoppingList(item.id)} />
                    </div>
                  </div>
                  {
                    item.purchases?.[0] && item.purchases?.[0]?.store && <div className='text-xs'>{ item.purchases[0].store.name }</div>
                  }
                </li>
              ))}
          </ul>
        )}
      </Card>

      <Card
        title="Out of Stock"
        icon={<Icon.OutOfStock />}
        actions={<span className="text-xs text-slate-500">{outOfStock.length} items</span>}
      >
        {outOfStock?.length === 0 ? (
          <div className="text-sm text-slate-500">All good! No out-of-stock items.</div>
        ) : (
          <ul className="space-y-3">
            {outOfStock.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl ring-1 ring-slate-200 p-3">
                <p className="font-medium text-sm text-slate-800">{i.name}</p>
                <IconButton.Shop onClick={() => addToShoppingList(i.id)} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  );
}
