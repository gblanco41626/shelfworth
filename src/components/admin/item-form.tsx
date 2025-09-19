'use client'

import { useEffect, useState } from 'react'
import type { Category, CreateItemData } from '@/types'
import { Input, Button } from '../tokens'

interface ItemFormProps {
  categories: Category[]
  onSubmit: (data: CreateItemData) => void
  onCancel?: () => void
  initialData?: Partial<CreateItemData>
  isEditing?: boolean
}

export function ItemForm({
  categories,
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
      stock: initialData?.stock || 0,
      categoryId: initialData?.categoryId || ''
    })
  }, [initialData]);

  return (
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
    // <form onSubmit={handleSubmit} className="space-y-4">
    //   <div>
    //     <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
    //       Item Name
    //     </label>
    //     <input
    //       type="text"
    //       id="name"
    //       placeholder="e.g., Milk, Bread, Apples"
    //       value={formData.name}
    //       onChange={(e) => setFormData({ ...formData, name: e.target.value })}
    //       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       required
    //     />
    //     <p className="text-xs text-gray-500 mt-1">
    //       This is the generic item name. You&apos;ll add specific purchases next.
    //     </p>
    //   </div>

    //   <div>
    //     <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
    //       Category (Optional)
    //     </label>
    //     <select
    //       id="category"
    //       value={formData.categoryId}
    //       onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
    //       className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
    //     >
    //       <option value="">No Category</option>
    //       {categories.map((category) => (
    //         <option key={category.id} value={category.id}>
    //           {category.name}
    //         </option>
    //       ))}
    //     </select>
    //   </div>

    //   <div className="flex gap-2">
    //     <button
    //       type="submit"
    //       className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
    //     >
    //       {isEditing ? 'Update Item' : 'Create Item'}
    //     </button>
    //     {onCancel && (
    //       <button
    //         type="button"
    //         onClick={onCancel}
    //         className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
    //       >
    //         Cancel
    //       </button>
    //     )}
    //   </div>
    // </form>
  )
}
