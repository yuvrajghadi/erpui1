/**
 * UOM Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { UOMMaster as UOMType } from '../types';

const UOMMaster: React.FC = () => {
  const [dataSource] = useState<UOMType[]>([
    { uomCode: 'UOM001', uomName: 'Meter', conversionBase: 'Base', status: 'Active' },
    { uomCode: 'UOM002', uomName: 'KG', conversionBase: 'Base', status: 'Active' },
    { uomCode: 'UOM003', uomName: 'Piece', conversionBase: 'Base', status: 'Active' },
  ]);

  const columns = [
    { title: 'UOM Code', dataIndex: 'uomCode', key: 'uomCode', width: 120, render: (text: string) => <Tag color="green">{text}</Tag> },
    { title: 'UOM Name', dataIndex: 'uomName', key: 'uomName', width: 200 },
    { title: 'Conversion Base', dataIndex: 'conversionBase', key: 'conversionBase', width: 150 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="uomCode" pagination={false} size="small" bordered />;
};

export default UOMMaster;
