import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TEMP_USER_ID } from '@/lib'

// GET /api/items/out-of-stock - Get all items with their purchases
export async function GET(request: NextRequest) {
  try {
    const userId = TEMP_USER_ID

    const items = await db.item.findMany({
      where: {
        userId: userId,
        stock: 0,
        buy: false
      }
    })

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}
