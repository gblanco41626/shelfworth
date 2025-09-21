"use client"

import React, { useState, useEffect, useMemo } from "react";
import { Card, Table, Icon, IconButton, Input } from "@/components/tokens"
import { Purchase, CreatePurchaseData } from "@/types";
import { PurchaseForm } from "@/components/admin/purchase-form";
import { formatDateForDisplay } from "@/lib/date-utils";
import { formatCurrency, pricePerUnit } from "@/lib/currency-utils";

export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [purchaseQuery, setPurchaseQuery] = useState<string>("");

  // Fetch data on component mount
  useEffect(() => {
    fetchPurchases()
  }, [])

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const purchases = await response.json()
        setPurchases(purchases)
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    }
  }

  // Purchase handlers
  const handleAddPurchase = async (data: CreatePurchaseData) => {
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchPurchases()
        const createdPurchase = await response.json();
        setEditingPurchase(createdPurchase);
      }
    } catch (error) {
      console.error('Error adding purchase:', error)
    }
  }

  const handleUpdatePurchase = async (data: CreatePurchaseData) => {
    if (!editingPurchase) return

    try {
      const response = await fetch(`/api/purchases/${editingPurchase.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchPurchases()
        setEditingPurchase(null)
      }
    } catch (error) {
      console.error('Error updating purchase:', error)
    }
  }

  const handleDeletePurchase = async (id: string) => {
    if (!confirm('Are you sure?')) return

    try {
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchPurchases()
        setEditingPurchase(null)
      }
    } catch (error) {
      console.error('Error deleting purchase:', error)
    }
  }

  const filtered = useMemo(() => (
    purchases.filter((i) => {
      const q = purchaseQuery.trim().toLowerCase();
      if (!q) return true;
      const name = i.item?.name.toLowerCase();
      return name?.includes(q);
    })
  ), [purchases, purchaseQuery]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingPurchase ? "Edit Purchase" : "New Purchase"} icon={<Icon.Purchase />}> 
        <PurchaseForm
          onSubmit={editingPurchase ? handleUpdatePurchase : handleAddPurchase}
          onCancel={() => {
            setEditingPurchase(null)
          }}
          initialData={editingPurchase || undefined}
          isEditing={!!editingPurchase}
        />
      </Card>

      <Card
        title="Purchases"
        icon={<Icon.Purchase />}
        actions={
          <Input.Search
            value={purchaseQuery}
            onChange={(e) => setPurchaseQuery(e.target.value)}
            placeholder="Search purchases"
          />
        }
      > 
        {/* Mobile list */}
        <div className="sm:hidden">
          {filtered.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No matching purchases.</div>
          ) : (
            <ul className="space-y-3">
              {filtered.map((i) => {
                return (
                  <li key={i.id} className="rounded-xl ring-1 ring-slate-200 p-3">
                    <div className="flex purchases-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-sm text-slate-800">{i.item?.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{i.store?.name}</p>
                      </div>
                      <div className="flex purchases-center gap-2">
                        <IconButton.Edit onClick={() => setEditingPurchase(i) } />
                        <IconButton.Delete onClick={() => handleDeletePurchase(i.id)} />
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-2 gap-3 text-xs text-slate-600">
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Date</p>
                        <p className="mt-0.5 tabular-nums text-slate-800">{formatDateForDisplay(i.dateBought)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Unit</p>
                        <p className="mt-0.5">{`${i.amount} ${i.unit}`}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Price</p>
                        <p className="mt-0.5">{formatCurrency(i.price)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">$/Unit</p>
                        <p className="mt-0.5">{`${formatCurrency(pricePerUnit(i),)}`}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hidden sm:block">
          <Table columns={["Item", "Store", "Date", "Price", "$/Unit", "Actions"]}>
            {filtered.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-sm text-slate-700">{i.item?.name}</td>
                <td className="px-4 py-2 text-xs text-slate-700">{i.store?.name}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{formatDateForDisplay(i.dateBought)}</td>
                <td className="px-4 py-2 text-sm tabular-nums">{formatCurrency(i.price)}</td>
                <td className="px-4 py-2 text-sm tabular-nums">
                  <p>{formatCurrency(pricePerUnit(i),)}</p>
                  <p className="text-xs">/{i.unit}</p>
                </td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <IconButton.Edit onClick={() => setEditingPurchase(i)} />
                    <IconButton.Delete onClick={() => handleDeletePurchase(i.id)} />
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
