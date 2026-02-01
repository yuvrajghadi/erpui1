/**
 * Reservation Aging Report
 * Track reserved stock aging and identify blocked inventory
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';
import dayjs from 'dayjs';

interface ReservationAgingData {
  key: string;
  item: string;
  styleOrderNo: string;
  reservedQty: number;
  uom: string;
  reservationDate: string;
  daysReserved: number;
  reservationStatus: string;
  agingBucket: string;
}

const ReservationAgingReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<ReservationAgingData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: ReservationAgingData[] = [
    {
      key: '1',
      item: 'Cotton Poplin White',
      styleOrderNo: 'STY-2024-001 / ORD-5001',
      reservedQty: 500,
      uom: 'Meters',
      reservationDate: '2026-01-08',
      daysReserved: 2,
      reservationStatus: 'Active',
      agingBucket: '0-7',
    },
    {
      key: '2',
      item: 'Polyester Satin Blue',
      styleOrderNo: 'STY-2024-002 / ORD-5002',
      reservedQty: 300,
      uom: 'Meters',
      reservationDate: '2026-01-05',
      daysReserved: 5,
      reservationStatus: 'Active',
      agingBucket: '0-7',
    },
    {
      key: '3',
      item: 'Denim Stretch Dark Blue',
      styleOrderNo: 'STY-2024-003 / ORD-5003',
      reservedQty: 800,
      uom: 'Meters',
      reservationDate: '2025-12-28',
      daysReserved: 13,
      reservationStatus: 'Active',
      agingBucket: '8-15',
    },
    {
      key: '4',
      item: 'Viscose Rayon Black',
      styleOrderNo: 'STY-2024-004 / ORD-5004',
      reservedQty: 400,
      uom: 'Meters',
      reservationDate: '2025-12-25',
      daysReserved: 16,
      reservationStatus: 'Active',
      agingBucket: '16-30',
    },
    {
      key: '5',
      item: 'Linen Blend Beige',
      styleOrderNo: 'STY-2024-005 / ORD-5005',
      reservedQty: 250,
      uom: 'Meters',
      reservationDate: '2025-12-20',
      daysReserved: 21,
      reservationStatus: 'Active',
      agingBucket: '16-30',
    },
    {
      key: '6',
      item: 'Silk Georgette Cream',
      styleOrderNo: 'STY-2024-006 / ORD-5006',
      reservedQty: 150,
      uom: 'Meters',
      reservationDate: '2025-12-05',
      daysReserved: 36,
      reservationStatus: 'Expired',
      agingBucket: '30+',
    },
    {
      key: '7',
      item: 'Zipper 7 inch Metal',
      styleOrderNo: 'STY-2024-007 / ORD-5007',
      reservedQty: 5000,
      uom: 'Pcs',
      reservationDate: '2026-01-09',
      daysReserved: 1,
      reservationStatus: 'Active',
      agingBucket: '0-7',
    },
    {
      key: '8',
      item: 'Button 2 Hole Resin',
      styleOrderNo: 'STY-2024-008 / ORD-5008',
      reservedQty: 10000,
      uom: 'Pcs',
      reservationDate: '2026-01-03',
      daysReserved: 7,
      reservationStatus: 'Active',
      agingBucket: '0-7',
    },
    {
      key: '9',
      item: 'Polyester Thread 40/2',
      styleOrderNo: 'STY-2024-009 / ORD-5009',
      reservedQty: 2000,
      uom: 'Cones',
      reservationDate: '2025-12-27',
      daysReserved: 14,
      reservationStatus: 'Active',
      agingBucket: '8-15',
    },
    {
      key: '10',
      item: 'Cotton Thread 60/2',
      styleOrderNo: 'STY-2024-010 / ORD-5010',
      reservedQty: 3000,
      uom: 'Cones',
      reservationDate: '2025-11-28',
      daysReserved: 43,
      reservationStatus: 'Expired',
      agingBucket: '30+',
    },
    {
      key: '11',
      item: 'Snap Button Metal',
      styleOrderNo: 'STY-2024-011 / ORD-5011',
      reservedQty: 8000,
      uom: 'Sets',
      reservationDate: '2026-01-04',
      daysReserved: 6,
      reservationStatus: 'Active',
      agingBucket: '0-7',
    },
    {
      key: '12',
      item: 'Care Label Woven',
      styleOrderNo: 'STY-2024-012 / ORD-5012',
      reservedQty: 12000,
      uom: 'Pcs',
      reservationDate: '2025-12-15',
      daysReserved: 26,
      reservationStatus: 'Active',
      agingBucket: '16-30',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'dateRange',
      label: 'Reservation Date Range',
      type: 'dateRange',
      required: true,
    },
    {
      name: 'item',
      label: 'Item',
      type: 'select',
      options: [
        { label: 'All Items', value: 'all' },
        { label: 'Cotton Poplin White', value: 'cotton_poplin' },
        { label: 'Polyester Satin Blue', value: 'polyester_satin' },
        { label: 'Denim Stretch Dark Blue', value: 'denim_stretch' },
      ],
    },
    {
      name: 'reservationStatus',
      label: 'Reservation Status',
      type: 'multiSelect',
      options: [
        { label: 'Active', value: 'active' },
        { label: 'Expired', value: 'expired' },
        { label: 'Released', value: 'released' },
      ],
    },
    {
      name: 'agingBucket',
      label: 'Aging Bucket',
      type: 'multiSelect',
      options: [
        { label: '0-7 Days', value: '0-7' },
        { label: '8-15 Days', value: '8-15' },
        { label: '16-30 Days', value: '16-30' },
        { label: '30+ Days', value: '30+' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting Reservation Aging Report to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting Reservation Aging Report to PDF...');
  };

  const columns: ColumnsType<ReservationAgingData> = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Style / Order No',
      dataIndex: 'styleOrderNo',
      key: 'styleOrderNo',
      width: 200,
    },
    {
      title: 'Reserved Qty',
      dataIndex: 'reservedQty',
      key: 'reservedQty',
      width: 130,
      align: 'right',
      render: (val, record) => (
        <strong>
          {val.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Reservation Date',
      dataIndex: 'reservationDate',
      key: 'reservationDate',
      width: 140,
      render: (text) => dayjs(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Days Reserved',
      dataIndex: 'daysReserved',
      key: 'daysReserved',
      width: 130,
      align: 'center',
      render: (val) => {
        const color = val <= 7 ? 'var(--color-52c41a)' : val <= 15 ? 'var(--color-faad14)' : val <= 30 ? 'var(--color-fa8c16)' : 'var(--color-ff4d4f)';
        return <strong style={{ color, fontSize: '14px' }}>{val} days</strong>;
      },
    },
    {
      title: 'Reservation Status',
      dataIndex: 'reservationStatus',
      key: 'reservationStatus',
      width: 150,
      render: (text) => {
        const colorMap: Record<string, string> = {
          Active: 'green',
          Expired: 'red',
          Released: 'blue',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingBucket',
      key: 'agingBucket',
      width: 130,
      render: (text) => {
        const colorMap: Record<string, string> = {
          '0-7': 'green',
          '8-15': 'orange',
          '16-30': 'volcano',
          '30+': 'red',
        };
        return <Tag color={colorMap[text] || 'default'}>{text} Days</Tag>;
      },
    },
  ];

  const displayData = searchText
    ? filteredData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
      )
    : filteredData;

  // Calculate summary stats
  const totalReservedItems = displayData.length;
  const activeReservations = displayData.filter((d) => d.reservationStatus === 'Active').length;
  const expiredReservations = displayData.filter((d) => d.reservationStatus === 'Expired').length;
  const criticalAging = displayData.filter((d) => d.daysReserved > 30).length;

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Reservation Aging Report</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Track reserved stock aging and identify blocked inventory
            </div>
          </div>
        }
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
              Filters
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} type="primary" ghost>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPDF} danger ghost>
              PDF
            </Button>
          </Space>
        }
      >
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Reserved</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{totalReservedItems}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Active</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>{activeReservations}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Expired</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ff4d4f)' }}>{expiredReservations}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Critical (30+ Days)</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ff4d4f)' }}>{criticalAging}</div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="key"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} reservations`,
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="Reservation Aging Filters"
      />
    </div>
  );
};

export default ReservationAgingReport;
