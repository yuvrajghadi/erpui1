/**
 * Global Traceability Drawer Component
 * Reusable drawer for tracing material/product journey from FG to Supplier
 * Signature ERP feature for complete supply chain visibility
 */

'use client';

import React from 'react';
import { Drawer, Timeline, Card, Tag, Space, Descriptions, Divider, Empty, Button } from 'antd';
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseOutlined,
  EnvironmentOutlined,
  UserOutlined,
  CalendarOutlined,
  InboxOutlined,
  ScissorOutlined,
  ShoppingOutlined,
  ApartmentOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

export interface TraceStep {
  stage: string;
  date: string;
  location: string;
  operator?: string;
  quantity?: number;
  uom?: string;
  lotNumber?: string;
  batchNumber?: string;
  status: 'completed' | 'in-progress' | 'pending';
  remarks?: string;
  icon?: React.ReactNode;
}

interface TraceabilityDrawerProps {
  open: boolean;
  onClose: () => void;
  itemName: string;
  itemCode?: string;
  traceData: TraceStep[];
}

const TraceabilityDrawer: React.FC<TraceabilityDrawerProps> = ({
  open,
  onClose,
  itemName,
  itemCode,
  traceData,
}) => {
  const getStageIcon = (stage: string) => {
    const stageLower = stage.toLowerCase();
    if (stageLower.includes('finish')) return <CheckCircleOutlined />;
    if (stageLower.includes('wash')) return <InboxOutlined />;
    if (stageLower.includes('stitch')) return <ScissorOutlined />;
    if (stageLower.includes('cut')) return <ScissorOutlined />;
    if (stageLower.includes('fabric') || stageLower.includes('roll')) return <InboxOutlined />;
    if (stageLower.includes('dye')) return <InboxOutlined />;
    if (stageLower.includes('supplier')) return <ShoppingOutlined />;
    if (stageLower.includes('warehouse')) return <ApartmentOutlined />;
    return <ClockCircleOutlined />;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'var(--color-52c41a)';
      case 'in-progress':
        return 'var(--color-1890ff)';
      case 'pending':
        return 'var(--color-8c8c8c)';
      default:
        return 'var(--color-8c8c8c)';
    }
  };

  return (
    <Drawer
      className="inventory-drawer"
      open={open}
      onClose={onClose}
      title={
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Material Traceability</span>
        </div>
      }
      width={typeof window !== 'undefined' && window.innerWidth > 768 ? 720 : '100%'}
      closeIcon={<CloseOutlined />}
      styles={{
        header: {
          borderBottom: '1px solid var(--color-f0f0f0)',
          paddingLeft: '24px',
        },
      }}
    >
      {/* Item Header */}
      <Card
        size="small"
        style={{
          marginBottom: '24px',
          background: 'linear-gradient(135deg, var(--color-667eea) 0%, var(--color-764ba2) 100%)',
          border: 'none',
          borderRadius: '8px',
        }}
      >
        <div style={{ color: 'var(--color-ffffff)' }}>
          <h3 style={{ color: 'var(--color-ffffff)', margin: 0, marginBottom: '8px', fontSize: '18px' }}>
            {itemName}
          </h3>
          {itemCode && (
            <Tag color="rgba(255, 255, 255, 0.2)" style={{ color: 'var(--color-ffffff)', border: 'none' }}>
              Code: {itemCode}
            </Tag>
          )}
        </div>
      </Card>

      {/* Trace Timeline */}
      {traceData.length > 0 ? (
        <Timeline
          mode="left"
          style={{ marginTop: '24px' }}
          items={traceData.map((step, index) => ({
            color: getStatusColor(step.status),
            dot:
              step.status === 'completed' ? (
                <CheckCircleOutlined style={{ fontSize: '16px' }} />
              ) : step.status === 'in-progress' ? (
                <ClockCircleOutlined style={{ fontSize: '16px' }} />
              ) : (
                <ClockCircleOutlined style={{ fontSize: '16px', color: 'var(--color-d9d9d9)' }} />
              ),
            children: (
              <Card
                size="small"
                hoverable
                style={{
                  marginBottom: '12px',
                  borderRadius: '8px',
                  border: `1px solid ${step.status === 'completed' ? 'var(--color-d9f7be)' : 'var(--color-e8e8e8)'}`,
                  background: step.status === 'completed' ? 'var(--color-f6ffed)' : 'var(--color-ffffff)',
                }}
              >
                <Space direction="vertical" size="small" style={{ width: '100%' }}>
                  {/* Stage Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Space>
                      {step.icon || getStageIcon(step.stage)}
                      <strong style={{ fontSize: '15px' }}>{step.stage}</strong>
                    </Space>
                    <Tag
                      color={
                        step.status === 'completed'
                          ? 'success'
                          : step.status === 'in-progress'
                          ? 'processing'
                          : 'default'
                      }
                    >
                      {step.status.replace('-', ' ').toUpperCase()}
                    </Tag>
                  </div>

                  <Divider style={{ margin: '8px 0' }} />

                  {/* Stage Details */}
                  <Descriptions size="small" column={1} colon={false}>
                    <Descriptions.Item
                      label={
                        <Space>
                          <CalendarOutlined />
                          <span>Date</span>
                        </Space>
                      }
                    >
                      {dayjs(step.date).format('DD MMM YYYY, HH:mm')}
                    </Descriptions.Item>

                    <Descriptions.Item
                      label={
                        <Space>
                          <EnvironmentOutlined />
                          <span>Location</span>
                        </Space>
                      }
                    >
                      {step.location}
                    </Descriptions.Item>

                    {step.operator && (
                      <Descriptions.Item
                        label={
                          <Space>
                            <UserOutlined />
                            <span>Operator</span>
                          </Space>
                        }
                      >
                        {step.operator}
                      </Descriptions.Item>
                    )}

                    {step.quantity !== undefined && (
                      <Descriptions.Item
                        label={
                          <Space>
                            <InboxOutlined />
                            <span>Quantity</span>
                          </Space>
                        }
                      >
                        <Tag color="blue">
                          {step.quantity} {step.uom || 'units'}
                        </Tag>
                      </Descriptions.Item>
                    )}

                    {step.lotNumber && (
                      <Descriptions.Item label="Lot Number">
                        <Tag color="purple">{step.lotNumber}</Tag>
                      </Descriptions.Item>
                    )}

                    {step.batchNumber && (
                      <Descriptions.Item label="Batch Number">
                        <Tag color="orange">{step.batchNumber}</Tag>
                      </Descriptions.Item>
                    )}

                    {step.remarks && (
                      <Descriptions.Item label="Remarks">
                        <span style={{ color: 'var(--color-595959)', fontSize: '13px' }}>{step.remarks}</span>
                      </Descriptions.Item>
                    )}
                  </Descriptions>
                </Space>
              </Card>
            ),
          }))}
        />
      ) : (
        <Empty
          description="No traceability data available"
          style={{ marginTop: '48px', marginBottom: '48px' }}
        />
      )}

      {/* Footer Info */}
      <Card
        size="small"
        style={{
          marginTop: '24px',
          background: 'var(--color-f0f5ff)',
          border: '1px solid var(--color-adc6ff)',
          borderRadius: '8px',
        }}
      >
        <Space direction="vertical" size="small" style={{ width: '100%' }}>
          <div style={{ fontSize: '12px', color: 'var(--color-595959)' }}>
            <strong>Traceability Path:</strong> Finished Goods → Production Stages → Raw Material → Supplier
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-8c8c8c)' }}>
            This trace provides complete visibility from final product to original supplier, ensuring quality control and compliance.
          </div>
        </Space>
      </Card>
    </Drawer>
  );
};

export default TraceabilityDrawer;
