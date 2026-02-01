/**
 * Transaction Preview Strip Component
 * Right-side vertical summary strip for all transactional drawers
 * Shows live updates of Total Quantity, Total Rolls, Loss %, Errors/Warnings
 */

'use client';

import React from 'react';
import { Card, Statistic, Tag, Alert, Space, Divider, Badge } from 'antd';
import {
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  InboxOutlined,
  PercentageOutlined,
} from '@ant-design/icons';

interface TransactionPreviewStripProps {
  totalQuantity: number;
  totalRolls?: number;
  uom?: string;
  lossPercentage?: number;
  errors?: string[];
  warnings?: string[];
  totalValue?: number;
  status?: 'success' | 'warning' | 'error' | 'processing';
}

const TransactionPreviewStrip: React.FC<TransactionPreviewStripProps> = ({
  totalQuantity,
  totalRolls,
  uom = 'kg',
  lossPercentage,
  errors = [],
  warnings = [],
  totalValue,
  status = 'processing',
}) => {
  return (
    <div
      style={{
        position: 'sticky',
        top: 0,
        width: '100%',
        height: 'fit-content',
        maxHeight: 'calc(100vh - 200px)',
        overflowY: 'auto',
        background: 'var(--page-bg)',
        borderRadius: '8px',
        padding: '16px',
        border: '1px solid var(--color-e8e8e8)',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '16px' }}>
        <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: 'var(--color-262626)' }}>
          Transaction Summary
        </h4>
      </div>

      <Divider style={{ margin: '12px 0' }} />

      {/* Total Quantity */}
      <Card
        size="small"
        style={{
          marginBottom: '12px',
          background: 'var(--color-ffffff)',
          borderRadius: '6px',
          border: '1px solid var(--color-d9d9d9)',
        }}
      >
        <Statistic
          title="Total Quantity"
          value={totalQuantity}
          suffix={uom}
          prefix={<InboxOutlined />}
          valueStyle={{
            color: totalQuantity > 0 ? 'var(--color-52c41a)' : 'var(--color-8c8c8c)',
            fontSize: '20px',
            fontWeight: 600,
          }}
        />
      </Card>

      {/* Total Rolls/Items */}
      {totalRolls !== undefined && (
        <Card
          size="small"
          style={{
            marginBottom: '12px',
            background: 'var(--color-ffffff)',
            borderRadius: '6px',
            border: '1px solid var(--color-d9d9d9)',
          }}
        >
          <Statistic
            title="Total Rolls/Items"
            value={totalRolls}
            valueStyle={{
              color: 'var(--color-1890ff)',
              fontSize: '20px',
              fontWeight: 600,
            }}
          />
        </Card>
      )}

      {/* Loss Percentage */}
      {lossPercentage !== undefined && (
        <Card
          size="small"
          style={{
            marginBottom: '12px',
            background: 'var(--color-ffffff)',
            borderRadius: '6px',
            border: '1px solid var(--color-d9d9d9)',
          }}
        >
          <Statistic
            title="Loss %"
            value={lossPercentage}
            suffix="%"
            prefix={<PercentageOutlined />}
            valueStyle={{
              color: lossPercentage > 5 ? 'var(--color-ff4d4f)' : lossPercentage > 2 ? 'var(--color-faad14)' : 'var(--color-52c41a)',
              fontSize: '20px',
              fontWeight: 600,
            }}
          />
          {lossPercentage > 5 && (
            <Tag color="error" style={{ marginTop: '8px' }}>
              High Loss Alert
            </Tag>
          )}
        </Card>
      )}

      {/* Total Value */}
      {totalValue !== undefined && (
        <Card
          size="small"
          style={{
            marginBottom: '12px',
            background: 'var(--color-ffffff)',
            borderRadius: '6px',
            border: '1px solid var(--color-d9d9d9)',
          }}
        >
          <Statistic
            title="Total Value"
            value={totalValue}
            prefix="₹"
            valueStyle={{
              color: 'var(--color-722ed1)',
              fontSize: '18px',
              fontWeight: 600,
            }}
          />
        </Card>
      )}

      <Divider style={{ margin: '12px 0' }} />

      {/* Errors & Warnings */}
      <Space direction="vertical" style={{ width: '100%' }} size="small">
        {errors.length > 0 && (
          <Alert
            message={
              <Badge count={errors.length} offset={[10, 0]}>
                <span style={{ fontWeight: 600 }}>Errors</span>
              </Badge>
            }
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {errors.map((error, idx) => (
                  <div
                    key={idx}
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'flex-start' }}
                  >
                    <CloseCircleOutlined style={{ color: 'var(--color-ff4d4f)', marginRight: '6px', marginTop: '2px' }} />
                    <span>{error}</span>
                  </div>
                ))}
              </Space>
            }
            type="error"
            showIcon={false}
            style={{ marginBottom: '8px', padding: '8px 12px' }}
          />
        )}

        {warnings.length > 0 && (
          <Alert
            message={
              <Badge count={warnings.length} offset={[10, 0]}>
                <span style={{ fontWeight: 600 }}>Warnings</span>
              </Badge>
            }
            description={
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                {warnings.map((warning, idx) => (
                  <div
                    key={idx}
                    style={{ fontSize: '12px', display: 'flex', alignItems: 'flex-start' }}
                  >
                    <WarningOutlined style={{ color: 'var(--color-faad14)', marginRight: '6px', marginTop: '2px' }} />
                    <span>{warning}</span>
                  </div>
                ))}
              </Space>
            }
            type="warning"
            showIcon={false}
            style={{ marginBottom: '8px', padding: '8px 12px' }}
          />
        )}

        {errors.length === 0 && warnings.length === 0 && (
          <Alert
            message="All Good"
            description="No errors or warnings detected"
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
            style={{ padding: '8px 12px' }}
          />
        )}
      </Space>

      {/* Status Badge */}
      <Divider style={{ margin: '12px 0' }} />
      <div style={{ textAlign: 'center' }}>
        <Badge
          status={status}
          text={
            <span style={{ fontSize: '13px', fontWeight: 500 }}>
              {status === 'success' && 'Ready to Submit'}
              {status === 'warning' && 'Review Required'}
              {status === 'error' && 'Fix Errors'}
              {status === 'processing' && 'In Progress'}
            </span>
          }
        />
      </div>
    </div>
  );
};

export default TransactionPreviewStrip;
