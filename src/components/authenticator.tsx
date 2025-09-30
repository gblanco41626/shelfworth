'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

import { SIGNIN_URL } from '@/lib';

interface AuthenticatorProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  redirectTo?: string
  showSignInButton?: boolean
  requireAuth?: boolean
}

export default function Authenticator({
  children,
  redirectTo = SIGNIN_URL,
}: AuthenticatorProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session) {
      // Delay redirect to avoid flash
      const timer = setTimeout(() => {
        setShouldRedirect(true);
        router.push(redirectTo);
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [session, status, redirectTo, router]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Not authenticated
  if (!session) {
    if (shouldRedirect) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <p className="text-gray-600">Redirecting to signin...</p>
          </div>
        </div>
      );
    }

    return ;
  }

  // Authenticated or auth not required
  return children;
}
