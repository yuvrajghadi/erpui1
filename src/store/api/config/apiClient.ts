import { AxiosRequestConfig } from 'axios';
import * as Sentry from '@sentry/nextjs';
import apiClient from './axios';

export type SafeApiResponse<T> = {
  success: boolean;
  payload: T | null;
  error?: string;
  status?: number;
};

const getErrorMessage = (error: any) => {
  const responseMessage = error?.response?.data?.error || error?.response?.data?.message;
  return responseMessage || error?.message || 'Request failed';
};

export const safeRequest = async <T>(config: AxiosRequestConfig): Promise<SafeApiResponse<T>> => {
  try {
    const response = await apiClient.request<T>(config);
    return {
      success: true,
      payload: response.data ?? null,
      status: response.status,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage = getErrorMessage(error);
    Sentry.captureException(error, {
      tags: {
        api_safe_request: true,
        status_code: status,
      },
      extra: {
        url: config.url,
        method: config.method,
        status,
        errorMessage,
      },
    });
    return {
      success: false,
      payload: null,
      error: errorMessage,
      status,
    };
  }
};

export const safeRequestWithHeaders = async <T>(
  config: AxiosRequestConfig
): Promise<SafeApiResponse<{ data: T | null; headers: Record<string, string> }>> => {
  try {
    const response = await apiClient.request<T>(config);
    return {
      success: true,
      payload: {
        data: response.data ?? null,
        headers: (response.headers || {}) as Record<string, string>,
      },
      status: response.status,
    };
  } catch (error: any) {
    const status = error?.response?.status;
    const errorMessage = getErrorMessage(error);
    Sentry.captureException(error, {
      tags: {
        api_safe_request: true,
        status_code: status,
      },
      extra: {
        url: config.url,
        method: config.method,
        status,
        errorMessage,
      },
    });
    return {
      success: false,
      payload: null,
      error: errorMessage,
      status,
    };
  }
};
