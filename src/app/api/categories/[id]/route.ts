import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import type { UpdateCategoryData } from '@/types'

// GET /api/categories/[id] - Get specific category
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const category = await db.category.findUnique({
      where: { id: id }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'category not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error fetching category:', error)
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    )
  }
}

// PUT /api/categories/[id] - Update category
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    const body: UpdateCategoryData = await request.json()
    const { name } = body

    const category = await db.category.update({
      where: { id: id },
      data: {
        ...(name && { name }),
      }
    })

    return NextResponse.json(category)
  } catch (error) {
    console.error('Error updating category:', error)
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    )
  }
}

// DELETE /api/categories/[id] - Delete category
export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; }> }
) {
  try {
    const { id } = await params

    await db.category.delete({
      where: { id: id }
    })

    return NextResponse.json({ message: 'category deleted successfully' })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    )
  }
}
