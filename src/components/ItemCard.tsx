import type { Item } from '@/types/item'
import { Pencil, Trash2, Plus, Calendar, DollarSign } from 'lucide-react'

interface ItemCardProps {
  item: Item
  onEdit: (item: Item) => void
  onDelete: (id: string) => void
  onAddPurchase: (itemId: string) => void
}

export function ItemCard({ item, onEdit, onDelete, onAddPurchase }: ItemCardProps) {
  // Get the most recent purchase for display
  const recentPurchase = item.purchases?.[0]
  
  // Check for expiring items (within 7 days)
  const expiringItems = item.purchases?.filter(grocery => {
    if (!grocery.expirationDate) return false
    const daysUntilExpiration = Math.ceil(
      (new Date(grocery.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    )
    return daysUntilExpiration <= 7 && daysUntilExpiration >= 0
  }) || []

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.category && (
            <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full mt-1">
              {item.category.name}
            </span>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onAddPurchase(item.id)}
            className="p-1 text-gray-400 hover:text-green-600 transition-colors"
            title="Add purchase"
          >
            <Plus size={16} />
          </button>
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
            title="Edit item"
          >
            <Pencil size={16} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            title="Delete item"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Expiration Warning */}
      {expiringItems.length > 0 && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center gap-1 text-yellow-700 text-sm">
            <Calendar size={14} />
            <span className="font-medium">
              {expiringItems.length} item{expiringItems.length > 1 ? 's' : ''} expiring soon
            </span>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Stock:</span>
          <span className="font-medium">{item.stock}</span>
        </div>
      </div>

      {/* Recent Purchase Info */}
      {recentPurchase && (
        <div className="border-t pt-2 text-xs text-gray-500">
          <div>Most recent: {recentPurchase.brand || 'No brand'}</div>
          <div className="flex justify-between">
            <span>{recentPurchase.amount}{recentPurchase.unit} × {recentPurchase.quantity}</span>
            <span>${recentPurchase.price.toFixed(2)}</span>
          </div>
          <div>
            {recentPurchase.dateBought && new Date(recentPurchase.dateBought).toLocaleDateString()}
            {recentPurchase.store?.name && ` • ${recentPurchase.store.name}`}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!item.purchases || item.purchases.length === 0) && (
        <div className="text-center py-4 text-gray-500">
          <DollarSign className="mx-auto mb-2 opacity-50" size={24} />
          <p className="text-sm">No purchases yet</p>
          <button
            onClick={() => onAddPurchase(item.id)}
            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
          >
            Add your first purchase
          </button>
        </div>
      )}
    </div>
  )
}
