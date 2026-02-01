import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface JobWorkOutstandingData {
  key: string;
  vendor: string;
  process: string;
  challanNo: string;
  sentQty: number;
  receivedQty: number;
  balanceQty: number;
  daysPending: number;
  uom: string;
}

const JobWorkOutstandingReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<JobWorkOutstandingData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: JobWorkOutstandingData[] = [
    {
      key: '1',
      vendor: 'ABC Processing Unit',
      process: 'Stitching',
      challanNo: 'CH-2024-001',
      sentQty: 500,
      receivedQty: 300,
      balanceQty: 200,
      daysPending: 5,
      uom: 'Pcs',
    },
    {
      key: '2',
      vendor: 'XYZ Washing Plant',
      process: 'Washing',
      challanNo: 'CH-2024-002',
      sentQty: 800,
      receivedQty: 200,
      balanceQty: 600,
      daysPending: 18,
      uom: 'Pcs',
    },
    {
      key: '3',
      vendor: 'Quality Embroidery',
      process: 'Embroidery',
      challanNo: 'CH-2024-003',
      sentQty: 300,
      receivedQty: 100,
      balanceQty: 200,
      daysPending: 12,
      uom: 'Pcs',
    },
    {
      key: '4',
      vendor: 'Premium Finishing',
      process: 'Finishing',
      challanNo: 'CH-2024-004',
      sentQty: 1000,
      receivedQty: 900,
      balanceQty: 100,
      daysPending: 3,
      uom: 'Pcs',
    },
    {
      key: '5',
      vendor: 'Fast Stitching Co',
      process: 'Stitching',
      challanNo: 'CH-2024-005',
      sentQty: 600,
      receivedQty: 400,
      balanceQty: 200,
      daysPending: 7,
      uom: 'Pcs',
    },
    {
      key: '6',
      vendor: 'ABC Processing Unit',
      process: 'Cutting',
      challanNo: 'CH-2024-006',
      sentQty: 400,
      receivedQty: 150,
      balanceQty: 250,
      daysPending: 20,
      uom: 'Pcs',
    },
    {
      key: '7',
      vendor: 'XYZ Washing Plant',
      process: 'Washing',
      challanNo: 'CH-2024-007',
      sentQty: 700,
      receivedQty: 600,
      balanceQty: 100,
      daysPending: 4,
      uom: 'Pcs',
    },
    {
      key: '8',
      vendor: 'Quality Embroidery',
      process: 'Embroidery',
      challanNo: 'CH-2024-008',
      sentQty: 250,
      receivedQty: 50,
      balanceQty: 200,
      daysPending: 16,
      uom: 'Pcs',
    },
    {
      key: '9',
      vendor: 'Premium Finishing',
      process: 'Finishing',
      challanNo: 'CH-2024-009',
      sentQty: 900,
      receivedQty: 850,
      balanceQty: 50,
      daysPending: 2,
      uom: 'Pcs',
    },
    {
      key: '10',
      vendor: 'Fast Stitching Co',
      process: 'Stitching',
      challanNo: 'CH-2024-010',
      sentQty: 550,
      receivedQty: 500,
      balanceQty: 50,
      daysPending: 6,
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

  const columns: ColumnsType<JobWorkOutstandingData> = [
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
      title: 'Challan No',
      dataIndex: 'challanNo',
      key: 'challanNo',
      width: 130,
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
      title: 'Balance Qty',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      sorter: (a, b) => a.balanceQty - b.balanceQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <strong style={{ color: value > 0 ? 'var(--color-faad14)' : 'var(--color-52c41a)' }}>
          {value.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Days Pending',
      dataIndex: 'daysPending',
      key: 'daysPending',
      sorter: (a, b) => a.daysPending - b.daysPending,
      align: 'right',
      width: 130,
      render: (value) => (
        <span
          style={{
            color: value > 15 ? 'var(--color-ff4d4f)' : value > 10 ? 'var(--color-faad14)' : undefined,
            backgroundColor: value > 15 ? 'var(--color-fff1f0)' : undefined,
            padding: value > 15 ? '2px 8px' : undefined,
            borderRadius: value > 15 ? '4px' : undefined,
            fontWeight: value > 15 ? 'bold' : 'normal',
          }}
        >
          {value} days
        </span>
      ),
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
        item.process.toLowerCase().includes(value.toLowerCase()) ||
        item.challanNo.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by vendor, process, or challan..."
              prefix={<SearchOutlined />}
              style={{ width: 280 }}
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
          scroll={{ x: 1200, y: 'calc(100vh - 350px)' }}
          sticky
          size="small"
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        filters={filters}
        title="Job Work Outstanding Filters"
      />
    </div>
  );
};

export default JobWorkOutstandingReport;
