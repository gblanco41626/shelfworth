import { NextResponse } from 'next/server';

import { TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { NextRequest } from 'next/server';

// GET /api/stores/carts - Get all stores for user
export async function GET(_request: NextRequest) {
  try {
    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const stores = await db.store.findMany({
      where: {
        userId,
        items: {
          some: {},
        },
      },
      include: {
        items: { include: { category: true } },
      },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Error fetching stores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 },
    );
  }
}
