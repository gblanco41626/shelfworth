import type { Item } from './item';

export interface Store {
  id: string
  name: string
  items?: Item[]
  userId: string
  createdAt: Date
  updatedAt: Date
}
