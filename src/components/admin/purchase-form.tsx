'use client';

import { useEffect, useState } from 'react';

import { formatCurrency, pricePerUnit } from '@/lib/currency-utils';
import { formatDateForInput } from '@/lib/date-utils';

import { Input, Button } from '../tokens';

import type { Item, Store, CreatePurchaseData } from '@/types';

interface PurchaseFormProps {
  onSubmit: (data: CreatePurchaseData) => void
  onCancel?: () => void
  initialData?: Partial<CreatePurchaseData>
  isEditing?: boolean
}

export function PurchaseForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: PurchaseFormProps) {
  const [formData, setFormData] = useState<CreatePurchaseData>({
    itemId: '',
    storeId: '',
    brand: '',
    unit: 'kg',
    amount: 1,
    dateBought: new Date(),
    quantity: 1,
    price: 0,
  });
  const [items, setItems] = useState<Item[]>([]);
  const [stores, setCategories] = useState<Store[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items');
      if (response.ok) {
        const items = await response.json();
        setItems(items);
      }
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (response.ok) {
        const strs = await response.json();
        setCategories(strs);
      }
    } catch (error) {
      console.error('Error fetching stores:', error);
    }
  };

  useEffect(() => {
    setFormData({
      itemId: initialData?.itemId || '',
      storeId: initialData?.storeId || '',
      brand: initialData?.brand || '',
      unit: initialData?.unit || 'kg',
      amount: initialData?.amount || 1,
      dateBought: initialData?.dateBought || new Date(),
      quantity: initialData?.quantity || 1,
      price: initialData?.price || 0,
    });
  }, [initialData]);

  useEffect(() => {
    fetchStores();
    fetchItems();
  }, []);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input.Select
          label="Item"
          value={formData.itemId}
          onChange={(e) => setFormData((f) => ({ ...f, itemId: e.target.value }))}
          required
        >
          <option value="">Select Item</option>
          {items.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Input.Select>
        <Input.Text
          label="Brand"
          value={formData.brand ?? ''}
          onChange={(e) => setFormData((f) => ({ ...f, brand: e.target.value }))}
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
          value={formData.price ?? ''}
          onChange={(e) => setFormData((f) => ({ ...f, price: parseFloat(e.target.value) }))}
          required
        />
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
          <p className="uppercase tracking-wide text-slate-400">Total Price</p>
          <p className="mt-0.5 tabular-nums text-slate-800">{formatCurrency(formData.price * formData.quantity)}</p>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3 text-xs text-slate-600">
          <p className="uppercase tracking-wide text-slate-400">Price/Unit</p>
          <p className="mt-0.5 tabular-nums text-slate-800">{`${formatCurrency(pricePerUnit(formData))}/${formData.unit}`}</p>
        </div>
        <Input.Select
          label="Store"
          value={formData.storeId ?? ''}
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
          onChange={(e) => setFormData((f) => ({ ...f, dateBought: new Date(e.target.value) }))}
        />
        <Input.Date
          label="Expiration Date"
          value={formatDateForInput(formData.expirationDate)}
          onChange={(e) => setFormData((f) => ({ ...f, expirationDate: new Date(e.target.value) }))}
          className="w-full rounded-xl border-slate-300 focus:border-sky-400 focus:ring-sky-400"
        />
        <div className="flex items-center justify-end gap-2">
          {isEditing && (
            <Button type="button" variant="outline" onClick={() => onCancel?.()}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Purchase'}</Button>
        </div>
      </form>
    </div>
  );
}
