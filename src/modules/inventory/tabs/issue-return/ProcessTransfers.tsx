/**
 * Process Transfers Screen
 * Transfer materials between production processes
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Form,
  Row,
  Col,
  Select,
  Drawer,
  Tag,
  message,
  InputNumber,
  DatePicker,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import wipStore from '../../store/wipStore';

const { TextArea } = Input;

interface ProcessTransfer {
  id: string;
  transferNo: string;
  transferDate: Date;
  style: string;
  fromProcess: 'cutting' | 'stitching' | 'washing' | 'finishing';
  toProcess: 'cutting' | 'stitching' | 'washing' | 'finishing' | 'packing';
  quantity: number;
  uom: string;
  remarks?: string;
  transferredBy: string;
  status: 'pending' | 'in_transit' | 'received' | 'rejected';
}

const SAMPLE_TRANSFERS: ProcessTransfer[] = [
  {
    id: '1',
    transferNo: 'PT-2025-001',
    transferDate: new Date('2025-01-04'),
    style: 'STY-001 - Classic Polo',
    fromProcess: 'cutting',
    toProcess: 'stitching',
    quantity: 500,
    uom: 'piece',
    remarks: 'All pieces inspected and approved',
    transferredBy: 'Ramesh Kumar',
    status: 'received',
  },
  {
    id: '2',
    transferNo: 'PT-2025-002',
    transferDate: new Date('2025-01-03'),
    style: 'STY-002 - Denim Jeans',
    fromProcess: 'stitching',
    toProcess: 'washing',
    quantity: 300,
    uom: 'piece',
    remarks: 'Transfer for washing process',
    transferredBy: 'Suresh Patel',
    status: 'in_transit',
  },
  {
    id: '3',
    transferNo: 'PT-2025-003',
    transferDate: new Date('2025-01-02'),
    style: 'STY-003 - T-Shirt',
    fromProcess: 'washing',
    toProcess: 'finishing',
    quantity: 450,
    uom: 'piece',
    remarks: 'Post-wash transfer',
    transferredBy: 'Anil Sharma',
    status: 'received',
  },
  {
    id: '4',
    transferNo: 'PT-2025-004',
    transferDate: new Date('2025-01-04'),
    style: 'STY-004 - Cargo Pants',
    fromProcess: 'finishing',
    toProcess: 'packing',
    quantity: 200,
    uom: 'piece',
    remarks: 'Ready for final packing',
    transferredBy: 'Vijay Kumar',
    status: 'pending',
  },
];

const ProcessTransfersScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ProcessTransfer[]>(SAMPLE_TRANSFERS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProcessTransfer | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFromProcess, setSelectedFromProcess] = useState<string | undefined>();

  const columns = [
    {
      title: 'Transfer No',
      dataIndex: 'transferNo',
      key: 'transferNo',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      width: 180,
      render: (style: string) => <Tag color="blue">{style}</Tag>,
    },
    {
      title: 'From Process',
      dataIndex: 'fromProcess',
      key: 'fromProcess',
      width: 130,
      render: (process: string) => (
        <Tag color="purple">{process.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'To Process',
      dataIndex: 'toProcess',
      key: 'toProcess',
      width: 130,
      render: (process: string) => (
        <Tag color="green">{process.toUpperCase()}</Tag>
      ),
    },
    {
      title: 'Qty',
      key: 'quantity',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: ProcessTransfer) => (
        <span>{record.quantity} {record.uom}</span>
      ),
    },
    {
      title: 'Date',
      dataIndex: 'transferDate',
      key: 'transferDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          pending: 'default',
          in_transit: 'processing',
          received: 'success',
          rejected: 'error',
        };
        return <Tag color={colorMap[status]}>{status.replace('_', ' ').toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Transferred By',
      dataIndex: 'transferredBy',
      key: 'transferredBy',
      width: 150,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: ProcessTransfer) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={record.status === 'received'}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="text"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id)}
              disabled={record.status === 'received'}
            />
          </Tooltip>
          <Tooltip title="Validate & Move">
            <Button
              type="text"
              size="small"
              onClick={() => {
                // Validate against WIP balance (mock)
                const styleCode = record.style.split(' - ')[0];
                const lots = wipStore.listWipLots();
                const found = lots.find(l => l.styleId === styleCode);
                const available = found ? Object.values(found.balances).reduce((s, v) => s + v, 0) : 0;
                if (record.quantity > available) {
                  message.error('Transfer quantity exceeds available WIP balance');
                  return;
                }
                // Move lifecycle
                if (record.status === 'pending') {
                  record.status = 'in_transit';
                  message.success('Transfer marked In Transit (mock)');
                } else if (record.status === 'in_transit') {
                  record.status = 'received';
                  message.success('Transfer marked Received (mock)');
                }
                setData([...data]);
              }}
            >Move</Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  const getNextProcessOptions = (fromProcess: string | undefined) => {
    const processFlow: Record<string, string[]> = {
      cutting: ['stitching'],
      stitching: ['washing', 'finishing'],
      washing: ['finishing'],
      finishing: ['packing'],
    };
    return processFlow[fromProcess || ''] || [];
  };

  const handleAdd = () => {
    form.resetFields();
    setEditingRecord(null);
    setSelectedFromProcess(undefined);
    setDrawerVisible(true);
  };

  const handleEdit = (record: ProcessTransfer) => {
    setEditingRecord(record);
    setSelectedFromProcess(record.fromProcess);
    form.setFieldsValue({
      ...record,
      transferDate: dayjs(record.transferDate),
    });
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    setData(data.filter(item => item.id !== id));
    message.success('Transfer deleted successfully');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const transferData = {
        ...values,
        transferDate: values.transferDate.toDate(),
      };

      if (editingRecord) {
        setData(data.map(item => 
          item.id === editingRecord.id 
            ? { ...item, ...transferData }
            : item
        ));
        message.success('Transfer updated successfully');
      } else {
        const newTransfer: ProcessTransfer = {
          id: `${data.length + 1}`,
          transferNo: `PT-2025-${String(data.length + 1).padStart(3, '0')}`,
          ...transferData,
          transferredBy: 'Current User',
          status: 'pending',
          uom: 'piece',
        };
        setData([newTransfer, ...data]);
        message.success('Transfer created successfully');
      }

      setDrawerVisible(false);
      form.resetFields();
      setSelectedFromProcess(undefined);
    } catch (error) {
      console.error('Validation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredData = data.filter(item =>
    Object.values(item).some(val =>
      String(val).toLowerCase().includes(searchText.toLowerCase())
    )
  );

  return (
    <div className="process-transfers-screen">
      <Card
        title={
          <Space>
            <SwapOutlined />
            <span>Process Transfers</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search transfers..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              New Transfer
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transfers`,
          }}
          size="small"
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Process Transfer' : 'New Process Transfer'}
        width={720}
        open={drawerVisible}
        onClose={() => setDrawerVisible(false)}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                onClick={handleSubmit}
                loading={loading}
              >
                Submit Transfer
              </Button>
            </Space>
          </div>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            transferDate: dayjs(),
          }}
        >
          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="fromProcess"
                label={<span><span style={{ color: 'red' }}>* </span>From Process</span>}
                rules={[{ required: true, message: 'Please select from process' }]}
              >
                <Select
                  placeholder="Select from process"
                  onChange={(value) => {
                    setSelectedFromProcess(value);
                    form.setFieldValue('toProcess', undefined);
                  }}
                >
                  <Select.Option value="cutting">Cutting</Select.Option>
                  <Select.Option value="stitching">Stitching</Select.Option>
                  <Select.Option value="washing">Washing</Select.Option>
                  <Select.Option value="finishing">Finishing</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="toProcess"
                label={<span><span style={{ color: 'red' }}>* </span>To Process</span>}
                rules={[{ required: true, message: 'Please select to process' }]}
              >
                <Select
                  placeholder="Select to process"
                  disabled={!selectedFromProcess}
                >
                  {getNextProcessOptions(selectedFromProcess).map(process => (
                    <Select.Option key={process} value={process}>
                      {process.charAt(0).toUpperCase() + process.slice(1)}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="style"
                label={<span><span style={{ color: 'red' }}>* </span>Style</span>}
                rules={[{ required: true, message: 'Please select style' }]}
              >
                <Select
                  placeholder="Select style"
                  showSearch
                  optionFilterProp="children"
                >
                  <Select.Option value="STY-001 - Classic Polo">STY-001 - Classic Polo</Select.Option>
                  <Select.Option value="STY-002 - Denim Jeans">STY-002 - Denim Jeans</Select.Option>
                  <Select.Option value="STY-003 - T-Shirt">STY-003 - T-Shirt</Select.Option>
                  <Select.Option value="STY-004 - Cargo Pants">STY-004 - Cargo Pants</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="quantity"
                label={<span><span style={{ color: 'red' }}>* </span>Quantity</span>}
                rules={[
                  { required: true, message: 'Please enter quantity' },
                  { type: 'number', min: 1, message: 'Quantity must be at least 1' },
                ]}
              >
                <InputNumber
                  style={{ width: '100%' }}
                  placeholder="Enter quantity"
                  min={1}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="transferDate"
                label={<span><span style={{ color: 'red' }}>* </span>Transfer Date</span>}
                rules={[{ required: true, message: 'Please select transfer date' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="remarks"
                label="Remarks"
              >
                <TextArea
                  rows={4}
                  placeholder="Enter any additional remarks..."
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default ProcessTransfersScreen;