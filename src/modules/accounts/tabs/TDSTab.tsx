import React, { useState } from 'react';
import { Row, Col, Card, Table, Button, Input, Space, DatePicker, Select, Tag, Typography } from 'antd';
import { SearchOutlined, FilterOutlined, DownloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

interface TDSRecord {
  key: string;
  deducteeType: string;
  deducteeName: string;
  section: string;
  amount: number;
  tdsRate: number;
  tdsAmount: number;
  dateDeducted: string;
  challanNo?: string;
  status: 'pending' | 'paid' | 'overdue';
}

const sampleData: TDSRecord[] = [
  {
    key: '1',
    deducteeType: 'Vendor',
    deducteeName: 'ABC Suppliers Ltd.',
    section: '194C',
    amount: 50000,
    tdsRate: 2,
    tdsAmount: 1000,
    dateDeducted: '2023-10-15',
    challanNo: 'CH12345678',
    status: 'paid',
  },
  {
    key: '2',
    deducteeType: 'Contractor',
    deducteeName: 'XYZ Construction Co.',
    section: '194C',
    amount: 75000,
    tdsRate: 2,
    tdsAmount: 1500,
    dateDeducted: '2023-11-05',
    challanNo: 'CH23456789',
    status: 'paid',
  },
  {
    key: '3',
    deducteeType: 'Professional',
    deducteeName: 'Dr. Smith Consultancy',
    section: '194J',
    amount: 30000,
    tdsRate: 10,
    tdsAmount: 3000,
    dateDeducted: '2023-11-20',
    status: 'pending',
  },
  {
    key: '4',
    deducteeType: 'Rent',
    deducteeName: 'Premium Properties',
    section: '194I',
    amount: 40000,
    tdsRate: 10,
    tdsAmount: 4000,
    dateDeducted: '2023-10-30',
    status: 'overdue',
  },
  {
    key: '5',
    deducteeType: 'Commission',
    deducteeName: 'Global Marketing Agency',
    section: '194H',
    amount: 25000,
    tdsRate: 5,
    tdsAmount: 1250,
    dateDeducted: '2023-11-15',
    status: 'pending',
  },
];

const TDSTab: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string[]>([]);

  // Status filter options
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'overdue', label: 'Overdue' },
  ];

  // Filter data based on search text and selected status
  const filteredData = sampleData.filter(record => {
    const matchesSearch = searchText === '' || 
      record.deducteeName.toLowerCase().includes(searchText.toLowerCase()) ||
      record.section.toLowerCase().includes(searchText.toLowerCase());
    
    const matchesStatus = selectedStatus.length === 0 || 
      selectedStatus.includes(record.status);
    
    return matchesSearch && matchesStatus;
  });

  // Calculate summary statistics
  const totalTDS = filteredData.reduce((sum, record) => sum + record.tdsAmount, 0);
  const pendingTDS = filteredData
    .filter(record => record.status === 'pending' || record.status === 'overdue')
    .reduce((sum, record) => sum + record.tdsAmount, 0);
  const paidTDS = filteredData
    .filter(record => record.status === 'paid')
    .reduce((sum, record) => sum + record.tdsAmount, 0);

  // Table columns
  const columns: ColumnsType<TDSRecord> = [
    {
      title: 'Deductee Type',
      dataIndex: 'deducteeType',
      key: 'deducteeType',
      sorter: (a, b) => a.deducteeType.localeCompare(b.deducteeType),
    },
    {
      title: 'Deductee Name',
      dataIndex: 'deducteeName',
      key: 'deducteeName',
      sorter: (a, b) => a.deducteeName.localeCompare(b.deducteeName),
    },
    {
      title: 'Section',
      dataIndex: 'section',
      key: 'section',
      sorter: (a, b) => a.section.localeCompare(b.section),
    },
    {
      title: 'Amount (₹)',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.amount - b.amount,
    },
    {
      title: 'TDS Rate (%)',
      dataIndex: 'tdsRate',
      key: 'tdsRate',
      render: (rate) => `${rate}%`,
      sorter: (a, b) => a.tdsRate - b.tdsRate,
    },
    {
      title: 'TDS Amount (₹)',
      dataIndex: 'tdsAmount',
      key: 'tdsAmount',
      render: (amount) => amount.toLocaleString('en-IN'),
      sorter: (a, b) => a.tdsAmount - b.tdsAmount,
    },
    {
      title: 'Date Deducted',
      dataIndex: 'dateDeducted',
      key: 'dateDeducted',
      sorter: (a, b) => new Date(a.dateDeducted).getTime() - new Date(b.dateDeducted).getTime(),
    },
    {
      title: 'Challan No.',
      dataIndex: 'challanNo',
      key: 'challanNo',
      render: (challanNo) => challanNo || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = 'blue';
        if (status === 'paid') color = 'green';
        if (status === 'overdue') color = 'red';
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
          {record.status === 'pending' && <Button type="link" size="small">Pay</Button>}
          {record.status === 'paid' && <Button type="link" size="small">Certificate</Button>}
        </Space>
      ),
    },
  ];

  return (
    <div className="tds-tab-container">
      {/* Summary Cards */}
      <Row gutter={[16, 16]} className="summary-cards">
        <Col xs={24} sm={8}>
          <Card>
            <Title level={5}>Total TDS</Title>
            <Title level={3}>₹{totalTDS.toLocaleString('en-IN')}</Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={5}>Pending TDS</Title>
            <Title level={3} style={{ color: pendingTDS > 0 ? '#faad14' : '#52c41a' }}>
              ₹{pendingTDS.toLocaleString('en-IN')}
            </Title>
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Title level={5}>Paid TDS</Title>
            <Title level={3} style={{ color: '#52c41a' }}>₹{paidTDS.toLocaleString('en-IN')}</Title>
          </Card>
        </Col>
      </Row>

      {/* Filters and Actions */}
      <Card className="tds-table-card" style={{ marginTop: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <Space size="middle" wrap>
            <Input 
              placeholder="Search by name or section" 
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
            <Button type="primary" icon={<PlusOutlined />}>Add TDS Entry</Button>
          </Space>
        </div>

        {/* TDS Records Table */}
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="key"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
        />
      </Card>
    </div>
  );
};

export default TDSTab;