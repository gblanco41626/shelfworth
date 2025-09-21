'use client'

import { useState, useEffect } from 'react'
import { Card, Icon, IconButton } from '@/components/tokens'
import type { Item, Store } from '@/types'

export default function HomePage() {
  const [outOfStock, setOutOfStock] = useState<Item[]>([])
  const [shoppingList, setShoppingList] = useState<Item[]>([])
  const [stores, setStores] = useState<Store[]>([])

  const addToShoppingList = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}/shopping-list`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buy: true })
      })

      if (response.ok) {
        fetchShoppingList()
        fetchOutOfStock()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }
  
  const removeFromShoppingList = async (id: string) => {
    try {
      const response = await fetch(`/api/items/${id}/shopping-list`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buy: false })
      })

      if (response.ok) {
        fetchShoppingList()
        fetchOutOfStock()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const addToStoreCart = async (id: string, storeId: string) => {
    try {
      const response = await fetch(`/api/items/${id}/cart`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId })
      })

      if (response.ok) {
        fetchShoppingList()
        fetchOutOfStock()
      }
    } catch (error) {
      console.error('Error updating item:', error)
    }
  }

  const fetchOutOfStock = async () => {
    try {
      const response = await fetch('/api/items/out-of-stock')
      if (response.ok) {
        const items = await response.json()
        setOutOfStock(items)
      }
    } catch (error) {
      console.error('Error fetching out of stock items:', error)
    }
  }

  const fetchShoppingList = async () => {
    try {
      const response = await fetch('/api/items/shopping-list')
      if (response.ok) {
        const items = await response.json()
        setShoppingList(items)
      }
    } catch (error) {
      console.error('Error fetching out of stock items:', error)
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

  useEffect(() => {
    fetchOutOfStock()
    fetchShoppingList()
    fetchStores()

  }, []);

  return (
    <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <Card
        title="Shopping List"
        icon={<Icon.Cart />}
        actions={<span className="text-xs text-slate-500">{shoppingList.length} items</span>}
      >
        {shoppingList.length === 0 ? (
          <div className="text-sm text-slate-500">Your shopping list is empty.</div>
        ) : (
          <ul className="space-y-3">
            {shoppingList.map((item) => {
              return (
                <li key={item.id} className="flex items-center justify-between gap-3 rounded-xl ring-1 ring-slate-200 p-3">
                  <p className="font-medium text-sm text-slate-800">{item.name}</p>
                  <div className="flex gap-2 items-center">
                    <select
                      className="rounded-lg border-slate-300 text-sm"
                      onChange={(e) => e.target.value && addToStoreCart(item.id, e.target.value)}
                      required
                    >
                      <option value="">Add to store...</option>
                      {stores.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                    <IconButton.Delete onClick={() => removeFromShoppingList(item.id)} />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
      
      <Card
        title="Out of Stock"
        icon={<Icon.OutOfStock />}
        actions={<span className="text-xs text-slate-500">{outOfStock.length} items</span>}
      >
        {outOfStock.length === 0 ? (
          <div className="text-sm text-slate-500">All good! No out-of-stock items.</div>
        ) : (
          <ul className="space-y-3">
            {outOfStock.map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-3 rounded-xl ring-1 ring-slate-200 p-3">
                <p className="font-medium text-sm text-slate-800">{i.name}</p>
                <IconButton.Shop onClick={() => addToShoppingList(i.id)} />
              </li>
            ))}
          </ul>
        )}
      </Card>
    </section>
  )
}
