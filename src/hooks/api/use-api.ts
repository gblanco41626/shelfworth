/* eslint-disable no-console */
'use client';

import { useRouter } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';
import { useState, useCallback } from 'react';

import { SIGNIN_URL } from '@/lib';

interface ApiOptions {
  redirectOnAuth?: boolean
  redirectTo?: string
  showErrorToast?: boolean
  autoRetry?: boolean
  retryAttempts?: number
  onError?: (error: ApiError) => void
  onSuccess?: (data: any) => void
  onUnauthorized?: () => void
}

interface ApiError extends Error {
  status?: number
  code?: string
}

interface ApiState {
  loading: boolean
  error: ApiError | null
  lastResponse: any
}

export function useApi(options: ApiOptions = {}) {
  const {
    redirectOnAuth = true,
    redirectTo = SIGNIN_URL,
    showErrorToast = false,
    autoRetry = false,
    retryAttempts = 1,
    onError,
    onSuccess,
    onUnauthorized,
  } = options;

  const router = useRouter();
  const { data: session, status } = useSession();
  const [state, setState] = useState<ApiState>({
    loading: false,
    error: null,
    lastResponse: null,
  });

  const handleUnauthorized = useCallback(() => {
    if (onUnauthorized) {
      onUnauthorized();
    } else if (redirectOnAuth) {
      const currentUrl = window.location.pathname + window.location.search;
      const callbackUrl = encodeURIComponent(currentUrl);
      router.push(`${redirectTo}?callbackUrl=${callbackUrl}`);
    } else {
      // Trigger NextAuth signin
      signIn();
    }
  }, [onUnauthorized, redirectOnAuth, router, redirectTo]);

  const makeRequest = useCallback(async (
    url: string,
    options: RequestInit = {},
    attempt = 1,
  ): Promise<any> => {
    if (attempt === 1) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }

    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      });

      // Handle unauthorized
      if (response.status === 401) {
        setState(prev => ({ ...prev, loading: false }));
        handleUnauthorized();
        return null;
      }

      // Handle other errors
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          error: `HTTP ${response.status}`,
        }));

        const error = new Error(errorData.error || errorData.message || 'Request failed') as ApiError;
        error.status = response.status;
        error.code = errorData.code;

        throw error;
      }

      const data = await response.json().catch(() => null);
      setState(prev => ({ ...prev, loading: false, lastResponse: data }));

      if (onSuccess) {
        onSuccess(data);
      }

      return { data, status: response.status };
    } catch (error) {
      const apiError = error as ApiError;

      // Retry logic
      if (autoRetry && attempt < retryAttempts && apiError.status !== 401) {
        console.warn(`API call failed, retrying... (${attempt}/${retryAttempts})`);
        return makeRequest(url, options, attempt + 1);
      }

      setState(prev => ({ ...prev, loading: false, error: apiError }));

      if (showErrorToast) {
        // You can replace this with your toast library
        console.error('API Error:', apiError.message);
      }

      if (onError) {
        onError(apiError);
      }

      throw apiError;
    }
  }, [autoRetry, retryAttempts, showErrorToast, onError, onSuccess, handleUnauthorized]);

  // HTTP method helpers
  const get = useCallback((url: string, options: RequestInit = {}) => makeRequest(url, { ...options, method: 'GET' }), [makeRequest]);

  const post = useCallback((url: string, data?: any, options: RequestInit = {}) => makeRequest(url, {
      ...options,
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }), [makeRequest]);

  const put = useCallback((url: string, data?: any, options: RequestInit = {}) => makeRequest(url, {
      ...options,
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    }), [makeRequest]);

  const del = useCallback((url: string, options: RequestInit = {}) => makeRequest(url, { ...options, method: 'DELETE' }), [makeRequest]);

  const patch = useCallback((url: string, data?: any, options: RequestInit = {}) => makeRequest(url, {
      ...options,
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    }), [makeRequest]);

  return {
    // State
    loading: state.loading,
    error: state.error,
    lastResponse: state.lastResponse,
    isAuthenticated: !!session,
    sessionStatus: status,

    // Methods
    request: makeRequest,
    get,
    post,
    put,
    delete: del,
    patch,

    // Utils
    clearError: () => setState(prev => ({ ...prev, error: null })),
    clearResponse: () => setState(prev => ({ ...prev, lastResponse: null })),
  };
}
