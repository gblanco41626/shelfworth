"use client"

import React, { useState, useEffect } from "react";
import { Button, Card, Table} from "@/components/tokens"
import { Item, CreateItemData } from "@/types";
import { ItemForm } from "@/components/admin/item-form";
import { Pencil, Trash2, Search, Eye } from "lucide-react";
import { Icon } from "@/components/tokens";
import { QuickPurchaseForm } from "@/components/admin/quick-purchase-form";
import { useRouter } from "next/navigation";


export default function Items() {
  const [items, setItems] = useState<Item[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [itemQuery, setItemQuery] = useState("");
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
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={itemQuery}
              onChange={(e) => setItemQuery(e.target.value)}
              placeholder="Search items"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
          </div>
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
                        <p className="font-medium text-slate-800">{i.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{catName}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={() => router.push(`/admin/items/${i.id}`)} aria-label="View item">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() =>
                            setEditingItem(i)
                          }
                          aria-label="Edit item"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" onClick={() => handleDeleteItem(i.id)} aria-label="Delete item">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Stock</p>
                        <p className="mt-0.5 tabular-nums text-slate-800">{i.stock}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Updated</p>
                        <p className="mt-0.5">{new Date(i.updatedAt).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Category</p>
                        <p className="mt-0.5">{catName}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hidden sm:block">
          <Table columns={["Name", "Stock", "Category", "Updated", "Actions"]}>
            {filteredItems.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
                <td className="px-4 py-2 text-sm tabular-nums">{i.stock}</td>
                <td className="px-4 py-2 text-sm text-slate-700">{i.category?.name ?? <span className="text-slate-400">—</span>}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{new Date(i.updatedAt).toLocaleString()}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.push(`/admin/items/${i.id}`)}>
                      <Eye className="h-4 w-4 text-sky-600" />
                    </Button>
                    <Button variant="outline" onClick={() => setEditingItem(i)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeleteItem(i.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
