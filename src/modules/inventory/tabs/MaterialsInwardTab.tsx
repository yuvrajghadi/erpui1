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
  ClockCircleOutlined,
  InboxOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface MaterialsInwardEntry {
  id: string;
  date: string;
  materialCode: string;
  materialName: string;
  supplier: string;
  quantity: number;
  unit: string;
  rate: number;
  amount: number;
  status: 'received' | 'pending' | 'partial';
  receivedBy: string;
  remarks: string;
}

const MaterialsInwardTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: MaterialsInwardEntry[] = [
    {
      id: 'FI001',
      date: '2024-03-15',
      materialCode: 'MAT001',
      materialName: 'Cotton Material',
      supplier: 'ABC Textiles',
      quantity: 1000,
      unit: 'Meters',
      rate: 5.50,
      amount: 5500,
      status: 'received',
      receivedBy: 'John Doe',
      remarks: 'Complete delivery received'
    },
    {
      id: 'FI002',
      date: '2024-03-15',
      materialCode: 'MAT002',
      materialName: 'Polyester Material',
      supplier: 'XYZ Fabrics',
      quantity: 500,
      unit: 'Meters',
      rate: 4.75,
      amount: 2375,
      status: 'partial',
      receivedBy: 'Jane Smith',
      remarks: 'Partial delivery - 300m pending'
    },
    {
      id: 'FI003',
      date: '2024-03-14',
      materialCode: 'MAT003',
      materialName: 'Silk Material',
      supplier: 'Premium Textiles',
      quantity: 200,
      unit: 'Meters',
      rate: 12.00,
      amount: 2400,
      status: 'pending',
      receivedBy: 'Mike Johnson',
      remarks: 'Awaiting delivery'
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
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true,
      render: (quantity: number, record: MaterialsInwardEntry) => (
        `${quantity} ${record.unit}`
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      render: (rate: number) => `$${rate.toFixed(2)}`,
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      sorter: true,
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          received: { color: 'success', icon: <CheckCircleOutlined />, text: 'Received' },
          partial: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Partial' },
          pending: { color: 'error', icon: <ClockCircleOutlined />, text: 'Pending' }
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
      title: 'Received By',
      dataIndex: 'receivedBy',
      key: 'receivedBy',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: MaterialsInwardEntry) => (
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
    <div className="materials-inward-tab p-6">
      <Card className="shadow-md rounded-lg overflow-hidden">
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
                  <Select.Option value="received">Received</Select.Option>
                  <Select.Option value="partial">Partial</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="supplier" label="Supplier">
                <Select
                  placeholder="Select supplier"
                  allowClear
                >
                  <Select.Option value="ABC Textiles">ABC Textiles</Select.Option>
                  <Select.Option value="XYZ Fabrics">XYZ Fabrics</Select.Option>
                  <Select.Option value="Premium Textiles">Premium Textiles</Select.Option>
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
            <Button type="primary" icon={<PlusOutlined />} className="bg-blue-600 hover:bg-blue-700">
              New Materials Inward
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

export default MaterialsInwardTab;