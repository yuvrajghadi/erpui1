/**
 * Shade / Color Master
 * Manage garment shade/color codes and properties
 */

'use client';

import React, { useState, useMemo } from 'react';
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
  Divider,
  Upload,
  Typography,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  UploadOutlined,
  DownloadOutlined,
} from '@ant-design/icons';
import { generateSampleExcel, getSampleRows } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';

const { Text } = Typography;

interface ShadeRecord {
  id: string;
  shadeCode: string;
  shadeName: string;
  shadeGroup?: string;
  status: 'active' | 'inactive';
  createdDate: Date;
}

const SAMPLE_SHADES: ShadeRecord[] = [
  {
    id: '1',
    shadeCode: 'SHD-001',
    shadeName: 'Navy Blue',
    shadeGroup: 'Blue Family',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '2',
    shadeCode: 'SHD-002',
    shadeName: 'Cream White',
    shadeGroup: 'Neutral',
    status: 'active',
    createdDate: new Date('2025-12-16'),
  },
  {
    id: '3',
    shadeCode: 'SHD-003',
    shadeName: 'Olive Green',
    shadeGroup: 'Green Family',
    status: 'active',
    createdDate: new Date('2025-12-17'),
  },
  {
    id: '4',
    shadeCode: 'SHD-004',
    shadeName: 'Maroon',
    shadeGroup: 'Red Family',
    status: 'inactive',
    createdDate: new Date('2025-12-18'),
  },
];

const ShadeMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ShadeRecord[]>(SAMPLE_SHADES);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ShadeRecord | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedFile, setSelectedFile] = useState<any>(null);

  // Excel Upload Handler
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: ShadeRecord[] = jsonData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        shadeCode: row['Shade Code'] || `SHD-${String(data.length + index + 1).padStart(3, '0')}`,
        shadeName: row['Shade Name'] || '',
        shadeGroup: row['Shade Group'] || '',
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        createdDate: new Date(),
      }));

      setData([...data, ...importedData]);
      message.success(`${importedData.length} shade records imported successfully`);
      setSelectedFile(null);
    } catch (error) {
      message.error('Failed to read Excel file');
      console.error(error);
    }
  };

  // Excel Sample Download Handler
  const handleDownloadSample = () => {
    generateSampleExcel('shade');
    message.success('Sample Excel downloaded');
  };

  const filteredData = useMemo(() => {
    return data.filter((shade) =>
      searchText === '' ||
      shade.shadeCode.toLowerCase().includes(searchText.toLowerCase()) ||
      shade.shadeName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: ShadeRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Shade',
      content: 'Are you sure you want to delete this shade?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setData(data.filter((item) => item.id !== id));
        message.success('Shade deleted successfully');
      },
    });
  };

  const handleSubmit = async (values: any) => {
    if (editingRecord) {
      setData(
        data.map((item) =>
          item.id === editingRecord.id ? { ...item, ...values } : item
        )
      );
      message.success('Shade updated successfully');
    } else {
      const newShade: ShadeRecord = {
        ...values,
        id: Date.now().toString(),
        shadeCode: `SHD-${String(data.length + 1).padStart(3, '0')}`,
        createdDate: new Date(),
      };
      setData([newShade, ...data]);
      message.success('Shade created successfully');
    }
    setDrawerVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Shade Code',
      dataIndex: 'shadeCode',
      key: 'shadeCode',
      width: 120,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Shade Name',
      dataIndex: 'shadeName',
      key: 'shadeName',
      width: 180,
    },
    {
      title: 'Shade Group',
      dataIndex: 'shadeGroup',
      key: 'shadeGroup',
      width: 150,
      render: (text: string) => text || '-',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Tag>
      ),
    },
    {
      title: 'Created Date',
      dataIndex: 'createdDate',
      key: 'createdDate',
      width: 130,
      render: (date: Date) => new Date(date).toLocaleDateString(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: ShadeRecord) => (
        <Space>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
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

  return (
    <div style={{ padding: '16px' }}>
      <Card
        title="Shade / Color Master"
        extra={
          <Space>
            <Input.Search
              placeholder="Search shade name or code..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Shade
            </Button>
          </Space>
        }
      >
        {/* Excel Upload/Download Section */}
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--page-bg)', borderRadius: 8 }}>
          <Space size="middle">
            <Upload
              accept=".xlsx,.xls"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={(info) => {
                const file = info.file.originFileObj || info.file;
                if (file) {
                  handleFileSelect(file as File);
                }
              }}
            >
              <Button icon={<UploadOutlined />} size="large" style={{ minWidth: 160 }}>
                Upload Excel
              </Button>
            </Upload>
            <Button
              icon={<DownloadOutlined />}
              size="large"
              onClick={handleDownloadSample}
              style={{ minWidth: 180 }}
            >
              Download Sample Excel
            </Button>
          </Space>
          <div style={{ marginTop: 8 }}>
            <Text type="secondary" style={{ fontSize: 12 }}>
              Download sample to understand the required format. Replace sample data with your actual factory data.
            </Text>
          </div>
        </div>
        <Divider style={{ margin: '16px 0' }} />
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          pagination={{ pageSize: 15, showSizeChanger: true }}
          size="small"
        />
      </Card>

      {/* Shade Form Drawer */}
      <Drawer
        title={editingRecord ? 'Edit Shade' : 'Add New Shade'}
        placement="right"
        className="inventory-drawer"
        onClose={() => {
          setDrawerVisible(false);
          form.resetFields();
        }}
        open={drawerVisible}
        width={500}
        footer={
          <Space>
            <Button onClick={() => setDrawerVisible(false)}>Cancel</Button>
            <Button type="primary" onClick={() => form.submit()}>
              {editingRecord ? 'Update' : 'Create'}
            </Button>
          </Space>
        }
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="shadeName"
            label="Shade Name"
            rules={[{ required: true, message: 'Please enter shade name' }]}
          >
            <Input placeholder="e.g., Navy Blue" />
          </Form.Item>

          <Form.Item name="shadeGroup" label="Shade Group">
            <Select
              placeholder="Select shade group"
              allowClear
              options={[
                { value: 'Blue Family', label: 'Blue Family' },
                { value: 'Red Family', label: 'Red Family' },
                { value: 'Green Family', label: 'Green Family' },
                { value: 'Neutral', label: 'Neutral' },
                { value: 'Earth Tones', label: 'Earth Tones' },
              ]}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <Select
              options={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Form.Item>

        </Form>
      </Drawer>
    </div>
  );
};

export default ShadeMasterScreen;
