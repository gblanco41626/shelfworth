
import type { Item } from './item';
import type { Store } from './store';
import type { Prisma } from '@prisma/client';

export interface Purchase {
  id: string
  itemId: string
  storeId: string
  brand?: string
  unit: string           // "L", "g", "pack", "box", "oz", etc.
  amount: number         // 1.0, 500, 2, etc.
  dateBought?: Date
  expirationDate?: Date
  quantity: number       // How many of this specific item
  price: number         // Price paid for this specific item
  userId: string
  storeName?: string
  createdAt: Date
  updatedAt: Date
  item?: Item
  store?: Store
}

export type PurchaseWithRelations = Prisma.PurchaseGetPayload<{
  include: {
    item: true;
    store: true;
  };
}>;
