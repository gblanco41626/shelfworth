
import { useToast } from '../use-toast';

import { useApi } from './use-api';

import type { Store } from '@/types';

export function useStoreApi() {

  const api = useApi({
    showErrorToast: true,
    autoRetry: true,
    retryAttempts: 2,
  });

  const toast = useToast();

  const getStores = async () => {
    let result: Store[] = [];

    try {
      const response = await api.get('/api/stores');
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const getStore = async (id: string) => {
    let result: Store | null = null;

    try {
      const response = await api.get(`/api/stores/${id}`);
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const createStore = async (data: Partial<Store>) => {
    let result: Store | null = null;

    try {
      const response = await api.post('/api/stores', data);
      if (response.status === 201) {
        toast.success('Store created');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const updateStore = async (id: string, data: Partial<Store>) => {
    let result: Store | null = null;

    try {
      const response = await api.put(`/api/stores/${id}`, data);
      if (response.status === 200) {
        result = await response.data;
        toast.success('Store updated');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const deleteStore = async (id: string) => {
    try {
      const response = await api.delete(`/api/stores/${id}`);
      if (response.status === 200) {
        toast.success('Store deleted');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }
  };

  const getCarts = async () => {
    let result: Store[] = [];

    try {
      const response = await api.get('/api/stores/carts');
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  return {
    ...api,
    getStores,
    getStore,
    createStore,
    updateStore,
    deleteStore,
    getCarts,
  };
}
