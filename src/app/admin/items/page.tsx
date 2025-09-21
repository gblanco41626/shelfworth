"use client"

import React, { useState, useEffect } from "react";
import { Card, Table, Icon, IconButton, Input } from "@/components/tokens"
import { Item, CreateItemData } from "@/types";
import { ItemForm } from "@/components/admin/item-form";
import { QuickPurchaseForm } from "@/components/admin/quick-purchase-form";
import { useRouter } from "next/navigation";


export default function Items() {
  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [itemQuery, setItemQuery] = useState<string>("");
  const router = useRouter();

  // Fetch data on component mount
  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const items = await response.json()
        setItems(items)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    }
  }

  // Item handlers
  const handleAddItem = async (data: CreateItemData) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchItems()
        const createdItem = await response.json();
        setEditingItem(createdItem);
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (data: CreateItemData) => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchItems()
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all purchases for this item.')) return

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchItems()
        setEditingItem(null)
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  const handleZeroOutStock = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}/zero-out-stock`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' }
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const addToShoppingList = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}/shopping-list`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buy: true })
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const filteredItems = items.filter((i) => {
    const q = itemQuery.trim().toLowerCase();
    if (!q) return true;
    const name = i.name.toLowerCase();
    return name.includes(q);
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingItem ? "Edit Item" : "New Item"} icon={<Icon.Item />}> 
        <ItemForm
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          onCancel={() => {
            setEditingItem(null)
          }}
          initialData={editingItem || undefined}
          isEditing={!!editingItem}
        />
        {editingItem && (
          <QuickPurchaseForm item={editingItem}
            onSubmit={() => {
              setEditingItem(null)
              fetchItems()
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
          {filteredItems.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No matching items.</div>
          ) : (
            <ul className="space-y-3">
              {filteredItems.map((i) => {
                const catName = i.category?.name || 'Uncategorized'
                return (
                  <li key={i.id} className="rounded-xl ring-1 ring-slate-200 p-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{i.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{catName}</p>
                      </div>
                      <div className="flex items-center grid grid-cols-2 gap-2">
                        <IconButton.View onClick={() => router.push(`/admin/items/${i.id}`)} />
                        <IconButton.Shop onClick={() => addToShoppingList(i.id)} />
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
          <Table columns={["Name", "Stock", "Category", "Actions"]}>
            {filteredItems.map((i) => (
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
                    <IconButton.Shop onClick={() => addToShoppingList(i.id)} />
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
