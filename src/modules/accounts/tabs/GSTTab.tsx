import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Space, DatePicker, Select, Tag, Typography, Tabs, Statistic } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, UploadOutlined, FilePdfOutlined, FileExcelOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface GSTRecord {
  key: string;
  returnType: string;
  period: string;
  dueDate: string;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  status: 'pending' | 'filed' | 'overdue';
  filingDate?: string;
  arn?: string; // Acknowledgment Reference Number
}

const sampleGSTData: GSTRecord[] = [
  {
    key: '1',
    returnType: 'GSTR-1',
    period: 'October 2023',
    dueDate: '2023-11-11',
    taxableAmount: 250000,
    cgst: 22500,
    sgst: 22500,
    igst: 0,
    totalTax: 45000,
    status: 'filed',
    filingDate: '2023-11-10',
    arn: 'AB2310001',
  },
  {
    key: '2',
    returnType: 'GSTR-3B',
    period: 'October 2023',
    dueDate: '2023-11-20',
    taxableAmount: 250000,
    cgst: 22500,
    sgst: 22500,
    igst: 0,
    totalTax: 45000,
    status: 'pending',
  },
  {
    key: '3',
    returnType: 'GSTR-1',
    period: 'September 2023',
    dueDate: '2023-10-11',
    taxableAmount: 220000,
    cgst: 19800,
    sgst: 19800,
    igst: 0,
    totalTax: 39600,
    status: 'filed',
    filingDate: '2023-10-10',
    arn: 'AB2309001',
  },
  {
    key: '4',
    returnType: 'GSTR-3B',
    period: 'September 2023',
    dueDate: '2023-10-20',
    taxableAmount: 220000,
    cgst: 19800,
    sgst: 19800,
    igst: 0,
    totalTax: 39600,
    status: 'filed',
    filingDate: '2023-10-19',
    arn: 'AB2309002',
  },
  {
    key: '5',
    returnType: 'GSTR-1',
    period: 'November 2023',
    dueDate: '2023-12-11',
    taxableAmount: 280000,
    cgst: 25200,
    sgst: 25200,
    igst: 0,
    totalTax: 50400,
    status: 'pending',
  },
];

interface InvoiceRecord {
  key: string;
  invoiceNo: string;
  date: string;
  customer: string;
  taxableAmount: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalAmount: number;
  status: 'paid' | 'unpaid' | 'partial';
  gstReported: boolean;
}

const sampleInvoiceData: InvoiceRecord[] = [
  {
    key: '1',
    invoiceNo: 'INV-2023-001',
    date: '2023-10-05',
    customer: 'ABC Enterprises',
    taxableAmount: 50000,
    gstRate: 18,
    cgst: 4500,
    sgst: 4500,
    igst: 0,
    totalAmount: 59000,
    status: 'paid',
    gstReported: true,
  },
  {
    key: '2',
    invoiceNo: 'INV-2023-002',
    date: '2023-10-12',
    customer: 'XYZ Corporation',
    taxableAmount: 75000,
    gstRate: 18,
    cgst: 6750,
    sgst: 6750,
    igst: 0,
    totalAmount: 88500,
    status: 'paid',
    gstReported: true,
  },
  {
    key: '3',
    invoiceNo: 'INV-2023-003',
    date: '2023-10-20',
    customer: 'Global Traders',
    taxableAmount: 100000,
    gstRate: 18,
    cgst: 0,
    sgst: 0,
    igst: 18000,
    totalAmount: 118000,
    status: 'unpaid',
    gstReported: false,
  },
  {
    key: '4',
    invoiceNo: 'INV-2023-004',
    date: '2023-11-02',
    customer: 'Local Distributors',
    taxableAmount: 60000,
    gstRate: 18,
    cgst: 5400,
    sgst: 5400,
    igst: 0,
    totalAmount: 70800,
    status: 'partial',
    gstReported: false,
  },
  {
    key: '5',
    invoiceNo: 'INV-2023-005',
    date: '2023-11-10',
    customer: 'Premier Solutions',
    taxableAmount: 120000,
    gstRate: 18,
    cgst: 10800,
    sgst: 10800,
    igst: 0,
    totalAmount: 141600,
    status: 'paid',
    gstReported: false,
  },
];

const GSTTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('returns');

  // Status filter options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'filed', label: 'Filed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  // Filter GST data based on search text and selected status
  const filteredGSTData = sampleGSTData.filter(record => {
    const matchesSearch = searchText === '' || 
      record.returnType.toLowerCase().includes(searchText.toLowerCase()) ||
      record.period.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(record.status);
    
    return matchesSearch && matchesStatus;
  });

  // Filter invoice data based on search text
  const filteredInvoiceData = sampleInvoiceData.filter(record => {
    return searchText === '' || 
      record.invoiceNo.toLowerCase().includes(searchText.toLowerCase()) ||
      record.customer.toLowerCase().includes(searchText.toLowerCase());
  });

  // Calculate summary statistics
  const pendingReturns = sampleGSTData.filter(record => record.status === 'pending').length;
  const overdueReturns = sampleGSTData.filter(record => record.status === 'overdue').length;
  const totalTaxPaid = sampleGSTData
    .filter(record => record.status === 'filed')
    .reduce((sum, record) => sum + record.totalTax, 0);
  
  const pendingInvoices = sampleInvoiceData.filter(record => !record.gstReported).length;
  const totalInvoiceAmount = sampleInvoiceData.reduce((sum, record) => sum + record.totalAmount, 0);

  // GST Returns Table columns
  const gstColumns: ColumnsType<GSTRecord> = [
    {
      title: 'Return Type',
      dataIndex: 'returnType',
      key: 'returnType',
      sorter: (a, b) => a.returnType.localeCompare(b.returnType),
    },
    {
      title: 'Period',
      dataIndex: 'period',
      key: 'period',
      sorter: (a, b) => a.period.localeCompare(b.period),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Taxable Amount (₹)',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.taxableAmount - b.taxableAmount,
    },
    {
      title: 'CGST (₹)',
      dataIndex: 'cgst',
      key: 'cgst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'SGST (₹)',
      dataIndex: 'sgst',
      key: 'sgst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'IGST (₹)',
      dataIndex: 'igst',
      key: 'igst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'Total Tax (₹)',
      dataIndex: 'totalTax',
      key: 'totalTax',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.totalTax - b.totalTax,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'filed') color = 'green';
        if (status === 'overdue') color = 'red';
        if (status === 'pending') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Filing Date',
      dataIndex: 'filingDate',
      key: 'filingDate',
      render: (date) => date || '-',
    },
    {
      title: 'ARN',
      dataIndex: 'arn',
      key: 'arn',
      render: (arn) => arn || '-',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          {record.status === 'pending' && 
            <Button type="link" size="small">File</Button>
          }
          {record.status === 'filed' && 
            <Button type="link" size="small">Download</Button>
          }
        </Space>
      ),
    },
  ];

  // Invoice Table columns
  const invoiceColumns: ColumnsType<InvoiceRecord> = [
    {
      title: 'Invoice No',
      dataIndex: 'invoiceNo',
      key: 'invoiceNo',
      sorter: (a, b) => a.invoiceNo.localeCompare(b.invoiceNo),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      sorter: (a, b) => a.customer.localeCompare(b.customer),
    },
    {
      title: 'Taxable Amount (₹)',
      dataIndex: 'taxableAmount',
      key: 'taxableAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.taxableAmount - b.taxableAmount,
    },
    {
      title: 'GST Rate (%)',
      dataIndex: 'gstRate',
      key: 'gstRate',
      render: (rate) => `${rate}%`,
    },
    {
      title: 'CGST (₹)',
      dataIndex: 'cgst',
      key: 'cgst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'SGST (₹)',
      dataIndex: 'sgst',
      key: 'sgst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'IGST (₹)',
      dataIndex: 'igst',
      key: 'igst',
      render: (amount) => amount.toLocaleString('en-IN'),
    },
    {
      title: 'Total Amount (₹)',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.totalAmount - b.totalAmount,
    },
    {
      title: 'Payment Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'green';
        if (status === 'unpaid') color = 'red';
        if (status === 'partial') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'GST Reported',
      dataIndex: 'gstReported',
      key: 'gstReported',
      render: (reported) => (
        <Tag color={reported ? 'green' : 'orange'}>
          {reported ? 'YES' : 'PENDING'}
        </Tag>
      ),
      sorter: (a, b) => Number(a.gstReported) - Number(b.gstReported),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          <Button type="link" size="small">Download</Button>
          {!record.gstReported && 
            <Button type="link" size="small">Mark Reported</Button>
          }
        </Space>
      ),
    },
  ];

  return (
    <div className="gst-tab-container">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending Returns" 
              value={pendingReturns} 
              valueStyle={{ color: pendingReturns > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Overdue Returns" 
              value={overdueReturns} 
              valueStyle={{ color: overdueReturns > 0 ? '#ff4d4f' : '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Total Tax Paid" 
              value={totalTaxPaid} 
              prefix="₹"
              precision={2}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card>
            <Statistic 
              title="Pending Invoices" 
              value={pendingInvoices} 
              valueStyle={{ color: pendingInvoices > 0 ? '#faad14' : '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Tabs for GST Returns and Invoices */}
      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="GST Returns" key="returns">
            {/* Filters and Actions for GST Returns Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search by return type or period" 
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
                <Button icon={<FilePdfOutlined />}>Generate Report</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Return</Button>
              </Space>
            </div>

            {/* GST Returns Table */}
            <Table 
              columns={gstColumns} 
              dataSource={filteredGSTData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          
          <TabPane tab="GST Invoices" key="invoices">
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
                <RangePicker />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<UploadOutlined />}>Import</Button>
                <Button icon={<FileExcelOutlined />}>Export to Excel</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Invoice</Button>
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
        </Tabs>
      </Card>
    </div>
  );
};

export default GSTTab;