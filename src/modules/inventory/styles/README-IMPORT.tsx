/**
 * Global Import Guide for Exception-First Table Styles
 * 
 * Add this import to your global layout or main inventory module
 */

// Option 1: Import in your main layout file
// File: src/app/layout.tsx or src/app/(dashboard)/layout.tsx
import '@/modules/inventory/styles/exception-first-tables.css';

// Option 2: Import in your main inventory module
// File: src/modules/inventory/index.tsx
import './styles/exception-first-tables.css';

// Option 3: Add to your global styles
// File: src/styles/globals.scss
// @import '../modules/inventory/styles/exception-first-tables.css';

/**
 * Once imported, you can use the classes in any table component:
 * 
 * Example Usage:
 */

import React from 'react';
import { Table } from 'antd';

type StockRow = {
  agingDays: number;
  quantity: number;
  minStock: number;
  status: string;
};

type StockTableProps = {
  data: StockRow[];
};

const columns: Array<Record<string, unknown>> = [];

const MyStockTable = ({ data }: StockTableProps) => {
  return (
    <Table
      dataSource={data}
      columns={columns}
      rowClassName={(record: StockRow) => {
        // Exception-first logic
        if (record.agingDays > 90) return 'row-critical-aging';
        if (record.agingDays > 60) return 'row-aging';
        if (record.quantity < record.minStock) return 'row-low-stock';
        if (record.status === 'inactive') return 'row-inactive';
        
        // Normal rows - no special styling
        return '';
      }}
    />
  );
};

/**
 * Available Row Classes:
 * 
 * CRITICAL (Red):
 * - row-critical
 * - row-critical-aging
 * - row-low-stock
 * - row-out-of-stock
 * - row-error
 * - row-high-variance
 * - row-wip-delayed
 * - row-quality-reject
 * 
 * WARNING (Orange):
 * - row-aging
 * - row-warning-aging
 * - row-near-low-stock
 * - row-warning
 * - row-excess-stock
 * - row-medium-variance
 * 
 * NEUTRAL (Gray):
 * - row-inactive
 * - row-exception-inactive
 * - row-dead-stock
 * - row-blocked
 * 
 * SPECIAL STATES:
 * - row-pending (Blue)
 * - row-reserved / row-locked (Purple)
 * - row-success (Green - use sparingly)
 * 
 * NORMAL:
 * - '' (empty string) - No special styling for normal/good states
 */

export default MyStockTable;
