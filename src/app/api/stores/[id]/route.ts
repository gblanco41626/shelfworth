import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Store } from '@/types';

export const GET = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  const store = await db.store.findUnique({
    where: { id, userId: user.id },
  });

  if (!store) {
    return NextResponse.json(
      { error: 'store not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(store);
});

export const PUT = withApiAuth(async ({ user, request, params }) => {
  const { id } = await params as { id: string };

  const body: Partial<Store> = await request.json();
  const { name } = body;

  const store = await db.store.update({
    where: { id, userId: user.id },
    data: {
      ...(name && { name }),
    },
  });

  return NextResponse.json(store);
});

export const DELETE = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  await db.store.delete({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ deleted: true });
});
