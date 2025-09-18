import { db } from '@/lib//db'

// Utility functions for stock management
export const StockUtils = {

  // Update item stock after purchase changes
  updateItemStock: async (itemId: string, stockIncrement: number): Promise<void> => {
    await db.item.update({
      where: { id: itemId },
      data: {
        stock: { increment: stockIncrement }
      }
    })
  },

  // Get low stock items (stock below threshold)
  getLowStockItems: async (userId: string, threshold: number = 1): Promise<object[]> => {
    return await db.item.findMany({
      where: {
        userId,
        stock: { lte: threshold }
      },
      include: {
        category: true,
        purchases: true
      }
    })
  },

  // Get out of stock items
  getOutOfStockItems: async (userId: string): Promise<object[]> => {
    return await db.item.findMany({
      where: {
        userId,
        stock: 0
      },
      include: {
        category: true,
        purchases: true
      }
    })
  }
}
