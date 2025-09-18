import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { UpdatePurchaseData } from '@/types'

// GET /api/purchases/[id] - Get specific purchase
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const purchase = await db.purchase.findUnique({
      where: { id: id },
      include: { item: { include: { category: true } } }
    })

    if (!purchase) {
      return NextResponse.json(
        { error: 'Grocery item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Error fetching purchase:', error)
    return NextResponse.json(
      { error: 'Failed to fetch purchase' },
      { status: 500 }
    )
  }
}

// PUT /api/purchases/[id] - Update purchase
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const body: UpdatePurchaseData = await request.json()
    const { 
      brand, unit, amount, dateBought, 
      expirationDate, quantity, storeName, price 
    } = body

    const purchase = await db.purchase.update({
      where: { id: id },
      data: {
        ...(brand !== undefined && { brand }),
        ...(unit && { unit }),
        ...(amount !== undefined && { amount: parseFloat(amount.toString()) }),
        ...(dateBought !== undefined && { 
          dateBought: dateBought ? new Date(dateBought) : null 
        }),
        ...(expirationDate !== undefined && { 
          expirationDate: expirationDate ? new Date(expirationDate) : null 
        }),
        ...(quantity !== undefined && { quantity: parseInt(quantity.toString()) }),
        ...(storeName !== undefined && { storeName }),
        ...(price !== undefined && { price: parseFloat(price.toString()) })
      },
      include: { 
        item: { include: { category: true } }
      }
    })

    return NextResponse.json(purchase)
  } catch (error) {
    console.error('Error updating purchase:', error)
    return NextResponse.json(
      { error: 'Failed to update purchase' },
      { status: 500 }
    )
  }
}

// DELETE /api/purchases/[id] - Delete purchase
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    await db.purchase.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'Grocery item deleted successfully' })
  } catch (error) {
    console.error('Error deleting purchase:', error)
    return NextResponse.json(
      { error: 'Failed to delete purchase' },
      { status: 500 }
    )
  }
}
