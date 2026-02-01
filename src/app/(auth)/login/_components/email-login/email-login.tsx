'use client';

import React from 'react';
import { Form, Input, Typography, Button } from 'antd';
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // ✅ import router
import { ROUTES } from '@/config';
import { FormData } from '@/types';
const { Title, Link, Text } = Typography;

const EmailLogin: React.FC<{
  
  onBack?: () => void;
  onForgotPassword?: () => void; // no longer passing contact/email
}> = ({ onBack, onForgotPassword }) => {
  const [form] = Form.useForm();
  const router = useRouter(); // ✅ initialize router
  const onFinish = (values: FormData) => {
    console.log('Email Login:', values);
  };

  const handleForgotPassword = () => {
    if (onForgotPassword) {
      onForgotPassword(); // direct trigger
    }
  };

  return (
    <div className="formContainer">
      <div className="logo-bg"></div>
      <Title level={3} className="text-center mb-6">Login with Email</Title>

      <Form layout="vertical" onFinish={onFinish} size="large" form={form} className='pt-0'>
      {onBack && (
        <div className="text-start p-0">
          <Button type="link" onClick={onBack} className='p-0' style={{fontSize : '14px'}}>
            ← Back
          </Button>
        </div>
      )}

        <Form.Item
          label="Email Address"
          name="email"
          rules={[
            { required: true, message: 'Please enter your email address' },
            { type: 'email', message: 'Enter a valid email address' },
          ]}
        >
          <Input
            type="email"
            placeholder="Enter your email"
            prefix={<MailOutlined style={{ color: '#7d59c8' }} />}
          />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: 'Please enter your password' },
            { min: 6, message: 'Password must be at least 6 characters' },
          ]}
        >
          <Input.Password
            placeholder="Enter your password"
            prefix={<LockOutlined style={{ color: '#7d59c8' }} />}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <div className="flex justify-between items-center mb-3">
          <Link onClick={handleForgotPassword} style={{ fontSize: '13px' }}>
            Forgot Password?
          </Link>
        </div>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: '#7d59c8' }}
          >
            Login
          </Button>
        </Form.Item>

        <div className="text-center mt-4">
          <Text type="secondary">New to Original? </Text>
          <Link style={{ color: '#7d59c8' }} onClick={() => router.push(ROUTES.companyOnboard)}>Sign Up Now</Link>
        </div>
      </Form>
    </div>
  );
};

export default EmailLogin;
