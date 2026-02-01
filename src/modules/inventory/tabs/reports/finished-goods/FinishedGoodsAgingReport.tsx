/**
 * Finished Goods Aging Report
 * Track FG stock aging and identify slow-moving/dead stock
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';
import dayjs from 'dayjs';

interface FGAgingData {
  key: string;
  style: string;
  color: string;
  size: string;
  cartonNo: string;
  qty: number;
  fgEntryDate: string;
  daysInFG: number;
  agingBucket: string;
  fgStatus: string;
}

const FinishedGoodsAgingReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<FGAgingData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: FGAgingData[] = [
    {
      key: '1',
      style: 'STY-2024-001',
      color: 'White',
      size: 'M',
      cartonNo: 'CTN-FG-001',
      qty: 500,
      fgEntryDate: '2026-01-05',
      daysInFG: 5,
      agingBucket: '0-15',
      fgStatus: 'Fast',
    },
    {
      key: '2',
      style: 'STY-2024-001',
      color: 'White',
      size: 'L',
      cartonNo: 'CTN-FG-002',
      qty: 600,
      fgEntryDate: '2026-01-03',
      daysInFG: 7,
      agingBucket: '0-15',
      fgStatus: 'Fast',
    },
    {
      key: '3',
      style: 'STY-2024-002',
      color: 'Blue',
      size: 'S',
      cartonNo: 'CTN-FG-003',
      qty: 400,
      fgEntryDate: '2025-12-28',
      daysInFG: 13,
      agingBucket: '0-15',
      fgStatus: 'Fast',
    },
    {
      key: '4',
      style: 'STY-2024-002',
      color: 'Blue',
      size: 'M',
      cartonNo: 'CTN-FG-004',
      qty: 550,
      fgEntryDate: '2025-12-25',
      daysInFG: 16,
      agingBucket: '16-30',
      fgStatus: 'Fast',
    },
    {
      key: '5',
      style: 'STY-2024-003',
      color: 'Black',
      size: 'L',
      cartonNo: 'CTN-FG-005',
      qty: 450,
      fgEntryDate: '2025-12-20',
      daysInFG: 21,
      agingBucket: '16-30',
      fgStatus: 'Slow',
    },
    {
      key: '6',
      style: 'STY-2024-003',
      color: 'Black',
      size: 'XL',
      cartonNo: 'CTN-FG-006',
      qty: 300,
      fgEntryDate: '2025-12-15',
      daysInFG: 26,
      agingBucket: '16-30',
      fgStatus: 'Slow',
    },
    {
      key: '7',
      style: 'STY-2024-004',
      color: 'Red',
      size: 'M',
      cartonNo: 'CTN-FG-007',
      qty: 350,
      fgEntryDate: '2025-12-05',
      daysInFG: 36,
      agingBucket: '30-60',
      fgStatus: 'Slow',
    },
    {
      key: '8',
      style: 'STY-2024-004',
      color: 'Red',
      size: 'L',
      cartonNo: 'CTN-FG-008',
      qty: 400,
      fgEntryDate: '2025-11-28',
      daysInFG: 43,
      agingBucket: '30-60',
      fgStatus: 'Slow',
    },
    {
      key: '9',
      style: 'STY-2024-005',
      color: 'Green',
      size: 'S',
      cartonNo: 'CTN-FG-009',
      qty: 250,
      fgEntryDate: '2025-11-20',
      daysInFG: 51,
      agingBucket: '30-60',
      fgStatus: 'Slow',
    },
    {
      key: '10',
      style: 'STY-2024-005',
      color: 'Green',
      size: 'M',
      cartonNo: 'CTN-FG-010',
      qty: 300,
      fgEntryDate: '2025-11-10',
      daysInFG: 61,
      agingBucket: '60+',
      fgStatus: 'Dead',
    },
    {
      key: '11',
      style: 'STY-2024-006',
      color: 'Yellow',
      size: 'L',
      cartonNo: 'CTN-FG-011',
      qty: 200,
      fgEntryDate: '2025-10-25',
      daysInFG: 77,
      agingBucket: '60+',
      fgStatus: 'Dead',
    },
    {
      key: '12',
      style: 'STY-2024-006',
      color: 'Yellow',
      size: 'XL',
      cartonNo: 'CTN-FG-012',
      qty: 150,
      fgEntryDate: '2025-10-15',
      daysInFG: 87,
      agingBucket: '60+',
      fgStatus: 'Dead',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'dateRange',
      label: 'FG Entry Date Range',
      type: 'dateRange',
      required: true,
    },
    {
      name: 'style',
      label: 'Style',
      type: 'select',
      options: [
        { label: 'All Styles', value: 'all' },
        { label: 'STY-2024-001', value: 'sty_001' },
        { label: 'STY-2024-002', value: 'sty_002' },
        { label: 'STY-2024-003', value: 'sty_003' },
      ],
    },
    {
      name: 'agingBucket',
      label: 'Aging Bucket',
      type: 'multiSelect',
      options: [
        { label: '0-15 Days', value: '0-15' },
        { label: '16-30 Days', value: '16-30' },
        { label: '30-60 Days', value: '30-60' },
        { label: '60+ Days', value: '60+' },
      ],
    },
    {
      name: 'fgStatus',
      label: 'FG Status',
      type: 'multiSelect',
      options: [
        { label: 'Fast', value: 'fast' },
        { label: 'Slow', value: 'slow' },
        { label: 'Dead', value: 'dead' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting FG Aging Report to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting FG Aging Report to PDF...');
  };

  const columns: ColumnsType<FGAgingData> = [
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      width: 140,
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      width: 100,
      render: (text) => <Tag>{text}</Tag>,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      width: 80,
      align: 'center',
    },
    {
      title: 'Carton No',
      dataIndex: 'cartonNo',
      key: 'cartonNo',
      width: 140,
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 100,
      align: 'right',
      render: (val) => <strong>{val.toLocaleString()} Pcs</strong>,
    },
    {
      title: 'FG Entry Date',
      dataIndex: 'fgEntryDate',
      key: 'fgEntryDate',
      width: 130,
      render: (text) => dayjs(text).format('DD-MMM-YYYY'),
    },
    {
      title: 'Days in FG',
      dataIndex: 'daysInFG',
      key: 'daysInFG',
      width: 120,
      align: 'center',
      render: (val) => {
        const color = val <= 15 ? 'var(--color-52c41a)' : val <= 30 ? 'var(--color-faad14)' : val <= 60 ? 'var(--color-fa8c16)' : 'var(--color-ff4d4f)';
        return <strong style={{ color, fontSize: '14px' }}>{val} days</strong>;
      },
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingBucket',
      key: 'agingBucket',
      width: 130,
      render: (text) => {
        const colorMap: Record<string, string> = {
          '0-15': 'green',
          '16-30': 'orange',
          '30-60': 'volcano',
          '60+': 'red',
        };
        return <Tag color={colorMap[text] || 'default'}>{text} Days</Tag>;
      },
    },
    {
      title: 'FG Status',
      dataIndex: 'fgStatus',
      key: 'fgStatus',
      width: 110,
      render: (text) => {
        const colorMap: Record<string, string> = {
          Fast: 'green',
          Slow: 'orange',
          Dead: 'red',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
  ];

  const displayData = searchText
    ? filteredData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
      )
    : filteredData;

  // Calculate summary stats
  const totalQty = displayData.reduce((sum, d) => sum + d.qty, 0);
  const fastMoving = displayData.filter((d) => d.fgStatus === 'Fast');
  const slowMoving = displayData.filter((d) => d.fgStatus === 'Slow');
  const deadStock = displayData.filter((d) => d.fgStatus === 'Dead');

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Finished Goods Aging Report</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Track FG stock aging and identify slow-moving/dead stock
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
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Cartons</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{displayData.length}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Qty</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{totalQty.toLocaleString()}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Fast Moving</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>
              {fastMoving.length} ({((fastMoving.length / displayData.length) * 100).toFixed(0)}%)
            </div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Slow Moving</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-faad14)' }}>
              {slowMoving.length} ({((slowMoving.length / displayData.length) * 100).toFixed(0)}%)
            </div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Dead Stock</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ff4d4f)' }}>
              {deadStock.length} ({((deadStock.length / displayData.length) * 100).toFixed(0)}%)
            </div>
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
            showTotal: (total) => `Total ${total} cartons`,
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="FG Aging Filters"
      />
    </div>
  );
};

export default FinishedGoodsAgingReport;
