/**
 * Reserved Stock
 * Track reserved inventory for orders/production
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Tag,
  Tooltip,
  Progress,
  message,
} from 'antd';
import {
  SearchOutlined,
  LockOutlined,
  UnlockOutlined,
  FileTextOutlined,
  CloseCircleOutlined,
  WarningOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';

interface ReservedStock {
  id: string;
  materialCode: string;
  materialName: string;
  reservedQty: number;
  availableQty: number;
  uom: string;
  reservedFor: string;
  orderNumber: string;
  reservationDate: Date;
  expiryDate: Date;
  status: 'active' | 'expired' | 'consumed' | 'cancelled';
  reservationStatus?: 'active' | 'expired' | 'consumed' | 'cancelled';
  autoReleaseOnExpiry?: boolean;
  expiryAction?: 'release' | 'extend' | 'manual_approval';
  daysUntilExpiry?: number;
}

const ReservedStockScreen: React.FC = () => {
  const [data, setData] = useState<ReservedStock[]>([
    {
      id: '1',
      materialCode: 'FAB-001',
      materialName: 'Cotton Fabric - White',
      reservedQty: 500,
      availableQty: 1500,
      uom: 'kg',
      reservedFor: 'Production Order',
      orderNumber: 'PO-2024-001',
      reservationDate: new Date('2024-01-10'),
      expiryDate: new Date('2024-01-30'),
      status: 'active',
    },
  ]);

  const columns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      fixed: 'left' as const,
      width: 130,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Reserved Qty',
      dataIndex: 'reservedQty',
      key: 'reservedQty',
      width: 120,
      align: 'right' as const,
      render: (qty: number, record: ReservedStock) => `${qty} ${record.uom}`,
    },
    {
      title: 'Available Qty',
      dataIndex: 'availableQty',
      key: 'availableQty',
      width: 120,
      align: 'right' as const,
      render: (qty: number, record: ReservedStock) => `${qty} ${record.uom}`,
    },
    {
      title: 'Reservation %',
      key: 'percentage',
      width: 150,
      render: (_: any, record: ReservedStock) => {
        const percentage = (record.reservedQty / (record.reservedQty + record.availableQty)) * 100;
        return <Progress percent={Number(percentage.toFixed(1))} size="small" />;
      },
    },
    {
      title: 'Reserved For',
      dataIndex: 'reservedFor',
      key: 'reservedFor',
      width: 140,
    },
    {
      title: 'Order Number',
      dataIndex: 'orderNumber',
      key: 'orderNumber',
      width: 130,
    },
    {
      title: 'Reservation Date',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
      width: 130,
      render: (date: Date) => dayjs(date).format('DD-MMM-YYYY'),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 130,
      render: (date: Date) => {
        const daysUntilExpiry = Math.floor((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
        const isExpired = daysUntilExpiry < 0;
        const isNearExpiry = daysUntilExpiry <= 7 && daysUntilExpiry >= 0;
        return (
          <Tooltip title={`${Math.abs(daysUntilExpiry)} days ${isExpired ? 'overdue' : 'remaining'}`}>
            <div>
              <div style={{ color: isExpired ? 'var(--color-ff4d4f)' : isNearExpiry ? 'var(--color-faad14)' : 'inherit' }}>
                {dayjs(date).format('DD-MMM-YYYY')}
              </div>
              {isExpired && (
                <Tag color="error" style={{ fontSize: 11 }}>EXPIRED</Tag>
              )}
              {isNearExpiry && (
                <Tag color="warning" style={{ fontSize: 11 }} icon={<WarningOutlined />}>Expiring Soon</Tag>
              )}
            </div>
          </Tooltip>
        );
      },
    },
    {
      title: 'Auto Release',
      key: 'autoRelease',
      width: 100,
      render: () => {
        const autoRelease = Math.random() > 0.5; // Mock
        return autoRelease ? <Tag color="cyan">Yes</Tag> : <Tag>Manual</Tag>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const config = {
          active: { color: 'success', icon: <LockOutlined /> },
          expired: { color: 'error', icon: <UnlockOutlined /> },
          consumed: { color: 'default', icon: <FileTextOutlined /> },
          cancelled: { color: 'default', icon: <CloseCircleOutlined /> },
        };
        const { color, icon } = config[status as keyof typeof config];
        return <Tag color={color} icon={icon}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 160,
      render: (_: any, record: ReservedStock) => (
        <Space size="small">
          {record.status === 'active' && (
            <>
              <Tooltip title="Release">
                <Button
                  type="link"
                  icon={<UnlockOutlined />}
                  size="small"
                  onClick={() => {
                    setData(data.map(item =>
                      item.id === record.id ? { ...item, status: 'cancelled' } : item
                    ));
                    message.success('Reservation released (mock)');
                  }}
                />
              </Tooltip>
              <Tooltip title="Extend Expiry">
                <Button
                  type="link"
                  size="small"
                  onClick={() => {
                    const newExpiry = new Date(record.expiryDate);
                    newExpiry.setDate(newExpiry.getDate() + 7);
                    setData(data.map(item =>
                      item.id === record.id ? { ...item, expiryDate: newExpiry } : item
                    ));
                    message.success('Expiry extended by 7 days (mock)');
                  }}
                >
                  Extend
                </Button>
              </Tooltip>
            </>
          )}
          {record.status === 'expired' && (
            <Button
              type="link"
              size="small"
              onClick={() => {
                setData(data.map(item =>
                  item.id === record.id ? { ...item, status: 'cancelled' } : item
                ));
                message.info('Expired reservation released to available stock (mock)');
              }}
            >
              Release to Stock
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="reserved-stock-screen">
      <Card
        title={
          <Space>
            <LockOutlined />
            <span>Reserved Stock</span>
          </Space>
        }
        extra={
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            allowClear
          />
        }
      >
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          scroll={{ x: 1400 }}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reservations`,
          }}
        />
      </Card>
    </div>
  );
};

export default ReservedStockScreen;
