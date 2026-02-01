import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Space, DatePicker, Select, Tag, Typography, Tabs, Progress } from 'antd';
import { SearchOutlined, DownloadOutlined, PlusOutlined, CalendarOutlined, FileTextOutlined, AlertOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { TabPane } = Tabs;

interface TaxRecord {
  key: string;
  taxType: string;
  period: string;
  dueDate: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue' | 'filed';
  filingDate?: string;
  reference?: string;
}

const sampleTaxData: TaxRecord[] = [
  {
    key: '1',
    taxType: 'Income Tax',
    period: 'Q3 2023',
    dueDate: '2023-12-15',
    amount: 125000,
    status: 'pending',
  },
  {
    key: '2',
    taxType: 'GST',
    period: 'October 2023',
    dueDate: '2023-11-20',
    amount: 45000,
    status: 'paid',
    filingDate: '2023-11-18',
    reference: 'GST2310001',
  },
  {
    key: '3',
    taxType: 'Professional Tax',
    period: 'Q3 2023',
    dueDate: '2023-10-30',
    amount: 2500,
    status: 'overdue',
  },
  {
    key: '4',
    taxType: 'GST',
    period: 'September 2023',
    dueDate: '2023-10-20',
    amount: 42000,
    status: 'filed',
    filingDate: '2023-10-18',
    reference: 'GST2309001',
  },
  {
    key: '5',
    taxType: 'TDS',
    period: 'Q2 2023',
    dueDate: '2023-07-31',
    amount: 35000,
    status: 'filed',
    filingDate: '2023-07-28',
    reference: 'TDS2307001',
  },
];

interface ComplianceRecord {
  key: string;
  name: string;
  dueDate: string;
  status: 'pending' | 'completed' | 'overdue';
  authority: string;
  priority: 'high' | 'medium' | 'low';
}

const sampleComplianceData: ComplianceRecord[] = [
  {
    key: '1',
    name: 'Annual GST Return',
    dueDate: '2023-12-31',
    status: 'pending',
    authority: 'GST Department',
    priority: 'high',
  },
  {
    key: '2',
    name: 'Income Tax Audit',
    dueDate: '2023-09-30',
    status: 'completed',
    authority: 'Income Tax Department',
    priority: 'high',
  },
  {
    key: '3',
    name: 'ESI Registration Renewal',
    dueDate: '2023-11-15',
    status: 'overdue',
    authority: 'ESIC',
    priority: 'medium',
  },
  {
    key: '4',
    name: 'PF Return Filing',
    dueDate: '2023-12-15',
    status: 'pending',
    authority: 'EPFO',
    priority: 'medium',
  },
  {
    key: '5',
    name: 'Professional Tax Registration',
    dueDate: '2024-01-31',
    status: 'pending',
    authority: 'State Tax Department',
    priority: 'low',
  },
];

const TaxTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('taxes');

  // Status filter options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'filed', label: 'Filed' },
    { value: 'overdue', label: 'Overdue' },
  ];

  // Filter tax data based on search text and selected status
  const filteredTaxData = sampleTaxData.filter(record => {
    const matchesSearch = searchText === '' || 
      record.taxType.toLowerCase().includes(searchText.toLowerCase()) ||
      record.period.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(record.status);
    
    return matchesSearch && matchesStatus;
  });

  // Filter compliance data based on search text
  const filteredComplianceData = sampleComplianceData.filter(record => {
    return searchText === '' || 
      record.name.toLowerCase().includes(searchText.toLowerCase()) ||
      record.authority.toLowerCase().includes(searchText.toLowerCase());
  });

  // Calculate summary statistics
  const totalTaxAmount = sampleTaxData.reduce((sum, record) => sum + record.amount, 0);
  const pendingTaxAmount = sampleTaxData
    .filter(record => record.status === 'pending' || record.status === 'overdue')
    .reduce((sum, record) => sum + record.amount, 0);
  
  const totalCompliances = sampleComplianceData.length;
  const completedCompliances = sampleComplianceData.filter(record => record.status === 'completed').length;
  const compliancePercentage = Math.round((completedCompliances / totalCompliances) * 100);

  // Tax Records Table columns
  const taxColumns: ColumnsType<TaxRecord> = [
    {
      title: 'Tax Type',
      dataIndex: 'taxType',
      key: 'taxType',
      sorter: (a, b) => a.taxType.localeCompare(b.taxType),
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
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'Filing Date',
      dataIndex: 'filingDate',
      key: 'filingDate',
      render: (date) => date || '-',
      sorter: (a, b) => {
        if (!a.filingDate) return 1;
        if (!b.filingDate) return -1;
        return new Date(a.filingDate).getTime() - new Date(b.filingDate).getTime();
      },
    },
    {
      title: 'Reference',
      dataIndex: 'reference',
      key: 'reference',
      render: (ref) => ref || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'paid' || status === 'filed') color = 'green';
        if (status === 'overdue') color = 'red';
        if (status === 'pending') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          {(record.status === 'pending' || record.status === 'overdue') && 
            <Button type="link" size="small">Pay</Button>
          }
          {record.status === 'paid' && 
            <Button type="link" size="small">File</Button>
          }
          {record.status === 'filed' && 
            <Button type="link" size="small">Download</Button>
          }
        </Space>
      ),
    },
  ];

  // Compliance Records Table columns
  const complianceColumns: ColumnsType<ComplianceRecord> = [
    {
      title: 'Compliance Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Authority',
      dataIndex: 'authority',
      key: 'authority',
      sorter: (a, b) => a.authority.localeCompare(b.authority),
    },
    {
      title: 'Due Date',
      dataIndex: 'dueDate',
      key: 'dueDate',
      sorter: (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime(),
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      key: 'priority',
      render: (priority) => {
        let color = 'green';
        if (priority === 'medium') color = 'orange';
        if (priority === 'high') color = 'red';
        return <Tag color={color}>{priority.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => {
        const priorityOrder = { high: 3, medium: 2, low: 1 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'completed') color = 'green';
        if (status === 'overdue') color = 'red';
        if (status === 'pending') color = 'orange';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
      sorter: (a, b) => a.status.localeCompare(b.status),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">View</Button>
          {record.status !== 'completed' && 
            <Button type="link" size="small">Mark Complete</Button>
          }
          <Button type="link" size="small">Documents</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="tax-tab-container">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: '#e6f7ff', 
                color: '#1890ff', 
                borderRadius: '50%', 
                width: 40, 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 16
              }}>
                <CalendarOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <Text type="secondary">Upcoming Tax Due</Text>
                <Title level={4} style={{ margin: 0 }}>₹{pendingTaxAmount.toLocaleString('en-IN')}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: '#f6ffed', 
                color: '#52c41a', 
                borderRadius: '50%', 
                width: 40, 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 16
              }}>
                <FileTextOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <Text type="secondary">Total Tax Paid</Text>
                <Title level={4} style={{ margin: 0 }}>₹{totalTaxAmount.toLocaleString('en-IN')}</Title>
              </div>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{ 
                backgroundColor: '#fff7e6', 
                color: '#fa8c16', 
                borderRadius: '50%', 
                width: 40, 
                height: 40, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                marginRight: 16
              }}>
                <AlertOutlined style={{ fontSize: 20 }} />
              </div>
              <div>
                <Text type="secondary">Compliance Status</Text>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Progress 
                    percent={compliancePercentage} 
                    size="small" 
                    style={{ width: 100, marginRight: 8 }} 
                    strokeColor={compliancePercentage < 50 ? '#ff4d4f' : '#52c41a'}
                  />
                  <Text>{completedCompliances}/{totalCompliances}</Text>
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Tabs for Taxes and Compliance */}
      <Card style={{ marginTop: 16 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Taxes & Filings" key="taxes">
            {/* Filters and Actions for Tax Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search by tax type or period" 
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
                <Button type="primary" icon={<PlusOutlined />}>Add Tax Entry</Button>
              </Space>
            </div>

            {/* Tax Records Table */}
            <Table 
              columns={taxColumns} 
              dataSource={filteredTaxData} 
              rowKey="key"
              pagination={{ pageSize: 10 }}
              scroll={{ x: 'max-content' }}
            />
          </TabPane>
          
          <TabPane tab="Compliance" key="compliance">
            {/* Filters and Actions for Compliance Tab */}
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
              <Space size="middle" wrap>
                <Input 
                  placeholder="Search by name or authority" 
                  prefix={<SearchOutlined />} 
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ width: 250 }}
                />
                <RangePicker />
              </Space>
              <Space size="middle" wrap>
                <Button icon={<DownloadOutlined />}>Export</Button>
                <Button type="primary" icon={<PlusOutlined />}>Add Compliance</Button>
              </Space>
            </div>

            {/* Compliance Records Table */}
            <Table 
              columns={complianceColumns} 
              dataSource={filteredComplianceData} 
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

export default TaxTab;