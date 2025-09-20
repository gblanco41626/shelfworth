'use client'

import { useEffect, useState } from 'react'
import type { Category, CreateItemData } from '@/types'
import { Input, Button } from '../tokens'

interface ItemFormProps {
  onSubmit: (data: CreateItemData) => void
  onCancel?: () => void
  initialData?: Partial<CreateItemData>
  isEditing?: boolean
}

export function ItemForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false
}: ItemFormProps) {
  const [formData, setFormData] = useState<CreateItemData>({
    name: '',
    stock: 0,
    categoryId: ''
  })
  const [categories, setCategories] = useState<Category[]>([])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || ''
    })
  }, [initialData]);

  useEffect(() => {
    fetchCategories()
  }, []);

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
          onChange={(e) => setFormData((f) => ({ ...f, stock: Number(e.target.value) }))}
        />
        <Input.Select label="Category"
          value={formData.categoryId ?? ""}
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
          <Button type="submit">{isEditing ? "Save Changes" : "Add Item"}</Button>
        </div>
      </form>
    </div>
  )
}
