import { NextResponse } from 'next/server';

import { withApiAuth } from '@/lib/api-auth';
import { db } from '@/lib/db';

import type { Purchase } from '@/types';

export const GET = withApiAuth(async ({ user }) => {
  const purchases = await db.purchase.findMany({
    where: { userId: user.id },
    include: {
      item: { include: { category: true } },
      store: true,
    },
    orderBy: { dateBought: { sort: 'desc', nulls: 'last' } },
  });

  return NextResponse.json(purchases);
});

export const POST = withApiAuth(async ({ user, request }) => {
  const body: Partial<Purchase> = await request.json();
  const {
    itemId, brand, unit, amount, dateBought,
    expirationDate, quantity, storeId, price,
  } = body;

  // Basic validation
  if (!itemId || !unit || !amount || !price || !quantity) {
    return NextResponse.json(
      { error: 'ItemId, unit, amount, price,  and quantity are required' },
      { status: 400 },
    );
  }

  const purchase = await db.purchase.create({
    data: {
      itemId,
      brand,
      unit,
      amount: parseFloat(amount.toString()),
      dateBought: dateBought ? new Date(dateBought) : null,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
      quantity: parseInt(quantity.toString()),
      storeId,
      price: parseFloat(price.toString()),
      userId: user.id,
    },
    include: {
      item: { include: { category: true } },
    },
  });

  return NextResponse.json(purchase, { status: 201 });
});
