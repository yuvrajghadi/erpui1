/**
 * Warehouse Zone Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag } from 'antd';
import type { WarehouseZoneMaster as WarehouseType } from '../types';

const WarehouseZoneMaster: React.FC = () => {
  const [dataSource] = useState<WarehouseType[]>([
    { zoneCode: 'ZONE-A', zoneName: 'Raw Material Zone', description: 'Storage for fabric rolls', status: 'Active' },
    { zoneCode: 'ZONE-B', zoneName: 'WIP Zone', description: 'Work in progress storage', status: 'Active' },
    { zoneCode: 'ZONE-C', zoneName: 'Finished Goods', description: 'Packed garments ready for dispatch', status: 'Active' },
  ]);

  const columns = [
    { title: 'Zone Code', dataIndex: 'zoneCode', key: 'zoneCode', width: 120, render: (text: string) => <Tag color="cyan">{text}</Tag> },
    { title: 'Zone Name', dataIndex: 'zoneName', key: 'zoneName', width: 200 },
    { title: 'Description', dataIndex: 'description', key: 'description', width: 300 },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="zoneCode" pagination={false} size="small" bordered />;
};

export default WarehouseZoneMaster;
