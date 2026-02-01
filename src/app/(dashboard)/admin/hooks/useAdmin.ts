/**
 * Custom React Hooks for Admin Dashboard
 * Reusable hooks for admin dashboard functionality
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { CompanyOnboardingData, TableFilters, DashboardStats, AdminUser } from '../types/admin.types';
import { AdminUtils } from '../utils/admin.utils';

// Hook for managing admin authentication
export const useAdminAuth = () => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email: string, password: string, remember: boolean = false) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - replace with real API call
      if (email === 'admin@erp.com' && password === 'admin123') {
        const adminUser: AdminUser = {
          id: 'admin_1',
          email,
          name: 'Admin User',
          role: 'super_admin',
          lastLogin: new Date(),
          isActive: true
        };
        
        setUser(adminUser);
        
        // Store in localStorage if remember is true
        if (remember) {
          localStorage.setItem('admin_user', JSON.stringify(adminUser));
        } else {
          sessionStorage.setItem('admin_user', JSON.stringify(adminUser));
        }
        
        return { success: true };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      };
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('admin_user');
    sessionStorage.removeItem('admin_user');
  }, []);

  const checkAuth = useCallback(() => {
    const storedUser = localStorage.getItem('admin_user') || sessionStorage.getItem('admin_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user
  };
};

// Hook for managing company onboarding data
export const useCompanyData = () => {
  const [companies, setCompanies] = useState<CompanyOnboardingData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Use mock data - replace with real API call
      const mockData = AdminUtils.generateMockCompanyData();
      setCompanies(mockData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch companies');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCompanyStatus = useCallback(async (
    companyId: string, 
    newStatus: CompanyOnboardingData['status'],
    adminNotes?: string
  ) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setCompanies(prev => prev.map(company => 
        company.id === companyId 
          ? { ...company, status: newStatus, adminNotes }
          : company
      ));
      
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to update status' 
      };
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  return {
    companies,
    loading,
    error,
    fetchCompanies,
    updateCompanyStatus
  };
};

// Hook for managing table filters and pagination
export const useTableFilters = (companies: CompanyOnboardingData[]) => {
  const [filters, setFilters] = useState<TableFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0
  });
  const [sortConfig, setSortConfig] = useState<{
    field: string;
    order: 'asc' | 'desc';
  }>({
    field: 'submissionDate',
    order: 'desc'
  });

  // Memoized filtered and sorted data
  const processedData = useMemo(() => {
    let filtered = AdminUtils.filterCompanies(companies, filters);
    filtered = AdminUtils.sortCompanies(filtered, sortConfig.field, sortConfig.order);
    return filtered;
  }, [companies, filters, sortConfig]);

  // Paginated data
  const paginatedData = useMemo(() => {
    const start = (pagination.current - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return processedData.slice(start, end);
  }, [processedData, pagination]);

  // Update pagination total when data changes
  useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: processedData.length,
      current: 1 // Reset to first page when filters change
    }));
  }, [processedData.length]);

  const updateFilters = useCallback((newFilters: Partial<TableFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const updatePagination = useCallback((page: number, pageSize?: number) => {
    setPagination(prev => ({
      ...prev,
      current: page,
      ...(pageSize && { pageSize })
    }));
  }, []);

  const updateSort = useCallback((field: string, order: 'asc' | 'desc') => {
    setSortConfig({ field, order });
  }, []);

  return {
    filters,
    pagination,
    sortConfig,
    paginatedData,
    totalCount: processedData.length,
    updateFilters,
    clearFilters,
    updatePagination,
    updateSort
  };
};

// Hook for dashboard statistics
export const useDashboardStats = (companies: CompanyOnboardingData[]): DashboardStats => {
  return useMemo(() => {
    return AdminUtils.calculateDashboardStats(companies);
  }, [companies]);
};

// Hook for managing modal state
export const useModal = () => {
  const [visible, setVisible] = useState(false);
  const [type, setType] = useState<'view' | 'approve' | 'reject' | 'edit'>('view');
  const [data, setData] = useState<CompanyOnboardingData | null>(null);

  const openModal = useCallback((
    modalType: typeof type, 
    modalData?: CompanyOnboardingData
  ) => {
    setType(modalType);
    setData(modalData || null);
    setVisible(true);
  }, []);

  const closeModal = useCallback(() => {
    setVisible(false);
    setData(null);
  }, []);

  return {
    visible,
    type,
    data,
    openModal,
    closeModal
  };
};

// Hook for form state management
export const useFormState = <T extends Record<string, any>>(initialData: T) => {
  const [formData, setFormData] = useState<T>(initialData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(false);

  const updateField = useCallback((field: keyof T, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is updated
    if (errors[field as string]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field as string];
        return newErrors;
      });
    }
  }, [errors]);

  const setFieldTouched = useCallback((field: keyof T) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  }, []);

  const setFieldError = useCallback((field: keyof T, error: string) => {
    setErrors(prev => ({ ...prev, [field]: error }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialData);
    setErrors({});
    setTouched({});
    setLoading(false);
  }, [initialData]);

  const isValid = useMemo(() => {
    return Object.keys(errors).length === 0;
  }, [errors]);

  return {
    formData,
    errors,
    touched,
    loading,
    isValid,
    updateField,
    setFieldTouched,
    setFieldError,
    setLoading,
    resetForm
  };
};
