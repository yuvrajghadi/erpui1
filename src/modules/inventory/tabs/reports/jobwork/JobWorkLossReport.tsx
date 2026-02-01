import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface JobWorkLossData {
  key: string;
  vendor: string;
  process: string;
  sentQty: number;
  receivedQty: number;
  lossQty: number;
  lossPct: number;
  uom: string;
}

const JobWorkLossReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<JobWorkLossData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: JobWorkLossData[] = [
    {
      key: '1',
      vendor: 'ABC Processing Unit',
      process: 'Stitching',
      sentQty: 1000,
      receivedQty: 990,
      lossQty: 10,
      lossPct: 1.0,
      uom: 'Pcs',
    },
    {
      key: '2',
      vendor: 'XYZ Washing Plant',
      process: 'Washing',
      sentQty: 1500,
      receivedQty: 1450,
      lossQty: 50,
      lossPct: 3.33,
      uom: 'Pcs',
    },
    {
      key: '3',
      vendor: 'Quality Embroidery',
      process: 'Embroidery',
      sentQty: 800,
      receivedQty: 785,
      lossQty: 15,
      lossPct: 1.88,
      uom: 'Pcs',
    },
    {
      key: '4',
      vendor: 'Premium Finishing',
      process: 'Finishing',
      sentQty: 2000,
      receivedQty: 1990,
      lossQty: 10,
      lossPct: 0.5,
      uom: 'Pcs',
    },
    {
      key: '5',
      vendor: 'Fast Stitching Co',
      process: 'Stitching',
      sentQty: 1200,
      receivedQty: 1180,
      lossQty: 20,
      lossPct: 1.67,
      uom: 'Pcs',
    },
    {
      key: '6',
      vendor: 'ABC Processing Unit',
      process: 'Cutting',
      sentQty: 900,
      receivedQty: 875,
      lossQty: 25,
      lossPct: 2.78,
      uom: 'Pcs',
    },
    {
      key: '7',
      vendor: 'XYZ Washing Plant',
      process: 'Washing',
      sentQty: 1800,
      receivedQty: 1750,
      lossQty: 50,
      lossPct: 2.78,
      uom: 'Pcs',
    },
    {
      key: '8',
      vendor: 'Quality Embroidery',
      process: 'Embroidery',
      sentQty: 600,
      receivedQty: 585,
      lossQty: 15,
      lossPct: 2.5,
      uom: 'Pcs',
    },
    {
      key: '9',
      vendor: 'Premium Finishing',
      process: 'Finishing',
      sentQty: 2200,
      receivedQty: 2190,
      lossQty: 10,
      lossPct: 0.45,
      uom: 'Pcs',
    },
    {
      key: '10',
      vendor: 'Fast Stitching Co',
      process: 'Stitching',
      sentQty: 1400,
      receivedQty: 1360,
      lossQty: 40,
      lossPct: 2.86,
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
      name: 'vendor',
      label: 'Vendor',
      type: 'input',
      placeholder: 'Enter vendor name',
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
        { label: 'Embroidery', value: 'embroidery' },
      ],
    },
  ];

  const columns: ColumnsType<JobWorkLossData> = [
    {
      title: 'Vendor',
      dataIndex: 'vendor',
      key: 'vendor',
      sorter: (a, b) => a.vendor.localeCompare(b.vendor),
      width: 180,
    },
    {
      title: 'Process',
      dataIndex: 'process',
      key: 'process',
      sorter: (a, b) => a.process.localeCompare(b.process),
      width: 120,
    },
    {
      title: 'Sent Qty',
      dataIndex: 'sentQty',
      key: 'sentQty',
      sorter: (a, b) => a.sentQty - b.sentQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Received Qty',
      dataIndex: 'receivedQty',
      key: 'receivedQty',
      sorter: (a, b) => a.receivedQty - b.receivedQty,
      align: 'right',
      width: 130,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Loss Qty',
      dataIndex: 'lossQty',
      key: 'lossQty',
      sorter: (a, b) => a.lossQty - b.lossQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Loss %',
      dataIndex: 'lossPct',
      key: 'lossPct',
      sorter: (a, b) => a.lossPct - b.lossPct,
      align: 'right',
      width: 120,
      render: (value) => {
        const isOverTolerance = value > 2;
        return (
          <strong
            style={{
              color: isOverTolerance ? 'var(--color-ff4d4f)' : value > 1 ? 'var(--color-faad14)' : 'var(--color-52c41a)',
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
        item.vendor.toLowerCase().includes(value.toLowerCase()) ||
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
              placeholder="Search by vendor or process..."
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
        title="Job Work Loss Filters"
      />
    </div>
  );
};

export default JobWorkLossReport;
