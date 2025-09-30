'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { StoreForm } from '@/components/admin/store-form';
import { Card, Table, IconButton, Icon } from '@/components/tokens';
import { useStoreApi } from '@/hooks/api';

import type { Store } from '@/types';

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const storeApi = useStoreApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchStores = useCallback(async () => setStores(await storeApi.getStores()), []);

  const handleAddStore = async (data: Partial<Store>) => {
    await storeApi.createStore(data);
    fetchStores();
  };

  const handleUpdateStore = async (data: Partial<Store>) => {
    if (!editingStore) return;

    await storeApi.updateStore(editingStore.id, data);
    fetchStores();
    setEditingStore(null);
  };

  const handleDeleteStore = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure? This will also delete all purchases for this store.')) return;

    await storeApi.deleteStore(id);
    fetchStores();
  };

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingStore ? 'Edit Store' : 'New Store'} icon={<Icon.Store />}>
        <StoreForm
          onSubmit={editingStore ? handleUpdateStore : handleAddStore}
          onCancel={() => {
            setEditingStore(null);
          }}
          initialData={editingStore || undefined}
          isEditing={!!editingStore}
        />
      </Card>

      <Card title="Stores" icon={<Icon.Store />}>
        <Table columns={['Name', 'Actions']}>
          {stores.map((i) => (
            <tr key={i.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <IconButton.Edit onClick={() => setEditingStore(i)} />
                  <IconButton.Delete onClick={() => handleDeleteStore(i.id)} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
