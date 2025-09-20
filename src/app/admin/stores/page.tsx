"use client"

import React, { useState, useEffect } from "react";
import { Card, Table, IconButton, Icon } from "@/components/tokens";
import { Store, CreateStoreData } from "@/types";
import { StoreForm } from "@/components/admin/store-form";

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([])
  const [editingStore, setEditingStore] = useState<Store | null>(null)

  useEffect(() => {
    fetchStores()
  }, [])

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const cats = await response.json()
        setStores(cats)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    }
  }

  const handleAddStore = async (data: CreateStoreData) => {
    try {
      const response = await fetch('/api/stores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchStores()
      }
    } catch (error) {
      console.error('Error adding store:', error)
    }
  }

  const handleUpdateStore = async (data: CreateStoreData) => {
    if (!editingStore) return

    try {
      const response = await fetch(`/api/stores/${editingStore.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchStores()
        setEditingStore(null)
        // setFormMode('none')
      }
    } catch (error) {
      console.error('Error updating store:', error)
    }
  }

  const handleDeleteStore = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all purchases for this store.')) return

    try {
      const response = await fetch(`/api/stores/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchStores()
      }
    } catch (error) {
      console.error('Error deleting store:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingStore ? "Edit Store" : "New Store"} icon={<Icon.Store />}> 
        <StoreForm
          onSubmit={editingStore ? handleUpdateStore : handleAddStore}
          onCancel={() => {
            setEditingStore(null)
          }}
          initialData={editingStore || undefined}
          isEditing={!!editingStore}
        />
      </Card>

      <Card title="Stores" icon={<Icon.Store />}> 
        <Table columns={["Name", "Actions"]}>
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
