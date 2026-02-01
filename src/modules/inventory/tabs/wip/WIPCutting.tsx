/**
 * WIP - Cutting Process Tracking
 * Track cutting process work-in-progress with piece-wise details
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Space,
  Input,
  Button,
  Statistic,
  Row,
  Col,
  Progress,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  ScissorOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { WIPInventory } from '../../types';
import { SAMPLE_WIP } from '../../data/sampleData';
import wipStore from '../../store/wipStore';

const WIPCuttingScreen: React.FC = () => {
  const [data, setData] = useState<WIPInventory[]>(
    SAMPLE_WIP.filter(wip => (wip.processStage || wip.currentProcess) === 'cutting')
  );

  const columns = [
    {
      title: 'WIP Number',
      dataIndex: 'wipNumber',
      key: 'wipNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Lot Number',
      key: 'lotNumber',
      width: 160,
      render: (_: any, record: WIPInventory) => {
        // find matching lot
        const lots = wipStore.listWipLots();
        const found = lots.find(l => l.styleId === record.styleId && l.currentProcess === 'cutting');
        return found ? <Tag color="gold">{found.lotNumber}</Tag> : '-';
      },
    },
    {
      title: 'Style Number',
      dataIndex: 'styleNumber',
      key: 'styleNumber',
      width: 120,
      render: (style: string) => <Tag color="blue">{style}</Tag>,
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 120,
    },
    {
      title: 'Fabric Type',
      dataIndex: 'fabricType',
      key: 'fabricType',
      width: 180,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => qty?.toLocaleString(),
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 80,
    },
    {
      title: 'Started Date',
      dataIndex: 'startDate',
      key: 'startDate',
      width: 110,
      render: (date: Date | undefined) => date ? new Date(date).toLocaleDateString('en-GB') : '-',
    },
    {
      title: 'Days in WIP',
      key: 'daysInWIP',
      width: 100,
      align: 'center' as const,
      render: (_: any, record: WIPInventory) => {
        const start = (record.startDate as Date) || (record.entryDate as Date) || undefined;
        if (!start) return <Tag>-</Tag>;
        const days = Math.floor((new Date().getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24));
        const color = days > 3 ? 'error' : days > 2 ? 'warning' : 'success';
        return <Tag color={color}>{days} days</Tag>;
      },
    },
    {
      title: 'Supervisor',
      dataIndex: 'supervisor',
      key: 'supervisor',
      width: 150,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'in_progress' ? 'processing' : status === 'completed' ? 'success' : 'default'}>
          {status.replace('_', ' ').toUpperCase()}
        </Tag>
      ),
    },
  ];

  // Calculate WIP statistics
  const totalQty = data.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const inProgress = data.filter(item => item.status === 'in_progress').length;
  const avgDays = data.length > 0 
    ? Math.round(data.reduce((sum, item) => {
        const start = (item.startDate as Date) || (item.entryDate as Date) || undefined;
        const days = start ? Math.floor((new Date().getTime() - new Date(start).getTime()) / (1000 * 60 * 60 * 24)) : 0;
        return sum + days;
      }, 0) / data.length)
    : 0;

  return (
    <div className="wip-cutting-screen">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Lots in Cutting</div>
            <Statistic
              value={data.length}
              valueStyle={{ color: 'var(--color-13c2c2)', fontSize: '24px', fontWeight: 700 }}
              prefix={<ScissorOutlined style={{ color: 'var(--color-13c2c2)', marginRight: 8 }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Pieces</div>
            <Statistic
              value={totalQty}
              valueStyle={{ color: 'var(--color-1890ff)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>In Progress</div>
            <Statistic
              value={inProgress}
              valueStyle={{ color: 'var(--color-1890ff)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Avg Days in WIP</div>
            <Statistic
              value={avgDays}
              suffix="days"
              valueStyle={{ color: avgDays > 3 ? 'var(--color-cf1322)' : 'var(--color-3f8600)', fontSize: '24px', fontWeight: 700 }}
              prefix={<ClockCircleOutlined style={{ color: avgDays > 3 ? 'var(--color-cf1322)' : 'var(--color-3f8600)', marginRight: 8 }} />}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <ScissorOutlined style={{ fontSize: 20, color: 'var(--color-13c2c2)' }} />
              <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>WIP - Cutting Process</span>
            </Space>
            <Space>
              <Input
                placeholder="Search WIP..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
              />
              <Button icon={<ExportOutlined />}>Export</Button>
            </Space>
          </div>
        }
        style={{
          borderRadius: '12px',
          border: '2px solid var(--color-e8e8e8)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}
        headStyle={{
          borderBottom: '2px solid var(--color-f0f0f0)',
          background: 'linear-gradient(135deg, var(--page-bg) 0%, var(--table-header-bg) 100%)',
          borderRadius: '12px 12px 0 0',
          padding: '16px 24px',
        }}
        bodyStyle={{ padding: '24px', background: 'var(--color-ffffff)' }}
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} lots`,
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default WIPCuttingScreen;
