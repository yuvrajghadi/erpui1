/**
 * Warehouse Zone Master
 * Manage warehouse zones for receiving, inspection, storage, WIP, and dispatch
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

interface WarehouseZoneRecord {
  id: string;
  zoneCode: string;
  zoneName: string;
  description: string;
  status: 'active' | 'inactive';
  createdDate: Date;
}

const SAMPLE_ZONES: WarehouseZoneRecord[] = [
  {
    id: '1',
    zoneCode: 'RCV',
    zoneName: 'Receiving',
    description: 'Zone for incoming goods and raw materials',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '2',
    zoneCode: 'INS',
    zoneName: 'Inspection',
    description: 'Quality check and inspection zone',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '3',
    zoneCode: 'STG',
    zoneName: 'Storage',
    description: 'Main storage area for finished goods',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '4',
    zoneCode: 'WIP',
    zoneName: 'Work In Progress',
    description: 'Zone for items under production',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
  {
    id: '5',
    zoneCode: 'DIS',
    zoneName: 'Dispatch',
    description: 'Zone for goods ready for shipment',
    status: 'active',
    createdDate: new Date('2025-12-15'),
  },
];

const WarehouseZoneMasterScreen: React.FC = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState<WarehouseZoneRecord[]>(SAMPLE_ZONES);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<WarehouseZoneRecord | null>(null);
  const [searchText, setSearchText] = useState('');

  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      const importedData: WarehouseZoneRecord[] = jsonData.map((row, index) => ({
        id: `imported-${Date.now()}-${index}`,
        zoneCode: row['Zone Code'] || row['Warehouse'] || '',
        zoneName: row['Zone Name'] || '',
        description: row['Description'] || '',
        status: (row['Status']?.toLowerCase() === 'active' ? 'active' : 'inactive') as 'active' | 'inactive',
        createdDate: new Date(),
      }));

      setData([...data, ...importedData]);
      message.success(`${importedData.length} zone records imported successfully`);
    } catch (error) {
      message.error('Failed to read Excel file');
      console.error(error);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('warehouse-zone');
    message.success('Sample Excel downloaded');
  };

  const filteredData = useMemo(() => {
    return data.filter((zone) =>
      searchText === '' ||
      zone.zoneCode.toLowerCase().includes(searchText.toLowerCase()) ||
      zone.zoneName.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [data, searchText]);

  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setDrawerVisible(true);
  };

  const handleEdit = (record: WarehouseZoneRecord) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setDrawerVisible(true);
  };

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Delete Zone',
      content: 'Are you sure you want to delete this warehouse zone?',
      okText: 'Delete',
      okType: 'danger',
      cancelText: 'Cancel',
      onOk() {
        setData(data.filter((item) => item.id !== id));
        message.success('Warehouse zone deleted successfully');
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
      message.success('Warehouse zone updated successfully');
    } else {
      const newZone: WarehouseZoneRecord = {
        ...values,
        id: Date.now().toString(),
        createdDate: new Date(),
      };
      setData([newZone, ...data]);
      message.success('Warehouse zone created successfully');
    }
    setDrawerVisible(false);
    form.resetFields();
  };

  const columns = [
    {
      title: 'Zone Code',
      dataIndex: 'zoneCode',
      key: 'zoneCode',
      width: 100,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Zone Name',
      dataIndex: 'zoneName',
      key: 'zoneName',
      width: 150,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      flex: 1,
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
      render: (_: any, record: WarehouseZoneRecord) => (
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
        title="Warehouse Zone Master"
        extra={
          <Space>
            <Input.Search
              placeholder="Search zone code or name..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ width: 250 }}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
              Add Zone
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

      {/* Zone Form Drawer */}
      <Drawer
        title={editingRecord ? 'Edit Warehouse Zone' : 'Add New Warehouse Zone'}
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
            name="zoneCode"
            label="Zone Code"
            rules={[{ required: true, message: 'Please enter zone code' }]}
          >
            <Input placeholder="e.g., RCV, INS, STG, WIP, DIS" maxLength={10} />
          </Form.Item>

          <Form.Item
            name="zoneName"
            label="Zone Name"
            rules={[{ required: true, message: 'Please enter zone name' }]}
          >
            <Input placeholder="e.g., Receiving, Inspection, Storage" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea
              placeholder="Description of the warehouse zone"
              rows={4}
            />
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

export default WarehouseZoneMasterScreen;
