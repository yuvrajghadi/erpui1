import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface StockSummaryData {
  key: string;
  itemType: string;
  itemName: string;
  lotShade: string;
  warehouse: string;
  rackBin: string;
  openingQty: number;
  inwardQty: number;
  outwardQty: number;
  closingQty: number;
  uom: string;
}

const StockSummaryReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<StockSummaryData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: StockSummaryData[] = [
    {
      key: '1',
      itemType: 'Fabric',
      itemName: 'Cotton Poplin White',
      lotShade: 'LOT-2024-001',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B3',
      openingQty: 500,
      inwardQty: 200,
      outwardQty: 300,
      closingQty: 400,
      uom: 'Meters',
    },
    {
      key: '2',
      itemType: 'Fabric',
      itemName: 'Polyester Satin Blue',
      lotShade: 'LOT-2024-002 / Shade-A',
      warehouse: 'Main Warehouse',
      rackBin: 'R2-B1',
      openingQty: 800,
      inwardQty: 500,
      outwardQty: 600,
      closingQty: 700,
      uom: 'Meters',
    },
    {
      key: '3',
      itemType: 'Trim',
      itemName: 'Zipper 7 inch Metal',
      lotShade: 'LOT-2024-003',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B2',
      openingQty: 10000,
      inwardQty: 5000,
      outwardQty: 8000,
      closingQty: 7000,
      uom: 'Pcs',
    },
    {
      key: '4',
      itemType: 'Fabric',
      itemName: 'Denim Stretch Dark Blue',
      lotShade: 'LOT-2024-004 / Shade-B',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B5',
      openingQty: 1200,
      inwardQty: 800,
      outwardQty: 900,
      closingQty: 1100,
      uom: 'Meters',
    },
    {
      key: '5',
      itemType: 'Thread',
      itemName: 'Polyester Thread 40/2',
      lotShade: 'LOT-2024-005',
      warehouse: 'Accessories Store',
      rackBin: 'R2-B4',
      openingQty: 5000,
      inwardQty: 3000,
      outwardQty: 4000,
      closingQty: 4000,
      uom: 'Cones',
    },
    {
      key: '6',
      itemType: 'Trim',
      itemName: 'Button 2 Hole Resin',
      lotShade: 'LOT-2024-006',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B1',
      openingQty: 50000,
      inwardQty: 20000,
      outwardQty: 35000,
      closingQty: 35000,
      uom: 'Pcs',
    },
    {
      key: '7',
      itemType: 'Fabric',
      itemName: 'Viscose Rayon Black',
      lotShade: 'LOT-2024-007 / Shade-C',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B2',
      openingQty: 600,
      inwardQty: 400,
      outwardQty: 500,
      closingQty: 500,
      uom: 'Meters',
    },
    {
      key: '8',
      itemType: 'Label',
      itemName: 'Care Label Woven',
      lotShade: 'LOT-2024-008',
      warehouse: 'Accessories Store',
      rackBin: 'R2-B3',
      openingQty: 15000,
      inwardQty: 10000,
      outwardQty: 12000,
      closingQty: 13000,
      uom: 'Pcs',
    },
    {
      key: '9',
      itemType: 'Fabric',
      itemName: 'Linen Blend Beige',
      lotShade: 'LOT-2024-009',
      warehouse: 'Main Warehouse',
      rackBin: 'R2-B2',
      openingQty: 400,
      inwardQty: 300,
      outwardQty: 350,
      closingQty: 350,
      uom: 'Meters',
    },
    {
      key: '10',
      itemType: 'Thread',
      itemName: 'Cotton Thread 60/2',
      lotShade: 'LOT-2024-010',
      warehouse: 'Accessories Store',
      rackBin: 'R2-B5',
      openingQty: 8000,
      inwardQty: 4000,
      outwardQty: 6000,
      closingQty: 6000,
      uom: 'Cones',
    },
    {
      key: '11',
      itemType: 'Trim',
      itemName: 'Snap Button Metal',
      lotShade: 'LOT-2024-011',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B3',
      openingQty: 30000,
      inwardQty: 15000,
      outwardQty: 20000,
      closingQty: 25000,
      uom: 'Sets',
    },
    {
      key: '12',
      itemType: 'Fabric',
      itemName: 'Silk Georgette Cream',
      lotShade: 'LOT-2024-012 / Shade-D',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B4',
      openingQty: 300,
      inwardQty: 150,
      outwardQty: 200,
      closingQty: 250,
      uom: 'Meters',
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
      name: 'item',
      label: 'Item',
      type: 'input',
      placeholder: 'Search by item name',
    },
    {
      name: 'lotShade',
      label: 'Lot/Shade',
      type: 'input',
      placeholder: 'Enter lot or shade code',
    },
  ];

  const columns: ColumnsType<StockSummaryData> = [
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      sorter: (a, b) => a.itemType.localeCompare(b.itemType),
      width: 120,
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      sorter: (a, b) => a.itemName.localeCompare(b.itemName),
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
      title: 'Rack/Bin',
      dataIndex: 'rackBin',
      key: 'rackBin',
      width: 100,
    },
    {
      title: 'Opening Qty',
      dataIndex: 'openingQty',
      key: 'openingQty',
      sorter: (a, b) => a.openingQty - b.openingQty,
      align: 'right',
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Inward Qty',
      dataIndex: 'inwardQty',
      key: 'inwardQty',
      sorter: (a, b) => a.inwardQty - b.inwardQty,
      align: 'right',
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Outward Qty',
      dataIndex: 'outwardQty',
      key: 'outwardQty',
      sorter: (a, b) => a.outwardQty - b.outwardQty,
      align: 'right',
      width: 120,
      render: (value) => value.toLocaleString(),
    },
    {
      title: 'Closing Qty',
      dataIndex: 'closingQty',
      key: 'closingQty',
      sorter: (a, b) => a.closingQty - b.closingQty,
      align: 'right',
      width: 120,
      render: (value) => <strong>{value.toLocaleString()}</strong>,
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 100,
    },
  ];

  const handleFilterApply = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
    // In real implementation, this would call API with filter values
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
        item.itemName.toLowerCase().includes(value.toLowerCase()) ||
        item.lotShade.toLowerCase().includes(value.toLowerCase()) ||
        item.itemType.toLowerCase().includes(value.toLowerCase())
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
          scroll={{ x: 1400, y: 'calc(100vh - 350px)' }}
          sticky
          size="small"
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        filters={filters}
        title="Stock Summary Filters"
      />
    </div>
  );
};

export default StockSummaryReport;
