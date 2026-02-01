/**
 * Shade Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { ShadeMaster as ShadeType } from '../types';

const ShadeMaster: React.FC = () => {
  const [dataSource] = useState<ShadeType[]>([
    { shadeCode: 'SHD001', shadeName: 'Navy Blue', shadeGroup: 'Solid', status: 'Active', createdDate: '2025-01-01' },
    { shadeCode: 'SHD002', shadeName: 'Sky Blue', shadeGroup: 'Solid', status: 'Active', createdDate: '2025-01-02' },
    { shadeCode: 'SHD003', shadeName: 'Charcoal Grey', shadeGroup: 'Heather', status: 'Active', createdDate: '2025-01-03' },
  ]);

  const columns = [
    { title: 'Shade Code', dataIndex: 'shadeCode', key: 'shadeCode', width: 120, render: (text: string) => <Tag color="purple">{text}</Tag> },
    { title: 'Shade Name', dataIndex: 'shadeName', key: 'shadeName', width: 200 },
    { title: 'Shade Group', dataIndex: 'shadeGroup', key: 'shadeGroup', width: 150, render: (text: string) => <Tag color="magenta">{text}</Tag> },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="shadeCode" pagination={{ pageSize: 10 }} size="small" bordered />;
};

export default ShadeMaster;
