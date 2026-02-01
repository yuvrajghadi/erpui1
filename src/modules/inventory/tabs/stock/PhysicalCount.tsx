/**
 * Physical Inventory / Cycle Count
 * Periodic physical verification of stock
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
  Statistic,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  WarningOutlined,
  FileSearchOutlined,
} from '@ant-design/icons';
import type { CycleCount, CycleCountItem } from '../../types';
import dayjs from 'dayjs';

const SAMPLE_COUNTS: CycleCount[] = [
  {
    id: '1',
    countNumber: 'CC-000001',
    countDate: new Date('2025-01-10'),
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    items: [
      {
        id: 'i1',
        itemId: 'FAB-001',
        itemName: 'Cotton Single Jersey - White',
        systemQty: 500,
        physicalQty: 490,
        variance: -10,
        variancePercentage: -2,
        uom: 'kg',
        location: 'R-01-B-05',
        remarks: 'Minor variance',
      },
      {
        id: 'i2',
        itemId: 'TRM-001',
        itemName: 'Plastic Button - White 15mm',
        systemQty: 2500,
        physicalQty: 2550,
        variance: 50,
        variancePercentage: 2,
        uom: 'piece',
        location: 'R-05-B-12',
        remarks: 'Additional stock found',
      },
    ],
    countedBy: 'Store Keeper',
    status: 'approved',
  },
  {
    id: '2',
    countNumber: 'CC-000002',
    countDate: new Date('2025-01-09'),
    warehouseId: 'WH-002',
    warehouseName: 'Trims Warehouse',
    items: [
      {
        id: 'i3',
        itemId: 'TRM-005',
        itemName: 'Metal Zipper - 12 inch',
        systemQty: 1000,
        physicalQty: 950,
        variance: -50,
        variancePercentage: -5,
        uom: 'piece',
        location: 'R-02-B-08',
        remarks: 'Variance under investigation',
      },
    ],
    countedBy: 'Assistant',
    status: 'submitted',
  },
];

const PhysicalCountScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<CycleCount[]>(SAMPLE_COUNTS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CycleCount | null>(null);
  const [countItems, setCountItems] = useState<CycleCountItem[]>([]);

  const columns = [
    {
      title: 'Count No.',
      dataIndex: 'countNumber',
      key: 'countNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Count Date',
      dataIndex: 'countDate',
      key: 'countDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: 'Items Counted',
      key: 'itemsCount',
      width: 120,
      align: 'center' as const,
      render: (_: any, record: CycleCount) => (
        <Tag color="blue">{record.items.length}</Tag>
      ),
    },
    {
      title: 'Variance Items',
      key: 'varianceCount',
      width: 130,
      align: 'center' as const,
      render: (_: any, record: CycleCount) => {
        const varianceItems = record.items.filter(item => item.variance !== 0);
        return varianceItems.length > 0 ? (
          <Tag color="warning" icon={<WarningOutlined />}>
            {varianceItems.length}
          </Tag>
        ) : (
          <Tag color="success" icon={<CheckCircleOutlined />}>
            0
          </Tag>
        );
      },
    },
    {
      title: 'Counted By',
      dataIndex: 'countedBy',
      key: 'countedBy',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const config: Record<string, { color: string; icon?: React.ReactNode }> = {
          draft: { color: 'default' },
          submitted: { color: 'processing' },
          approved: { color: 'success', icon: <CheckCircleOutlined /> },
          rejected: { color: 'error', icon: <CloseCircleOutlined /> },
          completed: { color: 'success' },
        };
        const { color, icon } = config[status];
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: CycleCount) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<FileSearchOutlined />}
            onClick={() => {
              setEditingRecord(record);
              setCountItems(record.items);
              setDrawerVisible(true);
            }}
          >
            View
          </Button>
          {record.status === 'submitted' && (
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

  const itemColumns = [
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      width: 120,
    },
    {
      title: 'System Qty',
      dataIndex: 'systemQty',
      key: 'systemQty',
      width: 110,
      align: 'right' as const,
      render: (qty: number, record: CycleCountItem) => `${qty.toFixed(2)} ${record.uom}`,
    },
    {
      title: 'Physical Qty',
      dataIndex: 'physicalQty',
      key: 'physicalQty',
      width: 110,
      align: 'right' as const,
      render: (qty: number, record: CycleCountItem) => `${qty.toFixed(2)} ${record.uom}`,
    },
    {
      title: 'Variance',
      key: 'variance',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: CycleCountItem) => {
        const color = record.variance > 0 ? 'var(--color-52c41a)' : record.variance < 0 ? 'var(--color-ff4d4f)' : 'inherit';
        return (
          <div>
            <div style={{ color, fontWeight: 500 }}>
              {record.variance > 0 ? '+' : ''}{record.variance.toFixed(2)} {record.uom}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--color-666666)' }}>
              ({record.variancePercentage.toFixed(2)}%)
            </div>
          </div>
        );
      },
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
    },
  ];

  const handleApprove = (id: string) => {
    Modal.confirm({
      title: 'Approve Cycle Count',
      content: 'Are you sure? Stock adjustments will be generated for variance items.',
      onOk: () => {
        setData(data.map(item =>
          item.id === id ? { ...item, status: 'approved' } : item
        ));
        message.success('Cycle count approved and adjustments created (mock)');
      },
    });
  };

  const handleReject = (id: string) => {
    setData(data.map(item =>
      item.id === id ? { ...item, status: 'rejected' } : item
    ));
    message.error('Cycle count rejected');
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const newCount: CycleCount = {
        ...values,
        id: Date.now().toString(),
        countNumber: `CC-${String(data.length + 1).padStart(6, '0')}`,
        countDate: values.countDate.toDate(),
        items: countItems,
        status: 'draft',
        countedBy: 'Current User',
      };
      setData([newCount, ...data]);
      message.success('Cycle count created');

      setDrawerVisible(false);
      form.resetFields();
      setCountItems([]);
    } catch (error) {
      message.error('Please fill all required fields');
    } finally {
      setLoading(false);
    }
  };

  const calculateSummary = () => {
    const totalVariance = countItems.reduce((sum, item) => sum + Math.abs(item.variance), 0);
    const varianceItems = countItems.filter(item => item.variance !== 0).length;
    return { totalVariance, varianceItems };
  };

  const { totalVariance, varianceItems } = calculateSummary();

  return (
    <div className="physical-count-screen">
      <Card
        title={
          <Space>
            <FileSearchOutlined />
            <span>Physical Inventory / Cycle Count</span>
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
                setCountItems([]);
                form.setFieldsValue({ countDate: dayjs() });
                setDrawerVisible(true);
              }}
            >
              New Count
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
            pageSize: 15,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} counts`,
          }}
        />
      </Card>

      <Drawer
        className="inventory-drawer"
        title={editingRecord ? `Cycle Count: ${editingRecord.countNumber}` : 'New Cycle Count'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setCountItems([]);
          setEditingRecord(null);
        }}
        width={900}
        footer={
          !editingRecord && (
            <div style={{ textAlign: 'right' }}>
              <Space>
                <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
                <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
                  Create Count
                </Button>
              </Space>
            </div>
          )
        }
      >
        {!editingRecord && (
          <Form form={form} layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Count Date"
                  name="countDate"
                  rules={[{ required: true }]}
                >
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="Warehouse"
                  name="warehouseName"
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
            </Row>
          </Form>
        )}

        {editingRecord && (
          <div style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Total Items"
                    value={countItems.length}
                    prefix={<FileSearchOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Variance Items"
                    value={varianceItems}
                    valueStyle={{ color: varianceItems > 0 ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)' }}
                    prefix={<WarningOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card size="small">
                  <Statistic
                    title="Total Variance"
                    value={totalVariance}
                    precision={2}
                    valueStyle={{ color: 'var(--color-ff4d4f)' }}
                  />
                </Card>
              </Col>
            </Row>
          </div>
        )}

        <Table
          columns={itemColumns}
          dataSource={countItems}
          rowKey="id"
          pagination={false}
          size="small"
        />
      </Drawer>
    </div>
  );
};

export default PhysicalCountScreen;
