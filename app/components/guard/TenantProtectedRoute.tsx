"use client"

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface ProtectedRouteProps {
  children: ReactNode;
}

const TenantProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('nrv-user') as any) ;
    console.log({user: user?.user?.isOnboarded});
    
    if (!user) {
      router.push('/sign-in');
    }
  }, [router]);

  return <>{children}</>;
};

export default TenantProtectedRoute;
