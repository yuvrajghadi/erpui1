/**
 * Audit Log Viewer
 * Shows history of all imports during onboarding
 */

'use client';

import React, { useState } from 'react';
import { Card, Table, Tag, Space, Button, Select, DatePicker, Input } from 'antd';
import { SearchOutlined, DownloadOutlined, CheckCircleOutlined, CloseCircleOutlined, WarningOutlined } from '@ant-design/icons';
import type { AuditLogEntry } from '../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

interface AuditLogViewerProps {
  logs: AuditLogEntry[];
}

const AuditLogViewer: React.FC<AuditLogViewerProps> = ({ logs }) => {
  const [filterMaster, setFilterMaster] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchText, setSearchText] = useState<string>('');

  const filteredLogs = logs.filter(log => {
    if (filterMaster !== 'all' && log.masterType !== filterMaster) return false;
    if (filterStatus !== 'all' && log.status !== filterStatus) return false;
    if (searchText && !log.user.toLowerCase().includes(searchText.toLowerCase())) return false;
    return true;
  });

  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: 180,
      render: (text: string) => (
        <span style={{ fontFamily: 'monospace', fontSize: 12 }}>
          {dayjs(text).format('YYYY-MM-DD HH:mm:ss')}
        </span>
      ),
      sorter: (a: AuditLogEntry, b: AuditLogEntry) => 
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      defaultSortOrder: 'descend' as const,
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      width: 150,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (text: string) => {
        const colors: any = {
          import: 'green',
          update: 'orange',
          delete: 'red',
          validate: 'purple',
        };
        return <Tag color={colors[text] || 'default'}>{text.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Master Type',
      dataIndex: 'masterType',
      key: 'masterType',
      width: 120,
      render: (text: string) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'Records',
      dataIndex: 'recordCount',
      key: 'recordCount',
      width: 100,
      align: 'right' as const,
      render: (count: number) => (
        <span style={{ fontWeight: 600, fontSize: 14 }}>{count}</span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string, record: AuditLogEntry) => {
        if (status === 'success') {
          return <Tag icon={<CheckCircleOutlined />} color="success">Success</Tag>;
        } else if (status === 'partial') {
          return <Tag icon={<WarningOutlined />} color="warning">Partial</Tag>;
        } else {
          return <Tag icon={<CloseCircleOutlined />} color="error">Failed</Tag>;
        }
      },
    },
    {
      title: 'Success / Errors',
      key: 'details',
      width: 150,
      align: 'center' as const,
      render: (_: any, record: AuditLogEntry) => (
        <Space>
          <Tag color="success">{record.successCount || 0}</Tag>
          <span>/</span>
          <Tag color="error">{record.errorCount || 0}</Tag>
        </Space>
      ),
    },
    {
      title: 'Error Message',
      dataIndex: 'errorMessage',
      key: 'errorMessage',
      ellipsis: true,
      render: (text?: string) => text ? <span style={{ color: 'var(--color-ff4d4f)' }}>{text}</span> : '-',
    },
  ];

  const masterOptions = [
    { label: 'All Masters', value: 'all' },
    { label: 'Fabric', value: 'Fabric' },
    { label: 'Trim', value: 'Trim' },
    { label: 'Shade', value: 'Shade' },
    { label: 'UOM', value: 'UOM' },
    { label: 'Warehouse', value: 'Warehouse' },
    { label: 'Supplier', value: 'Supplier' },
    { label: 'Process', value: 'Process' },
    { label: 'Category', value: 'Category' },
    { label: 'BOM', value: 'BOM' },
    { label: 'Opening Stock', value: 'Opening Stock' },
  ];

  const statusOptions = [
    { label: 'All Status', value: 'all' },
    { label: 'Success', value: 'success' },
    { label: 'Partial', value: 'partial' },
    { label: 'Failed', value: 'failed' },
  ];

  const stats = {
    total: filteredLogs.length,
    success: filteredLogs.filter(l => l.status === 'success').length,
    partial: filteredLogs.filter(l => l.status === 'partial').length,
    failed: filteredLogs.filter(l => l.status === 'failed').length,
    totalRecords: filteredLogs.reduce((sum, l) => sum + l.recordCount, 0),
  };

  return (
    <div>
      <Card 
        title="Import Audit Log" 
        bordered={false}
        extra={
          <Button icon={<DownloadOutlined />} type="link">
            Export Log
          </Button>
        }
      >
        {/* Statistics */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(5, 1fr)', 
          gap: 16, 
          marginBottom: 16,
          padding: 16,
          background: 'var(--page-bg)',
          borderRadius: 8,
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-1890ff)' }}>{stats.total}</div>
            <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Total Imports</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-52c41a)' }}>{stats.success}</div>
            <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Successful</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-faad14)' }}>{stats.partial}</div>
            <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Partial</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-ff4d4f)' }}>{stats.failed}</div>
            <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Failed</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-722ed1)' }}>{stats.totalRecords}</div>
            <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Total Records</div>
          </div>
        </div>

        {/* Filters */}
        <Space style={{ marginBottom: 16 }} wrap>
          <Input 
            placeholder="Search by user" 
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            allowClear
          />
          <Select
            style={{ width: 150 }}
            value={filterMaster}
            onChange={setFilterMaster}
            options={masterOptions}
          />
          <Select
            style={{ width: 150 }}
            value={filterStatus}
            onChange={setFilterStatus}
            options={statusOptions}
          />
          <RangePicker />
        </Space>

        {/* Audit Log Table */}
        <Table
          columns={columns}
          dataSource={filteredLogs}
          rowKey="id"
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} imports`,
          }}
          size="small"
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default AuditLogViewer;
