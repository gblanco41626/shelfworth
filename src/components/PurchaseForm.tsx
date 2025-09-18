'use client'

import { useState } from 'react'
import type { Item, CreatePurchaseData, Store } from '@/types'

interface PurchaseFormProps {
  items: Item[]
  stores: Store[]
  onSubmit: (data: CreatePurchaseData) => void
  onCancel?: () => void
  initialData?: Partial<CreatePurchaseData>
  preselectedItemId?: string
  isEditing?: boolean
}

export function PurchaseForm({
  items,
  stores,
  onSubmit,
  onCancel,
  initialData,
  preselectedItemId,
  isEditing = false
}: PurchaseFormProps) {
  const [formData, setFormData] = useState<CreatePurchaseData>({
    itemId: preselectedItemId || initialData?.itemId || '',
    brand: initialData?.brand || '',
    unit: initialData?.unit || '',
    amount: initialData?.amount || 1,
    dateBought: initialData?.dateBought || new Date(),
    expirationDate: initialData?.expirationDate || undefined,
    quantity: initialData?.quantity || 1,
    storeId: initialData?.storeId || '',
    price: initialData?.price || 0
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const formatDateForInput = (date: Date | undefined) => {
    if (!date) return ''
    return date.toISOString().split('T')[0]
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="itemId" className="block text-sm font-medium text-gray-700 mb-1">
          Item *
        </label>
        <select
          id="itemId"
          value={formData.itemId}
          onChange={(e) => setFormData({ ...formData, itemId: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="">Select a item</option>
          {items.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name} {item.category ? `(${item.category.name})` : ''}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
            Brand
          </label>
          <input
            type="text"
            id="brand"
            placeholder="e.g., Organic Valley"
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="store" className="block text-sm font-medium text-gray-700 mb-1">
            Store
          </label>
          <select
            id="store"
            value={formData.storeId}
            onChange={(e) => setFormData({ ...formData, storeId: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">No store</option>
            {stores.map((store) => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount *
          </label>
          <input
            type="number"
            id="amount"
            step="0.01"
            min="0"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-1">
            Unit *
          </label>
          <select
            id="unit"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select unit</option>
            <option value="L">L (Liters)</option>
            <option value="mL">mL (Milliliters)</option>
            <option value="g">g (Grams)</option>
            <option value="kg">kg (Kilograms)</option>
            <option value="oz">oz (Ounces)</option>
            <option value="lb">lb (Pounds)</option>
            <option value="pack">pack</option>
            <option value="box">box</option>
            <option value="can">can</option>
            <option value="bottle">bottle</option>
            <option value="piece">piece</option>
          </select>
        </div>

        <div>
          <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
            Quantity *
          </label>
          <input
            type="number"
            id="quantity"
            min="1"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
            Price ($) *
          </label>
          <input
            type="number"
            id="price"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="dateBought" className="block text-sm font-medium text-gray-700 mb-1">
            Date Bought *
          </label>
          <input
            type="date"
            id="dateBought"
            value={formatDateForInput(formData.dateBought)}
            onChange={(e) => setFormData({ ...formData, dateBought: new Date(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
      </div>

      <div>
        <label htmlFor="expirationDate" className="block text-sm font-medium text-gray-700 mb-1">
          Expiration Date (Optional)
        </label>
        <input
          type="date"
          id="expirationDate"
          value={formatDateForInput(formData.expirationDate)}
          onChange={(e) => setFormData({ 
            ...formData, 
            expirationDate: e.target.value ? new Date(e.target.value) : undefined 
          })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors"
        >
          {isEditing ? 'Update Purchase' : 'Add Purchase'}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
