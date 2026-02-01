/**
 * Excel Preview & Confirmation Modal
 * Shows preview table and confirmation actions
 * For Textile & Garment ERP
 */

'use client';

import React from 'react';
import { Modal, Table, Button, Space, Alert, Typography, Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface ExcelPreviewModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  data: any[];
  columns: any[];
  masterName: string;
  isOpeningData?: boolean;
  validationErrors?: string[];
  loading?: boolean;
}

const ExcelPreviewModal: React.FC<ExcelPreviewModalProps> = ({
  open,
  onClose,
  onConfirm,
  data,
  columns,
  masterName,
  isOpeningData = false,
  validationErrors = [],
  loading = false,
}) => {
  const hasErrors = validationErrors.length > 0;

  return (
    <Modal
      title={
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <ExclamationCircleOutlined style={{ color: 'var(--color-1890ff)', fontSize: 20 }} />
          <span style={{ fontSize: 16, fontWeight: 600 }}>
            Preview & Confirm Import - {masterName}
          </span>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={1200}
      footer={null}
      destroyOnClose
    >
      <div style={{ marginTop: 16 }}>
        {/* Summary Card */}
        <div style={{
          padding: '16px 20px',
          background: hasErrors ? 'var(--color-fff7e6)' : 'var(--color-f6ffed)',
          border: `1px solid ${hasErrors ? 'var(--color-ffd591)' : 'var(--color-b7eb8f)'}`,
          borderRadius: 8,
          marginBottom: 16,
        }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontWeight: 600 }}>
                Total Rows: <span style={{ color: 'var(--color-1890ff)', fontSize: 16 }}>{data.length}</span>
              </Text>
              {hasErrors ? (
                <Tag color="warning" icon={<ExclamationCircleOutlined />}>
                  {validationErrors.length} Issues Found
                </Tag>
              ) : (
                <Tag color="success" icon={<CheckCircleOutlined />}>
                  Ready to Import
                </Tag>
              )}
            </div>
          </Space>
        </div>

        {/* Validation Errors */}
        {hasErrors && (
          <Alert
            message="Validation Issues"
            description={
              <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                {validationErrors.map((error, idx) => (
                  <li key={idx} style={{ color: 'var(--color-faad14)' }}>{error}</li>
                ))}
              </ul>
            }
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Opening Data Warning */}
        {isOpeningData && !hasErrors && (
          <Alert
            message="⚠️ One-Time Import"
            description="This is opening data. Once confirmed, it will be locked and cannot be changed through Excel import again."
            type="warning"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {/* Preview Table */}
        <div style={{ 
          border: '1px solid var(--color-e8e8e8)', 
          borderRadius: 8, 
          overflow: 'hidden',
          marginBottom: 20,
        }}>
          <Table
            dataSource={data}
            columns={columns}
            scroll={{ x: 'max-content', y: 400 }}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} rows`,
            }}
            size="small"
            bordered
          />
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 12,
          paddingTop: 16,
          borderTop: '1px solid var(--color-f0f0f0)',
        }}>
          <Button
            size="large"
            onClick={onClose}
            disabled={loading}
            style={{ minWidth: 120 }}
          >
            Cancel
          </Button>
          <Button
            type="primary"
            size="large"
            onClick={onConfirm}
            disabled={hasErrors || loading}
            loading={loading}
            icon={<CheckCircleOutlined />}
            style={{
              minWidth: 160,
              fontWeight: 600,
              background: hasErrors ? 'var(--color-d9d9d9)' : undefined,
            }}
          >
            Confirm Import
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExcelPreviewModal;
