import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Purchase } from '@/types';

export const GET = withApiAuth(async ({ user, params }) => {
    const { id } = await params as { id: string };

    const purchase = await db.purchase.findUnique({
      where: { id, userId: user.id },
      include: {
        item: { include: { category: true } },
        store: true,
      },
    });

    if (!purchase) {
      return NextResponse.json(
        { error: 'Grocery item not found' },
        { status: 404 },
      );
    }

    return NextResponse.json(purchase);
});

export const PUT = withApiAuth(async ({ user, request, params }) => {
  const { id } = await params as { id: string };

  const body: Partial<Purchase> = await request.json();
  const {
    brand, unit, amount, dateBought,
    expirationDate, quantity, storeName, price,
  } = body;

  const purchase = await db.purchase.update({
    where: { id, userId: user.id },
    data: {
      ...(brand !== undefined && { brand }),
      ...(unit && { unit }),
      ...(amount !== undefined && { amount: parseFloat(amount.toString()) }),
      ...(dateBought !== undefined && {
        dateBought: dateBought ? new Date(dateBought) : null,
      }),
      ...(expirationDate !== undefined && {
        expirationDate: expirationDate ? new Date(expirationDate) : null,
      }),
      ...(quantity !== undefined && { quantity: parseInt(quantity.toString()) }),
      ...(storeName !== undefined && { storeName }),
      ...(price !== undefined && { price: parseFloat(price.toString()) }),
    },
    include: {
      item: { include: { category: true } },
    },
  });

  return NextResponse.json(purchase);
});

export const DELETE = withApiAuth(async ({ user, params }) => {
  const { id } = await params as { id: string };

  await db.purchase.delete({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ deleted: true });
});
