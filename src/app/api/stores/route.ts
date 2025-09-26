import { NextResponse } from 'next/server';

import { TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { CreateStoreData } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/stores - Get all stores for user
export async function GET(_request: NextRequest) {
  try {
    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const stores = await db.store.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(stores);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch stores: ${error}` },
      { status: 500 },
    );
  }
}

// POST /api/stores - Create new store
export async function POST(request: NextRequest) {
  try {
    const body: CreateStoreData = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Store name is required' },
        { status: 400 },
      );
    }

    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const store = await db.store.create({
      data: { name, userId },
    });

    return NextResponse.json(store, { status: 201 });
  } catch (error) {
    console.error('Error creating store:', error);
    return NextResponse.json(
      { error: 'Failed to add store' },
      { status: 500 },
    );
  }
}
