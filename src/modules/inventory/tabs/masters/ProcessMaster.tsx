/**
 * Process / Operation Master
 * Manage production processes and operations
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
  Modal,
  Drawer,
  Tag,
  message,
  InputNumber,
  Checkbox,
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
import { generateSampleExcel } from '../../components/onboarding/utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';

const { Text } = Typography;

interface ProcessRecord {
  id: string;
  processCode: string;
  processName: string;
  isJobWork: boolean;
  expectedLossPercent: number;
  status: 'active' | 'inactive';
  createdDate: Date;
}

const SAMPLE_PROCESSES: ProcessRecord[] = [
  {
    id: '1',
    processCode: 'CUT',
    processName: 'Cutting',
    isJobWork: false,
    expectedLossPercent: 3,
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '2',
    processCode: 'STITCH',
    processName: 'Stitching',
    isJobWork: false,
    expectedLossPercent: 1,
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '3',
    processCode: 'WASH',
    processName: 'Washing',
    isJobWork: true,
    expectedLossPercent: 2,
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '4',
    processCode: 'PRINT',
    processName: 'Printing',
    isJobWork: true,
    expectedLossPercent: 2.5,
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '5',
    processCode: 'FINISH',
    processName: 'Finishing',
    isJobWork: false,
    expectedLossPercent: 1.5,
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
];

const ProcessMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<ProcessRecord[]>(SAMPLE_PROCESSES);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<ProcessRecord | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: ProcessRecord[] = jsonData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        processCode: row['Process Code'] || '',
        processName: row['Process Name'] || '',
        isJobWork: row['Is Job Work']?.toLowerCase() === 'yes',
        expectedLossPercent: parseFloat(row['Expected Loss %']) || 0,
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        createdDate: new Date(),
      }));

      setData([...data, ...importedData]);
      message.success(`${importedData.length} process records imported successfully`);
    } catch (error) {
      message.error('Failed to read Excel file');
      console.error(error);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('process');
    message.success('Sample Excel downloaded');
  };

  const filteredData = useMemo(() => {
    return data.filter((process) =>
      searchText === '' ||
      process.processCode.toLowerCase().includes(searchText.toLowerCase()) ||
      process.processName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: ProcessRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Process',
      content: 'Are you sure you want to delete this process?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setData(data.filter((item) => item.id !== id));
        message.success('Process deleted successfully');
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
      message.success('Process updated successfully');
    } else {
      const newProcess: ProcessRecord = {
        ...values,
        id: Date.now().toString(),
        createdDate: new Date(),
      };
      setData([newProcess, ...data]);
      message.success('Process created successfully');
    }
    setDrawerVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Process Code',
      dataIndex: 'processCode',
      key: 'processCode',
      width: 100,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Process Name',
      dataIndex: 'processName',
      key: 'processName',
      width: 150,
    },
    {
      title: 'Is Job Work',
      dataIndex: 'isJobWork',
      key: 'isJobWork',
      width: 120,
      render: (isJobWork: boolean) => (
        <Tag color={isJobWork ? 'blue' : 'default'}>
          {isJobWork ? 'Job Work' : 'In-House'}
        </Tag>
      ),
    },
    {
      title: 'Expected Loss %',
      dataIndex: 'expectedLossPercent',
      key: 'expectedLossPercent',
      width: 130,
      render: (value: number) => `${value}%`,
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
      title: 'Actions',
      key: 'actions',
      width: 100,
      render: (_: any, record: ProcessRecord) => (
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
        title="Process / Operation Master"
        extra={
          <Space>
            <Input.Search
              placeholder="Search process code or name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Process
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, padding: '12px 16px', background: 'var(--page-bg)', borderRadius: 8 }}>
          <Space size="middle">
            <Upload accept=".xlsx,.xls" showUploadList={false} beforeUpload={() => false}
              onChange={(info) => { const file = info.file.originFileObj || info.file; if (file) handleFileSelect(file as File); }}>
              <Button icon={<UploadOutlined />} size="large" style={{ minWidth: 160 }}>Upload Excel</Button>
            </Upload>
            <Button icon={<DownloadOutlined />} size="large" onClick={handleDownloadSample} style={{ minWidth: 180 }}>
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

      {/* Process Form Drawer */}
      <Drawer
        title={editingRecord ? 'Edit Process' : 'Add New Process'}
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
            name="processCode"
            label="Process Code"
            rules={[{ required: true, message: 'Please enter process code' }]}
          >
            <Input placeholder="e.g., CUT, STITCH, WASH" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="processName"
            label="Process Name"
            rules={[{ required: true, message: 'Please enter process name' }]}
          >
            <Input placeholder="e.g., Cutting, Stitching, Washing" />
          </Form.Item>

          <Form.Item
            name="expectedLossPercent"
            label="Expected Loss %"
            initialValue={0}
            rules={[{ required: true, message: 'Please enter expected loss %' }]}
          >
            <InputNumber min={0} max={100} step={0.1} />
          </Form.Item>

          <Form.Item name="isJobWork" valuePropName="checked" initialValue={false}>
            <Checkbox>Is Job Work (External)</Checkbox>
          </Form.Item>

          <Form.Item
            name="status"
            label="Status"
            initialValue="active"
            rules={[{ required: true, message: 'Please select status' }]}
          >
            <select style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid var(--color-d9d9d9)' }}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </Form.Item>

        </Form>
      </Drawer>
    </div>
  );
};

export default ProcessMasterScreen;
