'use client';

/**
 * Admin Login Page Component
 * Secure login interface for admin dashboard access
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Checkbox, Alert, Typography, Space } from 'antd';
import { UserOutlined, LockOutlined, LoginOutlined } from '@ant-design/icons';
import { useAdminLogin, useAdminAuth } from '@/store/api/hooks/useAdmin';
import { AdminLoginFormData } from '@/store/api/services/admin';
import { ROUTES } from '@/config';
import '../styles/admin.scss';

const { Title, Text, Link } = Typography;

// Initial form data
const initialFormData: AdminLoginFormData = {
  admin_username: '',
  admin_password: ''
};

/**
 * AdminLogin Component
 * Handles admin authentication with form validation and error handling
 */
const AdminLogin: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authCheckLoading } = useAdminAuth();
  const adminLoginMutation = useAdminLogin();
  
  // Local state for form data and errors
  const [formData, setFormData] = React.useState<AdminLoginFormData>(initialFormData);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [generalError, setGeneralError] = React.useState<string>('');
  const [remember, setRemember] = React.useState<boolean>(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push(ROUTES.adminDashboard);
    }
  }, [isAuthenticated, router]);

  // Clear field error helper
  const clearFieldError = (field: string) => {
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Set field error helper
  const setFieldError = (field: string, message: string) => {
    setErrors(prev => ({ ...prev, [field]: message }));
  };

  // Form validation rules
  const validateForm = (): boolean => {
    let isValid = true;
    const newErrors: Record<string, string> = {};

    // Username validation
    if (!formData.admin_username.trim()) {
      newErrors.admin_username = 'Username is required';
      isValid = false;
    } else if (formData.admin_username.length < 3) {
      newErrors.admin_username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Password validation
    if (!formData.admin_password) {
      newErrors.admin_password = 'Password is required';
      isValid = false;
    } else if (formData.admin_password.length < 6) {
      newErrors.admin_password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Clear previous general error
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }
    
    try {
      const result = await adminLoginMutation.mutateAsync(formData);
      if (result.success && result.payload?.success && result.payload.data) {
        router.push(ROUTES.adminDashboard);
        return;
      }
      const errorMessage =
        result.error ||
        result.payload?.error ||
        result.payload?.message ||
        'Login failed. Please try again.';
      setGeneralError(errorMessage);
    } catch (error: any) {
      setGeneralError(error?.message || 'Login failed. Please try again.');
    }
  };

  // Handle input changes
  const handleInputChange = (field: keyof AdminLoginFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    clearFieldError(field);
  };

  // Handle forgot password
  const handleForgotPassword = () => {
    // TODO: Implement forgot password functionality
    alert('Forgot password functionality will be implemented in the next phase');
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        {/* Logo and Title */}
        <div className="admin-login-logo">
          <Title level={2}>Admin Portal</Title>
          <Text type="secondary">
            Sign in to access the admin dashboard
          </Text>
        </div>

        {/* Login Form */}
        <Form
          className="admin-login-form"
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {/* General Error Alert */}
          {generalError && (
            <Alert
              message={generalError}
              type="error"
              showIcon
              style={{ marginBottom: 20 }}
            />
          )}

          {/* Username Field */}
          <Form.Item
            label="Username"
            validateStatus={errors.admin_username ? 'error' : ''}
            help={errors.admin_username}
            required
          >
            <Input
              size="large"
              prefix={<UserOutlined />}
              placeholder="Enter your username"
              value={formData.admin_username}
              onChange={(e) => handleInputChange('admin_username', e.target.value)}
              autoComplete="username"
            />
          </Form.Item>

          {/* Password Field */}
          <Form.Item
            label="Password"
            validateStatus={errors.admin_password ? 'error' : ''}
            help={errors.admin_password}
            required
          >
            <Input.Password
              size="large"
              prefix={<LockOutlined />}
              placeholder="Enter your password"
              value={formData.admin_password}
              onChange={(e) => handleInputChange('admin_password', e.target.value)}
              autoComplete="current-password"
            />
          </Form.Item>

          {/* Remember Me Checkbox */}
          <Form.Item>
            <Space direction="vertical" style={{ width: '100%' }}>
              <Checkbox
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              >
                Remember me for 30 days
              </Checkbox>
            </Space>
          </Form.Item>

          {/* Submit Button */}
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={adminLoginMutation.isPending || authCheckLoading}
              icon={<LoginOutlined />}
              block
            >
              {adminLoginMutation.isPending ? 'Signing in...' : 'Sign In'}
            </Button>
          </Form.Item>
        </Form>

        {/* Forgot Password Link */}
        <div className="admin-forgot-password">
          <Link onClick={handleForgotPassword}>
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
