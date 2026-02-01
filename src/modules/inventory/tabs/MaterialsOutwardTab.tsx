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
  UploadOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface MaterialsOutwardEntry {
  id: string;
  date: string;
  materialCode: string;
  materialName: string;
  department: string;
  quantity: number;
  unit: string;
  issuedBy: string;
  status: 'issued' | 'pending' | 'partial';
  remarks: string;
}

const MaterialsOutwardTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: MaterialsOutwardEntry[] = [
    {
      id: 'FO001',
      date: '2024-03-15',
      materialCode: 'MAT001',
      materialName: 'Cotton Material',
      department: 'Cutting',
      quantity: 500,
      unit: 'Meters',
      issuedBy: 'John Doe',
      status: 'issued',
      remarks: 'Complete issue'
    },
    {
      id: 'FO002',
      date: '2024-03-15',
      materialCode: 'MAT002',
      materialName: 'Polyester Material',
      department: 'Sewing',
      quantity: 300,
      unit: 'Meters',
      issuedBy: 'Jane Smith',
      status: 'partial',
      remarks: 'Partial issue - 200m pending'
    },
    {
      id: 'FO003',
      date: '2024-03-14',
      materialCode: 'MAT003',
      materialName: 'Silk Material',
      department: 'Finishing',
      quantity: 100,
      unit: 'Meters',
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
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: true,
      render: (quantity: number, record: MaterialsOutwardEntry) => (
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
      render: (_: any, record: MaterialsOutwardEntry) => (
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
    <div className="materials-outward-tab p-6">
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
              <Form.Item name="department" label="Department">
                <Select
                  placeholder="Select department"
                  allowClear
                >
                  <Select.Option value="Cutting">Cutting</Select.Option>
                  <Select.Option value="Sewing">Sewing</Select.Option>
                  <Select.Option value="Finishing">Finishing</Select.Option>
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
              New Materials Outward
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

export default MaterialsOutwardTab;