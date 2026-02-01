'use client';

import React, { useState, useEffect } from 'react';
import { Button, Flex, Input, Typography, Space, message } from 'antd';
import { ArrowLeftOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation'; // ✅ import router
import { ROUTES } from '@/config';
const { Title, Text, Link } = Typography;

interface OtpVerificationProps {
  mobile: string;
  onBack: () => void;
  isForgotPassword?: boolean; // 🔄 if true, show "Reset", else "Continue"
  onResetPassword?: () => void; // ✅ navigate to reset password page
}

const OtpVerification: React.FC<OtpVerificationProps> = ({
  mobile,
  onBack,
  isForgotPassword = false,
  onResetPassword,
}) => {
  const [otp, setOtp] = useState('');
  const [timer, setTimer] = useState(60);
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [error, setError] = useState('');
  const router = useRouter(); // ✅ initialize router
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleOtpChange = (val: string) => {
    setOtp(val.replace(/\D/g, ''));
    setError('');
  };

  const handleContinue = () => {
    const validOtp = '123456'; // Replace with actual validation
    if (otp !== validOtp) {
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);
      setError(`Invalid OTP. ${newAttempts} attempt${newAttempts !== 1 ? 's' : ''} remaining.`);
      if (newAttempts === 0) {
        message.error('You have reached the maximum number of attempts.');
      }
      return;
    }

    // OTP valid
    if (isForgotPassword && onResetPassword) {
      onResetPassword(); // ➡ move to ResetPassword screen
    } else {
      message.success('Login successful', 2).then(() => {
        try {
          router.push(ROUTES.inventory);
        } catch (e) {
          // fallback navigation
          window.location.href = ROUTES.inventory;
        }
      });
    }
  };

  return (
    <div className='otp-verifcation'>
      <span className="login-with-otp-bg"></span>
      <Link onClick={onBack}>
        <ArrowLeftOutlined /> Back
      </Link>
      <Title level={4}>OTP Verification</Title>
      <Text>
        Enter OTP sent to <b>+91{mobile}</b>
      </Text>

      <Input.OTP
        length={6}
        size="large"
        onChange={handleOtpChange}
        value={otp}
        inputMode="numeric"
      />

    <Flex justify="space-between" align="center" className="mt-3 invalid-otp">
      {error && (
        <Text type="danger" style={{ marginRight: 'auto' }}>
          {error}
        </Text>
      )}

    {timer === 0 && (
      <Text className="block text-sm text-center">
        Didn't receive OTP? <Link onClick={() => setTimer(60)}>Resend OTP</Link>
      </Text>
    )}

    </Flex>
      <Flex align="center" gap={6} style={{float : 'inline-end' , margin : '12px 0 12px 0'}}>
        <ClockCircleOutlined />
        <Text>00:{timer < 10 ? `0${timer}` : timer}</Text>
      </Flex>



      <Button
        type="primary"
        block
        disabled={otp.length < 6 || attemptsLeft === 0}
        onClick={handleContinue}
      >
        {isForgotPassword ? 'Reset' : 'Continue'}
      </Button>

      <Text className="d-flex text-end mt-2 float-end">
        New to Original? <Link onClick={() => router.push(ROUTES.companyOnboard)}> Sign Up Now</Link>
      </Text>
    </div>
  );
};

export default OtpVerification;
