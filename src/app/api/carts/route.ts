import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { TEMP_USER_ID } from '@/lib'

// GET /api/stores/carts - Get all stores for user
export async function GET(request: NextRequest) {
  try {
    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID

    const stores = await db.store.findMany({
      where: {
        userId,
        items: {
          some: {}
        }
      },
      include: {
        items: { include: { category: true } },
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(stores)
  } catch (error) {
    console.error('Error fetching stores:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    )
  }
}
