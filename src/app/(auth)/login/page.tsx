'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Carousel, Input, Button, Typography, Divider, Form } from 'antd';
import { GoogleOutlined, MobileOutlined } from '@ant-design/icons';
import Image from 'next/image';
import './login.scss';
import OtpVerification from './_components/opt-verification/opt-verification';
import EmailLogin from './_components/email-login/email-login';
import ForgotPassword from './_components/forgot-password/forgot-password';
import ResetPassword from './_components/reset-password/reset-password';
import { useRouter } from 'next/navigation'; // ✅ import router
import { ROUTES } from '@/config';
import { useTheme } from '@/theme/themeContext';
const { Title, Link } = Typography;

const LoginPage: React.FC = () => {
  const router = useRouter(); // ✅ initialize router
  const { theme, setTheme } = useTheme();
  const initialThemeRef = useRef<'light' | 'dark' | null>(null);
  const [showOtp, setShowOtp] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [showEmailLogin, setShowEmailLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [isForgotFlow, setIsForgotFlow] = useState(false);

  useEffect(() => {
    if (initialThemeRef.current === null) {
      initialThemeRef.current = theme;
    }
    if (theme !== 'dark') {
      setTheme('dark');
    }
  }, [theme, setTheme]);

  useEffect(() => {
    return () => {
      if (initialThemeRef.current && initialThemeRef.current !== 'dark') {
        setTheme(initialThemeRef.current);
      }
    };
  }, [setTheme]);

  const onFinish = (values: any) => {
    setMobileNumber(values.mobile);
    setShowOtp(true);
    setIsForgotFlow(false);
  };

  const handleBack = () => {
    setShowOtp(false);
    setShowEmailLogin(false);
    setShowForgotPassword(false);
    setShowResetPassword(false);
    setIsForgotFlow(false);
  };

  return (
    <div className="login-container">
      <div className="leftColumn">
      <Carousel autoplay className="h-full">
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/welcome-login.svg"
                alt="Welcome Login"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
            <p>Welcome to Original - Your all-in-one business solution</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
          <div className="carouselIcon">
            <Image
              src="/assets/img/data-protect.svg"
              alt="Data protect"
              fill
              sizes="(max-width: 768px) 250px, 450px"
              style={{ objectFit: 'contain' }}
            />
          </div>
            <p>Your Data, Our Priority - Top-notch security with end-to-end encryption</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/stremline-process.svg"
                alt="Stremline process"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Boost Your Productivity - Streamline processes and optimize workflow</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/real-time.svg"
                alt="Collaboration Icon"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Collaborate Seamlessly - Work together in real-time, anytime</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/user-friendly.svg"
                alt="User-Friendly Icon"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Intuitive & Easy to Use - Navigate tasks effortlessly with our user-friendly interface</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/manage-business.svg"
                alt="Mobile Access Icon"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Access on the Go - Manage your business from any device, anywhere</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/247support.svg"
                alt="Support Icon"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>We’re Here to Help - 24/7 support for your business needs</p>
          </div>
        </div>
        <div>
          <div className="carouselContent">
            <div className="carouselIcon">
              <Image
                src="/assets/img/erp-signin.svg"
                alt="Get Started Icon"
                fill
                sizes="(max-width: 768px) 250px, 450px"
                style={{ objectFit: 'contain' }}
              />
            </div>
            <p>Get Started Today - Sign in now to unlock your business’s full potential</p>
          </div>
        </div>
      </Carousel>
    </div>



      <div className="rightColumn">
        <div className="formShell">
          {showResetPassword ? (
            <ResetPassword onBack={handleBack} />
          ) : showOtp ? (
            <div className="formContainer">
              <div className="logo-bg"></div>
              <OtpVerification
                mobile={mobileNumber}
                onBack={handleBack}
                isForgotPassword={isForgotFlow}
                onResetPassword={() => {
                  setShowOtp(false);
                  setShowResetPassword(true);
                }}
              />
            </div>
          ) : showForgotPassword ? (
            <ForgotPassword
              onBack={handleBack}
              onOtpVerify={(contact) => {
                setMobileNumber(contact);
                setShowForgotPassword(false);
                setShowOtp(true);
                setIsForgotFlow(true);
              }}
            />
          ) : showEmailLogin ? (
            <EmailLogin
              onBack={handleBack}
              onForgotPassword={() => {
                setShowEmailLogin(false);
                setShowForgotPassword(true);
              }}
            />
          ) : (
            <div className="formContainer">
              <div className="logo-bg"></div>
              <Title level={3} className="text-center mb-6">Login to Your Account</Title>
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  name="mobile"
                  label="Mobile Number"
                  rules={[{ required: true, message: 'Please enter your mobile number' }]}
                >
                  <Input
                    prefix={<MobileOutlined />}
                    placeholder="Enter mobile number"
                    maxLength={10}
                    type="tel"
                  />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    SEND OTP
                  </Button>
                </Form.Item>

                <Divider plain>OR</Divider>

                <Form.Item>
                  <Button
                    className="socialButton"
                    block
                    onClick={() => setShowEmailLogin(true)}
                  >
                    <Image src="/assets/img/google.png" width={16} height={16} alt="" />
                    Continue with Google
                  </Button>
                </Form.Item>

                <div className="loginLinks">
                  <Link onClick={() => router.push(ROUTES.companyOnboard)}>Create account</Link>
                  <Link className='text-secondary' onClick={() => setShowForgotPassword(true)}>Forgot password?</Link>
                </div>
              </Form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
