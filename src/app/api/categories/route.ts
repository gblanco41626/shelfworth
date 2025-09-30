import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Category } from '@/types';

export const GET = withApiAuth(async ({ user }) => {
  const categories = await db.category.findMany({
    where: { userId: user.id },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(categories);
});

export const POST = withApiAuth(async ({ user, request }) => {
  const body: Partial<Category> = await request.json();
  const { name } = body;

  if (!name) {
    return NextResponse.json(
      { error: 'Category name is required' },
      { status: 400 },
    );
  }

  const category = await db.category.create({
    data: { name, userId: user.id },
  });

  return NextResponse.json(category, { status: 201 });
});
