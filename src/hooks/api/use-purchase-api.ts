
import { useToast } from '../use-toast';

import { useApi } from './use-api';

import type { Purchase } from '@/types';

export function usePurchaseApi() {

  const api = useApi({
    showErrorToast: true,
    autoRetry: true,
    retryAttempts: 2,
  });

  const toast = useToast();

  const getPurchases = async () => {
    let result: Purchase[] = [];

    try {
      const response = await api.get('/api/purchases');
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const getPurchase = async (id: string) => {
    let result: Purchase | null = null;

    try {
      const response = await api.get(`/api/purchases/${id}`);
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const createPurchase = async (data: Partial<Purchase>) => {
    let result: Purchase | null = null;

    try {
      const response = await api.post('/api/purchases', data);
      if (response.status === 201) {
        toast.success('Purchase created');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const updatePurchase = async (id: string, data: Partial<Purchase>) => {
    let result: Purchase | null = null;

    try {
      const response = await api.put(`/api/purchases/${id}`, data);
      if (response.status === 200) {
        result = await response.data;
        toast.success('Purchase updated');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const deletePurchase = async (id: string) => {
    try {
      const response = await api.delete(`/api/purchases/${id}`);
      if (response.status === 200) {
        toast.success('Purchase deleted');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }
  };

  return {
    ...api,
    getPurchases,
    getPurchase,
    createPurchase,
    updatePurchase,
    deletePurchase,
  };
}
