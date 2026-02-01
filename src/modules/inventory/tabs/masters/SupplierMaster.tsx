/**
 * Supplier Master
 * Manage supplier information including contact details, payment terms, and GST
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
  Modal,
  Drawer,
  Tag,
  message,
  InputNumber,
  Descriptions,
  Tabs,
  Grid,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  ExportOutlined,
  SaveOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { UploadOutlined, DownloadOutlined } from '@ant-design/icons';
import type { SupplierMaster } from '../../types';
import { SUPPLIER_TYPE_OPTIONS, STATUS_OPTIONS } from '../../constants';
import { SAMPLE_SUPPLIERS } from '../../data/sampleData';
import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';
import ExcelUploadButtonGroup from '../../components/onboarding/components/ExcelUploadButtonGroup';
import { useDeviceType } from '../../utils';

const { TabPane } = Tabs;
const { useBreakpoint } = Grid;

const SupplierMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<SupplierMaster[]>(SAMPLE_SUPPLIERS);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<SupplierMaster | null>(null);
  const [activeTab, setActiveTab] = useState('1');
  const deviceType = useDeviceType();
  const screens = useBreakpoint();
  const isMobile = deviceType === 'mobile';

  const handleAdd = () => { setEditingRecord(null); form.resetFields(); setDrawerVisible(true); };
  const handleEdit = (record: SupplierMaster) => { setEditingRecord(record); form.setFieldsValue(record); setDrawerVisible(true); };
  const handleDelete = (id: string) => { Modal.confirm({ title: 'Delete Supplier', content: 'Confirm?', onOk: () => { setData(data.filter((item) => item.id !== id)); message.success('Deleted'); } }); };
  const handleSubmit = async (values: any) => { setLoading(true); try { if (editingRecord) { setData(data.map((item) => (item.id === editingRecord.id ? { ...item, ...values } : item))); message.success('Updated'); } else { setData([{ ...values, id: Date.now().toString(), supplierCode: `SUP-${String(data.length + 1).padStart(4, '0')}`, createdAt: new Date() } as SupplierMaster, ...data]); message.success('Created'); } setDrawerVisible(false); form.resetFields(); } catch (e) { message.error('Failed'); } finally { setLoading(false); } };

  const columns = [
    {
      title: 'Supplier Code',
      dataIndex: 'supplierCode',
      key: 'supplierCode',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Supplier Name',
      dataIndex: 'supplierName',
      key: 'supplierName',
      width: 200,
    },
    {
      title: 'Type',
      dataIndex: 'supplierType',
      key: 'supplierType',
      width: 140,
      render: (type: any) => {
        const t = String(type || 'unknown');
        const colorMap: Record<string, string> = {
          fabric_supplier: 'blue',
          trim_supplier: 'green',
          job_worker: 'purple',
          processing_house: 'orange',
          packing_supplier: 'cyan',
          unknown: 'default',
        };
        const labelMap: Record<string, string> = {
          fabric_supplier: 'Fabric',
          trim_supplier: 'Trims',
          job_worker: 'Job Worker',
          processing_house: 'Processing',
          packing_supplier: 'Packing',
          unknown: 'Unknown',
        };
        return (
          <Tag color={colorMap[t] || 'default'}>
            {labelMap[t] || t.toUpperCase()}
          </Tag>
        );
      },
    },
    {
      title: 'Contact Person',
      dataIndex: 'contactPerson',
      key: 'contactPerson',
      width: 150,
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      width: 130,
      render: (phone: string) => (
        <Space size={4}>
          <PhoneOutlined />
          <span>{phone}</span>
        </Space>
      ),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 180,
      render: (email: string) => (
        <Space size={4}>
          <MailOutlined />
          <span>{email}</span>
        </Space>
      ),
    },
    {
      title: 'GST Number',
      dataIndex: 'gstNumber',
      key: 'gstNumber',
      width: 160,
      render: (gst: string) => <Tag>{gst}</Tag>,
    },
    {
      title: 'Payment Terms',
      dataIndex: 'paymentTerms',
      key: 'paymentTerms',
      width: 120,
      render: (terms: string) => <Tag color="orange">{terms}</Tag>,
    },
    {
      title: 'Lead Time (Days)',
      dataIndex: 'leadTimeDays',
      key: 'leadTimeDays',
      width: 120,
      align: 'center' as const,
      render: (days: number) => <Tag color="cyan">{days} days</Tag>,
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
      width: 120,
      render: (_: any, record: SupplierMaster) => (
        <Space>
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
          <Button
            type="link"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </Space>
      ),
    },
  ];

  // Excel handlers
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const imported: SupplierMaster[] = jsonData.map((row, i) => {
        const rawType = String(row['Party Type'] || row['Supplier Type'] || '').toLowerCase();
        const type: SupplierMaster['type'] =
          rawType.includes('fabric') ? 'fabric' :
          rawType.includes('trim') ? 'trim' :
          rawType.includes('job') ? 'job_worker' :
          'general';

        return {
          id: `imported-${Date.now()}-${i}`,
          supplierCode: row['Party Code'] || row['Supplier Code'] || '',
          supplierName: row['Party Name'] || row['Supplier Name'] || '',
          type,
          contactPerson: row['Contact Person'] || '',
          phone: row['Phone'] || '',
          email: row['Email'] || '',
          address: row['Address'] || '',
          gst: row['GST Number'] || '',
          paymentTerms: row['Payment Terms'] || '',
          leadTimeDays: Number(row['Lead Time Days']) || undefined,
          status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as SupplierMaster['status'],
          createdAt: new Date(),
        };
      });

      setData([...imported, ...data]);
      message.success(`${imported.length} suppliers imported`);
    } catch (e) {
      message.error('Failed to read Excel');
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('supplier');
    message.success('Sample Excel downloaded');
  };

  return (
    <div className="supplier-master-screen">
      <Card
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Space>
              <UserOutlined />
              <span>Supplier Master</span>
            </Space>
            <Space>
              <Input
                placeholder="Search suppliers..."
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
                  setDrawerVisible(true);
                }}
              >
                Add Supplier
              </Button>
            </Space>
          </div>
        }
      >
        <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <ExcelUploadButtonGroup
            masterName="Supplier"
            onFileSelect={handleFileSelect}
            onDownloadSample={handleDownloadSample}
          />
        </div>

        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} suppliers`,
          }}
        />
      </Card>

      {/* Supplier Form Drawer */}
      <Drawer
        className="inventory-drawer"
        title={editingRecord ? 'Edit Supplier' : 'Add New Supplier'}
        open={drawerVisible}
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        width={typeof window !== 'undefined' && window.innerWidth > 768 ? 720 : '100%'}
        footer={
          <Space>
            <Button onClick={() => { setDrawerVisible(false); form.resetFields(); }}>
              Cancel
            </Button>
            <Button type="primary" onClick={() => form.submit()} loading={loading} icon={<SaveOutlined />}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ status: 'active', leadTimeDays: 15 }}>
          {isMobile && (
            <Select
              value={activeTab}
              onChange={setActiveTab}
              style={{ width: '100%', marginBottom: 12 }}
              options={[
                { value: '1', label: 'Basic Information' },
                { value: '2', label: 'Contact & Address' },
                { value: '3', label: 'Financial Details' },
                { value: '4', label: 'Compliance & Documents' },
              ]}
            />
          )}
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            tabBarGutter={screens.md && !screens.lg ? 8 : 16}
            tabBarStyle={isMobile ? { display: 'none' } : undefined}
            className="inventory-responsive-tabs"
          >
            <TabPane tab="Basic Information" key="1">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="supplierName"
                    label="Supplier Name"
                    rules={[{ required: true, message: 'Please enter supplier name' }]}
                  >
                    <Input placeholder="e.g., ABC Textiles Ltd." />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="supplierType"
                    label="Supplier Type"
                    rules={[{ required: true, message: 'Please select type' }]}
                  >
                    <Select placeholder="Select type" options={SUPPLIER_TYPE_OPTIONS} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="contactPerson"
                    label="Contact Person"
                    rules={[{ required: true, message: 'Please enter contact person' }]}
                  >
                    <Input placeholder="e.g., John Doe" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="phone"
                    label="Phone"
                    rules={[{ required: true, message: 'Please enter phone number' }]}
                  >
                    <Input placeholder="e.g., +91 98765 43210" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                      { required: true, message: 'Please enter email' },
                      { type: 'email', message: 'Invalid email format' },
                    ]}
                  >
                    <Input placeholder="e.g., supplier@example.com" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="status"
                    label="Status"
                    rules={[{ required: true, message: 'Please select status' }]}
                  >
                    <Select placeholder="Select status" options={STATUS_OPTIONS} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="address" label="Address">
                    <Input.TextArea rows={2} placeholder="Complete address" />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>

            <TabPane tab="Financial Information" key="2">
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="gstNumber"
                    label="GST Number"
                    rules={[
                      { required: true, message: 'Please enter GST number' },
                      { pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, message: 'Invalid GST format' },
                    ]}
                  >
                    <Input placeholder="e.g., 27AABCU9603R1ZX" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="panNumber"
                    label="PAN Number"
                  >
                    <Input placeholder="e.g., AABCU9603R" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="paymentTerms"
                    label="Payment Terms"
                    rules={[{ required: true, message: 'Please enter payment terms' }]}
                  >
                    <Select
                      placeholder="Select payment terms"
                      options={[
                        { value: 'Advance', label: 'Advance' },
                        { value: 'Net 15', label: 'Net 15 Days' },
                        { value: 'Net 30', label: 'Net 30 Days' },
                        { value: 'Net 45', label: 'Net 45 Days' },
                        { value: 'Net 60', label: 'Net 60 Days' },
                        { value: 'COD', label: 'Cash on Delivery' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="leadTimeDays"
                    label="Lead Time (Days)"
                    rules={[{ required: true, message: 'Please enter lead time' }]}
                  >
                    <InputNumber
                      min={1}
                      max={365}
                      style={{ width: '100%' }}
                      placeholder="e.g., 15"
                    />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="bankName" label="Bank Name">
                    <Input placeholder="e.g., HDFC Bank" prefix={<BankOutlined />} />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="accountNumber" label="Account Number">
                    <Input placeholder="e.g., 00112233445566" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item name="ifscCode" label="IFSC Code">
                    <Input placeholder="e.g., HDFC0001234" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="creditLimit" label="Credit Limit">
                    <InputNumber
                      min={0}
                      style={{ width: '100%' }}
                      placeholder="e.g., 500000"
                      formatter={(value) => `₹ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                      parser={(value: any) => value.replace(/₹\s?|(,*)/g, '')}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </TabPane>
          </Tabs>

        </Form>
      </Drawer>
    </div>
  );
};

export default SupplierMasterScreen;
