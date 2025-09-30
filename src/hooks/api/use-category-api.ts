
import { useToast } from '../use-toast';

import { useApi } from './use-api';

import type { Category } from '@/types';

export function useCategoryApi() {

  const api = useApi({
    showErrorToast: true,
    autoRetry: true,
    retryAttempts: 2,
  });

  const toast = useToast();

  const getCategories = async () => {
    let result: Category[] = [];

    try {
      const response = await api.get('/api/categories');
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result || [];
  };

  const getCategory = async (id: string) => {
    let result: Category | null = null;

    try {
      const response = await api.get(`/api/categories/${id}`);
      if (response.status === 200) {
        result = response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const createCategory = async (data: Partial<Category>) => {
    let result: Category | null = null;

    try {
      const response = await api.post('/api/categories', data);
      if (response.status === 201) {
        toast.success('Category created');
        result = await response.data;
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    let result: Category | null = null;

    try {
      const response = await api.put(`/api/categories/${id}`, data);
      if (response.status === 200) {
        result = await response.data;
        toast.success('Category updated');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }

    return result;
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      if (response.status === 200) {
        toast.success('Category deleted');
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch ( error ) {
      toast.error('Something went wrong');
    }
  };

  return {
    ...api,
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
