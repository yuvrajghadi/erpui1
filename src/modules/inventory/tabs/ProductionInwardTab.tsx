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
  ClockCircleOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface ProductionInwardEntry {
  id: string;
  date: string;
  productionCode: string;
  productionName: string;
  supplier: string;
  quantity: number;
  unit: string;
  receivedBy: string;
  status: 'received' | 'pending' | 'partial';
  remarks: string;
}

const ProductionInwardTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: ProductionInwardEntry[] = [
    {
      id: 'PI001',
      date: '2024-03-15',
      productionCode: 'PRD001',
      productionName: 'Dyeing Production',
      supplier: 'ABC Dyeing',
      quantity: 1000,
      unit: 'KG',
      receivedBy: 'John Doe',
      status: 'received',
      remarks: 'Complete delivery'
    },
    {
      id: 'PI002',
      date: '2024-03-15',
      productionCode: 'PRD002',
      productionName: 'Printing Production',
      supplier: 'XYZ Printing',
      quantity: 500,
      unit: 'Meters',
      receivedBy: 'Jane Smith',
      status: 'partial',
      remarks: 'Partial delivery - 200m pending'
    },
    {
      id: 'PI003',
      date: '2024-03-14',
      productionCode: 'PRD003',
      productionName: 'Washing Production',
      supplier: 'Clean Textiles',
      quantity: 800,
      unit: 'KG',
      receivedBy: 'Mike Johnson',
      status: 'pending',
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
      title: 'Production Code',
      dataIndex: 'productionCode',
      key: 'productionCode',
    },
    {
      title: 'Production Name',
      dataIndex: 'productionName',
      key: 'productionName',
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
      render: (quantity: number, record: ProductionInwardEntry) => (
        `${quantity} ${record.unit}`
      ),
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
      render: (_: any, record: ProductionInwardEntry) => (
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
    <div className="production-inward-tab p-6">
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
                  <Select.Option value="ABC Dyeing">ABC Dyeing</Select.Option>
                  <Select.Option value="XYZ Printing">XYZ Printing</Select.Option>
                  <Select.Option value="Clean Textiles">Clean Textiles</Select.Option>
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
              New Production Inward
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

export default ProductionInwardTab;