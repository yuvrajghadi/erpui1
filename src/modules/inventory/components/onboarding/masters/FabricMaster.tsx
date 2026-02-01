/**
 * Fabric Master Screen
 * Excel-first master data management for fabrics
 */

'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Select, message, Divider } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import type { FabricMaster as FabricMasterType } from '../types';
import ExcelUploadButtonGroup from '../components/ExcelUploadButtonGroup';
import ExcelPreviewModal from '../components/ExcelPreviewModal';
import { generateSampleExcel } from '../utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';

const FabricMaster: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Excel upload state
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);

  // Mock data
  const [dataSource, setDataSource] = useState<FabricMasterType[]>([
    {
      fabricCode: 'FAB001',
      type: 'Woven',
      construction: 'Plain Weave',
      composition: '100% Cotton',
      gsm: 180,
      widthM: 1.5,
      shrinkagePercent: 2.5,
      defaultUOM: 'Meter',
      shadeGroup: 'Solid',
      status: 'Active',
    },
    {
      fabricCode: 'FAB002',
      type: 'Knitted',
      construction: 'Jersey',
      composition: '95% Cotton, 5% Elastane',
      gsm: 160,
      widthM: 1.8,
      shrinkagePercent: 3.0,
      defaultUOM: 'KG',
      shadeGroup: 'Heather',
      status: 'Active',
    },
    {
      fabricCode: 'FAB003',
      type: 'Woven',
      construction: 'Twill',
      composition: '80% Cotton, 20% Polyester',
      gsm: 220,
      widthM: 1.5,
      shrinkagePercent: 1.5,
      defaultUOM: 'Meter',
      shadeGroup: 'Denim',
      status: 'Active',
    },
  ]);

  const columns = [
    {
      title: 'Fabric Code',
      dataIndex: 'fabricCode',
      key: 'fabricCode',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 100,
    },
    {
      title: 'Construction',
      dataIndex: 'construction',
      key: 'construction',
      width: 140,
    },
    {
      title: 'Composition',
      dataIndex: 'composition',
      key: 'composition',
      width: 200,
    },
    {
      title: 'GSM',
      dataIndex: 'gsm',
      key: 'gsm',
      width: 80,
      align: 'right' as const,
    },
    {
      title: 'Width (M)',
      dataIndex: 'widthM',
      key: 'widthM',
      width: 100,
      align: 'right' as const,
    },
    {
      title: 'Shrinkage %',
      dataIndex: 'shrinkagePercent',
      key: 'shrinkagePercent',
      width: 110,
      align: 'right' as const,
      render: (val: number) => `${val}%`,
    },
    {
      title: 'UOM',
      dataIndex: 'defaultUOM',
      key: 'defaultUOM',
      width: 80,
    },
    {
      title: 'Shade Group',
      dataIndex: 'shadeGroup',
      key: 'shadeGroup',
      width: 120,
      render: (text: string) => <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      fixed: 'right' as const,
      render: (status: string) => (
        <Tag color={status === 'Active' ? 'success' : 'default'}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right' as const,
      render: () => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={() => message.info('Edit functionality coming soon')}
          />
          <Button
            type="link"
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={() => message.info('Delete functionality coming soon')}
          />
        </Space>
      ),
    },
  ];

  const filteredData = dataSource.filter(item => {
    const matchesSearch = searchText === '' ||
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Excel upload handlers
  const handleFileSelect = async (file: File) => {
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      // Map Excel columns to data structure
      const mappedData = jsonData.map((row: any, index: number) => ({
        key: index,
        fabricCode: row['Fabric Code'] || '',
        type: row['Type'] || '',
        construction: row['Construction'] || '',
        composition: row['Composition'] || '',
        gsm: row['GSM'] || 0,
        widthM: row['Width (M)'] || 0,
        shrinkagePercent: row['Shrinkage %'] || 0,
        defaultUOM: row['Default UOM'] || '',
        shadeGroup: row['Shade Group'] || '',
        status: row['Status'] || 'Active',
      }));
      
      setPreviewData(mappedData);
      setPreviewModalOpen(true);
    } catch (error) {
      message.error('Failed to read Excel file');
      console.error(error);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('fabric');
    message.success('Sample Excel downloaded successfully');
  };

  const handleConfirmImport = async () => {
    setImportLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setDataSource([...dataSource, ...previewData]);
      message.success(`${previewData.length} fabric records imported successfully`);
      setPreviewModalOpen(false);
      setPreviewData([]);
    } catch (error) {
      message.error('Failed to import data');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Excel Upload Section */}
      <ExcelUploadButtonGroup
        masterName="Fabric Master"
        onFileSelect={handleFileSelect}
        onDownloadSample={handleDownloadSample}
      />

      <Divider style={{ margin: '24px 0' }} />

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        background: 'var(--page-bg)',
        borderRadius: 8,
      }}>
        <Space>
          <Input
            placeholder="Search fabrics..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 250 }}
          />
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 120 }}
          >
            <Select.Option value="all">All Status</Select.Option>
            <Select.Option value="Active">Active</Select.Option>
            <Select.Option value="Inactive">Inactive</Select.Option>
          </Select>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => message.info('Add new fabric functionality coming soon')}
        >
          Add Fabric
        </Button>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="fabricCode"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} fabrics`,
        }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
      />

      {/* Excel Preview Modal */}
      <ExcelPreviewModal
        open={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewData([]);
        }}
        onConfirm={handleConfirmImport}
        data={previewData}
        columns={columns}
        masterName="Fabric Master"
        loading={importLoading}
      />
    </div>
  );
};

export default FabricMaster;
