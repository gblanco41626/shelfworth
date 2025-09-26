import { NextResponse } from 'next/server';

import { ItemUtils , TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { CreatePurchaseData } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/purchases - Get all purchases
export async function GET(_request: NextRequest) {
  try {
    const userId = TEMP_USER_ID;

    const purchases = await db.purchase.findMany({
      where: { userId },
      include: {
        item: { include: { category: true } },
        store: true,
      },
      orderBy: { dateBought: { sort: 'desc', nulls: 'last' } },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 },
    );
  }
}

// POST /api/purchases - Create new purchase
export async function POST(request: NextRequest) {
  try {
    const body: CreatePurchaseData = await request.json();
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

    const userId = TEMP_USER_ID;

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
        userId,
      },
      include: {
        item: { include: { category: true } },
      },
    });

    await ItemUtils.updateItemStock(itemId, quantity);

    return NextResponse.json(purchase, { status: 201 });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to add purchase' },
      { status: 500 },
    );
  }
}
