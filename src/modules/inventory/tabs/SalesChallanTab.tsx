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

interface SalesChallanEntry {
  id: string;
  date: string;
  challanNo: string;
  customer: string;
  items: number;
  totalAmount: number;
  status: 'delivered' | 'pending' | 'partial';
  preparedBy: string;
  remarks: string;
}

const SalesChallanTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: SalesChallanEntry[] = [
    {
      id: 'SC001',
      date: '2024-03-15',
      challanNo: 'CHL001',
      customer: 'Fashion House',
      items: 5,
      totalAmount: 25000,
      status: 'delivered',
      preparedBy: 'John Doe',
      remarks: 'Complete delivery'
    },
    {
      id: 'SC002',
      date: '2024-03-15',
      challanNo: 'CHL002',
      customer: 'Textile Co.',
      items: 3,
      totalAmount: 15000,
      status: 'partial',
      preparedBy: 'Jane Smith',
      remarks: 'Partial delivery - 2 items pending'
    },
    {
      id: 'SC003',
      date: '2024-03-14',
      challanNo: 'CHL003',
      customer: 'Garment Factory',
      items: 4,
      totalAmount: 20000,
      status: 'pending',
      preparedBy: 'Mike Johnson',
      remarks: 'Awaiting delivery'
    }
  ];

  const columns = [
    {
      title: 'Challan No.',
      dataIndex: 'challanNo',
      key: 'challanNo',
      sorter: true,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      sorter: true,
    },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
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
          delivered: { color: 'success', icon: <CheckCircleOutlined />, text: 'Delivered' },
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
      title: 'Prepared By',
      dataIndex: 'preparedBy',
      key: 'preparedBy',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: SalesChallanEntry) => (
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
    <div className="sales-challan-tab">
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
                  placeholder="Search challans..." 
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
                  <Select.Option value="delivered">Delivered</Select.Option>
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
            <Button type="primary" icon={<PlusOutlined />}>
              New Sales Challan
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

export default SalesChallanTab; 