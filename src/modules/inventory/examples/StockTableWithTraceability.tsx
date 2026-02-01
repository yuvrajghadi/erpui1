/**
 * EXAMPLE: Stock Table with Traceability Integration
 * 
 * This example demonstrates:
 * 1. Exception-first coloring in stock table
 * 2. Traceability action integration
 * 3. Complete supply chain trace
 */

'use client';

import React, { useState } from 'react';
import { Card, Table, Button, Space, Tag, Tooltip, Input } from 'antd';
import { SearchOutlined, EyeOutlined, WarningOutlined } from '@ant-design/icons';
import TraceabilityDrawer from '../components/TraceabilityDrawer';
import type { TraceStep } from '../components/TraceabilityDrawer';

interface StockItem {
  id: string;
  materialCode: string;
  materialName: string;
  lotNumber: string;
  rollNumber: string;
  quantity: number;
  uom: string;
  receivedDate: string;
  agingDays: number;
  warehouse: string;
  status: 'good' | 'aging' | 'critical' | 'low-stock';
}

const calculateAgingDays = (receivedDate: string): number => {
  const received = new Date(receivedDate);
  const now = new Date();
  const diff = now.getTime() - received.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

// Sample stock data with mixed statuses
const sampleStockData: StockItem[] = [
  {
    id: '1',
    materialCode: 'FAB-001',
    materialName: 'Cotton Fabric - White',
    lotNumber: 'LOT-2024-001',
    rollNumber: 'R-001',
    quantity: 25,
    uom: 'kg',
    receivedDate: '2023-09-15',
    agingDays: 120,
    warehouse: 'WH-A',
    status: 'critical', // > 90 days
  },
  {
    id: '2',
    materialCode: 'FAB-002',
    materialName: 'Denim - Dark Blue',
    lotNumber: 'LOT-2024-002',
    rollNumber: 'R-002',
    quantity: 75,
    uom: 'kg',
    receivedDate: '2023-11-10',
    agingDays: 65,
    warehouse: 'WH-A',
    status: 'aging', // 60-90 days
  },
  {
    id: '3',
    materialCode: 'FAB-003',
    materialName: 'Polyester Blend - Gray',
    lotNumber: 'LOT-2024-003',
    rollNumber: 'R-003',
    quantity: 15,
    uom: 'kg',
    receivedDate: '2023-12-20',
    agingDays: 30,
    warehouse: 'WH-B',
    status: 'low-stock', // Below min stock
  },
  {
    id: '4',
    materialCode: 'FAB-004',
    materialName: 'Silk - Cream',
    lotNumber: 'LOT-2024-004',
    rollNumber: 'R-004',
    quantity: 120,
    uom: 'kg',
    receivedDate: '2024-01-05',
    agingDays: 15,
    warehouse: 'WH-A',
    status: 'good', // Normal
  },
  {
    id: '5',
    materialCode: 'FAB-005',
    materialName: 'Cotton Fabric - Black',
    lotNumber: 'LOT-2024-005',
    rollNumber: 'R-005',
    quantity: 200,
    uom: 'kg',
    receivedDate: '2024-01-08',
    agingDays: 12,
    warehouse: 'WH-B',
    status: 'good', // Normal
  },
];

const StockTableWithTraceability: React.FC = () => {
  const [traceVisible, setTraceVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<StockItem | null>(null);
  const [traceData, setTraceData] = useState<TraceStep[]>([]);

  // Handle trace action
  const handleViewTrace = (record: StockItem) => {
    setSelectedItem(record);

    // Generate sample trace data (in real app, fetch from API)
    const trace: TraceStep[] = [
      {
        stage: 'Current Stock - Warehouse',
        date: new Date().toISOString(),
        location: record.warehouse,
        operator: 'System',
        quantity: record.quantity,
        uom: record.uom,
        lotNumber: record.lotNumber,
        status: 'completed',
        remarks: 'Currently in stock',
      },
      {
        stage: 'Quality Check - Inspection',
        date: new Date(record.receivedDate).toISOString(),
        location: 'QC Department',
        operator: 'QC Inspector - Ramesh',
        quantity: record.quantity,
        uom: record.uom,
        status: 'completed',
        remarks: 'Passed all quality checks',
      },
      {
        stage: 'Goods Receipt Note (GRN)',
        date: new Date(new Date(record.receivedDate).getTime() - 2 * 60 * 60 * 1000).toISOString(),
        location: 'Receiving Area',
        operator: 'Warehouse Staff - Suresh',
        quantity: record.quantity + 5, // Show some loss
        uom: record.uom,
        status: 'completed',
        remarks: '5 kg shortage detected during receiving',
      },
      {
        stage: 'Fabric Roll - Supplier Dispatch',
        date: new Date(new Date(record.receivedDate).getTime() - 24 * 60 * 60 * 1000).toISOString(),
        location: 'Supplier Warehouse',
        operator: 'Supplier Staff',
        quantity: record.quantity + 5,
        uom: record.uom,
        batchNumber: 'BATCH-2024-A',
        status: 'completed',
        remarks: 'Dispatched via Transport Co.',
      },
      {
        stage: 'Dye Lot Processing',
        date: new Date(new Date(record.receivedDate).getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Dyeing Unit - Supplier Facility',
        operator: 'Dye Master',
        quantity: record.quantity + 10,
        uom: record.uom,
        status: 'completed',
        remarks: 'Color: Dark Blue, Batch processed',
      },
      {
        stage: 'Supplier - Raw Material',
        date: new Date(new Date(record.receivedDate).getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
        location: 'Supplier: Textile World Ltd.',
        operator: 'Supplier Production',
        quantity: record.quantity + 10,
        uom: record.uom,
        status: 'completed',
        remarks: 'Original raw material received from mill',
      },
    ];

    setTraceData(trace);
    setTraceVisible(true);
  };

  // Table columns with exception-first design
  const columns = [
    {
      title: 'Material Code',
      dataIndex: 'materialCode',
      key: 'materialCode',
      width: 130,
      fixed: 'left' as const,
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
      render: (lot: string) => <Tag color="purple">{lot}</Tag>,
    },
    {
      title: 'Roll Number',
      dataIndex: 'rollNumber',
      key: 'rollNumber',
      width: 120,
    },
    {
      title: 'Quantity',
      key: 'quantity',
      width: 120,
      align: 'right' as const,
      render: (_: any, record: StockItem) => (
        <span>
          {record.quantity} {record.uom}
        </span>
      ),
    },
    {
      title: 'Warehouse',
      dataIndex: 'warehouse',
      key: 'warehouse',
      width: 120,
    },
    {
      title: 'Aging',
      dataIndex: 'agingDays',
      key: 'agingDays',
      width: 100,
      render: (days: number) => {
        // Exception-first: Only color exceptions
        if (days > 90) {
          return (
            <Tooltip title="Critical aging! Consider clearance">
              <Tag color="error" icon={<WarningOutlined />}>
                {days} days
              </Tag>
            </Tooltip>
          );
        }
        if (days > 60) {
          return (
            <Tooltip title="Aging stock - Monitor closely">
              <Tag color="warning">{days} days</Tag>
            </Tooltip>
          );
        }
        // Normal - neutral display
        return <span>{days} days</span>;
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => {
        // Exception-first: Only color issues
        if (status === 'critical') {
          return <Tag color="error">Critical Aging</Tag>;
        }
        if (status === 'low-stock') {
          return <Tag color="error">Low Stock</Tag>;
        }
        if (status === 'aging') {
          return <Tag color="warning">Aging</Tag>;
        }
        // Normal - no tag or neutral
        return <Tag color="success">Good</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right' as const,
      width: 100,
      render: (_: any, record: StockItem) => (
        <Space>
          <Tooltip title="View complete traceability">
            <Button
              type="link"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewTrace(record)}
            >
              Trace
            </Button>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', background: 'var(--color-f5f5f5)', minHeight: '100vh' }}>
      <Card
        title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Raw Material Stock</span>}
        extra={
          <Input
            placeholder="Search materials..."
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
          />
        }
        style={{
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        }}
      >
        <Table
          columns={columns}
          dataSource={sampleStockData}
          rowKey="id"
          scroll={{ x: 1200 }}
          pagination={{
            pageSize: 20,
            showTotal: (total) => `Total ${total} items`,
          }}
          rowClassName={(record) => {
            // Exception-first coloring: Highlight only issues
            if (record.status === 'critical') {
              return 'row-critical'; // Red for critical aging
            }
            if (record.status === 'low-stock') {
              return 'row-low-stock'; // Red for low stock
            }
            if (record.status === 'aging') {
              return 'row-aging'; // Orange for aging
            }
            // Normal rows - no color
            return '';
          }}
        />
      </Card>

      {/* Traceability Drawer */}
      <TraceabilityDrawer
        open={traceVisible}
        onClose={() => setTraceVisible(false)}
        itemName={selectedItem?.materialName || ''}
        itemCode={selectedItem?.materialCode}
        traceData={traceData}
      />

      {/* Exception-first CSS styling */}
      <style jsx global>{`
        .row-critical {
          background-color: var(--color-fff1f0) !important;
          border-left: 4px solid var(--color-ff4d4f);
        }
        .row-low-stock {
          background-color: var(--color-fff1f0) !important;
          border-left: 4px solid var(--color-ff4d4f);
        }
        .row-aging {
          background-color: var(--color-fffbf0) !important;
          border-left: 4px solid var(--color-faad14);
        }
        .row-critical:hover,
        .row-low-stock:hover,
        .row-aging:hover {
          background-color: var(--color-ffe7ba) !important;
        }
      `}</style>
    </div>
  );
};

export default StockTableWithTraceability;
