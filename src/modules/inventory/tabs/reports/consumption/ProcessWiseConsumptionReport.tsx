import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface ProcessConsumptionData {
  key: string;
  style: string;
  process: 'Cutting' | 'Stitching' | 'Washing' | 'Finishing';
  inputQty: number;
  outputQty: number;
  wastageQty: number;
  wastagePct: number;
  uom: string;
}

const ProcessWiseConsumptionReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<ProcessConsumptionData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: ProcessConsumptionData[] = [
    {
      key: '1',
      style: 'STY-001 - Men Shirt',
      process: 'Cutting',
      inputQty: 520,
      outputQty: 515,
      wastageQty: 5,
      wastagePct: 0.96,
      uom: 'Meters',
    },
    {
      key: '2',
      style: 'STY-001 - Men Shirt',
      process: 'Stitching',
      inputQty: 515,
      outputQty: 510,
      wastageQty: 5,
      wastagePct: 0.97,
      uom: 'Pcs',
    },
    {
      key: '3',
      style: 'STY-002 - Ladies Blouse',
      process: 'Cutting',
      inputQty: 900,
      outputQty: 850,
      wastageQty: 50,
      wastagePct: 5.56,
      uom: 'Meters',
    },
    {
      key: '4',
      style: 'STY-002 - Ladies Blouse',
      process: 'Stitching',
      inputQty: 850,
      outputQty: 840,
      wastageQty: 10,
      wastagePct: 1.18,
      uom: 'Pcs',
    },
    {
      key: '5',
      style: 'STY-003 - Kids Dress',
      process: 'Cutting',
      inputQty: 610,
      outputQty: 605,
      wastageQty: 5,
      wastagePct: 0.82,
      uom: 'Meters',
    },
    {
      key: '6',
      style: 'STY-003 - Kids Dress',
      process: 'Stitching',
      inputQty: 605,
      outputQty: 600,
      wastageQty: 5,
      wastagePct: 0.83,
      uom: 'Pcs',
    },
    {
      key: '7',
      style: 'STY-004 - Mens Jeans',
      process: 'Cutting',
      inputQty: 1350,
      outputQty: 1280,
      wastageQty: 70,
      wastagePct: 5.19,
      uom: 'Meters',
    },
    {
      key: '8',
      style: 'STY-004 - Mens Jeans',
      process: 'Stitching',
      inputQty: 1280,
      outputQty: 1270,
      wastageQty: 10,
      wastagePct: 0.78,
      uom: 'Pcs',
    },
    {
      key: '9',
      style: 'STY-004 - Mens Jeans',
      process: 'Washing',
      inputQty: 1270,
      outputQty: 1250,
      wastageQty: 20,
      wastagePct: 1.57,
      uom: 'Pcs',
    },
    {
      key: '10',
      style: 'STY-004 - Mens Jeans',
      process: 'Finishing',
      inputQty: 1250,
      outputQty: 1240,
      wastageQty: 10,
      wastagePct: 0.8,
      uom: 'Pcs',
    },
    {
      key: '11',
      style: 'STY-005 - Ladies Top',
      process: 'Cutting',
      inputQty: 450,
      outputQty: 420,
      wastageQty: 30,
      wastagePct: 6.67,
      uom: 'Meters',
    },
    {
      key: '12',
      style: 'STY-005 - Ladies Top',
      process: 'Stitching',
      inputQty: 420,
      outputQty: 415,
      wastageQty: 5,
      wastagePct: 1.19,
      uom: 'Pcs',
    },
    {
      key: '13',
      style: 'STY-006 - Kids Shorts',
      process: 'Cutting',
      inputQty: 315,
      outputQty: 310,
      wastageQty: 5,
      wastagePct: 1.59,
      uom: 'Meters',
    },
    {
      key: '14',
      style: 'STY-006 - Kids Shorts',
      process: 'Stitching',
      inputQty: 310,
      outputQty: 305,
      wastageQty: 5,
      wastagePct: 1.61,
      uom: 'Pcs',
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
      type: 'input',
      placeholder: 'Enter style code or name',
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
  ];

  const columns: ColumnsType<ProcessConsumptionData> = [
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
      title: 'Input Qty',
      dataIndex: 'inputQty',
      key: 'inputQty',
      sorter: (a, b) => a.inputQty - b.inputQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Output Qty',
      dataIndex: 'outputQty',
      key: 'outputQty',
      sorter: (a, b) => a.outputQty - b.outputQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Wastage Qty',
      dataIndex: 'wastageQty',
      key: 'wastageQty',
      sorter: (a, b) => a.wastageQty - b.wastageQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Wastage %',
      dataIndex: 'wastagePct',
      key: 'wastagePct',
      sorter: (a, b) => a.wastagePct - b.wastagePct,
      align: 'right',
      width: 120,
      render: (value) => {
        const isOverTolerance = value > 5;
        return (
          <strong
            style={{
              color: isOverTolerance ? 'var(--color-ff4d4f)' : value > 3 ? 'var(--color-faad14)' : 'var(--color-52c41a)',
              backgroundColor: isOverTolerance ? 'var(--color-fff1f0)' : undefined,
              padding: isOverTolerance ? '2px 8px' : undefined,
              borderRadius: isOverTolerance ? '4px' : undefined,
            }}
          >
            {value.toFixed(2)}%
          </strong>
        );
      },
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
        title="Process Consumption Filters"
      />
    </div>
  );
};

export default ProcessWiseConsumptionReport;
