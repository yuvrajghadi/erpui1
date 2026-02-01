/**
 * Inventory Valuation Snapshot Report
 * Current stock value by rate type (Average / Last GRN / Standard)
 */

import React, { useState } from 'react';
import { Card, Table, Button, Space, Input, Tag, message, Radio } from 'antd';
import { FileExcelOutlined, FilePdfOutlined, FilterOutlined, SearchOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { RadioChangeEvent } from 'antd';
import ReportFilterDrawer, { FilterConfig } from '../components/ReportFilterDrawer';

interface InventoryValuationData {
  key: string;
  itemType: string;
  item: string;
  warehouse: string;
  qty: number;
  uom: string;
  avgRate: number;
  lastGRNRate: number;
  standardRate: number;
  avgStockValue: number;
  lastGRNStockValue: number;
  standardStockValue: number;
}

const InventoryValuationSnapshotReport: React.FC = () => {
  const [filterDrawerVisible, setFilterDrawerVisible] = useState(false);
  const [filteredData, setFilteredData] = useState<InventoryValuationData[]>([]);
  const [searchText, setSearchText] = useState('');
  const [rateType, setRateType] = useState<'avg' | 'lastGRN' | 'standard'>('avg');

  const sampleData: InventoryValuationData[] = [
    {
      key: '1',
      itemType: 'Fabric',
      item: 'Cotton Poplin White',
      warehouse: 'Main Warehouse',
      qty: 500,
      uom: 'Meters',
      avgRate: 250.0,
      lastGRNRate: 260.0,
      standardRate: 245.0,
      avgStockValue: 125000,
      lastGRNStockValue: 130000,
      standardStockValue: 122500,
    },
    {
      key: '2',
      itemType: 'Fabric',
      item: 'Polyester Satin Blue',
      warehouse: 'Main Warehouse',
      qty: 800,
      uom: 'Meters',
      avgRate: 320.0,
      lastGRNRate: 330.0,
      standardRate: 315.0,
      avgStockValue: 256000,
      lastGRNStockValue: 264000,
      standardStockValue: 252000,
    },
    {
      key: '3',
      itemType: 'Trim',
      item: 'Zipper 7 inch Metal',
      warehouse: 'Accessories Store',
      qty: 10000,
      uom: 'Pcs',
      avgRate: 12.5,
      lastGRNRate: 13.0,
      standardRate: 12.0,
      avgStockValue: 125000,
      lastGRNStockValue: 130000,
      standardStockValue: 120000,
    },
    {
      key: '4',
      itemType: 'Fabric',
      item: 'Denim Stretch Dark Blue',
      warehouse: 'Main Warehouse',
      qty: 1200,
      uom: 'Meters',
      avgRate: 450.0,
      lastGRNRate: 460.0,
      standardRate: 440.0,
      avgStockValue: 540000,
      lastGRNStockValue: 552000,
      standardStockValue: 528000,
    },
    {
      key: '5',
      itemType: 'Thread',
      item: 'Polyester Thread 40/2',
      warehouse: 'Accessories Store',
      qty: 5000,
      uom: 'Cones',
      avgRate: 85.0,
      lastGRNRate: 88.0,
      standardRate: 82.0,
      avgStockValue: 425000,
      lastGRNStockValue: 440000,
      standardStockValue: 410000,
    },
    {
      key: '6',
      itemType: 'Trim',
      item: 'Button 2 Hole Resin',
      warehouse: 'Accessories Store',
      qty: 50000,
      uom: 'Pcs',
      avgRate: 2.5,
      lastGRNRate: 2.6,
      standardRate: 2.4,
      avgStockValue: 125000,
      lastGRNStockValue: 130000,
      standardStockValue: 120000,
    },
    {
      key: '7',
      itemType: 'Fabric',
      item: 'Viscose Rayon Black',
      warehouse: 'Main Warehouse',
      qty: 600,
      uom: 'Meters',
      avgRate: 380.0,
      lastGRNRate: 390.0,
      standardRate: 375.0,
      avgStockValue: 228000,
      lastGRNStockValue: 234000,
      standardStockValue: 225000,
    },
    {
      key: '8',
      itemType: 'Label',
      item: 'Care Label Woven',
      warehouse: 'Accessories Store',
      qty: 15000,
      uom: 'Pcs',
      avgRate: 5.0,
      lastGRNRate: 5.2,
      standardRate: 4.8,
      avgStockValue: 75000,
      lastGRNStockValue: 78000,
      standardStockValue: 72000,
    },
    {
      key: '9',
      itemType: 'Fabric',
      item: 'Linen Blend Beige',
      warehouse: 'Main Warehouse',
      qty: 400,
      uom: 'Meters',
      avgRate: 520.0,
      lastGRNRate: 530.0,
      standardRate: 510.0,
      avgStockValue: 208000,
      lastGRNStockValue: 212000,
      standardStockValue: 204000,
    },
    {
      key: '10',
      itemType: 'Thread',
      item: 'Cotton Thread 60/2',
      warehouse: 'Accessories Store',
      qty: 8000,
      uom: 'Cones',
      avgRate: 95.0,
      lastGRNRate: 98.0,
      standardRate: 92.0,
      avgStockValue: 760000,
      lastGRNStockValue: 784000,
      standardStockValue: 736000,
    },
    {
      key: '11',
      itemType: 'Trim',
      item: 'Snap Button Metal',
      warehouse: 'Accessories Store',
      qty: 30000,
      uom: 'Sets',
      avgRate: 8.5,
      lastGRNRate: 8.8,
      standardRate: 8.2,
      avgStockValue: 255000,
      lastGRNStockValue: 264000,
      standardStockValue: 246000,
    },
    {
      key: '12',
      itemType: 'Fabric',
      item: 'Silk Georgette Cream',
      warehouse: 'Main Warehouse',
      qty: 300,
      uom: 'Meters',
      avgRate: 850.0,
      lastGRNRate: 870.0,
      standardRate: 840.0,
      avgStockValue: 255000,
      lastGRNStockValue: 261000,
      standardStockValue: 252000,
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
        { label: 'All Warehouses', value: 'all' },
        { label: 'Main Warehouse', value: 'main' },
        { label: 'Accessories Store', value: 'accessories' },
        { label: 'Production Warehouse', value: 'production' },
      ],
    },
    {
      name: 'itemType',
      label: 'Item Type',
      type: 'multiSelect',
      options: [
        { label: 'Fabric', value: 'fabric' },
        { label: 'Trim', value: 'trim' },
        { label: 'Thread', value: 'thread' },
        { label: 'Label', value: 'label' },
      ],
    },
  ];

  const handleFilter = (values: any) => {
    message.success('Filters applied successfully');
    setFilterDrawerVisible(false);
  };

  const handleExportExcel = () => {
    message.success('Exporting Inventory Valuation Report to Excel...');
  };

  const handleExportPDF = () => {
    message.success('Exporting Inventory Valuation Report to PDF...');
  };

  const handleRateTypeChange = (e: RadioChangeEvent) => {
    setRateType(e.target.value);
  };

  const columns: ColumnsType<InventoryValuationData> = [
    {
      title: 'Item Type',
      dataIndex: 'itemType',
      key: 'itemType',
      width: 110,
      fixed: 'left',
      render: (text) => {
        const colorMap: Record<string, string> = {
          Fabric: 'blue',
          Trim: 'green',
          Thread: 'orange',
          Label: 'purple',
        };
        return <Tag color={colorMap[text] || 'default'}>{text}</Tag>;
      },
    },
    {
      title: 'Item',
      dataIndex: 'item',
      key: 'item',
      width: 200,
      fixed: 'left',
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 160,
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      width: 120,
      align: 'right',
      render: (val, record) => (
        <strong>
          {val.toLocaleString()} {record.uom}
        </strong>
      ),
    },
    {
      title: 'Rate Type',
      key: 'rateType',
      width: 120,
      align: 'center',
      render: () => {
        const displayText =
          rateType === 'avg' ? 'Average' : rateType === 'lastGRN' ? 'Last GRN' : 'Standard';
        const color = rateType === 'avg' ? 'blue' : rateType === 'lastGRN' ? 'green' : 'orange';
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: 'Rate',
      key: 'rate',
      width: 120,
      align: 'right',
      render: (_, record) => {
        const rate =
          rateType === 'avg'
            ? record.avgRate
            : rateType === 'lastGRN'
            ? record.lastGRNRate
            : record.standardRate;
        return <span style={{ color: 'var(--color-1890ff)', fontWeight: 600 }}>₹{rate.toFixed(2)}</span>;
      },
    },
    {
      title: 'Stock Value',
      key: 'stockValue',
      width: 150,
      align: 'right',
      render: (_, record) => {
        const value =
          rateType === 'avg'
            ? record.avgStockValue
            : rateType === 'lastGRN'
            ? record.lastGRNStockValue
            : record.standardStockValue;
        return <strong style={{ color: 'var(--color-52c41a)', fontSize: '14px' }}>₹{value.toLocaleString()}</strong>;
      },
    },
  ];

  const displayData = searchText
    ? filteredData.filter((item) =>
        Object.values(item).some((val) => String(val).toLowerCase().includes(searchText.toLowerCase()))
      )
    : filteredData;

  // Calculate total stock value based on selected rate type
  const totalStockValue = displayData.reduce((sum, d) => {
    const value =
      rateType === 'avg'
        ? d.avgStockValue
        : rateType === 'lastGRN'
        ? d.lastGRNStockValue
        : d.standardStockValue;
    return sum + value;
  }, 0);

  const totalItems = displayData.length;
  const fabricValue = displayData
    .filter((d) => d.itemType === 'Fabric')
    .reduce((sum, d) => {
      const value =
        rateType === 'avg'
          ? d.avgStockValue
          : rateType === 'lastGRN'
          ? d.lastGRNStockValue
          : d.standardStockValue;
      return sum + value;
    }, 0);
  const trimValue = displayData
    .filter((d) => d.itemType === 'Trim')
    .reduce((sum, d) => {
      const value =
        rateType === 'avg'
          ? d.avgStockValue
          : rateType === 'lastGRN'
          ? d.lastGRNStockValue
          : d.standardStockValue;
      return sum + value;
    }, 0);

  return (
    <div>
      <Card
        title={
          <div>
            <div style={{ fontSize: '18px', fontWeight: 600 }}>Inventory Valuation Snapshot</div>
            <div style={{ fontSize: '12px', color: 'var(--color-888888)', fontWeight: 400, marginTop: 4 }}>
              Current stock value by rate type (Average / Last GRN / Standard)
            </div>
          </div>
        }
        extra={
          <Space>
            <Radio.Group value={rateType} onChange={handleRateTypeChange} buttonStyle="solid">
              <Radio.Button value="avg">Average</Radio.Button>
              <Radio.Button value="lastGRN">Last GRN</Radio.Button>
              <Radio.Button value="standard">Standard</Radio.Button>
            </Radio.Group>
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
        <div style={{ marginBottom: 16, display: 'flex', gap: 16 }}>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Items</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>{totalItems}</div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Total Stock Value</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-52c41a)' }}>
              ₹{totalStockValue.toLocaleString()}
            </div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Fabric Value</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-1890ff)' }}>
              ₹{fabricValue.toLocaleString()}
            </div>
          </Card>
          <Card size="small" style={{ flex: 1 }}>
            <div style={{ fontSize: 12, color: 'var(--color-888888)' }}>Trim/Thread Value</div>
            <div style={{ fontSize: 20, fontWeight: 600, color: 'var(--color-722ed1)' }}>
              ₹{trimValue.toLocaleString()}
            </div>
          </Card>
        </div>

        <Table
          columns={columns}
          dataSource={displayData}
          rowKey="key"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          summary={(pageData) => {
            const pageTotal = pageData.reduce((sum, record) => {
              const value =
                rateType === 'avg'
                  ? record.avgStockValue
                  : rateType === 'lastGRN'
                  ? record.lastGRNStockValue
                  : record.standardStockValue;
              return sum + value;
            }, 0);
            return (
              <Table.Summary fixed>
                <Table.Summary.Row style={{ backgroundColor: 'var(--page-bg)' }}>
                  <Table.Summary.Cell index={0} colSpan={6} align="right">
                    <strong>Page Total:</strong>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={6} align="right">
                    <strong style={{ color: 'var(--color-52c41a)', fontSize: '14px' }}>
                      ₹{pageTotal.toLocaleString()}
                    </strong>
                  </Table.Summary.Cell>
                </Table.Summary.Row>
              </Table.Summary>
            );
          }}
        />
      </Card>

      <ReportFilterDrawer
        visible={filterDrawerVisible}
        onClose={() => setFilterDrawerVisible(false)}
        onApply={handleFilter}
        filters={filters}
        title="Inventory Valuation Filters"
      />
    </div>
  );
};

export default InventoryValuationSnapshotReport;
