"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Input, Button, Typography, message, Space, Divider, Row, Col } from 'antd';
import { MailOutlined, ClockCircleOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import type { InputRef } from 'antd';
import './OTPVerificationModal.scss';

const { Title, Text } = Typography;

interface OTPVerificationModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  email: string;
  companyName: string;
}

const OTPVerificationModal: React.FC<OTPVerificationModalProps> = ({
  visible,
  onCancel,
  onSuccess,
  email,
  companyName
}) => {
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [loading, setLoading] = useState<boolean>(false);
  const [resendLoading, setResendLoading] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(300); // 5 minutes
  const [canResend, setCanResend] = useState<boolean>(false);
  const inputRefs = useRef<(InputRef | null)[]>([]);

  // Timer for OTP expiry
  useEffect(() => {
    if (visible && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [visible, timeLeft]);

  // Reset state when modal opens
  useEffect(() => {
    if (visible) {
      setOtp(['', '', '', '', '', '']);
      setTimeLeft(300);
      setCanResend(false);
      setLoading(false);
      setResendLoading(false);
      // Focus first input after modal opens
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [visible]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only allow single digit
    if (!/^\d*$/.test(value)) return; // Only allow numbers

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then(text => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
          newOtp[i] = digits[i] || '';
        }
        setOtp(newOtp);
      });
    }
  };

  const handleVerifyOTP = async () => {
    const otpValue = otp.join('');
    if (!otpValue || otpValue.length !== 6) {
      message.error('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call for OTP verification
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, accept any 6-digit OTP
      message.success('Email verified successfully!');
      onSuccess();
    } catch (error) {
      message.error('Verification failed. Please try again.');
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    
    try {
      // Simulate API call for resending OTP
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      message.success('OTP resent successfully!');
      inputRefs.current[0]?.focus();
    } catch (error) {
      message.error('Failed to resend OTP. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  const isOtpComplete = otp.every(digit => digit !== '');

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={480}
      centered
      maskClosable={false}
      destroyOnClose
      className="otp-verification-modal"
    >
      <div style={{ padding: '20px' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '64px', 
            height: '64px', 
            backgroundColor: '#1890ff', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 16px' 
          }}>
            <MailOutlined style={{ fontSize: '28px', color: '#ffffff' }} />
          </div>
          
          <Title level={3} style={{ marginBottom: '8px', color: '#1f2937' }}>
            Verify Your Email
          </Title>
          
          <Text style={{ color: '#6b7280', fontSize: '14px' }}>
            We've sent a 6-digit verification code to
          </Text>
          
          <div style={{ 
            marginTop: '8px', 
            padding: '8px 12px', 
            backgroundColor: '#f3f4f6', 
            borderRadius: '6px', 
            display: 'inline-block' 
          }}>
            <Text strong style={{ color: '#1890ff', fontSize: '14px' }}>
              {email}
            </Text>
          </div>
        </div>

        {/* Company Info Section */}
        <div style={{ 
          marginBottom: '24px', 
          padding: '16px', 
          backgroundColor: '#f0f9ff', 
          borderRadius: '8px', 
          border: '1px solid #e0f2fe',
          textAlign: 'center'
        }}>
          <Text style={{ color: '#6b7280', fontSize: '13px', display: 'block' }}>
            Verifying registration for
          </Text>
          <Text strong style={{ color: '#1f2937', fontSize: '15px' }}>
            {companyName}
          </Text>
        </div>

        {/* OTP Input Section */}
        <div style={{ marginBottom: '24px' }}>
          <Text style={{ 
            color: '#374151', 
            fontSize: '14px', 
            display: 'block', 
            textAlign: 'center',
            marginBottom: '16px' 
          }}>
            Enter the 6-digit verification code
          </Text>
          
          <Row gutter={8} justify="center">
            {otp.map((digit, index) => (
              <Col key={index}>
                <Input
                  ref={(el) => { inputRefs.current[index] = el; }}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  maxLength={1}
                  style={{
                    width: '48px',
                    height: '48px',
                    textAlign: 'center',
                    fontSize: '18px',
                    fontWeight: '600',
                    border: `2px solid ${digit ? '#1890ff' : '#d1d5db'}`,
                    borderRadius: '8px',
                    backgroundColor: digit ? '#f0f9ff' : '#ffffff'
                  }}
                />
              </Col>
            ))}
          </Row>
        </div>

        {/* Timer Section */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '8px' 
          }}>
            <ClockCircleOutlined style={{ 
              color: timeLeft < 60 ? '#ef4444' : '#f59e0b',
              fontSize: '16px'
            }} />
            <Text style={{ 
              color: timeLeft < 60 ? '#ef4444' : '#f59e0b',
              fontSize: '14px'
            }}>
              {timeLeft > 0 ? `Code expires in ${formatTime(timeLeft)}` : 'Code has expired'}
            </Text>
          </div>
        </div>

        {/* Action Buttons */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            size="large"
            onClick={handleVerifyOTP}
            loading={loading}
            disabled={!isOtpComplete || timeLeft === 0}
            icon={<CheckCircleOutlined />}
            style={{ 
              width: '100%', 
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </Button>

          <Button
            type="default"
            size="large"
            onClick={handleResendOTP}
            loading={resendLoading}
            disabled={!canResend}
            icon={<ReloadOutlined />}
            style={{ 
              width: '100%', 
              height: '48px',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '600'
            }}
          >
            {resendLoading ? 'Resending...' : canResend ? 'Resend Code' : `Resend in ${formatTime(timeLeft)}`}
          </Button>
        </Space>

        <Divider style={{ margin: '24px 0 16px' }} />

        {/* Help Text */}
        <Text style={{ 
          color: '#9ca3af', 
          fontSize: '12px', 
          textAlign: 'center',
          display: 'block'
        }}>
          Didn't receive the code? Check your spam folder or contact support.
        </Text>
      </div>
    </Modal>
  );
};

export default OTPVerificationModal;
