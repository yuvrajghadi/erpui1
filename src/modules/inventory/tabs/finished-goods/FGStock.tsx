/**
 * Finished Goods Stock
 * View finished goods inventory with carton-wise tracking
 */

'use client';

import React, { useState } from 'react';
import fgStore from '../../store/fgStore';
import { Drawer as AntDrawer } from 'antd';
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
  Badge,
  Tooltip,
  message,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import type { FinishedGoodsStock } from '../../types';
import { SAMPLE_FG_STOCK } from '../../data/sampleData';

const FinishedGoodsStockScreen: React.FC = () => {
  const [data, setData] = useState<FinishedGoodsStock[]>(SAMPLE_FG_STOCK);

  const columns = [
    {
      title: 'Style Number',
      dataIndex: 'styleId',
      key: 'styleId',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 130,
      render: (order: string) => <Tag color="blue">{order}</Tag>,
    },
    {
      title: 'Buyer',
      dataIndex: 'buyerName',
      key: 'buyerName',
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: 200,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (color: string) => <Tag color="purple">{color}</Tag>,
    },
    {
      title: 'Cartons',
      dataIndex: 'cartonCount',
      key: 'cartonCount',
      width: 90,
      align: 'center' as const,
      render: (count: number) => <Badge count={count} showZero color="blue" />,
    },
    {
      title: 'Total Pieces',
      dataIndex: 'totalPieces',
      key: 'totalPieces',
      width: 110,
      align: 'right' as const,
      render: (pieces: number) => pieces?.toLocaleString(),
    },
    {
      title: 'Size Breakdown',
      key: 'sizeBreakdown',
      width: 200,
      render: (_: any, record: FinishedGoodsStock) => {
        const breakdown = record.sizeBreakdown || {};
        return (
          <Space size={4} wrap>
            {Object.entries(breakdown).map(([size, qty]) => (
              <Tag key={size} color="cyan">
                {size}: {String(qty)}
              </Tag>
            ))}
          </Space>
        );
      },
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: 'Packing Date',
      dataIndex: 'packingDate',
      key: 'packingDate',
      width: 110,
      render: (date: Date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Dispatch Status',
      dataIndex: 'dispatchStatus',
      key: 'dispatchStatus',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          ready: 'success',
          pending: 'warning',
          partial: 'processing',
          dispatched: 'default',
        };
        const iconMap: Record<string, any> = {
          ready: <CheckCircleOutlined />,
          pending: <ClockCircleOutlined />,
        };
        return (
          <Tag color={colorMap[String(status)]} icon={iconMap[String(status)]}>
            {String(status || '').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 180,
      render: (status: any, record: FinishedGoodsStock) => {
        const s = String(status || 'unknown');
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Tag color={s === 'in_stock' ? 'success' : 'default'}>{s.replace(/_/g, ' ').toUpperCase()}</Tag>
            <Button size="small" onClick={() => openLedger(record.styleId)}>Ledger</Button>
            <Button size="small" danger={fgStore.isStyleBlocked(record.styleId)} onClick={() => toggleHold(record.styleId)}>
              {fgStore.isStyleBlocked(record.styleId) ? 'Unhold' : 'Hold'}
            </Button>
          </div>
        );
      },
    },
  ];

  // Calculate FG statistics
  const totalCartons = data.reduce((sum, item) => sum + (item.cartonCount || 0), 0);
  const totalPieces = data.reduce((sum, item) => sum + (item.totalPieces || 0), 0);
  const readyToDispatch = data.filter(item => item.dispatchStatus === 'ready').length;
  const totalValue = data.reduce((sum, item) => sum + (item.totalPieces || 0) * 500, 0); // Assuming avg price
  const [ledgerVisible, setLedgerVisible] = useState(false);
  const [ledgerRows, setLedgerRows] = useState<any[]>([]);
  const aging = fgStore.computeAging();
  const valuation = fgStore.valuation('cost');

  const openLedger = (style: string) => {
    const rows = fgStore.listLedger({ style });
    setLedgerRows(rows);
    setLedgerVisible(true);
  };

  const toggleHold = (style: string) => {
    if (fgStore.isStyleBlocked(style)) {
      fgStore.unblockStyle(style, { name: 'System' });
    } else {
      fgStore.blockStyle(style, 'Quality hold', { name: 'System' });
    }
    setData([...fgStore.listStock()]);
  };

  return (
    <div className="finished-goods-stock-screen">
      <Row gutter={16} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered bodyStyle={{ padding: 12 }} style={{ border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Aging 0-30 days</div>
            <Statistic value={aging['0-30']} valueStyle={{ color: 'var(--color-3f8600)' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered bodyStyle={{ padding: 12 }} style={{ border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Aging 31-60 days</div>
            <Statistic value={aging['31-60']} valueStyle={{ color: 'var(--color-fa8c16)' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered bodyStyle={{ padding: 12 }} style={{ border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Aging 61-90 days</div>
            <Statistic value={aging['61-90']} valueStyle={{ color: 'var(--color-cf1322)' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card size="small" bordered bodyStyle={{ padding: 12 }} style={{ border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Aging 90+ days</div>
            <Statistic value={aging['90+']} valueStyle={{ color: 'var(--color-a8071a)' }} />
          </Card>
        </Col>
        <Col xs={24} style={{ marginTop: 12 }}>
          <Row gutter={12}>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small" bordered bodyStyle={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Total Cartons</div>
                <Statistic value={totalCartons} valueStyle={{ color: 'var(--color-52c41a)' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small" bordered bodyStyle={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Total Pieces</div>
                <Statistic value={totalPieces} valueStyle={{ color: 'var(--color-1890ff)' }} />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card size="small" bordered bodyStyle={{ padding: 12 }}>
                <div style={{ fontSize: 12, color: 'var(--color-595959)' }}>Valuation (₹)</div>
                <Statistic value={valuation.total} precision={0} valueStyle={{ color: 'var(--color-faad14)' }} />
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <InboxOutlined style={{ fontSize: 20, color: 'var(--color-52c41a)' }} />
              <span style={{ fontSize: '17px', fontWeight: 700, letterSpacing: '-0.02em' }}>Finished Goods Stock</span>
            </Space>
            <Space>
              <Input
                placeholder="Search FG stock..."
                prefix={<SearchOutlined />}
                style={{ width: 250 }}
                allowClear
              />
              <Button icon={<ExportOutlined />}>Export</Button>
              <Button type="primary" onClick={() => {
                const d = fgStore.createDispatch({ allocations: [], note: 'Quick dispatch' }, { name: 'Planner' });
                message.info(`Dispatch ${d.id} created`);
              }}>Create Dispatch</Button>
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
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} styles`,
          }}
          size="small"
        />
        
        <AntDrawer title="FG Ledger" width={720} open={ledgerVisible} onClose={() => setLedgerVisible(false)}>
          <Table dataSource={ledgerRows} pagination={false} size="small" rowKey={(r: any) => r.id} columns={[{ title: 'Date', dataIndex: 'createdAt', key: 'createdAt', render: (d: any) => new Date(d).toLocaleString() }, { title: 'Ref Type', dataIndex: 'refType', key: 'refType' }, { title: 'Ref No', dataIndex: 'refNo', key: 'refNo' }, { title: 'In Pcs', dataIndex: 'inPieces', key: 'inPieces', align: 'right' }, { title: 'Out Pcs', dataIndex: 'outPieces', key: 'outPieces', align: 'right' }, { title: 'Balance', dataIndex: 'balancePieces', key: 'balancePieces', align: 'right' }]} />
        </AntDrawer>
      </Card>
    </div>
  );
};

export default FinishedGoodsStockScreen;
