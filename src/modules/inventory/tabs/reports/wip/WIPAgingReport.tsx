import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface WIPAgingData {
  key: string;
  style: string;
  process: 'Cutting' | 'Stitching' | 'Washing' | 'Finishing';
  qty: number;
  agingDays: number;
  agingBucket: '0-7' | '8-14' | '15-30' | '30+';
  uom: string;
}

const WIPAgingReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<WIPAgingData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: WIPAgingData[] = [
    {
      key: '1',
      style: 'STY-001 - Men Shirt',
      process: 'Cutting',
      qty: 500,
      agingDays: 2,
      agingBucket: '0-7',
      uom: 'Pcs',
    },
    {
      key: '2',
      style: 'STY-001 - Men Shirt',
      process: 'Stitching',
      qty: 300,
      agingDays: 5,
      agingBucket: '0-7',
      uom: 'Pcs',
    },
    {
      key: '3',
      style: 'STY-002 - Ladies Blouse',
      process: 'Cutting',
      qty: 400,
      agingDays: 8,
      agingBucket: '8-14',
      uom: 'Pcs',
    },
    {
      key: '4',
      style: 'STY-002 - Ladies Blouse',
      process: 'Stitching',
      qty: 200,
      agingDays: 12,
      agingBucket: '8-14',
      uom: 'Pcs',
    },
    {
      key: '5',
      style: 'STY-003 - Kids Dress',
      process: 'Stitching',
      qty: 150,
      agingDays: 3,
      agingBucket: '0-7',
      uom: 'Pcs',
    },
    {
      key: '6',
      style: 'STY-004 - Mens Jeans',
      process: 'Washing',
      qty: 600,
      agingDays: 4,
      agingBucket: '0-7',
      uom: 'Pcs',
    },
    {
      key: '7',
      style: 'STY-004 - Mens Jeans',
      process: 'Finishing',
      qty: 400,
      agingDays: 2,
      agingBucket: '0-7',
      uom: 'Pcs',
    },
    {
      key: '8',
      style: 'STY-005 - Ladies Top',
      process: 'Cutting',
      qty: 250,
      agingDays: 18,
      agingBucket: '15-30',
      uom: 'Pcs',
    },
    {
      key: '9',
      style: 'STY-006 - Kids Shorts',
      process: 'Stitching',
      qty: 180,
      agingDays: 35,
      agingBucket: '30+',
      uom: 'Pcs',
    },
    {
      key: '10',
      style: 'STY-007 - Mens T-Shirt',
      process: 'Cutting',
      qty: 320,
      agingDays: 25,
      agingBucket: '15-30',
      uom: 'Pcs',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
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
      name: 'agingBucket',
      label: 'Aging Bucket',
      type: 'multiSelect',
      options: [
        { label: '0-7 Days', value: '0-7' },
        { label: '8-14 Days', value: '8-14' },
        { label: '15-30 Days', value: '15-30' },
        { label: '30+ Days', value: '30+' },
      ],
    },
  ];

  const getAgingBucketColor = (bucket: string): string => {
    const colorMap: Record<string, string> = {
      '0-7': 'green',
      '8-14': 'blue',
      '15-30': 'orange',
      '30+': 'red',
    };
    return colorMap[bucket] || 'default';
  };

  const columns: ColumnsType<WIPAgingData> = [
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: (a, b) => a.style.localeCompare(b.style),
      width: 200,
    },
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      sorter: (a, b) => a.process.localeCompare(b.process),
      width: 120,
      filters: [
        { text: 'Cutting', value: 'Cutting' },
        { text: 'Stitching', value: 'Stitching' },
        { text: 'Washing', value: 'Washing' },
        { text: 'Finishing', value: 'Finishing' },
      ],
      onFilter: (value, record) => record.process === value,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      sorter: (a, b) => a.qty - b.qty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Aging Days',
      dataIndex: 'agingDays',
      key: 'agingDays',
      sorter: (a, b) => a.agingDays - b.agingDays,
      align: 'right',
      width: 120,
      render: (value) => `${value} days`,
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingBucket',
      key: 'agingBucket',
      width: 130,
      render: (value) => <Tag color={getAgingBucketColor(value)}>{value} Days</Tag>,
      filters: [
        { text: '0-7 Days', value: '0-7' },
        { text: '8-14 Days', value: '8-14' },
        { text: '15-30 Days', value: '15-30' },
        { text: '30+ Days', value: '30+' },
      ],
      onFilter: (value, record) => record.agingBucket === value,
    },
  ];

  const handleFilterApply = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.info('Exporting to Excel... (Feature in development)');
  };

  const handleExportPDF = () => {
    message.info('Exporting to PDF... (Feature in development)');
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = sampleData.filter(
      (item) =>
        item.style.toLowerCase().includes(value.toLowerCase()) ||
        item.process.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space
          style={{
            marginBottom: 16,
            width: '100%',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}
        >
          <Space>
            <Input
              placeholder="Search by style or process..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              onChange={(e) => handleSearch(e.target.value)}
              value={searchText}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
              Filters
            </Button>
          </Space>
          <Space>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel}>
              Export Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPDF}>
              Export PDF
            </Button>
          </Space>
        </Space>

        <Table
          columns={columns}
          dataSource={filteredData}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} records`,
          }}
          scroll={{ x: 1000, y: 'calc(100vh - 350px)' }}
          sticky
          size="small"
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        filters={filters}
        title="WIP Aging Filters"
      />
    </div>
  );
};

export default WIPAgingReport;
