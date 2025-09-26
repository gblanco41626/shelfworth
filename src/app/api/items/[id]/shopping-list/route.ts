import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

import type { UpdateItemShoppingState } from '@/types';
import type { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> },
) {
  try {
    const { id } = await params;

    const body: UpdateItemShoppingState = await request.json();
    const { buy } = body;

    const item = await db.item.update({
      where: { id },
      data: {
        buy,
      },
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 },
    );
  }
}
