import axios, { AxiosInstance, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import axiosRetry from 'axios-retry';
import * as Sentry from '@sentry/nextjs';
import { apiBaseUrl } from '@/config';

// Create axios instance with default configuration
const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: apiBaseUrl,
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  // Configure axios-retry for automatic retry logic
  axiosRetry(instance, {
    retries: 3, // Number of retry attempts
    retryDelay: axiosRetry.exponentialDelay, // Exponential backoff
    retryCondition: (error) => {
      // Retry on network errors and 5xx status codes
      return axiosRetry.isNetworkOrIdempotentRequestError(error) ||
             (error.response?.status ? error.response.status >= 500 : false);
    },
    onRetry: (retryCount, error, requestConfig) => {
      console.warn(`Retrying request (${retryCount}/3):`, {
        url: requestConfig.url,
        method: requestConfig.method,
        error: error.message,
      });
      
      // Log retry attempts to Sentry
      Sentry.addBreadcrumb({
        message: `API Retry Attempt ${retryCount}`,
        level: 'warning',
        data: {
          url: requestConfig.url,
          method: requestConfig.method,
          error: error.message,
        },
      });
    },
  });

  return instance;
};

// Create the main axios instance
export const apiClient: AxiosInstance = createAxiosInstance();

// Request interceptor for authentication
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      // For development, use a mock token
      // In production, you would get the real session
      const mockToken = 'mock-development-token';
      
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${mockToken}`,
      } as any;

      // Log request details for debugging
      console.log('API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        baseURL: config.baseURL,
        fullURL: `${config.baseURL}${config.url}`,
      });

      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      Sentry.captureException(error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    Sentry.captureException(error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Log successful responses
    console.log('API Response:', {
      status: response.status,
      url: response.config.url,
      method: response.config.method?.toUpperCase(),
    });

    return response;
  },
  (error) => {
    // Enhanced error logging
    const errorDetails = {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      url: error.config?.url,
      method: error.config?.method?.toUpperCase(),
      data: error.response?.data,
    };

    console.error('API Error:', errorDetails);

    // Capture error in Sentry with context
    Sentry.captureException(error, {
      tags: {
        api_error: true,
        status_code: error.response?.status,
      },
      extra: errorDetails,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      console.warn('Unauthorized access - redirecting to login');
      // You can add redirect logic here if needed
    }

    return Promise.reject(error);
  }
);

export default apiClient;
