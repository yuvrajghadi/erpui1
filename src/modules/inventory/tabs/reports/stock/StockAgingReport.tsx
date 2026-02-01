import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface StockAgingData {
  key: string;
  item: string;
  lotShade: string;
  warehouse: string;
  qty: number;
  agingBucket: '0-30' | '31-60' | '61-90' | '90+';
  lastMovementDate: string;
  agingStatus: 'Fast' | 'Slow' | 'Dead';
  uom: string;
}

const StockAgingReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<StockAgingData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: StockAgingData[] = [
    {
      key: '1',
      item: 'Cotton Poplin White',
      lotShade: 'LOT-2024-001',
      warehouse: 'Main Warehouse',
      qty: 150,
      agingBucket: '0-30',
      lastMovementDate: '2025-01-05',
      agingStatus: 'Fast',
      uom: 'Meters',
    },
    {
      key: '2',
      item: 'Polyester Satin Blue',
      lotShade: 'LOT-2024-002 / Shade-A',
      warehouse: 'Main Warehouse',
      qty: 250,
      agingBucket: '31-60',
      lastMovementDate: '2024-12-15',
      agingStatus: 'Fast',
      uom: 'Meters',
    },
    {
      key: '3',
      item: 'Zipper 7 inch Metal',
      lotShade: 'LOT-2024-003',
      warehouse: 'Accessories Store',
      qty: 1000,
      agingBucket: '61-90',
      lastMovementDate: '2024-11-10',
      agingStatus: 'Slow',
      uom: 'Pcs',
    },
    {
      key: '4',
      item: 'Denim Stretch Dark Blue',
      lotShade: 'LOT-2024-004 / Shade-B',
      warehouse: 'Main Warehouse',
      qty: 300,
      agingBucket: '90+',
      lastMovementDate: '2024-09-20',
      agingStatus: 'Dead',
      uom: 'Meters',
    },
    {
      key: '5',
      item: 'Polyester Thread 40/2',
      lotShade: 'LOT-2024-005',
      warehouse: 'Accessories Store',
      qty: 500,
      agingBucket: '0-30',
      lastMovementDate: '2025-01-10',
      agingStatus: 'Fast',
      uom: 'Cones',
    },
    {
      key: '6',
      item: 'Button 2 Hole Resin',
      lotShade: 'LOT-2024-006',
      warehouse: 'Accessories Store',
      qty: 5000,
      agingBucket: '31-60',
      lastMovementDate: '2024-12-05',
      agingStatus: 'Fast',
      uom: 'Pcs',
    },
    {
      key: '7',
      item: 'Viscose Rayon Black',
      lotShade: 'LOT-2024-007 / Shade-C',
      warehouse: 'Main Warehouse',
      qty: 200,
      agingBucket: '61-90',
      lastMovementDate: '2024-11-15',
      agingStatus: 'Slow',
      uom: 'Meters',
    },
    {
      key: '8',
      item: 'Care Label Woven',
      lotShade: 'LOT-2024-008',
      warehouse: 'Accessories Store',
      qty: 3000,
      agingBucket: '0-30',
      lastMovementDate: '2025-01-08',
      agingStatus: 'Fast',
      uom: 'Pcs',
    },
    {
      key: '9',
      item: 'Linen Blend Beige',
      lotShade: 'LOT-2024-009',
      warehouse: 'Main Warehouse',
      qty: 100,
      agingBucket: '90+',
      lastMovementDate: '2024-08-25',
      agingStatus: 'Dead',
      uom: 'Meters',
    },
    {
      key: '10',
      item: 'Cotton Thread 60/2',
      lotShade: 'LOT-2024-010',
      warehouse: 'Accessories Store',
      qty: 800,
      agingBucket: '31-60',
      lastMovementDate: '2024-12-20',
      agingStatus: 'Fast',
      uom: 'Cones',
    },
    {
      key: '11',
      item: 'Snap Button Metal',
      lotShade: 'LOT-2024-011',
      warehouse: 'Accessories Store',
      qty: 4000,
      agingBucket: '61-90',
      lastMovementDate: '2024-11-05',
      agingStatus: 'Slow',
      uom: 'Sets',
    },
    {
      key: '12',
      item: 'Silk Georgette Cream',
      lotShade: 'LOT-2024-012 / Shade-D',
      warehouse: 'Main Warehouse',
      qty: 180,
      agingBucket: '90+',
      lastMovementDate: '2024-09-10',
      agingStatus: 'Dead',
      uom: 'Meters',
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
      name: 'itemType',
      label: 'Item Type',
      type: 'select',
      options: [
        { label: 'Fabric', value: 'fabric' },
        { label: 'Trim', value: 'trim' },
        { label: 'Thread', value: 'thread' },
        { label: 'Label', value: 'label' },
      ],
    },
    {
      name: 'agingBucket',
      label: 'Aging Bucket',
      type: 'multiSelect',
      options: [
        { label: '0-30 Days', value: '0-30' },
        { label: '31-60 Days', value: '31-60' },
        { label: '61-90 Days', value: '61-90' },
        { label: '90+ Days', value: '90+' },
      ],
    },
  ];

  const getAgingBucketColor = (bucket: string): string => {
    const colorMap: Record<string, string> = {
      '0-30': 'green',
      '31-60': 'blue',
      '61-90': 'orange',
      '90+': 'red',
    };
    return colorMap[bucket] || 'default';
  };

  const getAgingStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      Fast: 'green',
      Slow: 'orange',
      Dead: 'red',
    };
    return colorMap[status] || 'default';
  };

  const columns: ColumnsType<StockAgingData> = [
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      sorter: (a, b) => a.item.localeCompare(b.item),
      width: 200,
    },
    {
      title: 'Lot/Shade',
      dataIndex: 'lotShade',
      key: 'lotShade',
      width: 180,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      sorter: (a, b) => a.warehouse.localeCompare(b.warehouse),
      width: 150,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      sorter: (a, b) => a.qty - b.qty,
      align: 'right',
      width: 100,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Aging Bucket',
      dataIndex: 'agingBucket',
      key: 'agingBucket',
      width: 130,
      render: (value) => <Tag color={getAgingBucketColor(value)}>{value} Days</Tag>,
      filters: [
        { text: '0-30 Days', value: '0-30' },
        { text: '31-60 Days', value: '31-60' },
        { text: '61-90 Days', value: '61-90' },
        { text: '90+ Days', value: '90+' },
      ],
      onFilter: (value, record) => record.agingBucket === value,
    },
    {
      title: 'Last Movement',
      dataIndex: 'lastMovementDate',
      key: 'lastMovementDate',
      width: 130,
      sorter: (a, b) => new Date(a.lastMovementDate).getTime() - new Date(b.lastMovementDate).getTime(),
    },
    {
      title: 'Aging Status',
      dataIndex: 'agingStatus',
      key: 'agingStatus',
      width: 120,
      render: (value) => <Tag color={getAgingStatusColor(value)}>{value} Moving</Tag>,
      filters: [
        { text: 'Fast Moving', value: 'Fast' },
        { text: 'Slow Moving', value: 'Slow' },
        { text: 'Dead Stock', value: 'Dead' },
      ],
      onFilter: (value, record) => record.agingStatus === value,
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
        item.lotShade.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by item or lot..."
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
        title="Stock Aging Filters"
      />
    </div>
  );
};

export default StockAgingReport;
