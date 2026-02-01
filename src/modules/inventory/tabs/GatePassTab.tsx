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
  PrinterOutlined
} from '@ant-design/icons';

const { RangePicker } = DatePicker;

interface GatePassEntry {
  id: string;
  date: string;
  gatePassNo: string;
  purpose: string;
  items: number;
  vehicleNo: string;
  status: 'approved' | 'pending' | 'rejected';
  issuedBy: string;
  remarks: string;
}

const GatePassTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: GatePassEntry[] = [
    {
      id: 'GP001',
      date: '2024-03-15',
      gatePassNo: 'GP001',
      purpose: 'Material Delivery',
      items: 5,
      vehicleNo: 'MH01AB1234',
      status: 'approved',
      issuedBy: 'John Doe',
      remarks: 'Approved for delivery'
    },
    {
      id: 'GP002',
      date: '2024-03-15',
      gatePassNo: 'GP002',
      purpose: 'Sample Collection',
      items: 2,
      vehicleNo: 'MH02CD5678',
      status: 'pending',
      issuedBy: 'Jane Smith',
      remarks: 'Awaiting approval'
    },
    {
      id: 'GP003',
      date: '2024-03-14',
      gatePassNo: 'GP003',
      purpose: 'Equipment Return',
      items: 3,
      vehicleNo: 'MH03EF9012',
      status: 'rejected',
      issuedBy: 'Mike Johnson',
      remarks: 'Incomplete documentation'
    }
  ];

  const columns = [
    {
      title: 'Gate Pass No.',
      dataIndex: 'gatePassNo',
      key: 'gatePassNo',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Purpose',
      dataIndex: 'purpose',
      key: 'purpose',
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'items',
      sorter: true,
    },
    {
      title: 'Vehicle No.',
      dataIndex: 'vehicleNo',
      key: 'vehicleNo',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          approved: { color: 'success', icon: <CheckCircleOutlined />, text: 'Approved' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          rejected: { color: 'error', icon: <ClockCircleOutlined />, text: 'Rejected' }
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
      render: (_: any, record: GatePassEntry) => (
        <Space>
          <Button type="link" size="small" icon={<FileTextOutlined />}>View</Button>
          <Button type="link" size="small" icon={<PrinterOutlined />}>Print</Button>
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
    <div className="gate-pass-tab">
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
                  placeholder="Search gate passes..." 
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
                  <Select.Option value="approved">Approved</Select.Option>
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="rejected">Rejected</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="purpose" label="Purpose">
                <Select
                  placeholder="Select purpose"
                  allowClear
                >
                  <Select.Option value="Material Delivery">Material Delivery</Select.Option>
                  <Select.Option value="Sample Collection">Sample Collection</Select.Option>
                  <Select.Option value="Equipment Return">Equipment Return</Select.Option>
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
              New Gate Pass
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

export default GatePassTab; 