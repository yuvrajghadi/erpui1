import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface DispatchSummaryData {
  key: string;
  orderNo: string;
  style: string;
  shippedQty: number;
  pendingQty: number;
  dispatchDate: string;
}

const DispatchSummaryReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<DispatchSummaryData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: DispatchSummaryData[] = [
    {
      key: '1',
      orderNo: 'ORD-2024-101',
      style: 'STY-001 - Men Shirt',
      shippedQty: 500,
      pendingQty: 0,
      dispatchDate: '2025-01-05',
    },
    {
      key: '2',
      orderNo: 'ORD-2024-102',
      style: 'STY-002 - Ladies Blouse',
      shippedQty: 300,
      pendingQty: 200,
      dispatchDate: '2025-01-08',
    },
    {
      key: '3',
      orderNo: 'ORD-2024-103',
      style: 'STY-003 - Kids Dress',
      shippedQty: 400,
      pendingQty: 100,
      dispatchDate: '2025-01-10',
    },
    {
      key: '4',
      orderNo: 'ORD-2024-104',
      style: 'STY-004 - Mens Jeans',
      shippedQty: 1000,
      pendingQty: 200,
      dispatchDate: '2025-01-12',
    },
    {
      key: '5',
      orderNo: 'ORD-2024-105',
      style: 'STY-005 - Ladies Top',
      shippedQty: 250,
      pendingQty: 150,
      dispatchDate: '2025-01-14',
    },
    {
      key: '6',
      orderNo: 'ORD-2024-106',
      style: 'STY-006 - Kids Shorts',
      shippedQty: 300,
      pendingQty: 0,
      dispatchDate: '2025-01-15',
    },
    {
      key: '7',
      orderNo: 'ORD-2024-107',
      style: 'STY-007 - Mens T-Shirt',
      shippedQty: 800,
      pendingQty: 200,
      dispatchDate: '2025-01-16',
    },
    {
      key: '8',
      orderNo: 'ORD-2024-108',
      style: 'STY-008 - Ladies Dress',
      shippedQty: 400,
      pendingQty: 100,
      dispatchDate: '2025-01-18',
    },
    {
      key: '9',
      orderNo: 'ORD-2024-109',
      style: 'STY-009 - Mens Shorts',
      shippedQty: 350,
      pendingQty: 0,
      dispatchDate: '2025-01-20',
    },
    {
      key: '10',
      orderNo: 'ORD-2024-110',
      style: 'STY-010 - Ladies Skirt',
      shippedQty: 280,
      pendingQty: 120,
      dispatchDate: '2025-01-22',
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
      name: 'orderNo',
      label: 'Order No',
      type: 'input',
      placeholder: 'Enter order number',
    },
    {
      name: 'style',
      label: 'Style',
      type: 'input',
      placeholder: 'Enter style code or name',
    },
  ];

  const columns: ColumnsType<DispatchSummaryData> = [
    {
      title: 'Order No',
      dataIndex: 'orderNo',
      key: 'orderNo',
      sorter: (a, b) => a.orderNo.localeCompare(b.orderNo),
      width: 150,
    },
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: (a, b) => a.style.localeCompare(b.style),
      width: 200,
    },
    {
      title: 'Shipped Qty',
      dataIndex: 'shippedQty',
      key: 'shippedQty',
      sorter: (a, b) => a.shippedQty - b.shippedQty,
      align: 'right',
      width: 130,
      render: (value) => (
        <span style={{ color: 'var(--color-52c41a)' }}>{value.toLocaleString()} Pcs</span>
      ),
    },
    {
      title: 'Pending Qty',
      dataIndex: 'pendingQty',
      key: 'pendingQty',
      sorter: (a, b) => a.pendingQty - b.pendingQty,
      align: 'right',
      width: 130,
      render: (value) => (
        <strong style={{ color: value > 0 ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)' }}>
          {value.toLocaleString()} Pcs
        </strong>
      ),
    },
    {
      title: 'Dispatch Date',
      dataIndex: 'dispatchDate',
      key: 'dispatchDate',
      sorter: (a, b) => new Date(a.dispatchDate).getTime() - new Date(b.dispatchDate).getTime(),
      width: 130,
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
        item.orderNo.toLowerCase().includes(value.toLowerCase()) ||
        item.style.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by order or style..."
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
            showTotal: (total) => `Total ${total} orders`,
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
        title="Dispatch Summary Filters"
      />
    </div>
  );
};

export default DispatchSummaryReport;
