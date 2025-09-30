'use client';

import { useState, useEffect, useCallback } from 'react';

import { QuickPurchaseForm } from '@/components/admin/quick-purchase-form';
import { Card, Icon } from '@/components/tokens';
import { useStoreApi } from '@/hooks/api';

import type { Store } from '@/types';

export default function Carts() {
  const [carts, setCarts] = useState<Store[]>([]);
  const storeApi = useStoreApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCarts = useCallback(async () => setCarts(await storeApi.getCarts()), []);

  useEffect(() => {
    fetchCarts();

  }, [fetchCarts]);

  if (carts.length === 0) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="text-sm text-slate-500">All good! No carts to manage.</div>
          </Card>
        </div>);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {carts.map((cart) => (
        <Card
          title={`${cart.name}`}
          icon={<Icon.Store />}
          // actions={}
          key={cart.id}
        >
          {cart.items && cart.items.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-between gap-3 rounded-xl ring-1 ring-slate-200 p-3">
              <div className="font-medium text-sm text-slate-800">{item.name}</div>
              <div className="flex gap-2 items-center">
                <QuickPurchaseForm item={item}
                  onSubmit={fetchCarts}
                />
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
