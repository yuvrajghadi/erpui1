/**
 * Opening Stock Master
 * Import initial stock balances after all masters are completed
 */

'use client';

import React, { useState } from 'react';
import { Table, Tag, Input, Select, Button, Alert, Space, message, Divider } from 'antd';
import { SearchOutlined, UploadOutlined, CheckCircleOutlined } from '@ant-design/icons';
import type { OpeningStock } from '../types';
import ExcelUploadButtonGroup from '../components/ExcelUploadButtonGroup';
import ExcelPreviewModal from '../components/ExcelPreviewModal';
import { generateSampleExcel } from '../utils/sampleExcelGenerator';
import * as XLSX from 'xlsx';

const OpeningStockMaster: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all');
  
  // Excel upload state
  const [previewData, setPreviewData] = useState<any[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [importLoading, setImportLoading] = useState(false);
  const [isImported, setIsImported] = useState(false);

  // Mock data
  const [dataSource] = useState<OpeningStock[]>([
    {
      materialCode: 'FAB001',
      materialName: 'Cotton Fabric - Grey',
      lotNumber: 'LOT-2024-001',
      shadeCode: 'SHD001',
      warehouseCode: 'WH-A',
      zoneCode: 'ZONE-A',
      binCode: 'BIN-A01',
      quantity: 1500,
      uom: 'Meter',
      rate: 120.50,
      value: 180750,
      expiryDate: '2025-12-31',
      remarks: 'Opening balance from legacy system',
    },
    {
      materialCode: 'TRIM001',
      materialName: 'Metal Button - Silver',
      lotNumber: 'LOT-2024-002',
      warehouseCode: 'WH-A',
      zoneCode: 'ZONE-B',
      binCode: 'BIN-B12',
      quantity: 5000,
      uom: 'Piece',
      rate: 2.50,
      value: 12500,
      remarks: 'Opening stock',
    },
    {
      materialCode: 'FAB002',
      materialName: 'Polyester Blend',
      lotNumber: 'LOT-2024-003',
      shadeCode: 'SHD005',
      warehouseCode: 'WH-B',
      zoneCode: 'ZONE-A',
      quantity: 800,
      uom: 'KG',
      rate: 350.00,
      value: 280000,
    },
  ]);

  const columns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 120,
      fixed: 'left' as const,
      render: (text: string) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Material Name',
      dataIndex: 'materialName',
      key: 'materialName',
      width: 200,
    },
    {
      title: 'Lot Number',
      dataIndex: 'lotNumber',
      key: 'lotNumber',
      width: 140,
      render: (text: string) => text && <Tag color="purple">{text}</Tag>,
    },
    {
      title: 'Shade',
      dataIndex: 'shadeCode',
      key: 'shadeCode',
      width: 100,
      render: (text: string) => text && <Tag color="magenta">{text}</Tag>,
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouseCode',
      key: 'warehouseCode',
      width: 110,
      render: (text: string) => <Tag color="cyan">{text}</Tag>,
    },
    {
      title: 'Zone/Bin',
      key: 'location',
      width: 140,
      render: (_: any, record: OpeningStock) => (
        <Space size="small">
          {record.zoneCode && <Tag color="geekblue">{record.zoneCode}</Tag>}
          {record.binCode && <Tag color="default" style={{ fontSize: 11 }}>{record.binCode}</Tag>}
        </Space>
      ),
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      width: 100,
      align: 'right' as const,
      render: (val: number, record: OpeningStock) => (
        <span style={{ fontWeight: 600 }}>
          {val.toFixed(2)} {record.uom}
        </span>
      ),
    },
    {
      title: 'Rate',
      dataIndex: 'rate',
      key: 'rate',
      width: 100,
      align: 'right' as const,
      render: (val?: number) => val ? `₹${val.toFixed(2)}` : '-',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
      width: 120,
      align: 'right' as const,
      render: (val?: number) => val ? (
        <span style={{ fontWeight: 600, color: 'var(--color-52c41a)' }}>
          ₹{(val / 1000).toFixed(2)}K
        </span>
      ) : '-',
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      width: 120,
      render: (date?: string) => date || '-',
    },
    {
      title: 'Remarks',
      dataIndex: 'remarks',
      key: 'remarks',
      width: 200,
      render: (text?: string) => (
        <span style={{ fontSize: 12, color: 'var(--color-8c8c8c)' }}>
          {text || '-'}
        </span>
      ),
    },
  ];

  const filteredData = dataSource.filter(item => {
    const matchesSearch = searchText === '' ||
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(searchText.toLowerCase())
      );
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouseCode === filterWarehouse;
    return matchesSearch && matchesWarehouse;
  });

  const totalValue = filteredData.reduce((sum, item) => sum + (item.value || 0), 0);
  const totalQtyByUOM = filteredData.reduce((acc, item) => {
    acc[item.uom] = (acc[item.uom] || 0) + item.quantity;
    return acc;
  }, {} as Record<string, number>);

  // Excel upload handlers
  const handleFileSelect = async (file: File) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Map Excel columns to opening stock format
      const mappedData = jsonData.map((row: any, index: number) => ({
        id: `temp-${Date.now()}-${index}`,
        materialCode: row['Material Code'] || row['materialCode'] || '',
        materialName: row['Material Name'] || row['materialName'] || '',
        lotNumber: row['Lot Number'] || row['lotNumber'] || '',
        shadeCode: row['Shade Code'] || row['shadeCode'] || '',
        warehouseCode: row['Warehouse Code'] || row['warehouseCode'] || '',
        zoneCode: row['Zone Code'] || row['zoneCode'] || '',
        binCode: row['Bin Code'] || row['binCode'] || '',
        quantity: Number(row['Quantity'] || row['quantity'] || 0),
        uom: row['UOM'] || row['uom'] || '',
        rate: row['Rate'] ? Number(row['Rate']) : undefined,
        value: row['Value'] ? Number(row['Value']) : undefined,
        expiryDate: row['Expiry Date'] || row['expiryDate'] || '',
        remarks: row['Remarks'] || row['remarks'] || '',
      }));

      setPreviewData(mappedData);
      setPreviewModalOpen(true);
    } catch (error) {
      message.error('Failed to read Excel file. Please ensure it matches the sample format.');
      console.error('Excel read error:', error);
    }
  };

  const handleDownloadSample = () => {
    generateSampleExcel('opening-stock');
  };

  const handleConfirmImport = async () => {
    setImportLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Merge imported data with existing data
      dataSource.push(...previewData);
      
      message.success(`Successfully imported ${previewData.length} opening stock entries`);
      setIsImported(true);
      setPreviewModalOpen(false);
      setPreviewData([]);
    } catch (error) {
      message.error('Failed to import opening stock data');
    } finally {
      setImportLoading(false);
    }
  };

  return (
    <div style={{ padding: 0 }}>
      {/* Important Notice */}
      <Alert
        message="Opening Stock Import - Prerequisites Required"
        description={
          <div>
            <p style={{ marginBottom: 8, fontWeight: 600 }}>Before importing opening stock, ensure these masters are completed:</p>
            <ul style={{ marginBottom: 8, paddingLeft: 20 }}>
              <li><CheckCircleOutlined style={{ color: 'var(--color-52c41a)' }} /> Fabric Master</li>
              <li><CheckCircleOutlined style={{ color: 'var(--color-52c41a)' }} /> Trim & Accessories Master</li>
              <li><CheckCircleOutlined style={{ color: 'var(--color-52c41a)' }} /> Warehouse & Zone Master</li>
              <li><CheckCircleOutlined style={{ color: 'var(--color-52c41a)' }} /> UOM Master</li>
              <li><CheckCircleOutlined style={{ color: 'var(--color-52c41a)' }} /> Shade Master (if applicable)</li>
            </ul>
            <p style={{ marginBottom: 0 }}>
              <strong>Note:</strong> Opening stock will create stock ledger entries with transaction type "Opening Balance".
              Once published, these entries cannot be deleted, only adjusted via stock adjustments.
            </p>
          </div>
        }
        type="info"
        showIcon
        style={{ marginBottom: 16 }}
      />

      {/* Summary Cards */}
      <div style={{
        display: 'flex',
        gap: 16,
        marginBottom: 16,
        padding: 16,
        background: 'var(--page-bg)',
        borderRadius: 8,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)', marginBottom: 4 }}>Total Records</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-1890ff)' }}>{filteredData.length}</div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)', marginBottom: 4 }}>Total Value</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: 'var(--color-52c41a)' }}>
            ₹{(totalValue / 100000).toFixed(2)}L
          </div>
        </div>
        <div style={{ flex: 2 }}>
          <div style={{ fontSize: 12, color: 'var(--color-8c8c8c)', marginBottom: 4 }}>Quantity by UOM</div>
          <Space size="small" wrap>
            {Object.entries(totalQtyByUOM).map(([uom, qty]) => (
              <Tag key={uom} color="purple">
                {qty.toFixed(0)} {uom}
              </Tag>
            ))}
          </Space>
        </div>
      </div>

      {/* Excel Upload Section */}
      <ExcelUploadButtonGroup
        masterName="Opening Stock Master"
        onFileSelect={handleFileSelect}
        onDownloadSample={handleDownloadSample}
        isOpeningData={true}
        disabled={isImported}
      />

      <Divider style={{ margin: '16px 0' }} />

      {/* Toolbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        padding: 16,
        background: 'var(--page-bg)',
        borderRadius: 8,
      }}>
        <Space>
          <Input
            placeholder="Search materials, lots, warehouse..."
            prefix={<SearchOutlined />}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            style={{ width: 300 }}
          />
          <Select
            value={filterWarehouse}
            onChange={setFilterWarehouse}
            style={{ width: 150 }}
          >
            <Select.Option value="all">All Warehouses</Select.Option>
            <Select.Option value="WH-A">Warehouse A</Select.Option>
            <Select.Option value="WH-B">Warehouse B</Select.Option>
          </Select>
        </Space>
      </div>

      {/* Table */}
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey={(record) => `${record.materialCode}-${record.lotNumber}-${record.warehouseCode}`}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} opening stock entries`,
        }}
        scroll={{ x: 'max-content' }}
        size="small"
        bordered
        summary={() => (
          <Table.Summary fixed>
            <Table.Summary.Row style={{ background: 'var(--page-bg)', fontWeight: 600 }}>
              <Table.Summary.Cell index={0} colSpan={8} align="right">
                Total Value:
              </Table.Summary.Cell>
              <Table.Summary.Cell index={8} align="right">
                <span style={{ color: 'var(--color-52c41a)', fontSize: 16, fontWeight: 700 }}>
                  ₹{(totalValue / 100000).toFixed(2)}L
                </span>
              </Table.Summary.Cell>
              <Table.Summary.Cell index={9} colSpan={2} />
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />

      {/* Footer Info */}
      <Alert
        message="Stock Ledger Impact"
        description={
          <div>
            <p style={{ marginBottom: 4 }}>After publishing opening stock:</p>
            <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
              <li>Stock ledger entries will be created with transaction type "Opening Balance"</li>
              <li>Material-wise stock balances will be updated</li>
              <li>Lot-wise tracking will be enabled for items with lot numbers</li>
              <li>Shade-wise stock will be tracked for applicable materials</li>
              <li>All entries will be audited with user and timestamp</li>
            </ul>
          </div>
        }
        type="warning"
        showIcon
        style={{ marginTop: 16 }}
      />

      {/* Excel Preview Modal */}
      <ExcelPreviewModal
        open={previewModalOpen}
        onClose={() => {
          setPreviewModalOpen(false);
          setPreviewData([]);
        }}
        onConfirm={handleConfirmImport}
        data={previewData}
        columns={columns}
        masterName="Opening Stock Master"
        isOpeningData={true}
        loading={importLoading}
      />
    </div>
  );
};

export default OpeningStockMaster;
