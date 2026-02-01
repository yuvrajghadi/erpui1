/**
 * BOM vs WIP Consumption Variance Report
 * Track material consumption variance against BOM standards
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message, Progress } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface BOMVarianceData {
  key: string;
  style: string;
  process: string;
  material: string;
  bomPlannedQty: number;
  issuedQty: number;
  actualConsumedQty: number;
  varianceQty: number;
  variancePct: number;
  uom: string;
  status: string;
}

const BOMVsWIPConsumptionVarianceReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<BOMVarianceData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: BOMVarianceData[] = [
    {
      key: '1',
      style: 'STY-2024-001',
      process: 'Cutting',
      material: 'Cotton Poplin White',
      bomPlannedQty: 500,
      issuedQty: 520,
      actualConsumedQty: 515,
      varianceQty: 15,
      variancePct: 3.0,
      uom: 'Meters',
      status: 'Within Limit',
    },
    {
      key: '2',
      style: 'STY-2024-001',
      process: 'Stitching',
      material: 'Polyester Thread 40/2',
      bomPlannedQty: 100,
      issuedQty: 105,
      actualConsumedQty: 103,
      varianceQty: 3,
      variancePct: 3.0,
      uom: 'Cones',
      status: 'Within Limit',
    },
    {
      key: '3',
      style: 'STY-2024-002',
      process: 'Cutting',
      material: 'Polyester Satin Blue',
      bomPlannedQty: 800,
      issuedQty: 850,
      actualConsumedQty: 845,
      varianceQty: 45,
      variancePct: 5.6,
      uom: 'Meters',
      status: 'Excess',
    },
    {
      key: '4',
      style: 'STY-2024-002',
      process: 'Stitching',
      material: 'Zipper 7 inch Metal',
      bomPlannedQty: 2000,
      issuedQty: 2100,
      actualConsumedQty: 2080,
      varianceQty: 80,
      variancePct: 4.0,
      uom: 'Pcs',
      status: 'Within Limit',
    },
    {
      key: '5',
      style: 'STY-2024-003',
      process: 'Cutting',
      material: 'Denim Stretch Dark Blue',
      bomPlannedQty: 1200,
      issuedQty: 1280,
      actualConsumedQty: 1275,
      varianceQty: 75,
      variancePct: 6.3,
      uom: 'Meters',
      status: 'Excess',
    },
    {
      key: '6',
      style: 'STY-2024-003',
      process: 'Stitching',
      material: 'Button 2 Hole Resin',
      bomPlannedQty: 5000,
      issuedQty: 5150,
      actualConsumedQty: 5100,
      varianceQty: 100,
      variancePct: 2.0,
      uom: 'Pcs',
      status: 'Within Limit',
    },
    {
      key: '7',
      style: 'STY-2024-004',
      process: 'Cutting',
      material: 'Viscose Rayon Black',
      bomPlannedQty: 600,
      issuedQty: 650,
      actualConsumedQty: 645,
      varianceQty: 45,
      variancePct: 7.5,
      uom: 'Meters',
      status: 'Excess',
    },
    {
      key: '8',
      style: 'STY-2024-004',
      process: 'Finishing',
      material: 'Care Label Woven',
      bomPlannedQty: 3000,
      issuedQty: 3050,
      actualConsumedQty: 3020,
      varianceQty: 20,
      variancePct: 0.7,
      uom: 'Pcs',
      status: 'Within Limit',
    },
    {
      key: '9',
      style: 'STY-2024-005',
      process: 'Cutting',
      material: 'Linen Blend Beige',
      bomPlannedQty: 400,
      issuedQty: 410,
      actualConsumedQty: 408,
      varianceQty: 8,
      variancePct: 2.0,
      uom: 'Meters',
      status: 'Within Limit',
    },
    {
      key: '10',
      style: 'STY-2024-005',
      process: 'Stitching',
      material: 'Cotton Thread 60/2',
      bomPlannedQty: 80,
      issuedQty: 85,
      actualConsumedQty: 84,
      varianceQty: 4,
      variancePct: 5.0,
      uom: 'Cones',
      status: 'Within Limit',
    },
    {
      key: '11',
      style: 'STY-2024-006',
      process: 'Cutting',
      material: 'Silk Georgette Cream',
      bomPlannedQty: 300,
      issuedQty: 330,
      actualConsumedQty: 328,
      varianceQty: 28,
      variancePct: 9.3,
      uom: 'Meters',
      status: 'Excess',
    },
    {
      key: '12',
      style: 'STY-2024-006',
      process: 'Finishing',
      material: 'Snap Button Metal',
      bomPlannedQty: 4000,
      issuedQty: 4100,
      actualConsumedQty: 4050,
      varianceQty: 50,
      variancePct: 1.3,
      uom: 'Sets',
      status: 'Within Limit',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'dateRange',
      label: 'Date Range',
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
        { label: 'STY-2024-004', value: 'sty_004' },
      ],
    },
    {
      name: 'process',
      label: 'Process',
      type: 'multiSelect',
      options: [
        { label: 'Cutting', value: 'cutting' },
        { label: 'Stitching', value: 'stitching' },
        { label: 'Washing', value: 'washing' },
        { label: 'Finishing', value: 'finishing' },
      ],
    },
    {
      name: 'status',
      label: 'Status',
      type: 'multiSelect',
      options: [
        { label: 'Within Limit', value: 'within' },
        { label: 'Excess', value: 'excess' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting BOM Variance Report to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting BOM Variance Report to PDF...');
  };

  const columns: ColumnsType<BOMVarianceData> = [
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      width: 140,
      fixed: 'left',
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      width: 110,
      render: (text) => {
        const colorMap: Record<string, string> = {
          Cutting: 'blue',
          Stitching: 'green',
          Washing: 'cyan',
          Finishing: 'purple',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Material',
      dataIndex: 'material',
      key: 'material',
      width: 200,
    },
    {
      title: 'BOM Planned Qty',
      dataIndex: 'bomPlannedQty',
      key: 'bomPlannedQty',
      width: 150,
      align: 'right',
      render: (val, record) => (
        <span>
          {val.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Issued Qty',
      dataIndex: 'issuedQty',
      key: 'issuedQty',
      width: 120,
      align: 'right',
      render: (val, record) => (
        <span style={{ color: 'var(--color-1890ff)' }}>
          {val.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Actual Consumed Qty',
      dataIndex: 'actualConsumedQty',
      key: 'actualConsumedQty',
      width: 170,
      align: 'right',
      render: (val, record) => (
        <strong>
          {val.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Variance Qty',
      dataIndex: 'varianceQty',
      key: 'varianceQty',
      width: 130,
      align: 'right',
      render: (val, record) => {
        const isExcess = val > record.bomPlannedQty * 0.05; // 5% threshold
        return (
          <span style={{ color: isExcess ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)', fontWeight: 'bold' }}>
            {val > 0 ? '+' : ''}
            {val.toLocaleString()} {record.uom}
          </span>
        );
      },
    },
    {
      title: 'Variance %',
      dataIndex: 'variancePct',
      key: 'variancePct',
      width: 130,
      align: 'center',
      render: (val) => {
        const color = val <= 5 ? 'var(--color-52c41a)' : val <= 7 ? 'var(--color-faad14)' : 'var(--color-ff4d4f)';
        return (
          <div>
            <Progress
              percent={Math.min(val, 10) * 10}
              strokeColor={color}
              showInfo={false}
              size="small"
              style={{ marginBottom: 4 }}
            />
            <span style={{ color, fontWeight: 'bold' }}>{val.toFixed(1)}%</span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (text) => {
        const colorMap: Record<string, string> = {
          'Within Limit': 'green',
          Excess: 'red',
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
  const withinLimit = displayData.filter((d) => d.status === 'Within Limit').length;
  const excess = displayData.filter((d) => d.status === 'Excess').length;
  const avgVariance = (
    displayData.reduce((sum, d) => sum + d.variancePct, 0) / displayData.length
  ).toFixed(1);

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>BOM vs WIP Consumption Variance Report</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Track material consumption variance against BOM standards
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
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Items</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{displayData.length}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Within Limit</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>{withinLimit}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Excess</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-ff4d4f)' }}>{excess}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Avg Variance %</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-faad14)' }}>{avgVariance}%</div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="key"
          scroll={{ x: 1600 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="BOM Variance Filters"
      />
    </div>
  );
};

export default BOMVsWIPConsumptionVarianceReport;
