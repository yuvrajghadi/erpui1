import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message, Tag } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface FGStockData {
  key: string;
  style: string;
  color: string;
  size: string;
  cartonNo: string;
  availableQty: number;
  reservedQty: number;
  dispatchStatus: 'Ready to Ship' | 'Reserved' | 'In Transit';
}

const FGStockReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<FGStockData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: FGStockData[] = [
    {
      key: '1',
      style: 'STY-001 - Men Shirt',
      color: 'White',
      size: 'M',
      cartonNo: 'CTN-001',
      availableQty: 100,
      reservedQty: 0,
      dispatchStatus: 'Ready to Ship',
    },
    {
      key: '2',
      style: 'STY-001 - Men Shirt',
      color: 'Blue',
      size: 'L',
      cartonNo: 'CTN-002',
      availableQty: 0,
      reservedQty: 120,
      dispatchStatus: 'Reserved',
    },
    {
      key: '3',
      style: 'STY-002 - Ladies Blouse',
      color: 'Red',
      size: 'S',
      cartonNo: 'CTN-003',
      availableQty: 80,
      reservedQty: 0,
      dispatchStatus: 'Ready to Ship',
    },
    {
      key: '4',
      style: 'STY-002 - Ladies Blouse',
      color: 'Black',
      size: 'M',
      cartonNo: 'CTN-004',
      availableQty: 0,
      reservedQty: 90,
      dispatchStatus: 'In Transit',
    },
    {
      key: '5',
      style: 'STY-003 - Kids Dress',
      color: 'Pink',
      size: '4Y',
      cartonNo: 'CTN-005',
      availableQty: 150,
      reservedQty: 0,
      dispatchStatus: 'Ready to Ship',
    },
    {
      key: '6',
      style: 'STY-004 - Mens Jeans',
      color: 'Dark Blue',
      size: '32',
      cartonNo: 'CTN-006',
      availableQty: 0,
      reservedQty: 200,
      dispatchStatus: 'Reserved',
    },
    {
      key: '7',
      style: 'STY-004 - Mens Jeans',
      color: 'Black',
      size: '34',
      cartonNo: 'CTN-007',
      availableQty: 180,
      reservedQty: 0,
      dispatchStatus: 'Ready to Ship',
    },
    {
      key: '8',
      style: 'STY-005 - Ladies Top',
      color: 'White',
      size: 'L',
      cartonNo: 'CTN-008',
      availableQty: 0,
      reservedQty: 100,
      dispatchStatus: 'In Transit',
    },
    {
      key: '9',
      style: 'STY-006 - Kids Shorts',
      color: 'Yellow',
      size: '6Y',
      cartonNo: 'CTN-009',
      availableQty: 120,
      reservedQty: 0,
      dispatchStatus: 'Ready to Ship',
    },
    {
      key: '10',
      style: 'STY-007 - Mens T-Shirt',
      color: 'Green',
      size: 'XL',
      cartonNo: 'CTN-010',
      availableQty: 0,
      reservedQty: 150,
      dispatchStatus: 'Reserved',
    },
  ];

  React.useEffect(() => {
    setFilteredData(sampleData);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'style',
      label: 'Style',
      type: 'input',
      placeholder: 'Enter style code or name',
    },
    {
      name: 'color',
      label: 'Color',
      type: 'input',
      placeholder: 'Enter color',
    },
    {
      name: 'size',
      label: 'Size',
      type: 'input',
      placeholder: 'Enter size',
    },
  ];

  const getDispatchStatusColor = (status: string): string => {
    const colorMap: Record<string, string> = {
      'Ready to Ship': 'green',
      Reserved: 'orange',
      'In Transit': 'blue',
    };
    return colorMap[status] || 'default';
  };

  const columns: ColumnsType<FGStockData> = [
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: (a, b) => a.style.localeCompare(b.style),
      width: 200,
    },
    {
      title: 'Color',
      dataIndex: 'color',
      key: 'color',
      sorter: (a, b) => a.color.localeCompare(b.color),
      width: 120,
    },
    {
      title: 'Size',
      dataIndex: 'size',
      key: 'size',
      sorter: (a, b) => a.size.localeCompare(b.size),
      width: 100,
    },
    {
      title: 'Carton No',
      dataIndex: 'cartonNo',
      key: 'cartonNo',
      width: 120,
    },
    {
      title: 'Available Qty',
      dataIndex: 'availableQty',
      key: 'availableQty',
      sorter: (a, b) => a.availableQty - b.availableQty,
      align: 'right',
      width: 130,
      render: (value) => (
        <strong style={{ color: value > 0 ? 'var(--color-52c41a)' : 'var(--color-ff4d4f)' }}>
          {value.toLocaleString()} Pcs
        </strong>
      ),
    },
    {
      title: 'Reserved Qty',
      dataIndex: 'reservedQty',
      key: 'reservedQty',
      sorter: (a, b) => a.reservedQty - b.reservedQty,
      align: 'right',
      width: 130,
      render: (value) => (
        <span style={{ color: value > 0 ? 'var(--color-faad14)' : undefined }}>
          {value.toLocaleString()} Pcs
        </span>
      ),
    },
    {
      title: 'Dispatch Status',
      dataIndex: 'dispatchStatus',
      key: 'dispatchStatus',
      width: 150,
      render: (value) => <Tag color={getDispatchStatusColor(value)}>{value}</Tag>,
      filters: [
        { text: 'Ready to Ship', value: 'Ready to Ship' },
        { text: 'Reserved', value: 'Reserved' },
        { text: 'In Transit', value: 'In Transit' },
      ],
      onFilter: (value, record) => record.dispatchStatus === value,
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
        item.color.toLowerCase().includes(value.toLowerCase()) ||
        item.size.toLowerCase().includes(value.toLowerCase()) ||
        item.cartonNo.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by style, color, size, or carton..."
              prefix={<SearchOutlined />}
              style={{ width: 300 }}
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
            showTotal: (total) => `Total ${total} cartons`,
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
        title="FG Stock Filters"
      />
    </div>
  );
};

export default FGStockReport;
