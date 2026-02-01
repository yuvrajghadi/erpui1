import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Space, DatePicker, Select, Tag, Typography, Tabs, Badge, Dropdown } from 'antd';
import { 
  SearchOutlined, 
  FilterOutlined, 
  DownloadOutlined, 
  PlusOutlined, 
  EllipsisOutlined,
  PrinterOutlined,
  MailOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { MenuProps } from 'antd';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface InvoiceRecord {
  key: string;
  invoiceNo: string;
  date: string;
  dueDate: string;
  customer: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue' | 'draft';
  paymentMethod?: string;
  paymentDate?: string;
}

const sampleInvoiceData: InvoiceRecord[] = [
  {
    key: '1',
    invoiceNo: 'INV-2023-001',
    date: '2023-10-05',
    dueDate: '2023-11-04',
    customer: 'ABC Enterprises',
    amount: 50000,
    tax: 9000,
    totalAmount: 59000,
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2023-10-20',
  },
  {
    key: '2',
    invoiceNo: 'INV-2023-002',
    date: '2023-10-12',
    dueDate: '2023-11-11',
    customer: 'XYZ Corporation',
    amount: 75000,
    tax: 13500,
    totalAmount: 88500,
    status: 'paid',
    paymentMethod: 'Credit Card',
    paymentDate: '2023-10-30',
  },
  {
    key: '3',
    invoiceNo: 'INV-2023-003',
    date: '2023-10-20',
    dueDate: '2023-11-19',
    customer: 'Global Traders',
    amount: 100000,
    tax: 18000,
    totalAmount: 118000,
    status: 'unpaid',
  },
  {
    key: '4',
    invoiceNo: 'INV-2023-004',
    date: '2023-11-02',
    dueDate: '2023-12-02',
    customer: 'Local Distributors',
    amount: 60000,
    tax: 10800,
    totalAmount: 70800,
    status: 'partial',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2023-11-15',
  },
  {
    key: '5',
    invoiceNo: 'INV-2023-005',
    date: '2023-09-15',
    dueDate: '2023-10-15',
    customer: 'Premier Solutions',
    amount: 120000,
    tax: 21600,
    totalAmount: 141600,
    status: 'overdue',
  },
  {
    key: '6',
    invoiceNo: 'INV-2023-006',
    date: '2023-11-18',
    dueDate: '2023-12-18',
    customer: 'Tech Innovations',
    amount: 85000,
    tax: 15300,
    totalAmount: 100300,
    status: 'draft',
  },
];

interface BillRecord {
  key: string;
  billNo: string;
  date: string;
  dueDate: string;
  vendor: string;
  amount: number;
  tax: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'partial' | 'overdue';
  paymentMethod?: string;
  paymentDate?: string;
}

const sampleBillData: BillRecord[] = [
  {
    key: '1',
    billNo: 'BILL-2023-001',
    date: '2023-10-03',
    dueDate: '2023-11-02',
    vendor: 'Office Supplies Co.',
    amount: 15000,
    tax: 2700,
    totalAmount: 17700,
    status: 'paid',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2023-10-25',
  },
  {
    key: '2',
    billNo: 'BILL-2023-002',
    date: '2023-10-10',
    dueDate: '2023-11-09',
    vendor: 'IT Services Ltd.',
    amount: 45000,
    tax: 8100,
    totalAmount: 53100,
    status: 'paid',
    paymentMethod: 'Credit Card',
    paymentDate: '2023-10-28',
  },
  {
    key: '3',
    billNo: 'BILL-2023-003',
    date: '2023-10-18',
    dueDate: '2023-11-17',
    vendor: 'Maintenance Services',
    amount: 30000,
    tax: 5400,
    totalAmount: 35400,
    status: 'unpaid',
  },
  {
    key: '4',
    billNo: 'BILL-2023-004',
    date: '2023-11-01',
    dueDate: '2023-12-01',
    vendor: 'Logistics Partners',
    amount: 25000,
    tax: 4500,
    totalAmount: 29500,
    status: 'partial',
    paymentMethod: 'Bank Transfer',
    paymentDate: '2023-11-15',
  },
  {
    key: '5',
    billNo: 'BILL-2023-005',
    date: '2023-09-12',
    dueDate: '2023-10-12',
    vendor: 'Equipment Suppliers',
    amount: 70000,
    tax: 12600,
    totalAmount: 82600,
    status: 'overdue',
  },
];

const InvoiceTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('invoices');

  // Status filter options
  const statusOptions = [
    { value: 'paid', label: 'Paid' },
    { value: 'unpaid', label: 'Unpaid' },
    { value: 'partial', label: 'Partial' },
    { value: 'overdue', label: 'Overdue' },
    { value: 'draft', label: 'Draft' },
  ];

  // Filter invoice data based on search text and selected status
  const filteredInvoiceData = sampleInvoiceData.filter(record => {
    const matchesSearch = searchText === '' || 
      record.invoiceNo.toLowerCase().includes(searchText.toLowerCase()) ||
      record.customer.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(record.status);
    
    return matchesSearch && matchesStatus;
  });

  // Filter bill data based on search text and selected status
  const filteredBillData = sampleBillData.filter(record => {
    const matchesSearch = searchText === '' || 
      record.billNo.toLowerCase().includes(searchText.toLowerCase()) ||
      record.vendor.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(record.status);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const totalInvoiceAmount = sampleInvoiceData.reduce((sum, record) => sum + record.totalAmount, 0);
  const paidInvoiceAmount = sampleInvoiceData
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.totalAmount, 0);
  const unpaidInvoiceAmount = sampleInvoiceData
    .filter(record => record.status === 'unpaid' || record.status === 'partial' || record.status === 'overdue')
    .reduce((sum, record) => sum + record.totalAmount, 0);
  
  const totalBillAmount = sampleBillData.reduce((sum, record) => sum + record.totalAmount, 0);
  const paidBillAmount = sampleBillData
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.totalAmount, 0);
  const unpaidBillAmount = sampleBillData
    .filter(record => record.status === 'unpaid' || record.status === 'partial' || record.status === 'overdue')
    .reduce((sum, record) => sum + record.totalAmount, 0);

  // Action menu items for invoice
  const invoiceActionMenu: MenuProps['items'] = [
    {
      key: '1',
      label: 'View Details',
      icon: <SearchOutlined />,
    },
    {
      key: '2',
      label: 'Edit Invoice',
      icon: <EditOutlined />,
    },
    {
      key: '3',
      label: 'Print Invoice',
      icon: <PrinterOutlined />,
    },
    {
      key: '4',
      label: 'Send Email',
      icon: <MailOutlined />,
    },
    {
      key: '5',
      label: 'Delete',
      icon: <DeleteOutlined />,
      danger: true,
    },
  ];

  // Status tag renderer
  const renderStatusTag = (status: string) => {
    let color = '';
    let icon = null;
    
    switch(status) {
      case 'paid':
        color = 'success';
        icon = <CheckCircleOutlined />;
        break;
      case 'unpaid':
        color = 'warning';
        icon = <ClockCircleOutlined />;
        break;
      case 'partial':
        color = 'processing';
        icon = <WarningOutlined />;
        break;
      case 'overdue':
        color = 'error';
        icon = <CloseCircleOutlined />;
        break;
      case 'draft':
        color = 'default';
        icon = <EditOutlined />;
        break;
      default:
        color = 'default';
    }
    
    return (
      <Tag icon={icon} color={color}>
        {status.toUpperCase()}
      </Tag>
    );
  };

  // Invoice Table columns
  const invoiceColumns: ColumnsType<InvoiceRecord> = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Tax (₹)',
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => tax.toLocaleString('en-IN'),
    },
    {
      title: 'Total (₹)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.paymentMethod && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.paymentMethod}
            </Text>
          )}
          {record.paymentDate && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.paymentDate}
            </Text>
          )}
          {!record.paymentMethod && !record.paymentDate && '-'}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'unpaid' || record.status === 'partial' || record.status === 'overdue' ? (
            <Button type="link" size="small">Record Payment</Button>
          ) : null}
          <Dropdown menu={{ items: invoiceActionMenu }} placement="bottomRight">
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  // Bill Table columns
  const billColumns: ColumnsType<BillRecord> = [
    {
      title: 'Bill No',
      dataIndex: 'billNo',
      key: 'billNo',
      sorter: (a, b) => a.billNo.localeCompare(b.billNo),
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      sorter: (a, b) => a.vendor.localeCompare(b.vendor),
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Tax (₹)',
      dataIndex: 'tax',
      key: 'tax',
      render: (tax) => tax.toLocaleString('en-IN'),
    },
    {
      title: 'Total (₹)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: renderStatusTag,
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Payment',
      key: 'payment',
      render: (_, record) => (
        <Space direction="vertical" size={0}>
          {record.paymentMethod && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.paymentMethod}
            </Text>
          )}
          {record.paymentDate && (
            <Text type="secondary" style={{ fontSize: '12px' }}>
              {record.paymentDate}
            </Text>
          )}
          {!record.paymentMethod && !record.paymentDate && '-'}
        </Space>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          {record.status === 'unpaid' || record.status === 'partial' || record.status === 'overdue' ? (
            <Button type="link" size="small">Make Payment</Button>
          ) : null}
          <Dropdown menu={{ items: invoiceActionMenu }} placement="bottomRight">
            <Button type="text" icon={<EllipsisOutlined />} />
          </Dropdown>
        </Space>
      ),
    },
  ];

  return (
    <div className="invoice-tab-container">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} md={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">Total Invoices</Text>
                <Title level={3} style={{ margin: '8px 0 0 0' }}>₹{totalInvoiceAmount.toLocaleString('en-IN')}</Title>
              </div>
              <div>
                <Badge count={sampleInvoiceData.length} style={{ backgroundColor: '#1890ff' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Paid</Text>
                <div style={{ color: '#52c41a', fontWeight: 'bold' }}>₹{paidInvoiceAmount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Unpaid</Text>
                <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>₹{unpaidInvoiceAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">Total Bills</Text>
                <Title level={3} style={{ margin: '8px 0 0 0' }}>₹{totalBillAmount.toLocaleString('en-IN')}</Title>
              </div>
              <div>
                <Badge count={sampleBillData.length} style={{ backgroundColor: '#722ed1' }} />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Paid</Text>
                <div style={{ color: '#52c41a', fontWeight: 'bold' }}>₹{paidBillAmount.toLocaleString('en-IN')}</div>
              </div>
              <div>
                <Text type="secondary" style={{ fontSize: '12px' }}>Unpaid</Text>
                <div style={{ color: '#ff4d4f', fontWeight: 'bold' }}>₹{unpaidBillAmount.toLocaleString('en-IN')}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} md={8}>
          <Card>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text type="secondary">Net Balance</Text>
                <Title level={3} style={{ margin: '8px 0 0 0', color: totalInvoiceAmount - totalBillAmount >= 0 ? '#52c41a' : '#ff4d4f' }}>
                  ₹{Math.abs(totalInvoiceAmount - totalBillAmount).toLocaleString('en-IN')}
                </Title>
              </div>
              <div>
                <Tag color={totalInvoiceAmount - totalBillAmount >= 0 ? 'success' : 'error'}>
                  {totalInvoiceAmount - totalBillAmount >= 0 ? 'PROFIT' : 'LOSS'}
                </Tag>
              </div>
            </div>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {totalInvoiceAmount - totalBillAmount >= 0 ? 'Receivables exceed payables' : 'Payables exceed receivables'}
              </Text>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Invoices and Bills */}
      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Invoices" key="invoices">
            {/* Filters and Actions for Invoices Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search by invoice no or customer" 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  mode="multiple"
                  placeholder="Filter by status"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={statusOptions}
                  style={{ width: 200 }}
                  maxTagCount="responsive"
                />
                <RangePicker />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button icon={<PrinterOutlined />}>Print</Button>
                <Button type="primary" icon={<PlusOutlined />}>Create Invoice</Button>
              </Space>
            </div>

            {/* Invoices Table */}
            <Table 
              columns={invoiceColumns} 
              dataSource={filteredInvoiceData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          
          <TabPane tab="Bills" key="bills">
            {/* Filters and Actions for Bills Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search by bill no or vendor" 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <Select
                  mode="multiple"
                  placeholder="Filter by status"
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  options={statusOptions.filter(option => option.value !== 'draft')}
                  style={{ width: 200 }}
                  maxTagCount="responsive"
                />
                <RangePicker />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Bill</Button>
              </Space>
            </div>

            {/* Bills Table */}
            <Table 
              columns={billColumns} 
              dataSource={filteredBillData} 
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

export default InvoiceTab;