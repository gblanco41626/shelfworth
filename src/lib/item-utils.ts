import { db } from '@/lib/db'
import type { ItemWithRelations, PurchaseWithRelations, Store } from '@/types'

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
        purchases: { include: { store: true }, orderBy: { dateBought: "desc" } },
      },
    });

    const purchases = await db.purchase.findMany({
      where: { itemId: itemId },
      include : {
        item: true,
        store: true
      }
    });

    const storeIds = purchases.map((p) => p.storeId ?? '');
    let stores: Store[] = []

    if (storeIds.length > 0) {
      stores = await db.store.findMany({
        where: {
          id: { in: storeIds }
        }
      })
    }

    return { item, purchases, stores }
  }
}
