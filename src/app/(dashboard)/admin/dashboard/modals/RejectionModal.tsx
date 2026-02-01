'use client';

/**
 * Rejection Modal Component
 * Allows admin to reject applications with specific reasons
 */

import React, { useState } from 'react';
import {
  Modal,
  Form,
  Select,
  Input,
  Button,
  Space,
  Typography,
  Alert,
  Card,
  Tag,
  Divider
} from 'antd';
import {
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { CompanyOnboardingData, REJECTION_REASONS, RejectionReason } from '../../types/admin.types';

const { TextArea } = Input;
const { Title, Text } = Typography;
const { Option } = Select;

interface RejectionModalProps {
  visible: boolean;
  company: CompanyOnboardingData | null;
  loading?: boolean;
  onReject: (companyId: string, reason: string, details?: string) => Promise<{ success: boolean; error?: string }>;
  onCancel: () => void;
}

interface RejectionFormData {
  reason: string;
  details?: string;
  notifyCompany: boolean;
}

/**
 * Rejection Modal Component
 */
const RejectionModal: React.FC<RejectionModalProps> = ({
  visible,
  company,
  loading = false,
  onReject,
  onCancel
}) => {
  const [form] = Form.useForm<RejectionFormData>();
  const [selectedReason, setSelectedReason] = useState<RejectionReason | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Handle form submission
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!company) return;
      
      setSubmitting(true);
      
      const result = await onReject(
        company.id,
        values.reason,
        values.details
      );
      
      if (result.success) {
        form.resetFields();
        setSelectedReason(null);
        onCancel();
      }
    } catch (error) {
      console.error('Form validation failed:', error);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle reason selection
  const handleReasonChange = (reasonId: string) => {
    const reason = REJECTION_REASONS.find(r => r.id === reasonId);
    setSelectedReason(reason || null);
    
    // Clear details if new reason doesn't require them
    if (reason && !reason.requiresDetails) {
      form.setFieldValue('details', '');
    }
  };

  // Handle modal close
  const handleCancel = () => {
    form.resetFields();
    setSelectedReason(null);
    onCancel();
  };

  // Group rejection reasons by category
  const reasonsByCategory = REJECTION_REASONS.reduce((acc, reason) => {
    if (!acc[reason.category]) {
      acc[reason.category] = [];
    }
    acc[reason.category].push(reason);
    return acc;
  }, {} as Record<string, RejectionReason[]>);

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
          <span>Reject Application</span>
        </div>
      }
      open={visible}
      onCancel={handleCancel}
      width={600}
      footer={null}
      destroyOnClose
    >
      {company && (
        <>
          {/* Company Information */}
          <Card size="small" style={{ marginBottom: 24, backgroundColor: 'var(--card-bg)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={5} style={{ margin: 0, color: 'var(--text-color)' }}>
                  {company.companyName}
                </Title>
                <Text type="secondary">
                  {company.firstName} {company.lastName} • {company.companyEmail}
                </Text>
              </div>
              <Tag color="orange">
                {company.industryType}
              </Tag>
            </div>
          </Card>

          {/* Warning Alert */}
          <Alert
            message="Application Rejection"
            description="This action will permanently reject the application. The company will be notified about the rejection and the reason provided."
            type="warning"
            icon={<ExclamationCircleOutlined />}
            showIcon
            style={{ marginBottom: 24 }}
          />

          {/* Rejection Form */}
          <Form
            form={form}
            layout="vertical"
            initialValues={{
              notifyCompany: true
            }}
          >
            {/* Rejection Reason */}
            <Form.Item
              name="reason"
              label="Rejection Reason"
              rules={[
                { required: true, message: 'Please select a rejection reason' }
              ]}
            >
              <Select
                placeholder="Select a rejection reason"
                size="large"
                onChange={handleReasonChange}
                optionRender={(option) => {
                  const reason = REJECTION_REASONS.find(r => r.id === option.value);
                  return reason ? (
                    <div style={{ padding: '4px 0' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-color)' }}>
                        {reason.reason}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                        {reason.description}
                      </div>
                    </div>
                  ) : null;
                }}
              >
                {Object.entries(reasonsByCategory).map(([category, reasons]) => (
                  <Select.OptGroup key={category} label={category}>
                    {reasons.map(reason => (
                      <Option key={reason.id} value={reason.id}>
                        {reason.reason}
                      </Option>
                    ))}
                  </Select.OptGroup>
                ))}
              </Select>
            </Form.Item>

            {/* Selected Reason Info */}
            {selectedReason && (
              <Card size="small" style={{ marginBottom: 16, backgroundColor: 'var(--table-header-bg)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
                  <InfoCircleOutlined style={{ color: 'var(--color-1890ff)', marginTop: 2 }} />
                  <div>
                    <Text strong style={{ color: 'var(--text-color)' }}>
                      {selectedReason.reason}
                    </Text>
                    <div style={{ marginTop: 4 }}>
                      <Text style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                        {selectedReason.description}
                      </Text>
                    </div>
                    {selectedReason.requiresDetails && (
                      <div style={{ marginTop: 8 }}>
                        <Tag color="orange" style={{ fontSize: 11 }}>
                          Additional details required
                        </Tag>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            )}

            {/* Additional Details */}
            <Form.Item
              name="details"
              label="Additional Details"
              rules={[
                ...(selectedReason?.requiresDetails ? [
                  { required: true, message: 'Additional details are required for this rejection reason' },
                  { min: 10, message: 'Please provide at least 10 characters of explanation' }
                ] : [])
              ]}
            >
              <TextArea
                placeholder={
                  selectedReason?.requiresDetails 
                    ? "Please provide specific details about why this application is being rejected..."
                    : "Optional: Provide additional context or specific feedback for the company..."
                }
                rows={4}
                maxLength={500}
                showCount
              />
            </Form.Item>

            <Divider />

            {/* Form Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button
                onClick={handleCancel}
                disabled={submitting}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                danger
                onClick={handleSubmit}
                loading={submitting || loading}
                icon={<CloseCircleOutlined />}
              >
                {submitting ? 'Rejecting...' : 'Reject Application'}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Modal>
  );
};

export default RejectionModal;
