/**
 * Stock Ledger Report - Audit Critical
 * Transaction-level stock movement tracking
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';
import dayjs from 'dayjs';
import physicalInventoryStore from '../../../store/physicalInventoryStore';

interface StockLedgerData {
  key: string;
  date: string;
  itemName: string;
  itemType: string;
  lotShade: string;
  warehouse: string;
  rackBin: string;
  refType: string;
  refNo: string;
  inQty: number;
  outQty: number;
  balanceQty: number;
  uom: string;
  userDepartment: string;
}

const StockLedgerReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<StockLedgerData[]>([]);
  const [searchText, setSearchText] = useState('');

  const sampleData: StockLedgerData[] = [
    {
      key: '1',
      date: '2026-01-10 09:15:00',
      itemName: 'Cotton Poplin White',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-001',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B3',
      refType: 'GRN',
      refNo: 'GRN-2024-001',
      inQty: 500,
      outQty: 0,
      balanceQty: 500,
      uom: 'Meters',
      userDepartment: 'Stores / Rajesh Kumar',
    },
    {
      key: '2',
      date: '2026-01-10 10:30:00',
      itemName: 'Cotton Poplin White',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-001',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B3',
      refType: 'Issue',
      refNo: 'ISS-2024-015',
      inQty: 0,
      outQty: 200,
      balanceQty: 300,
      uom: 'Meters',
      userDepartment: 'Cutting / Suresh Patil',
    },
    {
      key: '3',
      date: '2026-01-10 11:45:00',
      itemName: 'Polyester Satin Blue',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-002 / Shade-A',
      warehouse: 'Main Warehouse',
      rackBin: 'R2-B1',
      refType: 'GRN',
      refNo: 'GRN-2024-002',
      inQty: 800,
      outQty: 0,
      balanceQty: 800,
      uom: 'Meters',
      userDepartment: 'Stores / Rajesh Kumar',
    },
    {
      key: '4',
      date: '2026-01-10 14:20:00',
      itemName: 'Polyester Satin Blue',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-002 / Shade-A',
      warehouse: 'Main Warehouse',
      rackBin: 'R2-B1',
      refType: 'Job Work',
      refNo: 'JWO-2024-025',
      inQty: 0,
      outQty: 300,
      balanceQty: 500,
      uom: 'Meters',
      userDepartment: 'Job Work / Priya Sharma',
    },
    {
      key: '5',
      date: '2026-01-09 16:00:00',
      itemName: 'Zipper 7 inch Metal',
      itemType: 'Trim',
      lotShade: 'LOT-2024-003',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B2',
      refType: 'GRN',
      refNo: 'GRN-2024-003',
      inQty: 5000,
      outQty: 0,
      balanceQty: 15000,
      uom: 'Pcs',
      userDepartment: 'Stores / Neha Desai',
    },
    {
      key: '6',
      date: '2026-01-09 17:30:00',
      itemName: 'Zipper 7 inch Metal',
      itemType: 'Trim',
      lotShade: 'LOT-2024-003',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B2',
      refType: 'Issue',
      refNo: 'ISS-2024-016',
      inQty: 0,
      outQty: 2000,
      balanceQty: 13000,
      uom: 'Pcs',
      userDepartment: 'Stitching / Amit Joshi',
    },
    {
      key: '7',
      date: '2026-01-08 09:00:00',
      itemName: 'Cotton Poplin White',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-001',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B3',
      refType: 'Return',
      refNo: 'RET-2024-008',
      inQty: 50,
      outQty: 0,
      balanceQty: 350,
      uom: 'Meters',
      userDepartment: 'Cutting / Suresh Patil',
    },
    {
      key: '8',
      date: '2026-01-08 11:15:00',
      itemName: 'Denim Stretch Dark Blue',
      itemType: 'Fabric',
      lotShade: 'LOT-2024-004 / Shade-B',
      warehouse: 'Main Warehouse',
      rackBin: 'R1-B5',
      refType: 'Adjustment',
      refNo: 'ADJ-2024-002',
      inQty: 0,
      outQty: 20,
      balanceQty: 1180,
      uom: 'Meters',
      userDepartment: 'Admin / Vikram Rao',
    },
    {
      key: '9',
      date: '2026-01-08 15:45:00',
      itemName: 'Polyester Thread 40/2',
      itemType: 'Thread',
      lotShade: 'LOT-2024-005',
      warehouse: 'Accessories Store',
      rackBin: 'R2-B4',
      refType: 'Transfer',
      refNo: 'TRN-2024-005',
      inQty: 0,
      outQty: 500,
      balanceQty: 4500,
      uom: 'Cones',
      userDepartment: 'Stores / Neha Desai',
    },
    {
      key: '10',
      date: '2026-01-08 16:00:00',
      itemName: 'Polyester Thread 40/2',
      itemType: 'Thread',
      lotShade: 'LOT-2024-005',
      warehouse: 'Production Warehouse',
      rackBin: 'R1-B1',
      refType: 'Transfer',
      refNo: 'TRN-2024-005',
      inQty: 500,
      outQty: 0,
      balanceQty: 500,
      uom: 'Cones',
      userDepartment: 'Stores / Neha Desai',
    },
    {
      key: '11',
      date: '2026-01-07 10:30:00',
      itemName: 'Button 2 Hole Resin',
      itemType: 'Trim',
      lotShade: 'LOT-2024-006',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B1',
      refType: 'GRN',
      refNo: 'GRN-2024-004',
      inQty: 20000,
      outQty: 0,
      balanceQty: 70000,
      uom: 'Pcs',
      userDepartment: 'Stores / Rajesh Kumar',
    },
    {
      key: '12',
      date: '2026-01-07 13:20:00',
      itemName: 'Button 2 Hole Resin',
      itemType: 'Trim',
      lotShade: 'LOT-2024-006',
      warehouse: 'Accessories Store',
      rackBin: 'R3-B1',
      refType: 'Issue',
      refNo: 'ISS-2024-017',
      inQty: 0,
      outQty: 15000,
      balanceQty: 55000,
      uom: 'Pcs',
      userDepartment: 'Finishing / Kavita Nair',
    },
  ];

  React.useEffect(() => {
    // include posted adjustments from physical inventory ledger
    const posted = physicalInventoryStore.listLedger().map((l: any, idx: number) => ({
      key: `p-${idx}-${l.id}`,
      date: l.date.toISOString(),
      itemName: l.itemName,
      itemType: l.itemType,
      lotShade: l.lotShade,
      warehouse: l.warehouse,
      rackBin: '-',
      refType: l.refType,
      refNo: l.refNo,
      inQty: l.inQty,
      outQty: l.outQty,
      balanceQty: l.balanceQty,
      uom: l.uom,
      userDepartment: l.userDepartment,
    }));
    setFilteredData([...sampleData, ...posted]);
  }, []);

  const filters: FilterConfig[] = [
    {
      name: 'dateRange',
      label: 'Date Range',
      type: 'dateRange',
      required: true,
    },
    {
      name: 'item',
      label: 'Item',
      type: 'select',
      options: [
        { label: 'All Items', value: 'all' },
        { label: 'Cotton Poplin White', value: 'cotton_poplin' },
        { label: 'Polyester Satin Blue', value: 'polyester_satin' },
        { label: 'Zipper 7 inch Metal', value: 'zipper_7' },
        { label: 'Denim Stretch Dark Blue', value: 'denim_stretch' },
      ],
    },
    {
      name: 'lotShade',
      label: 'Lot / Shade',
      type: 'select',
      options: [
        { label: 'All Lots', value: 'all' },
        { label: 'LOT-2024-001', value: 'lot_001' },
        { label: 'LOT-2024-002', value: 'lot_002' },
        { label: 'LOT-2024-003', value: 'lot_003' },
      ],
    },
    {
      name: 'warehouse',
      label: 'Warehouse',
      type: 'select',
      options: [
        { label: 'All Warehouses', value: 'all' },
        { label: 'Main Warehouse', value: 'main' },
        { label: 'Accessories Store', value: 'accessories' },
        { label: 'Production Warehouse', value: 'production' },
      ],
    },
    {
      name: 'refType',
      label: 'Reference Type',
      type: 'multiSelect',
      options: [
        { label: 'GRN', value: 'grn' },
        { label: 'Issue', value: 'issue' },
        { label: 'Return', value: 'return' },
        { label: 'Job Work', value: 'jobwork' },
        { label: 'Adjustment', value: 'adjustment' },
        { label: 'Transfer', value: 'transfer' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
    // Mock filtering - in real app would filter based on values
  };

  const handleExportExcel = () => {
    message.success('Exporting Stock Ledger to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting Stock Ledger to PDF...');
  };

  const columns: ColumnsType<StockLedgerData> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 160,
      fixed: 'left',
      render: (text) => dayjs(text).format('DD-MMM-YYYY HH:mm'),
    },
    {
      title: 'Item Name',
      dataIndex: 'itemName',
      key: 'itemName',
      width: 180,
    },
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      width: 110,
      render: (text) => {
        const colorMap: Record<string, string> = {
          Fabric: 'blue',
          Trim: 'green',
          Thread: 'orange',
          FG: 'purple',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Lot / Shade',
      dataIndex: 'lotShade',
      key: 'lotShade',
      width: 150,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 150,
    },
    {
      title: 'Rack / Bin',
      dataIndex: 'rackBin',
      key: 'rackBin',
      width: 100,
      align: 'center',
    },
    {
      title: 'Reference Type',
      dataIndex: 'refType',
      key: 'refType',
      width: 130,
      render: (text) => {
        const colorMap: Record<string, string> = {
          GRN: 'green',
          Issue: 'blue',
          Return: 'orange',
          'Job Work': 'purple',
          Adjustment: 'red',
          Transfer: 'cyan',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Reference No',
      dataIndex: 'refNo',
      key: 'refNo',
      width: 140,
      render: (text) => <strong>{text}</strong>,
    },
    {
      title: 'In Qty',
      dataIndex: 'inQty',
      key: 'inQty',
      width: 100,
      align: 'right',
      render: (val) => (val > 0 ? <span style={{ color: 'var(--color-52c41a)', fontWeight: 'bold' }}>{val}</span> : '-'),
    },
    {
      title: 'Out Qty',
      dataIndex: 'outQty',
      key: 'outQty',
      width: 100,
      align: 'right',
      render: (val) => (val > 0 ? <span style={{ color: 'var(--color-ff4d4f)', fontWeight: 'bold' }}>{val}</span> : '-'),
    },
    {
      title: 'Balance Qty',
      dataIndex: 'balanceQty',
      key: 'balanceQty',
      width: 120,
      align: 'right',
      render: (val, record) => (
        <strong>
          {val} {record.uom}
        </strong>
      ),
    },
    {
      title: 'UOM',
      dataIndex: 'uom',
      key: 'uom',
      width: 80,
      align: 'center',
    },
    {
      title: 'User / Department',
      dataIndex: 'userDepartment',
      key: 'userDepartment',
      width: 180,
    },
  ];

  const displayData = searchText
    ? filteredData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
      )
    : filteredData;

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Stock Ledger Report</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Transaction-level audit trail for all stock movements
            </div>
          </div>
        }
        extra={
          <Space>
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <Button icon={<FilterOutlined />} onClick={() => setFilterDrawerVisible(true)}>
              Filters
            </Button>
            <Button icon={<FileExcelOutlined />} onClick={handleExportExcel} type="primary" ghost>
              Excel
            </Button>
            <Button icon={<FilePdfOutlined />} onClick={handleExportPDF} danger ghost>
              PDF
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="key"
          scroll={{ x: 1800 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} transactions`,
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="Stock Ledger Filters"
      />
    </div>
  );
};

export default StockLedgerReport;
