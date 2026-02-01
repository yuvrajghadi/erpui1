'use client';
import React, { useState } from 'react';
import { Form, Input, Typography, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { FormData, FormError } from '@/types';

const { Title, Text, Link } = Typography;

const ForgotPassword: React.FC<{ onBack: () => void; onOtpVerify: (contact: string) => void }> = ({
  onBack,
  onOtpVerify,
}) => {
  const [form] = Form.useForm();
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);

  const validateContact = (_: any, value: string) => {
    if (!value) {
      return Promise.reject('Please enter your email or phone number');
    }

    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    const isPhone = /^[0-9]{10}$/.test(value);

    if (!isEmail && !isPhone) {
      return Promise.reject('Enter a valid email or 10-digit phone number');
    }

    return Promise.resolve();
  };

  const onValuesChange = (_: any, allValues: any) => {
    const contact = allValues.contact;
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
    const isPhone = /^[0-9]{10}$/.test(contact);
    setIsButtonEnabled(isEmail || isPhone);
  };

  const onFinish = (values: FormData) => {
    console.log('Send OTP to:', values.contact);
    onOtpVerify(String(values?.contact)); // Move to OTP screen
  };

  const handleError = (error: FormError) => {
    // Handle error logic here
  };

  return (
    <div className="formContainer forgot-password-section">
      <div className="logo-bg"></div>
      <span className="forgot-password-bg"></span>

      <Button type="link" icon={<ArrowLeftOutlined />} onClick={onBack}>
        Back
      </Button>

      <Title level={3} className="mb-2">Forgot Your Password</Title>
      <Text type="secondary">
        Enter your email or phone number (without extension) to receive OTP for password reset.
      </Text>

      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
        className="mt-4"
        size="large"
      >
        <Form.Item
          name="contact"
          rules={[{ validator: validateContact }]}
        >
          <Input placeholder="Enter email or phone number" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ backgroundColor: isButtonEnabled ? '#7d59c8' : '#999' }}
            disabled={!isButtonEnabled}
          >
            Send OTP
          </Button>
        </Form.Item>

        <div className="text-center">
          <Text type="secondary">Remember the password? </Text>
          <Link onClick={onBack} style={{ color: '#7d59c8' }}>Login</Link>
        </div>
      </Form>
    </div>
  );
};

export default ForgotPassword;
