import { useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/redux/hooks';
import { 
  loginUser, 
  createUser, 
  verifyAccount, 
  clearUserToken, 
  clearError
} from '@/redux/slices/userSlice';
import { LoginFormData, SignUpFormData, UserToken } from '@/types';
import { getStoredData, removeStoredData } from '@/helpers/utils';

interface UseAuthReturn {
  user: UserToken | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginFormData) => Promise<void>;
  register: (userData: SignUpFormData) => Promise<void>;
  verify: (code: string, email: string) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { data: user, loading, error } = useAppSelector((state) => state.user);

  const isAuthenticated = !!user?.accessToken;

  const login = useCallback(async (credentials: LoginFormData) => {
    try {
      await dispatch(loginUser(credentials)).unwrap();
      router.push('/dashboard/landlord');
    } catch (error) {
      // Error is handled by Redux slice
      console.error('Login failed:', error);
    }
  }, [dispatch, router]);

  const register = useCallback(async (userData: SignUpFormData) => {
    try {
      await dispatch(createUser(userData)).unwrap();
      // User will be redirected to verification page
    } catch (error) {
      console.error('Registration failed:', error);
    }
  }, [dispatch]);

  const verify = useCallback(async (code: string, email: string) => {
    try {
      await dispatch(verifyAccount({ confirmationCode: code, email })).unwrap();
      router.push('/dashboard/landlord');
    } catch (error) {
      console.error('Verification failed:', error);
    }
  }, [dispatch, router]);

  const logout = useCallback(() => {
    dispatch(clearUserToken());
    removeStoredData('nrv-user');
    removeStoredData('emailToVerify');
    router.push('/sign-in');
  }, [dispatch, router]);

  const clearAuthError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // Check for stored user data on mount
  useEffect(() => {
    const storedUser = getStoredData('nrv-user', null);
    if (storedUser && !user) {
      // User data exists in localStorage but not in Redux state
      // This could happen on page refresh
      // The Redux Persist should handle this, but we can add a fallback
      console.log('Found stored user data');
    }
  }, [user]);

  return {
    user,
    loading: loading === 'pending',
    error,
    isAuthenticated,
    login,
    register,
    verify,
    logout,
    clearAuthError,
  };
};

// Hook for protected routes
export const useRequireAuth = (redirectTo: string = '/sign-in') => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, loading, router, redirectTo]);

  return { isAuthenticated, loading };
};

// Hook for role-based access
export const useRequireRole = (requiredRole: 'landlord' | 'tenant', redirectTo: string = '/sign-in') => {
  const { user, isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated && user?.user?.accountType !== requiredRole) {
      // Redirect to appropriate dashboard based on user role
      const userRole = user?.user?.accountType;
      if (userRole === 'landlord') {
        router.push('/dashboard/landlord');
      } else if (userRole === 'tenant') {
        router.push('/dashboard/tenant');
      } else {
        router.push(redirectTo);
      }
    }
  }, [isAuthenticated, loading, user, requiredRole, router, redirectTo]);

  return { 
    isAuthenticated, 
    loading, 
    hasRequiredRole: user?.user?.accountType === requiredRole 
  };
}; 