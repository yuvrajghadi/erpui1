import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface WIPStatusData {
  key: string;
  style: string;
  process: 'Cutting' | 'Stitching' | 'Washing' | 'Finishing';
  qtyInWIP: number;
  daysInWIP: number;
  status: 'In Progress' | 'Delayed' | 'Completed';
  uom: string;
}

const WIPStatusReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<WIPStatusData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: WIPStatusData[] = [
    {
      key: '1',
      style: 'STY-001 - Men Shirt',
      process: 'Cutting',
      qtyInWIP: 500,
      daysInWIP: 2,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '2',
      style: 'STY-001 - Men Shirt',
      process: 'Stitching',
      qtyInWIP: 300,
      daysInWIP: 5,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '3',
      style: 'STY-002 - Ladies Blouse',
      process: 'Cutting',
      qtyInWIP: 400,
      daysInWIP: 8,
      status: 'Delayed',
      uom: 'Pcs',
    },
    {
      key: '4',
      style: 'STY-002 - Ladies Blouse',
      process: 'Stitching',
      qtyInWIP: 200,
      daysInWIP: 12,
      status: 'Delayed',
      uom: 'Pcs',
    },
    {
      key: '5',
      style: 'STY-003 - Kids Dress',
      process: 'Stitching',
      qtyInWIP: 150,
      daysInWIP: 3,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '6',
      style: 'STY-004 - Mens Jeans',
      process: 'Washing',
      qtyInWIP: 600,
      daysInWIP: 4,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '7',
      style: 'STY-004 - Mens Jeans',
      process: 'Finishing',
      qtyInWIP: 400,
      daysInWIP: 2,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '8',
      style: 'STY-005 - Ladies Top',
      process: 'Cutting',
      qtyInWIP: 250,
      daysInWIP: 10,
      status: 'Delayed',
      uom: 'Pcs',
    },
    {
      key: '9',
      style: 'STY-006 - Kids Shorts',
      process: 'Stitching',
      qtyInWIP: 180,
      daysInWIP: 3,
      status: 'In Progress',
      uom: 'Pcs',
    },
    {
      key: '10',
      style: 'STY-007 - Mens T-Shirt',
      process: 'Finishing',
      qtyInWIP: 0,
      daysInWIP: 7,
      status: 'Completed',
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
      name: 'style',
      label: 'Style',
      type: 'input',
      placeholder: 'Enter style code or name',
    },
  ];

  const getStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'In Progress': 'blue',
      Delayed: 'red',
      Completed: 'green',
    };
    return colorMap[status] || 'default';
  };

  const columns: ColumnsType<WIPStatusData> = [
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
      title: 'Qty in WIP',
      dataIndex: 'qtyInWIP',
      key: 'qtyInWIP',
      sorter: (a, b) => a.qtyInWIP - b.qtyInWIP,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Days in WIP',
      dataIndex: 'daysInWIP',
      key: 'daysInWIP',
      sorter: (a, b) => a.daysInWIP - b.daysInWIP,
      align: 'right',
      width: 120,
      render: (value) => (
        <span style={{ color: value > 7 ? 'var(--color-ff4d4f)' : value > 5 ? 'var(--color-faad14)' : undefined }}>
          {value} days
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 130,
      render: (value) => <Tag color={getStatusColor(value)}>{value}</Tag>,
      filters: [
        { text: 'In Progress', value: 'In Progress' },
        { text: 'Delayed', value: 'Delayed' },
        { text: 'Completed', value: 'Completed' },
      ],
      onFilter: (value, record) => record.status === value,
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
        title="WIP Status Filters"
      />
    </div>
  );
};

export default WIPStatusReport;
