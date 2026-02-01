import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Space, DatePicker, Select, Tag, Typography, Tabs, Statistic, Progress } from 'antd';
import { 
  SearchOutlined, 
  DownloadOutlined, 
  PlusOutlined, 
  BankOutlined,
  SyncOutlined,
  FileTextOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  QuestionCircleOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface BankAccount {
  key: string;
  accountName: string;
  accountNumber: string;
  bankName: string;
  branch: string;
  ifsc: string;
  accountType: string;
  balance: number;
  lastUpdated: string;
  status: 'active' | 'inactive';
}

const sampleBankAccounts: BankAccount[] = [
  {
    key: '1',
    accountName: 'Main Business Account',
    accountNumber: '1234567890',
    bankName: 'State Bank of India',
    branch: 'Main Branch',
    ifsc: 'SBIN0001234',
    accountType: 'Current',
    balance: 450000,
    lastUpdated: '2023-11-20',
    status: 'active',
  },
  {
    key: '2',
    accountName: 'Payroll Account',
    accountNumber: '0987654321',
    bankName: 'HDFC Bank',
    branch: 'Corporate Branch',
    ifsc: 'HDFC0000123',
    accountType: 'Current',
    balance: 250000,
    lastUpdated: '2023-11-20',
    status: 'active',
  },
  {
    key: '3',
    accountName: 'Tax Payment Account',
    accountNumber: '5678901234',
    bankName: 'ICICI Bank',
    branch: 'Business Branch',
    ifsc: 'ICIC0001234',
    accountType: 'Current',
    balance: 180000,
    lastUpdated: '2023-11-19',
    status: 'active',
  },
  {
    key: '4',
    accountName: 'Fixed Deposit',
    accountNumber: '1122334455',
    bankName: 'Axis Bank',
    branch: 'Corporate Branch',
    ifsc: 'UTIB0001234',
    accountType: 'Fixed Deposit',
    balance: 1000000,
    lastUpdated: '2023-11-15',
    status: 'active',
  },
  {
    key: '5',
    accountName: 'Old Business Account',
    accountNumber: '9876543210',
    bankName: 'Punjab National Bank',
    branch: 'Commercial Branch',
    ifsc: 'PUNB0012345',
    accountType: 'Current',
    balance: 5000,
    lastUpdated: '2023-10-30',
    status: 'inactive',
  },
];

interface Transaction {
  key: string;
  date: string;
  description: string;
  reference: string;
  accountName: string;
  type: 'credit' | 'debit';
  amount: number;
  balance: number;
  category?: string;
  status: 'reconciled' | 'pending' | 'unreconciled';
}

const sampleTransactions: Transaction[] = [
  {
    key: '1',
    date: '2023-11-20',
    description: 'Payment from ABC Enterprises',
    reference: 'INV-2023-001',
    accountName: 'Main Business Account',
    type: 'credit',
    amount: 59000,
    balance: 450000,
    category: 'Sales',
    status: 'reconciled',
  },
  {
    key: '2',
    date: '2023-11-18',
    description: 'Office Rent Payment',
    reference: 'BILL-2023-001',
    accountName: 'Main Business Account',
    type: 'debit',
    amount: 35000,
    balance: 391000,
    category: 'Rent',
    status: 'reconciled',
  },
  {
    key: '3',
    date: '2023-11-15',
    description: 'Salary Payments',
    reference: 'PAY-NOV-2023',
    accountName: 'Payroll Account',
    type: 'debit',
    amount: 180000,
    balance: 250000,
    category: 'Salaries',
    status: 'reconciled',
  },
  {
    key: '4',
    date: '2023-11-12',
    description: 'Payment from XYZ Corporation',
    reference: 'INV-2023-002',
    accountName: 'Main Business Account',
    type: 'credit',
    amount: 88500,
    balance: 426000,
    category: 'Sales',
    status: 'pending',
  },
  {
    key: '5',
    date: '2023-11-10',
    description: 'Utility Bills Payment',
    reference: 'UTIL-NOV-2023',
    accountName: 'Main Business Account',
    type: 'debit',
    amount: 12500,
    balance: 337500,
    category: 'Utilities',
    status: 'unreconciled',
  },
  {
    key: '6',
    date: '2023-11-05',
    description: 'GST Payment',
    reference: 'GST-OCT-2023',
    accountName: 'Tax Payment Account',
    type: 'debit',
    amount: 45000,
    balance: 180000,
    category: 'Taxes',
    status: 'reconciled',
  },
  {
    key: '7',
    date: '2023-11-03',
    description: 'Office Supplies',
    reference: 'BILL-2023-002',
    accountName: 'Main Business Account',
    type: 'debit',
    amount: 8500,
    balance: 350000,
    category: 'Office Supplies',
    status: 'unreconciled',
  },
];

const BankTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedAccountType, setSelectedAccountType] = useState<string[]>([]);
  const [selectedTransactionType, setSelectedTransactionType] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('accounts');

  // Account type filter options
  const accountTypeOptions = [
    { value: 'Current', label: 'Current' },
    { value: 'Savings', label: 'Savings' },
    { value: 'Fixed Deposit', label: 'Fixed Deposit' },
    { value: 'Overdraft', label: 'Overdraft' },
  ];

  // Transaction type filter options
  const transactionTypeOptions = [
    { value: 'credit', label: 'Credit' },
    { value: 'debit', label: 'Debit' },
  ];

  // Transaction status filter options
  const transactionStatusOptions = [
    { value: 'reconciled', label: 'Reconciled' },
    { value: 'pending', label: 'Pending' },
    { value: 'unreconciled', label: 'Unreconciled' },
  ];

  // Filter bank accounts based on search text and selected account type
  const filteredBankAccounts = sampleBankAccounts.filter(record => {
    const matchesSearch = searchText === '' || 
      record.accountName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.accountNumber.includes(searchText) ||
      record.bankName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesAccountType = selectedAccountType.length === 0 || 
      selectedAccountType.includes(record.accountType);
    
    return matchesSearch && matchesAccountType;
  });

  // Filter transactions based on search text and selected transaction type
  const filteredTransactions = sampleTransactions.filter(record => {
    const matchesSearch = searchText === '' || 
      record.description.toLowerCase().includes(searchText.toLowerCase()) ||
      record.reference.toLowerCase().includes(searchText.toLowerCase()) ||
      record.accountName.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesTransactionType = selectedTransactionType.length === 0 || 
      selectedTransactionType.includes(record.type);
    
    return matchesSearch && matchesTransactionType;
  });

  // Calculate summary statistics
  const totalBalance = sampleBankAccounts
    .filter(account => account.status === 'active')
    .reduce((sum, account) => sum + account.balance, 0);
  
  const totalCredits = sampleTransactions
    .filter(transaction => transaction.type === 'credit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);
  
  const totalDebits = sampleTransactions
    .filter(transaction => transaction.type === 'debit')
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const reconciledPercentage = Math.round(
    (sampleTransactions.filter(t => t.status === 'reconciled').length / sampleTransactions.length) * 100
  );

  // Bank Accounts Table columns
  const bankAccountColumns: ColumnsType<BankAccount> = [
    {
      title: 'Account Name',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
      render: (text, record) => (
        <Space>
          {record.status === 'active' ? 
            <BankOutlined style={{ color: '#1890ff' }} /> : 
            <BankOutlined style={{ color: '#d9d9d9' }} />
          }
          <a>{text}</a>
        </Space>
      ),
    },
    {
      title: 'Bank',
      dataIndex: 'bankName',
      key: 'bankName',
      sorter: (a, b) => a.bankName.localeCompare(b.bankName),
    },
    {
      title: 'Account Number',
      dataIndex: 'accountNumber',
      key: 'accountNumber',
      render: (text) => {
        // Mask account number for privacy
        const lastFour = text.slice(-4);
        return `XXXX-XXXX-${lastFour}`;
      },
    },
    {
      title: 'Account Type',
      dataIndex: 'accountType',
      key: 'accountType',
      sorter: (a, b) => a.accountType.localeCompare(b.accountType),
    },
    {
      title: 'IFSC',
      dataIndex: 'ifsc',
      key: 'ifsc',
    },
    {
      title: 'Balance (₹)',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => balance.toLocaleString('en-IN'),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'Last Updated',
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      sorter: (a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime(),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        return status === 'active' ? 
          <Tag color="success">ACTIVE</Tag> : 
          <Tag color="default">INACTIVE</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View Transactions</Button>
          <Button type="link" size="small" icon={<SyncOutlined />}>Update Balance</Button>
        </Space>
      ),
    },
  ];

  // Transactions Table columns
  const transactionColumns: ColumnsType<Transaction> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      sorter: (a, b) => a.description.localeCompare(b.description),
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Account',
      dataIndex: 'accountName',
      key: 'accountName',
      sorter: (a, b) => a.accountName.localeCompare(b.accountName),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category || '-',
      sorter: (a, b) => {
        if (!a.category) return 1;
        if (!b.category) return -1;
        return a.category.localeCompare(b.category);
      },
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      render: (type) => {
        return type === 'credit' ? 
          <Tag color="success">CREDIT</Tag> : 
          <Tag color="error">DEBIT</Tag>;
      },
      sorter: (a, b) => a.type.localeCompare(b.type),
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => {
        const color = record.type === 'credit' ? '#52c41a' : '#ff4d4f';
        const prefix = record.type === 'credit' ? '+' : '-';
        return <span style={{ color }}>{prefix} {amount.toLocaleString('en-IN')}</span>;
      },
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Balance (₹)',
      dataIndex: 'balance',
      key: 'balance',
      render: (balance) => balance.toLocaleString('en-IN'),
      sorter: (a, b) => a.balance - b.balance,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let icon = null;
        
        switch(status) {
          case 'reconciled':
            color = 'success';
            icon = <CheckCircleOutlined />;
            break;
          case 'pending':
            color = 'processing';
            icon = <QuestionCircleOutlined />;
            break;
          case 'unreconciled':
            color = 'warning';
            icon = <CloseCircleOutlined />;
            break;
          default:
            color = 'default';
        }
        
        return (
          <Tag icon={icon} color={color}>
            {status.toUpperCase()}
          </Tag>
        );
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          {record.status !== 'reconciled' && 
            <Button type="link" size="small">Reconcile</Button>
          }
          {record.status === 'unreconciled' && 
            <Button type="link" size="small">Edit</Button>
          }
        </Space>
      ),
    },
  ];

  return (
    <div className="bank-tab-container">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Bank Balance" 
              value={totalBalance} 
              precision={2}
              prefix="₹"
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Credits (30 days)" 
              value={totalCredits} 
              precision={2}
              prefix="₹"
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Debits (30 days)" 
              value={totalDebits} 
              precision={2}
              prefix="₹"
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Reconciliation Status" 
              value={reconciledPercentage} 
              suffix="%"
              prefix={<Progress type="circle" percent={reconciledPercentage} width={20} style={{ marginRight: 8 }} />}
              valueStyle={{ color: reconciledPercentage > 80 ? '#52c41a' : reconciledPercentage > 50 ? '#faad14' : '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for Bank Accounts and Transactions */}
      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Bank Accounts" key="accounts">
            {/* Filters and Actions for Bank Accounts Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search accounts" 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  mode="multiple"
                  placeholder="Account Type"
                  value={selectedAccountType}
                  onChange={setSelectedAccountType}
                  options={accountTypeOptions}
                  style={{ width: 200 }}
                  maxTagCount="responsive"
                />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button icon={<FileTextOutlined />}>Statement</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Account</Button>
              </Space>
            </div>

            {/* Bank Accounts Table */}
            <Table 
              columns={bankAccountColumns} 
              dataSource={filteredBankAccounts} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          
          <TabPane tab="Transactions" key="transactions">
            {/* Filters and Actions for Transactions Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search transactions" 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  mode="multiple"
                  placeholder="Transaction Type"
                  value={selectedTransactionType}
                  onChange={setSelectedTransactionType}
                  options={transactionTypeOptions}
                  style={{ width: 150 }}
                  maxTagCount="responsive"
                />
                <Select
                  mode="multiple"
                  placeholder="Status"
                  options={transactionStatusOptions}
                  style={{ width: 150 }}
                  maxTagCount="responsive"
                />
                <RangePicker />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<UploadOutlined />}>Import</Button>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Transaction</Button>
              </Space>
            </div>

            {/* Transactions Table */}
            <Table 
              columns={transactionColumns} 
              dataSource={filteredTransactions} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  );
};

export default BankTab;