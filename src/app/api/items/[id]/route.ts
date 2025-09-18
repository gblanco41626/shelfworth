import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { UpdateItemData } from '@/types'

// GET /api/items/[id] - Get specific item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await db.item.findUnique({
      where: { id: params.id },
      include: { category: true }
    })

    if (!item) {
      return NextResponse.json(
        { error: 'item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(item)
  } catch (error) {
    console.error('Error fetching item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch item' },
      { status: 500 }
    )
  }
}

// PUT /api/items/[id] - Update item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body: UpdateItemData = await request.json()
    const { name, categoryId } = body
    const { id } = await params

    const item = await db.item.update({
      where: { id: id },
      data: {
        ...(name && { name }),
        ...(categoryId !== undefined && { categoryId: categoryId || null })
      },
      include: { category: true }
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

// DELETE /api/items/[id] - Delete item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await db.item.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'item deleted successfully' })
  } catch (error) {
    console.error('Error deleting item:', error)
    return NextResponse.json(
      { error: 'Failed to delete item' },
      { status: 500 }
    )
  }
}
