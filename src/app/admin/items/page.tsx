"use client"

import React, { useState, useEffect } from "react";
import { Button, Card, Table} from "@/components/tokens"
import { Item, Category, CreateItemData } from "@/types";
import { ItemForm } from "@/components/admin/ItemForm";
import { Pencil, Trash2 } from "lucide-react";
import { Icon } from "@/components/tokens";

export default function Items() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [editingItem, setEditingItem] = useState<Item | null>(null)

  // Fetch data on component mount
  useEffect(() => {
    fetchItems()
    fetchCategories()
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

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories')
      if (response.ok) {
        const cats = await response.json()
        setCategories(cats)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
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
        // setFormMode('none')
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
        // setFormMode('none')
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
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingItem ? "Edit Item" : "New Item"} icon={<Icon.Item />}> 
        <ItemForm
          categories={categories}
          onSubmit={editingItem ? handleUpdateItem : handleAddItem}
          onCancel={() => {
            // setFormMode('none')
            setEditingItem(null)
          }}
          initialData={editingItem || undefined}
          isEditing={!!editingItem}
        />
      </Card>

      <Card title="Items" icon={<Icon.Item />}> 
        <Table columns={["Name", "Stock", "Category", "Updated", "Actions"]}>
          {items.map((i) => (
            <tr key={i.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
              <td className="px-4 py-2 text-sm tabular-nums">{i.stock}</td>
              <td className="px-4 py-2 text-sm text-slate-700">{categories.find((c) => c.id === i.categoryId)?.name ?? <span className="text-slate-400">—</span>}</td>
              <td className="px-4 py-2 text-xs text-slate-500">{new Date(i.updatedAt).toLocaleString()}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
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
      </Card>
    </div>
  );
}
