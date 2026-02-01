import React, { useState } from 'react';
import { Row, Col, Card, Typography, Button, Space, Tag, Tabs } from 'antd';
import {
  DashboardOutlined,
  RiseOutlined,
  FallOutlined,
  DollarOutlined,
  TransactionOutlined,
  BankOutlined,
  BarChartOutlined,
  PlusOutlined,
  FileAddOutlined,
  SettingOutlined,
  TableOutlined,
  MoneyCollectOutlined,
  AccountBookOutlined,
  FileTextOutlined,
  AuditOutlined,
  PercentageOutlined,
  AppstoreOutlined,
  CalculatorOutlined,
  ExportOutlined,
  ImportOutlined,
} from '@ant-design/icons';
import { TransactionDrawer, ImportDrawer, ExportDrawer, ReportDrawer, CategoryDrawer, ReconciliationDrawer, TaxDrawer } from '../drawers';

import { StatCard } from '../components/StatCard';
import { ActionCard } from '../components/ActionCard';
import DataTable from '../components/DataTable';
import { RevenueChart } from '../components/charts/RevenueChart';
import { ExpensesChart } from '../components/charts/ExpensesChart';
import { CashFlowChart } from '../components/charts/CashFlowChart';

const { Title, Text } = Typography;

// Sample data for recent transactions
const recentTransactions = [
  {
    id: '1',
    date: '2023-06-15',
    type: 'Income',
    description: 'Client Payment - ABC Corp',
    amount: 15000,
    category: 'Sales',
    status: 'Completed',
  },
  {
    id: '2',
    date: '2023-06-14',
    type: 'Expense',
    description: 'Office Rent',
    amount: 5000,
    category: 'Rent',
    status: 'Completed',
  },
  {
    id: '3',
    date: '2023-06-13',
    type: 'Income',
    description: 'Client Payment - XYZ Ltd',
    amount: 8500,
    category: 'Services',
    status: 'Pending',
  },
  {
    id: '4',
    date: '2023-06-12',
    type: 'Expense',
    description: 'Utility Bills',
    amount: 1200,
    category: 'Utilities',
    status: 'Completed',
  },
  {
    id: '5',
    date: '2023-06-10',
    type: 'Income',
    description: 'Interest Income',
    amount: 350,
    category: 'Interest',
    status: 'Completed',
  },
];

// Sample data for payables
const payablesData = [
  {
    id: '1',
    vendor: 'Office Supplies Inc',
    invoiceNo: 'INV-2023-001',
    amount: 2500,
    dueDate: '2023-07-15',
    status: 'Pending',
  },
  {
    id: '2',
    vendor: 'Tech Solutions Ltd',
    invoiceNo: 'INV-2023-042',
    amount: 4800,
    dueDate: '2023-07-10',
    status: 'Overdue',
  },
  {
    id: '3',
    vendor: 'Marketing Agency',
    invoiceNo: 'INV-2023-108',
    amount: 3200,
    dueDate: '2023-07-20',
    status: 'Pending',
  },
  {
    id: '4',
    vendor: 'Logistics Partner',
    invoiceNo: 'INV-2023-076',
    amount: 1800,
    dueDate: '2023-07-05',
    status: 'Overdue',
  },
  {
    id: '5',
    vendor: 'Cleaning Services',
    invoiceNo: 'INV-2023-112',
    amount: 950,
    dueDate: '2023-07-25',
    status: 'Pending',
  },
];

interface DashboardTabProps {
  showDrawer?: (type: string) => void;
}

const DashboardTab: React.FC<DashboardTabProps> = ({ showDrawer }) => {
  // State for handling drawer visibility
  const [drawerState, setDrawerState] = useState({
    transaction: false,
    import: false,
    export: false,
    report: false,
    category: false,
    reconciliation: false,
    tax: false,
  });

  // Handler for opening drawers
  const handleOpenDrawer = (type: keyof typeof drawerState) => {
    setDrawerState(prev => ({ ...prev, [type]: true }));
  };

  // Handler for closing drawers
  const handleCloseDrawer = (type: keyof typeof drawerState) => {
    setDrawerState(prev => ({ ...prev, [type]: false }));
  };

  // Transaction table columns
  const transactionColumns = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'Income' ? 'green' : 'red'} style={{ borderRadius: '4px' }}>
          {type}
        </Tag>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text style={{ fontWeight: 500 }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          color={status === 'Completed' ? 'green' : status === 'Pending' ? 'orange' : 'red'} 
          style={{ borderRadius: '4px' }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  // Payables table columns
  const payablesColumns = [
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text style={{ fontWeight: 500 }}>
          ${amount.toLocaleString()}
        </Text>
      ),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag 
          color={status === 'Paid' ? 'green' : status === 'Pending' ? 'orange' : 'red'} 
          style={{ borderRadius: '4px' }}
        >
          {status}
        </Tag>
      ),
    },
  ];

  const handleViewTransaction = (record: any) => {
    console.log('View transaction', record);
  };

  const handleViewHistory = (record: any) => {
    console.log('View history', record);
  };

  const handleViewInvoice = (record: any) => {
    console.log('View invoice', record);
  };

  const handleEditInvoice = (record: any) => {
    console.log('Edit invoice', record);
  };

  return (
    <div className="accounting-dashboard-tab">
      {/* Drawers */}
      <TransactionDrawer 
        open={drawerState.transaction} 
        onClose={() => handleCloseDrawer('transaction')} 
      />
      <ImportDrawer 
        open={drawerState.import} 
        onClose={() => handleCloseDrawer('import')} 
      />
      <ExportDrawer 
        open={drawerState.export} 
        onClose={() => handleCloseDrawer('export')} 
      />
      <ReportDrawer 
        open={drawerState.report} 
        onClose={() => handleCloseDrawer('report')} 
      />
      <CategoryDrawer
        open={drawerState.category}
        onClose={() => handleCloseDrawer('category')}
      />
      <ReconciliationDrawer
        open={drawerState.reconciliation}
        onClose={() => handleCloseDrawer('reconciliation')}
      />
      <TaxDrawer
        open={drawerState.tax}
        onClose={() => handleCloseDrawer('tax')}
      />
      
      {/* Statistics Row */}
      <Row gutter={[16, 16]} className="stats-row pb-3">
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Revenue"
            value={1250000}
            valueFormatter={(val) => `₹${(val as number).toLocaleString('en-US')}`}
            icon={<DollarOutlined />}
            color="#1890ff"
            trend={5.8}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Net Profit"
            value={450000}
            valueFormatter={(val) => `₹${(val as number).toLocaleString('en-US')}`}
            icon={<RiseOutlined />}
            color="#52c41a"
            trend={3.2}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Receivables"
            value={320000}
            valueFormatter={(val) => `₹${(val as number).toLocaleString('en-US')}`}
            icon={<TransactionOutlined />}
            color="#722ed1"
            trend={-2.1}
            trendLabel="vs last month"
          />
        </Col>
        <Col xs={24} sm={12} md={6}>
          <StatCard
            title="Total Payables"
            value={180000}
            valueFormatter={(val) => `₹${(val as number).toLocaleString('en-US')}`}
            icon={<MoneyCollectOutlined />}
            color="#fa8c16"
            trend={1.5}
            trendLabel="vs last month"
          />
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[16, 16]} className="charts-row">
        <Col xs={24} lg={12}>
          <RevenueChart />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <ExpensesChart />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <Card 
            className="dashboard-card" 
            title="Tax & Compliance"
            extra={<Button type="link" size="small">View All</Button>}
            variant="outlined"
            style={{ 
              height: '100%',
              boxShadow: '0 2px 8px rgba(0,0,0,0.09)',
            }}
          >
            <div className="low-stock-summary">
              <div className="alert-item">
                <Text strong>GST Returns</Text>
                <Tag color="success">Filed</Tag>
              </div>
              <div className="alert-item">
                <Text strong>TDS Payable</Text>
                <Text type="danger">₹12,500</Text>
              </div>
              <div className="alert-item">
                <Text strong>TDS Receivable</Text>
                <Text type="success">₹8,200</Text>
              </div>
              <div className="alert-item">
                <Text strong>Income Tax</Text>
                <Tag color="warning">Due in 15 days</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Cash Flow Chart */}
      <Row gutter={[16, 16]} style={{ marginBottom: '16px' }}>
        <Col xs={24}>
          <CashFlowChart />
        </Col>
      </Row>

      {/* Quick Actions Row */}
      <Row gutter={[16, 16]} className="quick-actions-row">
        <Col xs={24}>
          <Title level={4} style={{ 
            marginBottom: '16px', 
            marginTop: '8px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{ 
              backgroundColor: '#1890ff15', 
              width: '32px', 
              height: '32px', 
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#1890ff'
            }}>
              <DashboardOutlined />
            </span>
            Quick Actions
          </Title>
        </Col>
        
        {/* Each card has consistent column spans across breakpoints */}
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Record Transaction"
            description="Add new income or expense entries"
            icon={<PlusOutlined />}
            color="#1890ff"
            buttonText="Add Transaction"
            onClick={() => handleOpenDrawer('transaction')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Import Data"
            description="Import accounting data"
            icon={<ImportOutlined />}
            color="#13c2c2"
            buttonText="Import"
            onClick={() => handleOpenDrawer('import')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Export Data"
            description="Export accounting data"
            icon={<ExportOutlined />}
            color="#fa8c16"
            buttonText="Export"
            onClick={() => handleOpenDrawer('export')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Generate Report"
            description="Create financial reports and statements"
            icon={<FileTextOutlined />}
            color="#52c41a"
            buttonText="Create Report"
            onClick={() => handleOpenDrawer('report')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Manage Categories"
            description="Add or modify transaction categories"
            icon={<AppstoreOutlined />}
            color="#722ed1"
            buttonText="Manage"
            onClick={() => handleOpenDrawer('category')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Bank Reconciliation"
            description="Reconcile bank statements"
            icon={<BankOutlined />}
            color="#fa8c16"
            buttonText="Reconcile"
            onClick={() => handleOpenDrawer('reconciliation')}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4} xxl={3}>
          <ActionCard
            title="Tax Management"
            description="Manage tax calculations and filings"
            icon={<CalculatorOutlined />}
            color="#eb2f96"
            buttonText="Manage"
            onClick={() => handleOpenDrawer('tax')}
          />
        </Col>
      </Row>

      {/* Tables Row */}
      <Row gutter={[16, 16]} className="tables-row">
        <Col xs={24}>
          <Title level={4} style={{ marginBottom: '16px', marginTop: '8px' }}>Financial Activity</Title>
        </Col>
        <Col xs={24} lg={12}>
          <DataTable
            title="Recent Transactions"
            columns={transactionColumns}
            data={recentTransactions}
            rowKey="id"
            onView={handleViewTransaction}
            onHistory={handleViewHistory}
          />
        </Col>
        <Col xs={24} lg={12}>
          <DataTable
            title="Pending Invoices"
            columns={payablesColumns}
            data={payablesData}
            rowKey="id"
            onView={handleViewInvoice}
            onEdit={handleEditInvoice}
          />
        </Col>
      </Row>
    </div>
  );
};

export default DashboardTab;