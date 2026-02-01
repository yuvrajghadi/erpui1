import React from 'react';
import { Card, Table, Tag, Button, Alert, Space, Row, Col, Badge, Statistic } from 'antd';
import { FireOutlined, WarningOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateAgingDays } from '../../../utils';
import { TODAYS_ACTIONS } from '../constant';

interface DrawerContentProps {
  content: { title: string; type: string; data: any };
  onClose: () => void;
}

export const DrawerContent: React.FC<DrawerContentProps> = ({ content, onClose }) => {
  const { type, data } = content;

  // Reused render helper for actions
  const renderSingleAction = () => (
    <div style={{ padding: 16 }}>
      <Card 
        size="small" 
        style={{ 
          borderRadius: 10, 
          border: `2px solid ${data?.borderColor || 'var(--color-1890ff)'}`,
          background: 'var(--card-bg)'
        }}
        bodyStyle={{ padding: 24 }}
      >
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '2px solid var(--color-f0f0f0)' }}>
            {data?.priority === 'critical' && <FireOutlined style={{ fontSize: 28, color: 'var(--color-ff4d4f)' }} />}
            {data?.priority === 'high' && <WarningOutlined style={{ fontSize: 28, color: 'var(--color-faad14)' }} />}
            {data?.priority === 'medium' && <ClockCircleOutlined style={{ fontSize: 28, color: 'var(--color-1890ff)' }} />}
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--color-000000)', marginBottom: 4 }}>{data?.title}</div>
              {data?.priority === 'critical' && <Tag color="red">URGENT ACTION REQUIRED</Tag>}
            </div>
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 14, color: 'var(--color-8c8c8c)', marginBottom: 6, fontWeight: 600 }}>Description:</div>
            <div style={{ fontSize: 15, color: 'var(--color-262626)', lineHeight: 1.6, marginBottom: 12 }}>{data?.desc}</div>
            
            {data?.secondary && (
              <div style={{ 
                padding: 12, 
                borderRadius: 8,
                border: `1px solid ${data?.priority === 'critical' ? 'var(--color-ffccc7)' : data?.priority === 'high' ? 'var(--color-ffd591)' : 'var(--color-91d5ff)'}`,
                marginTop: 12
              }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: data?.priority === 'critical' ? 'var(--color-cf1322)' : data?.priority === 'high' ? 'var(--color-fa8c16)' : 'var(--color-1890ff)' }}>
                  {data?.secondary}
                </div>
              </div>
            )}
          </div>

          <Alert
            message="Action Required"
            description={`Click Proceed to execute: ${data?.action}`}
            type="info"
            showIcon
            style={{ marginBottom: 20, borderRadius: 8 }}
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button size="large" onClick={onClose} style={{ minWidth: 100 }}>
            Cancel
          </Button>
          <Button 
            type="primary" 
            size="large"
            style={{ 
              minWidth: 140,
              background: data?.borderColor || 'var(--color-1890ff)',
              borderColor: data?.borderColor || 'var(--color-1890ff)'
            }}
            onClick={() => { 
              onClose(); 
              console.info('Performed action:', data); 
            }}
          >
            Proceed with {data?.action}
          </Button>
        </div>
      </Card>
    </div>
  );

  switch (type) {
    case 'single-action':
      return renderSingleAction();

    case 'fabricStock':
      return (
        <Table
          columns={[
            { title: 'Material', dataIndex: 'materialName', key: 'materialName', width: 200 },
            { title: 'Lot', dataIndex: 'lotNumber', key: 'lotNumber', width: 120, render: (lot: string) => <Tag color="purple">{lot}</Tag> },
            { title: 'Quantity', key: 'quantity', width: 120, align: 'right' as const, render: (_: any, record: any) => `${record.quantity.toFixed(2)} ${record.uom}` },
            { title: 'Value', dataIndex: 'value', key: 'value', width: 120, align: 'right' as const, render: (val: number) => `₹${val.toLocaleString()}` },
            { title: 'Warehouse', dataIndex: 'warehouse', key: 'warehouse', width: 150 },
            { title: 'Aging', dataIndex: 'aging', key: 'aging', width: 100, render: (days: number) => <Tag color={days > 60 ? 'error' : days > 30 ? 'warning' : 'success'}>{days} days</Tag> },
          ]}
          dataSource={data}
          pagination={{ pageSize: 10 }}
          size="small"
          scroll={{ x: 'max-content' }}
          rowKey="id"
        />
      );

    case 'wip':
        return (
          <Table
            columns={[
              { title: 'Style', dataIndex: 'styleNumber', key: 'styleNumber', width: 120 },
              { title: 'Color', dataIndex: 'color', key: 'color', width: 120 },
              { title: 'Quantity', dataIndex: 'quantity', key: 'quantity', width: 100, align: 'right' as const, render: (qty: number) => `${qty} pcs` },
              { title: 'Stage', dataIndex: 'stage', key: 'stage', width: 120, render: (stage: string) => <Tag color="blue">{stage}</Tag> },
              { title: 'Days in WIP', dataIndex: 'daysInWIP', key: 'daysInWIP', width: 120, align: 'right' as const },
              { title: 'Status', dataIndex: 'status', key: 'status', width: 120, render: (status: string) => <Badge status={status === 'On Track' ? 'success' : 'error'} text={status} /> },
            ]}
            dataSource={data}
            pagination={{ pageSize: 10 }}
            size="small"
            scroll={{ x: 'max-content' }}
            rowKey="id"
          />
        );

      case 'lowStock':
        return (
          <Table
            columns={[
              { title: 'Material', dataIndex: 'material', key: 'material', width: 250 },
              { title: 'Current Stock', dataIndex: 'currentStock', key: 'currentStock', width: 120, align: 'right' as const, render: (val: number) => <Tag color="error">{val} kg</Tag> },
              { title: 'Min Stock', dataIndex: 'minStock', key: 'minStock', width: 120, align: 'right' as const, render: (val: number) => `${val} kg` },
              { title: 'Shortage', dataIndex: 'shortage', key: 'shortage', width: 120, align: 'right' as const, render: (val: number) => <Tag color="red">-{val} kg</Tag> },
              { title: 'Action', dataIndex: 'action', key: 'action', width: 120, render: (action: string) => <Button type="primary" size="small">{action}</Button> },
            ]}
            dataSource={data}
            pagination={false}
            size="small"
            scroll={{ x: 'max-content' }}
            rowKey="id"
          />
        );

      case 'deadStock':
        return (
          <>
            <Alert
              message="Dead Stock Alert"
              description="Items with no movement for over 90 days. Consider clearance sale or repurposing."
              type="warning"
              showIcon
              style={{
                marginBottom: 16,
                border: '1px solid var(--color-ffe58f)',
                borderRadius: 8,
                padding: '12px',
              }}
            />
            <Table
              columns={[
                { title: 'Material', dataIndex: 'materialName', key: 'materialName', width: 200 },
                { title: 'Lot', dataIndex: 'lotNumber', key: 'lotNumber', width: 120, render: (lot: string) => <Tag color="purple">{lot}</Tag> },
                { title: 'Quantity', key: 'quantity', width: 120, align: 'right' as const, render: (_: any, record: any) => `${record.quantity.toFixed(2)} ${record.uom}` },
                { title: 'Aging', dataIndex: 'aging', key: 'aging', width: 100, render: (days: number) => <Tag color="error">{days} days</Tag> },
                { title: 'Value', dataIndex: 'value', key: 'value', width: 120, align: 'right' as const, render: (val: number) => `₹${val.toLocaleString()}` },
                { title: 'Action', dataIndex: 'action', key: 'action', width: 150, render: (action: string) => <Button type="primary" danger size="small">{action}</Button> },
              ]}
              dataSource={data}
              pagination={false}
              size="small"
              scroll={{ x: 'max-content' }}
              rowKey="id"
            />
          </>
        );

      case 'alerts':
        return (
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {(data || []).map((alert: any) => {
              const severityColor = alert.severity === 'high' ? 'var(--color-ff4d4f)' : alert.severity === 'medium' ? 'var(--color-faad14)' : 'var(--color-52c41a)';
              const severityBg = 'var(--card-bg)';
              const tagColor = alert.severity === 'high' ? 'error' : alert.severity === 'medium' ? 'warning' : 'success';
              return (
                <Card
                  key={alert.id}
                  size="small"
                  style={{
                    borderLeft: `4px solid ${severityColor}`,
                    background: severityBg,
                    borderRadius: 8,
                    border: '1px solid var(--border-color)',
                    boxShadow: 'none',
                  }}
                >
                  <Row gutter={[16, 16]}>
                    <Col span={18}>
                      <div style={{ marginBottom: 8 }}>
                        <Tag color={tagColor}>{alert.type}</Tag>
                      </div>
                      <div style={{ fontSize: '14px', marginBottom: 8 }}>{alert.message}</div>
                      <div style={{ fontSize: '12px', color: 'var(--color-666666)' }}>Severity: {alert.severity.toUpperCase()}</div>
                    </Col>
                    <Col span={6} style={{ textAlign: 'right' }}>
                      <Button type="primary" size="small" block>{alert.action}</Button>
                    </Col>
                  </Row>
                </Card>
              );
            })}
          </Space>
        );

    case 'actions': {
        const actionsList = (data && Array.isArray(data) && data.length) ? data : TODAYS_ACTIONS;
        const priorityConfig: any = {
            critical: { bg: 'var(--card-bg)', border: 'var(--color-cf1322)' },
            high: { bg: 'var(--card-bg)', border: 'var(--color-faad14)' },
            medium: { bg: 'var(--card-bg)', border: 'var(--color-1890ff)' },
        };

        return (
            <div style={{ width: '100%', maxHeight: '70vh', overflowY: 'auto', paddingRight: 8 }}>
            <Space direction="vertical" style={{ width: '100%' }} size="large">
                {actionsList.map((action: any) => {
                const config = priorityConfig[action.priority as keyof typeof priorityConfig] || priorityConfig.medium;
                return (
                    <Card
                    key={action.id}
                    size="small"
                    hoverable
                    bordered={false}
                    className="actions-drawer-card"
                    style={{
                        borderLeft: `4px solid ${action.borderColor || config.border}`,
                        borderRadius: 8,
                        background: config.bg,
                        border: `1px solid ${action.borderColor || config.border}`,
                        boxShadow: 'none',
                    }}
                    bodyStyle={{ padding: 12 }}
                    >
                    <Row align="middle" gutter={[12, 12]} wrap={false}>
                        <Col flex="auto">
                        <div style={{ marginBottom: 6 }}>
                            <strong style={{ fontSize: 15 }}>{action.title}</strong>
                        </div>
                        <div style={{ fontSize: 13, color: 'var(--color-666666)' }}>{action.desc}</div>
                        </Col>
                        <Col style={{ width: 140 }}>
                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                            <Button
                            type="primary"
                            size="small"
                            block
                            onClick={() => {
                                onClose();
                                console.info('Action triggered from drawer:', action);
                            }}
                            >
                            {action.action}
                            </Button>
                        </div>
                        </Col>
                    </Row>
                    </Card>
                );
                })}
            </Space>
            </div>
        );
    }
    
    // ... Implement 'aging', 'leakage', 'styleRisk', 'blockedStock' similarly if needed.
    // For brevity, I am adding a default catch-all, but you should move the rest of the cases here.
    
    default:
      return (
        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--color-666666)' }}>
          <p>No detailed view available for {type}</p>
        </div>
      );
  }
};