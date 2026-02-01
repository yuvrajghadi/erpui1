/**
 * Trim & Accessories Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Button, Space, Tag, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import type { TrimAccessoriesMaster as TrimType } from '../types';

const TrimAccessoriesMaster: React.FC = () => {
  const [dataSource] = useState<TrimType[]>([
    {
      itemCode: 'TRIM001',
      itemName: 'Metal Button - Silver',
      category: 'Button',
      subCategory: 'Metal',
      supplier: 'ABC Trims Ltd',
      defaultUOM: 'Piece',
      minStock: 1000,
      reorderLevel: 500,
      status: 'Active',
    },
    {
      itemCode: 'TRIM002',
      itemName: 'YKK Zipper - 5"',
      category: 'Zipper',
      subCategory: 'Metal',
      supplier: 'YKK India',
      defaultUOM: 'Piece',
      minStock: 500,
      reorderLevel: 200,
      status: 'Active',
    },
  ]);

  const columns = [
    { title: 'Item Code', dataIndex: 'itemCode', key: 'itemCode', width: 120, render: (text: string) => <Tag color="cyan">{text}</Tag> },
    { title: 'Item Name', dataIndex: 'itemName', key: 'itemName', width: 200 },
    { title: 'Category', dataIndex: 'category', key: 'category', width: 120 },
    { title: 'Sub-Category', dataIndex: 'subCategory', key: 'subCategory', width: 120 },
    { title: 'Supplier', dataIndex: 'supplier', key: 'supplier', width: 150 },
    { title: 'UOM', dataIndex: 'defaultUOM', key: 'defaultUOM', width: 80 },
    { title: 'Min Stock', dataIndex: 'minStock', key: 'minStock', width: 100, align: 'right' as const },
    { title: 'Reorder Level', dataIndex: 'reorderLevel', key: 'reorderLevel', width: 120, align: 'right' as const },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: 'flex', gap: 12 }}>
        <Input placeholder="Search..." prefix={<SearchOutlined />} style={{ width: 250 }} />
        <Select defaultValue="all" style={{ width: 150 }}><Select.Option value="all">All Categories</Select.Option></Select>
      </div>
      <Table columns={columns} dataSource={dataSource} rowKey="itemCode" pagination={{ pageSize: 10 }} size="small" bordered />
    </div>
  );
};

export default TrimAccessoriesMaster;
