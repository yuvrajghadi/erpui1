/**
 * Inventory Module - TypeScript Type Definitions
 * Textile & Garment ERP System
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type FabricType = 'knitted' | 'woven';

export type UOM = 'kg' | 'meter' | 'piece' | 'yard' | 'roll';

export type InspectionStatus = 'pass' | 'hold' | 'reject' | 'pending';

export type StockStatus = 'available' | 'reserved' | 'damaged' | 'rejected' | 'in_transit' | 'low_stock';

export type ProcessType = 'cutting' | 'stitching' | 'washing' | 'finishing' | 'printing' | 'embroidery' | 'packing';

export type OrderStatus =
  | 'draft'
  | 'pending'
  | 'approved'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'partial'
  | 'closed'
  | 'converted'
  | 'consumed'
  | 'rejected';

export type BarcodeFormat = 'CODE128' | 'QR';

export type PrintStatus = 'not_printed' | 'printed' | 'reprinted';

export type BarcodeLabelSize = '50x25' | '75x50';

// ============================================================================
// BARCODE TYPES
// ============================================================================

export interface BarcodeData {
  rollBarcodeId: string; // Unique barcode ID (auto-generated)
  fabricCode: string;
  fabricName: string;
  lotNumber: string;
  dyeLot?: string;
  shade: string;
  gsmActual: number;
  rollQty: number;
  rollQtyUnit: UOM;
  rollNumber?: string;
  warehouseId: string;
  rackId?: string;
  binId?: string;
  locationDisplay?: string; // "WH-A → Rack R-01 → Bin B-12"
  grnReference: string;
  grnDate: Date;
  generatedAt: Date;
  format: BarcodeFormat;
}

export interface FabricRollWithBarcode {
  rollId: string;
  barcode?: BarcodeData;
  printStatus: PrintStatus;
  printedAt?: Date;
  printCount: number;
  isConsumed: boolean;
  consumedAt?: Date;
  consumedBy?: string;
}

// ============================================================================
// MASTER DATA TYPES
// ============================================================================

export interface FabricMaster {
  id: string;
  fabricCode: string;
  fabricType: FabricType;
  construction: string;
  composition: string;
  defaultUOM: UOM;
  gsm: number;
  gsmTolerance?: number;
  width: number;
  widthTolerance?: number;
  shrinkage?: number;
  shadeGroup?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface TrimAccessoryMaster {
  id: string;
  itemCode: string;
  itemName: string;
  category: string;
  subCategory?: string;
  supplier?: string;
  defaultUOM: UOM;
  minStock: number;
  reorderLevel: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface WarehouseMaster {
  id: string;
  warehouseCode: string;
  warehouseName: string;
  location: string;
  type: 'raw_material' | 'wip' | 'finished_goods' | 'general';
  racks: RackMaster[];
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface RackMaster {
  id: string;
  rackCode: string;
  rackName: string;
  warehouseId?: string;
  zone?: string;
  type?: 'raw' | 'wip' | 'finished';
  status?: 'active' | 'disabled' | 'inactive';
  capacity?: { uom?: UOM; max?: number; warningPercent?: number };
  bins: BinMaster[];
  createdAt?: Date;
}

export interface BinMaster {
  id: string;
  binCode: string;
  binName?: string;
  rackId?: string;
  capacity?: number;
  currentQty?: number;
  status?: 'active' | 'disabled' | 'locked';
  meta?: { fabric?: string; lot?: string; shade?: string; gsm?: number };
}

export interface SupplierMaster {
  id: string;
  supplierCode: string;
  supplierName: string;
  type: 'fabric' | 'trim' | 'job_worker' | 'general';
  contactPerson?: string;
  phone?: string;
  email?: string;
  address?: string;
  gst?: string;
  paymentTerms?: string;
  leadTimeDays?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface BlendComponent {
  fiber: string;
  percent: number;
}

export interface QualityMaster {
  id: string;
  qualityCode: string;
  qualityName: string;
  fabricType: FabricType;
  gsm: number;
  defaultWidthLabel: string;
  defaultWidthUnit: 'inch' | 'cm';
  defaultWidthMeters: number;
  uom: UOM;
  warp?: string;
  weft?: string;
  construction?: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  blend: BlendComponent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WidthMaster {
  id: string;
  widthLabel: string;
  unit: 'inch' | 'cm';
  meters: number;
  description?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
}

export interface DesignMaster {
  id: string;
  designCode: string;
  designName: string;
  repeatSize?: string;
  colorPalette?: string[];
  season?: string;
  buyer?: string;
  imageUrl?: string;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
}

export interface GradeMaster {
  id: string;
  grade: 'A' | 'B' | 'C';
  description?: string;
  acceptancePercent: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt?: Date;
}

// ============================================================================
// PROCUREMENT TYPES
// ============================================================================

export interface PurchaseRequisition {
  id: string;
  prNumber: string;
  prDate: Date;
  requiredDate?: Date;
  requestedBy: string;
  department: string;
  items: PRItem[];
  status: OrderStatus;
  approvedBy?: string;
  approvalDate?: Date;
  remarks?: string;
}

export interface PRItem {
  id: string;
  itemType: 'fabric' | 'trim' | 'other';
  itemId: string;
  itemName: string;
  specification: string;
  quantity: number;
  uom: UOM;
  requiredDate: Date;
  purpose: string;
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poDate: Date;
  supplierId: string;
  supplierName: string;
  deliveryLocation: string;
  expectedDeliveryDate: Date;
  deliveryDate?: Date;
  linkedStyleOrder?: string;
  items: POItem[];
  totalAmount: number;
  status: OrderStatus;
  terms?: string;
  createdBy: string;
  createdAt: Date;
}

export interface POItem {
  id: string;
  itemType: 'fabric' | 'trim' | 'other';
  itemId: string;
  itemName: string;
  description: string;
  color?: string;
  quantity: number;
  uom: UOM;
  rate: number;
  amount: number;
  leadTimeDays?: number;
  deliveryDate?: Date;
}

// ============================================================================
// INWARD / GRN TYPES
// ============================================================================

export interface FabricGRN {
  id: string;
  grnNumber: string;
  grnDate: Date;
  poId?: string;
  poNumber?: string;
  supplierId: string;
  supplierName: string;
  fabricCode?: string;
  fabricType?: string;
  warehouseId: string;
  challanNumber?: string;
  challanDate?: Date;
  rolls: FabricRoll[];
  lotNumber?: string; // GRN level batch/lot
  receivedUom?: UOM;
  receivedQuantity?: number;
  shortExcessQty?: number;
  putAwayStatus?: 'pending' | 'in-progress' | 'completed';
  status: OrderStatus;
  inspectedBy?: string;
  receivedBy: string;
  remarks?: string;
  createdAt: Date;
}

export interface FabricRoll {
  id: string;
  rollNumber: string;
  barcode?: string; // legacy field
  barcodeId?: string; // new unique barcode ID
  printStatus?: PrintStatus;
  printedAt?: Date;
  printCount?: number;
  fabricId: string;
  fabricName: string;
  lotNumber: string;
  batchNumber?: string;
  dyeLot: string;
  shade: string;
  gsmActual: number;
  gsmVariance?: number;
  widthActual: number;
  widthVariance?: number;
  lengthInMeters?: number;
  weightInKg?: number;
  inspectionStatus: InspectionStatus;
  inspectionCategory?: 'major' | 'minor' | 'critical';
  defectPercentage?: number;
  quarantineStatus?: 'none' | 'quarantine';
  inspectionRemarks?: string;
  warehouseId: string;
  rackId?: string;
  binId?: string;
  location?: string;
  receivedDate: Date;
  // aliases / additional fields used by components
  quantityInKg?: number;
  quantityInMeters?: number;
  shadeNumber?: string;
  rackCode?: string;
  binCode?: string;
  fabricCode?: string;
  actualGsm?: number; // alias for gsmActual
  putAwayStatus?: 'pending' | 'in-progress' | 'completed';
}

export interface TrimsGRN {
  id: string;
  grnNumber: string;
  grnDate: Date;
  poId?: string;
  supplierId: string;
  supplierName: string;
  warehouseId: string;
  items: TrimsGRNItem[];
  batchNumber?: string;
  sampleApprovalRef?: string;
  receivedCondition?: 'good' | 'damaged';
  inspectionRequired?: boolean;
  overShortQty?: number;
  status: OrderStatus;
  receivedBy: string;
  createdAt: Date;
}

export interface TrimsGRNItem {
  id: string;
  itemId: string;
  itemName: string;
  receivedQty: number;
  uom: UOM;
  inspectionStatus: InspectionStatus;
  location?: string;
}

export interface InspectionRecord {
  id: string;
  grnId: string;
  grnNumber?: string;
  grnType: 'fabric' | 'trim';
  inspectionDate: Date;
  inspectedBy: string;
  defects: DefectRecord[];
  overallStatus: InspectionStatus;
  defectCategory?: 'major' | 'minor' | 'critical';
  defectPercentage?: number;
  qcApprovedBy?: string;
  reInspectionRequired?: boolean;
  allowedDeviation?: number;
  remarks?: string;
}

export interface DefectRecord {
  id: string;
  defectType: string;
  severity: 'minor' | 'major' | 'critical';
  quantity: number;
  location?: string;
  description?: string;
}

// ============================================================================
// STOCK TYPES
// ============================================================================

export interface RawMaterialStock {
  id: string;
  itemType: 'fabric' | 'trim';
  itemId: string;
  itemName: string;
  lotNumber?: string;
  shade?: string;
  rollCount?: number;
  totalQty: number;
  reservedQty: number;
  availableQty: number;
  damagedQty?: number;
  uom: UOM;
  warehouseId: string;
  warehouseName: string;
  location?: string;
  agingDays: number;
  lastMovementDate: Date;
  status: StockStatus;
  // alternate field names used in components
  materialCode?: string;
  materialName?: string;
  availableQuantity?: number;
  reservedQuantity?: number;
  unitRate?: number;
  rackCode?: string;
  binCode?: string;
  receivedDate?: Date;
}

export interface StockReservation {
  id: string;
  styleId: string;
  styleName: string;
  orderId?: string;
  itemId: string;
  itemName: string;
  lotNumber?: string;
  shade?: string;
  requiredQty: number;
  reservedQty: number;
  priority: 'high' | 'medium' | 'low';
  reservedDate: Date;
  requiredDate: Date;
  status: 'active' | 'released' | 'cancelled';
}

// ============================================================================
// WIP TYPES
// ============================================================================

export interface WIPInventory {
  id: string;
  styleId: string;
  styleName: string;
  color: string;
  size: string;
  quantity: number;
  currentProcess: ProcessType;
  processLocation: string;
  daysInWIP: number;
  entryDate: Date;
  expectedCompletionDate?: Date;
  status: 'in_progress' | 'on_hold' | 'completed';
  remarks?: string;
  // aliases
  processStage?: string;
  startDate?: Date;
}

export interface IssueToProduction {
  id: string;
  issueNumber: string;
  issueDate: Date;
  styleId: string;
  styleName: string;
  processType: ProcessType;
  processLine?: string;
  items: IssueItem[];
  issuedBy: string;
  receivedBy?: string;
  status: OrderStatus;
}

export interface IssueItem {
  id: string;
  itemId: string;
  itemName: string;
  lotNumber?: string;
  shade?: string;
  rollNumber?: string;
  availableQty: number;
  issuedQty: number;
  uom: UOM;
  fromLocation: string;
}

export interface ProcessReturn {
  id: string;
  returnNumber: string;
  returnDate: Date;
  linkedIssueId?: string;
  processType: ProcessType;
  items: ReturnItem[];
  returnedBy: string;
  status: OrderStatus;
}

export interface ReturnItem {
  id: string;
  itemId: string;
  itemName: string;
  returnedQty: number;
  uom: UOM;
  reason: string;
  condition: 'good' | 'damaged' | 'rejected';
}

// ============================================================================
// JOB WORK TYPES
// ============================================================================

export interface JobWorkOutward {
  id: string;
  challanNumber: string;
  challanDate: Date;
  vendorId: string;
  vendorName: string;
  processType: ProcessType;
  styleId?: string;
  items: JobWorkItem[];
  expectedReturnDate: Date;
  status: OrderStatus;
  sentBy: string;
  remarks?: string;
}

export interface JobWorkInward {
  id: string;
  inwardNumber: string;
  inwardDate: Date;
  linkedChallanId: string;
  challanNumber: string;
  vendorId: string;
  vendorName: string;
  processType: ProcessType;
  items: JobWorkReturnItem[];
  status: OrderStatus;
  receivedBy: string;
  remarks?: string;
}

export interface JobWorkItem {
  id: string;
  itemId: string;
  itemName: string;
  quantity: number;
  uom: UOM;
  processRate?: number;
}

export interface JobWorkReturnItem extends JobWorkItem {
  sentQty: number;
  receivedQty: number;
  shortageQty: number;
  damageQty: number;
  inspectionStatus: InspectionStatus;
}

// ============================================================================
// FINISHED GOODS TYPES
// ============================================================================

export interface PackingEntry {
  id: string;
  packingNumber: string;
  packingDate: Date;
  styleId: string;
  styleName: string;
  color: string;
  sizeRatio: SizeRatio[];
  packType: string;
  cartons: CartonDetail[];
  totalQty: number;
  packedBy: string;
  status: OrderStatus;
}

export interface SizeRatio {
  size: string;
  quantity: number;
}

export interface CartonDetail {
  cartonNumber: string;
  qtyPerCarton: number;
  sizeBreakdown: SizeRatio[];
  weight?: number;
  dimensions?: string;
}

export interface FinishedGoodsStock {
  id: string;
  styleId: string;
  styleName: string;
  color: string;
  size: string;
  cartonNumber?: string;
  availableQty: number;
  reservedQty: number;
  warehouseId: string;
  location?: string;
  packingDate: Date;
  dispatchStatus: 'pending' | 'ready' | 'dispatched';
  // extras used by UI
  sizeBreakdown?: Record<string, number> | any;
  cartonCount?: number;
  totalPieces?: number;
  totalValue?: number;
}

// ============================================================================
// PHYSICAL INVENTORY TYPES
// ============================================================================

export interface CycleCount {
  id: string;
  countNumber: string;
  countDate: Date;
  warehouseId: string;
  warehouseName: string;
  binId?: string;
  items: CycleCountItem[];
  countedBy: string;
  status: 'draft' | 'submitted' | 'approved' | 'completed' | 'rejected';
}

export interface CycleCountItem {
  id: string;
  itemId: string;
  itemName: string;
  systemQty: number;
  physicalQty: number;
  variance: number;
  variancePercentage: number;
  uom: UOM;
  location: string;
  remarks?: string;
}

export interface VarianceReview {
  id: string;
  cycleCountId: string;
  reviewDate: Date;
  reviewedBy: string;
  items: VarianceReviewItem[];
  status: 'pending' | 'approved' | 'rejected';
}

export interface VarianceReviewItem {
  id: string;
  cycleCountItemId: string;
  itemName: string;
  variance: number;
  reason: string;
  action: 'adjust' | 'investigate' | 'reject';
  adjustmentQty?: number;
}

// ============================================================================
// STOCK LEDGER & TRANSACTION HISTORY
// ============================================================================

export type StockTransactionType =
  | 'grn'
  | 'issue'
  | 'return'
  | 'job_work_out'
  | 'job_work_in'
  | 'adjustment'
  | 'transfer'
  | 'opening_balance'
  | 'damaged'
  | 'consumption';

export interface StockLedgerEntry {
  id: string;
  transactionDate: Date;
  materialCode: string;
  materialName: string;
  lotNumber?: string;
  batchNumber?: string;
  referenceType: StockTransactionType;
  referenceNumber: string;
  inQuantity: number;
  outQuantity: number;
  balanceQuantity: number;
  uom: UOM;
  warehouseId: string;
  warehouseName: string;
  rackCode?: string;
  binCode?: string;
  location?: string;
  userId?: string;
  userName?: string;
  department?: string;
  remarks?: string;
  createdAt: Date;
}

// ============================================================================
// ISSUE / ISSUE LEDGER TYPES
// ============================================================================

export type IssueStatus = 'draft' | 'submitted' | 'approved' | 'rejected' | 'issued' | 'consumed' | 'returned';

export interface IssueLedgerEntry {
  id: string;
  issueNumber: string;
  issueDate: Date;
  materialCode: string;
  materialName: string;
  lotNumber?: string;
  rollNumber?: string;
  issuedQty: number;
  returnedQty?: number;
  transferredQty?: number;
  balanceQty: number;
  currentProcess?: ProcessType;
  status?: IssueStatus;
  remarks?: string;
  userId?: string;
  userName?: string;
  createdAt: Date;
}

// ============================================================================
// STOCK ADJUSTMENT
// ============================================================================

export type AdjustmentType = 'increase' | 'decrease';
export type AdjustmentReason =
  | 'physical_count'
  | 'damage'
  | 'correction'
  | 'expired'
  | 'theft'
  | 'system_error'
  | 'other';

export interface StockAdjustment {
  id: string;
  adjustmentNumber: string;
  adjustmentDate: Date;
  adjustmentType: AdjustmentType;
  reason: AdjustmentReason;
  materialId: string;
  materialCode: string;
  materialName: string;
  lotNumber?: string;
  batchNumber?: string;
  quantity: number;
  uom: UOM;
  warehouseId: string;
  warehouseName: string;
  rackCode?: string;
  binCode?: string;
  approvalStatus: 'draft' | 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvalDate?: Date;
  remarks?: string;
  createdBy: string;
  createdAt: Date;
}

// ============================================================================
// LOT LIFECYCLE STATUS
// ============================================================================

export type LotStatus =
  | 'active'
  | 'blocked'
  | 'quarantine'
  | 'expired'
  | 'closed';

export interface LotLifecycle {
  lotNumber: string;
  status: LotStatus;
  statusChangeDate: Date;
  statusChangeReason?: string;
  statusChangedBy?: string;
  expiryDate?: Date;
  blockReason?: string;
  isIssuable: boolean;
}

// ============================================================================
// STOCK TRANSFER
// ============================================================================

export interface StockTransfer {
  id: string;
  transferNumber: string;
  transferDate: Date;
  fromWarehouseId: string;
  fromWarehouseName: string;
  fromRackCode?: string;
  fromBinCode?: string;
  toWarehouseId: string;
  toWarehouseName: string;
  toRackCode?: string;
  toBinCode?: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  lotNumber?: string;
  quantity: number;
  uom: UOM;
  reason: string;
  status: 'draft' | 'in_transit' | 'completed' | 'cancelled';
  requestedBy: string;
  approvedBy?: string;
  remarks?: string;
  createdAt: Date;
}

// ============================================================================
// REORDER RULES
// ============================================================================

export interface ReorderRule {
  materialId: string;
  materialCode: string;
  minimumStock: number;
  reorderLevel: number;
  maximumStock: number;
  leadTimeDays: number;
  autoGeneratePR: boolean;
  uom: UOM;
}

// ============================================================================
// UOM CONVERSION
// ============================================================================

export interface UOMConversion {
  materialId: string;
  baseUom: UOM;
  alternateUom: UOM;
  conversionFactor: number;
  formula: string; // e.g., "1 meter = 0.220 kg"
}

// ============================================================================
// RESERVED STOCK ENHANCED
// ============================================================================

export interface StockReservationEnhanced extends StockReservation {
  expiryDate: Date;
  reservationStatus: 'active' | 'expired' | 'consumed' | 'cancelled';
  autoReleaseOnExpiry: boolean;
  expiryAction?: 'release' | 'extend' | 'manual_approval';
}

// ============================================================================
// ALERT TYPES
// ============================================================================

export interface Alert {
  id: string;
  alertType: 'low_stock' | 'aging_stock' | 'style_shortage' | 'job_work_delay' | 'inspection_pending';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  itemId?: string;
  itemName?: string;
  currentQty?: number;
  requiredQty?: number;
  agingDays?: number;
  createdAt: Date;
  status: 'open' | 'acknowledged' | 'resolved' | 'active';
  acknowledgedBy?: string;
  resolvedBy?: string;
}

// ============================================================================
// DASHBOARD & REPORT TYPES
// ============================================================================

export interface InventoryKPI {
  totalFabricStockKg: number;
  totalFabricStockMeters: number;
  wipValue: number;
  finishedGoodsValue: number;
  lowStockAlerts: number;
  deadStockQty: number;
  averageAgingDays: number;
  stockTurnoverRatio: number;
  // optional fields used in dashboard UI
  totalRawMaterialValue?: number;
  pendingPOs?: number;
  pendingPOsValue?: number;
  pendingGRNs?: number;
  agingBreakdown?: Record<string, number>;
  agingStockItems?: number;
}

// Backwards-compatible aliases for some item types

// ============================================================================
// WIP LOT / BATCH TRACEABILITY TYPES
// ============================================================================

export interface WIPLot {
  lotNumber: string; // auto-generated: GRNLOT-ORDER-WIP
  parentLot?: string; // Fabric or Trim Lot reference
  wipNumber: string; // Local WIP identifier
  styleId: string;
  styleName: string;
  orderId?: string;
  color?: string;
  size?: string;
  uom: UOM;
  totalQty: number; // original issued qty for the lot
  balances: Record<ProcessType, number>; // balance at each process
  currentProcess: ProcessType;
  processLocation?: string;
  status: 'active' | 'on_hold' | 'released' | 'scrapped' | 'closed';
  holdReason?: string;
  holdDate?: Date;
  createdAt: Date;
  updatedAt?: Date;
  entryDate?: Date;
  expectedCompletionDate?: Date;
}

// WIP transaction ledger (audit log)
export type WIPTransactionAction =
  | 'issue'
  | 'receive'
  | 'reject'
  | 'rework'
  | 'transfer'
  | 'hold'
  | 'release'
  | 'finish'
  | 'scrap';

export interface WIPLedgerEntry {
  id: string;
  date: Date;
  wipLot: string; // lotNumber
  action: WIPTransactionAction;
  fromProcess?: ProcessType;
  toProcess?: ProcessType;
  quantityIn?: number;
  quantityOut?: number;
  balanceAfter: number;
  userId?: string;
  userName?: string;
  reason?: string;
  reference?: string; // e.g., issue number, transfer number
  remarks?: string;
}

export interface WIPConsumption {
  id: string;
  wipLot: string;
  materialId: string;
  materialCode?: string;
  plannedQty: number;
  consumedQty: number;
  uom: UOM;
  varianceQty: number;
  variancePercentage: number;
}

export interface WIPRework {
  id: string;
  wipLot: string;
  fromProcess: ProcessType;
  toProcess: ProcessType;
  qty: number;
  status: 'sent_for_rework' | 'reworked' | 'scrapped';
  createdAt: Date;
  completedAt?: Date;
  remarks?: string;
}

export interface WIPTransfer {
  id: string;
  transferNumber: string;
  transferDate: Date;
  fromLine?: string;
  toLine?: string;
  fromVendor?: string;
  toVendor?: string;
  wipLot: string;
  qty: number;
  reason?: string;
  createdBy?: string;
  status: 'draft' | 'in_transit' | 'received' | 'cancelled';
}

export interface WIPCost {
  wipLot: string;
  materialCost: number;
  processCost: number;
  reworkCost?: number;
  totalCost: number;
}
export type PurchaseOrderItem = POItem;
export type PurchaseRequisitionItem = PRItem;

export interface StockAging {
  category: string;
  days0to30: number;
  days30to60: number;
  days60plus: number;
}

// ============================================================================
// VARIANCE MANAGEMENT TYPES (Critical 10% Enhancement)
// ============================================================================

export type VarianceReasonType = 
  | 'short_supply'
  | 'excess_supply'
  | 'gsm_difference'
  | 'width_difference'
  | 'transit_damage'
  | 'shade_variation'
  | 'quality_issue'
  | 'wrong_item';

export type ProcessLossType =
  | 'cutting_loss'
  | 'fabric_wastage'
  | 'stitching_rejection'
  | 'measurement_error'
  | 'washing_shrinkage'
  | 'color_bleeding'
  | 'finishing_damage'
  | 'packing_damage'
  | 'job_work_loss'
  | 'natural_evaporation';

export type DamagedStockSource =
  | 'grn_qc_reject'
  | 'inspection_fail'
  | 'job_work_damage'
  | 'wip_cutting_reject'
  | 'wip_stitching_reject'
  | 'wip_washing_reject'
  | 'wip_finishing_reject'
  | 'packing_reject'
  | 'transit_damage'
  | 'customer_return';

export type ReturnType = 'internal' | 'vendor' | 'job_work' | 'sample';

export type CycleCountStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'variance_found'
  | 'adjustment_pending'
  | 'adjustment_approved'
  | 'cancelled';

export type VarianceCategory =
  | 'within_tolerance'
  | 'minor_variance'
  | 'major_variance'
  | 'critical_variance';

// ============================================================================
// ENHANCED GRN WITH VARIANCE TRACKING
// ============================================================================

export interface GRNVariance {
  expectedQty: number;
  actualQty: number;
  varianceQty: number;
  variancePercentage: number;
  varianceReason?: VarianceReasonType;
  requiresAction?: 'debit_note' | 'approval' | 'qc_check' | 'insurance_claim' | 'reject' | 'return';
  actionTaken?: string;
  actionDate?: Date;
}

export interface FabricRollWithVariance extends FabricRoll {
  // Expected values from PO
  expectedGSM?: number;
  expectedWidth?: number;
  expectedLength?: number;
  expectedWeight?: number;
  
  // Variance tracking
  gsmVariancePercent?: number;
  widthVariancePercent?: number;
  lengthVariancePercent?: number;
  weightVariancePercent?: number;
  
  // Variance classification
  hasVariance: boolean;
  varianceCategory?: VarianceCategory;
  varianceReason?: VarianceReasonType;
  varianceRemarks?: string;
}

// ============================================================================
// JOB WORK WITH LOSS TRACKING
// ============================================================================

export interface JobWorkReturnItemWithLoss extends JobWorkReturnItem {
  processLossQty: number;
  processLossPercentage: number;
  acceptableLossPercentage: number;
  excessLoss: boolean;
  lossReason?: ProcessLossType;
  damageRecoverable: boolean;
  lossValue?: number;
  lossRemarks?: string;
}

export interface JobWorkInwardWithLoss extends JobWorkInward {
  totalSentQty: number;
  totalReceivedQty: number;
  totalProcessLoss: number;
  totalProcessLossPercentage: number;
  hasExcessLoss: boolean;
  lossApprovalRequired: boolean;
  lossApprovedBy?: string;
  lossApprovalDate?: Date;
}

// ============================================================================
// WIP WITH STAGE-WISE VARIANCE
// ============================================================================

export interface WIPVariance {
  inputQty: number;
  outputQty: number;
  processLossQty: number;
  processLossPercentage: number;
  lossReason?: ProcessLossType;
  daysInProcess: number;
  lossValue?: number;
}

export interface WIPInventoryWithVariance extends WIPInventory {
  inputQty: number;
  outputQty: number;
  processLoss: WIPVariance;
  expectedOutputQty: number;
  varianceQty: number;
  wipAgingAlert: boolean;
}

// ============================================================================
// DAMAGED / REJECTED STOCK ENHANCED
// ============================================================================

export interface DamagedStockFinancialControl {
  financeImpactFlag: boolean;
  recoveryMode?: 'scrap_sale' | 'vendor_debit' | 'rework_wip' | 'insurance_claim';
  lossValue?: number;
  recoveredValue?: number;
  netLoss?: number;
  financeReferenceNumber?: string;
  debitNoteNumber?: string;
  scrapInvoiceNumber?: string;
  insuranceClaimNumber?: string;
}

export interface DamagedStock {
  id: string;
  itemId: string;
  itemType: 'fabric' | 'trim' | 'wip' | 'finished_goods';
  itemName: string;
  lotNumber?: string;
  shade?: string;
  rollNumber?: string;
  quantity: number;
  uom: UOM;
  
  // Source tracking
  sourceProcess: DamagedStockSource;
  sourceDocumentId?: string;
  sourceDocumentNumber?: string;
  damageDate: Date;
  
  // Damage details
  reasonCode: string;
  damageDescription: string;
  recoverable: boolean;
  recoveryAction?: 'rework' | 'downgrade' | 'scrap' | 'return_vendor';
  recoveryValue?: number;
  
  // Location & Status
  warehouseId: string;
  location?: string;
  status: 'quarantine' | 'under_review' | 'approved_disposal' | 'disposed' | 'recovered';
  
  // Financial
  originalValue: number;
  recoveredValue?: number;
  lossValue?: number;
  
  // Audit
  reportedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  disposalDate?: Date;
  remarks?: string;
}

// ============================================================================
// RETURNS MANAGEMENT ENHANCED
// ============================================================================

export interface ReturnEntry {
  id: string;
  returnNumber: string;
  returnDate: Date;
  returnType: ReturnType;
  
  // Source details
  sourceDocumentId?: string;
  sourceDocumentNumber?: string;
  sourceProcess?: ProcessType;
  
  // Vendor details (for vendor returns)
  vendorId?: string;
  vendorName?: string;
  
  // Items
  items: ReturnItemEnhanced[];
  
  // Status
  status: OrderStatus;
  returnedBy: string;
  approvedBy?: string;
  approvalDate?: Date;
  
  // Reason
  returnReason: string;
  returnRemarks?: string;
  
  // Financial impact
  totalValue?: number;
  creditNoteNumber?: string;
  creditNoteDate?: Date;
}

export interface ReturnItemEnhanced extends ReturnItem {
  lotNumber?: string;
  shade?: string;
  rollNumber?: string;
  rate?: number;
  value?: number;
  inspectionRequired: boolean;
  inspectionStatus?: InspectionStatus;
  disposalAction: 'restock' | 'scrap' | 'send_vendor';
}

// ============================================================================
// PROCESS TRANSFER ENHANCED
// ============================================================================

export interface ProcessTransfer {
  id: string;
  transferNumber: string;
  transferDate: Date;
  
  // Process details
  fromProcess: ProcessType;
  toProcess: ProcessType;
  fromLocation: string;
  toLocation: string;
  
  // Style & Order
  styleId?: string;
  styleName?: string;
  orderId?: string;
  
  // Items/Quantities
  items: ProcessTransferItem[];
  
  // Status
  status: 'draft' | 'in_transit' | 'received' | 'partial' | 'completed';
  sentBy: string;
  receivedBy?: string;
  receiveDate?: Date;
  
  remarks?: string;
}

export interface ProcessTransferItem {
  id: string;
  itemId?: string;
  itemName: string;
  color?: string;
  size?: string;
  sentQty: number;
  receivedQty?: number;
  shortageQty?: number;
  uom: UOM;
  remarks?: string;
}

// ============================================================================
// FINISHED GOODS PACKING WITH VARIANCE
// ============================================================================

export interface PackingEntryWithVariance extends PackingEntry {
  // Planned vs Actual
  plannedQty: number;
  packedQty: number;
  shortQty: number;
  excessQty: number;
  variancePercentage: number;
  
  // Variance tracking
  hasVariance: boolean;
  varianceReason?: string;
  varianceRemarks?: string;
  
  // Link back to WIP
  linkedWIPId?: string;
  shortageSource?: 'wip' | 'packing' | 'quality';
}

// ============================================================================
// PHYSICAL INVENTORY / CYCLE COUNT ENHANCED
// ============================================================================

export interface CycleCountEnhanced extends CycleCount {
  countStatus: CycleCountStatus;
  hasVariance: boolean;
  totalVarianceValue: number;
  approvalRequired: boolean;
  approvedBy?: string;
  approvalDate?: Date;
  approvalRemarks?: string;
  adjustmentPosted: boolean;
  adjustmentDate?: Date;
}

export interface CycleCountItemEnhanced extends CycleCountItem {
  // Book stock
  bookStock: number;
  
  // Physical count
  physicalCount: number;
  
  // Variance analysis
  varianceQty: number;
  variancePercentage: number;
  varianceCategory: VarianceCategory;
  varianceValue: number;
  
  // Reason & Action
  varianceReason?: string;
  proposedAction: 'adjust' | 'recount' | 'investigate';
  investigationRemarks?: string;
  
  // Approval
  requiresApproval: boolean;
  approved?: boolean;
  approvedBy?: string;
}

// ============================================================================
// DEAD STOCK & SEASON TRACKING
// ============================================================================

export interface RawMaterialStockEnhanced extends RawMaterialStock {
  // Season tracking
  season?: string;
  seasonActive: boolean;
  
  // Movement tracking
  lastMovementDate: Date;
  daysSinceLastMovement: number;
  
  // Dead stock indicators
  isDead: boolean;
  isAging: boolean;
  deadSince?: Date;
  
  // Blocking
  isBlocked: boolean;
  blockReason?: 'dead_stock' | 'season_end' | 'quality_hold' | 'manual';
  blockedBy?: string;
  blockedDate?: Date;
  
  // Financial impact
  stockValue: number;
  deadStockValue?: number;
}

// ============================================================================
// REPORT FILTER TYPES
// ============================================================================

export interface VarianceReportFilter {
  dateFrom: Date;
  dateTo: Date;
  varianceType?: 'grn' | 'job_work' | 'wip' | 'packing' | 'cycle_count';
  varianceCategory?: VarianceCategory;
  minVariancePercentage?: number;
  warehouseId?: string;
  supplierId?: string;
  styleId?: string;
  processType?: ProcessType;
}

export interface LossReportFilter {
  dateFrom: Date;
  dateTo: Date;
  lossType?: ProcessLossType;
  processType?: ProcessType;
  vendorId?: string;
  minLossPercentage?: number;
  excessLossOnly?: boolean;
}

export interface DeadStockReportFilter {
  minDaysSinceMovement: number;
  season?: string;
  warehouseId?: string;
  itemType?: 'fabric' | 'trim' | 'all';
  minValue?: number;
}
