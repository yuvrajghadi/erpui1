'use client';

/**
 * Create Admin Modal Component
 * Modal for creating new admin users with proper validation and UI consistency
 */

import React, { useState } from 'react';
import { 
  Modal, 
  Form, 
  Input, 
  Button, 
  Select, 
  Alert, 
  Typography, 
  Space,
  message 
} from 'antd';
import { 
  UserOutlined, 
  LockOutlined, 
  MailOutlined,
  UserAddOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { CreateAdminFormUI, AdminCreationResponse } from '../types/admin.types';
import { useCreateAdmin } from '@/store/api/hooks/useAdmin';

const { Title, Text } = Typography;
const { Option } = Select;

interface CreateAdminModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: (admin: any) => void;
}

// Initial form data
const initialFormData: CreateAdminFormUI = {
  username: '',
  password: '',
  email: '',
  status: 'active',
  role: 'admin'
};

/**
 * CreateAdminModal Component
 * Handles admin creation with form validation and error handling
 */
const CreateAdminModal: React.FC<CreateAdminModalProps> = ({
  visible,
  onClose,
  onSuccess
}) => {
  const [form] = Form.useForm();
  const [formData, setFormData] = useState<CreateAdminFormUI>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string>('');
  
  // Use the create admin hook
  const createAdminMutation = useCreateAdmin();

  // Handle input changes
  const handleInputChange = (field: keyof CreateAdminFormUI, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, and underscores';
      isValid = false;
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      isValid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
      isValid = false;
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Transform UI form data to API format
  const transformFormDataToApiFormat = (uiFormData: CreateAdminFormUI) => {
    return {
      admin_username: uiFormData.username,
      admin_password: uiFormData.password,
      admin_email: uiFormData.email,
      status: uiFormData.status,
      admin_roles: uiFormData.role
    };
  };

  // Handle form submission
  const handleSubmit = async () => {
    setGeneralError('');
    
    if (!validateForm()) {
      return;
    }

    try {
      // Transform form data to API format
      const apiFormData = transformFormDataToApiFormat(formData);
      
      // Call the API using the mutation hook
      const response = await createAdminMutation.mutateAsync(apiFormData);

      if (response.success) {
        // Success is already handled by the hook (shows success message)
        handleClose();
        if (onSuccess && response.payload?.data) {
          // Transform API response back to UI format for callback
          const uiAdminData = {
            id: response.payload.data.admin_id,
            email: response.payload.data.admin_email,
            name: response.payload.data.admin_username,
            role: response.payload.data.admin_roles,
            isActive: response.payload.data.status === 'active'
          };
          onSuccess(uiAdminData);
        }
      } else {
        setGeneralError(
          response.error ||
            response.payload?.error ||
            response.payload?.message ||
            'Failed to create admin'
        );
      }
    } catch (error: any) {
      // Error is already handled by the hook (shows error message)
      setGeneralError(error.message || 'An unexpected error occurred while creating admin');
    }
  };

  // Handle modal close
  const handleClose = () => {
    form.resetFields();
    setFormData(initialFormData);
    setErrors({});
    setGeneralError('');
    onClose();
  };

  return (
    <Modal
      title={
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <UserAddOutlined style={{ fontSize: 24, color: '#1890ff', marginRight: 8 }} />
          <Title level={3} style={{ margin: 0, display: 'inline' }}>
            Create New Admin
          </Title>
          <br />
          <Text type="secondary" style={{ fontSize: 14 }}>
            Add a new administrator to the system
          </Text>
        </div>
      }
      open={visible}
      onCancel={handleClose}
      footer={null}
      width={500}
      centered
      destroyOnClose
      className="create-admin-modal"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        autoComplete="off"
        style={{ marginTop: 20 }}
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
          validateStatus={errors.username ? 'error' : ''}
          help={errors.username}
          required
        >
          <Input
            size="large"
            prefix={<UserOutlined />}
            placeholder="Enter username"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            autoComplete="username"
          />
        </Form.Item>

        {/* Email Field */}
        <Form.Item
          label="Email Address"
          validateStatus={errors.email ? 'error' : ''}
          help={errors.email}
          required
        >
          <Input
            size="large"
            prefix={<MailOutlined />}
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            autoComplete="email"
          />
        </Form.Item>

        {/* Password Field */}
        <Form.Item
          label="Password"
          validateStatus={errors.password ? 'error' : ''}
          help={errors.password}
          required
        >
          <Input.Password
            size="large"
            prefix={<LockOutlined />}
            placeholder="Enter password"
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            autoComplete="new-password"
          />
        </Form.Item>

        {/* Role Field */}
        <Form.Item
          label="Role"
          required
        >
          <Select
            size="large"
            value={formData.role}
            onChange={(value) => handleInputChange('role', value)}
            placeholder="Select admin role"
          >
            <Option value="admin">Admin</Option>
            <Option value="superadmin">Super Admin</Option>
          </Select>
        </Form.Item>

        {/* Status Field */}
        <Form.Item
          label="Status"
          required
        >
          <Select
            size="large"
            value={formData.status}
            onChange={(value) => handleInputChange('status', value)}
            placeholder="Select status"
          >
            <Option value="active">
              <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 8 }} />
              Active
            </Option>
            <Option value="inactive">
              <CloseCircleOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
              Inactive
            </Option>
          </Select>
        </Form.Item>

        {/* Action Buttons */}
        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button 
              size="large" 
              onClick={handleClose}
              disabled={createAdminMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={createAdminMutation.isPending}
              icon={<UserAddOutlined />}
            >
              {createAdminMutation.isPending ? 'Creating Admin...' : 'Create Admin'}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAdminModal;
