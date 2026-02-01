/**
 * Trims GRN (Goods Receipt Note)
 * Trims and accessories receipt with batch tracking
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
  Modal,
  Tag,
  message,
  InputNumber,
  DatePicker,
  Divider,
  Tooltip,
  Radio,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  InboxOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PrinterOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface TrimsGRNItem {
  id: string;
  trimName: string;
  trimCode: string;
  quantity: number;
  uom: string;
  rate: number;
  amount: number;
  batchNumber: string;
}

interface TrimsGRN {
  id: string;
  grnNumber: string;
  grnDate: Date;
  supplierName: string;
  poNumber: string;
  batchNumber?: string;
  sampleApprovalRef?: string;
  receivedCondition?: 'good' | 'damaged';
  invoiceNumber: string;
  invoiceDate: Date;
  items: TrimsGRNItem[];
  totalAmount: number;
  overShortQty?: number;
  inspectionRequired?: boolean;
  status: string;
  remarks?: string;
}

const TrimsGRNScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<TrimsGRN[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrimsGRN | null>(null);
  const [grnItems, setGrnItems] = useState<TrimsGRNItem[]>([]);

  const columns = [
    {
      title: 'GRN Number',
      dataIndex: 'grnNumber',
      key: 'grnNumber',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'GRN Date',
      dataIndex: 'grnDate',
      key: 'grnDate',
      width: 120,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Batch No.',
      dataIndex: 'batchNumber',
      key: 'batchNumber',
      width: 120,
      render: (batch: string) => <Tag color="cyan">{batch || '-'}</Tag>,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 160,
    },
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      width: 120,
    },
    {
      title: 'Condition',
      dataIndex: 'receivedCondition',
      key: 'receivedCondition',
      width: 110,
      render: (condition: string = 'good') => (
        <Tag color={condition === 'good' ? 'success' : 'error'}>
          {condition.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Invoice No.',
      dataIndex: 'invoiceNumber',
      key: 'invoiceNumber',
      width: 120,
    },
    {
      title: 'Total Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      align: 'right' as const,
      render: (amount: number) => `₹${amount.toLocaleString()}`,
    },
    {
      title: 'Over/Short',
      dataIndex: 'overShortQty',
      key: 'overShortQty',
      width: 100,
      align: 'right' as const,
      render: (qty: number = 0) => <span style={{ color: qty > 0 ? 'green' : qty < 0 ? 'red' : 'inherit' }}>{qty > 0 ? '+' : ''}{qty.toFixed(2)}</span>,
    },
    {
      title: 'QC Status',
      key: 'qcStatus',
      width: 120,
      render: (_: any, record: TrimsGRN) => {
        if (!record.inspectionRequired) {
          return <Tag color="success">STOCK READY</Tag>;
        }
        return <Tag color="warning">PENDING QC</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'completed' ? 'success' : status === 'pending' ? 'warning' : 'default'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: TrimsGRN) => (
        <Space size="small">
          <Tooltip title="Edit">
            <Button
              type="link"
              icon={<EditOutlined />}
              size="small"
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue({
                  ...record,
                  grnDate: dayjs(record.grnDate),
                  invoiceDate: dayjs(record.invoiceDate),
                });
                setGrnItems(record.items);
                setDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Print">
            <Button type="link" icon={<PrinterOutlined />} size="small" />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Trims GRN',
                  content: 'Are you sure you want to delete this GRN?',
                  onOk: () => {
                    setData(data.filter((item) => item.id !== record.id));
                    message.success('GRN deleted successfully');
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (grnItems.length === 0) {
        message.error('Please add at least one item');
        return;
      }

      setLoading(true);
      const totalAmount = grnItems.reduce((sum, item) => sum + item.amount, 0);

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...values, items: grnItems, totalAmount, grnDate: values.grnDate.toDate(), invoiceDate: values.invoiceDate.toDate() }
              : item
          )
        );
        message.success('GRN updated successfully');
      } else {
        const inspectionRequired = values.inspectionRequired;
        const newGRN: TrimsGRN = {
          ...values,
          id: Date.now().toString(),
          grnNumber: `TGRN-${String(data.length + 1).padStart(6, '0')}`,
          items: grnItems,
          totalAmount,
          status: inspectionRequired ? 'pending' : 'completed',
          grnDate: values.grnDate.toDate(),
          invoiceDate: values.invoiceDate.toDate(),
        };
        setData([newGRN, ...data]);
        message.success('GRN created successfully');

        if (!inspectionRequired) {
          message.success('Inspection not required — moved to Stock (mock)');
        } else {
          message.info('Inspection required — routed to QC (mock)');
        }
      }

      setDrawerVisible(false);
      form.resetFields();
      setGrnItems([]);
    } catch (error) {
      message.error('Please fill all required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trims-grn-screen">
      <Card
        title={
          <Space>
            <InboxOutlined />
            <span>Trims & Accessories GRN</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search GRN..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
            />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setEditingRecord(null);
                form.resetFields();
                setGrnItems([]);
                setDrawerVisible(true);
              }}
            >
              Create GRN
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} GRNs`,
          }}
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Trims GRN' : 'Create Trims GRN'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setGrnItems([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 900 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)} style={{ minWidth: 100 }}>
                Cancel
              </Button>
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />} style={{ minWidth: 100 }}>
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>GRN Date</span>} name="grnDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Supplier</span>} name="supplierName" rules={[{ required: true }]}>
                <Select placeholder="Select supplier">
                  <Select.Option value="Supplier A">Supplier A</Select.Option>
                  <Select.Option value="Supplier B">Supplier B</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>PO Number</span>} name="poNumber" rules={[{ required: true }]}>
                <Input placeholder="PO-XXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Batch Number" name="batchNumber">
                <Input placeholder="BATCH-2025-001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Sample Approval Ref" name="sampleApprovalRef">
                <Input placeholder="SA-2025-001" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Received Condition" name="receivedCondition" initialValue="good">
                <Select options={[
                  { value: 'good', label: 'Good' },
                  { value: 'damaged', label: 'Damaged' },
                ]} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Invoice Number</span>} name="invoiceNumber" rules={[{ required: true }]}>
                <Input placeholder="INV-XXXXXX" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label={<span><span style={{ color: 'red' }}>* </span>Invoice Date</span>} name="invoiceDate" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Over/Short Qty" name="overShortQty" initialValue={0}>
                <InputNumber style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8}>
              <Form.Item label="Inspection Required?" name="inspectionRequired" initialValue={false} valuePropName="checked">
                <Radio.Group options={[
                  { label: 'Yes', value: true },
                  { label: 'No', value: false },
                ]} />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item label="Remarks" name="remarks">
                <Input.TextArea rows={2} placeholder="Add remarks..." />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Drawer>
    </div>
  );
};

export default TrimsGRNScreen;
