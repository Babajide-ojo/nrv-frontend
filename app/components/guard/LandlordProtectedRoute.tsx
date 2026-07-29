"use client"

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  clearAuthSession,
  isSessionIdleExpired,
} from '@/lib/sessionIdle';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const raw = localStorage.getItem('nrv-user');
    if (!raw) {
      router.push('/sign-in');
      return;
    }

    try {
      const user = JSON.parse(raw);
      if (!user?.accessToken) {
        clearAuthSession();
        router.push('/sign-in');
        return;
      }
      if (isSessionIdleExpired()) {
        clearAuthSession();
        router.push(
          '/sign-in?reason=' +
            encodeURIComponent(
              'Your session expired due to inactivity. Please sign in again.',
            ),
        );
      }
    } catch {
      clearAuthSession();
      router.push('/sign-in');
    }
  }, [router]);

  return <>{children}</>;
};

export default ProtectedRoute;
