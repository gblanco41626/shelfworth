import { NextResponse } from 'next/server';

import { db } from '@/lib/db';

import type { NextRequest } from 'next/server';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> },
) {
  try {
    const { id } = await params;

    const item = await db.item.update({
      where: { id },
      data: {
        stock: 0,
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
