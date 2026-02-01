/**
 * Material Category Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { MaterialCategoryMaster as CategoryType } from '../types';

const MaterialCategoryMaster: React.FC = () => {
  const [dataSource] = useState<CategoryType[]>([
    { categoryCode: 'CAT001', categoryName: 'Fabric', description: 'All fabric materials', status: 'Active' },
    { categoryCode: 'CAT002', categoryName: 'Trim', description: 'Buttons, zippers, labels', status: 'Active' },
    { categoryCode: 'CAT003', categoryName: 'Accessory', description: 'Threads, elastics, tapes', status: 'Active' },
    { categoryCode: 'CAT004', categoryName: 'Packaging', description: 'Poly bags, cartons, hangers', status: 'Active' },
  ]);

  const columns = [
    { title: 'Category Code', dataIndex: 'categoryCode', key: 'categoryCode', width: 140, render: (text: string) => <Tag color="geekblue">{text}</Tag> },
    { title: 'Category Name', dataIndex: 'categoryName', key: 'categoryName', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 300 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="categoryCode" pagination={false} size="small" bordered />;
};

export default MaterialCategoryMaster;
