import React from 'react';
import {
  InboxOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { SAMPLE_KPI, SAMPLE_ALERTS, SAMPLE_RAW_STOCK, SAMPLE_WIP } from '../../data/sampleData';
import { calculateAgingDays } from '../../utils';

// --- Types ---
export type DashboardView = 'operational' | 'decision' | 'onboarding';

export interface AlertType {
  id: number;
  type: string;
  message: string;
  action: string;
  severity: 'high' | 'medium' | 'low';
}

export interface KPIAction {
  title: string;
  type: string;
  data: any;
}

// --- Colors ---
export const COLORS = ['var(--color-0088fe)', 'var(--color-00c49f)', 'var(--color-ffbb28)', 'var(--color-ff8042)', 'var(--color-8884d8)', 'var(--color-82ca9d)'];

// --- Static Data Helpers ---
export const getFabricStockDetails = () => SAMPLE_RAW_STOCK.slice(0, 10).map((item, idx) => ({
  id: idx + 1,
  materialName: item.materialName,
  lotNumber: item.lotNumber,
  quantity: item.availableQuantity || 0,
  uom: item.uom,
  value: (item.availableQuantity || 0) * 120,
  warehouse: item.warehouseId || 'N/A',
  aging: calculateAgingDays(item.receivedDate),
}));

export const getWipDetails = () => SAMPLE_WIP.slice(0, 10).map((item, idx) => ({
  id: idx + 1,
  styleNumber: item.styleName || 'N/A',
  color: item.color,
  quantity: item.quantity,
  stage: (item as any).processStage || item.currentProcess,
  daysInWIP: Math.floor(Math.random() * 10) + 1,
  status: Math.random() > 0.3 ? 'On Track' : 'Delayed',
}));

export const LOW_STOCK_DETAILS = [
  { id: 1, material: 'Cotton Fabric - Grey', currentStock: 45, minStock: 100, shortage: 55, action: 'Create PO' },
  { id: 2, material: 'Polyester Blend', currentStock: 120, minStock: 200, shortage: 80, action: 'Create PO' },
  { id: 3, material: 'Denim - Dark Blue', currentStock: 30, minStock: 80, shortage: 50, action: 'Create PO' },
  { id: 4, material: 'Interlining', currentStock: 15, minStock: 50, shortage: 35, action: 'Create PO' },
  { id: 5, material: 'Lining Fabric', currentStock: 25, minStock: 60, shortage: 35, action: 'Create PO' },
];

export const DEAD_STOCK_DETAILS = SAMPLE_RAW_STOCK
  .filter(item => calculateAgingDays(item.receivedDate) > 90)
  .slice(0, 8)
  .map((item, idx) => ({
    id: idx + 1,
    materialName: item.materialName,
    lotNumber: item.lotNumber,
    quantity: item.availableQuantity || 0,
    uom: item.uom,
    aging: calculateAgingDays(item.receivedDate),
    value: (item.availableQuantity || 0) * 120,
    action: 'Clearance Sale',
  }));

export const TOP_ALERTS = [
  { id: 1, type: 'Low Stock', message: 'Cotton fabric below reorder level', action: 'Create PO', severity: 'high' },
  { id: 2, type: 'Job Work Delay', message: 'Washing vendor 3 days overdue', action: 'Follow Up', severity: 'medium' },
  { id: 3, type: 'Excess WIP', message: 'Cutting WIP > 7 days average', action: 'Review', severity: 'medium' },
  { id: 4, type: 'GRN Shortage', message: 'GRN-2401 qty short by 120 kg', action: 'Debit Note', severity: 'high' },
  { id: 5, type: 'Bin Capacity', message: 'Rack A-12 at 95% capacity', action: 'Reallocate', severity: 'low' },
];

export const TODAYS_ACTIONS = [
    { 
      id: 1, 
      title: 'Pending QC', 
      desc: '8 fabric GRNs pending inspection', 
      secondary: '₹2.4L value pending QC',
      action: 'Start QC',
      priority: 'high',
      iconColor: 'var(--color-ff4d4f)',
      borderColor: 'var(--color-ff4d4f)'
    },
    { 
      id: 2, 
      title: 'Job Work Inward Due', 
      desc: 'Washing return expected today', 
      secondary: '₹1.8L material with vendors',
      action: 'Track',
      priority: 'high',
      iconColor: 'var(--color-faad14)',
      borderColor: 'var(--color-faad14)'
    },
    { 
      id: 3, 
      title: 'Physical Inventory', 
      desc: 'Zone A physical count scheduled',
      secondary: '5000 kg to be counted',
      action: 'Begin Count',
      priority: 'medium',
      iconColor: 'var(--color-1890ff)',
      borderColor: 'var(--color-1890ff)'
    },
    { 
      id: 4, 
      title: 'Style Shortage', 
      desc: 'Style ST-401 fabric short, blocking cutting',
      secondary: '45 kg shortage',
      action: 'Check Stock',
      priority: 'critical',
      iconColor: 'var(--color-cf1322)',
      borderColor: 'var(--color-cf1322)'
    },
  ];

export const RISK_INDICATORS = [
    {
      id: 1,
      title: 'WIP Age Breach',
      desc: '6 styles exceeding WIP SLA',
      action: 'Review WIP',
      type: 'wipAging',
      severity: 'warning',
      // icon handled in component or passed as prop if needed
    },
    {
      id: 2,
      title: 'Blocked Stock',
      desc: '₹3.2L stock on QC Hold / Dispute',
      action: 'Review Blocked Stock',
      type: 'blockedStock',
      severity: 'error',
    },
];