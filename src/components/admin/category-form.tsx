'use client';

import { useEffect, useState } from 'react';

import { Input, Button } from '../tokens';

import type { CreateCategoryData } from '@/types';

interface CategoryFormProps {
  onSubmit: (data: CreateCategoryData) => void
  onCancel?: () => void
  initialData?: Partial<CreateCategoryData>
  isEditing?: boolean
}

export function CategoryForm({
  onSubmit,
  onCancel,
  initialData,
  isEditing = false,
}: CategoryFormProps) {
  const [formData, setFormData] = useState<CreateCategoryData>({
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  useEffect(() => {
    setFormData({
      name: initialData?.name || '',
    });
  }, [initialData]);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input.Text
        label="Name"
        value={formData.name}
        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
        placeholder="e.g., Produce"
        required
      />
      <div className="flex items-center justify-end gap-2">
        {isEditing && (
          <Button type="button" variant="outline" onClick={() => onCancel?.()}>
            Cancel
          </Button>
        )}
        <Button type="submit">{isEditing ? 'Save Changes' : 'Add Category'}</Button>
      </div>
    </form>
  );
}
