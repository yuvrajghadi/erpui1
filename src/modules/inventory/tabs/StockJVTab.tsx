import React, { useState } from 'react';
import { 
  Card, 
  Table, 
  Button, 
  Space, 
  Input, 
  DatePicker, 
  Form, 
  Row, 
  Col,
  Select,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ExportOutlined, 
  FilterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  EditOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface StockJVEntry {
  id: string;
  date: string;
  jvNo: string;
  type: string;
  description: string;
  items: number;
  totalAmount: number;
  status: 'posted' | 'pending' | 'cancelled';
  createdBy: string;
  remarks: string;
}

const StockJVTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: StockJVEntry[] = [
    {
      id: 'JV001',
      date: '2024-03-15',
      jvNo: 'JV001',
      type: 'Stock Adjustment',
      description: 'Year-end stock adjustment',
      items: 5,
      totalAmount: 50000,
      status: 'posted',
      createdBy: 'John Doe',
      remarks: 'Posted successfully'
    },
    {
      id: 'JV002',
      date: '2024-03-15',
      jvNo: 'JV002',
      type: 'Stock Transfer',
      description: 'Inter-warehouse transfer',
      items: 3,
      totalAmount: 30000,
      status: 'pending',
      createdBy: 'Jane Smith',
      remarks: 'Awaiting approval'
    },
    {
      id: 'JV003',
      date: '2024-03-14',
      jvNo: 'JV003',
      type: 'Stock Write-off',
      description: 'Damaged goods write-off',
      items: 2,
      totalAmount: 20000,
      status: 'cancelled',
      createdBy: 'Mike Johnson',
      remarks: 'Cancelled due to incorrect data'
    }
  ];

  const columns = [
    {
      title: 'JV No.',
      dataIndex: 'jvNo',
      key: 'jvNo',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      sorter: true,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      sorter: true,
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          posted: { color: 'success', icon: <CheckCircleOutlined />, text: 'Posted' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          cancelled: { color: 'error', icon: <ClockCircleOutlined />, text: 'Cancelled' }
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return (
          <Tag color={config.color} icon={config.icon}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: StockJVEntry) => (
        <Space>
          <Button type="link" size="small" icon={<FileTextOutlined />}>View</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>Edit</Button>
          <Button type="link" danger size="small">Delete</Button>
        </Space>
      ),
    },
  ];

  const handleSearch = (values: any) => {
    console.log('Search values:', values);
    // Implement search logic here
  };

  return (
    <div className="stock-jv-tab">
      <Card>
        {/* Search and Filter Section */}
        <Form
          form={form}
          onFinish={handleSearch}
          layout="vertical"
          className="search-form"
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="search" label="Search">
                <Input 
                  placeholder="Search JVs..." 
                  prefix={<SearchOutlined />} 
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="dateRange" label="Date Range">
                <RangePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="status" label="Status">
                <Select
                  placeholder="Select status"
                  allowClear
                >
                  <Select.Option value="posted">Posted</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="cancelled">Cancelled</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="type" label="Type">
                <Select
                  placeholder="Select type"
                  allowClear
                >
                  <Select.Option value="Stock Adjustment">Stock Adjustment</Select.Option>
                  <Select.Option value="Stock Transfer">Stock Transfer</Select.Option>
                  <Select.Option value="Stock Write-off">Stock Write-off</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item label=" " colon={false}>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>
                    Search
                  </Button>
                  <Button icon={<FilterOutlined />}>
                    More Filters
                  </Button>
                </Space>
              </Form.Item>
            </Col>
          </Row>
        </Form>

        {/* Action Buttons */}
        <div className="action-buttons" style={{ marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />}>
              New Stock JV
            </Button>
            <Button icon={<ExportOutlined />}>
              Export
            </Button>
          </Space>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            total: data.length,
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Total ${total} items`
          }}
        />
      </Card>
    </div>
  );
};

export default StockJVTab; 