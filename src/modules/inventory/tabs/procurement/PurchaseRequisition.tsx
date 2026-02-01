/**
 * Purchase Requisition
 * Create and manage purchase requisitions with multi-item support
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
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import type { PurchaseRequisition, PurchaseRequisitionItem } from '../../types';
import { ORDER_STATUS_OPTIONS, UOM_OPTIONS } from '../../constants';
import dayjs from 'dayjs';

const PurchaseRequisitionScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<PurchaseRequisition[]>([]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<PurchaseRequisition | null>(null);
  const [prItems, setPrItems] = useState<PurchaseRequisitionItem[]>([]);

  const columns = [
    {
      title: 'PR Number',
      dataIndex: 'prNumber',
      key: 'prNumber',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'PR Date',
      dataIndex: 'prDate',
      key: 'prDate',
      width: 120,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Required By',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      width: 120,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: 'Requested By',
      dataIndex: 'requestedBy',
      key: 'requestedBy',
      width: 150,
    },
    {
      title: 'Items',
      dataIndex: 'items',
      key: 'itemCount',
      width: 80,
      align: 'center' as const,
      render: (items: PurchaseRequisitionItem[]) => items?.length || 0,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          draft: 'default',
          pending: 'processing',
          approved: 'success',
          rejected: 'error',
        };
        const labelMap: Record<string, string> = {
          draft: 'Draft',
          pending: 'Submitted',
          approved: 'Approved',
          rejected: 'Rejected',
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
      width: 200,
      render: (_: any, record: PurchaseRequisition) => (
        <Space>
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<CheckCircleOutlined />}
                onClick={() => {
                  setData(data.map(item =>
                    item.id === record.id ? { ...item, status: 'approved' } : item
                  ));
                  message.success('PR approved successfully');
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
                  message.warning('PR rejected');
                }}
              >
                Reject
              </Button>
            </>
          )}
          {record.status === 'draft' && (
            <>
              <Button
                type="link"
                size="small"
                icon={<EditOutlined />}
                onClick={() => {
                  setEditingRecord(record);
                  setPrItems(record.items || []);
                  form.setFieldsValue({
                    ...record,
                    prDate: record.prDate ? dayjs(record.prDate) : undefined,
                    requiredDate: (record as any).requiredDate ? dayjs((record as any).requiredDate) : undefined,
                  });
                  setDrawerVisible(true);
                }}
              />
              <Button
                type="link"
                size="small"
                onClick={() => {
                  setData(data.map(item =>
                    item.id === record.id ? { ...item, status: 'pending' } : item
                  ));
                  message.success('PR submitted for approval');
                }}
              >
                Submit
              </Button>
            </>
          )}
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            disabled={record.status === 'approved' || record.status === 'pending'}
            onClick={() => {
              Modal.confirm({
                title: 'Delete PR',
                content: 'Are you sure you want to delete this purchase requisition?',
                onOk: () => {
                  setData(data.filter(item => item.id !== record.id));
                  message.success('PR deleted successfully');
                },
              });
            }}
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
      render: (type: string) => {
        const colorMap: Record<string, string> = { fabric: 'blue', trim: 'green', packing: 'cyan', service: 'purple' };
        const labelMap: Record<string, string> = { fabric: 'Fabric', trim: 'Trim', packing: 'Packing', service: 'Service' };
        return <Tag color={colorMap[type]}>{labelMap[type]}</Tag>;
      },
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Specification',
      dataIndex: 'specification',
      key: 'specification',
      width: 150,
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
      title: 'Required Date',
      dataIndex: 'requiredDate',
      key: 'requiredDate',
      width: 120,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 60,
      render: (_: any, record: PurchaseRequisitionItem, index: number) => (
        <Button
          type="link"
          danger
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => {
            setPrItems(prItems.filter((_, i) => i !== index));
          }}
        />
      ),
    },
  ];

  const handleAddItem = (values: any) => {
    if (!values.itemType || !values.itemId || !values.itemQuantity) {
      message.error('Please select item type, item, and quantity');
      return;
    }
    const newItem: PurchaseRequisitionItem = {
      id: Date.now().toString(),
      itemType: values.itemType,
      itemId: values.itemId,
      itemName: values.itemName || 'Item',
      specification: values.specification || '',
      quantity: values.itemQuantity,
      uom: values.itemUom || 'kg',
      requiredDate: values.itemRequiredDate ? values.itemRequiredDate.toDate() : new Date(),
      purpose: values.purpose || '',
    };
    setPrItems([...prItems, newItem]);
    form.setFieldsValue({
      itemType: undefined,
      itemId: undefined,
      itemName: '',
      specification: '',
      itemQuantity: undefined,
      itemUom: undefined,
      itemRequiredDate: undefined,
    });
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    
    if (prItems.length === 0) {
      message.error('Please add at least one item to the PR');
      return;
    }

    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (editingRecord) {
        setData(
          data.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...values, items: prItems, prDate: values.prDate.toDate(), requiredDate: values.requiredDate.toDate() }
              : item
          )
        );
        message.success('PR updated successfully');
      } else {
        const newPR: PurchaseRequisition = {
          ...values,
          id: Date.now().toString(),
          prNumber: `PR-${String(data.length + 1).padStart(6, '0')}`,
          items: prItems,
          status: 'draft',
          prDate: values.prDate.toDate(),
          requiredDate: values.requiredDate.toDate(),
          createdAt: new Date(),
        };
        setData([newPR, ...data]);
        message.success('PR created successfully');
      }

      setDrawerVisible(false);
      form.resetFields();
      setPrItems([]);
    } catch (error) {
      message.error('Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="purchase-requisition-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <FileTextOutlined />
              <span>Purchase Requisition</span>
            </Space>
            <Space>
              <Input
                placeholder="Search PR..."
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
                  setPrItems([]);
                  setDrawerVisible(true);
                }}
              >
                Create PR
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
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} PRs`,
          }}
        />
      </Card>

      {/* PR Form Drawer */}
      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Purchase Requisition' : 'Create Purchase Requisition'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
          setPrItems([]);
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 1000 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); setPrItems([]);  }}>
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
            prDate: dayjs(),
            requiredDate: dayjs().add(7, 'day'),
            department: 'Production',
          }}
        >
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item
                name="prDate"
                label="PR Date"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="requiredDate"
                label="Required By"
                rules={[{ required: true, message: 'Required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YYYY" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="department"
                label="Department"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Select
                  options={[
                    { value: 'Production', label: 'Production' },
                    { value: 'Cutting', label: 'Cutting' },
                    { value: 'Stitching', label: 'Stitching' },
                    { value: 'Finishing', label: 'Finishing' },
                    { value: 'Quality', label: 'Quality' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                name="requestedBy"
                label="Requested By"
                rules={[{ required: true, message: 'Required' }]}
              >
                <Input placeholder="Employee Name" />
              </Form.Item>
            </Col>
          </Row>

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
            <Col span={6}>
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
            <Col span={4}>
              <Form.Item name="itemQuantity" label="Quantity" rules={[{ required: true, message: 'Enter qty' }]}>
                <InputNumber min={0.01} style={{ width: '100%' }} placeholder="0.00" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="itemUom" label="UOM">
                <Input disabled />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item name="itemRequiredDate" label="Required Date">
                <DatePicker style={{ width: '100%' }} format="DD-MMM-YY" />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item label=" ">
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => handleAddItem({
                    itemType: form.getFieldValue('itemType'),
                    itemId: form.getFieldValue('itemId'),
                    itemName: form.getFieldValue('itemName'),
                    specification: form.getFieldValue('specification'),
                    itemQuantity: form.getFieldValue('itemQuantity'),
                    itemUom: form.getFieldValue('itemUom'),
                    itemRequiredDate: form.getFieldValue('itemRequiredDate'),
                  })}
                >
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
              <Form.Item name="specification" label="Default Specification">
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Table
            columns={itemColumns}
            dataSource={prItems}
            rowKey="id"
            pagination={false}
            size="small"
            style={{ marginTop: 16 }}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}>
                  <strong>Total Items: {prItems.length}</strong>
                </Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />

        </Form>
      </Drawer>
    </div>
  );
};

export default PurchaseRequisitionScreen;
