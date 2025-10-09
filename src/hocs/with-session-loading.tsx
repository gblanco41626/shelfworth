'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import type { ComponentType, ReactNode } from 'react';

interface SessionLoadingOptions {
  redirectTo?: string
  requireAuth?: boolean
  loadingComponent?: ReactNode
  onUnauthenticated?: () => void
}

export default function withSessionLoading<T extends object>(
  WrappedComponent: ComponentType<T>,
  options: SessionLoadingOptions = {},
) {
  const {
    redirectTo = '/signin',
    requireAuth = true,
    loadingComponent,
    onUnauthenticated,
  } = options;

  return function SessionLoadingWrapper(props: T) {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
      if (status === 'loading') return;

      if (requireAuth && !session) {
        if (onUnauthenticated) {
          onUnauthenticated();
        } else {
          router.push(redirectTo);
        }
      }
    }, [session, status, router]);

    // Loading state
    if (status === 'loading') {
      return loadingComponent || (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">Loading...</p>
          </div>
        </div>
      );
    }

    // Unauthenticated state (while redirecting)
    if (requireAuth && !session) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600 text-lg">Redirecting to sign in...</p>
          </div>
        </div>
      );
    }

    // Authenticated - render component
    return <WrappedComponent {...props} />;
  };
}
