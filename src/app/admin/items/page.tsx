'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect, useMemo, useCallback } from 'react';

import { ItemForm } from '@/components/admin/item-form';
import { QuickPurchaseForm } from '@/components/admin/quick-purchase-form';
import { Card, Table, Icon, IconButton, Input } from '@/components/tokens';
import { useItemApi } from '@/hooks/api';

import type { Item } from '@/types';

export default function Items() {
  const [items, setItems] = useState<Item[]>([]);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [itemQuery, setItemQuery] = useState<string>('');
  const router = useRouter();
  const itemApi = useItemApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchItems = useCallback(async () => setItems(await itemApi.getItems()), []);

  // Item handlers
  const handleAddItem = async (data: Partial<Item>) => {
    const createdItem = await itemApi.createItem(data);
    setEditingItem(createdItem);
    fetchItems();
  };

  const handleUpdateItem = async (data: Partial<Item>) => {
    if (!editingItem) return;

    await itemApi.updateItem(editingItem.id, data);
    fetchItems();
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure? This will also delete all purchases for this item.')) return;

    await itemApi.deleteItem(id);
    fetchItems();
    setEditingItem(null);
  };

  const handleZeroOutStock = async (id: string) => {
    await itemApi.zeroOutStock(id);
    fetchItems();
    setEditingItem(null);
  };

  const addToShoppingList = async (id: string) => {
    await itemApi.addToShoppingList(id);
    fetchItems();
  };

  const filtered = useMemo(() => (
      items.filter((i) => {
        const q = itemQuery.trim().toLowerCase();
        if (!q) return true;
        const name = i.name.toLowerCase();
        return name.includes(q);
      })
  ), [items, itemQuery]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingItem ? 'Edit Item' : 'New Item'} icon={<Icon.Item />}>
        <ItemForm
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          onCancel={() => {
            setEditingItem(null);
          }}
          initialData={editingItem || undefined}
          isEditing={!!editingItem}
        />
        {editingItem && (
          <QuickPurchaseForm item={editingItem}
            onSubmit={() => {
              setEditingItem(null);
              fetchItems();
            }}
          />
        )}
      </Card>

      <Card
        title="Items"
        icon={<Icon.Item />}
        actions={
          <Input.Search
            value={itemQuery}
            onChange={(e) => setItemQuery(e.target.value)}
            placeholder="Search items"
          />
        }
      >
              {/* Mobile list */}
        <div className="sm:hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No matching items.</div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((i) => {
                const catName = i.category?.name || 'Uncategorized';
                return (
                  <li key={i.id} className="rounded-xl ring-1 ring-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{i.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{catName}</p>
                      </div>
                      <div className="flex items-center grid grid-cols-2 gap-2">
                        <IconButton.View onClick={() => router.push(`/admin/items/${i.id}`)} />
                        {!i.buy && <IconButton.Shop onClick={() => addToShoppingList(i.id)} />}
                        <IconButton.Edit onClick={() => setEditingItem(i) } />
                        <IconButton.Delete onClick={() => handleDeleteItem(i.id)} />
                      </div>
                    </div>
                    <div className="mt-3 text-xs text-slate-600">
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Stock</p>
                        <p className="mt-0.5 tabular-nums text-slate-800">
                          <span className="mr-2">{i.stock}</span>
                          {i.stock > 0 && <IconButton.Cancel size="btn-sm" onClick={() => handleZeroOutStock(i.id)}/>}
                        </p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hidden sm:block">
          <Table columns={['Name', 'Stock', 'Category', 'Actions']}>
            {filtered.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
                <td className="px-4 py-2 text-sm tabular-nums">
                  <div className="flex flex-row">
                    <span className="mr-2">{i.stock}</span>
                    {i.stock > 0 && <IconButton.Cancel size="btn-sm" onClick={() => handleZeroOutStock(i.id)}/>}
                  </div>
                </td>
                <td className="px-4 py-2 text-sm text-slate-700">{i.category?.name ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <IconButton.View onClick={() => router.push(`/admin/items/${i.id}`)} />
                    <IconButton.Edit onClick={() => setEditingItem(i)} />
                    {!i.buy && <IconButton.Shop onClick={() => addToShoppingList(i.id)} />}
                    <IconButton.Delete onClick={() => handleDeleteItem(i.id)} />
                  </div>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </Card>
    </div>
  );
}
