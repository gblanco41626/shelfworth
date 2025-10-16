import { db } from '@/lib/db';

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

  // Helper function to sort items by category then name
  sortItemsByCategoryAndName: (items: Item[]): Item[] => [...items].sort((a: Item, b: Item) => {
      // Handle undefined categories
      if (!a.category && !b.category) return 0;
      if (!a.category) return 1;  // Push undefined to end
      if (!b.category) return -1; // Push undefined to end

      // First, sort by category name
      const categoryComparison = a.category.name.localeCompare(
        b.category.name,
        undefined,
        { sensitivity: 'base' },
      );

      // If categories are different, return the category comparison
      if (categoryComparison !== 0) return categoryComparison;

      // If categories are the same, sort by item name
      return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
    }),
};
