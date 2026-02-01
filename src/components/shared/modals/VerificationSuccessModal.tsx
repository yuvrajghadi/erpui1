"use client";

import React from 'react';
import { Modal, Button, Typography, Space, Result } from 'antd';
import { CheckCircleOutlined, RocketOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface VerificationSuccessModalProps {
  visible: boolean;
  onClose: () => void;
  onNavigateToVerification: () => void;
  companyName: string;
  email: string;
}

const VerificationSuccessModal: React.FC<VerificationSuccessModalProps> = ({
  visible,
  onClose,
  onNavigateToVerification,
  companyName,
  email
}) => {
  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      footer={null}
      width={450}
      centered
      maskClosable={false}
      className="verification-success-modal"
    >
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <Result
          status="success"
          icon={<CheckCircleOutlined style={{ color: '#52c41a', fontSize: '48px' }} />}
          title={
            <Title level={3} style={{ color: '#262626', marginBottom: '16px' }}>
              Email Verification Successful!
            </Title>
          }
          subTitle={
            <div>
              <Text style={{ color: '#595959', fontSize: '16px', display: 'block', marginBottom: '24px' }}>
                Your company registration has been submitted successfully.
              </Text>
              
              <div style={{ 
                background: '#f6ffed', 
                border: '1px solid #b7eb8f',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <Text strong style={{ color: '#389e0d', fontSize: '16px', display: 'block' }}>
                  {companyName}
                </Text>
                <Text style={{ color: '#52c41a', fontSize: '14px' }}>
                  {email}
                </Text>
              </div>

              <Text style={{ color: '#8c8c8c', fontSize: '14px', display: 'block', marginBottom: '24px' }}>
                Your application is under review. You will receive an email notification once verification is complete.
              </Text>
            </div>
          }
        />
        
        <Space direction="vertical" style={{ width: '100%' }} size="middle">
          <Button
            type="primary"
            size="large"
            onClick={onNavigateToVerification}
            style={{ width: '100%', height: '48px' }}
            icon={<RocketOutlined />}
          >
            Go to Verification Status
          </Button>
          
          <Button
            type="default"
            size="large"
            onClick={onClose}
            style={{ width: '100%', height: '48px' }}
          >
            Close
          </Button>
        </Space>
      </div>
    </Modal>
  );
};

export default VerificationSuccessModal;
