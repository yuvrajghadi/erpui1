/**
 * Stock Transfer
 * Transfer stock between warehouses, racks, and bins
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
  Steps,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  SwapOutlined,
  ArrowRightOutlined,
} from '@ant-design/icons';
import type { StockTransfer } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const SAMPLE_TRANSFERS: StockTransfer[] = [
  {
    id: '1',
    transferNumber: 'TRF-000001',
    transferDate: new Date('2025-01-10'),
    fromWarehouseId: 'WH-001',
    fromWarehouseName: 'Main Warehouse',
    fromRackCode: 'R-01',
    fromBinCode: 'B-05',
    toWarehouseId: 'WH-002',
    toWarehouseName: 'Trims Warehouse',
    toRackCode: 'R-05',
    toBinCode: 'B-12',
    materialId: 'TRM-001',
    materialCode: 'TRM-BTN-005',
    materialName: 'Plastic Button - White 15mm',
    lotNumber: 'LOT-2025-002',
    quantity: 1000,
    uom: 'piece',
    reason: 'Inventory rebalancing',
    status: 'completed',
    requestedBy: 'Store Keeper',
    approvedBy: 'Manager',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    transferNumber: 'TRF-000002',
    transferDate: new Date('2025-01-09'),
    fromWarehouseId: 'WH-001',
    fromWarehouseName: 'Main Warehouse',
    fromRackCode: 'R-02',
    fromBinCode: 'B-10',
    toWarehouseId: 'WH-001',
    toWarehouseName: 'Main Warehouse',
    toRackCode: 'R-03',
    toBinCode: 'B-15',
    materialId: 'FAB-001',
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2025-001',
    quantity: 50,
    uom: 'kg',
    reason: 'Rack optimization',
    status: 'in_transit',
    requestedBy: 'Store Keeper',
    createdAt: new Date('2025-01-09'),
  },
];

const StockTransferScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<StockTransfer[]>(SAMPLE_TRANSFERS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StockTransfer | null>(null);

  const columns = [
    {
      title: 'Transfer No.',
      dataIndex: 'transferNumber',
      key: 'transferNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Date',
      dataIndex: 'transferDate',
      key: 'transferDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string) => lot ? <Tag color="purple">{lot}</Tag> : '-',
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: StockTransfer) => `${record.quantity.toFixed(2)} ${record.uom}`,
    },
    {
      title: 'From Location',
      key: 'fromLocation',
      width: 180,
      render: (_: any, record: StockTransfer) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.fromWarehouseName}</div>
          {record.fromRackCode && record.fromBinCode && (
            <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>
              {record.fromRackCode}-{record.fromBinCode}
            </div>
          )}
        </div>
      ),
    },
    {
      title: '',
      key: 'arrow',
      width: 40,
      align: 'center' as const,
      render: () => <ArrowRightOutlined style={{ color: 'var(--color-1890ff)' }} />,
    },
    {
      title: 'To Location',
      key: 'toLocation',
      width: 180,
      render: (_: any, record: StockTransfer) => (
        <div>
          <div style={{ fontWeight: 500 }}>{record.toWarehouseName}</div>
          {record.toRackCode && record.toBinCode && (
            <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>
              {record.toRackCode}-{record.toBinCode}
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config: Record<string, { color: string }> = {
          draft: { color: 'default' },
          in_transit: { color: 'processing' },
          completed: { color: 'success' },
          cancelled: { color: 'error' },
        };
        const { color } = config[status];
        return <Tag color={color}>{status.toUpperCase().replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 120,
      render: (_: any, record: StockTransfer) => (
        <Space size="small">
          {record.status === 'in_transit' && (
            <Button
              type="link"
              size="small"
              onClick={() => handleComplete(record.id)}
            >
              Complete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const handleComplete = (id: string) => {
    setData(data.map(item =>
      item.id === id
        ? { ...item, status: 'completed', approvedBy: 'Current User' }
        : item
    ));
    message.success('Transfer completed and stock balances updated (mock)');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newTransfer: StockTransfer = {
        ...values,
        id: Date.now().toString(),
        transferNumber: `TRF-${String(data.length + 1).padStart(6, '0')}`,
        transferDate: values.transferDate.toDate(),
        status: 'draft',
        requestedBy: 'Current User',
        createdAt: new Date(),
      };
      setData([newTransfer, ...data]);
      message.success('Transfer created');

      setDrawerVisible(false);
      form.resetFields();
    } catch (error) {
      message.error('Please fill all required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-transfer-screen">
      <Card
        title={
          <Space>
            <SwapOutlined />
            <span>Stock Transfer</span>
          </Space>
        }
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
            />
            <Button icon={<ExportOutlined />}>Export</Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                form.resetFields();
                form.setFieldsValue({ transferDate: dayjs() });
                setDrawerVisible(true);
              }}
            >
              New Transfer
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transfers`,
          }}
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title="New Stock Transfer"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        width={720}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
                Create Transfer
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Transfer Date"
            name="transferDate"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            label="Material Code"
            name="materialCode"
            rules={[{ required: true }]}
          >
            <Input placeholder="FAB-KN-001" />
          </Form.Item>

          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Material name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Lot Number" name="lotNumber">
                <Input placeholder="LOT-2025-001" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Quantity"
                name="quantity"
                rules={[{ required: true }]}
              >
                <InputNumber min={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="UOM" name="uom" rules={[{ required: true }]}>
            <Select
              options={[
                { value: 'kg', label: 'Kilogram' },
                { value: 'meter', label: 'Meter' },
                { value: 'piece', label: 'Piece' },
              ]}
            />
          </Form.Item>

          <Steps
            current={0}
            items={[
              { title: 'From Location' },
              { title: 'To Location' },
            ]}
            style={{ marginBottom: 24 }}
          />

          <div style={{ background: 'var(--color-f5f5f5)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h4>From Location</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Warehouse"
                  name="fromWarehouseName"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Main Warehouse', label: 'Main Warehouse' },
                      { value: 'Trims Warehouse', label: 'Trims Warehouse' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Rack Code" name="fromRackCode">
                  <Input placeholder="R-01" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Bin Code" name="fromBinCode">
              <Input placeholder="B-05" />
            </Form.Item>
          </div>

          <div style={{ background: 'var(--inventory-e6f7ff-bg)', padding: 16, borderRadius: 8, marginBottom: 16 }}>
            <h4>To Location</h4>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Warehouse"
                  name="toWarehouseName"
                  rules={[{ required: true }]}
                >
                  <Select
                    options={[
                      { value: 'Main Warehouse', label: 'Main Warehouse' },
                      { value: 'Trims Warehouse', label: 'Trims Warehouse' },
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="Rack Code" name="toRackCode">
                  <Input placeholder="R-02" />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item label="Bin Code" name="toBinCode">
              <Input placeholder="B-10" />
            </Form.Item>
          </div>

          <Form.Item label="Reason" name="reason" rules={[{ required: true }]}>
            <TextArea rows={2} placeholder="Reason for transfer..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default StockTransferScreen;
