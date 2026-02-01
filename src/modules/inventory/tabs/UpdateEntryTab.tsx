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

interface UpdateEntry {
  id: string;
  date: string;
  entryType: string;
  itemCode: string;
  itemName: string;
  previousValue: string;
  newValue: string;
  updatedBy: string;
  status: 'completed' | 'pending' | 'failed';
  remarks: string;
}

const UpdateEntryTab: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  // Sample data - replace with actual data from your backend
  const data: UpdateEntry[] = [
    {
      id: 'UE001',
      date: '2024-03-15',
      entryType: 'Stock Update',
      itemCode: 'ITM001',
      itemName: 'Cotton Fabric',
      previousValue: '1000 meters',
      newValue: '1200 meters',
      updatedBy: 'John Doe',
      status: 'completed',
      remarks: 'Stock adjustment completed'
    },
    {
      id: 'UE002',
      date: '2024-03-15',
      entryType: 'Price Update',
      itemCode: 'ITM002',
      itemName: 'Polyester Fabric',
      previousValue: '₹100/meter',
      newValue: '₹120/meter',
      updatedBy: 'Jane Smith',
      status: 'pending',
      remarks: 'Awaiting approval'
    },
    {
      id: 'UE003',
      date: '2024-03-14',
      entryType: 'Location Update',
      itemCode: 'ITM003',
      itemName: 'Silk Fabric',
      previousValue: 'Warehouse A',
      newValue: 'Warehouse B',
      updatedBy: 'Mike Johnson',
      status: 'failed',
      remarks: 'Invalid location code'
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
      title: 'Entry Type',
      dataIndex: 'entryType',
      key: 'entryType',
    },
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: 'Previous Value',
      dataIndex: 'previousValue',
      key: 'previousValue',
    },
    {
      title: 'New Value',
      dataIndex: 'newValue',
      key: 'newValue',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusConfig = {
          completed: { color: 'success', icon: <CheckCircleOutlined />, text: 'Completed' },
          pending: { color: 'warning', icon: <ClockCircleOutlined />, text: 'Pending' },
          failed: { color: 'error', icon: <ClockCircleOutlined />, text: 'Failed' }
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
      title: 'Updated By',
      dataIndex: 'updatedBy',
      key: 'updatedBy',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: UpdateEntry) => (
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
    <div className="update-entry-tab">
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
                  <Select.Option value="pending">Pending</Select.Option>
                  <Select.Option value="failed">Failed</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Form.Item name="entryType" label="Entry Type">
                <Select
                  placeholder="Select type"
                  allowClear
                >
                  <Select.Option value="Stock Update">Stock Update</Select.Option>
                  <Select.Option value="Price Update">Price Update</Select.Option>
                  <Select.Option value="Location Update">Location Update</Select.Option>
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
              New Update Entry
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

export default UpdateEntryTab; 