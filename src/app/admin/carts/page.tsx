'use client'

import { useState, useEffect } from 'react'
import { Card, Icon, IconButton } from '@/components/tokens'
import type { Cart, Item } from '@/types'
import { QuickPurchaseForm } from '@/components/admin/quick-purchase-form'

export default function HomePage() {
  const [carts, setCarts] = useState<Cart[]>([])
  
  const fetchCarts = async () => {
    try {
      const response = await fetch('/api/carts')
      if (response.ok) {
        const strs = await response.json()
        setCarts(strs)
      }
    } catch (error) {
      console.error('Error fetching stores:', error)
    }
  }

  useEffect(() => {
    fetchCarts()

  }, []);

  if (carts.length === 0) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <div className="text-sm text-slate-500">All good! No carts to manage.</div>
          </Card>
        </div>)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {carts.map((cart) => (
        <Card
          title={`${cart.name}`}
          icon={<Icon.Store />}
          // actions={}
          key={cart.id}
        >
          {cart.items.map((item) => (
            <div key={item.id} className="flex flex-col items-center justify-between gap-3 rounded-xl ring-1 ring-slate-200 p-3">
              <div className="font-medium text-sm text-slate-800">{item.name}</div>
              <div className="flex gap-2 items-center">
                <QuickPurchaseForm item={item}
                  onSubmit={fetchCarts}
                />
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  )
}
