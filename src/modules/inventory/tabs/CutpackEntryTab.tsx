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
  InputNumber,
  Tag
} from 'antd';
import { 
  SearchOutlined, 
  PlusOutlined, 
  ExportOutlined, 
  FilterOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface CutpackEntry {
  id: string;
  date: string;
  styleNumber: string;
  styleName: string;
  size: string;
  color: string;
  quantity: number;
  status: 'completed' | 'in-progress' | 'pending';
  operator: string;
  remarks: string;
}

const CutpackEntryTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: CutpackEntry[] = [
    {
      id: 'CP001',
      date: '2024-03-15',
      styleNumber: 'STYLE001',
      styleName: 'Summer Collection',
      size: 'M',
      color: 'Blue',
      quantity: 100,
      status: 'completed',
      operator: 'John Doe',
      remarks: 'Cutpack completed'
    },
    {
      id: 'CP002',
      date: '2024-03-15',
      styleNumber: 'STYLE002',
      styleName: 'Winter Collection',
      size: 'L',
      color: 'Black',
      quantity: 50,
      status: 'in-progress',
      operator: 'Jane Smith',
      remarks: 'In progress'
    },
    {
      id: 'CP003',
      date: '2024-03-14',
      styleNumber: 'STYLE003',
      styleName: 'Casual Wear',
      size: 'S',
      color: 'Red',
      quantity: 75,
      status: 'pending',
      operator: 'Mike Johnson',
      remarks: 'Awaiting processing'
    }
  ];

  const columns = [
    {
      title: 'Entry ID',
      dataIndex: 'id',
      key: 'id',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Style Number',
      dataIndex: 'styleNumber',
      key: 'styleNumber',
    },
    {
      title: 'Style Name',
      dataIndex: 'styleName',
      key: 'styleName',
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
          'in-progress': { color: 'processing', icon: <ClockCircleOutlined />, text: 'In Progress' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' }
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
      title: 'Operator',
      dataIndex: 'operator',
      key: 'operator',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: CutpackEntry) => (
        <Space>
          <Button type="link" size="small" icon={<FileTextOutlined />}>View</Button>
          <Button type="link" size="small">Edit</Button>
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
    <div className="cutpack-entry-tab">
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
                  placeholder="Search entries..." 
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
                  <Select.Option value="completed">Completed</Select.Option>
                  <Select.Option value="in-progress">In Progress</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="style" label="Style">
                <Select
                  placeholder="Select style"
                  allowClear
                >
                  <Select.Option value="STYLE001">Summer Collection</Select.Option>
                  <Select.Option value="STYLE002">Winter Collection</Select.Option>
                  <Select.Option value="STYLE003">Casual Wear</Select.Option>
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
              New Cutpack Entry
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

export default CutpackEntryTab; 