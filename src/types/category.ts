export interface Category {
  id: string
  name: string
  userId: string
}

export interface CreateCategoryData {
  name: string
}

export interface UpdateCategoryData {
  name?: string
}
