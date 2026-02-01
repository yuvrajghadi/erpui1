import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { message } from 'antd';
import * as Sentry from '@sentry/nextjs';
import { SafeApiResponse } from '../config/apiClient';
import {
  createAdmin,
  getAdmins,
  adminLogin,
} from '../services/admin';
import {
  CreateAdminFormData,
  CreateAdminApiResponse,
  GetAdminsApiResponse,
  AdminLoginFormData,
  AdminLoginApiResponse,
} from '../services/admin';

// Query keys for React Query
export const ADMIN_QUERY_KEYS = {
  all: ['admin'] as const,
  create: ['admin', 'create'] as const,
  list: ['admin', 'list'] as const,
  login: ['admin', 'login'] as const,
};

/**
 * Hook for creating a new admin
 */
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();

  return useMutation<SafeApiResponse<CreateAdminApiResponse>, Error, CreateAdminFormData>({
    mutationFn: createAdmin,
    onMutate: async (formData) => {
      // Show loading message
      message.loading({
        content: 'Creating admin user...',
        key: 'admin-create',
        duration: 0, // Keep until manually destroyed
      });

      // Add breadcrumb for tracking
      Sentry.addBreadcrumb({
        message: 'Admin creation started',
        level: 'info',
        data: {
          admin_username: formData.admin_username,
          admin_email: formData.admin_email,
          admin_roles: formData.admin_roles,
        },
      });

      console.log('Starting admin creation for:', formData.admin_username);
    },
    onSuccess: (data, variables) => {
      // Destroy loading message and show success
      message.destroy('admin-create');
      
      if (data.success && data.payload?.success) {
        message.success({
          content: `Admin "${variables.admin_username}" created successfully!`,
          key: 'admin-create-success',
          duration: 4,
        });

        // Log success
        console.log('✅ Admin created successfully:', {
          admin_id: data.payload?.data?.admin_id,
          admin_username: data.payload?.data?.admin_username,
        });

        // Add success breadcrumb
        Sentry.addBreadcrumb({
          message: 'Admin creation completed successfully',
          level: 'info',
          data: {
            admin_id: data.payload?.data?.admin_id,
            admin_username: data.payload?.data?.admin_username,
          },
        });

        // Invalidate and refetch admin list
        queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.list });
        queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
      } else {
        const errorMessage =
          data.error || data.payload?.error || data.payload?.message || 'Failed to create admin';
        message.error({
          content: errorMessage,
          key: 'admin-create-error',
          duration: 6,
        });
      }
    },
    onError: (error, variables) => {
      // Destroy loading message and show error
      message.destroy('admin-create');
      message.error({
        content: error.message || 'Failed to create admin. Please try again.',
        key: 'admin-create-error',
        duration: 6,
      });

      // Log error
      console.error('❌ Admin creation failed:', {
        error: error.message,
        admin_username: variables.admin_username,
      });

      // Capture error in Sentry
      Sentry.captureException(error, {
        tags: {
          operation: 'create_admin_hook',
          admin_username: variables.admin_username,
        },
        extra: {
          formData: {
            admin_username: variables.admin_username,
            admin_email: variables.admin_email,
            status: variables.status,
            admin_roles: variables.admin_roles,
            // Password intentionally omitted
          },
        },
      });
    },
    onSettled: () => {
      // Ensure loading message is destroyed
      message.destroy('admin-create');
    },
  });
};

/**
 * Hook for fetching admin list
 */
export const useAdminList = (enabled: boolean = true) => {
  return useQuery<SafeApiResponse<GetAdminsApiResponse>, Error>({
    queryKey: ADMIN_QUERY_KEYS.list,
    queryFn: getAdmins,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors (client errors)
      if (error.message.includes('4')) {
        return false;
      }
      // Retry up to 3 times for other errors
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

/**
 * Hook for invalidating admin-related queries
 */
export const useInvalidateAdmin = () => {
  const queryClient = useQueryClient();

  return {
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
    },
    invalidateList: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.list });
    },
    invalidateCreate: () => {
      queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.create });
    },
  };
};

/**
 * Hook for prefetching admin list
 */
export const usePrefetchAdminList = () => {
  const queryClient = useQueryClient();

  return () => {
    queryClient.prefetchQuery({
      queryKey: ADMIN_QUERY_KEYS.list,
      queryFn: getAdmins,
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  };
};

/**
 * Hook for getting admin creation status
 */
export const useAdminCreationStatus = () => {
  const queryClient = useQueryClient();
  
  return {
    isCreating: () => {
      const mutation = queryClient.getMutationCache().find({
        mutationKey: ADMIN_QUERY_KEYS.create,
      });
      return mutation?.state.status === 'pending';
    },
    getLastCreationResult: () => {
      const mutation = queryClient.getMutationCache().find({
        mutationKey: ADMIN_QUERY_KEYS.create,
      });
      return mutation?.state.data as SafeApiResponse<CreateAdminApiResponse> | undefined;
    },
  };
};

/**
 * Hook for admin login authentication
 */
export const useAdminLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<SafeApiResponse<AdminLoginApiResponse>, Error, AdminLoginFormData>({
    mutationFn: adminLogin,
    onMutate: async (formData) => {
      // Show loading message
      message.loading({
        content: 'Signing in...',
        key: 'admin-login',
        duration: 0, // Keep until manually destroyed
      });

      // Add breadcrumb for tracking
      Sentry.addBreadcrumb({
        message: 'Admin login started',
        level: 'info',
        data: {
          admin_username: formData.admin_username,
          // Don't log password for security
        },
      });

      console.log('Starting admin login for:', formData.admin_username);
    },
    onSuccess: (data, variables) => {
      // Hide loading message
      message.destroy('admin-login');

      if (data.success && data.payload?.success && data.payload.data) {
        const payloadData = data.payload.data;
        // Show success message
        message.success({
          content: `Welcome back, ${payloadData.admin_username}!`,
          key: 'admin-login-success',
          duration: 3,
        });

        // Log successful login
        Sentry.addBreadcrumb({
          message: 'Admin login successful',
          level: 'info',
          data: {
            admin_id: payloadData.admin_id,
            admin_username: payloadData.admin_username,
            admin_roles: payloadData.admin_roles,
          },
        });

        console.log('✅ Admin login successful:', {
          admin_id: payloadData.admin_id,
          admin_username: payloadData.admin_username,
          admin_roles: payloadData.admin_roles,
        });

        // Store authentication data in localStorage (in real app, use secure storage)
        if (typeof window !== 'undefined') {
          localStorage.setItem('admin_token', payloadData.token || '');
          localStorage.setItem('admin_user', JSON.stringify({
            admin_id: payloadData.admin_id,
            admin_username: payloadData.admin_username,
            admin_email: payloadData.admin_email,
            admin_roles: payloadData.admin_roles,
            status: payloadData.status,
            last_login: payloadData.last_login,
          }));
        }

        // Invalidate any cached admin data
        queryClient.invalidateQueries({ queryKey: ADMIN_QUERY_KEYS.all });
      } else {
        // Handle API success but login failure
        const errorMessage =
          data.error || data.payload?.error || data.payload?.message || 'Login failed';
        message.error({
          content: errorMessage,
          key: 'admin-login-error',
          duration: 5,
        });
      }
    },
    onError: (error, variables) => {
      // Hide loading message
      message.destroy('admin-login');

      // Show error message
      message.error({
        content: error.message || 'Login failed. Please try again.',
        key: 'admin-login-error',
        duration: 5,
      });

      // Log error
      Sentry.captureException(error, {
        tags: {
          section: 'admin_hooks',
          action: 'admin_login',
        },
        extra: {
          admin_username: variables.admin_username,
          errorMessage: error.message,
        },
      });

      console.error('❌ Admin login failed:', {
        admin_username: variables.admin_username,
        error: error.message,
      });
    },
    onSettled: () => {
      // Ensure loading message is hidden
      message.destroy('admin-login');
    },
  });
};

/**
 * Hook for admin logout
 */
export const useAdminLogout = () => {
  const queryClient = useQueryClient();

  const logout = () => {
    try {
      // Clear authentication data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }

      // Clear all cached data
      queryClient.clear();

      // Show logout message
      message.success({
        content: 'Logged out successfully',
        duration: 2,
      });

      // Log logout
      Sentry.addBreadcrumb({
        message: 'Admin logout',
        level: 'info',
      });

      console.log('✅ Admin logged out successfully');

      return { success: true };
    } catch (error) {
      console.error('❌ Logout error:', error);
      
      Sentry.captureException(error, {
        tags: {
          section: 'admin_hooks',
          action: 'admin_logout',
        },
      });

      return { success: false, error: 'Logout failed' };
    }
  };

  return { logout };
};

/**
 * Hook to check admin authentication status
 */
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [adminUser, setAdminUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const checkAuth = () => {
      try {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem('admin_token');
          const userStr = localStorage.getItem('admin_user');
          
          if (token && userStr) {
            const user = JSON.parse(userStr);
            setAdminUser(user);
            setIsAuthenticated(true);
          } else {
            setAdminUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error('❌ Auth check error:', error);
        setAdminUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return {
    isAuthenticated,
    adminUser,
    loading,
  };
};
