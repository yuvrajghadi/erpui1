"use client";

import React, { useEffect, useState } from "react";
import { Typography, Card, Tag, Space, Progress, Timeline, Button, Steps } from "antd";
import { 
  LoadingOutlined, 
  SyncOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined, 
  MailOutlined, 
  FileTextOutlined,
  PhoneOutlined,
  TeamOutlined,
  HomeOutlined,
  ArrowLeftOutlined
} from "@ant-design/icons";
import "../page.scss";
import CommonStepper from "@/components/shared/stepper/stepper";
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config';

const { Title, Text } = Typography;

export default function CompanyOnboardingForm() {
  const router = useRouter();
  const currentStep = 1; // Or 1, 2 — based on state or flow
  const [timeRemaining, setTimeRemaining] = useState(86400); // 24 hours in seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progress = Math.floor(((86400 - timeRemaining) / 86400) * 100); // Calculating progress based on time

  const handleGoBack = () => {
    router.push(ROUTES.home);
  };

  const handleContactSupport = () => {
    // Handle contact support action
    console.log('Contact support clicked');
  };

  const verificationSteps = [
    {
      title: 'Email Verification',
      status: 'finish' as const,
      icon: <CheckCircleOutlined />,
      description: 'Email verified successfully'
    },
    {
      title: 'Document Review',
      status: 'process' as const,
      icon: <ClockCircleOutlined />,
      description: 'Documents under review'
    },
    {
      title: 'Company Verification',
      status: 'wait' as const,
      icon: <FileTextOutlined />,
      description: 'Pending document approval'
    },
    {
      title: 'Account Activation',
      status: 'wait' as const,
      icon: <TeamOutlined />,
      description: 'Pending verification completion'
    }
  ];

  const timelineData = [
    {
      color: 'green',
      children: (
        <div>
          <Text strong>Email Verification Completed</Text>
          <br />
          <Text type="secondary">Today at 2:30 PM</Text>
        </div>
      )
    },
    {
      color: 'blue',
      children: (
        <div>
          <Text strong>Application Submitted</Text>
          <br />
          <Text type="secondary">Today at 2:25 PM</Text>
        </div>
      )
    },
    {
      color: 'gray',
      children: (
        <div>
          <Text strong>Document Review Started</Text>
          <br />
          <Text type="secondary">Processing...</Text>
        </div>
      )
    }
  ];

  return (
    <section className="verification-section">
      <div className="common-stepper">
        <CommonStepper
          current={currentStep}
          verificationTimeLeft={formatTime(timeRemaining)}
        />
      </div>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button 
              type="text" 
              icon={<ArrowLeftOutlined />} 
              onClick={handleGoBack}
              className="mb-4"
            >
              Back to Home
            </Button>
            <Title level={2} className="mb-2">
              Verification Status
            </Title>
            <Text className="text-gray-600">
              Track your company registration and verification process
            </Text>
          </div>

          {/* Main Status Card */}
          <Card className="mb-6 shadow-lg">
            <div className="text-center mb-8">
              <Title level={2} className="flex items-center justify-center gap-3 mb-4">
                <SyncOutlined className="rotating-icon text-blue-500" />
                Hold Tight! We're Verifying
              </Title>
              <Text type="secondary" className="block text-base mb-6">
                We're reviewing your company details. You'll get notified once the verification is done.
              </Text>

              {/* Status Overview */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <Tag color="orange" className="mb-2">
                    <ClockCircleOutlined className="mr-1" />
                    Under Review
                  </Tag>
                </div>
                <div className="text-right">
                  <Text className="text-gray-600 block">Time Remaining</Text>
                  <Text strong className="text-lg">{formatTime(timeRemaining)}</Text>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-6">
                <Text className="block mb-2">Verification Progress</Text>
                <Progress 
                  percent={25} 
                  strokeColor="#1890ff" 
                  className="mb-2"
                />
                <Text type="secondary" className="text-sm">
                  1 of 4 steps completed
                </Text>
              </div>

              {/* Timer Section */}
              <div className="text-center mb-6">
                <Space direction="horizontal" className="justify-center w-full mt-3">
                  <Tag
                    icon={
                      <LoadingOutlined
                        className="rotating-icon"
                        style={{ fontSize: 18, color: "#fa8c16" }}
                      />
                    }
                    color="volcano"
                    className="text-base font-medium px-4 py-1 rounded-lg border-none m-0"
                  >
                    Verification Ends In:{" "}
                    <span className="font-semibold ml-1">
                      {formatTime(timeRemaining)}
                    </span>
                  </Tag>
                </Space>

                <Text type="secondary" className="text-sm block mt-3">
                  Please wait while we complete the verification. It typically takes a few hours.
                </Text>
              </div>
            </div>

            {/* Verification Steps */}
            <Steps
              current={1}
              items={verificationSteps}
              className="mb-6"
            />
          </Card>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Company Information */}
            <Card title="Company Information" className="shadow-lg">
              <div className="space-y-4">
                <div className="flex items-center">
                  <HomeOutlined className="mr-3 text-blue-600" />
                  <div>
                    <Text className="block text-gray-600">Company Name</Text>
                    <Text strong>Your Company Name</Text>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <MailOutlined className="mr-3 text-blue-600" />
                  <div>
                    <Text className="block text-gray-600">Email</Text>
                    <Text strong>company@example.com</Text>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <PhoneOutlined className="mr-3 text-blue-600" />
                  <div>
                    <Text className="block text-gray-600">Phone</Text>
                    <Text strong>+91 9876543210</Text>
                  </div>
                </div>
              </div>
            </Card>

            {/* Timeline */}
            <Card title="Activity Timeline" className="shadow-lg">
              <Timeline items={timelineData} />
            </Card>
          </div>

          {/* What's Next Card */}
          <Card title="What's Next?" className="shadow-lg mb-6">
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <Text strong className="text-blue-800 block mb-2">
                  Document Review in Progress
                </Text>
                <Text className="text-blue-700">
                  Our team is currently reviewing your submitted documents. This process typically takes 24-48 hours.
                </Text>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <Text strong className="text-gray-800 block mb-2">
                  Email Notifications
                </Text>
                <Text className="text-gray-700">
                  You'll receive email updates at each stage of the verification process.
                </Text>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg">
                <Text strong className="text-green-800 block mb-2">
                  Account Activation
                </Text>
                <Text className="text-green-700">
                  Once verified, you'll receive login credentials and access to your ERP dashboard.
                </Text>
              </div>
            </div>
          </Card>

          {/* Support Section */}
          <Card className="text-center shadow-lg">
            <div className="py-4">
              <Title level={4} className="mb-4">
                Need Help?
              </Title>
              <Text className="text-gray-600 block mb-4">
                If you have any questions about the verification process, our support team is here to help.
              </Text>
              <Space>
                <Button type="primary" onClick={handleContactSupport}>
                  Contact Support
                </Button>
                <Button type="default">
                  View Documentation
                </Button>
              </Space>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
}
