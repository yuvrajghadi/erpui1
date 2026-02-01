import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface ReservedVsAvailableData {
  key: string;
  item: string;
  styleOrder: string;
  totalQty: number;
  reservedQty: number;
  availableQty: number;
  reservationStatus: 'Fully Reserved' | 'Partially Reserved' | 'Available';
  uom: string;
}

const ReservedVsAvailableReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<ReservedVsAvailableData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: ReservedVsAvailableData[] = [
    {
      key: '1',
      item: 'Cotton Poplin White',
      styleOrder: 'STY-001 / ORD-2024-101',
      totalQty: 500,
      reservedQty: 500,
      availableQty: 0,
      reservationStatus: 'Fully Reserved',
      uom: 'Meters',
    },
    {
      key: '2',
      item: 'Polyester Satin Blue',
      styleOrder: 'STY-002 / ORD-2024-102',
      totalQty: 800,
      reservedQty: 400,
      availableQty: 400,
      reservationStatus: 'Partially Reserved',
      uom: 'Meters',
    },
    {
      key: '3',
      item: 'Zipper 7 inch Metal',
      styleOrder: 'STY-003 / ORD-2024-103',
      totalQty: 10000,
      reservedQty: 0,
      availableQty: 10000,
      reservationStatus: 'Available',
      uom: 'Pcs',
    },
    {
      key: '4',
      item: 'Denim Stretch Dark Blue',
      styleOrder: 'STY-004 / ORD-2024-104',
      totalQty: 1200,
      reservedQty: 1200,
      availableQty: 0,
      reservationStatus: 'Fully Reserved',
      uom: 'Meters',
    },
    {
      key: '5',
      item: 'Polyester Thread 40/2',
      styleOrder: 'STY-005 / ORD-2024-105',
      totalQty: 5000,
      reservedQty: 2500,
      availableQty: 2500,
      reservationStatus: 'Partially Reserved',
      uom: 'Cones',
    },
    {
      key: '6',
      item: 'Button 2 Hole Resin',
      styleOrder: 'STY-006 / ORD-2024-106',
      totalQty: 50000,
      reservedQty: 0,
      availableQty: 50000,
      reservationStatus: 'Available',
      uom: 'Pcs',
    },
    {
      key: '7',
      item: 'Viscose Rayon Black',
      styleOrder: 'STY-007 / ORD-2024-107',
      totalQty: 600,
      reservedQty: 600,
      availableQty: 0,
      reservationStatus: 'Fully Reserved',
      uom: 'Meters',
    },
    {
      key: '8',
      item: 'Care Label Woven',
      styleOrder: 'STY-008 / ORD-2024-108',
      totalQty: 15000,
      reservedQty: 7500,
      availableQty: 7500,
      reservationStatus: 'Partially Reserved',
      uom: 'Pcs',
    },
    {
      key: '9',
      item: 'Linen Blend Beige',
      styleOrder: 'STY-009 / ORD-2024-109',
      totalQty: 400,
      reservedQty: 0,
      availableQty: 400,
      reservationStatus: 'Available',
      uom: 'Meters',
    },
    {
      key: '10',
      item: 'Cotton Thread 60/2',
      styleOrder: 'STY-010 / ORD-2024-110',
      totalQty: 8000,
      reservedQty: 4000,
      availableQty: 4000,
      reservationStatus: 'Partially Reserved',
      uom: 'Cones',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'Main Warehouse', value: 'main' },
        { label: 'Accessories Store', value: 'accessories' },
        { label: 'Finished Goods Store', value: 'fg' },
      ],
    },
    {
      name: 'item',
      label: 'Item',
      type: 'input',
      placeholder: 'Search by item name',
    },
    {
      name: 'style',
      label: 'Style',
      type: 'input',
      placeholder: 'Enter style code',
    },
  ];

  const getReservationStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'Fully Reserved': 'red',
      'Partially Reserved': 'orange',
      Available: 'green',
    };
    return colorMap[status] || 'default';
  };

  const columns: ColumnsType<ReservedVsAvailableData> = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      sorter: (a, b) => a.item.localeCompare(b.item),
      width: 200,
    },
    {
      title: 'Style / Order',
      dataIndex: 'styleOrder',
      key: 'styleOrder',
      width: 200,
    },
    {
      title: 'Total Qty',
      dataIndex: 'totalQty',
      key: 'totalQty',
      sorter: (a, b) => a.totalQty - b.totalQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Reserved Qty',
      dataIndex: 'reservedQty',
      key: 'reservedQty',
      sorter: (a, b) => a.reservedQty - b.reservedQty,
      align: 'right',
      width: 130,
      render: (value, record) => (
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Available Qty',
      dataIndex: 'availableQty',
      key: 'availableQty',
      sorter: (a, b) => a.availableQty - b.availableQty,
      align: 'right',
      width: 130,
      render: (value, record) => (
        <strong style={{ color: value > 0 ? 'var(--color-52c41a)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Reservation Status',
      dataIndex: 'reservationStatus',
      key: 'reservationStatus',
      width: 160,
      render: (value) => <Tag color={getReservationStatusColor(value)}>{value}</Tag>,
      filters: [
        { text: 'Fully Reserved', value: 'Fully Reserved' },
        { text: 'Partially Reserved', value: 'Partially Reserved' },
        { text: 'Available', value: 'Available' },
      ],
      onFilter: (value, record) => record.reservationStatus === value,
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
        item.item.toLowerCase().includes(value.toLowerCase()) ||
        item.styleOrder.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by item or style..."
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
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: 1100, y: 'calc(100vh - 350px)' }}
          sticky
          size="small"
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        filters={filters}
        title="Reserved vs Available Filters"
      />
    </div>
  );
};

export default ReservedVsAvailableReport;
