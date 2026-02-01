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

interface ProductionOutwardEntry {
  id: string;
  date: string;
  productionCode: string;
  productionName: string;
  customer: string;
  quantity: number;
  unit: string;
  issuedBy: string;
  status: 'issued' | 'pending' | 'partial';
  remarks: string;
}

const ProductionOutwardTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: ProductionOutwardEntry[] = [
    {
      id: 'PO001',
      date: '2024-03-15',
      productionCode: 'PRD001',
      productionName: 'Dyeing Production',
      customer: 'Fashion House',
      quantity: 800,
      unit: 'KG',
      issuedBy: 'John Doe',
      status: 'issued',
      remarks: 'Complete issue'
    },
    {
      id: 'PO002',
      date: '2024-03-15',
      productionCode: 'PRD002',
      productionName: 'Printing Production',
      customer: 'Textile Co.',
      quantity: 400,
      unit: 'Meters',
      issuedBy: 'Jane Smith',
      status: 'partial',
      remarks: 'Partial issue - 100m pending'
    },
    {
      id: 'PO003',
      date: '2024-03-14',
      productionCode: 'PRD003',
      productionName: 'Washing Production',
      customer: 'Garment Factory',
      quantity: 600,
      unit: 'KG',
      issuedBy: 'Mike Johnson',
      status: 'pending',
      remarks: 'Awaiting issue'
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
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true,
      render: (quantity: number, record: ProductionOutwardEntry) => (
        `${quantity} ${record.unit}`
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          issued: { color: 'success', icon: <CheckCircleOutlined />, text: 'Issued' },
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
      title: 'Issued By',
      dataIndex: 'issuedBy',
      key: 'issuedBy',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: ProductionOutwardEntry) => (
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
    <div className="production-outward-tab p-6">
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
                  <Select.Option value="issued">Issued</Select.Option>
                  <Select.Option value="partial">Partial</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="customer" label="Customer">
                <Select
                  placeholder="Select customer"
                  allowClear
                >
                  <Select.Option value="Fashion House">Fashion House</Select.Option>
                  <Select.Option value="Textile Co.">Textile Co.</Select.Option>
                  <Select.Option value="Garment Factory">Garment Factory</Select.Option>
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
              New Production Outward
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

export default ProductionOutwardTab;