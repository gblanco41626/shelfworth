import { db } from '@/lib/db'
import { Prisma } from '@prisma/client';

type ItemWithRels = Prisma.ItemGetPayload<{
  include: {
    category: true,
    purchases: { include: { store: true }, orderBy: { dateBought: "desc" } },
  };
}>;

export const ItemUtils = {

  getItemData: async (itemId: string): Promise<ItemWithRels | null> => {
    const item = await db.item.findUnique({
      where: { id: itemId },
      include: {
        category: true,
        purchases: { include: { store: true }, orderBy: { dateBought: "desc" } },
      },
    });

    return item;
  }

}
