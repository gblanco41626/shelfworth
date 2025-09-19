import type { Category } from './category'
import type { Purchase } from './purchase'

export interface Item {
  id: string
  name: string
  stock: number
  categoryId?: string
  userId: string
  createdAt: Date
  updatedAt: Date
  category?: Category
  purchases?: Purchase[]
}

export interface CreateItemData {
  name: string
  stock?: number
  categoryId?: string
}

export interface UpdateItemData {
  name?: string
  stock?: number
  categoryId?: string
}
