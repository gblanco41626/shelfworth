'use client';

import { useEffect, useState, useCallback } from 'react';

import { useCategoryApi } from '@/hooks/api';

import { Input, Button } from '../tokens';

import type { Category, Item } from '@/types';

interface ItemFormProps {
  onSubmit: (data: Partial<Item>) => void
  onCancel?: () => void
  initialData?: Partial<Item>
  isEditing?: boolean
}

export function ItemForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: ItemFormProps) {
  const [formData, setFormData] = useState<Partial<Item>>({
    name: '',
    stock: 0,
    categoryId: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const catApi = useCategoryApi();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCategories = useCallback(async () => setCategories(await catApi.getCategories()), []);

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || '',
    });
  }, [initialData]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input.Text
          label="Name"
          value={formData.name}
          onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
          placeholder="e.g., Milk"
          required
        />
        <Input.Number label="Stock"
          value={formData.stock}
          onChange={(e) => setFormData((f) => ({ ...f, stock: parseFloat(e.target.value) }))}
          required
        />
        <Input.Select label="Category"
          value={formData.categoryId ?? ''}
          onChange={(e) => setFormData((f) => ({ ...f, categoryId: e.target.value || undefined }))}
        >
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Input.Select>
        <div className="flex items-center justify-end gap-2">
          {isEditing && (
            <Button type="button" variant="outline" onClick={() => onCancel?.()}>
              Cancel
            </Button>
          )}
          <Button type="submit">{isEditing ? 'Save Changes' : 'Add Item'}</Button>
        </div>
      </form>
    </div>
  );
}
