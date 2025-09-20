"use client"

import React, { useState, useEffect } from "react";
import { Button, Card, Table} from "@/components/tokens"
import { Purchase, CreatePurchaseData } from "@/types";
import { PurchaseForm } from "@/components/admin/purchase-form";
import { Pencil, Trash2, Search } from "lucide-react";
import { Icon } from "@/components/tokens";
import { formatDateForDisplay } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/currency-utils";


export default function Purchases() {
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [purchaseQuery, setPurchaseQuery] = useState("");

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

  const filteredPurchases = purchases.filter((i) => {
    const q = purchaseQuery.trim().toLowerCase();
    if (!q) return true;
    const name = i.item?.name.toLowerCase();
    return name?.includes(q);
  });

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
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              value={purchaseQuery}
              onChange={(e) => setPurchaseQuery(e.target.value)}
              placeholder="Search purchases"
              className="w-full rounded-lg border border-slate-300 pl-9 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-400 focus:border-sky-400"
            />
          </div>
        }
      > 
              {/* Mobile list */}
        <div className="sm:hidden">
          {filteredPurchases.length === 0 ? (
            <div className="px-4 py-6 text-sm text-slate-500">No matching purchases.</div>
          ) : (
            <ul className="space-y-3">
              {filteredPurchases.map((i) => {
                return (
                  <li key={i.id} className="rounded-xl ring-1 ring-slate-200 p-3">
                    <div className="flex purchases-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-800">{i.item?.name}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{i.store?.name}</p>
                      </div>
                      <div className="flex purchases-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() =>
                            setEditingPurchase(i)
                          }
                          aria-label="Edit purchase"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="danger" onClick={() => handleDeletePurchase(i.id)} aria-label="Delete purchase">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Date</p>
                        <p className="mt-0.5 tabular-nums text-slate-800">{formatDateForDisplay(i.dateBought)}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Qty</p>
                        <p className="mt-0.5">{`${i.quantity * i.amount} ${i.unit}`}</p>
                      </div>
                      <div>
                        <p className="uppercase tracking-wide text-slate-400">Price</p>
                        <p className="mt-0.5">{formatCurrency(i.quantity * i.price)}</p>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
        <div className="hidden sm:block">
          <Table columns={["Item", "Store", "Date", "Qty", "Price", "Actions"]}>
            {filteredPurchases.map((i) => (
              <tr key={i.id} className="hover:bg-slate-50/50">
                <td className="px-4 py-2 text-sm text-slate-700">{i.item?.name}</td>
                <td className="px-4 py-2 text-sm text-slate-700">{i.store?.name}</td>
                <td className="px-4 py-2 text-xs text-slate-500">{formatDateForDisplay(i.dateBought)}</td>
                <td className="px-4 py-2 text-sm tabular-nums">{`${i.quantity * i.amount} ${i.unit}`}</td>
                <td className="px-4 py-2 text-sm tabular-nums">{formatCurrency(i.quantity * i.price)}</td>
                <td className="px-4 py-2">
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setEditingPurchase(i)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="danger" onClick={() => handleDeletePurchase(i.id)}>
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
