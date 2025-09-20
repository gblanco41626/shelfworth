import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { UpdateStoreData } from '@/types'

// GET /api/stores/[id] - Get specific store
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const store = await db.store.findUnique({
      where: { id: id }
    })

    if (!store) {
      return NextResponse.json(
        { error: 'store not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error fetching store:', error)
    return NextResponse.json(
      { error: 'Failed to fetch store' },
      { status: 500 }
    )
  }
}

// PUT /api/stores/[id] - Update store
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const body: UpdateStoreData = await request.json()
    const { name } = body

    const store = await db.store.update({
      where: { id: id },
      data: {
        ...(name && { name }),
      }
    })

    return NextResponse.json(store)
  } catch (error) {
    console.error('Error updating store:', error)
    return NextResponse.json(
      { error: 'Failed to update store' },
      { status: 500 }
    )
  }
}

// DELETE /api/stores/[id] - Delete store
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    await db.store.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'store deleted successfully' })
  } catch (error) {
    console.error('Error deleting store:', error)
    return NextResponse.json(
      { error: 'Failed to delete store' },
      { status: 500 }
    )
  }
}
