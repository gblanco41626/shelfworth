'use client'

import { useEffect, useState } from 'react'
import type { Item, Store, CreatePurchaseData } from '@/types'
import { Input, Button } from '../tokens'
import { formatDateForInput } from '@/lib/date-utils'
import { formatCurrency, pricePerUnit } from '@/lib/currency-utils'
import { useToast } from '@/hooks/use-toast'

interface QuickPurchaseFormProps {
  item: Item, 
  onSubmit: () => void
}

export function QuickPurchaseForm({ item, onSubmit }: QuickPurchaseFormProps) {
  const [formData, setFormData] = useState<CreatePurchaseData>({
    itemId: item.id,
    storeId: item.storeId || '',
    brand: '',
    unit: 'kg',
    amount: 1,
    dateBought: new Date(),
    quantity: 1,
    price: 0
  })

  const [stores, setStores] = useState<Store[]>([])
  const toast = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    handleAddPurchase(formData)
  }

  const handleAddPurchase = async (data: CreatePurchaseData) => {
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        toast.success(`Purchase added`)
        onSubmit()
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

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

  useEffect(() => {
    fetchStores();
  }, []);

  return (
    <div className="p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input.Text
          label="Brand"
          value={formData.brand ?? ""}
          onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value}))}
          placeholder="e.g., Organic Valley"
        />
        <Input.Number
          label="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData((f) => ({ ...f, quantity: parseFloat(e.target.value) }))}
          required
        />
        <Input.Number
          label="Qty/Unit"
          value={formData.amount}
          onChange={(e) => setFormData((f) => ({ ...f, amount: parseFloat(e.target.value) }))}
          required
        />
        <Input.Select
          label="Unit"
          value={formData.unit}
          onChange={(e) => setFormData((f) => ({ ...f, unit: e.target.value }))}
          required
        >
            <option value="">Select unit</option>
            <option value="l">L (Liters)</option>
            <option value="ml">mL (Milliliters)</option>
            <option value="g">g (Grams)</option>
            <option value="kg">kg (Kilograms)</option>
            <option value="oz">oz (Ounces)</option>
            <option value="lb">lb (Pounds)</option>
            <option value="pack">pack</option>
            <option value="box">box</option>
            <option value="can">can</option>
            <option value="bottle">bottle</option>
            <option value="piece">piece</option>
        </Input.Select>
        <Input.Number
          label="Price"
          value={formData.price ?? ""}
          onChange={(e) => setFormData((f) => ({ ...f, price: parseFloat(e.target.value) }))}
          required
        />
        <div className="sm:hidden mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
          <p className="uppercase tracking-wide text-slate-400">Total Price</p>
          <p className="mt-0.5 tabular-nums text-slate-800">{formatCurrency(formData.price * formData.quantity)}</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
          <p className="uppercase tracking-wide text-slate-400">Price/Unit</p>
          <p className="mt-0.5 tabular-nums text-slate-800">{`${formatCurrency(pricePerUnit(formData))}/${formData.unit}`}</p>
        </div>
        <div className="hidden sm:block mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
          <p className="uppercase tracking-wide text-slate-400">Total Price</p>
          <p className="mt-0.5 tabular-nums text-slate-800">{formatCurrency(formData.price * formData.quantity)}</p>
        </div>
        <Input.Select
          label="Store"
          value={formData.storeId ?? ""}
          onChange={(e) => setFormData((f) => ({ ...f, storeId: e.target.value }))}
          required
        >
            <option value="">—</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
        </Input.Select>
        <Input.Date
          label="Date Bought"
          value={formatDateForInput(formData.dateBought)}
          onChange={(e) => setFormData((f) => ({ ...f, dateBought: new Date(e.target.value)}))}
        />
        <Input.Date
          label="Expiration Date"
          value={formatDateForInput(formData.expirationDate)}
          onChange={(e) => setFormData((f) => ({ ...f, expirationDate: new Date(e.target.value)}))}
          className="w-full rounded-xl border-slate-300 focus:border-sky-400 focus:ring-sky-400"
        />
      </div>
      <div className="flex items-center justify-end">
        <Button onClick={handleSubmit} type="button">Add Purchase</Button>
      </div>
      <p className="text-xs text-slate-500">Adding a purchase here will also increase stock by <span className="font-semibold">quantity</span>.</p>
    </div>
  )
}
