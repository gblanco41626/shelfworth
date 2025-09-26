import { NextResponse } from 'next/server';

import { TEMP_USER_ID } from '@/lib';
import { db } from '@/lib/db';

import type { CreateCategoryData } from '@/types';
import type { NextRequest } from 'next/server';

// GET /api/categories - Get all categories for user
export async function GET(_request: NextRequest) {
  try {
    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const categories = await db.category.findMany({
      where: { userId },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch categories: ${error}` },
      { status: 500 },
    );
  }
}

// POST /api/categories - Create new category
export async function POST(request: NextRequest) {
  try {
    const body: CreateCategoryData = await request.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 },
      );
    }

    // For MVP, we'll use a hardcoded userId
    const userId = TEMP_USER_ID;

    const category = await db.category.create({
      data: { name, userId },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to add category' },
      { status: 500 },
    );
  }
}
