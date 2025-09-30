
import { useToast } from '../use-toast';

import { useApi } from './use-api';

import type { Item } from '@/types';

export function useItemApi() {

  const api = useApi({
    showErrorToast: true,
    autoRetry: true,
    retryAttempts: 2,
  });

  const toast = useToast();

  const getItems = async () => {
    let result: Item[] = [];

    try {
      const response = await api.get('/api/items');
      if (response.status === 200) {
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const getItem = async (id: string) => {
    let result: Item | null = null;

    try {
      const response = await api.get(`/api/items/${id}`);
      if (response.status === 200) {
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const createItem = async (data: Partial<Item>) => {
    let result: Item | null = null;

    try {
      const response = await api.post('/api/items', data);
      if (response.status === 200) {
        toast.success('Item created');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const updateItem = async (id: string, data: Partial<Item>) => {
    let result: Item | null = null;

    try {
      const response = await api.put(`/api/items/${id}`, data);
      if (response.status === 200) {
        toast.success('Item updated');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const deleteItem = async (id: string) => {
    try {
      await api.delete(`/api/pantry/items/${id}`);
      toast.success('Category deleted');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }
  };

  const getOutOfStockItems = async () => {
    let result: Item[] = [];

    try {
      const response = await api.get('/api/items?filter=outofstock');
      if (response.status === 200) {
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const getShoppingList = async () => {
    let result: Item[] = [];

    try {
      const response = await api.get('/api/items?filter=shoppinglist');
      if (response.status === 200) {
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const addToShoppingList = async (id: string) => {
    let result: Item | null = null;

    try {
      const response = await api.put(`/api/items/${id}`, { buy: true });
      if (response.status === 200) {
        toast.success('Item added to shopping list');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const removeFromShoppingList = async (id: string) => {
    let result: Item | null = null;

    try {
      const response = await api.put(`/api/items/${id}`, { buy: false });
      if (response.status === 200) {
        toast.success('Item removed from shopping list');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const addItemToStoreCart = async (id: string, storeId: string) => {
    let result: Item | null = null;

    try {
      const response = await api.put(`/api/items/${id}`, { storeId });
      if (response.status === 200) {
        toast.success('Item added to store cart');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const zeroOutStock = async (id: string) => {
    let result: Item | null = null;

    try {
      const response = await api.put(`/api/items/${id}`, { stock: 0 });
      if (response.status === 200) {
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  return {
    ...api,
    getItems,
    getItem,
    createItem,
    updateItem,
    deleteItem,
    getOutOfStockItems,
    getShoppingList,
    addToShoppingList,
    removeFromShoppingList,
    addItemToStoreCart,
    zeroOutStock,
  };
}
