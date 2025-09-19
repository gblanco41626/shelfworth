"use client"

import React, { useState, useEffect } from "react";
import { Button, Card, Table } from "../tokens";
import { Category, CreateCategoryData } from "@/types";
import { CategoryForm } from "./CategoryForm";
import { Pencil, Box, Trash2 } from "lucide-react";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([])
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)

  useEffect(() => {
    fetchCategories()
  }, [])

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

  const handleAddCategory = async (data: CreateCategoryData) => {
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error('Error adding category:', error)
    }
  }

  const handleUpdateCategory = async (data: CreateCategoryData) => {
    if (!editingCategory) return

    try {
      const response = await fetch(`/api/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchCategories()
        setEditingCategory(null)
        // setFormMode('none')
      }
    } catch (error) {
      console.error('Error updating category:', error)
    }
  }

  const handleDeleteCategory = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all purchases for this category.')) return

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchCategories()
      }
    } catch (error) {
      console.error('Error deleting category:', error)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card title={editingCategory ? "Edit Category" : "New Category"} icon={<Box className="h-5 w-5 text-violet-600" />}> 
        <CategoryForm
          onSubmit={editingCategory ? handleUpdateCategory : handleAddCategory}
          onCancel={() => {
            setEditingCategory(null)
          }}
          initialData={editingCategory || undefined}
          isEditing={!!editingCategory}
        />
      </Card>

      <Card title="Categories" icon={<Box className="h-5 w-5 text-violet-600" />}> 
        <Table columns={["Name", "Actions"]}>
          {categories.map((i) => (
            <tr key={i.id} className="hover:bg-slate-50/50">
              <td className="px-4 py-2 text-sm text-slate-700">{i.name}</td>
              <td className="px-4 py-2">
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setEditingCategory(i)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="danger" onClick={() => handleDeleteCategory(i.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
