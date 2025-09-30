import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Item } from '@/types';

export const GET = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  const item = await db.item.findUnique({
    where: { id, userId: user.id },
    include: { category: true },
  });

  if (!item) {
    return NextResponse.json(
      { error: 'item not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(item);
});

export const PUT = withApiAuth(async ({ user, request, params }) => {
  const { id } = await params as { id: string };

  const body: Partial<Item> = await request.json();
  const { name, stock, categoryId, buy, storeId, stockIncrement } = body;

  const item = await db.item.update({
    where: { id, userId: user.id },
    data: {
      ...(name && { name }),
      ...(stock !== undefined && { stock }),
      ...(buy !== undefined && { buy }),
      ...(categoryId !== undefined && { categoryId: categoryId || null }),
      ...(storeId !== undefined && { storeId: storeId || null }),
      ...(stockIncrement && { stock: { increment: stockIncrement } }),
    },
    include: { category: true },
  });

  return NextResponse.json(item);
});

export const DELETE = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  await db.item.delete({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ delete: true });
});
