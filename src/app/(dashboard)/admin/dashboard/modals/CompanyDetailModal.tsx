'use client';

/**
 * Company Detail Modal Component
 * Displays detailed information about a company application
 */

import React from 'react';
import {
  Modal,
  Descriptions,
  Tag,
  Button,
  Space,
  Divider,
  Typography,
  Row,
  Col,
  Card,
  List,
  Badge,
  Tooltip
} from 'antd';
import {
  DownloadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  GlobalOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { CompanyOnboardingData } from '../../types/admin.types';
import { AdminUtils } from '../../utils/admin.utils';

const { Title, Text, Paragraph } = Typography;

interface CompanyDetailModalProps {
  visible: boolean;
  company: CompanyOnboardingData | null;
  onClose: () => void;
  onStatusUpdate?: (companyId: string, newStatus: CompanyOnboardingData['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  loading?: boolean;
}

/**
 * Document Item Component
 */
interface DocumentItemProps {
  document: CompanyOnboardingData['documents'][0];
  onDownload?: (document: CompanyOnboardingData['documents'][0]) => void;
}

const DocumentItem: React.FC<DocumentItemProps> = ({ document, onDownload }) => {
  const getDocumentTypeIcon = (type: string) => {
    const icons = {
      business_license: <FileTextOutlined />,
      tax_certificate: <FileTextOutlined />,
      bank_statement: <BankOutlined />,
      identity_proof: <FileTextOutlined />,
      other: <FileTextOutlined />
    };
    return icons[type as keyof typeof icons] || <FileTextOutlined />;
  };

  const getDocumentTypeName = (type: string) => {
    const names = {
      business_license: 'Business License',
      tax_certificate: 'Tax Certificate',
      bank_statement: 'Bank Statement',
      identity_proof: 'Identity Proof',
      other: 'Other Document'
    };
    return names[type as keyof typeof names] || 'Document';
  };

  return (
    <div className="document-item">
      <div className="document-info">
        <div className="document-icon">
          {getDocumentTypeIcon(document.type)}
        </div>
        <div className="document-details">
          <h4>{document.name}</h4>
          <p>
            {getDocumentTypeName(document.type)} • 
            Uploaded {AdminUtils.formatRelativeTime(document.uploadDate)}
          </p>
        </div>
      </div>
      <div className="document-actions">
        <Badge
          status={document.verified ? 'success' : 'warning'}
          text={document.verified ? 'Verified' : 'Pending'}
        />
        <Button
          type="link"
          icon={<DownloadOutlined />}
          onClick={() => onDownload?.(document)}
        >
          Download
        </Button>
      </div>
    </div>
  );
};

/**
 * Company Detail Modal Component
 */
const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  visible,
  company,
  onClose,
  onStatusUpdate,
  loading
}) => {
  if (!company) return null;

  const handleDownload = (doc: CompanyOnboardingData['documents'][0]) => {
    // Simulate document download
    const link = window.document.createElement('a');
    link.href = doc.url;
    link.download = doc.name;
    window.document.body.appendChild(link);
    link.click();
    window.document.body.removeChild(link);
  };

  const handleStatusUpdate = async (newStatus: CompanyOnboardingData['status']) => {
    if (onStatusUpdate) {
      await onStatusUpdate(company.id, newStatus);
    }
  };

  const getStatusColor = (status: CompanyOnboardingData['status']) => {
    return AdminUtils.getStatusColor(status);
  };

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Company Application Details</span>
          <Tag color={getStatusColor(company.status)}>
            {AdminUtils.getStatusText(company.status)}
          </Tag>
        </div>
      }
      open={visible}
      onCancel={onClose}
      width={900}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
        ...(company.status === 'pending' || company.status === 'under_review' ? [
          <Button
            key="reject"
            danger
            icon={<CloseCircleOutlined />}
            onClick={() => handleStatusUpdate('rejected')}
            loading={loading}
          >
            Reject
          </Button>,
          <Button
            key="approve"
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={() => handleStatusUpdate('approved')}
            loading={loading}
          >
            Approve
          </Button>
        ] : [])
      ]}
      className="company-detail-modal"
    >
      <div className="company-detail-content">
        {/* Company Basic Information */}
        <div className="company-detail-section">
          <Title level={4} className="company-detail-section-title">
            Company Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card bordered={false} style={{ background: '#fafafa' }}>
                <div className="company-detail-grid">
                  <div className="company-detail-item">
                    <div className="company-detail-label">Company Name</div>
                    <div className="company-detail-value">{company.companyName}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Business Type</div>
                    <div className="company-detail-value">{company.businessType}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Registration Number</div>
                    <div className="company-detail-value">{company.registrationNumber}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Tax ID</div>
                    <div className="company-detail-value">{company.taxId}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Submission Date</div>
                    <div className="company-detail-value">
                      <CalendarOutlined style={{ marginRight: 8 }} />
                      {AdminUtils.formatDate(company.submissionDate)}
                    </div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Year Established</div>
                    <div className="company-detail-value">{company.businessDetails.yearEstablished}</div>
                  </div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Contact Information */}
        <div className="company-detail-section">
          <Title level={4} className="company-detail-section-title">
            Contact Information
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card title="Primary Contact" bordered={false}>
                <div className="company-detail-item">
                  <div className="company-detail-label">Name</div>
                  <div className="company-detail-value">{company.contactPerson.name}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">Designation</div>
                  <div className="company-detail-value">{company.contactPerson.designation}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">Email</div>
                  <div className="company-detail-value">
                    <MailOutlined style={{ marginRight: 8 }} />
                    {company.contactPerson.email}
                  </div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">Phone</div>
                  <div className="company-detail-value">
                    <PhoneOutlined style={{ marginRight: 8 }} />
                    {company.contactPerson.phone}
                  </div>
                </div>
              </Card>
            </Col>
            <Col span={12}>
              <Card title="Company Address" bordered={false}>
                <div className="company-detail-item">
                  <div className="company-detail-label">Street Address</div>
                  <div className="company-detail-value">{company.address.street}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">City</div>
                  <div className="company-detail-value">{company.address.city}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">State</div>
                  <div className="company-detail-value">{company.address.state}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">Country</div>
                  <div className="company-detail-value">{company.address.country}</div>
                </div>
                <div className="company-detail-item">
                  <div className="company-detail-label">Postal Code</div>
                  <div className="company-detail-value">{company.address.postalCode}</div>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Business Details */}
        <div className="company-detail-section">
          <Title level={4} className="company-detail-section-title">
            Business Details
          </Title>
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Card bordered={false}>
                <div className="company-detail-grid">
                  <div className="company-detail-item">
                    <div className="company-detail-label">Industry Type</div>
                    <div className="company-detail-value">{company.businessDetails.industryType}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Employee Count</div>
                    <div className="company-detail-value">{company.businessDetails.employeeCount}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Annual Revenue</div>
                    <div className="company-detail-value">{company.businessDetails.annualRevenue || 'Not specified'}</div>
                  </div>
                  <div className="company-detail-item">
                    <div className="company-detail-label">Website</div>
                    <div className="company-detail-value">
                      {company.businessDetails.websiteUrl ? (
                        <a href={company.businessDetails.websiteUrl} target="_blank" rel="noopener noreferrer">
                          <GlobalOutlined style={{ marginRight: 8 }} />
                          {company.businessDetails.websiteUrl}
                        </a>
                      ) : (
                        'Not provided'
                      )}
                    </div>
                  </div>
                </div>
                <div className="company-detail-item" style={{ marginTop: 16 }}>
                  <div className="company-detail-label">Business Description</div>
                  <Paragraph>{company.businessDetails.description}</Paragraph>
                </div>
              </Card>
            </Col>
          </Row>
        </div>

        <Divider />

        {/* Banking Information */}
        {company.bankDetails && (
          <>
            <div className="company-detail-section">
              <Title level={4} className="company-detail-section-title">
                Banking Information
              </Title>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Card bordered={false} style={{ background: '#f0f8ff' }}>
                    <div className="company-detail-grid">
                      <div className="company-detail-item">
                        <div className="company-detail-label">Bank Name</div>
                        <div className="company-detail-value">{company.bankDetails.bankName}</div>
                      </div>
                      <div className="company-detail-item">
                        <div className="company-detail-label">Account Number</div>
                        <div className="company-detail-value">{company.bankDetails.accountNumber}</div>
                      </div>
                      <div className="company-detail-item">
                        <div className="company-detail-label">Routing Number</div>
                        <div className="company-detail-value">{company.bankDetails.routingNumber}</div>
                      </div>
                      <div className="company-detail-item">
                        <div className="company-detail-label">Account Type</div>
                        <div className="company-detail-value">{company.bankDetails.accountType}</div>
                      </div>
                    </div>
                  </Card>
                </Col>
              </Row>
            </div>
            <Divider />
          </>
        )}

        {/* Documents */}
        <div className="company-detail-section">
          <Title level={4} className="company-detail-section-title">
            Uploaded Documents ({company.documents.length})
          </Title>
          <div className="document-list">
            {company.documents.map((document) => (
              <DocumentItem
                key={document.id}
                document={document}
                onDownload={handleDownload}
              />
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        {company.adminNotes && (
          <>
            <Divider />
            <div className="company-detail-section">
              <Title level={4} className="company-detail-section-title">
                Admin Notes
              </Title>
              <Card bordered={false} style={{ background: 'var(--color-fff7e6)' }}>
                <Paragraph>{company.adminNotes}</Paragraph>
              </Card>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

export default CompanyDetailModal;
