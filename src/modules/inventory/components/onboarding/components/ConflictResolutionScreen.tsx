/**
 * Conflict Resolution Screen
 * Handles conflicts when Excel values don't match existing ERP data
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Table, Radio, Select, Alert, Space, Tag, Button, Tooltip } from 'antd';
import { CheckCircleOutlined, WarningOutlined, InfoCircleOutlined } from '@ant-design/icons';
import type { ConflictItem, ConflictResolutionAction } from '../types';

interface ConflictResolutionScreenProps {
  conflicts: ConflictItem[];
  onResolve: (resolvedConflicts: ConflictItem[]) => void;
  onBack: () => void;
  masterName: string;
}

const ConflictResolutionScreen: React.FC<ConflictResolutionScreenProps> = ({
  conflicts,
  onResolve,
  onBack,
  masterName,
}) => {
  const [resolvedConflicts, setResolvedConflicts] = useState<ConflictItem[]>(conflicts);
  const [allResolved, setAllResolved] = useState(false);

  useEffect(() => {
    const allHaveResolution = resolvedConflicts.every(c => c.resolution !== undefined);
    setAllResolved(allHaveResolution);
  }, [resolvedConflicts]);

  const handleResolutionChange = (rowIndex: number, action: ConflictResolutionAction) => {
    setResolvedConflicts(prev =>
      prev.map(conflict =>
        conflict.rowIndex === rowIndex
          ? { ...conflict, resolution: action, selectedExistingId: action === 'map-existing' ? conflict.suggestedMatch : undefined }
          : conflict
      )
    );
  };

  const handleExistingSelection = (rowIndex: number, existingId: string) => {
    setResolvedConflicts(prev =>
      prev.map(conflict =>
        conflict.rowIndex === rowIndex
          ? { ...conflict, selectedExistingId: existingId }
          : conflict
      )
    );
  };

  const unresolvedCount = resolvedConflicts.filter(c => !c.resolution).length;
  const mapToExistingCount = resolvedConflicts.filter(c => c.resolution === 'map-existing').length;
  const createNewCount = resolvedConflicts.filter(c => c.resolution === 'create-new').length;
  const skipCount = resolvedConflicts.filter(c => c.resolution === 'skip').length;

  const columns = [
    {
      title: 'Row',
      dataIndex: 'rowIndex',
      key: 'rowIndex',
      width: 70,
      fixed: 'left' as const,
      render: (row: number) => <Tag color="blue">#{row}</Tag>,
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      width: 120,
      render: (field: string) => <Tag color="purple">{field}</Tag>,
    },
    {
      title: 'Excel Value',
      dataIndex: 'excelValue',
      key: 'excelValue',
      width: 200,
      render: (value: string) => (
        <span style={{ fontWeight: 600, color: 'var(--color-1890ff)' }}>{value}</span>
      ),
    },
    {
      title: 'Resolution',
      key: 'resolution',
      width: 300,
      render: (_: any, record: ConflictItem) => (
        <Radio.Group
          value={record.resolution}
          onChange={(e) => handleResolutionChange(record.rowIndex, e.target.value)}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            <Radio value="map-existing">
              <Space>
                <span>Map to Existing</span>
                <Tooltip title="Link this Excel value to an existing record in ERP">
                  <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
                </Tooltip>
              </Space>
            </Radio>
            {record.resolution === 'map-existing' && (
              <Select
                value={record.selectedExistingId}
                onChange={(value) => handleExistingSelection(record.rowIndex, value)}
                style={{ width: '100%', marginLeft: 24 }}
                placeholder="Select existing record"
                showSearch
                optionFilterProp="children"
              >
                {record.existingOptions.map(opt => (
                  <Select.Option key={opt.id} value={opt.id}>
                    {opt.label}
                    {opt.id === record.suggestedMatch && (
                      <Tag color="green" style={{ marginLeft: 8, fontSize: 11 }}>
                        Suggested
                      </Tag>
                    )}
                  </Select.Option>
                ))}
              </Select>
            )}

            <Radio value="create-new">
              <Space>
                <span>Create New</span>
                <Tooltip title="Create a new record with this value">
                  <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
                </Tooltip>
              </Space>
            </Radio>

            <Radio value="skip">
              <Space>
                <span>Skip This Row</span>
                <Tooltip title="Ignore this row during import">
                  <InfoCircleOutlined style={{ color: 'var(--color-8c8c8c)' }} />
                </Tooltip>
              </Space>
            </Radio>
          </Space>
        </Radio.Group>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 100,
      fixed: 'right' as const,
      render: (_: any, record: ConflictItem) => {
        if (!record.resolution) {
          return <Tag icon={<WarningOutlined />} color="warning">Pending</Tag>;
        }
        if (record.resolution === 'map-existing' && !record.selectedExistingId) {
          return <Tag icon={<WarningOutlined />} color="warning">Select Record</Tag>;
        }
        return <Tag icon={<CheckCircleOutlined />} color="success">Resolved</Tag>;
      },
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      {/* Header Alert */}
      <Alert
        message="Conflicts Detected"
        description={
          <div>
            <p style={{ marginBottom: 8 }}>
              Found {conflicts.length} value(s) in your Excel that don't match existing records in ERP.
              Choose how to handle each conflict:
            </p>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li><strong>Map to Existing:</strong> Link to an existing record (recommended for duplicates)</li>
              <li><strong>Create New:</strong> Add as a new record</li>
              <li><strong>Skip This Row:</strong> Ignore this row completely</li>
            </ul>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Summary Stats */}
      <div style={{ 
        display: 'flex', 
        gap: 16, 
        marginBottom: 16,
        padding: 16,
        background: 'var(--page-bg)',
        borderRadius: 8,
      }}>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-faad14)' }}>{unresolvedCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Unresolved</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-1890ff)' }}>{mapToExistingCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Map Existing</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-52c41a)' }}>{createNewCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Create New</div>
        </div>
        <div style={{ flex: 1, textAlign: 'center' }}>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-8c8c8c)' }}>{skipCount}</div>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>Skip</div>
        </div>
      </div>

      {/* Conflicts Table */}
      <Table
        columns={columns}
        dataSource={resolvedConflicts}
        rowKey="rowIndex"
        pagination={false}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      {/* Actions */}
      <div style={{ 
        marginTop: 16, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <Button onClick={onBack}>
          ← Back to Mapping
        </Button>

        <Space>
          {!allResolved && (
            <span style={{ color: 'var(--color-faad14)', fontSize: 13 }}>
              <WarningOutlined /> Please resolve all conflicts to continue
            </span>
          )}
          <Button
            type="primary"
            onClick={() => onResolve(resolvedConflicts)}
            disabled={!allResolved}
            size="large"
          >
            Continue to Review →
          </Button>
        </Space>
      </div>
    </div>
  );
};

export default ConflictResolutionScreen;
