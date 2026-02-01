/**
 * Stock Adjustment
 * Manual stock corrections with approval workflow
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
  Modal,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
} from '@ant-design/icons';
import type { StockAdjustment } from '../../types';
import dayjs from 'dayjs';

const { TextArea } = Input;

const SAMPLE_ADJUSTMENTS: StockAdjustment[] = [
  {
    id: '1',
    adjustmentNumber: 'ADJ-000001',
    adjustmentDate: new Date('2025-01-10'),
    adjustmentType: 'decrease',
    reason: 'damage',
    materialId: 'FAB-001',
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2025-001',
    quantity: 10,
    uom: 'kg',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    rackCode: 'R-01',
    binCode: 'B-05',
    approvalStatus: 'approved',
    approvedBy: 'Manager',
    approvalDate: new Date('2025-01-10'),
    remarks: 'Damaged during handling',
    createdBy: 'Store Keeper',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    adjustmentNumber: 'ADJ-000002',
    adjustmentDate: new Date('2025-01-09'),
    adjustmentType: 'increase',
    reason: 'physical_count',
    materialId: 'TRM-001',
    materialCode: 'TRM-BTN-005',
    materialName: 'Plastic Button - White 15mm',
    lotNumber: 'LOT-2025-002',
    quantity: 50,
    uom: 'piece',
    warehouseId: 'WH-002',
    warehouseName: 'Trims Warehouse',
    approvalStatus: 'pending',
    remarks: 'Physical count variance - found additional stock',
    createdBy: 'Store Keeper',
    createdAt: new Date('2025-01-09'),
  },
  {
    id: '3',
    adjustmentNumber: 'ADJ-000003',
    adjustmentDate: new Date('2025-01-08'),
    adjustmentType: 'decrease',
    reason: 'correction',
    materialId: 'FAB-005',
    materialCode: 'FAB-WV-012',
    materialName: 'Polyester Suiting Fabric - Black',
    quantity: 5,
    uom: 'meter',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    approvalStatus: 'draft',
    remarks: 'System error correction',
    createdBy: 'Admin',
    createdAt: new Date('2025-01-08'),
  },
];

const StockAdjustmentScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<StockAdjustment[]>(SAMPLE_ADJUSTMENTS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<StockAdjustment | null>(null);

  const columns = [
    {
      title: 'Adjustment No.',
      dataIndex: 'adjustmentNumber',
      key: 'adjustmentNumber',
      fixed: 'left' as const,
      width: 140,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Date',
      dataIndex: 'adjustmentDate',
      key: 'adjustmentDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Type',
      dataIndex: 'adjustmentType',
      key: 'adjustmentType',
      width: 100,
      render: (type: string) => (
        <Tag color={type === 'increase' ? 'green' : 'red'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      width: 140,
      render: (reason: string) => {
        const labelMap: Record<string, string> = {
          physical_count: 'Physical Count',
          damage: 'Damage',
          correction: 'Correction',
          expired: 'Expired',
          theft: 'Theft',
          system_error: 'System Error',
          other: 'Other',
        };
        return <Tag color="orange">{labelMap[reason] || reason}</Tag>;
      },
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
      render: (_: any, record: StockAdjustment) => {
        const sign = record.adjustmentType === 'increase' ? '+' : '-';
        const color = record.adjustmentType === 'increase' ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)';
        return (
          <span style={{ color, fontWeight: 500 }}>
            {sign}{record.quantity.toFixed(2)} {record.uom}
          </span>
        );
      },
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: 'Rack/Bin',
      key: 'location',
      width: 100,
      render: (_: any, record: StockAdjustment) =>
        record.rackCode && record.binCode ? `${record.rackCode}-${record.binCode}` : '-',
    },
    {
      title: 'Approval Status',
      dataIndex: 'approvalStatus',
      key: 'approvalStatus',
      width: 140,
      render: (status: string) => {
        const config: Record<string, { color: string; icon?: React.ReactNode }> = {
          draft: { color: 'default' },
          pending: { color: 'processing' },
          approved: { color: 'success', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', icon: <CloseCircleOutlined /> },
        };
        const { color, icon } = config[status];
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Created By',
      dataIndex: 'createdBy',
      key: 'createdBy',
      width: 120,
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 140,
      render: (_: any, record: StockAdjustment) => (
        <Space size="small">
          {record.approvalStatus === 'draft' && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue({
                  ...record,
                  adjustmentDate: dayjs(record.adjustmentDate),
                });
                setDrawerVisible(true);
              }}
            />
          )}
          {record.approvalStatus === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                onClick={() => handleApprove(record.id)}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                size="small"
                onClick={() => handleReject(record.id)}
              >
                Reject
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: 'Approve Stock Adjustment',
      content: 'Are you sure you want to approve this adjustment? Stock balance will be updated.',
      onOk: () => {
        setData(data.map(item =>
          item.id === id
            ? {
                ...item,
                approvalStatus: 'approved',
                approvedBy: 'Current User',
                approvalDate: new Date(),
              }
            : item
        ));
        message.success('Adjustment approved and stock updated (mock)');
      },
    });
  };

  const handleReject = (id: string) => {
    setData(data.map(item =>
      item.id === id ? { ...item, approvalStatus: 'rejected' } : item
    ));
    message.error('Adjustment rejected');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      if (editingRecord) {
        setData(data.map(item =>
          item.id === editingRecord.id
            ? {
                ...item,
                ...values,
                adjustmentDate: values.adjustmentDate.toDate(),
              }
            : item
        ));
        message.success('Adjustment updated');
      } else {
        const newAdjustment: StockAdjustment = {
          ...values,
          id: Date.now().toString(),
          adjustmentNumber: `ADJ-${String(data.length + 1).padStart(6, '0')}`,
          adjustmentDate: values.adjustmentDate.toDate(),
          approvalStatus: 'draft',
          createdBy: 'Current User',
          createdAt: new Date(),
        };
        setData([newAdjustment, ...data]);
        message.success('Adjustment created');
      }

      setDrawerVisible(false);
      form.resetFields();
      setEditingRecord(null);
    } catch (error) {
      message.error('Please fill all required fields');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="stock-adjustment-screen">
      <Card
        title={
          <Space>
            <EditOutlined />
            <span>Stock Adjustment</span>
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
                setEditingRecord(null);
                form.resetFields();
                form.setFieldsValue({ adjustmentDate: dayjs() });
                setDrawerVisible(true);
              }}
            >
              New Adjustment
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} adjustments`,
          }}
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Stock Adjustment' : 'New Stock Adjustment'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setEditingRecord(null);
        }}
        width={720}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
              <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Adjustment Date"
                name="adjustmentDate"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Adjustment Type"
                name="adjustmentType"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'increase', label: 'Increase' },
                    { value: 'decrease', label: 'Decrease' },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Reason"
                name="reason"
                rules={[{ required: true }]}
              >
                <Select
                  options={[
                    { value: 'physical_count', label: 'Physical Count' },
                    { value: 'damage', label: 'Damage' },
                    { value: 'correction', label: 'Correction' },
                    { value: 'expired', label: 'Expired' },
                    { value: 'theft', label: 'Theft' },
                    { value: 'system_error', label: 'System Error' },
                    { value: 'other', label: 'Other' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Material Code"
                name="materialCode"
                rules={[{ required: true }]}
              >
                <Input placeholder="FAB-KN-001" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Material Name"
            name="materialName"
            rules={[{ required: true }]}
          >
            <Input placeholder="Material name" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Lot/Batch Number" name="lotNumber">
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

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="UOM" name="uom" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'kg', label: 'Kilogram' },
                    { value: 'meter', label: 'Meter' },
                    { value: 'piece', label: 'Piece' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Warehouse" name="warehouseName" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'Main Warehouse', label: 'Main Warehouse' },
                    { value: 'Trims Warehouse', label: 'Trims Warehouse' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Rack Code" name="rackCode">
                <Input placeholder="R-01" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Bin Code" name="binCode">
            <Input placeholder="B-05" />
          </Form.Item>

          <Form.Item label="Remarks" name="remarks">
            <TextArea rows={3} placeholder="Add remarks..." />
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  );
};

export default StockAdjustmentScreen;
