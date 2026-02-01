'use client';

/**
 * Companies Table Component
 * Displays and manages company onboarding applications in a table format
 */

import React, { useState, useCallback } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  DatePicker,
  Space,
  Tag,
  Tooltip,
  Popconfirm,
  message,
  Typography
} from 'antd';
import type { ColumnsType, TableProps } from 'antd/es/table';
import {
  SearchOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  ReloadOutlined,
  FilterOutlined,
  ClearOutlined
} from '@ant-design/icons';
import { CompanyOnboardingData, TableFilters } from '../../types/admin.types';
import { AdminUtils } from '../../utils/admin.utils';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Text } = Typography;

interface CompaniesTableProps {
  companies: CompanyOnboardingData[];
  loading?: boolean;
  onStatusUpdate: (companyId: string, newStatus: CompanyOnboardingData['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  onViewDetails: (company: CompanyOnboardingData) => void;
  onRefresh: () => void;
}

/**
 * Status Tag Component
 */
const StatusTag: React.FC<{ status: CompanyOnboardingData['status'] }> = ({ status }) => {
  const color = AdminUtils.getStatusColor(status);
  const text = AdminUtils.getStatusText(status);
  
  return (
    <Tag color={color} className={`status-tag ${status}`}>
      {text}
    </Tag>
  );
};

/**
 * Action Buttons Component
 */
interface ActionButtonsProps {
  company: CompanyOnboardingData;
  onStatusUpdate: (companyId: string, newStatus: CompanyOnboardingData['status'], notes?: string) => Promise<{ success: boolean; error?: string }>;
  onViewDetails: (company: CompanyOnboardingData) => void;
  loading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  company,
  onStatusUpdate,
  onViewDetails,
  loading
}) => {
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const handleStatusUpdate = async (newStatus: CompanyOnboardingData['status']) => {
    setActionLoading(newStatus);
    try {
      const result = await onStatusUpdate(company.id, newStatus);
      if (result.success) {
        message.success(`Company ${newStatus} successfully`);
      } else {
        message.error(result.error || 'Failed to update status');
      }
    } catch (error) {
      message.error('An error occurred while updating status');
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="action-buttons">
      <Tooltip title="View Details">
        <Button
          type="default"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => onViewDetails(company)}
          disabled={loading}
        >
          View
        </Button>
      </Tooltip>
      
      {company.status === 'pending' && (
        <>
          <Popconfirm
            title="Approve Application"
            description="Are you sure you want to approve this application?"
            onConfirm={() => handleStatusUpdate('approved')}
            okText="Approve"
            cancelText="Cancel"
          >
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              loading={actionLoading === 'approved'}
              disabled={loading || !!actionLoading}
            >
              Approve
            </Button>
          </Popconfirm>
          
          <Popconfirm
            title="Reject Application"
            description="Are you sure you want to reject this application?"
            onConfirm={() => handleStatusUpdate('rejected')}
            okText="Reject"
            cancelText="Cancel"
          >
            <Button
              type="default"
              danger
              size="small"
              icon={<CloseOutlined />}
              loading={actionLoading === 'rejected'}
              disabled={loading || !!actionLoading}
            >
              Reject
            </Button>
          </Popconfirm>
        </>
      )}
      
      {company.status === 'under_review' && (
        <>
          <Button
            type="primary"
            size="small"
            icon={<CheckOutlined />}
            onClick={() => handleStatusUpdate('approved')}
            loading={actionLoading === 'approved'}
            disabled={loading || !!actionLoading}
          >
            Approve
          </Button>
          
          <Button
            type="default"
            danger
            size="small"
            icon={<CloseOutlined />}
            onClick={() => handleStatusUpdate('rejected')}
            loading={actionLoading === 'rejected'}
            disabled={loading || !!actionLoading}
          >
            Reject
          </Button>
        </>
      )}
    </div>
  );
};

/**
 * Companies Table Component
 */
const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  loading,
  onStatusUpdate,
  onViewDetails,
  onRefresh
}) => {
  const [filters, setFilters] = useState<TableFilters>({});
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: companies.length
  });

  // Filter companies based on current filters
  const filteredCompanies = React.useMemo(() => {
    return AdminUtils.filterCompanies(companies, filters);
  }, [companies, filters]);

  // Update pagination when filtered data changes
  React.useEffect(() => {
    setPagination(prev => ({
      ...prev,
      total: filteredCompanies.length,
      current: 1
    }));
  }, [filteredCompanies.length]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof TableFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  // Clear all filters
  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Table columns configuration
  const columns: ColumnsType<CompanyOnboardingData> = [
    {
      title: 'Company Name',
      dataIndex: 'companyName',
      key: 'companyName',
      fixed: 'left',
      width: 200,
      sorter: (a, b) => a.companyName.localeCompare(b.companyName),
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.businessType}
          </Text>
        </div>
      )
    },
    {
      title: 'Contact Info',
      dataIndex: 'contactEmail',
      key: 'contactInfo',
      width: 220,
      render: (email, record) => (
        <div>
          <div>{record.contactPerson.name}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{email}</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{record.contactPhone}</div>
        </div>
      )
    },
    {
      title: 'Submission Date',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      width: 150,
      sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
      render: (date) => (
        <div>
          <div>{AdminUtils.formatDate(date)}</div>
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {AdminUtils.formatRelativeTime(date)}
          </Text>
        </div>
      )
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' },
        { text: 'Under Review', value: 'under_review' }
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => <StatusTag status={status} />
    },
    {
      title: 'Documents',
      dataIndex: 'documents',
      key: 'documents',
      width: 100,
      render: (documents) => (
        <div>
          <Text>{documents.length} files</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '11px' }}>
            {documents.filter((doc: any) => doc.verified).length} verified
          </Text>
        </div>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <ActionButtons
          company={record}
          onStatusUpdate={onStatusUpdate}
          onViewDetails={onViewDetails}
          loading={loading}
        />
      )
    }
  ];

  // Table props
  const tableProps: TableProps<CompanyOnboardingData> = {
    columns,
    dataSource: filteredCompanies,
    rowKey: 'id',
    loading,
    pagination: {
      ...pagination,
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: (total, range) => 
        `${range[0]}-${range[1]} of ${total} applications`,
      onChange: (page, pageSize) => {
        setPagination(prev => ({ ...prev, current: page, pageSize: pageSize || 10 }));
      }
    },
    scroll: { x: 1200 },
    size: 'middle'
  };

  return (
    <div className="companies-table-container">
      {/* Table Header with Filters */}
      <div className="companies-table-header">
        <h3 className="companies-table-title">
          Company Applications ({filteredCompanies.length})
        </h3>
        
        <div className="companies-table-filters">
          <Input
            className="companies-table-search"
            placeholder="Search companies, emails, or contacts..."
            prefix={<SearchOutlined />}
            value={filters.searchTerm || ''}
            onChange={(e) => handleFilterChange('searchTerm', e.target.value)}
            allowClear
          />
          
          <Select
            placeholder="Filter by Status"
            style={{ width: 150 }}
            value={filters.status}
            onChange={(value) => handleFilterChange('status', value)}
            allowClear
            mode="multiple"
          >
            <Option value="pending">Pending</Option>
            <Option value="approved">Approved</Option>
            <Option value="rejected">Rejected</Option>
            <Option value="under_review">Under Review</Option>
          </Select>
          
          <Select
            placeholder="Business Type"
            style={{ width: 150 }}
            value={filters.businessType}
            onChange={(value) => handleFilterChange('businessType', value)}
            allowClear
            mode="multiple"
          >
            <Option value="Technology">Technology</Option>
            <Option value="Manufacturing">Manufacturing</Option>
            <Option value="Retail">Retail</Option>
            <Option value="Healthcare">Healthcare</Option>
            <Option value="Finance">Finance</Option>
            <Option value="Education">Education</Option>
          </Select>
          
          <RangePicker
            placeholder={['Start Date', 'End Date']}
            value={filters.dateRange as any}
            onChange={(dates) => handleFilterChange('dateRange', dates)}
          />
          
          <Space>
            <Button
              icon={<ClearOutlined />}
              onClick={clearFilters}
              disabled={Object.keys(filters).length === 0}
            >
              Clear
            </Button>
            <Button
              icon={<ReloadOutlined />}
              onClick={onRefresh}
              loading={loading}
            >
              Refresh
            </Button>
          </Space>
        </div>
      </div>
      
      {/* Table */}
      <Table {...tableProps} className="companies-table" />
    </div>
  );
};

export default CompaniesTable;
