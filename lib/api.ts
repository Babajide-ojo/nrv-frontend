import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosProgressEvent } from 'axios';
import { API_URL } from '@/config/constant';
// Make sure to install @tanstack/react-query: npm install @tanstack/react-query
import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const userData = localStorage.getItem('nrv-user');
    if (userData) {
      try {
        const { accessToken } = JSON.parse(userData);
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      } catch (error) {
        console.warn('Error parsing user data from localStorage:', error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear user data and redirect to login
      localStorage.removeItem('nrv-user');
      window.location.href = '/sign-in';
    } else if (error.response?.status === 403) {
      // Forbidden
      console.error('Access forbidden');
    } else if (error.response?.status >= 500) {
      // Server error
      console.error('Server error:', error.response.data);
    }
    
    return Promise.reject(error);
  }
);

// Generic GET query hook
export function useApiQuery<T = unknown>(
  key: any[],
  url: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<T, Error, T, any[]>
) {
  return useQuery<T, Error, T, any[]>({
    ...options,
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get<T>(url, config);
      return response.data;
    },
  });
}

// Generic mutation hook (POST, PUT, DELETE, PATCH)
export function useApiMutation<T = unknown, TVariables = any>(
  method: 'post' | 'put' | 'delete' | 'patch',
  url: string,
  options?: UseMutationOptions<T, Error, TVariables>
) {
  return useMutation<T, Error, TVariables>({
    mutationFn: async (variables: TVariables) => {
      let response: AxiosResponse<T>;
      switch (method) {
        case 'post':
          response = await apiClient.post<T>(url, variables);
          break;
        case 'put':
          response = await apiClient.put<T>(url, variables);
          break;
        case 'patch':
          response = await apiClient.patch<T>(url, variables);
          break;
        case 'delete':
          response = await apiClient.delete<T>(url, { data: variables });
          break;
        default:
          throw new Error('Unsupported method');
      }
      return response.data;
    },
    ...options,
  });
}

// File upload mutation hook (single file)
export function useFileUploadMutation<T = unknown>(
  url: string,
  options?: UseMutationOptions<T, Error, { file: File; onProgress?: (progress: number) => void }>
) {
  return useMutation<T, Error, { file: File; onProgress?: (progress: number) => void }>({
    mutationFn: async ({ file, onProgress }: { file: File; onProgress?: (progress: number) => void }) => {
      const formData = new FormData();
      formData.append('file', file);
      const response = await apiClient.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    },
    ...options,
  });
}

// Multiple files upload mutation hook
export function useFilesUploadMutation<T = unknown>(
  url: string,
  options?: UseMutationOptions<T, Error, { files: File[]; onProgress?: (progress: number) => void }>
) {
  return useMutation<T, Error, { files: File[]; onProgress?: (progress: number) => void }>({
    mutationFn: async ({ files, onProgress }: { files: File[]; onProgress?: (progress: number) => void }) => {
      const formData = new FormData();
      files.forEach((file: File, index: number) => {
        formData.append(`files[${index}]`, file);
      });
      const response = await apiClient.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    },
    ...options,
  });
}

// Export the axios instance for direct use if needed
export { apiClient };

// Export types for convenience
export type { AxiosRequestConfig, AxiosResponse };

// Restore ApiService class for legacy axios usage
class ApiService {
  private client: AxiosInstance;

  constructor(client: AxiosInstance) {
    this.client = client;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async patch<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async uploadFile<T>(url: string, file: File, onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    formData.append('file', file);
    try {
      const response = await this.client.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  async uploadFiles<T>(url: string, files: File[], onProgress?: (progress: number) => void): Promise<any> {
    const formData = new FormData();
    files.forEach((file: File, index: number) => {
      formData.append(`files[${index}]`, file);
    });
    try {
      const response = await this.client.post<T>(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (onProgress && progressEvent.total) {
            const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            onProgress(progress);
          }
        },
      });
      return response.data;
    } catch (error: any) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response?.data?.message) {
      return new Error(error.response.data.message);
    } else if (error.message) {
      return new Error(error.message);
    } else {
      return new Error('An unexpected error occurred');
    }
  }
}

export const apiService = new ApiService(apiClient); 