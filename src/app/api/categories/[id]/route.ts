import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Category } from '@/types';

export const GET = withApiAuth(async ({ user, params }) => {
  const { id } = params as { id: string };

  const category = await db.category.findUnique({
    where: { id, userId: user.id },
  });

  if (!category) {
    return NextResponse.json(
      { error: 'category not found' },
      { status: 404 },
    );
  }

  return NextResponse.json(category);
});

export const PUT = withApiAuth(async ({ user, request, params }) => {
  const { id } = await params as { id: string };

  const body: Partial<Category> = await request.json();
  const { name } = body;

  const category = await db.category.update({
    where: { id, userId: user.id },
    data: {
      ...(name && { name }),
    },
  });

  return NextResponse.json(category);
});

export const DELETE = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  await db.category.delete({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ deleted: true });
});
