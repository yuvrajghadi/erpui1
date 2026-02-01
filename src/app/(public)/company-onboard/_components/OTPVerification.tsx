'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Row, 
  Col, 
  Button, 
  Typography, 
  Space, 
  Alert, 
  message,
  Spin
} from 'antd';
import { 
  SafetyOutlined, 
  MailOutlined, 
  LoadingOutlined,
  CheckCircleOutlined,
  ArrowLeftOutlined,
  ReloadOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

// Props interface for OTPVerification component
export interface OTPVerificationProps {
  // Email info
  email: string;
  
  // OTP state from hook
  otpValue?: string;
  isVerifying?: boolean;
  isVerified?: boolean;
  error?: string | null;
  
  // Callbacks
  onVerifySuccess?: () => void;
  onGoBack?: () => void;
  onOtpChange?: (value: string) => void;
  onVerifyOtp?: (otpValue?: string) => Promise<void>;
  onResendOtp?: (email: string) => Promise<boolean>;
  
  // Optional customization
  title?: string;
  subtitle?: string;
  disabled?: boolean;
}

/**
 * OTPVerification Component
 * Full web screen design with 6 separate input boxes and timer functionality
 */
const OTPVerification: React.FC<OTPVerificationProps> = ({
  email,
  otpValue = '',
  isVerifying: externalIsVerifying = false,
  isVerified: externalIsVerified = false,
  error: externalError = null,
  onVerifySuccess,
  onGoBack,
  onOtpChange,
  onVerifyOtp,
  onResendOtp,
  title = "Email Verification",
  subtitle = "Please enter the 6-digit verification code sent to your email",
  disabled = false,
}) => {
  // State management - use external state when available
  const [otpValues, setOtpValues] = useState<string[]>(['', '', '', '', '', '']);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const router = useRouter();
  
  // Use external state or fallback to local state
  const isVerifying = externalIsVerifying;
  const isVerified = externalIsVerified;
  const error = externalError;

  // Refs for input focus management
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) {
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Initialize timer on component mount
  useEffect(() => {
    setTimer(60); // 1 minute
    setCanResend(false);
  }, []);

  // Sync otpValues with external otpValue prop
  useEffect(() => {
    if (otpValue) {
      const digits = otpValue.padEnd(6, '').slice(0, 6).split('');
      setOtpValues(digits);
    }
  }, [otpValue]);

  // Handle OTP input change
  const handleOtpChange = (index: number, value: string) => {
    // Only allow single digit
    const numericValue = value.replace(/\D/g, '').slice(-1);
    
    const newOtpValues = [...otpValues];
    newOtpValues[index] = numericValue;
    setOtpValues(newOtpValues);
    
    console.log('OTP Change:', { index, value, numericValue, newOtpValues });
    
    // Update external state if callback is provided
    const newOtpString = newOtpValues.join('');
    if (onOtpChange) {
      onOtpChange(newOtpString);
    }

    // Auto focus next input
    if (numericValue && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'Enter' && canVerify) {
      handleVerifyOtp();
    }
  };

  // Handle paste
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    const newOtpValues = [...otpValues];
    
    for (let i = 0; i < 6; i++) {
      newOtpValues[i] = pastedData[i] || '';
    }
    
    setOtpValues(newOtpValues);
    
    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtpValues.findIndex(val => !val);
    const focusIndex = nextEmptyIndex === -1 ? 5 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  // Check if OTP can be verified
  const canVerify = otpValues.every(val => val !== '') && !isVerifying && !disabled;

  // Get OTP string
  const getOtpString = () => otpValues.join('');

  // Handle verify OTP
  const handleVerifyOtp = async () => {
    if (!canVerify) return;

    try {
      if (onVerifyOtp) {
        // Get current OTP value from component state
        const currentOtpValue = getOtpString();
        
        console.log('🔍 Verifying OTP:', currentOtpValue);
        console.log('🔍 Current OTP Values Array:', otpValues);
        
        // Ensure external OTP value is updated before verification
        if (onOtpChange) {
          onOtpChange(currentOtpValue);
        }
        
        // Use external verification function from hook with current OTP value
        await onVerifyOtp(currentOtpValue);
        // On success, call the success callback and navigate to /inventory
        onVerifySuccess?.();
        router.push('/inventory');
      } else {
        // Fallback verification logic
        message.success('Email verified successfully!');
        onVerifySuccess?.();
        router.push('/inventory');
      }
    } catch (error: any) {
      console.error('OTP verification error:', error);
      // Clear OTP inputs on error
      setOtpValues(['', '', '', '', '', '']);
      if (onOtpChange) {
        onOtpChange('');
      }
      inputRefs.current[0]?.focus();
    }
  };

  // Handle resend OTP
  const handleResendOtp = async () => {
    if (!canResend || isSendingOtp) return;

    setIsSendingOtp(true);

    try {
      if (onResendOtp) {
        await onResendOtp(email);
      } else {
        message.success('Verification code sent successfully!');
      }
      
      // Reset timer
      setTimer(60);
      setCanResend(false);
      
      // Clear current OTP
      setOtpValues(['', '', '', '', '', '']);
      if (onOtpChange) {
        onOtpChange('');
      }
      inputRefs.current[0]?.focus();
      
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      message.error(error.message || 'Failed to resend code. Please try again.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Format timer display
  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-verification-wrapper" style={{ 
      width: '100%',
      maxWidth: '600px',
      margin: '0 auto',
      padding: '0',
      maxHeight: '70vh',
      overflowY: 'auto'
    }}>

      <div style={{
        width: '100%',
        background: 'var(--card-bg)',
        borderRadius: '12px',
        border: '1px solid var(--border-color)',
        overflow: 'hidden'
      }}>
        {/* Content */}
        <div style={{ padding: '32px 24px' }}>
          {/* Email Display */}
          <div style={{
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            <MailOutlined style={{ 
              fontSize: '20px', 
              color: 'var(--color-1890ff)',
              marginBottom: '8px'
            }} />
            <div>
              <Text style={{ 
                fontSize: '14px', 
                color: 'var(--text-muted)',
                display: 'block',
                marginBottom: '4px'
              }}>
                Code sent to:
              </Text>
              <Text strong style={{ 
                fontSize: '16px', 
                color: 'var(--text-color)'
              }}>
                {email}
              </Text>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ 
                marginBottom: '16px',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          )}

          {/* Success Alert */}
          {isVerified && (
            <Alert
              message="Email Verified Successfully!"
              description="Redirecting you to the next step..."
              type="success"
              showIcon
              style={{ marginBottom: '24px' }}
            />
          )}

          {/* OTP Input Section */}
          {!isVerified && (
            <>
              <div style={{ marginBottom: '24px' }}>
                <Text strong style={{ 
                  display: 'block', 
                  marginBottom: '16px',
                  fontSize: '16px',
                  textAlign: 'center',
                  color: 'var(--text-color)'
                }}>
                  Enter Verification Code
                </Text>
                
                <div style={{ 
                  marginBottom: '16px',
                  textAlign: 'center'
                }}>
                  <table style={{ 
                    margin: '0 auto',
                    borderCollapse: 'separate',
                    borderSpacing: '8px'
                  }}>
                    <tbody>
                      <tr>
                        {[0, 1, 2, 3, 4, 5].map((index) => (
                          <td key={index} style={{ padding: '0' }}>
                            <input
                              ref={(el) => {
                                inputRefs.current[index] = el;
                              }}
                              type="text"
                              value={otpValues[index] || ''}
                              onChange={(e) => handleOtpChange(index, e.target.value)}
                              onKeyDown={(e) => handleKeyDown(index, e)}
                              onPaste={index === 0 ? handlePaste : undefined}
                              maxLength={1}
                              disabled={disabled || isVerifying}
                              autoComplete="off"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              style={{
                                width: '50px',
                                height: '50px',
                                textAlign: 'center',
                                fontSize: '20px',
                                fontWeight: 'bold',
                                border: otpValues[index] ? '3px solid var(--color-52c41a)' : '2px solid var(--border-color)',
                                borderRadius: '8px',
                                backgroundColor: 'var(--input-bg)',
                                color: 'var(--input-text)',
                                outline: 'none',
                                display: 'block'
                              }}
                              onFocus={(e) => {
                                e.target.style.borderColor = 'var(--color-1890ff)';
                                e.target.style.borderWidth = '3px';
                              }}
                              onBlur={(e) => {
                                if (!otpValues[index]) {
                                  e.target.style.borderColor = 'var(--border-color)';
                                  e.target.style.borderWidth = '2px';
                                }
                              }}
                            />
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ marginBottom: '20px' }}>
                <Button
                  type="primary"
                  size="large"
                  block
                  loading={isVerifying}
                  disabled={disabled || otpValues.some(val => !val)}
                  onClick={handleVerifyOtp}
                  style={{
                    height: '44px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: '500',
                    background: isVerified ? 'var(--color-52c41a)' : 'var(--color-1890ff)',
                    borderColor: isVerified ? 'var(--color-52c41a)' : 'var(--color-1890ff)'
                  }}
                  icon={isVerified ? <CheckCircleOutlined /> : <SafetyOutlined />}
                >
                  {isVerified ? 'Send to Next' : 'Verify Code'}
                </Button>
              </div>

              {/* Resend Code */}
              <div style={{ textAlign: 'center' }}>
                <Text style={{ 
                  fontSize: '14px', 
                  color: 'var(--text-muted)',
                  marginRight: '8px'
                }}>
                  Didn't receive the code?
                </Text>
                <Button
                  type="link"
                  onClick={handleResendOtp}
                  style={{
                    padding: '0',
                    height: 'auto',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Resend Code
                </Button>
              </div>
            </>
          )}

          {/* Loading overlay for verification */}
          {isVerified && (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <Spin size="large" />
              <div style={{ marginTop: '16px' }}>
                <Text>Redirecting...</Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
