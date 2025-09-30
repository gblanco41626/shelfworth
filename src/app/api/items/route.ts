import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Item } from '@/types';

export const GET = withApiAuth(async ({ user, request }) => {
  const { searchParams } = request.nextUrl;
  const filter = searchParams.get('filter');

  const items = await db.item.findMany({
    where: {
      userId: user.id,
      ...(filter === 'outofstock' && { stock: 0, buy: false }),
      ...(filter === 'shoppinglist' && { buy: true, storeId: null }),
    },
    include: {
      category: true,
      purchases: {
        orderBy: { dateBought: { sort: 'desc', nulls: 'last' } },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(items);
});

export const POST = withApiAuth(async ({ user, request }) => {
  const body: Partial<Item> = await request.json();
  const { name, categoryId } = body;

  // Basic validation
  if (!name) {
    return NextResponse.json(
      { error: 'Name is required' },
      { status: 400 },
    );
  }

  const item = await db.item.create({
    data: {
      name,
      categoryId: categoryId || null,
      userId: user.id,
    },
    include: {
      category: true,
      purchases: true,
    },
  });

  return NextResponse.json(item, { status: 201 });
});
