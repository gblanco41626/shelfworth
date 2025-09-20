export interface Category {
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateCategoryData {
  name: string
}

export interface UpdateCategoryData {
  name?: string
}
