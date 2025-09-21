import type { Category } from './category'
import type { Purchase } from './purchase'
import { Prisma } from '@prisma/client'

export interface Item {
  id: string
  name: string
  stock: number
  categoryId?: string | null
  userId: string
  storeId?: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
  purchases?: Purchase[]
  buy: boolean
}

export interface CreateItemData {
  name: string
  stock?: number
  categoryId?: string | null
}

export interface UpdateItemData {
  name?: string
  stock?: number
  categoryId?: string | null
}

export interface UpdateItemShoppingState {
  buy: boolean
}

export interface UpdateItemCartState {
  storeId?: string | null
}

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    category: true,
    purchases: { include: { store: true } },
  },
}>;
