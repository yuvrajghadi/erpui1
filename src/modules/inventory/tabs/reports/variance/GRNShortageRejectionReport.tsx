import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface GRNShortageData {
  key: string;
  supplier: string;
  grnNo: string;
  item: string;
  orderedQty: number;
  receivedQty: number;
  rejectedQty: number;
  shortageQty: number;
  debitNoteRef: string;
  uom: string;
}

const GRNShortageRejectionReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<GRNShortageData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: GRNShortageData[] = [
    {
      key: '1',
      supplier: 'ABC Textiles Ltd',
      grnNo: 'GRN-2024-001',
      item: 'Cotton Poplin White',
      orderedQty: 1000,
      receivedQty: 980,
      rejectedQty: 10,
      shortageQty: 10,
      debitNoteRef: 'DN-2024-001',
      uom: 'Meters',
    },
    {
      key: '2',
      supplier: 'XYZ Fabrics Pvt Ltd',
      grnNo: 'GRN-2024-002',
      item: 'Polyester Satin Blue',
      orderedQty: 1500,
      receivedQty: 1450,
      rejectedQty: 30,
      shortageQty: 20,
      debitNoteRef: 'DN-2024-002',
      uom: 'Meters',
    },
    {
      key: '3',
      supplier: 'Quality Trims Co',
      grnNo: 'GRN-2024-003',
      item: 'Zipper 7 inch Metal',
      orderedQty: 20000,
      receivedQty: 19800,
      rejectedQty: 100,
      shortageQty: 100,
      debitNoteRef: 'DN-2024-003',
      uom: 'Pcs',
    },
    {
      key: '4',
      supplier: 'Denim Masters',
      grnNo: 'GRN-2024-004',
      item: 'Denim Stretch Dark Blue',
      orderedQty: 2000,
      receivedQty: 1980,
      rejectedQty: 15,
      shortageQty: 5,
      debitNoteRef: 'DN-2024-004',
      uom: 'Meters',
    },
    {
      key: '5',
      supplier: 'Thread Solutions Inc',
      grnNo: 'GRN-2024-005',
      item: 'Polyester Thread 40/2',
      orderedQty: 10000,
      receivedQty: 9900,
      rejectedQty: 50,
      shortageQty: 50,
      debitNoteRef: 'DN-2024-005',
      uom: 'Cones',
    },
    {
      key: '6',
      supplier: 'Button Factory',
      grnNo: 'GRN-2024-006',
      item: 'Button 2 Hole Resin',
      orderedQty: 100000,
      receivedQty: 99500,
      rejectedQty: 300,
      shortageQty: 200,
      debitNoteRef: 'DN-2024-006',
      uom: 'Pcs',
    },
    {
      key: '7',
      supplier: 'Premium Fabrics',
      grnNo: 'GRN-2024-007',
      item: 'Viscose Rayon Black',
      orderedQty: 800,
      receivedQty: 790,
      rejectedQty: 5,
      shortageQty: 5,
      debitNoteRef: 'DN-2024-007',
      uom: 'Meters',
    },
    {
      key: '8',
      supplier: 'Label Makers',
      grnNo: 'GRN-2024-008',
      item: 'Care Label Woven',
      orderedQty: 30000,
      receivedQty: 29700,
      rejectedQty: 200,
      shortageQty: 100,
      debitNoteRef: 'DN-2024-008',
      uom: 'Pcs',
    },
    {
      key: '9',
      supplier: 'Natural Fabrics',
      grnNo: 'GRN-2024-009',
      item: 'Linen Blend Beige',
      orderedQty: 600,
      receivedQty: 595,
      rejectedQty: 3,
      shortageQty: 2,
      debitNoteRef: 'DN-2024-009',
      uom: 'Meters',
    },
    {
      key: '10',
      supplier: 'Thread Solutions Inc',
      grnNo: 'GRN-2024-010',
      item: 'Cotton Thread 60/2',
      orderedQty: 15000,
      receivedQty: 14850,
      rejectedQty: 100,
      shortageQty: 50,
      debitNoteRef: 'DN-2024-010',
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
      name: 'supplier',
      label: 'Supplier',
      type: 'input',
      placeholder: 'Enter supplier name',
    },
    {
      name: 'grnNo',
      label: 'GRN No',
      type: 'input',
      placeholder: 'Enter GRN number',
    },
  ];

  const columns: ColumnsType<GRNShortageData> = [
    {
      title: 'Supplier',
      dataIndex: 'supplier',
      key: 'supplier',
      sorter: (a, b) => a.supplier.localeCompare(b.supplier),
      width: 180,
    },
    {
      title: 'GRN No',
      dataIndex: 'grnNo',
      key: 'grnNo',
      width: 130,
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      sorter: (a, b) => a.item.localeCompare(b.item),
      width: 200,
    },
    {
      title: 'Ordered Qty',
      dataIndex: 'orderedQty',
      key: 'orderedQty',
      sorter: (a, b) => a.orderedQty - b.orderedQty,
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
      width: 120,
      render: (value, record) => `${value.toLocaleString()} ${record.uom}`,
    },
    {
      title: 'Rejected Qty',
      dataIndex: 'rejectedQty',
      key: 'rejectedQty',
      sorter: (a, b) => a.rejectedQty - b.rejectedQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Shortage Qty',
      dataIndex: 'shortageQty',
      key: 'shortageQty',
      sorter: (a, b) => a.shortageQty - b.shortageQty,
      align: 'right',
      width: 120,
      render: (value, record) => (
        <span style={{ color: value > 0 ? 'var(--color-ff4d4f)' : undefined }}>
          {value.toLocaleString()} {record.uom}
        </span>
      ),
    },
    {
      title: 'Debit Note Ref',
      dataIndex: 'debitNoteRef',
      key: 'debitNoteRef',
      width: 140,
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
        item.supplier.toLowerCase().includes(value.toLowerCase()) ||
        item.grnNo.toLowerCase().includes(value.toLowerCase()) ||
        item.item.toLowerCase().includes(value.toLowerCase())
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
              placeholder="Search by supplier, GRN, or item..."
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
        title="GRN Shortage/Rejection Filters"
      />
    </div>
  );
};

export default GRNShortageRejectionReport;
