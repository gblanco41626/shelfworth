import { NextResponse } from 'next/server';

import { TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { CreateItemData } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/items - Get all items with their purchases
export async function GET(_request: NextRequest) {
  try {
    // For MVP, we'll use a hardcoded userId
    // TODO: Replace with actual user from session
    const userId = TEMP_USER_ID;

    const items = await db.item.findMany({
      where: { userId },
      include: {
        category: true,
        purchases: {
          orderBy: { dateBought: { sort: 'desc', nulls: 'last' } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(items);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 },
    );
  }
}

// POST /api/items - Create new item
export async function POST(request: NextRequest) {
  try {
    const body: CreateItemData = await request.json();
    const { name, categoryId } = body;

    // Basic validation
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 },
      );
    }

    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const item = await db.item.create({
      data: {
        name,
        categoryId: categoryId || null,
        userId,
      },
      include: {
        category: true,
        purchases: true,
      },
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json(
      { error: 'Failed to add item' },
      { status: 500 },
    );
  }
}
