'use client';

import React, { useState, useEffect, useCallback } from 'react';

import { CategoryForm } from '@/components/admin/category-form';
import { Card, Table, Icon, IconButton } from '@/components/tokens';
import { useCategoryApi } from '@/hooks/api';

import type { Category } from '@/types';

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const catApi = useCategoryApi();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchCategories = useCallback(async () => setCategories(await catApi.getCategories()), []);

  const handleAddCategory = async (data: Partial<Category>) => {
    await catApi.createCategory(data);
    fetchCategories();
  };

  const handleUpdateCategory = async (data: Partial<Category>) => {
    if (!editingCategory) return;

    await catApi.updateCategory(editingCategory.id, data);
    fetchCategories();
    setEditingCategory(null);
  };

  const handleDeleteCategory = async (id: string) => {
    // eslint-disable-next-line no-alert
    if (!confirm('Are you sure? This will also delete all purchases for this category.')) return;

    await catApi.deleteCategory(id);
    fetchCategories();
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingCategory ? 'Edit Category' : 'New Category'} icon={<Icon.Category />}>
        <CategoryForm
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setEditingCategory(null);
          }}
          initialData={editingCategory || undefined}
          isEditing={!!editingCategory}
        />
      </Card>

      <Card title="Categories" icon={<Icon.Category />}>
        <Table columns={['Name', 'Actions']}>
          {categories.map((i) => (
            <tr key={i.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <IconButton.Edit onClick={() => setEditingCategory(i)} />
                  <IconButton.Delete onClick={() => handleDeleteCategory(i.id)} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
