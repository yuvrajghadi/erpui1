/**
 * Cycle Count (Physical Inventory)
 * Perform cycle counting with system vs physical variance tracking
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
  Tooltip,
  Alert,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  CloseCircleOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { CycleCount } from '../../types';
import { SAMPLE_WAREHOUSES, SAMPLE_RAW_STOCK } from '../../data/sampleData';
import { calculateVariance, calculateVariancePercentage } from '../../utils';
import dayjs from 'dayjs';

interface CountItem {
  id: string;
  materialCode: string;
  materialName: string;
  systemQuantity: number;
  physicalQuantity: number;
  variance: number;
  variancePercentage: number;
  uom: string;
  location: string;
}

const CycleCountScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<CycleCount[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<CycleCount | null>(null);
  const [countItems, setCountItems] = useState<CountItem[]>([]);

  const columns = [
    {
      title: 'Count Number',
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
      title: 'Count Type',
      dataIndex: 'countType',
      key: 'countType',
      width: 120,
      render: (type: string) => (
        <Tag color={type === 'full' ? 'blue' : 'cyan'}>
          {type.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Counted By',
      dataIndex: 'countedBy',
      key: 'countedBy',
      width: 150,
    },
    {
      title: 'Items Counted',
      dataIndex: 'items',
      key: 'itemsCount',
      width: 110,
      align: 'center' as const,
      render: (items: any[]) => items?.length || 0,
    },
    {
      title: 'Variance Summary',
      key: 'varianceSummary',
      width: 150,
      render: (_: any, record: CycleCount) => {
        const itemsWithVariance = record.items?.filter((item: any) => 
          Math.abs(item.variance) > 0
        ).length || 0;
        const totalItems = record.items?.length || 0;
        const hasVariance = itemsWithVariance > 0;
        
        return (
          <Tooltip title={`${itemsWithVariance} items with variance out of ${totalItems}`}>
            <Tag color={hasVariance ? 'error' : 'success'} icon={hasVariance ? <WarningOutlined /> : <CheckCircleOutlined />}>
              {itemsWithVariance}/{totalItems} Variance
            </Tag>
          </Tooltip>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 110,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          completed: 'success',
          approved: 'blue',
          rejected: 'error',
        };
        return (
          <Tag color={colorMap[status]}>
            {status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 150,
      render: (_: any, record: CycleCount) => (
        <Space>
          {record.status === 'completed' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  setData(data.map(item =>
                    item.id === record.id ? { ...item, status: 'approved' } : item
                  ));
                  message.success('Cycle count approved');
                }}
              >
                Approve
              </Button>
              <Button
                type="link"
                danger
                size="small"
                icon={<CloseCircleOutlined />}
                onClick={() => {
                  setData(data.map(item =>
                    item.id === record.id ? { ...item, status: 'rejected' } : item
                  ));
                  message.warning('Cycle count rejected');
                }}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'draft' && (
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
            />
          )}
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
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
      dataIndex: 'systemQuantity',
      key: 'systemQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number, record: CountItem) => `${qty?.toFixed(2)} ${record.uom}`,
    },
    {
      title: 'Physical Qty',
      dataIndex: 'physicalQuantity',
      key: 'physicalQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number, record: CountItem) => (
        <strong style={{ color: qty !== record.systemQuantity ? 'var(--color-cf1322)' : 'inherit' }}>
          {qty?.toFixed(2)} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Variance',
      dataIndex: 'variance',
      key: 'variance',
      width: 100,
      align: 'right' as const,
      render: (variance: number, record: CountItem) => {
        const isVariance = Math.abs(variance) > 0;
        return (
          <span style={{ color: isVariance ? 'var(--color-cf1322)' : 'var(--color-3f8600)', fontWeight: isVariance ? 'bold' : 'normal' }}>
            {variance > 0 ? '+' : ''}{variance?.toFixed(2)} {record.uom}
            {isVariance && <WarningOutlined style={{ marginLeft: 4 }} />}
          </span>
        );
      },
    },
    {
      title: 'Variance %',
      dataIndex: 'variancePercentage',
      key: 'variancePercentage',
      width: 100,
      align: 'right' as const,
      render: (pct: number) => {
        const isVariance = Math.abs(pct) > 0;
        return (
          <Tag color={isVariance ? 'error' : 'success'}>
            {pct > 0 ? '+' : ''}{pct?.toFixed(2)}%
          </Tag>
        );
      },
    },
  ];

  const handleMaterialSelect = (value: string) => {
    const material = SAMPLE_RAW_STOCK.find(m => m.id === value);
    if (material) {
      form.setFieldsValue({
        materialCode: material.materialCode,
        materialName: material.materialName,
        systemQty: material.availableQuantity,
        itemUom: material.uom,
        location: `${material.rackCode}-${material.binCode}`,
      });
    }
  };

  const handleAddItem = () => {
    const itemValues = {
      materialId: form.getFieldValue('itemMaterialId'),
      materialCode: form.getFieldValue('materialCode'),
      materialName: form.getFieldValue('materialName'),
      systemQuantity: form.getFieldValue('systemQty'),
      physicalQuantity: form.getFieldValue('physicalQty'),
      uom: form.getFieldValue('itemUom'),
      location: form.getFieldValue('location'),
    };

    if (!itemValues.materialId || itemValues.physicalQuantity === undefined) {
      message.error('Please select material and enter physical quantity');
      return;
    }

    const variance = calculateVariance(itemValues.systemQuantity, itemValues.physicalQuantity);
    const variancePercentage = calculateVariancePercentage(itemValues.systemQuantity, itemValues.physicalQuantity);

    const newItem: CountItem = {
      id: Date.now().toString(),
      ...itemValues,
      variance,
      variancePercentage,
    };
    
    setCountItems([...countItems, newItem]);
    
    form.setFieldsValue({
      itemMaterialId: undefined,
      materialCode: '',
      materialName: '',
      systemQty: undefined,
      physicalQty: undefined,
      itemUom: '',
      location: '',
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    if (countItems.length === 0) {
      message.error('Please add at least one item to count');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newCount: CycleCount = {
        ...values,
        id: Date.now().toString(),
        countNumber: `CC-${String(data.length + 1).padStart(6, '0')}`,
        items: countItems,
        status: 'completed',
        countDate: values.countDate.toDate(),
        createdAt: new Date(),
      };
      setData([newCount, ...data]);
      message.success('Cycle count saved successfully');

      setDrawerVisible(false);
      form.resetFields();
      setCountItems([]);
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  const hasVarianceItems = countItems.filter(item => Math.abs(item.variance) > 0).length;

  return (
    <div className="cycle-count-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <AuditOutlined />
              <span>Cycle Count / Physical Inventory</span>
            </Space>
            <Space>
              <Input
                placeholder="Search counts..."
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
                  form.setFieldsValue({ countDate: dayjs(), countType: 'partial' });
                  setDrawerVisible(true);
                }}
              >
                New Count
              </Button>
            </Space>
          </div>
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1300 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} counts`,
          }}
        />
      </Card>

      {/* Cycle Count Form Modal */}
      <Drawer
        className="inventory-drawer physical-inventory-drawer"
        title="Perform Cycle Count"
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setCountItems([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 1200 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); setCountItems([]); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
              Save Count
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical">
          <Alert
            message="Enter physical count quantities for each material and system will automatically calculate variance"
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />

          <Row gutter={16}>
            <Col span={4}>
              <Form.Item name="countDate" label="Count Date" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YY" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="warehouseId" label="Warehouse" rules={[{ required: true }]}>
                <Select
                  placeholder="Select warehouse"
                  options={SAMPLE_WAREHOUSES.map(w => ({ value: w.id, label: w.warehouseName }))}
                  onChange={(value) => {
                    const wh = SAMPLE_WAREHOUSES.find(w => w.id === value);
                    form.setFieldsValue({ warehouseName: wh?.warehouseName });
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="countType" label="Count Type" rules={[{ required: true }]}>
                <Select
                  options={[
                    { value: 'full', label: 'Full Count' },
                    { value: 'partial', label: 'Partial/ABC Count' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="countedBy" label="Counted By" rules={[{ required: true }]}>
                <Input placeholder="Employee name" />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="remarks" label="Remarks">
                <Input placeholder="Optional notes" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="warehouseName" hidden>
            <Input />
          </Form.Item>

          <Row gutter={8} style={{ marginTop: 16 }}>
            <Col span={6}>
              <Form.Item name="itemMaterialId" label="Select Material">
                <Select
                  showSearch
                  placeholder="Select material"
                  options={SAMPLE_RAW_STOCK.map(m => ({
                    value: m.id,
                    label: `${m.materialCode} - ${m.materialName}`,
                  }))}
                  onChange={handleMaterialSelect}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                  }
                />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="materialCode" label="Code">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="location" label="Location">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="systemQty" label="System Qty">
                <InputNumber disabled style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="physicalQty" label="Physical Qty">
                <InputNumber min={0} step={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="itemUom" label="UOM">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label=" ">
                <Button type="dashed" block icon={<PlusOutlined />} onClick={handleAddItem}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="materialName" hidden>
            <Input />
          </Form.Item>

          {hasVarianceItems > 0 && (
            <Alert
              message={`${hasVarianceItems} items have variance between system and physical count`}
              type="warning"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Table
            columns={itemColumns}
            dataSource={countItems}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 900 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>Total Items Counted: {countItems.length}</strong>
                  <span style={{ marginLeft: 16, color: 'var(--color-faad14)' }}>
                    Items with Variance: {hasVarianceItems}
                  </span>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} />
              </Table.Summary.Row>
            )}
          />

        </Form>
      </Drawer>
    </div>
  );
};

export default CycleCountScreen;
