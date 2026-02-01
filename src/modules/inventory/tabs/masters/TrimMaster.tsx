/**
 * Trim & Accessories Master
 * Manage trim and accessories inventory items
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
  InputNumber,
  Modal,
  Tag,
  message,
  Tooltip,
  Upload,
  Divider,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import type { TrimAccessoryMaster } from '../../types';
import { TRIM_CATEGORY_OPTIONS, UOM_OPTIONS, STATUS_OPTIONS } from '../../constants';
import InventoryDrawer from '../../components/InventoryDrawer';
import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';
import ExcelUploadButtonGroup from '../../components/onboarding/components/ExcelUploadButtonGroup';

const { Text } = Typography;

const TrimMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<TrimAccessoryMaster[]>([
    {
      id: '1',
      itemCode: 'TRM-BTN-001',
      itemName: 'Plastic Button - 4 Hole',
      category: 'Buttons',
      subCategory: 'Plastic',
      supplier: 'Button Suppliers Inc.',
      defaultUOM: 'piece',
      minStock: 1000,
      reorderLevel: 500,
      status: 'active',
      createdAt: new Date(),
    },
  ]);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<TrimAccessoryMaster | null>(null);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: TrimAccessoryMaster) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Trim Item',
      content: 'Are you sure?',
      onOk: () => {
        setData(data.filter((item) => item.id !== id));
        message.success('Deleted');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      if (editingRecord) {
        setData(data.map((item) => (item.id === editingRecord.id ? { ...item, ...values, updatedAt: new Date() } : item)));
        message.success('Updated');
      } else {
        const newItem: TrimAccessoryMaster = { ...values, id: Date.now().toString(), itemCode: `TRM-${String(data.length + 1).padStart(3, '0')}`, createdAt: new Date(), updatedAt: new Date() } as TrimAccessoryMaster;
        setData([newItem, ...data]);
        message.success('Created');
      }
      setDrawerVisible(false);
      form.resetFields();
    } catch (e) {
      message.error('Failed');
    } finally {
      setLoading(false);
    }
  };

  // Excel Upload Handler
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: TrimAccessoryMaster[] = jsonData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        itemCode: row['Trim Code'] || row['Item Code'] || `TRM-${String(data.length + index + 1).padStart(3, '0')}`,
        itemName: row['Trim Name'] || row['Item Name'] || '',
        category: row['Trim Type'] || row['Category'] || '',
        supplier: row['Supplier'] || '',
        defaultUOM: row['Default UOM'] || row['UOM'] || 'PCS',
        minStock: parseInt(row['Min Stock']) || 0,
        reorderLevel: parseInt(row['Reorder Level']) || 0,
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as any,
        createdAt: new Date(),
      }));

      setData([...importedData, ...data]);
      message.success(`${importedData.length} trim records imported successfully`);
    } catch (e) {
      message.error('Failed to read Excel');
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('trim');
    message.success('Sample Excel downloaded');
  };

  const columns = [
    {
      title: 'Item Code',
      dataIndex: 'itemCode',
      key: 'itemCode',
      fixed: 'left' as const,
      width: 130,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 200,
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: 120,
      render: (cat: string) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: 'Sub Category',
      dataIndex: 'subCategory',
      key: 'subCategory',
      width: 120,
    },
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      width: 180,
    },
    {
      title: 'Default UOM',
      dataIndex: 'defaultUOM',
      key: 'defaultUOM',
      width: 100,
      render: (uom: string) => uom.toUpperCase(),
    },
    {
      title: 'Min Stock',
      dataIndex: 'minStock',
      key: 'minStock',
      width: 100,
      align: 'right' as const,
    },
    {
      title: 'Reorder Level',
      dataIndex: 'reorderLevel',
      key: 'reorderLevel',
      width: 120,
      align: 'right' as const,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: TrimAccessoryMaster) => (
        <Space>
          <Tooltip title="Edit">
            <Button
              type="link"
              size="small"
              icon={<EditOutlined />}
              onClick={() => {
                setEditingRecord(record);
                form.setFieldsValue(record);
                setDrawerVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="link"
              danger
              size="small"
              icon={<DeleteOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Delete Item',
                  content: 'Are you sure you want to delete this item?',
                  onOk: () => {
                    setData(data.filter((item) => item.id !== record.id));
                    message.success('Item deleted successfully');
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="trim-master-screen">
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <Space wrap style={{ width: '100%', justifyContent: 'space-between' }}>
                <span>Trim & Accessories Master</span>
                <Space wrap>
                  <Input
                    placeholder="Search items..."
                    prefix={<SearchOutlined />}
                    style={{ width: 200 }}
                    allowClear
                  />
                  <Button icon={<ExportOutlined />}>Export</Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => {
                      setEditingRecord(null);
                      form.resetFields();
                      setDrawerVisible(true);
                    }}
                  >
                    Add Item
                  </Button>
                </Space>
              </Space>
            }
          >
            <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ExcelUploadButtonGroup
                masterName="Trim"
                onFileSelect={handleFileSelect}
                onDownloadSample={handleDownloadSample}
              />
            </div>

            <Table
              columns={columns}
              dataSource={data}
              rowKey="id"
              loading={loading}
              scroll={{ x: 'max-content' }}
              pagination={{
                pageSize: 20,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
                responsive: true,
              }}
            />
          </Card>
        </Col>
      </Row>

      <InventoryDrawer
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        title={editingRecord ? 'Edit Trim/Accessory' : 'Add New Trim/Accessory'}
        width={window.innerWidth > 768 ? 720 : '100%'}
        footer={
          <div style={{ textAlign: 'right' }}>
            <Space>
              <Button
                icon={<CloseOutlined />}
                onClick={() => {
                  setDrawerVisible(false);
                  form.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                type="primary"
                loading={loading}
                icon={<SaveOutlined />}
                onClick={() => form.submit()}
              >
                {editingRecord ? 'Update' : 'Create'}
              </Button>
            </Space>
          </div>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'active' }}>
          <Row gutter={16}>
            <Col xs={24}>
              <Form.Item
                name="itemName"
                label="Item Name"
                rules={[{ required: true, message: 'Please enter item name' }]}
              >
                <Input placeholder="e.g., Plastic Button - 4 Hole" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select
                  placeholder="Select category"
                  showSearch
                  options={TRIM_CATEGORY_OPTIONS.map((c) => ({ label: c, value: c }))}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item name="subCategory" label="Sub Category">
                <Input placeholder="e.g., Plastic, Metal" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item name="supplier" label="Supplier">
                <Input placeholder="Supplier name" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="defaultUOM"
                label="Default UOM"
                rules={[{ required: true, message: 'Please select UOM' }]}
              >
                <Select placeholder="Select UOM" options={UOM_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="minStock"
                label="Minimum Stock"
                rules={[{ required: true, message: 'Please enter minimum stock' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g., 1000" />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12}>
              <Form.Item
                name="reorderLevel"
                label="Reorder Level"
                rules={[{ required: true, message: 'Please enter reorder level' }]}
              >
                <InputNumber min={0} style={{ width: '100%' }} placeholder="e.g., 500" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={24} sm={12}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true, message: 'Please select status' }]}
              >
                <Select placeholder="Select status" options={STATUS_OPTIONS} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </InventoryDrawer>
    </div>
  );
};

export default TrimMasterScreen;
