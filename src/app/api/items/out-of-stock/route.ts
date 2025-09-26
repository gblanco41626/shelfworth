import { NextResponse } from 'next/server';

import { TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { NextRequest } from 'next/server';

// GET /api/items/out-of-stock - Get all items with their purchases
export async function GET(_request: NextRequest) {
  try {
    const userId = TEMP_USER_ID;

    const items = await db.item.findMany({
      where: {
        userId,
        stock: 0,
        buy: false,
      },
    });

    return NextResponse.json(items);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch items: ${error}` },
      { status: 500 },
    );
  }
}
