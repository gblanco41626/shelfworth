
import type { Category } from './category';
import type { Purchase } from './purchase';
import type { Prisma } from '@prisma/client';

export interface Item {
  id: string
  name: string
  stock: number
  stockIncrement?: number
  categoryId?: string | null
  userId: string
  storeId?: string | null
  createdAt: Date
  updatedAt: Date
  category?: Category
  purchases?: Purchase[]
  buy: boolean
}

export type ItemWithRelations = Prisma.ItemGetPayload<{
  include: {
    category: true,
    purchases: { include: { store: true } },
  },
}>;
