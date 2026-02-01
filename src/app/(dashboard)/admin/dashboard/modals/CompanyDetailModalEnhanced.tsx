'use client';

/**
 * Enhanced Company Detail Modal Component
 * Displays comprehensive company information matching the onboarding form structure
 */

import React, { useState } from 'react';
import {
  Modal,
  Tabs,
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Button,
  Divider,
  Avatar,
  Badge,
  Timeline,
  Alert,
  Descriptions,
  Progress
} from 'antd';
import {
  UserOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  ToolOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ClockCircleOutlined,
  FileTextOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  TeamOutlined,
  DollarOutlined,
  CalendarOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons';
import { CompanyOnboardingData } from '../../types/admin.types';
import { AdminUtils } from '../../utils/admin.utils';

const { Title, Text } = Typography;

interface CompanyDetailModalProps {
  visible: boolean;
  company: CompanyOnboardingData | null;
  onClose: () => void;
  onApprove?: (company: CompanyOnboardingData) => void;
  onReject?: (company: CompanyOnboardingData) => void;
}

/**
 * Enhanced Company Detail Modal Component
 */
const CompanyDetailModalEnhanced: React.FC<CompanyDetailModalProps> = ({
  visible,
  company,
  onClose,
  onApprove,
  onReject
}) => {
  const [activeTab, setActiveTab] = useState('overview');

  if (!company) return null;

  // Status configuration
  const getStatusConfig = (status: CompanyOnboardingData['status']) => {
    const configs = {
      pending: { 
        color: 'var(--color-fa8c16)', 
        bgColor: 'var(--color-fff7e6)', 
        text: 'Pending Review',
        icon: <ClockCircleOutlined />
      },
      under_review: { 
        color: 'var(--color-1890ff)', 
        bgColor: 'var(--color-e6f7ff)', 
        text: 'Under Review',
        icon: <FileTextOutlined />
      },
      approved: { 
        color: 'var(--color-52c41a)', 
        bgColor: 'var(--color-f6ffed)', 
        text: 'Approved',
        icon: <CheckCircleOutlined />
      },
      rejected: { 
        color: 'var(--color-ff4d4f)', 
        bgColor: 'var(--color-fff1f0)', 
        text: 'Rejected',
        icon: <CloseCircleOutlined />
      }
    };
    return configs[status];
  };

  const statusConfig = getStatusConfig(company.status);

  // Render Personal Information Tab
  const renderPersonalInfo = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar size={64} style={{ backgroundColor: 'var(--color-1890ff)', fontSize: 24 }}>
              {company.firstName.charAt(0)}{company.lastName.charAt(0)}
            </Avatar>
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {company.firstName} {company.lastName}
              </Title>
              <Text type="secondary">Contact Person</Text>
            </div>
          </div>
        </Col>
        
        <Col xs={24} md={12}>
          <Descriptions column={1} size="small" bordered>
            <Descriptions.Item label="First Name">
              {company.firstName}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {company.lastName}
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  // Render Company Information Tab
  const renderCompanyInfo = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar 
              size={64} 
              style={{ backgroundColor: '#1890ff', fontSize: 18 }}
              icon={<HomeOutlined />}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>
                {company.companyName}
              </Title>
              <Space>
                <Tag color="blue">{company.companyType}</Tag>
                <Tag color="green">{company.industryType}</Tag>
              </Space>
            </div>
          </div>
        </Col>
        
        <Col xs={24} lg={12}>
          <Descriptions title="Basic Information" column={1} size="small" bordered>
            <Descriptions.Item label="Company Name">
              {company.companyName}
            </Descriptions.Item>
            <Descriptions.Item label="Company Type">
              <Tag color="blue">{company.companyType}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Industry Type">
              <Tag color="green">{company.industryType}</Tag>
            </Descriptions.Item>
          </Descriptions>
        </Col>
        
        <Col xs={24} lg={12}>
          <Descriptions title="Contact Information" column={1} size="small" bordered>
            <Descriptions.Item label="Email">
              <Space>
                <MailOutlined />
                <a href={`mailto:${company.companyEmail}`}>{company.companyEmail}</a>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="Mobile">
              <Space>
                <PhoneOutlined />
                <Text>{company.companyMobile}</Text>
              </Space>
            </Descriptions.Item>
            {company.companyLandline && (
              <Descriptions.Item label="Landline">
                <Space>
                  <PhoneOutlined />
                  <Text>{company.companyLandline}</Text>
                </Space>
              </Descriptions.Item>
            )}
            {company.companyWebsite && (
              <Descriptions.Item label="Website">
                <Space>
                  <GlobalOutlined />
                  <a href={company.companyWebsite} target="_blank" rel="noopener noreferrer">
                    {company.companyWebsite}
                  </a>
                </Space>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
        
        <Col span={24}>
          <Descriptions title="Legal Information" column={2} size="small" bordered>
            <Descriptions.Item label="GST Number">
              <Text code>{company.companyGST}</Text>
            </Descriptions.Item>
            {company.companyPAN && (
              <Descriptions.Item label="PAN Number">
                <Text code>{company.companyPAN}</Text>
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  // Render Address Information Tab
  const renderAddressInfo = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
            <Avatar 
              size={64} 
              style={{ backgroundColor: '#52c41a', fontSize: 18 }}
              icon={<EnvironmentOutlined />}
            />
            <div>
              <Title level={3} style={{ margin: 0 }}>Address Information</Title>
              <Text type="secondary">Company Location Details</Text>
            </div>
          </div>
        </Col>
        
        <Col span={24}>
          <Descriptions title="Complete Address" column={1} size="small" bordered>
            <Descriptions.Item label="Address">
              <Text>{company.companyAddress}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="City">
              {company.city}
            </Descriptions.Item>
            <Descriptions.Item label="State">
              {company.state}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {company.country}
            </Descriptions.Item>
            <Descriptions.Item label="Pincode">
              <Text code>{company.pincode}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>
    </Card>
  );

  // Render Service & Plan Information Tab
  const renderServicePlan = () => {
    const planLabels: Record<string, { text: string; months: number }> = {
      monthly: { text: '1 Month', months: 1 },
      quarterly: { text: '3 Months', months: 3 },
      semi_annual: { text: '6 Months', months: 6 },
      annual: { text: '1 Year', months: 12 },
      five_year: { text: '5 Years', months: 60 }
    };

    const serviceIcons: Record<string, React.ReactNode> = {
      inventory: <ToolOutlined style={{ color: '#fa8c16' }} />,
      accounts: <DollarOutlined style={{ color: '#52c41a' }} />,
      hrms: <TeamOutlined style={{ color: '#722ed1' }} />
    };

    return (
      <Card>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}>
              <Avatar 
                size={64} 
                style={{ backgroundColor: '#722ed1', fontSize: 18 }}
                icon={<ToolOutlined />}
              />
              <div>
                <Title level={3} style={{ margin: 0 }}>Service & Plan Selection</Title>
                <Text type="secondary">Selected services and billing plan</Text>
              </div>
            </div>
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="Team Size">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 32, fontWeight: 'bold', color: '#1890ff' }}>
                  {company.employees}
                </div>
                <Text type="secondary">Employees</Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="Billing Cycle">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#52c41a' }}>
                  {planLabels[company.planDuration]?.text || company.planDuration}
                </div>
                <Text type="secondary">Duration</Text>
              </div>
            </Card>
          </Col>
          
          <Col xs={24} md={8}>
            <Card size="small" title="Total Value">
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 18, fontWeight: 'bold', color: '#fa8c16' }}>
                  ₹{company.pricingDetails?.finalPrice?.toLocaleString() || '0'}
                </div>
                <Text type="secondary">Final Amount</Text>
              </div>
            </Card>
          </Col>
          
          <Col span={24}>
            <Card size="small" title="Selected Services">
              <Space wrap>
                {company.services.map(service => (
                  <Tag 
                    key={service} 
                    icon={serviceIcons[service]}
                    color={
                      service === 'inventory' ? 'orange' :
                      service === 'accounts' ? 'green' :
                      service === 'hrms' ? 'purple' : 'default'
                    }
                    style={{ padding: '4px 12px', fontSize: 14 }}
                  >
                    {service.toUpperCase()}
                  </Tag>
                ))}
              </Space>
            </Card>
          </Col>

          {/* Pricing Breakdown */}
          {company.pricingDetails && (
            <Col span={24}>
              <Card size="small" title="Pricing Breakdown">
                <Descriptions column={1} size="small" bordered>
                  <Descriptions.Item label="Base Price">
                    ₹{company.pricingDetails.basePrice.toLocaleString()}
                  </Descriptions.Item>
                  {company.pricingDetails.discount > 0 && (
                    <Descriptions.Item label="Discount">
                      <Text style={{ color: '#52c41a' }}>
                        -₹{company.pricingDetails.discount.toLocaleString()}
                      </Text>
                    </Descriptions.Item>
                  )}
                  <Descriptions.Item label="Final Price">
                    <Text strong style={{ color: '#fa8c16', fontSize: 16 }}>
                      ₹{company.pricingDetails.finalPrice.toLocaleString()}
                    </Text>
                  </Descriptions.Item>
                </Descriptions>
                
                <Divider />
                
                <div>
                  <Text strong>Service Breakdown:</Text>
                  <div style={{ marginTop: 8 }}>
                    {company.pricingDetails.breakdown.map((item, index) => (
                      <div key={index} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        padding: '4px 0'
                      }}>
                        <Text>{item.service.toUpperCase()}</Text>
                        <Text>₹{item.price.toLocaleString()}</Text>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </Col>
          )}
        </Row>
      </Card>
    );
  };

  // Render Application Status & History
  const renderStatusHistory = () => (
    <Card>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card size="small" title="Current Status">
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 12,
              padding: 16,
              backgroundColor: statusConfig.bgColor,
              borderRadius: 8,
              border: '1px solid var(--border-color)'
            }}>
              <div style={{ color: statusConfig.color, fontSize: 24 }}>
                {statusConfig.icon}
              </div>
              <div>
                <Text strong style={{ color: statusConfig.color, fontSize: 16 }}>
                  {statusConfig.text}
                </Text>
                <div style={{ marginTop: 4 }}>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Last updated: {AdminUtils.formatDate(company.processedDate || company.submissionDate)}
                  </Text>
                </div>
              </div>
            </div>
            
            {company.status === 'rejected' && company.rejectionReason && (
              <Alert
                message="Rejection Details"
                description={
                  <div>
                    <Text strong>Reason: </Text>
                    <Text>{company.rejectionReason}</Text>
                    {company.rejectionDetails && (
                      <div style={{ marginTop: 8 }}>
                        <Text strong>Details: </Text>
                        <Text>{company.rejectionDetails}</Text>
                      </div>
                    )}
                  </div>
                }
                type="error"
                showIcon
                style={{ marginTop: 16 }}
              />
            )}
            
            {company.adminNotes && (
              <div style={{ marginTop: 16 }}>
                <Text strong>Admin Notes:</Text>
                <div style={{ 
                  marginTop: 4, 
                  padding: 8, 
                  backgroundColor: 'var(--table-header-bg)', 
                  borderRadius: 4 
                }}>
                  <Text>{company.adminNotes}</Text>
                </div>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} md={12}>
          <Card size="small" title="Application Timeline">
            <Timeline
              items={[
                {
                  children: (
                    <div>
                      <Text strong>Application Submitted</Text>
                      <br />
                      <Text type="secondary">
                        {AdminUtils.formatDate(company.submissionDate)}
                      </Text>
                    </div>
                  ),
                  color: 'blue'
                },
                ...(company.status === 'under_review' ? [{
                  children: (
                    <div>
                      <Text strong>Under Review</Text>
                      <br />
                      <Text type="secondary">Being processed by admin</Text>
                    </div>
                  ),
                  color: 'orange'
                }] : []),
                ...(company.status === 'approved' ? [{
                  children: (
                    <div>
                      <Text strong>Application Approved</Text>
                      <br />
                      <Text type="secondary">
                        {company.processedDate ? AdminUtils.formatDate(company.processedDate) : 'Recently'}
                      </Text>
                    </div>
                  ),
                  color: 'green'
                }] : []),
                ...(company.status === 'rejected' ? [{
                  children: (
                    <div>
                      <Text strong>Application Rejected</Text>
                      <br />
                      <Text type="secondary">
                        {company.processedDate ? AdminUtils.formatDate(company.processedDate) : 'Recently'}
                      </Text>
                    </div>
                  ),
                  color: 'red'
                }] : [])
              ]}
            />
          </Card>
        </Col>
      </Row>
    </Card>
  );

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar style={{ backgroundColor: '#1890ff' }}>
            {company.companyName.charAt(0)}
          </Avatar>
          <div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {company.companyName}
            </div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Application #{company.id} • {AdminUtils.formatRelativeTime(company.submissionDate)}
            </Text>
          </div>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button onClick={onClose}>
            Close
          </Button>
          
          {(company.status === 'pending' || company.status === 'under_review') && (
            <Space>
              {onReject && (
                <Button
                  danger
                  icon={<CloseCircleOutlined />}
                  onClick={() => onReject(company)}
                >
                  Reject
                </Button>
              )}
              {onApprove && (
                <Button
                  type="primary"
                  icon={<CheckCircleOutlined />}
                  onClick={() => onApprove(company)}
                  style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                >
                  Approve
                </Button>
              )}
            </Space>
          )}
        </div>
      }
    >
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        items={[
          {
            key: 'overview',
            label: (
              <span>
                <UserOutlined />
                Personal Info
              </span>
            ),
            children: renderPersonalInfo()
          },
          {
            key: 'company',
            label: (
              <span>
                <HomeOutlined />
                Company Info
              </span>
            ),
            children: renderCompanyInfo()
          },
          {
            key: 'address',
            label: (
              <span>
                <EnvironmentOutlined />
                Address
              </span>
            ),
            children: renderAddressInfo()
          },
          {
            key: 'services',
            label: (
              <span>
                <ToolOutlined />
                Services & Plan
              </span>
            ),
            children: renderServicePlan()
          },
          {
            key: 'status',
            label: (
              <span>
                <FileTextOutlined />
                Status & History
              </span>
            ),
            children: renderStatusHistory()
          }
        ]}
      />
    </Modal>
  );
};

export default CompanyDetailModalEnhanced;
