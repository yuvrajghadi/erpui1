import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Space, Divider, Tag, Select, Radio, Badge, Tooltip, Avatar, Progress, Empty, Drawer } from 'antd';
import {
  AppstoreOutlined,
  BarChartOutlined,
  InboxOutlined,
  ShoppingOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  FileSearchOutlined,
  TagsOutlined,
  SettingOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  DatabaseOutlined,
  FilterOutlined,
  PlusOutlined,
  ReloadOutlined,
  DownloadOutlined,
  HistoryOutlined,
  ThunderboltOutlined,
  UnorderedListOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';

import { StatusCard } from '../components/StatusCard';
import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import { DataTable, StatusTag, QuantityCell, DateCell } from '../components/DataTable';
import InventoryChart from '../components/charts/InventoryChart';
import SupplierChart from '../components/charts/SupplierChart';
import MovementChart from '../components/charts/MovementChart';
import MaterialTurnoverChart from '../components/charts/MaterialTurnoverChart';
import MaterialQualityChart from '../components/charts/MaterialQualityChart';

const { Title, Text, Paragraph } = Typography;
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
];

const MaterialsDashboardTab: React.FC = () => {
  // State for drawer visibility
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [drawerType, setDrawerType] = useState('');
  const [timeRange, setTimeRange] = useState('month');
  
  // Function to show drawer
  const handleShowDrawer = (type: string) => {
    setDrawerType(type);
    setDrawerVisible(true);
  };

  // Function to close drawer
  const closeDrawer = () => {
    setDrawerVisible(false);
  };

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
    <div className="materials-dashboard-tab">
      {/* Status Cards Row */}
      <Row gutter={[16, 16]} className="status-cards-row">
        <Col xs={24} sm={12} md={6}>
          <StatusCard
            title="Cotton Materials"
            currentStock={3500}
            totalCapacity={5000}
            unit="yards"
            color="var(--color-1890ff)"
            icon={<AppstoreOutlined />}
            status="normal"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatusCard
            title="Polyester Materials"
            currentStock={800}
            totalCapacity={2000}
            unit="yards"
            color="var(--color-52c41a)"
            icon={<AppstoreOutlined />}
            status="low"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatusCard
            title="Denim Materials"
            currentStock={1200}
            totalCapacity={1500}
            unit="yards"
            color="var(--color-722ed1)"
            icon={<AppstoreOutlined />}
            status="normal"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatusCard
            title="Silk Materials"
            currentStock={50}
            totalCapacity={500}
            unit="yards"
            color="var(--color-fa8c16)"
            icon={<AppstoreOutlined />}
            status="critical"
          />
        </Col>
      </Row>

      {/* Main Content */}
      <Row gutter={[16, 16]} style={{ marginTop: '16px' }}>
        {/* Left Column - Charts and Tables */}
        <Col xs={24} lg={16}>
          {/* Material Summary */}
          <Card 
            className="dashboard-card summary-card" 
            variant="outlined"
            style={{ 
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <Title level={5} style={{ margin: 0 }}>Materials Overview</Title>
              <Space>
                <Select defaultValue="all" style={{ width: 130 }} size="small">
                  <Option value="all">All Materials</Option>
                  <Option value="cotton">Cotton</Option>
                  <Option value="polyester">Polyester</Option>
                  <Option value="denim">Denim</Option>
                </Select>
                <Radio.Group 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)} 
                  size="small"
                  buttonStyle="solid"
                >
                  <Radio.Button value="month">Month</Radio.Button>
                  <Radio.Button value="quarter">Quarter</Radio.Button>
                  <Radio.Button value="year">Year</Radio.Button>
                </Radio.Group>
              </Space>
            </div>
            
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <MaterialTurnoverChart />
              </Col>
            </Row>
          </Card>
          
          {/* Inventory Movement Trends */}
          <Card 
            className="dashboard-card movement-card" 
            variant="outlined"
            style={{ 
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Title level={5} style={{ margin: 0 }}>Inventory Movement Trends</Title>
                <Tooltip title="Refresh data">
                  <Button type="text" icon={<ReloadOutlined />} size="small" />
                </Tooltip>
              </div>
            }
          >
            <MovementChart />
          </Card>
          
          {/* Recent Transactions */}
          <DataTable
            title="Recent Material Transactions"
            columns={transactionColumns}
            dataSource={recentTransactions}
            rowKey="id"
            onView={(record) => console.log('View transaction', record)}
            onHistory={(record) => console.log('View history', record)}
          />
        </Col>
        
        {/* Right Column - Quick Actions and Additional Info */}
        <Col xs={24} lg={8}>
          {/* Quick Actions Card */}
          <Card 
            className="dashboard-card quick-actions-card" 
            variant="outlined"
            style={{ 
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
            title={<Title level={5} style={{ margin: 0 }}>Quick Actions</Title>}
          >
            <Space direction="vertical" style={{ width: '100%' }} size="middle">
              <Button 
                type="primary" 
                icon={<PlusOutlined />} 
                block
                onClick={() => handleShowDrawer('material-add')}
              >
                Add New Material
              </Button>
              <Button 
                icon={<ShoppingOutlined />} 
                block
                onClick={() => handleShowDrawer('material-inward')}
              >
                Record Material Inward
              </Button>
              <Button 
                icon={<InboxOutlined />} 
                block
                onClick={() => handleShowDrawer('material-outward')}
              >
                Record Material Outward
              </Button>
              <Button 
                icon={<FileSearchOutlined />} 
                block
                onClick={() => handleShowDrawer('material-report')}
              >
                Generate Material Report
              </Button>
              <Button 
                icon={<BarChartOutlined />} 
                block
                onClick={() => handleShowDrawer('material-analysis')}
              >
                Material Analysis
              </Button>
            </Space>
          </Card>
          
          {/* Material Quality Assessment */}
          <Card 
            className="dashboard-card quality-card" 
            variant="outlined"
            style={{ 
              marginBottom: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <MaterialQualityChart />
          </Card>
          
          {/* Low Stock Alert */}
          <Card 
            className="dashboard-card low-stock-card" 
            variant="outlined"
            style={{ 
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
            title={
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Badge count={lowStockItems.length} overflowCount={99} offset={[10, 0]}>
                  <Title level={5} style={{ margin: 0 }}>Low Stock Alert</Title>
                </Badge>
                <Button type="link" size="small">View All</Button>
              </div>
            }
          >
            {lowStockItems.slice(0, 3).map((item) => (
              <div 
                key={item.id} 
                style={{ 
                  marginBottom: '12px', 
                  padding: '8px', 
                  background: item.status === 'Out-of-Stock' ? 'var(--color-fff2f0)' : 'var(--color-fffbe6)',
                  borderRadius: '4px',
                  borderLeft: `3px solid ${item.status === 'Out-of-Stock' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)'}`
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Text strong>{item.name}</Text>
                  <StatusTag status={item.status} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                  <Text type="secondary">{item.sku}</Text>
                  <Text>{item.currentStock} / {item.reorderPoint} {item.unit}</Text>
                </div>
                <Progress 
                  percent={Math.round((item.currentStock / item.reorderPoint) * 100)} 
                  size="small" 
                  status={item.status === 'Out-of-Stock' ? 'exception' : 'normal'}
                  strokeColor={item.status === 'Out-of-Stock' ? 'var(--color-ff4d4f)' : 'var(--color-faad14)'}
                  style={{ marginTop: '4px' }}
                />
              </div>
            ))}
            <div style={{ textAlign: 'center', marginTop: '8px' }}>
              <Button 
                type="primary" 
                ghost 
                icon={<ShoppingOutlined />}
                onClick={() => handleShowDrawer('reorder-materials')}
              >
                Reorder Materials
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
      
      {/* Material Quick Actions Drawer */}
      <Drawer
        className="inventory-drawer"
        title={`${drawerType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`}
        width={720}
        onClose={closeDrawer}
        open={drawerVisible}
        bodyStyle={{ paddingBottom: 80 }}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Button onClick={closeDrawer} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={closeDrawer} type="primary">
              Submit
            </Button>
          </div>
        }
      >
        <div style={{ padding: '20px 0' }}>
          <Title level={4}>Get Started with {drawerType.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}</Title>
          <Paragraph>
            Complete the form below to {drawerType.includes('add') ? 'add a new material' : 
              drawerType.includes('inward') ? 'record material inward' : 
              drawerType.includes('outward') ? 'record material outward' :
              drawerType.includes('report') ? 'generate a material report' :
              drawerType.includes('reorder') ? 'reorder low stock materials' : 
              'analyze material usage'}.
          </Paragraph>
          
          <Divider />
          
          <div style={{ padding: '20px', background: 'var(--color-f5f5f5)', borderRadius: '4px', textAlign: 'center' }}>
            <Title level={5}>This is a placeholder for the {drawerType} form</Title>
            <Paragraph>The actual form would be implemented here based on the specific action selected.</Paragraph>
            <Space>
              <Button type="default">Reset Form</Button>
              <Button type="primary">Submit</Button>
            </Space>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default MaterialsDashboardTab;