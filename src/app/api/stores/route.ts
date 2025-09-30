import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Store } from '@/types';

export const GET = withApiAuth(async ({ user }) => {
  const stores = await db.store.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(stores);
});

export const POST = withApiAuth(async ({ user, request }) => {
  const body: Partial<Store> = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Store name is required' },
      { status: 400 },
    );
  }

  const store = await db.store.create({
    data: { name, userId: user.id },
  });

  return NextResponse.json(store, { status: 201 });
});
