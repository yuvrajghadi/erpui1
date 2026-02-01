import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { message } from 'antd';
import * as Sentry from '@sentry/nextjs';
import { debugLogsEnabled } from '@/config';
import { SafeApiResponse } from '../config/apiClient';
import {
  submitCompanyOnboarding,
  getOnboardingStatus,
} from '../services/onboarding';
import {
  FormFieldMapping,
  OnboardingApiResponse,
} from '../schemas/onboarding';

// Query keys for React Query
export const ONBOARDING_QUERY_KEYS = {
  all: ['onboarding'] as const,
  submit: ['onboarding', 'submit'] as const,
  status: (id: string) => ['onboarding', 'status', id] as const,
};

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

/**
 * Hook for submitting company onboarding data
 */
export const useSubmitOnboarding = () => {
  const queryClient = useQueryClient();

  return useMutation<SafeApiResponse<OnboardingApiResponse>, Error, FormFieldMapping>({
    mutationFn: submitCompanyOnboarding,
    onMutate: async (formData) => {
      // Show loading message
      message.loading({
        content: 'Submitting company onboarding data...',
        key: 'onboarding-submit',
        duration: 0, // Keep until manually destroyed
      });

      // Add breadcrumb for tracking
      Sentry.addBreadcrumb({
        message: 'Onboarding submission started',
        level: 'info',
        data: {
          company_name: formData.companyName,
          services: formData.selectedServices,
        },
      });

      log('Starting onboarding submission for:', formData.companyName);
    },
    onSuccess: (data, variables) => {
      // Destroy loading message and show success
      message.destroy('onboarding-submit');
      if (data.success && data.payload?.success) {
        message.success({
          content: 'Company onboarding submitted successfully!',
          duration: 5,
        });

        log('Onboarding submission successful:', data);

        Sentry.addBreadcrumb({
          message: 'Onboarding submission successful',
          level: 'info',
          data: {
            company_name: variables.companyName,
            response: data,
          },
        });

        queryClient.invalidateQueries({
          queryKey: ONBOARDING_QUERY_KEYS.all,
        });
        return;
      }

      const errorMessage =
        data.error ||
        data.payload?.error ||
        data.payload?.message ||
        'Failed to submit company onboarding.';

      message.error({
        content: errorMessage,
        duration: 8,
      });

      console.error('Onboarding submission failed:', {
        error: errorMessage,
        company: variables.companyName,
      });
    },
    onError: (error, variables) => {
      // Destroy loading message and show error
      message.destroy('onboarding-submit');
      
      // Determine error message based on error type
      let errorMessage = 'Failed to submit company onboarding. Please try again.';
      
      if (error.message.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
      } else if (error.message.includes('validation')) {
        errorMessage = 'Please check your form data and try again.';
      } else if (error.message.includes('401')) {
        errorMessage = 'Authentication failed. Please log in again.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Server error. Please try again later.';
      }

      message.error({
        content: errorMessage,
        duration: 8,
      });

      // Log error details
      console.error('Onboarding submission failed:', {
        error: error.message,
        company: variables.companyName,
        stack: error.stack,
      });

      // Capture error in Sentry
      Sentry.captureException(error, {
        tags: {
          hook: 'useSubmitOnboarding',
          company_name: variables.companyName,
        },
        extra: {
          formData: variables,
          errorMessage: error.message,
        },
      });
    },
    onSettled: () => {
      // Ensure loading message is destroyed
      message.destroy('onboarding-submit');
      
      console.log('Onboarding submission completed');
    },
    // Retry configuration
    retry: (failureCount, error: any) => {
      // Don't retry on validation errors (4xx) or authentication errors
      if (error.response?.status >= 400 && error.response?.status < 500) {
        return false;
      }
      // Retry up to 2 times for network/server errors
      return failureCount < 2;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook for getting onboarding status (for future use)
 */
export const useOnboardingStatus = (companyId: string, enabled: boolean = true) => {
  const query = useQuery<SafeApiResponse<OnboardingApiResponse>, Error>({
    queryKey: ONBOARDING_QUERY_KEYS.status(companyId),
    queryFn: () => getOnboardingStatus(companyId),
    enabled: enabled && !!companyId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  useEffect(() => {
    if (!query.error) {
      return;
    }

    console.error('Failed to fetch onboarding status:', query.error);
    Sentry.captureException(query.error, {
      tags: { hook: 'useOnboardingStatus' },
      extra: { companyId },
    });
  }, [companyId, query.error]);

  return query;
};

/**
 * Hook for invalidating onboarding queries
 */
export const useInvalidateOnboarding = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({
        queryKey: ONBOARDING_QUERY_KEYS.all,
      });
    },
    invalidateStatus: (companyId: string) => {
      queryClient.invalidateQueries({
        queryKey: ONBOARDING_QUERY_KEYS.status(companyId),
      });
    },
  };
};
