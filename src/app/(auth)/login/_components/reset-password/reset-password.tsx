'use client';

import React, { useState } from 'react';
import { Form, Input, Button, Typography, message } from 'antd';
import {
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  ArrowLeftOutlined,
} from '@ant-design/icons';
import { FormData } from '@/types';

const { Title, Text, Link } = Typography;

const ResetPassword: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [form] = Form.useForm();

  const onFinish = (values: FormData) => {
    console.log('Resetting password with:', values);
    message.success('Password reset successfully!');
    // Redirect to login or success screen
  };

  return (
    <div className="formContainer reset-password-section">
      <div className="logo-bg"></div>
      <span className="reset-password-bg" />

      <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
        Back
      </Button>

      <Title level={3} className="mb-2">Reset Your Password</Title>
      <Text type="secondary">Create a new password to secure your account.</Text>

      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        className="mt-4"
        size="large"
      >
        {/* New Password */}
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            { required: true, message: 'Please enter your new password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#7d59c8' }} />}
            placeholder="Enter new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {/* Confirm Password */}
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Passwords do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined style={{ color: '#7d59c8' }} />}
            placeholder="Confirm new password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Reset Password
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary">Remembered your password? </Text>
          <Link onClick={onBack} style={{ color: '#7d59c8' }}>Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default ResetPassword;
