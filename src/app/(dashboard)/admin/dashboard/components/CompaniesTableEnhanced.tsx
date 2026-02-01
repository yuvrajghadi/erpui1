'use client';

/**
 * Enhanced Companies Table Component
 * Displays company onboarding applications with advanced filtering and actions
 */

import React, { useState, useMemo } from 'react';
import {
  Table,
  Card,
  Input,
  Select,
  Button,
  Tag,
  Space,
  Tooltip,
  DatePicker,
  Row,
  Col,
  Avatar,
  Typography,
  Dropdown,
  MenuProps,
  Badge
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  MoreOutlined,
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  DollarOutlined,
  DownloadOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { CompanyOnboardingData, TableFilters } from '../../types/admin.types';
import { AdminUtils } from '../../utils/admin.utils';

const { RangePicker } = DatePicker;
const { Text } = Typography;

interface CompaniesTableProps {
  companies: CompanyOnboardingData[];
  loading?: boolean;
  onView: (company: CompanyOnboardingData) => void;
  onApprove: (company: CompanyOnboardingData) => void;
  onReject: (company: CompanyOnboardingData) => void;
  onRefresh: () => void;
}

/**
 * Enhanced Companies Table Component
 */
const CompaniesTable: React.FC<CompaniesTableProps> = ({
  companies,
  loading = false,
  onView,
  onApprove,
  onReject,
  onRefresh
}) => {
  const [filters, setFilters] = useState<TableFilters>({});
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // Filter companies based on current filters
  const filteredData = useMemo(() => {
    return AdminUtils.filterCompanies(companies, filters);
  }, [companies, filters]);

  // Update filters
  const updateFilters = (newFilters: Partial<TableFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({});
  };

  // Actions dropdown menu
  const getActionMenu = (record: CompanyOnboardingData): MenuProps => ({
    items: [
      {
        key: 'view',
        icon: <EyeOutlined />,
        label: 'View Details',
        onClick: () => onView(record)
      },
      {
        key: 'divider1',
        type: 'divider'
      },
      ...(record.status === 'pending' || record.status === 'under_review' ? [
        {
          key: 'approve',
          icon: <CheckOutlined />,
          label: 'Approve',
          onClick: () => onApprove(record)
        },
        {
          key: 'reject',
          icon: <CloseOutlined />,
          label: 'Reject',
          onClick: () => onReject(record)
        }
      ] : []),
      {
        key: 'divider2',
        type: 'divider'
      },
      {
        key: 'download',
        icon: <DownloadOutlined />,
        label: 'Download PDF',
        onClick: () => console.log('Download PDF for', record.companyName)
      }
    ]
  });

  // Table columns configuration
  const columns: ColumnsType<CompanyOnboardingData> = [
    {
      title: 'Company',
      key: 'company',
      fixed: 'left',
      width: 300,
      render: (_, record) => (
        <div className="company-info">
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar 
              size={40} 
              style={{ 
                backgroundColor: 'var(--color-1890ff)',
                fontWeight: 'bold'
              }}
            >
              {record.companyName.charAt(0).toUpperCase()}
            </Avatar>
            <div>
              <div style={{ fontWeight: 600, color: 'var(--text-color)', marginBottom: 2 }}>
                {record.companyName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {record.firstName} {record.lastName}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {record.companyEmail}
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: 'Industry',
      dataIndex: 'industryType',
      key: 'industryType',
      width: 120,
      render: (industryType) => (
        <Tag color="blue">{industryType}</Tag>
      ),
      filters: [
        { text: 'IT', value: 'IT' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Healthcare', value: 'Healthcare' },
        { text: 'Manufacturing', value: 'Manufacturing' },
        { text: 'Retail', value: 'Retail' },
        { text: 'Education', value: 'Education' }
      ],
      onFilter: (value, record) => record.industryType === value
    },
    {
      title: 'Team Size',
      dataIndex: 'employees',
      key: 'employees',
      width: 100,
      render: (employees) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <TeamOutlined style={{ color: 'var(--text-muted)' }} />
          <Text>{employees}</Text>
        </div>
      ),
      sorter: (a, b) => a.employees - b.employees
    },
    {
      title: 'Services',
      dataIndex: 'services',
      key: 'services',
      width: 160,
      render: (services: string[]) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {services.map(service => (
            <Tag 
              key={service} 
              color={
                service === 'inventory' ? 'orange' :
                service === 'accounts' ? 'green' :
                service === 'hrms' ? 'purple' : 'default'
              }
              style={{ fontSize: 11, margin: 0 }}
            >
              {service.toUpperCase()}
            </Tag>
          ))}
        </div>
      )
    },
    {
      title: 'Plan',
      dataIndex: 'planDuration',
      key: 'planDuration',
      width: 100,
      render: (planDuration) => {
        const planLabels: Record<string, string> = {
          monthly: '1M',
          quarterly: '3M',
          semi_annual: '6M',
          annual: '1Y',
          five_year: '5Y'
        };
        return (
          <Tag color="cyan">
            {planLabels[planDuration] || planDuration}
          </Tag>
        );
      }
    },
    {
      title: 'Value',
      key: 'value',
      width: 120,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <DollarOutlined style={{ color: 'var(--color-52c41a)' }} />
          <Text strong style={{ color: 'var(--color-52c41a)' }}>
            ₹{record.pricingDetails?.finalPrice?.toLocaleString() || '0'}
          </Text>
        </div>
      ),
      sorter: (a, b) => (a.pricingDetails?.finalPrice || 0) - (b.pricingDetails?.finalPrice || 0)
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (status) => {
        const statusConfig = {
          pending: { color: 'orange', text: 'Pending' },
          approved: { color: 'green', text: 'Approved' },
          rejected: { color: 'red', text: 'Rejected' },
          under_review: { color: 'blue', text: 'Under Review' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Badge 
            status={config.color as any} 
            text={config.text}
          />
        );
      },
      filters: [
        { text: 'Pending', value: 'pending' },
        { text: 'Under Review', value: 'under_review' },
        { text: 'Approved', value: 'approved' },
        { text: 'Rejected', value: 'rejected' }
      ],
      onFilter: (value, record) => record.status === value
    },
    {
      title: 'Submitted',
      dataIndex: 'submissionDate',
      key: 'submissionDate',
      width: 120,
      render: (date) => (
        <div style={{ fontSize: 12 }}>
          <div>{AdminUtils.formatDate(date)}</div>
          <Text type="secondary" style={{ fontSize: 11 }}>
            {AdminUtils.formatRelativeTime(date)}
          </Text>
        </div>
      ),
      sorter: (a, b) => new Date(a.submissionDate).getTime() - new Date(b.submissionDate).getTime(),
      defaultSortOrder: 'descend'
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="primary"
              ghost
              size="small"
              icon={<EyeOutlined />}
              onClick={() => onView(record)}
            />
          </Tooltip>
          
          {(record.status === 'pending' || record.status === 'under_review') && (
            <>
              <Tooltip title="Approve">
                <Button
                  type="primary"
                  size="small"
                  icon={<CheckOutlined />}
                  onClick={() => onApprove(record)}
                  style={{ backgroundColor: 'var(--color-52c41a)', borderColor: 'var(--color-52c41a)' }}
                />
              </Tooltip>
              
              <Tooltip title="Reject">
                <Button
                  danger
                  size="small"
                  icon={<CloseOutlined />}
                  onClick={() => onReject(record)}
                />
              </Tooltip>
            </>
          )}
          
          <Dropdown menu={getActionMenu(record)} trigger={['click']}>
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined />}
            />
          </Dropdown>
        </Space>
      )
    }
  ];

  // Row selection configuration
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys: React.Key[]) => {
      setSelectedRowKeys(newSelectedRowKeys);
    },
    getCheckboxProps: (record: CompanyOnboardingData) => ({
      disabled: record.status === 'approved' || record.status === 'rejected'
    })
  };

  return (
    <Card className="companies-table-container">
      {/* Table Header with Filters */}
      <div className="companies-table-header">
        <div className="companies-table-title-section">
          <h3 className="companies-table-title">Company Applications</h3>
          <Text type="secondary">
            Manage and review company onboarding applications
          </Text>
        </div>
        
        <div className="companies-table-actions">
          <Button
            icon={<ReloadOutlined />}
            onClick={onRefresh}
            loading={loading}
          >
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="companies-table-filters">
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Input
              placeholder="Search companies..."
              prefix={<SearchOutlined />}
              value={filters.searchTerm}
              onChange={(e) => updateFilters({ searchTerm: e.target.value })}
              allowClear
            />
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by status"
              style={{ width: '100%' }}
              value={filters.status}
              onChange={(value) => updateFilters({ status: value })}
              mode="multiple"
              allowClear
              options={[
                { label: 'Pending', value: 'pending' },
                { label: 'Under Review', value: 'under_review' },
                { label: 'Approved', value: 'approved' },
                { label: 'Rejected', value: 'rejected' }
              ]}
            />
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <Select
              placeholder="Filter by industry"
              style={{ width: '100%' }}
              value={filters.businessType}
              onChange={(value) => updateFilters({ businessType: value })}
              mode="multiple"
              allowClear
              options={[
                { label: 'IT', value: 'IT' },
                { label: 'Finance', value: 'Finance' },
                { label: 'Healthcare', value: 'Healthcare' },
                { label: 'Manufacturing', value: 'Manufacturing' },
                { label: 'Retail', value: 'Retail' },
                { label: 'Education', value: 'Education' }
              ]}
            />
          </Col>
          
          <Col xs={24} sm={12} md={8} lg={6}>
            <RangePicker
              style={{ width: '100%' }}
              value={filters.dateRange as any}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  updateFilters({ 
                    dateRange: [dates[0].toDate(), dates[1].toDate()] 
                  });
                } else {
                  updateFilters({ dateRange: undefined });
                }
              }}
              placeholder={['Start Date', 'End Date']}
            />
          </Col>
        </Row>
        
        {/* Filter Actions */}
        {Object.keys(filters).length > 0 && (
          <div style={{ marginTop: 16, textAlign: 'right' }}>
            <Button onClick={clearFilters} size="small">
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Table */}
      <Table
        className="companies-table"
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        rowSelection={rowSelection}
        scroll={{ x: 1200 }}
        pagination={{
          total: filteredData.length,
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => 
            `${range[0]}-${range[1]} of ${total} applications`
        }}
        summary={(pageData) => {
          const totalValue = pageData.reduce(
            (sum, record) => sum + (record.pricingDetails?.finalPrice || 0), 
            0
          );
          
          return (
            <Table.Summary.Row>
              <Table.Summary.Cell index={0} colSpan={6}>
                <Text strong>Page Total</Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={1}>
                <Text strong style={{ color: 'var(--color-52c41a)' }}>
                  ₹{totalValue.toLocaleString()}
                </Text>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={2} colSpan={3} />
            </Table.Summary.Row>
          );
        }}
      />
      
      {/* Bulk Actions */}
      {selectedRowKeys.length > 0 && (
        <div className="bulk-actions" style={{ 
          position: 'fixed', 
          bottom: 24, 
          left: '50%', 
          transform: 'translateX(-50%)',
          background: 'var(--card-bg)',
          padding: '12px 24px',
          borderRadius: 8,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          border: '1px solid var(--border-color)',
          zIndex: 1000
        }}>
          <Space>
            <Text>{selectedRowKeys.length} selected</Text>
            <Button size="small">Bulk Approve</Button>
            <Button size="small" danger>Bulk Reject</Button>
            <Button size="small" onClick={() => setSelectedRowKeys([])}>
              Clear Selection
            </Button>
          </Space>
        </div>
      )}
    </Card>
  );
};

export default CompaniesTable;
