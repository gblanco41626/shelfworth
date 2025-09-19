'use client'

import { useState, useEffect } from 'react'
import type { Item, Category, Store, CreateItemData, Purchase, CreatePurchaseData } from '@/types'
import { ItemCard } from '@/components/item-card'
import { ItemForm } from '@/components/admin/item-form'
import { PurchaseForm } from '@/components/purchase-form'
import { PurchaseCard } from '@/components/purchase-card'
import { Plus, Package, DollarSign, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '@/components/tokens'

type ViewMode = 'shelf' | 'purchases'
type FormMode = 'none' | 'item' | 'purchase'

export default function HomePage() {
  const [items, setItems] = useState<Item[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [purchases, setPurchases] = useState<Purchase[]>([])
  const [viewMode, setViewMode] = useState<ViewMode>('shelf')
  const [formMode, setFormMode] = useState<FormMode>('none')
  
  const [editingItem, setEditingItem] = useState<Item | null>(null)
  const [editingPurchase, setEditingPurchase] = useState<Purchase | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<string>('')

  // Fetch data on component mount
  useEffect(() => {
    fetchItems()
    fetchCategories()
    fetchStores()
    if (viewMode === 'purchases') {
      fetchPurchases()
    }
  }, [viewMode])

  const fetchItems = async () => {
    try {
      const response = await fetch('/api/items')
      if (response.ok) {
        const items = await response.json()
        setItems(items)
      }
    } catch (error) {
      console.error('Error fetching items:', error)
    }
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

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores')
      if (response.ok) {
        const strs = await response.json()
        setStores(strs)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    }
  }

  const fetchPurchases = async () => {
    try {
      const response = await fetch('/api/purchases')
      if (response.ok) {
        const items = await response.json()
        setPurchases(items)
      }
    } catch (error) {
      console.error('Error fetching purchases:', error)
    }
  }

  // Item handlers
  const handleAddItem = async (data: CreateItemData) => {
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchItems()
        setFormMode('none')
      }
    } catch (error) {
      console.error('Error adding item:', error)
    }
  }

  const handleUpdateItem = async (data: CreateItemData) => {
    if (!editingItem) return

    try {
      const response = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchItems()
        setEditingItem(null)
        setFormMode('none')
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure? This will also delete all purchases for this item.')) return

    try {
      const response = await fetch(`/api/items/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchItems()
      }
    } catch (error) {
      console.error('Error deleting item:', error)
    }
  }

  // Grocery Item handlers
  const handleAddPurchase = async (data: CreatePurchaseData) => {
    try {
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (response.ok) {
        fetchItems() // Refresh to show updated purchases
        if (viewMode === 'purchases') fetchPurchases()
        setFormMode('none')
        setSelectedItemId('')
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
        fetchItems()
        if (viewMode === 'purchases') fetchPurchases()
        setEditingPurchase(null)
        setFormMode('none')
      }
    } catch (error) {
      console.error('Error updating purchase:', error)
    }
  }

  const handleDeletePurchase = async (id: string) => {
    if (!confirm('Are you sure you want to delete this purchase?')) return

    try {
      const response = await fetch(`/api/purchases/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        fetchItems()
        if (viewMode === 'purchases') fetchPurchases()
      }
    } catch (error) {
      console.error('Error deleting purchase:', error)
    }
  }

  // Calculate summary stats
  const totalValue = items.reduce((sum, item) => {
    return sum + (item.purchases?.reduce((itemSum, grocery) => 
      itemSum + (grocery.price * grocery.quantity), 0) || 0)
  }, 0)

  const totalItems = items.reduce((sum, item) => {
    return sum + (item.purchases?.reduce((itemSum, grocery) => 
      itemSum + grocery.quantity, 0) || 0)
  }, 0)

  const expiringItemsCount = items.reduce((count, item) => {
    return count + (item.purchases?.filter(grocery => {
      if (!grocery.expirationDate) return false
      const daysUntilExpiration = Math.ceil(
        (new Date(grocery.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
      )
      return daysUntilExpiration <= 7 && daysUntilExpiration >= 0
    }).length || 0)
  }, 0)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShelfWorth</h1>
          <p className="text-gray-600 mb-4">Track what&apos;s on your shelves and know what it&apos;s worth!</p>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <DollarSign className="text-green-600" size={20} />
                <div>
                  <div className="text-sm text-gray-600">Total Value</div>
                  <div className="text-xl font-bold text-green-600">${totalValue.toFixed(2)}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Package className="text-blue-600" size={20} />
                <div>
                  <div className="text-sm text-gray-600">Total Items</div>
                  <div className="text-xl font-bold text-blue-600">{totalItems}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="text-purple-600" size={20} />
                <div>
                  <div className="text-sm text-gray-600">Items</div>
                  <div className="text-xl font-bold text-purple-600">{items.length}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-2">
                <Calendar className={`${expiringItemsCount > 0 ? 'text-yellow-600' : 'text-gray-600'}`} size={20} />
                <div>
                  <div className="text-sm text-gray-600">Expiring Soon</div>
                  <div className={`text-xl font-bold ${expiringItemsCount > 0 ? 'text-yellow-600' : 'text-gray-600'}`}>
                    {expiringItemsCount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('shelf')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'shelf'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setViewMode('purchases')}
              className={`px-4 py-2 rounded-md transition-colors ${
                viewMode === 'purchases'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
              }`}
            >
              All Purchases
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-6 flex gap-2">
          <Button
            onClick={() => setFormMode('item')}
          > 
            Add Item
          </Button>

          <Button
            onClick={() => setFormMode('purchase')}
          > 
            Add Purchase
          </Button>
        </div>

        {/* Forms */}
        {formMode === 'item' && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingItem ? 'Edit Item' : 'Add New Item'}
            </h2>
            <ItemForm
              categories={categories}
              onSubmit={editingItem ? handleUpdateItem : handleAddItem}
              onCancel={() => {
                setFormMode('none')
                setEditingItem(null)
              }}
              initialData={editingItem || undefined}
              isEditing={!!editingItem}
            />
          </div>
        )}

        {formMode === 'purchase' && (
          <div className="mb-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-4">
              {editingPurchase ? 'Edit Purchase' : 'Add New Purchase'}
            </h2>
            <PurchaseForm
              items={items}
              stores={stores}
              onSubmit={editingPurchase ? handleUpdatePurchase : handleAddPurchase}
              onCancel={() => {
                setFormMode('none')
                setEditingPurchase(null)
                setSelectedItemId('')
              }}
              initialData={editingPurchase || undefined}
              preselectedItemId={selectedItemId}
              isEditing={!!editingPurchase}
            />
          </div>
        )}

        {/* Content */}
        {viewMode === 'shelf' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <ItemCard
                key={item.id}
                item={item}
                onEdit={(item) => {
                  setEditingItem(item)
                  setFormMode('item')
                }}
                onDelete={handleDeleteItem}
                onAddPurchase={(itemId) => {
                  setSelectedItemId(itemId)
                  setFormMode('purchase')
                }}
              />
            ))}
          </div>
        )}

        {viewMode === 'purchases' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {purchases.map((item) => (
              <PurchaseCard
                key={item.id}
                item={item}
                onEdit={(item) => {
                  setEditingPurchase(item)
                  setFormMode('purchase')
                }}
                onDelete={handleDeletePurchase}
              />
            ))}
          </div>
        )}

        {/* Empty States */}
        {viewMode === 'shelf' && items.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto mb-4 opacity-50" size={48} />
            <p className="text-gray-500 mb-4">No items yet. Create your first one!</p>
            <button
              onClick={() => setFormMode('item')}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Your First Item
            </button>
          </div>
        )}

        {viewMode === 'purchases' && purchases.length === 0 && (
          <div className="text-center py-12">
            <DollarSign className="mx-auto mb-4 opacity-50" size={48} />
            <p className="text-gray-500 mb-4">No purchases yet. Add your first grocery purchase!</p>
            <button
              onClick={() => setFormMode('purchase')}
              className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors"
            >
              Add Your First Purchase
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
