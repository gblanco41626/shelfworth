import type { Category } from './category'
import type { Purchase } from './purchase'
import { Prisma } from '@prisma/client'

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

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    category: true,
    purchases: { include: { store: true } },
  },
}>;
