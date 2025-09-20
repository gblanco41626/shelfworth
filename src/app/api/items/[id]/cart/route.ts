import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { UpdateItemCartState } from '@/types';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const body: UpdateItemCartState = await request.json()
    const { storeId } = body
    console.log(`${id} -  ${storeId}`)

    const item = await db.item.update({
      where: { id: id },
      data: {
        storeId
      }
    })

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error updating item:', error)
    return NextResponse.json(
      { error: 'Failed to update item' },
      { status: 500 }
    )
  }
}
