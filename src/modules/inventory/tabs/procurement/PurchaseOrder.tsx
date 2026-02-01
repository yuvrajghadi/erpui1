/**
 * Purchase Order
 * Create and manage purchase orders linked to suppliers with delivery schedule
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
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  ShoppingCartOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import type { PurchaseOrder, PurchaseOrderItem } from '../../types';
import { ORDER_STATUS_OPTIONS, UOM_OPTIONS } from '../../constants';
import { SAMPLE_SUPPLIERS } from '../../data/sampleData';
import dayjs from 'dayjs';

const PurchaseOrderScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PurchaseOrder | null>(null);
  const [poItems, setPoItems] = useState<PurchaseOrderItem[]>([]);

  const columns = [
    {
      title: 'PO Number',
      dataIndex: 'poNumber',
      key: 'poNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'PO Date',
      dataIndex: 'poDate',
      key: 'poDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Supplier',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 180,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 110,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'itemCount',
      width: 70,
      align: 'center' as const,
      render: (items: PurchaseOrderItem[]) => items?.length || 0,
    },
    {
      title: 'Total Value',
      dataIndex: 'totalValue',
      key: 'totalValue',
      width: 120,
      align: 'right' as const,
      render: (value: number) => `₹${value?.toLocaleString() || 0}`,
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 120,
      render: (terms: string) => <Tag color="orange">{terms}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          approved: 'processing',
          'sent-to-supplier': 'warning',
          closed: 'success',
        };
        const labelMap: Record<string, string> = {
          draft: 'Draft',
          approved: 'Approved',
          'sent-to-supplier': 'Sent to Supplier',
          closed: 'Closed',
        };
        return (
          <Tag color={colorMap[status]}>
            {labelMap[status] || status.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 180,
      render: (_: any, record: PurchaseOrder) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
            />
          </Tooltip>
          {record.status === 'draft' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingRecord(record);
                  setPoItems(record.items || []);
                  form.setFieldsValue({
                    ...record,
                    poDate: record.poDate ? dayjs(record.poDate) : undefined,
                    deliveryDate: record.deliveryDate ? dayjs(record.deliveryDate) : undefined,
                  });
                  setDrawerVisible(true);
                }}
              />
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setData(data.map(item =>
                    item.id === record.id ? { ...item, status: 'approved' } : item
                  ));
                  message.success('PO approved');
                }}
              >
                Approve
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setData(data.map(item =>
                  item.id === record.id ? { ...item, status: 'in_progress' } : item
                ));
                message.success('PO sent to supplier');
              }}
            >
              Send
            </Button>
          )}
          {record.status === 'in_progress' && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setData(data.map(item =>
                  item.id === record.id ? { ...item, status: 'closed' } : item
                ));
                message.success('PO closed');
              }}
            >
              Close
            </Button>
          )}
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            disabled={record.status !== 'draft'}
          />
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      width: 100,
      render: (itemType: string) => {
        const colorMap: Record<string, string> = {
          fabric: 'blue',
          trim: 'green',
          packing: 'cyan',
          service: 'purple',
        };
        const labelMap: Record<string, string> = {
          fabric: 'Fabric',
          trim: 'Trim & Acc.',
          packing: 'Packing',
          service: 'Service',
        };
        return <Tag color={colorMap[itemType] || 'gray'}>{labelMap[itemType] || itemType}</Tag>;
      },
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 180,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: 120,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 70,
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      align: 'right' as const,
      render: (rate: number) => `₹${rate?.toFixed(2)}`,
    },
    {
      title: 'Amount',
      key: 'amount',
      width: 100,
      align: 'right' as const,
      render: (_: any, record: PurchaseOrderItem) => 
        `₹${((record.quantity || 0) * (record.rate || 0)).toFixed(2)}`,
    },
    {
      title: 'Delivery Date',
      dataIndex: 'deliveryDate',
      key: 'deliveryDate',
      width: 110,
      render: (date: Date) => date ? dayjs(date).format('DD-MMM-YY') : '-',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 60,
      render: (_: any, record: PurchaseOrderItem, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            setPoItems(poItems.filter((_, i) => i !== index));
          }}
        />
      ),
    },
  ];

  const handleAddItem = () => {
    const itemType = form.getFieldValue('itemType');
    const itemId = form.getFieldValue('itemId');
    const itemQuantity = form.getFieldValue('itemQuantity');
    const itemRate = form.getFieldValue('itemRate');

    if (!itemType || !itemId || !itemQuantity || !itemRate) {
      message.error('Please fill all item fields');
      return;
    }

    const newItem: PurchaseOrderItem = {
      id: Date.now().toString(),
      itemType,
      itemId,
      itemName: form.getFieldValue('itemName'),
      description: form.getFieldValue('specification') || '',
      quantity: itemQuantity,
      uom: form.getFieldValue('itemUom'),
      rate: itemRate,
      deliveryDate: form.getFieldValue('itemDeliveryDate')?.toDate(),
      amount: itemQuantity * itemRate,
    };
    setPoItems([...poItems, newItem]);
    form.setFieldsValue({
      itemType: undefined,
      itemId: undefined,
      itemName: undefined,
      specification: undefined,
      itemQuantity: undefined,
      itemUom: undefined,
      itemRate: undefined,
      itemDeliveryDate: undefined,
    });
  };

  const calculateTotal = () => {
    return poItems.reduce((sum, item) => sum + (item.quantity || 0) * (item.rate || 0), 0);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    if (poItems.length === 0) {
      message.error('Please add at least one item to the PO');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const totalValue = calculateTotal();

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? {
                  ...item,
                  ...values,
                  items: poItems,
                  totalValue,
                  poDate: values.poDate.toDate(),
                  deliveryDate: values.deliveryDate.toDate(),
                }
              : item
          )
        );
        message.success('PO updated successfully');
      } else {
        const newPO: PurchaseOrder = {
          ...values,
          id: Date.now().toString(),
          poNumber: `PO-${String(data.length + 1).padStart(6, '0')}`,
          items: poItems,
          totalValue,
          status: 'draft',
          poDate: values.poDate.toDate(),
          deliveryDate: values.deliveryDate.toDate(),
          createdAt: new Date(),
        };
        setData([newPO, ...data]);
        message.success('PO created successfully');
      }

      setDrawerVisible(false);
      form.resetFields();
      setPoItems([]);
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchase-order-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <ShoppingCartOutlined />
              <span>Purchase Orders</span>
            </Space>
            <Space>
              <Input
                placeholder="Search PO..."
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
                  setPoItems([]);
                  setDrawerVisible(true);
                }}
              >
                Create PO
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
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} POs`,
          }}
        />
      </Card>

      {/* PO Form Modal */}
      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Purchase Order' : 'Create Purchase Order'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setPoItems([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 1200 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); setPoItems([]); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={handleSubmit} loading={loading} icon={<SaveOutlined />}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            poDate: dayjs(),
            deliveryDate: dayjs().add(15, 'day'),
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="poDate"
                label="PO Date"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="supplierId"
                label="Supplier"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  showSearch
                  placeholder="Select supplier"
                  options={SAMPLE_SUPPLIERS.map(s => ({ value: s.id, label: s.supplierName }))}
                  onChange={(value) => {
                    const supplier = SAMPLE_SUPPLIERS.find(s => s.id === value);
                    if (supplier) {
                      form.setFieldsValue({
                        supplierName: supplier.supplierName,
                        paymentTerms: supplier.paymentTerms,
                      });
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="sourcePRId"
                label="Source PR (Optional)"
              >
                <Select
                  showSearch
                  placeholder="Select approved PR"
                  options={[
                    { value: 'PR-000001', label: 'PR-000001 (Approved)' },
                    { value: 'PR-000002', label: 'PR-000002 (Approved)' },
                    { value: 'PR-000003', label: 'PR-000003 (Approved)' },
                  ]}
                  onChange={(value) => {
                    if (value) {
                      // Auto-populate items from selected PR
                      message.info(`Items from ${value} can be auto-pulled into PO`);
                    }
                  }}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="deliveryDate"
                label="Delivery Date"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="paymentTerms"
                label="Payment Terms"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  options={[
                    { value: 'Advance', label: 'Advance' },
                    { value: 'Net 15', label: 'Net 15 Days' },
                    { value: 'Net 30', label: 'Net 30 Days' },
                    { value: 'Net 45', label: 'Net 45 Days' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                name="gstPercentage"
                label="GST %"
              >
                <InputNumber min={0} max={100} step={0.5} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item
                name="otherCharges"
                label="Other Charges"
              >
                <InputNumber min={0} placeholder="₹ 0.00" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="supplierName" hidden>
            <Input />
          </Form.Item>

          <Divider>Add Items</Divider>

          <Row gutter={8}>
            <Col span={4}>
              <Form.Item name="itemType" label="Item Type" rules={[{ required: true, message: 'Select type' }]}>
                <Select placeholder="Select type" options={[
                  { value: 'fabric', label: 'Fabric' },
                  { value: 'trim', label: 'Trim & Accessories' },
                  { value: 'packing', label: 'Packing Material' },
                  { value: 'service', label: 'Service / Job Work' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={5}>
              <Form.Item name="itemId" label="Item" rules={[{ required: true, message: 'Select item' }]}>
                <Select placeholder="Select item" showSearch options={[
                  { value: 'FAB-001', label: 'Single Jersey - Cotton' },
                  { value: 'FAB-002', label: 'Interlock - Polyester' },
                  { value: 'TRIM-001', label: 'Button - Plastic' },
                  { value: 'TRIM-002', label: 'Zipper - Metal' },
                  { value: 'PACK-001', label: 'Polybag - Standard' },
                  { value: 'SRV-001', label: 'Washing Service' },
                ]}
                onChange={() => {
                  const itemId = form.getFieldValue('itemId');
                  const itemMap: Record<string, { name: string; spec: string; uom: string }> = {
                    'FAB-001': { name: 'Single Jersey - Cotton', spec: '160 GSM', uom: 'kg' },
                    'FAB-002': { name: 'Interlock - Polyester', spec: '200 GSM', uom: 'kg' },
                    'TRIM-001': { name: 'Button - Plastic', spec: '12mm', uom: 'pcs' },
                    'TRIM-002': { name: 'Zipper - Metal', spec: '#5 Metal', uom: 'pcs' },
                    'PACK-001': { name: 'Polybag - Standard', spec: 'Transparent', uom: 'roll' },
                    'SRV-001': { name: 'Washing Service', spec: 'Industrial Wash', uom: 'pcs' },
                  };
                  const item = itemMap[itemId];
                  if (item) {
                    form.setFieldsValue({
                      itemName: item.name,
                      specification: item.spec,
                      itemUom: item.uom,
                    });
                  }
                }}
                />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="itemQuantity" label="Quantity" rules={[{ required: true, message: 'Enter qty' }]}>
                <InputNumber min={0.01} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item name="itemUom" label="UOM">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="itemRate" label="Rate" rules={[{ required: true, message: 'Enter rate' }]}>
                <InputNumber min={0} style={{ width: '100%' }} prefix="₹" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="itemDeliveryDate" label="Delivery">
                <DatePicker style={{ width: '100%' }} format="DD-MMM" />
              </Form.Item>
            </Col>
            <Col span={2}>
              <Form.Item label=" ">
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
                  Add
                </Button>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="itemName" label="Item Name">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="specification" label="Specification">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Table
            columns={itemColumns}
            dataSource={poItems}
            rowKey="id"
            pagination={false}
            size="small"
            scroll={{ x: 900 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={5}>
                  <strong>Total Items: {poItems.length}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5} align="right">
                  <strong>₹{calculateTotal().toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} colSpan={2} />
              </Table.Summary.Row>
            )}
          />

          <div style={{ textAlign: 'right', marginTop: 24 }}>
            <Space direction="vertical" style={{ width: '100%' }} align="end">
              <div>
                <span style={{ marginRight: 24 }}>Subtotal:</span>
                <span style={{ fontSize: 16, fontWeight: 'bold' }}>₹{calculateTotal().toFixed(2)}</span>
              </div>
              {(form.getFieldValue('gstPercentage') || 0) > 0 && (
                <div>
                  <span style={{ marginRight: 24 }}>GST ({form.getFieldValue('gstPercentage') || 0}%):</span>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>
                    ₹{((calculateTotal() * (form.getFieldValue('gstPercentage') || 0)) / 100).toFixed(2)}
                  </span>
                </div>
              )}
              {(form.getFieldValue('otherCharges') || 0) > 0 && (
                <div>
                  <span style={{ marginRight: 24 }}>Other Charges:</span>
                  <span style={{ fontSize: 16, fontWeight: 'bold' }}>₹{(form.getFieldValue('otherCharges') || 0).toFixed(2)}</span>
                </div>
              )}
              {((form.getFieldValue('gstPercentage') || 0) > 0 || (form.getFieldValue('otherCharges') || 0) > 0) && (
                <div style={{ borderTop: '1px solid var(--color-dddddd)', paddingTop: 8, marginTop: 8 }}>
                  <span style={{ marginRight: 24 }}>Total:</span>
                  <span style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--color-1890ff)' }}>
                    ₹{(
                      calculateTotal() + 
                      ((calculateTotal() * (form.getFieldValue('gstPercentage') || 0)) / 100) + 
                      (form.getFieldValue('otherCharges') || 0)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
            </Space>
          </div>
        </Form>
      </Drawer>
    </div>
  );
};

export default PurchaseOrderScreen;
