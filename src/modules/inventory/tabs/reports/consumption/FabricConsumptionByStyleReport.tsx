import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface FabricConsumptionData {
  key: string;
  style: string;
  fabric: string;
  plannedQty: number;
  issuedQty: number;
  actualConsumption: number;
  varianceQty: number;
  variancePct: number;
  uom: string;
}

const FabricConsumptionByStyleReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<FabricConsumptionData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: FabricConsumptionData[] = [
    {
      key: '1',
      style: 'STY-001 - Men Shirt',
      fabric: 'Cotton Poplin White',
      plannedQty: 500,
      issuedQty: 520,
      actualConsumption: 515,
      varianceQty: 15,
      variancePct: 3.0,
      uom: 'Meters',
    },
    {
      key: '2',
      style: 'STY-002 - Ladies Blouse',
      fabric: 'Polyester Satin Blue',
      plannedQty: 800,
      issuedQty: 900,
      actualConsumption: 890,
      varianceQty: 90,
      variancePct: 11.25,
      uom: 'Meters',
    },
    {
      key: '3',
      style: 'STY-003 - Kids Dress',
      fabric: 'Cotton Print',
      plannedQty: 600,
      issuedQty: 610,
      actualConsumption: 605,
      varianceQty: 5,
      variancePct: 0.83,
      uom: 'Meters',
    },
    {
      key: '4',
      style: 'STY-004 - Mens Jeans',
      fabric: 'Denim Stretch Dark Blue',
      plannedQty: 1200,
      issuedQty: 1350,
      actualConsumption: 1320,
      varianceQty: 120,
      variancePct: 10.0,
      uom: 'Meters',
    },
    {
      key: '5',
      style: 'STY-005 - Ladies Top',
      fabric: 'Viscose Rayon Black',
      plannedQty: 400,
      issuedQty: 450,
      actualConsumption: 445,
      varianceQty: 45,
      variancePct: 11.25,
      uom: 'Meters',
    },
    {
      key: '6',
      style: 'STY-006 - Kids Shorts',
      fabric: 'Cotton Twill',
      plannedQty: 300,
      issuedQty: 315,
      actualConsumption: 310,
      varianceQty: 10,
      variancePct: 3.33,
      uom: 'Meters',
    },
    {
      key: '7',
      style: 'STY-007 - Mens T-Shirt',
      fabric: 'Cotton Jersey',
      plannedQty: 1000,
      issuedQty: 1020,
      actualConsumption: 1015,
      varianceQty: 15,
      variancePct: 1.5,
      uom: 'Meters',
    },
    {
      key: '8',
      style: 'STY-008 - Ladies Dress',
      fabric: 'Silk Georgette Cream',
      plannedQty: 700,
      issuedQty: 800,
      actualConsumption: 785,
      varianceQty: 85,
      variancePct: 12.14,
      uom: 'Meters',
    },
    {
      key: '9',
      style: 'STY-009 - Mens Shorts',
      fabric: 'Linen Blend Beige',
      plannedQty: 500,
      issuedQty: 520,
      actualConsumption: 515,
      varianceQty: 15,
      variancePct: 3.0,
      uom: 'Meters',
    },
    {
      key: '10',
      style: 'STY-010 - Ladies Skirt',
      fabric: 'Polyester Crepe',
      plannedQty: 450,
      issuedQty: 480,
      actualConsumption: 475,
      varianceQty: 25,
      variancePct: 5.56,
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
      name: 'style',
      label: 'Style',
      type: 'input',
      placeholder: 'Enter style code or name',
    },
    {
      name: 'fabric',
      label: 'Fabric',
      type: 'input',
      placeholder: 'Enter fabric name',
    },
  ];

  const columns: ColumnsType<FabricConsumptionData> = [
    {
      title: 'Style',
      dataIndex: 'style',
      key: 'style',
      sorter: (a, b) => a.style.localeCompare(b.style),
      width: 200,
    },
    {
      title: 'Fabric',
      dataIndex: 'fabric',
      key: 'fabric',
      sorter: (a, b) => a.fabric.localeCompare(b.fabric),
      width: 200,
    },
    {
      title: 'Planned Qty (BOM)',
      dataIndex: 'plannedQty',
      key: 'plannedQty',
      sorter: (a, b) => a.plannedQty - b.plannedQty,
      align: 'right',
      width: 150,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Issued Qty',
      dataIndex: 'issuedQty',
      key: 'issuedQty',
      sorter: (a, b) => a.issuedQty - b.issuedQty,
      align: 'right',
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Actual Consumption',
      dataIndex: 'actualConsumption',
      key: 'actualConsumption',
      sorter: (a, b) => a.actualConsumption - b.actualConsumption,
      align: 'right',
      width: 150,
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
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : 'var(--color-52c41a)' }}>
          {value > 0 ? '+' : ''}
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Variance %',
      dataIndex: 'variancePct',
      key: 'variancePct',
      sorter: (a, b) => a.variancePct - b.variancePct,
      align: 'right',
      width: 120,
      render: (value) => {
        const isOverTolerance = value > 10;
        return (
          <strong
            style={{
              color: isOverTolerance ? 'var(--color-ff4d4f)' : value > 5 ? 'var(--color-faad14)' : 'var(--color-52c41a)',
              backgroundColor: isOverTolerance ? 'var(--color-fff1f0)' : undefined,
              padding: isOverTolerance ? '2px 8px' : undefined,
              borderRadius: isOverTolerance ? '4px' : undefined,
            }}
          >
            {value > 0 ? '+' : ''}
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
        item.fabric.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by style or fabric..."
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
        title="Fabric Consumption Filters"
      />
    </div>
  );
};

export default FabricConsumptionByStyleReport;
