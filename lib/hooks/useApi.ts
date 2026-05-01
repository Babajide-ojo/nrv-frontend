import { useState, useCallback, useRef } from 'react';
import { apiService } from '@/lib/api';
import { ApiResponse } from '@/types';

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: string) => void;
  cacheKey?: string;
  cacheTime?: number;
  enabled?: boolean;
}

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiReturn<T> extends UseApiState<T> {
  execute: (...args: any[]) => Promise<T | null>;
  reset: () => void;
  refetch: () => Promise<T | null>;
}

// Simple cache implementation
const cache = new Map<string, { data: any; timestamp: number }>();

const getCachedData = (key: string, cacheTime: number): any | null => {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < cacheTime) {
    return cached.data;
  }
  if (cached) {
    cache.delete(key);
  }
  return null;
};

const setCachedData = (key: string, data: any): void => {
  cache.set(key, { data, timestamp: Date.now() });
};

export function useApi<T = any>(
  apiCall: (...args: any[]) => Promise<ApiResponse<T>>,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const {
    onSuccess,
    onError,
    cacheKey,
    cacheTime = 5 * 60 * 1000, // 5 minutes default
    enabled = true,
  } = options;

  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const abortControllerRef = useRef<AbortController | null>(null);
  const lastCallRef = useRef<(...args: any[]) => Promise<ApiResponse<T>>>(apiCall);

  const reset = useCallback(() => {
    setState({
      data: null,
      loading: false,
      error: null,
    });
  }, []);

  const execute = useCallback(
    async (...args: any[]): Promise<T | null> => {
      if (!enabled) return null;

      // Check cache first
      if (cacheKey) {
        const cachedData = getCachedData(cacheKey, cacheTime);
        if (cachedData) {
          setState({
            data: cachedData,
            loading: false,
            error: null,
          });
          onSuccess?.(cachedData);
          return cachedData;
        }
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setState(prev => ({
        ...prev,
        loading: true,
        error: null,
      }));

      try {
        const response = await apiCall(...args);
        const data = response.data;

        setState({
          data,
          loading: false,
          error: null,
        });

        // Cache the result
        if (cacheKey) {
          setCachedData(cacheKey, data);
        }

        onSuccess?.(data);
        return data;
      } catch (error: any) {
        // Don't update state if request was aborted
        if (error.name === 'AbortError') {
          return null;
        }

        const errorMessage = error.message || 'An error occurred';
        
        setState(prev => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));

        onError?.(errorMessage);
        return null;
      } finally {
        abortControllerRef.current = null;
      }
    },
    [apiCall, enabled, cacheKey, cacheTime, onSuccess, onError]
  );

  const refetch = useCallback(async (): Promise<T | null> => {
    // Clear cache if refetching
    if (cacheKey) {
      cache.delete(cacheKey);
    }
    return execute();
  }, [execute, cacheKey]);

  return {
    ...state,
    execute,
    reset,
    refetch,
  };
}

// Specialized hooks for common HTTP methods
export function useGet<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (config?: any) => apiService.get<T>(url, config),
    [url]
  );

  return useApi(apiCall, options);
}

export function usePost<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any, config?: any) => apiService.post<T>(url, data, config),
    [url]
  );

  return useApi(apiCall, options);
}

export function usePut<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any, config?: any) => apiService.put<T>(url, data, config),
    [url]
  );

  return useApi(apiCall, options);
}

export function useDelete<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (config?: any) => apiService.delete<T>(url, config),
    [url]
  );

  return useApi(apiCall, options);
}

export function usePatch<T = any>(
  url: string,
  options: UseApiOptions<T> = {}
): UseApiReturn<T> {
  const apiCall = useCallback(
    (data?: any, config?: any) => apiService.patch<T>(url, data, config),
    [url]
  );

  return useApi(apiCall, options);
}

// Hook for file uploads
export function useFileUpload<T = any>(
  url: string,
  options: UseApiOptions<T> & {
    onProgress?: (progress: number) => void;
  } = {}
): UseApiReturn<T> & {
  uploadFile: (file: File) => Promise<T | null>;
  uploadFiles: (files: File[]) => Promise<T | null>;
} {
  const { onProgress, ...apiOptions } = options;

  const uploadFileCall = useCallback(
    (file: File) => apiService.uploadFile<T>(url, file, onProgress),
    [url, onProgress]
  );

  const uploadFilesCall = useCallback(
    (files: File[]) => apiService.uploadFiles<T>(url, files, onProgress),
    [url, onProgress]
  );

  const { execute, ...rest } = useApi(uploadFileCall, apiOptions);

  const uploadFile = useCallback(
    async (file: File): Promise<T | null> => {
      return execute(file);
    },
    [execute]
  );

  const uploadFiles = useCallback(
    async (files: File[]): Promise<T | null> => {
      return uploadFilesCall(files).then(response => response.data).catch(() => null);
    },
    [uploadFilesCall]
  );

  return {
    execute,
    ...rest,
    uploadFile,
    uploadFiles,
  };
} 