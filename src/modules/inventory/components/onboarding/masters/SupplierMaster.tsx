/**
 * Supplier Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag, Input, Select, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { SupplierMaster as SupplierType } from '../types';

const SupplierMaster: React.FC = () => {
  const [dataSource] = useState<SupplierType[]>([
    {
      supplierCode: 'SUP001',
      supplierName: 'Fabric Mills Ltd',
      type: ['Fabric'],
      contactPerson: 'John Doe',
      phone: '+91 98765 43210',
      email: 'john@fabricmills.com',
      gstNumber: '29ABCDE1234F1Z5',
      paymentTerms: '30 Days',
      leadTimeDays: 15,
      status: 'Active',
    },
    {
      supplierCode: 'SUP002',
      supplierName: 'ABC Trims',
      type: ['Trim', 'Accessory'],
      contactPerson: 'Jane Smith',
      phone: '+91 98765 43211',
      email: 'jane@abctrims.com',
      paymentTerms: '45 Days',
      leadTimeDays: 7,
      status: 'Active',
    },
  ]);

  const columns = [
    { title: 'Supplier Code', dataIndex: 'supplierCode', key: 'supplierCode', width: 120, render: (text: string) => <Tag color="purple">{text}</Tag> },
    { title: 'Supplier Name', dataIndex: 'supplierName', key: 'supplierName', width: 200 },
    { title: 'Type', dataIndex: 'type', key: 'type', width: 150, render: (types: string[]) => types.map(t => <Tag key={t} color="blue">{t}</Tag>) },
    { title: 'Contact Person', dataIndex: 'contactPerson', key: 'contactPerson', width: 150 },
    { title: 'Phone', dataIndex: 'phone', key: 'phone', width: 140 },
    { title: 'Payment Terms', dataIndex: 'paymentTerms', key: 'paymentTerms', width: 120 },
    { title: 'Lead Time', dataIndex: 'leadTimeDays', key: 'leadTimeDays', width: 100, render: (days: number) => `${days} days` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <Input placeholder="Search suppliers..." prefix={<SearchOutlined />} style={{ width: 300 }} />
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="supplierCode" pagination={{ pageSize: 10 }} size="small" bordered scroll={{ x: 'max-content' }} />
    </div>
  );
};

export default SupplierMaster;
