/**
 * Stock Ledger / Transaction History
 * Comprehensive audit trail of all stock-impacting transactions
 */

'use client';

import React, { useState } from 'react';
import {
  Card,
  Table,
  Button,
  Space,
  Input,
  Select,
  Tag,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  SearchOutlined,
  ExportOutlined,
  HistoryOutlined,
  FilterOutlined,
} from '@ant-design/icons';
import type { StockLedgerEntry } from '../../types';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;

const SAMPLE_LEDGER: StockLedgerEntry[] = [
  {
    id: '1',
    transactionDate: new Date('2025-01-10'),
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2025-001',
    referenceType: 'grn',
    referenceNumber: 'FGRN-000001',
    inQuantity: 500,
    outQuantity: 0,
    balanceQuantity: 500,
    uom: 'kg',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    rackCode: 'R-01',
    binCode: 'B-05',
    userName: 'John Doe',
    department: 'Receiving',
    remarks: 'GRN from Supplier A',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '2',
    transactionDate: new Date('2025-01-10'),
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2025-001',
    referenceType: 'issue',
    referenceNumber: 'ISS-000001',
    inQuantity: 0,
    outQuantity: 150,
    balanceQuantity: 350,
    uom: 'kg',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    userName: 'Jane Smith',
    department: 'Cutting',
    remarks: 'Issued for Style PO-2025-001',
    createdAt: new Date('2025-01-10'),
  },
  {
    id: '3',
    transactionDate: new Date('2025-01-09'),
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2024-099',
    referenceType: 'adjustment',
    referenceNumber: 'ADJ-000001',
    inQuantity: 0,
    outQuantity: 10,
    balanceQuantity: 490,
    uom: 'kg',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    userName: 'Admin',
    department: 'Inventory Control',
    remarks: 'Physical count adjustment - damage found',
    createdAt: new Date('2025-01-09'),
  },
  {
    id: '4',
    transactionDate: new Date('2025-01-08'),
    materialCode: 'TRM-BTN-005',
    materialName: 'Plastic Button - White 15mm',
    lotNumber: 'LOT-2025-002',
    referenceType: 'transfer',
    referenceNumber: 'TRF-000001',
    inQuantity: 1000,
    outQuantity: 0,
    balanceQuantity: 2500,
    uom: 'piece',
    warehouseId: 'WH-002',
    warehouseName: 'Trims Warehouse',
    rackCode: 'R-05',
    binCode: 'B-12',
    userName: 'Store Keeper',
    department: 'Stores',
    remarks: 'Transferred from WH-001',
    createdAt: new Date('2025-01-08'),
  },
  {
    id: '5',
    transactionDate: new Date('2025-01-07'),
    materialCode: 'FAB-WV-012',
    materialName: 'Polyester Suiting Fabric - Black',
    lotNumber: 'LOT-2025-003',
    referenceType: 'return',
    referenceNumber: 'RTN-000001',
    inQuantity: 25,
    outQuantity: 0,
    balanceQuantity: 325,
    uom: 'meter',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    userName: 'Production Manager',
    department: 'Production',
    remarks: 'Unused material returned from cutting',
    createdAt: new Date('2025-01-07'),
  },
  {
    id: '6',
    transactionDate: new Date('2025-01-06'),
    materialCode: 'FAB-KN-001',
    materialName: 'Cotton Single Jersey - White',
    lotNumber: 'LOT-2025-001',
    referenceType: 'job_work_out',
    referenceNumber: 'JWO-000001',
    inQuantity: 0,
    outQuantity: 100,
    balanceQuantity: 250,
    uom: 'kg',
    warehouseId: 'WH-001',
    warehouseName: 'Main Warehouse',
    userName: 'Logistics',
    department: 'Job Work',
    remarks: 'Sent to Vendor ABC for printing',
    createdAt: new Date('2025-01-06'),
  },
];

const StockLedgerScreen: React.FC = () => {
  const [data] = useState<StockLedgerEntry[]>(SAMPLE_LEDGER);
  const [loading] = useState(false);
  const [filterMaterial, setFilterMaterial] = useState<string>();
  const [filterLot, setFilterLot] = useState<string>();
  const [filterType, setFilterType] = useState<string>();

  const columns = [
    {
      title: 'Date',
      dataIndex: 'transactionDate',
      key: 'transactionDate',
      width: 110,
      fixed: 'left' as const,
      render: (date: Date) => dayjs(date).format('DD-MMM-YY'),
      sorter: (a: StockLedgerEntry, b: StockLedgerEntry) =>
        new Date(a.transactionDate).getTime() - new Date(b.transactionDate).getTime(),
    },
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
      fixed: 'left' as const,
      render: (text: string) => <strong>{text}</strong>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Lot/Batch',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 120,
      render: (lot: string) => lot ? <Tag color="purple">{lot}</Tag> : '-',
    },
    {
      title: 'Reference Type',
      dataIndex: 'referenceType',
      key: 'referenceType',
      width: 140,
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          grn: 'green',
          issue: 'blue',
          return: 'cyan',
          job_work_out: 'geekblue',
          job_work_in: 'purple',
          adjustment: 'orange',
          transfer: 'magenta',
          opening_balance: 'default',
          damaged: 'red',
          consumption: 'volcano',
        };
        return <Tag color={colorMap[type]}>{type.toUpperCase().replace('_', ' ')}</Tag>;
      },
    },
    {
      title: 'Reference No.',
      dataIndex: 'referenceNumber',
      key: 'referenceNumber',
      width: 130,
      render: (ref: string) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{ref}</span>,
    },
    {
      title: 'In Qty',
      dataIndex: 'inQuantity',
      key: 'inQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => (
        qty > 0 ? <span style={{ color: 'var(--color-52c41a)', fontWeight: 500 }}>+{qty.toFixed(2)}</span> : '-'
      ),
    },
    {
      title: 'Out Qty',
      dataIndex: 'outQuantity',
      key: 'outQuantity',
      width: 100,
      align: 'right' as const,
      render: (qty: number) => (
        qty > 0 ? <span style={{ color: 'var(--color-ff4d4f)', fontWeight: 500 }}>-{qty.toFixed(2)}</span> : '-'
      ),
    },
    {
      title: 'Balance Qty',
      dataIndex: 'balanceQuantity',
      key: 'balanceQuantity',
      width: 120,
      align: 'right' as const,
      render: (qty: number, record: StockLedgerEntry) => (
        <strong>{qty.toFixed(2)} {record.uom}</strong>
      ),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
      width: 150,
    },
    {
      title: 'Rack/Bin',
      key: 'location',
      width: 100,
      render: (_: any, record: StockLedgerEntry) =>
        record.rackCode && record.binCode ? `${record.rackCode}-${record.binCode}` : '-',
    },
    {
      title: 'User',
      dataIndex: 'userName',
      key: 'userName',
      width: 120,
    },
    {
      title: 'Department',
      dataIndex: 'department',
      key: 'department',
      width: 120,
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      ellipsis: true,
    },
  ];

  const filteredData = data.filter((item) => {
    if (filterMaterial && !item.materialCode.includes(filterMaterial)) return false;
    if (filterLot && !item.lotNumber?.includes(filterLot)) return false;
    if (filterType && item.referenceType !== filterType) return false;
    return true;
  });

  return (
    <div className="stock-ledger-screen">
      <Card
        title={
          <Space>
            <HistoryOutlined style={{ fontSize: 18 }} />
            <span>Stock Ledger / Transaction History</span>
          </Space>
        }
        extra={
          <Space wrap>
            <Button icon={<ExportOutlined />} size="small">
              Export
            </Button>
          </Space>
        }
      >
        <Row gutter={[16, 16]} style={{ marginBottom: 16 }}>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Material Code"
              prefix={<SearchOutlined />}
              value={filterMaterial}
              onChange={(e) => setFilterMaterial(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Input
              placeholder="Lot Number"
              prefix={<FilterOutlined />}
              value={filterLot}
              onChange={(e) => setFilterLot(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              placeholder="Transaction Type"
              style={{ width: '100%' }}
              value={filterType}
              onChange={setFilterType}
              allowClear
              options={[
                { value: 'grn', label: 'GRN' },
                { value: 'issue', label: 'Issue' },
                { value: 'return', label: 'Return' },
                { value: 'job_work_out', label: 'Job Work Out' },
                { value: 'job_work_in', label: 'Job Work In' },
                { value: 'adjustment', label: 'Adjustment' },
                { value: 'transfer', label: 'Transfer' },
              ]}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <RangePicker style={{ width: '100%' }} />
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          loading={loading}
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
          size="small"
          summary={(pageData) => {
            const totalIn = pageData.reduce((sum, record) => sum + record.inQuantity, 0);
            const totalOut = pageData.reduce((sum, record) => sum + record.outQuantity, 0);
            return (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={6}>
                  <strong>Page Total</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6} align="right">
                  <strong style={{ color: 'var(--color-52c41a)' }}>+{totalIn.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7} align="right">
                  <strong style={{ color: 'var(--color-ff4d4f)' }}>-{totalOut.toFixed(2)}</strong>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8} colSpan={6} />
              </Table.Summary.Row>
            );
          }}
        />
      </Card>
    </div>
  );
};

export default StockLedgerScreen;
