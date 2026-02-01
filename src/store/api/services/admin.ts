import * as Sentry from '@sentry/nextjs';
import { safeRequest, SafeApiResponse } from '../config/apiClient';

// API endpoints
const CREATE_ADMIN_ENDPOINT = '/erphub/admin/create-admin';
const ADMIN_LOGIN_ENDPOINT = '/erphub/admin/login';

// Types for admin creation
export interface CreateAdminFormData {
  admin_username: string;
  admin_password: string;
  admin_email: string;
  status: 'active' | 'inactive';
  admin_roles: 'admin' | 'superadmin';
}

export interface AdminData {
  admin_id: string;
  admin_username: string;
  admin_email: string;
  status: 'active' | 'inactive';
  admin_roles: 'admin' | 'superadmin';
  created_at: string;
}

export interface CreateAdminApiResponse {
  success: boolean;
  message: string;
  data?: AdminData;
  error?: string;
}

export interface GetAdminsApiResponse {
  success: boolean;
  message: string;
  data?: AdminData[];
  error?: string;
}

// Types for admin login
export interface AdminLoginFormData {
  admin_username: string;
  admin_password: string;
}

export interface AdminLoginData {
  admin_id: string;
  admin_username: string;
  admin_email: string;
  admin_roles: 'admin' | 'superadmin';
  status: 'active' | 'inactive';
  token?: string;
  last_login: string;
}

export interface AdminLoginApiResponse {
  success: boolean;
  message: string;
  data?: AdminLoginData;
  error?: string;
}

/**
 * Validate admin form data before submission
 */
export const validateAdminFormData = (formData: CreateAdminFormData): string[] => {
  const errors: string[] = [];
  
  // Validate required fields
  if (!formData.admin_username?.trim()) {
    errors.push('Username is required');
  }
  
  if (!formData.admin_password?.trim()) {
    errors.push('Password is required');
  }
  
  if (!formData.admin_email?.trim()) {
    errors.push('Email is required');
  }
  
  if (!formData.status) {
    errors.push('Status is required');
  }
  
  if (!formData.admin_roles) {
    errors.push('Admin role is required');
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (formData.admin_email && !emailRegex.test(formData.admin_email)) {
    errors.push('Invalid email format');
  }
  
  // Validate password strength
  if (formData.admin_password && formData.admin_password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }
  
  // Validate status values
  if (formData.status && !['active', 'inactive'].includes(formData.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }
  
  // Validate admin roles
  if (formData.admin_roles && !['admin', 'superadmin'].includes(formData.admin_roles)) {
    errors.push('Admin role must be either "admin" or "superadmin"');
  }
  
  return errors;
};

/**
 * Validate API response structure
 */
export const validateCreateAdminApiResponse = (response: any): CreateAdminApiResponse => {
  if (!response || typeof response !== 'object') {
    throw new Error('Invalid API response format');
  }
  
  if (typeof response.success !== 'boolean') {
    throw new Error('Invalid API response: missing or invalid success field');
  }
  
  if (typeof response.message !== 'string') {
    throw new Error('Invalid API response: missing or invalid message field');
  }
  
  return response as CreateAdminApiResponse;
};

/**
 * Create a new admin user
 */
export const createAdmin = async (
  formData: CreateAdminFormData
): Promise<SafeApiResponse<CreateAdminApiResponse>> => {
  console.log('🔐 Starting admin creation process...');

  const validationErrors = validateAdminFormData(formData);
  if (validationErrors.length > 0) {
    return {
      success: false,
      payload: null,
      error: `Validation failed: ${validationErrors.join(', ')}`,
    };
  }

  console.log('📤 Sending admin creation request:', {
    admin_username: formData.admin_username,
    admin_email: formData.admin_email,
    status: formData.status,
    admin_roles: formData.admin_roles,
  });

  Sentry.addBreadcrumb({
    message: 'Admin creation request started',
    level: 'info',
    data: {
      admin_username: formData.admin_username,
      admin_email: formData.admin_email,
      admin_roles: formData.admin_roles,
    },
  });

  const response = await safeRequest<CreateAdminApiResponse>({
    method: 'post',
    url: CREATE_ADMIN_ENDPOINT,
    data: formData,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.success || !response.payload) {
    return {
      success: false,
      payload: null,
      error: response.error || 'Admin creation failed',
      status: response.status,
    };
  }

  console.log('📥 Received admin creation response:', {
    status: response.status,
    success: response.payload.success,
    message: response.payload.message,
  });

  let validatedResponse: CreateAdminApiResponse;
  try {
    validatedResponse = validateCreateAdminApiResponse(response.payload);
  } catch (error: any) {
    return {
      success: false,
      payload: null,
      error: error?.message || 'Invalid response format',
      status: response.status,
    };
  }

  if (!validatedResponse.success) {
    return {
      success: false,
      payload: validatedResponse,
      error: validatedResponse.error || validatedResponse.message || 'Admin creation failed',
      status: response.status,
    };
  }

  console.log('✅ Admin created successfully:', {
    admin_id: validatedResponse.data?.admin_id,
    admin_username: validatedResponse.data?.admin_username,
  });

  Sentry.addBreadcrumb({
    message: 'Admin creation completed successfully',
    level: 'info',
    data: {
      admin_id: validatedResponse.data?.admin_id,
      admin_username: validatedResponse.data?.admin_username,
    },
  });

  return {
    success: true,
    payload: validatedResponse,
    status: response.status,
  };
};

/**
 * Get list of all admins
 */
export const getAdmins = async (): Promise<SafeApiResponse<GetAdminsApiResponse>> => {
  console.log('📋 Fetching admins list...');

  Sentry.addBreadcrumb({
    message: 'Fetching admins list',
    level: 'info',
  });

  const response = await safeRequest<GetAdminsApiResponse>({
    method: 'get',
    url: CREATE_ADMIN_ENDPOINT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.success || !response.payload) {
    return {
      success: false,
      payload: null,
      error: response.error || 'Failed to fetch admins',
      status: response.status,
    };
  }

  console.log('📥 Received admins list response:', {
    status: response.status,
    success: response.payload.success,
    count: response.payload.data?.length || 0,
  });

  if (!response.payload.success) {
    return {
      success: false,
      payload: response.payload,
      error: response.payload.error || response.payload.message || 'Failed to fetch admins',
      status: response.status,
    };
  }

  return {
    success: true,
    payload: response.payload,
    status: response.status,
  };
};

/**
 * Validate admin login form data before submission
 */
export const validateAdminLoginFormData = (formData: AdminLoginFormData): string[] => {
  const errors: string[] = [];
  
  // Validate required fields
  if (!formData.admin_username?.trim()) {
    errors.push('Username is required');
  }
  
  if (!formData.admin_password?.trim()) {
    errors.push('Password is required');
  }
  
  // Validate username length
  if (formData.admin_username && formData.admin_username.trim().length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  // Validate password length
  if (formData.admin_password && formData.admin_password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  return errors;
};

/**
 * Validate admin login API response
 */
export const validateAdminLoginApiResponse = (response: any): AdminLoginApiResponse => {
  if (!response || typeof response !== 'object') {
    return {
      success: false,
      message: 'Invalid response format',
      error: 'Response is not a valid object'
    };
  }
  
  return response as AdminLoginApiResponse;
};

/**
 * Admin login service function
 * Authenticates admin user with username and password
 */
export const adminLogin = async (
  formData: AdminLoginFormData
): Promise<SafeApiResponse<AdminLoginApiResponse>> => {
  console.log('🔐 Admin login service called');

  const validationErrors = validateAdminLoginFormData(formData);
  if (validationErrors.length > 0) {
    return {
      success: false,
      payload: null,
      error: validationErrors.join(', '),
    };
  }

  console.log('📤 Sending admin login request:', {
    admin_username: formData.admin_username,
  });

  const response = await safeRequest<AdminLoginApiResponse>({
    method: 'post',
    url: ADMIN_LOGIN_ENDPOINT,
    data: formData,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 10000,
  });

  if (!response.success || !response.payload) {
    return {
      success: false,
      payload: null,
      error: response.error || 'Login failed',
      status: response.status,
    };
  }

  console.log('📥 Received admin login response:', {
    status: response.status,
    success: response.payload.success,
    admin_id: response.payload.data?.admin_id,
    admin_roles: response.payload.data?.admin_roles,
  });

  const validatedResponse = validateAdminLoginApiResponse(response.payload);

  if (!validatedResponse.success) {
    return {
      success: false,
      payload: validatedResponse,
      error: validatedResponse.error || validatedResponse.message || 'Login failed',
      status: response.status,
    };
  }

  return {
    success: true,
    payload: validatedResponse,
    status: response.status,
  };
};
