import type { Item } from './item'

export interface Store {
  id: string
  name: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface CreateStoreData {
  name: string
}

export interface UpdateStoreData {
  name: string
}

export interface Cart {
  id: string
  name: string
  items: Item[]
}

