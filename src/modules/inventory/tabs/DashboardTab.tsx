import React, { useState } from 'react';
import { Row, Col, Card, Typography, Tabs, Button, Space, Tag, Select, Radio, Badge, Tooltip, Divider, Avatar, Progress, Empty } from 'antd';
import {
  DashboardOutlined,
  RiseOutlined,
  FallOutlined,
  ShoppingOutlined,
  InboxOutlined,
  SyncOutlined,
  BarChartOutlined,
  AppstoreAddOutlined,
  FileAddOutlined,
  TagOutlined,
  SettingOutlined,
  AlertOutlined,
  ReloadOutlined,
  PlusOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  FileSearchOutlined,
  CalendarOutlined,
  BellOutlined,
  ClockCircleOutlined,
  InfoCircleOutlined,
  QuestionCircleOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  NotificationOutlined,
} from '@ant-design/icons';

import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import { DataTable, StatusTag, PriceCell, QuantityCell, DateCell } from '../components/DataTable';
import InventoryChart from '../components/charts/InventoryChart';
import SupplierChart from '../components/charts/SupplierChart';
import StockAgingDistributionChart from '../components/charts/StockAgingDistributionChart';
import MovementChart from '../components/charts/MovementChart';
import CategoryDistributionChart from '../components/charts/CategoryDistributionChart';
import ValueTrendChart from '../components/charts/ValueTrendChart';

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;
const { Option } = Select;

// Sample data for recent transactions
const recentTransactions = [
  {
    id: '1',
    date: '2023-06-15',
    type: 'Inward',
    itemName: 'Premium Cotton',
    quantity: 1500,
    unit: 'yards',
    supplier: 'Acme Supplies',
    status: 'Completed',
  },
  {
    id: '2',
    date: '2023-06-14',
    type: 'Outward',
    itemName: 'Denim',
    quantity: 800,
    unit: 'yards',
    department: 'Production',
    status: 'Completed',
  },
  {
    id: '3',
    date: '2023-06-13',
    type: 'Inward',
    itemName: 'Polyester Blend',
    quantity: 1200,
    unit: 'yards',
    supplier: 'Global Materials',
    status: 'Pending',
  },
  {
    id: '4',
    date: '2023-06-12',
    type: 'Outward',
    itemName: 'Silk',
    quantity: 300,
    unit: 'yards',
    department: 'Design',
    status: 'Completed',
  },
  {
    id: '5',
    date: '2023-06-10',
    type: 'Inward',
    itemName: 'Linen',
    quantity: 900,
    unit: 'yards',
    supplier: 'Quality Distributors',
    status: 'Completed',
  },
];

// Sample data for low stock items
const lowStockItems = [
  {
    id: '1',
    name: 'Premium Cotton',
    sku: 'COT-PREM-001',
    category: 'Raw Materials',
    currentStock: 150,
    unit: 'yards',
    reorderPoint: 200,
    status: 'Low-Stock',
  },
  {
    id: '2',
    name: 'Denim',
    sku: 'DEN-BLUE-002',
    category: 'Raw Materials',
    currentStock: 80,
    unit: 'yards',
    reorderPoint: 100,
    status: 'Low-Stock',
  },
  {
    id: '3',
    name: 'Silk',
    sku: 'SLK-PREM-003',
    category: 'Premium Materials',
    currentStock: 30,
    unit: 'yards',
    reorderPoint: 50,
    status: 'Out-of-Stock',
  },
  {
    id: '4',
    name: 'Buttons',
    sku: 'ACC-BTN-001',
    category: 'Accessories',
    currentStock: 500,
    unit: 'pcs',
    reorderPoint: 1000,
    status: 'Low-Stock',
  },
  {
    id: '5',
    name: 'Zippers',
    sku: 'ACC-ZIP-002',
    category: 'Accessories',
    currentStock: 200,
    unit: 'pcs',
    reorderPoint: 300,
    status: 'Low-Stock',
  },
];

interface DashboardTabProps {
  showDrawer?: (type: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ showDrawer }) => {
  // Transaction table columns
  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (date: string) => <DateCell value={date} />,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Inward' ? 'green' : 'red'} style={{ borderRadius: '4px' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (quantity: number, record: any) => (
        <QuantityCell value={quantity} unit={record.unit} />
      ),
    },
    {
      title: 'Source/Destination',
      key: 'source',
      render: (text: string, record: any) => (
        record.supplier || record.department
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
  ];

  // Low stock items table columns
  const lowStockColumns = [
    {
      title: 'Item',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Current Stock',
      key: 'currentStock',
      render: (text: string, record: any) => (
        <QuantityCell value={record.currentStock} unit={record.unit} />
      ),
    },
    {
      title: 'Reorder Point',
      key: 'reorderPoint',
      render: (text: string, record: any) => (
        <QuantityCell value={record.reorderPoint} unit={record.unit} />
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => <StatusTag status={status} />,
    },
  ];

  return (
    <div className="inventory-dashboard-tab">
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row pb-3">
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Inventory Value"
            value={1250000}
            isCurrency={true}
            icon={<DashboardOutlined />}
            color="var(--color-1890ff)"
            trend={5.8}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Items in Stock"
            value={1842}
            icon={<InboxOutlined />}
            color="var(--color-52c41a)"
            trend={2.3}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Inward This Month"
            value={12500}
            isQuantity={true}
            unit="units"
            icon={<RiseOutlined />}
            color="var(--color-722ed1)"
            trend={-3.2}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Outward This Month"
            value={9800}
            isQuantity={true}
            unit="units"
            icon={<FallOutlined />}
            color="var(--color-fa8c16)"
            trend={7.5}
            trendLabel="vs last month"
          />
        </Col>
      </Row>

      {/* Primary Charts Row */}
      <Row gutter={[16, 16]} className="primary-charts-row">
        <Col xs={24} lg={12}>
          <Card 
            className="dashboard-card summary-card" 
            variant="outlined"
            style={{ 
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={5} style={{ margin: 0 }}>Inventory Summary</Title>
              <Space>
                <Select defaultValue="all" style={{ width: 130 }} size="small">
                  <Option value="all">All Categories</Option>
                  <Option value="raw">Raw Materials</Option>
                  <Option value="finished">Finished Goods</Option>
                  <Option value="packaging">Packaging</Option>
                </Select>
                <Tooltip title="Refresh Data">
                  <Button type="text" icon={<ReloadOutlined />} size="small" />
                </Tooltip>
              </Space>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <InventoryChart />
              </Col>
            </Row>
            
            <Divider style={{ margin: '16px 0' }} />
            
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Paragraph type="secondary" style={{ marginBottom: '4px' }}>Total Items</Paragraph>
                  <Title level={3} style={{ margin: '0 0 4px' }}>1,842</Title>
                  <Badge status="processing" text="52 items added this month" style={{ fontSize: '12px' }} />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Paragraph type="secondary" style={{ marginBottom: '4px' }}>Avg. Turnover Rate</Paragraph>
                  <Title level={3} style={{ margin: '0 0 4px' }}>18.3%</Title>
                  <Badge status="success" text="↑ 2.1% increase" style={{ fontSize: '12px' }} />
                </div>
              </Col>
              <Col xs={24} sm={8}>
                <div style={{ textAlign: 'center' }}>
                  <Paragraph type="secondary" style={{ marginBottom: '4px' }}>Stocked Value</Paragraph>
                  <Title level={3} style={{ margin: '0 0 4px' }}>₹1.25M</Title>
                  <Badge status="success" text="↑ ₹72K increase" style={{ fontSize: '12px' }} />
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <ValueTrendChart />
        </Col>
      </Row>

      {/* Quick Actions Row */}
      <Row gutter={[16, 16]} className="quick-actions-row" style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card className="section-header-card" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>Quick Actions</Title>
              <Button type="primary" icon={<PlusOutlined />}>New Action</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ActionCard
            title="Add New Item"
            description="Create a new inventory item with details"
            icon={<AppstoreAddOutlined />}
            color="var(--color-1890ff)"
            onClick={() => showDrawer && showDrawer('item')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ActionCard
            title="Record Inward"
            description="Register new inventory received"
            icon={<FileAddOutlined />}
            color="var(--color-52c41a)"
            onClick={() => showDrawer && showDrawer('inward')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ActionCard
            title="Record Outward"
            description="Register inventory issued out"
            icon={<ShoppingOutlined />}
            color="var(--color-fa8c16)"
            onClick={() => showDrawer && showDrawer('outward')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <ActionCard
            title="Generate Report"
            description="Create detailed inventory reports"
            icon={<FileSearchOutlined />}
            color="var(--color-722ed1)"
            onClick={() => showDrawer && showDrawer('report')}
          />
        </Col>
      </Row>

      {/* Secondary Charts Row */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24} md={8}>
          <CategoryDistributionChart />
        </Col>
        <Col xs={24} md={8}>
          <StockAgingDistributionChart />
        </Col>
        <Col xs={24} md={8}>
          <SupplierChart />
        </Col>
      </Row>

      {/* Inventory Movement Trends */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card className="section-header-card" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>Inventory Movement Trends</Title>
              <Space>
                <Select defaultValue="6months" style={{ width: 120 }}>
                  <Option value="3months">Last 3 Months</Option>
                  <Option value="6months">Last 6 Months</Option>
                  <Option value="12months">Last 12 Months</Option>
                </Select>
                <Button type="default" icon={<BarChartOutlined />}>
                  Advanced View
                </Button>
              </Space>
            </div>
          </Card>
        </Col>
        <Col xs={24}>
          <MovementChart />
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]} className="tables-row" style={{ marginTop: '16px' }}>
        <Col xs={24}>
          <Card className="section-header-card" style={{ marginBottom: '0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Title level={4} style={{ margin: 0 }}>Inventory Activity</Title>
              <Button type="link">View All Activities</Button>
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <DataTable
            title="Recent Transactions"
            columns={transactionColumns}
            dataSource={recentTransactions}
            rowKey="id"
            onView={(record) => console.log('View transaction', record)}
            onHistory={(record) => console.log('View history', record)}
          />
        </Col>
        <Col xs={24} lg={12}>
          <DataTable
            title="Low Stock Items"
            columns={lowStockColumns}
            dataSource={lowStockItems}
            rowKey="id"
            onView={(record) => console.log('View item', record)}
            onEdit={(record) => console.log('Edit item', record)}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTab;