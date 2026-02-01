/**
 * Inventory Module - Configuration
 * Navigation Menu Structure
 */

import {
  DashboardOutlined,
  DatabaseOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  AppstoreOutlined,
  SyncOutlined,
  ExportOutlined,
  ImportOutlined,
  BoxPlotOutlined,
  FileTextOutlined,
  AuditOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

export interface MenuItem {
  key: string;
  label: string;
  icon?: React.ReactNode;
  children?: MenuItem[];
  path?: string;
}

export const INVENTORY_MENU: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardOutlined />,
    path: '/inventory/dashboard',
  },
  {
    key: 'masters',
    label: 'Masters',
    icon: <DatabaseOutlined />,
    children: [
      {
        key: 'fabric-master',
        label: 'Fabric Master',
        path: '/inventory/masters/fabric',
      },
      {
        key: 'quality-master',
        label: 'Quality Master',
        path: '/inventory/masters/quality',
      },
      {
        key: 'width-master',
        label: 'Width Master',
        path: '/inventory/masters/width',
      },
      {
        key: 'design-master',
        label: 'Design Master',
        path: '/inventory/masters/design',
      },
      {
        key: 'grade-master',
        label: 'Grade Master',
        path: '/inventory/masters/grade',
      },
      {
        key: 'trim-master',
        label: 'Trim & Accessories Master',
        path: '/inventory/masters/trim',
      },
      {
        key: 'warehouse-master',
        label: 'Warehouse / Location Master',
        path: '/inventory/masters/warehouse',
      },
      {
        key: 'supplier-master',
        label: 'Supplier / Job Worker Master',
        path: '/inventory/masters/supplier',
      },
      {
        key: 'shade-master',
        label: 'Shade Master',
        path: '/inventory/masters/shade',
      },
      {
        key: 'uom-master',
        label: 'UOM Master',
        path: '/inventory/masters/uom',
      },
      {
        key: 'warehouse-zone-master',
        label: 'Warehouse Zones',
        path: '/inventory/masters/warehouse-zone',
      },
      {
        key: 'process-master',
        label: 'Process / Operation',
        path: '/inventory/masters/process',
      },
      {
        key: 'material-category-master',
        label: 'Material Category',
        path: '/inventory/masters/material-category',
      },
      {
        key: 'bom-master',
        label: 'BOM',
        path: '/inventory/masters/bom',
      },
    ],
  },
  {
    key: 'procurement',
    label: 'Procurement',
    icon: <ShoppingCartOutlined />,
    children: [
      {
        key: 'purchase-requisition',
        label: 'Purchase Requisition',
        path: '/inventory/procurement/requisition',
      },
      {
        key: 'purchase-order',
        label: 'Purchase Order',
        path: '/inventory/procurement/order',
      },
    ],
  },
  {
    key: 'inward',
    label: 'Inward',
    icon: <InboxOutlined />,
    children: [
      {
        key: 'fabric-grn',
        label: 'Fabric GRN (Roll-wise)',
        path: '/inventory/inward/fabric-grn',
      },
      {
        key: 'trims-grn',
        label: 'Trims GRN',
        path: '/inventory/inward/trims-grn',
      },
      {
        key: 'inspection-qc',
        label: 'Inspection & QC',
        path: '/inventory/inward/inspection',
      },
    ],
  },
  {
    key: 'stock',
    label: 'Stock',
    icon: <AppstoreOutlined />,
    children: [
      {
        key: 'raw-material-stock',
        label: 'Raw Material Stock',
        path: '/inventory/stock/raw-material',
      },
      {
        key: 'reserved-stock',
        label: 'Reserved Stock',
        path: '/inventory/stock/reserved',
      },
      {
        key: 'damaged-rejected',
        label: 'Damaged / Rejected',
        path: '/inventory/stock/damaged',
      },
      {
        key: 'stock-ledger',
        label: 'Stock Ledger',
        path: '/inventory/stock/ledger',
      },
      {
        key: 'stock-adjustments',
        label: 'Adjustments',
        path: '/inventory/stock/adjustments',
      },
      {
        key: 'stock-transfers',
        label: 'Transfers',
        path: '/inventory/stock/transfers',
      },
      {
        key: 'stock-cycle-count',
        label: 'Cycle Count',
        path: '/inventory/stock/cycle-count',
      },
    ],
  },
    {
    key: 'issue-return',
    label: 'Issue & Return',
    icon: <ExportOutlined />,
    children: [
      {
        key: 'issue-to-cutting',
        label: 'Issue to Cutting',
        path: '/inventory/issue-return/issue-cutting',
      },
      {
        key: 'process-transfers',
        label: 'Process Transfers',
        path: '/inventory/issue-return/process-transfers',
      },
      {
        key: 'returns',
        label: 'Returns',
        path: '/inventory/issue-return/returns',
      },
    ],
  },
  {
    key: 'wip',
    label: 'WIP Inventory',
    icon: <SyncOutlined />,
    children: [
      {
        key: 'wip-cutting',
        label: 'Cutting',
        path: '/inventory/wip/cutting',
      },
      {
        key: 'wip-stitching',
        label: 'Stitching',
        path: '/inventory/wip/stitching',
      },
      {
        key: 'wip-washing',
        label: 'Washing / Job Work',
        path: '/inventory/wip/washing',
      },
      {
        key: 'wip-finishing',
        label: 'Finishing',
        path: '/inventory/wip/finishing',
      },
    ],
  },
    {
    key: 'job-work',
    label: 'Job Work',
    icon: <ImportOutlined />,
    children: [
      {
        key: 'job-work-outward',
        label: 'Outward',
        path: '/inventory/job-work/outward',
      },
      {
        key: 'job-work-inward',
        label: 'Inward',
        path: '/inventory/job-work/inward',
      },
    ],
  },
  {
    key: 'finished-goods',
    label: 'Finished Goods',
    icon: <BoxPlotOutlined />,
    children: [
      {
        key: 'packing',
        label: 'Packing',
        path: '/inventory/finished-goods/packing',
      },
      {
        key: 'fg-stock',
        label: 'FG Stock',
        path: '/inventory/finished-goods/stock',
      },
    ],
  },
  {
    key: 'reports',
    label: 'Reports',
    icon: <FileTextOutlined />,
    children: [
      {
        key: 'reports-stock',
        label: 'Stock Reports',
        children: [
          {
            key: 'reports-stock-summary',
            label: 'Stock Summary',
            path: '/inventory/reports/stock/summary',
          },
          {
            key: 'reports-stock-ledger',
            label: 'Stock Ledger',
            path: '/inventory/reports/stock/ledger',
          },
          {
            key: 'reports-stock-valuation',
            label: 'Inventory Valuation',
            path: '/inventory/reports/stock/valuation',
          },
          {
            key: 'reports-stock-aging',
            label: 'Stock Aging',
            path: '/inventory/reports/stock/aging',
          },
          {
            key: 'reports-reserved-vs-available',
            label: 'Reserved vs Available',
            path: '/inventory/reports/stock/reserved-vs-available',
          },
          {
            key: 'reports-reservation-aging',
            label: 'Reservation Aging',
            path: '/inventory/reports/stock/reservation-aging',
          },
        ],
      },
      {
        key: 'reports-consumption',
        label: 'Consumption Reports',
        children: [
          {
            key: 'reports-fabric-consumption',
            label: 'Fabric Consumption by Style',
            path: '/inventory/reports/consumption/fabric',
          },
          {
            key: 'reports-process-consumption',
            label: 'Process-Wise Consumption',
            path: '/inventory/reports/consumption/process',
          },
        ],
      },
      {
        key: 'reports-variance',
        label: 'Variance Reports',
        children: [
          {
            key: 'reports-physical-variance',
            label: 'Physical Inventory Variance',
            path: '/inventory/reports/variance/physical',
          },
          {
            key: 'reports-grn-variance',
            label: 'GRN Shortage/Rejection',
            path: '/inventory/reports/variance/grn',
          },
        ],
      },
      {
        key: 'reports-wip',
        label: 'WIP Reports',
        children: [
          {
            key: 'reports-wip-status',
            label: 'WIP Status',
            path: '/inventory/reports/wip/status',
          },
          {
            key: 'reports-bom-variance',
            label: 'BOM vs WIP Variance',
            path: '/inventory/reports/wip/bom-variance',
          },
          {
            key: 'reports-wip-aging',
            label: 'WIP Aging',
            path: '/inventory/reports/wip/aging',
          },
        ],
      },
      {
        key: 'reports-jobwork',
        label: 'Job Work Reports',
        children: [
          {
            key: 'reports-jobwork-outstanding',
            label: 'Job Work Outstanding',
            path: '/inventory/reports/jobwork/outstanding',
          },
          {
            key: 'reports-jobwork-loss',
            label: 'Job Work Loss',
            path: '/inventory/reports/jobwork/loss',
          },
          {
            key: 'reports-jobwork-tat',
            label: 'Job Work TAT',
            path: '/inventory/reports/jobwork/tat',
          },
        ],
      },
      {
        key: 'reports-finished-goods',
        label: 'Finished Goods Reports',
        children: [
          {
            key: 'reports-fg-stock',
            label: 'FG Stock',
            path: '/inventory/reports/finished-goods/stock',
          },
          {
            key: 'reports-fg-aging',
            label: 'FG Aging',
            path: '/inventory/reports/finished-goods/aging',
          },
          {
            key: 'reports-dispatch-summary',
            label: 'Dispatch Summary',
            path: '/inventory/reports/finished-goods/dispatch',
          },
        ],
      },
    ],
  },
  {
    key: 'physical-inventory',
    label: 'Physical Inventory',
    icon: <AuditOutlined />,
    children: [
      {
        key: 'cycle-count',
        label: 'Cycle Count',
        path: '/inventory/physical/cycle-count',
      },
      {
        key: 'variance-review',
        label: 'Variance Review',
        path: '/inventory/physical/variance-review',
      },
    ],
  },
];

const findMenuPath = (items: MenuItem[], key: string, trail: MenuItem[] = []): MenuItem[] | undefined => {
  for (const item of items) {
    if (item.key === key) return [...trail, item];
    if (item.children) {
      const found = findMenuPath(item.children, key, [...trail, item]);
      if (found) return found;
    }
  }
  return undefined;
};

export const getInventorySectionKey = (sectionKey?: string) => {
  if (!sectionKey) return 'dashboard';
  const path = findMenuPath(INVENTORY_MENU, sectionKey);
  if (!path || path.length === 0) return sectionKey;
  return path[0].key;
};

export const getInventoryBreadcrumbItems = (sectionKey?: string) => {
  const base = [{ title: 'Inventory', icon: <InboxOutlined /> }];
  if (!sectionKey) return base;
  const path = findMenuPath(INVENTORY_MENU, sectionKey);
  if (!path) return base;
  const trail = path.map((item) => ({ title: item.label, icon: item.icon }));
  return [...base, ...trail];
};

// Helper function to get menu items in AntD format
const mapMenuItem = (item: MenuItem): NonNullable<MenuProps['items']>[number] => ({
  key: item.key,
  label: item.label,
  icon: item.icon,
  children: item.children?.map((child) => mapMenuItem(child)),
});

export const getMenuItems = (): MenuProps['items'] => {
  return INVENTORY_MENU.map((item) => mapMenuItem(item));
};

// Flatten menu for quick lookup
export const MENU_PATHS = new Map<string, string>();
const flattenMenu = (items: MenuItem[]) => {
  items.forEach((item) => {
    if (item.path) {
      MENU_PATHS.set(item.key, item.path);
    }
    if (item.children) {
      flattenMenu(item.children);
    }
  });
};
flattenMenu(INVENTORY_MENU);
