/**
 * BOM / Design Card Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { BOMMaster as BOMType } from '../types';
import * as XLSX from 'xlsx';
import { generateSampleExcel } from '../../onboarding/utils/sampleExcelGenerator';
import ExcelUploadButtonGroup from '../components/ExcelUploadButtonGroup';

const BOMMaster: React.FC = () => {
  const [dataSource] = useState<BOMType[]>([
    { bomCode: 'BOM001', style: 'ST-401', buyer: 'ABC Retail', season: 'Spring 2025', version: 'v1', status: 'Approved', createdDate: '2025-01-05' },
    { bomCode: 'BOM002', style: 'ST-402', buyer: 'XYZ Fashion', season: 'Summer 2025', version: 'v2', status: 'Draft', createdDate: '2025-01-08' },
  ]);

  const columns = [
    { title: 'BOM Code', dataIndex: 'bomCode', key: 'bomCode', width: 120, render: (text: string) => <Tag color="red">{text}</Tag> },
    { title: 'Style', dataIndex: 'style', key: 'style', width: 120, render: (text: string) => <Tag color="blue">{text}</Tag> },
    { title: 'Buyer', dataIndex: 'buyer', key: 'buyer', width: 150 },
    { title: 'Season', dataIndex: 'season', key: 'season', width: 120 },
    { title: 'Version', dataIndex: 'version', key: 'version', width: 80, render: (text: string) => <Tag color="purple">{text}</Tag> },
    { 
      title: 'Status', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100, 
      render: (status: string) => (
        <Tag color={status === 'Approved' ? 'success' : status === 'Draft' ? 'warning' : 'default'}>
          {status}
        </Tag>
      )
    },
  ];

  const handleFileSelect = async (file: File) => {
    try {
      const buffer = await file.arrayBuffer();
      const wb = XLSX.read(buffer);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows: any[] = XLSX.utils.sheet_to_json(ws);
      // For BOM, just log or show a message — real import handled elsewhere
      console.log('Imported BOM rows:', rows);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('bom');
  };

  return (
    <div>
      <div style={{ marginBottom: 12 }}>
        <ExcelUploadButtonGroup
          masterName="BOM"
          onFileSelect={handleFileSelect}
          onDownloadSample={handleDownloadSample}
        />
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="bomCode" pagination={{ pageSize: 10 }} size="small" bordered />
    </div>
  );
};

export default BOMMaster;
