import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

export const GET = withApiAuth(async ({ user }) => {
  const stores = await db.store.findMany({
    where: {
      userId: user.id,
      items: {
        some: {},
      },
    },
    include: {
      items: { include: { category: true } },
    },
    orderBy: { name: 'asc' },
  });

  return NextResponse.json(stores);
});
