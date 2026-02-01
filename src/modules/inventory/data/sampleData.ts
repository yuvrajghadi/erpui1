/**
 * Inventory Module - Sample Data
 * Mock data for textile ERP development
 */

import type {
  FabricMaster,
  WarehouseMaster,
  SupplierMaster,
  RawMaterialStock,
  WIPInventory,
  FinishedGoodsStock,
  Alert,
  InventoryKPI,
} from '../types';

// ============================================================================
// FABRIC MASTER DATA
// ============================================================================

export const SAMPLE_FABRICS: FabricMaster[] = [
  {
    id: '1',
    fabricCode: 'FAB-KN-001',
    fabricType: 'knitted',
    construction: 'Single Jersey',
    composition: '100% Cotton',
    defaultUOM: 'kg',
    gsm: 180,
    gsmTolerance: 5,
    width: 1.8,
    widthTolerance: 2,
    shrinkage: 3,
    shadeGroup: 'SG-A',
    status: 'active',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    fabricCode: 'FAB-KN-002',
    fabricType: 'knitted',
    construction: 'Pique',
    composition: '65% Polyester 35% Cotton',
    defaultUOM: 'meter',
    gsm: 220,
    gsmTolerance: 5,
    width: 1.6,
    widthTolerance: 2,
    shrinkage: 2,
    shadeGroup: 'SG-B',
    status: 'active',
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-01-20'),
  },
  {
    id: '3',
    fabricCode: 'FAB-WV-001',
    fabricType: 'woven',
    construction: 'Denim',
    composition: '100% Cotton',
    defaultUOM: 'meter',
    gsm: 350,
    gsmTolerance: 5,
    width: 1.5,
    widthTolerance: 2,
    shrinkage: 5,
    shadeGroup: 'SG-C',
    status: 'active',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-01'),
  },
];

// ============================================================================
// WAREHOUSE DATA
// ============================================================================

export const SAMPLE_WAREHOUSES: WarehouseMaster[] = [
  {
    id: '1',
    warehouseCode: 'WH-RM-01',
    warehouseName: 'Raw Material Warehouse A',
    location: 'Building A, Floor 1',
    type: 'raw_material',
    racks: [
      {
        id: 'r1',
        rackCode: 'R-001',
        rackName: 'Rack - A1',
        warehouseId: '1',
        zone: 'A',
        type: 'raw',
        status: 'active',
        capacity: { uom: 'kg', max: 2000, warningPercent: 80 },
        bins: [
          { id: 'b1', binCode: 'B001', binName: 'Bin 001', rackId: 'r1', capacity: 500, currentQty: 120, status: 'active', meta: { fabric: 'Single Jersey', lot: 'LOT-2024-001', shade: 'White' } },
          { id: 'b2', binCode: 'B002', binName: 'Bin 002', rackId: 'r1', capacity: 500, currentQty: 0, status: 'active' },
        ],
      },
      {
        id: 'r2',
        rackCode: 'R-002',
        rackName: 'Rack - A2',
        warehouseId: '1',
        zone: 'A',
        type: 'raw',
        status: 'active',
        capacity: { uom: 'kg', max: 1500, warningPercent: 75 },
        bins: [
          { id: 'b3', binCode: 'B003', binName: 'Bin 003', rackId: 'r2', capacity: 750, currentQty: 230, status: 'active' },
        ],
      },
    ],
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    warehouseCode: 'WH-WIP-01',
    warehouseName: 'WIP Warehouse',
    location: 'Building B, Floor 2',
    type: 'wip',
    racks: [],
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    warehouseCode: 'WH-FG-01',
    warehouseName: 'Finished Goods Warehouse',
    location: 'Building C, Floor 1',
    type: 'finished_goods',
    racks: [],
    status: 'active',
    createdAt: new Date('2024-01-01'),
  },
];

// ============================================================================
// SUPPLIER DATA
// ============================================================================

export const SAMPLE_SUPPLIERS: SupplierMaster[] = [
  {
    id: '1',
    supplierCode: 'SUP-001',
    supplierName: 'Textile World Ltd.',
    type: 'fabric',
    contactPerson: 'John Smith',
    phone: '+91-9876543210',
    email: 'john@textileworld.com',
    address: 'Industrial Area, Phase 1, Tirupur',
    gst: '33AAAAA0000A1Z5',
    paymentTerms: 'Net 30',
    leadTimeDays: 15,
    status: 'active',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '2',
    supplierCode: 'SUP-002',
    supplierName: 'Premium Trims Co.',
    type: 'trim',
    contactPerson: 'Sarah Johnson',
    phone: '+91-9876543211',
    email: 'sarah@premiumtrims.com',
    address: 'Trim Factory, Bangalore',
    gst: '29BBBBB0000B2Z6',
    paymentTerms: 'Net 15',
    leadTimeDays: 8,
    status: 'active',
    createdAt: new Date('2024-01-10'),
  },
  {
    id: '3',
    supplierCode: 'SUP-003',
    supplierName: 'TechDye Processing House',
    type: 'general',
    contactPerson: 'Rajesh Kumar',
    phone: '+91-9876543212',
    email: 'rajesh@techdye.com',
    address: 'Dyeing Unit, Surat',
    gst: '24CCCCC0000C3Z7',
    paymentTerms: 'Net 45',
    leadTimeDays: 20,
    status: 'active',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '4',
    supplierCode: 'SUP-004',
    supplierName: 'Job Works Masters',
    type: 'job_worker',
    contactPerson: 'Vikram Singh',
    phone: '+91-9876543213',
    email: 'vikram@jobworks.com',
    address: 'Stitching Unit, Chennai',
    gst: '33DDDDD0000D4Z8',
    paymentTerms: 'Net 30',
    leadTimeDays: 12,
    status: 'active',
    createdAt: new Date('2024-01-20'),
  },
  {
    id: '5',
    supplierCode: 'SUP-005',
    supplierName: 'Eco Packaging Solutions',
    type: 'general',
    contactPerson: 'Priya Sharma',
    phone: '+91-9876543214',
    email: 'priya@ecopacking.com',
    address: 'Packaging Factory, Mumbai',
    gst: '27EEEEE0000E5Z9',
    paymentTerms: 'Net 30',
    leadTimeDays: 10,
    status: 'active',
    createdAt: new Date('2024-01-25'),
  },
];

// ============================================================================
// RAW MATERIAL STOCK DATA
// ============================================================================

export const SAMPLE_RAW_STOCK: RawMaterialStock[] = [
  {
    id: '1',
    itemType: 'fabric',
    itemId: '1',
    itemName: 'Single Jersey - Cotton',
    lotNumber: 'LOT-2024-001',
    shade: 'White',
    rollCount: 25,
    totalQty: 500,
    reservedQty: 150,
    availableQty: 350,
    uom: 'kg',
    warehouseId: '1',
    warehouseName: 'Raw Material Warehouse A',
    location: 'RA-01/B-01',
    agingDays: 15,
    lastMovementDate: new Date('2024-12-18'),
    status: 'available',
  },
];

// ============================================================================
// WIP INVENTORY DATA
// ============================================================================

export const SAMPLE_WIP: WIPInventory[] = [
  {
    id: '1',
    styleId: 'STY-001',
    styleName: 'Classic Polo Shirt',
    color: 'White',
    size: 'M',
    quantity: 500,
    currentProcess: 'cutting',
    processLocation: 'Cutting Line 1',
    daysInWIP: 2,
    entryDate: new Date('2024-12-30'),
    expectedCompletionDate: new Date('2025-01-05'),
    status: 'in_progress',
  },
];

// ============================================================================
// FINISHED GOODS STOCK DATA
// ============================================================================

export const SAMPLE_FG_STOCK: FinishedGoodsStock[] = [
  {
    id: '1',
    styleId: 'STY-001',
    styleName: 'Classic Polo Shirt',
    color: 'White',
    size: 'M',
    cartonNumber: 'CTN-001',
    availableQty: 120,
    reservedQty: 0,
    warehouseId: '3',
    location: 'FG-A1-B1',
    packingDate: new Date('2024-12-20'),
    dispatchStatus: 'ready',
  },
];

// ============================================================================
// ALERTS DATA
// ============================================================================

export const SAMPLE_ALERTS: Alert[] = [
  {
    id: '1',
    alertType: 'low_stock',
    severity: 'high',
    title: 'Low Stock Alert',
    message: 'Denim fabric stock below reorder level',
    itemId: '3',
    itemName: 'Denim - Cotton',
    currentQty: 10,
    requiredQty: 50,
    createdAt: new Date('2025-01-02'),
    status: 'open',
  },
];

// ============================================================================
// KPI DATA
// ============================================================================

export const SAMPLE_KPI: InventoryKPI = {
  totalFabricStockKg: 12500,
  totalFabricStockMeters: 45000,
  wipValue: 8500000,
  finishedGoodsValue: 15200000,
  lowStockAlerts: 8,
  deadStockQty: 250,
  averageAgingDays: 32,
  stockTurnoverRatio: 4.5,
};

// Optional chart/sample exports used by some components
export const categoryDistributionData = [
  { name: 'Fabric', value: 55 },
  { name: 'Trims', value: 20 },
  { name: 'WIP', value: 15 },
  { name: 'FG', value: 10 },
];
