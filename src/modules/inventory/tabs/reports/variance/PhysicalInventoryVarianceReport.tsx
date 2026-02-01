import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface VarianceData {
  key: string;
  warehouse: string;
  item: string;
  lotShade: string;
  systemQty: number;
  physicalQty: number;
  varianceQty: number;
  variancePct: number;
  approvedBy: string;
  uom: string;
}

const PhysicalInventoryVarianceReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<VarianceData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: VarianceData[] = [
    {
      key: '1',
      warehouse: 'Main Warehouse',
      item: 'Cotton Poplin White',
      lotShade: 'LOT-2024-001',
      systemQty: 500,
      physicalQty: 495,
      varianceQty: -5,
      variancePct: -1.0,
      approvedBy: 'John Doe',
      uom: 'Meters',
    },
    {
      key: '2',
      warehouse: 'Main Warehouse',
      item: 'Polyester Satin Blue',
      lotShade: 'LOT-2024-002 / Shade-A',
      systemQty: 800,
      physicalQty: 815,
      varianceQty: 15,
      variancePct: 1.88,
      approvedBy: 'Jane Smith',
      uom: 'Meters',
    },
    {
      key: '3',
      warehouse: 'Accessories Store',
      item: 'Zipper 7 inch Metal',
      lotShade: 'LOT-2024-003',
      systemQty: 10000,
      physicalQty: 9950,
      varianceQty: -50,
      variancePct: -0.5,
      approvedBy: 'John Doe',
      uom: 'Pcs',
    },
    {
      key: '4',
      warehouse: 'Main Warehouse',
      item: 'Denim Stretch Dark Blue',
      lotShade: 'LOT-2024-004 / Shade-B',
      systemQty: 1200,
      physicalQty: 1220,
      varianceQty: 20,
      variancePct: 1.67,
      approvedBy: 'Jane Smith',
      uom: 'Meters',
    },
    {
      key: '5',
      warehouse: 'Accessories Store',
      item: 'Polyester Thread 40/2',
      lotShade: 'LOT-2024-005',
      systemQty: 5000,
      physicalQty: 4980,
      varianceQty: -20,
      variancePct: -0.4,
      approvedBy: 'John Doe',
      uom: 'Cones',
    },
    {
      key: '6',
      warehouse: 'Accessories Store',
      item: 'Button 2 Hole Resin',
      lotShade: 'LOT-2024-006',
      systemQty: 50000,
      physicalQty: 50100,
      varianceQty: 100,
      variancePct: 0.2,
      approvedBy: 'Jane Smith',
      uom: 'Pcs',
    },
    {
      key: '7',
      warehouse: 'Main Warehouse',
      item: 'Viscose Rayon Black',
      lotShade: 'LOT-2024-007 / Shade-C',
      systemQty: 600,
      physicalQty: 590,
      varianceQty: -10,
      variancePct: -1.67,
      approvedBy: 'John Doe',
      uom: 'Meters',
    },
    {
      key: '8',
      warehouse: 'Accessories Store',
      item: 'Care Label Woven',
      lotShade: 'LOT-2024-008',
      systemQty: 15000,
      physicalQty: 15050,
      varianceQty: 50,
      variancePct: 0.33,
      approvedBy: 'Jane Smith',
      uom: 'Pcs',
    },
    {
      key: '9',
      warehouse: 'Main Warehouse',
      item: 'Linen Blend Beige',
      lotShade: 'LOT-2024-009',
      systemQty: 400,
      physicalQty: 395,
      varianceQty: -5,
      variancePct: -1.25,
      approvedBy: 'John Doe',
      uom: 'Meters',
    },
    {
      key: '10',
      warehouse: 'Accessories Store',
      item: 'Cotton Thread 60/2',
      lotShade: 'LOT-2024-010',
      systemQty: 8000,
      physicalQty: 8020,
      varianceQty: 20,
      variancePct: 0.25,
      approvedBy: 'Jane Smith',
      uom: 'Cones',
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
      name: 'item',
      label: 'Item',
      type: 'input',
      placeholder: 'Search by item name',
    },
  ];

  const columns: ColumnsType<VarianceData> = [
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      sorter: (a, b) => a.warehouse.localeCompare(b.warehouse),
      width: 150,
    },
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
      title: 'System Qty',
      dataIndex: 'systemQty',
      key: 'systemQty',
      sorter: (a, b) => a.systemQty - b.systemQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Physical Qty',
      dataIndex: 'physicalQty',
      key: 'physicalQty',
      sorter: (a, b) => a.physicalQty - b.physicalQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Variance Qty',
      dataIndex: 'varianceQty',
      key: 'varianceQty',
      sorter: (a, b) => a.varianceQty - b.varianceQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <strong style={{ color: value < 0 ? 'var(--color-ff4d4f)' : value > 0 ? 'var(--color-52c41a)' : undefined }}>
          {value > 0 ? '+' : ''}
          {value.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Variance %',
      dataIndex: 'variancePct',
      key: 'variancePct',
      sorter: (a, b) => a.variancePct - b.variancePct,
      align: 'right',
      width: 120,
      render: (value) => (
        <strong style={{ color: value < 0 ? 'var(--color-ff4d4f)' : value > 0 ? 'var(--color-52c41a)' : undefined }}>
          {value > 0 ? '+' : ''}
          {value.toFixed(2)}%
        </strong>
      ),
    },
    {
      title: 'Approved By',
      dataIndex: 'approvedBy',
      key: 'approvedBy',
      width: 120,
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
        item.lotShade.toLowerCase().includes(value.toLowerCase()) ||
        item.warehouse.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by item or warehouse..."
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
          scroll={{ x: 1300, y: 'calc(100vh - 350px)' }}
          sticky
          size="small"
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilterApply}
        filters={filters}
        title="Physical Inventory Variance Filters"
      />
    </div>
  );
};

export default PhysicalInventoryVarianceReport;
