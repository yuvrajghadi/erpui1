/**
 * Raw Material Stock View
 * View all raw material inventory with lot tracking, aging, and rack location
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  Tooltip,
  Statistic,
  Row,
  Col,
  Badge,
  message,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  InboxOutlined,
  WarningOutlined,
  FilterOutlined,
  BarcodeOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import type { RawMaterialStock } from '../../types';
import { getAgingCategory, calculateAgingDays } from '../../utils';
import { SAMPLE_RAW_STOCK } from '../../data/sampleData';

const RawMaterialStockScreen: React.FC = () => {
  const [data, setData] = useState<RawMaterialStock[]>(SAMPLE_RAW_STOCK);
  const [loading, setLoading] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterAging, setFilterAging] = useState<string>('all');

  const columns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'materialType',
      key: 'materialType',
      width: 100,
      filters: [
        { text: 'Fabric', value: 'fabric' },
        { text: 'Trim', value: 'trim' },
      ],
      onFilter: (value: any, record: RawMaterialStock) => (record.itemType || '') === value,
      render: (type: any, record: RawMaterialStock) => {
        const t = (typeof type === 'string' && type) ? type : (record.itemType || 'unknown');
        const color = t === 'fabric' ? 'blue' : 'green';
        return (
          <Tag color={color}>
            {String(t).toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string) => <Tag color="purple">{lot}</Tag>,
    },
    {
      title: 'Shade',
      dataIndex: 'shadeNumber',
      key: 'shadeNumber',
      width: 80,
      render: (shade: string) => shade ? <Tag>{shade}</Tag> : '-',
    },
    {
      title: 'Roll/Carton Count',
      dataIndex: 'rollCount',
      key: 'rollCount',
      width: 120,
      align: 'center' as const,
      render: (count: number) => <Badge count={count} showZero color="blue" />,
    },
    {
      title: 'Available Qty',
      key: 'availableQty',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: RawMaterialStock) => (
        <div>
          <div><strong>{record.availableQuantity?.toFixed(2)}</strong></div>
          <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>{record.uom}</div>
        </div>
      ),
    },
    {
      title: 'Reserved Qty',
      dataIndex: 'reservedQuantity',
      key: 'reservedQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number, record: RawMaterialStock) => 
        qty > 0 ? <Tag color="orange">{qty?.toFixed(2)} {record.uom}</Tag> : '-',
    },
    {
      title: 'Total Qty',
      key: 'totalQty',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: RawMaterialStock) => {
        const total = (record.availableQuantity || 0) + (record.reservedQuantity || 0);
        return `${total.toFixed(2)} ${record.uom}`;
      },
    },
    {
      title: 'Unit Rate',
      dataIndex: 'unitRate',
      key: 'unitRate',
      width: 100,
      align: 'right' as const,
      render: (rate: number) => `₹${rate?.toFixed(2)}`,
    },
    {
      title: 'Stock Value',
      key: 'stockValue',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: RawMaterialStock) => {
        const total = (record.availableQuantity || 0) + (record.reservedQuantity || 0);
        const value = total * (record.unitRate || 0);
        return `₹${value.toLocaleString()}`;
      },
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: 'Rack/Bin',
      key: 'location',
      width: 100,
      render: (_: any, record: RawMaterialStock) => 
        record.rackCode && record.binCode ? `${record.rackCode}-${record.binCode}` : '-',
    },
    {
      title: 'Received Date',
      dataIndex: 'receivedDate',
      key: 'receivedDate',
      width: 110,
      render: (date: Date) => new Date(date).toLocaleDateString('en-GB'),
    },
    {
      title: 'Aging',
      key: 'aging',
      width: 100,
      sorter: (a: RawMaterialStock, b: RawMaterialStock) => 
        calculateAgingDays(a.receivedDate) - calculateAgingDays(b.receivedDate),
      render: (_: any, record: RawMaterialStock) => {
        const days = calculateAgingDays(record.receivedDate);
        const category = getAgingCategory(days);
        const colorMap: Record<string, string> = {
          '0-30': 'success',
          '30-60': 'warning',
          '60-90': 'orange',
          '90+': 'error',
        };
        return (
          <Tooltip title={`${days} days old`}>
            <Tag color={colorMap[category]} icon={days > 90 ? <WarningOutlined /> : undefined}>
              {days} days
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Lot Status',
      key: 'lotStatus',
      width: 110,
      render: () => {
        // Mock lot status - can be Active, Blocked, Quarantine, Expired, Closed
        const statusOptions = ['Active', 'Blocked', 'Quarantine', 'Expired', 'Closed'];
        const status = statusOptions[Math.floor(Math.random() * 2)]; // Mock: mostly Active
        const colorMap: Record<string, string> = {
          Active: 'success',
          Blocked: 'error',
          Quarantine: 'warning',
          Expired: 'default',
          Closed: 'default',
        };
        return <Tag color={colorMap[status]}>{status}</Tag>;
      },
    },
    {
      title: 'Reorder Alert',
      key: 'reorderAlert',
      width: 120,
      render: (_: any, record: RawMaterialStock) => {
        // Mock reorder logic: if available < 100, show alert
        const reorderLevel = 100;
        const minStock = 50;
        const available = record.availableQuantity || 0;
        if (available <= minStock) {
          return <Tag color="error" icon={<WarningOutlined />}>Critical</Tag>;
        }
        if (available <= reorderLevel) {
          return <Tag color="warning" icon={<WarningOutlined />}>Below Reorder</Tag>;
        }
        return <Tag color="success"><CheckCircleOutlined /> OK</Tag>;
      },
    },
    {
      title: 'UOM Display',
      key: 'uomDisplay',
      width: 140,
      render: (_: any, record: RawMaterialStock) => {
        // Mock UOM conversion: show base + alternate
        const baseQty = record.availableQuantity || 0;
        const baseUom = record.uom || 'kg';
        // Mock conversion: if fabric, show meter equivalent
        if (record.itemType === 'fabric' && baseUom === 'kg') {
          const meterQty = (baseQty * 4.5).toFixed(2); // Mock: 1kg = 4.5m
          return (
            <div>
              <div><strong>{baseQty.toFixed(2)} kg</strong></div>
              <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>≈ {meterQty} m</div>
            </div>
          );
        }
        return `${baseQty.toFixed(2)} ${baseUom}`;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      filters: [
        { text: 'In Stock', value: 'in_stock' },
        { text: 'Low Stock', value: 'low_stock' },
        { text: 'Out of Stock', value: 'out_of_stock' },
      ],
      onFilter: (value: any, record: RawMaterialStock) => record.status === value,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          in_stock: 'success',
          low_stock: 'warning',
          out_of_stock: 'error',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.replace('_', ' ').toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: RawMaterialStock) => (
        <Space size="small">
          <Tooltip title="View Ledger">
            <Button
              type="link"
              size="small"
              icon={<BarcodeOutlined />}
              onClick={() => {
                message.info(`View ledger for ${record.materialCode} - ${record.lotNumber}`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Calculate summary statistics
  const totalValue = data.reduce((sum, item) => {
    const total = (item.availableQuantity || 0) + (item.reservedQuantity || 0);
    return sum + (total * (item.unitRate || 0));
  }, 0);

  const totalItems = data.length;
  const lowStockItems = data.filter(item => item.status === 'low_stock').length;
  const agingItems = data.filter(item => calculateAgingDays(item.receivedDate) > 60).length;

  return (
    <div className="raw-material-stock-screen">
      <Row gutter={[8, 8]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              borderRadius: '12px',
              border: '2px solid var(--color-e8e8e8)',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            }}
            bodyStyle={{ padding: '20px', background: 'var(--color-ffffff)' }}
          >
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Stock Value</div>
            <Statistic
              value={totalValue}
              precision={2}
              prefix="₹"
              valueStyle={{ color: 'var(--color-3f8600)', fontSize: '24px', fontWeight: 700 }}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Total Items</div>
            <Statistic
              value={totalItems}
              prefix={<InboxOutlined style={{ color: 'var(--color-1890ff)', marginRight: 8 }} />}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Low Stock Alerts</div>
            <Statistic
              value={lowStockItems}
              valueStyle={{ color: lowStockItems > 0 ? 'var(--color-cf1322)' : 'var(--color-3f8600)', fontSize: '24px', fontWeight: 700 }}
              prefix={<WarningOutlined style={{ color: lowStockItems > 0 ? 'var(--color-cf1322)' : 'var(--color-52c41a)', marginRight: 8 }} />}
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
            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-595959)', marginBottom: '8px' }}>Aging Stock (&gt;60 days)</div>
            <Statistic
              value={agingItems}
              valueStyle={{ color: agingItems > 0 ? 'var(--color-faad14)' : 'var(--color-3f8600)', fontSize: '24px', fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <Space style={{ minWidth: 0 }}>
              <InboxOutlined style={{ fontSize: 18 }} />
              <span style={{ fontSize: '15px', fontWeight: 700 }}>Raw Material Stock</span>
            </Space>
            <Space style={{ flexWrap: 'wrap', justifyContent: 'flex-end' }} size="small">
              <Select
                placeholder="Filter by Type"
                style={{ width: 140, minWidth: 100 }}
                size="small"
                options={[
                  { value: 'all', label: 'All Types' },
                  { value: 'fabric', label: 'Fabric' },
                  { value: 'trim', label: 'Trims' },
                ]}
                value={filterType}
                onChange={setFilterType}
              />
              <Select
                placeholder="Filter by Aging"
                style={{ width: 140, minWidth: 100 }}
                size="small"
                options={[
                  { value: 'all', label: 'All Aging' },
                  { value: '0-30', label: '0-30 Days' },
                  { value: '30-60', label: '30-60 Days' },
                  { value: '60-90', label: '60-90 Days' },
                  { value: '90+', label: '90+ Days' },
                ]}
                value={filterAging}
                onChange={setFilterAging}
              />
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined />}
                style={{ width: 180, minWidth: 120 }}
                size="small"
                allowClear
              />
              <Button icon={<ExportOutlined />} size="small">
                Export
              </Button>
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
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
            pageSizeOptions: ['10', '15', '20', '50'],
          }}
          size="small"
        />
      </Card>
    </div>
  );
};

export default RawMaterialStockScreen;
