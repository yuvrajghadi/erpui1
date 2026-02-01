/**
 * Process / Operation Master Screen
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag, Switch } from 'antd';
import type { ProcessOperationMaster as ProcessType } from '../types';

const ProcessOperationMaster: React.FC = () => {
  const [dataSource] = useState<ProcessType[]>([
    { processCode: 'PROC001', processName: 'Cutting', isJobWork: false, expectedLossPercent: 2.0, status: 'Active' },
    { processCode: 'PROC002', processName: 'Stitching', isJobWork: true, expectedLossPercent: 1.5, status: 'Active' },
    { processCode: 'PROC003', processName: 'Washing', isJobWork: true, expectedLossPercent: 4.0, status: 'Active' },
    { processCode: 'PROC004', processName: 'Finishing', isJobWork: false, expectedLossPercent: 0.5, status: 'Active' },
  ]);

  const columns = [
    { title: 'Process Code', dataIndex: 'processCode', key: 'processCode', width: 120, render: (text: string) => <Tag color="orange">{text}</Tag> },
    { title: 'Process Name', dataIndex: 'processName', key: 'processName', width: 200 },
    { title: 'Job Work', dataIndex: 'isJobWork', key: 'isJobWork', width: 120, render: (isJobWork: boolean) => <Switch checked={isJobWork} disabled /> },
    { title: 'Expected Loss %', dataIndex: 'expectedLossPercent', key: 'expectedLossPercent', width: 140, align: 'right' as const, render: (val: number) => `${val}%` },
    { title: 'Status', dataIndex: 'status', key: 'status', width: 100, render: (status: string) => <Tag color={status === 'Active' ? 'success' : 'default'}>{status}</Tag> },
  ];

  return <Table columns={columns} dataSource={dataSource} rowKey="processCode" pagination={false} size="small" bordered />;
};

export default ProcessOperationMaster;
