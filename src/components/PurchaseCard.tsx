import type { Purchase } from '@/types/purchase'
import { Pencil, Trash2, Calendar, AlertTriangle } from 'lucide-react'

interface PurchaseCardProps {
  item: Purchase
  onEdit: (item: Purchase) => void
  onDelete: (id: string) => void
}

export function PurchaseCard({ item, onEdit, onDelete }: PurchaseCardProps) {
  const totalPrice = item.price * item.quantity
  
  // Calculate days until expiration
  const daysUntilExpiration = item.expirationDate 
    ? Math.ceil((new Date(item.expirationDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const isExpiring = daysUntilExpiration !== null && daysUntilExpiration <= 7 && daysUntilExpiration >= 0
  const isExpired = daysUntilExpiration !== null && daysUntilExpiration < 0

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-medium text-gray-900">
            {item.item?.name}
            {item.brand && <span className="text-gray-600"> • {item.brand}</span>}
          </h4>
          <div className="text-sm text-gray-500">
            {item.amount}{item.unit} × {item.quantity} 
            {item?.store?.name && ` • ${item.store.name}`}
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(item)}
            className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 text-gray-400 hover:text-red-600 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Expiration Status */}
      {(isExpiring || isExpired) && (
        <div className={`flex items-center gap-1 mb-2 text-xs px-2 py-1 rounded-md ${
          isExpired 
            ? 'bg-red-50 text-red-700 border border-red-200' 
            : 'bg-yellow-50 text-yellow-700 border border-yellow-200'
        }`}>
          <AlertTriangle size={12} />
          <span>
            {isExpired 
              ? `Expired ${Math.abs(daysUntilExpiration!)} days ago`
              : `Expires in ${daysUntilExpiration} days`
            }
          </span>
        </div>
      )}

      {/* Price and Date Info */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Unit Price:</span>
          <span className="font-medium">${item.price.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-semibold">
          <span>Total:</span>
          <span className="text-green-600">${totalPrice.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xs text-gray-500 pt-1 border-t">
          {item.dateBought && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
                <span>
                  Bought: {new Date(item.dateBought).toLocaleDateString()}
                </span>
            </span>
          )}
          {item.expirationDate && (
            <span>
              Exp: {new Date(item.expirationDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
