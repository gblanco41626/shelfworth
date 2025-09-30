import { db } from '@/lib/db';

import { TEMP_USER_ID } from './constants';

import type { ItemWithRelations, PurchaseWithRelations, Store, Item } from '@/types';

export const ItemUtils = {
  getItemData: async (itemId: string): Promise<{
    item: ItemWithRelations | null,
    purchases: PurchaseWithRelations[],
    stores: Store[] | null
  }> => {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: {
        category: true,
        purchases: {
          include: { store: true },
          orderBy: { dateBought: { sort: 'desc', nulls: 'last' } },
        },
      },
    });

    const purchases = await db.purchase.findMany({
      where: { itemId },
      include: {
        item: true,
        store: true,
      },
    });

    const storeIds = purchases.map((p) => p.storeId ?? '');
    let stores: Store[] = [];

    if (storeIds.length > 0) {
      stores = await db.store.findMany({
        where: {
          id: { in: storeIds },
        },
      });
    }

    return { item, purchases, stores };
  },

  // Update item stock after purchase changes
  updateItemStock: async (itemId: string, stockIncrement: number): Promise<void> => {
    await db.item.update({
      where: { id: itemId },
      data: {
        stock: { increment: stockIncrement },
        storeId: null,
        buy: false,
      },
    });
  },

  // Get low stock items (stock below threshold)
  getLowStockItems: async (threshold: number = 1): Promise<object[]> => await db.item.findMany({
      where: {
        userId: TEMP_USER_ID,
        stock: { lte: threshold },
      },
    }),

  // Get out of stock items
  getOutOfStockItems: async (): Promise<Item[]> => await db.item.findMany({
      where: {
        userId: TEMP_USER_ID,
        stock: 0,
      },
    }),
};
