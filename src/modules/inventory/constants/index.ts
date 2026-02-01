/**
 * Inventory Module - Constants
 * Textile & Garment ERP System
 */

// ============================================================================
// STATUS OPTIONS
// ============================================================================

export const STATUS_OPTIONS = [
  { label: 'Active', value: 'active', color: 'success' },
  { label: 'Inactive', value: 'inactive', color: 'default' },
];

export const ORDER_STATUS_OPTIONS = [
  { label: 'Draft', value: 'draft', color: 'default' },
  { label: 'Pending', value: 'pending', color: 'warning' },
  { label: 'Approved', value: 'approved', color: 'processing' },
  { label: 'In Progress', value: 'in_progress', color: 'processing' },
  { label: 'Completed', value: 'completed', color: 'success' },
  { label: 'Cancelled', value: 'cancelled', color: 'error' },
  { label: 'Partial', value: 'partial', color: 'warning' },
];

export const INSPECTION_STATUS_OPTIONS = [
  { label: 'Pass', value: 'pass', color: 'success' },
  { label: 'Hold', value: 'hold', color: 'warning' },
  { label: 'Reject', value: 'reject', color: 'error' },
  { label: 'Pending', value: 'pending', color: 'default' },
];

export const STOCK_STATUS_OPTIONS = [
  { label: 'Available', value: 'available', color: 'success' },
  { label: 'Reserved', value: 'reserved', color: 'processing' },
  { label: 'Damaged', value: 'damaged', color: 'error' },
  { label: 'Rejected', value: 'rejected', color: 'error' },
  { label: 'In Transit', value: 'in_transit', color: 'warning' },
];

// ============================================================================
// FABRIC OPTIONS
// ============================================================================

export const FABRIC_TYPE_OPTIONS = [
  { label: 'Knitted', value: 'knitted' },
  { label: 'Woven', value: 'woven' },
];

export const CONSTRUCTION_OPTIONS = [
  'Single Jersey',
  'Pique',
  'Rib',
  'Interlock',
  'Fleece',
  'Plain Weave',
  'Twill',
  'Satin',
  'Canvas',
  'Denim',
];

export const COMPOSITION_OPTIONS = [
  '100% Cotton',
  '100% Polyester',
  '65% Polyester 35% Cotton',
  '80% Cotton 20% Polyester',
  '95% Cotton 5% Spandex',
  '100% Viscose',
  'Cotton Blend',
  'Poly-Cotton',
];

// ============================================================================
// UOM OPTIONS
// ============================================================================

export const UOM_OPTIONS = [
  { label: 'Kilogram (Kg)', value: 'kg' },
  { label: 'Meter (M)', value: 'meter' },
  { label: 'Piece (Pcs)', value: 'piece' },
  { label: 'Yard (Yd)', value: 'yard' },
  { label: 'Roll', value: 'roll' },
];

// ============================================================================
// PROCESS OPTIONS
// ============================================================================

export const PROCESS_TYPE_OPTIONS = [
  { label: 'Cutting', value: 'cutting', icon: '✂️' },
  { label: 'Stitching', value: 'stitching', icon: '🧵' },
  { label: 'Washing', value: 'washing', icon: '💧' },
  { label: 'Finishing', value: 'finishing', icon: '✨' },
  { label: 'Printing', value: 'printing', icon: '🖨️' },
  { label: 'Embroidery', value: 'embroidery', icon: '🎨' },
];

// ============================================================================
// WAREHOUSE OPTIONS
// ============================================================================

export const WAREHOUSE_TYPE_OPTIONS = [
  { label: 'Raw Material', value: 'raw_material' },
  { label: 'Work in Progress (WIP)', value: 'wip' },
  { label: 'Finished Goods', value: 'finished_goods' },
  { label: 'General', value: 'general' },
];

// ============================================================================
// SUPPLIER OPTIONS
// ============================================================================

export const SUPPLIER_TYPE_OPTIONS = [
  { label: 'Fabric Supplier', value: 'fabric_supplier' },
  { label: 'Trim Supplier', value: 'trim_supplier' },
  { label: 'Job Worker', value: 'job_worker' },
  { label: 'Processing House', value: 'processing_house' },
  { label: 'Packing Supplier', value: 'packing_supplier' },
];

// ============================================================================
// TRIM CATEGORY OPTIONS
// ============================================================================

export const TRIM_CATEGORY_OPTIONS = [
  'Buttons',
  'Zippers',
  'Labels',
  'Threads',
  'Elastic',
  'Interlining',
  'Patches',
  'Ribbons',
  'Hangtags',
  'Polybags',
  'Cartons',
];

// ============================================================================
// SIZE OPTIONS
// ============================================================================

export const SIZE_OPTIONS = [
  'XS',
  'S',
  'M',
  'L',
  'XL',
  'XXL',
  'XXXL',
  '28',
  '30',
  '32',
  '34',
  '36',
  '38',
  '40',
  '42',
];

// ============================================================================
// COLOR OPTIONS
// ============================================================================

export const COLOR_OPTIONS = [
  'White',
  'Black',
  'Red',
  'Blue',
  'Navy',
  'Green',
  'Yellow',
  'Orange',
  'Pink',
  'Purple',
  'Grey',
  'Brown',
  'Beige',
  'Maroon',
];

// ============================================================================
// DEFECT OPTIONS
// ============================================================================

export const DEFECT_TYPE_OPTIONS = [
  'Hole',
  'Stain',
  'Shade Variation',
  'Slub',
  'Pilling',
  'Uneven Dyeing',
  'Crease Mark',
  'Oil Spot',
  'Missing Yarn',
  'Wrong Shade',
  'GSM Variation',
  'Width Variation',
  'Foreign Fiber',
];

// ============================================================================
// PRIORITY OPTIONS
// ============================================================================

export const PRIORITY_OPTIONS = [
  { label: 'High', value: 'high', color: 'red' },
  { label: 'Medium', value: 'medium', color: 'orange' },
  { label: 'Low', value: 'low', color: 'blue' },
];

// ============================================================================
// ALERT TYPE OPTIONS
// ============================================================================

export const ALERT_TYPE_OPTIONS = [
  { label: 'Low Stock', value: 'low_stock', icon: '⚠️' },
  { label: 'Aging Stock', value: 'aging_stock', icon: '⏰' },
  { label: 'Style Shortage', value: 'style_shortage', icon: '📉' },
  { label: 'Job Work Delay', value: 'job_work_delay', icon: '⏱️' },
  { label: 'Inspection Pending', value: 'inspection_pending', icon: '🔍' },
];

// ============================================================================
// PACK TYPE OPTIONS
// ============================================================================

export const PACK_TYPE_OPTIONS = [
  'Solid Pack',
  'Assorted Pack',
  'Ratio Pack',
  'Single Piece',
  'Bulk Pack',
];

// ============================================================================
// DISPATCH STATUS OPTIONS
// ============================================================================

export const DISPATCH_STATUS_OPTIONS = [
  { label: 'Pending', value: 'pending', color: 'default' },
  { label: 'Ready', value: 'ready', color: 'processing' },
  { label: 'Dispatched', value: 'dispatched', color: 'success' },
];

// ============================================================================
// PAYMENT TERMS OPTIONS
// ============================================================================

export const PAYMENT_TERMS_OPTIONS = [
  'Net 30',
  'Net 45',
  'Net 60',
  '50% Advance',
  '100% Advance',
  'Against Delivery',
  'LC at Sight',
  'LC 30 Days',
];

// ============================================================================
// TABLE PAGE SIZE OPTIONS
// ============================================================================

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ============================================================================
// VARIANCE REASONS (GRN / INWARD)
// ============================================================================

export const GRN_VARIANCE_REASONS = [
  { label: 'Short Supply', value: 'short_supply', requiresAction: 'debit_note' },
  { label: 'Excess Supply', value: 'excess_supply', requiresAction: 'approval' },
  { label: 'GSM Difference', value: 'gsm_difference', requiresAction: 'qc_check' },
  { label: 'Width Difference', value: 'width_difference', requiresAction: 'qc_check' },
  { label: 'Transit Damage', value: 'transit_damage', requiresAction: 'insurance_claim' },
  { label: 'Shade Variation', value: 'shade_variation', requiresAction: 'reject' },
  { label: 'Quality Issue', value: 'quality_issue', requiresAction: 'reject' },
  { label: 'Wrong Item', value: 'wrong_item', requiresAction: 'return' },
];

// ============================================================================
// PROCESS LOSS TYPES
// ============================================================================

export const PROCESS_LOSS_TYPES = [
  { label: 'Cutting Loss', value: 'cutting_loss', process: 'cutting' },
  { label: 'Fabric Wastage', value: 'fabric_wastage', process: 'cutting' },
  { label: 'Stitching Rejection', value: 'stitching_rejection', process: 'stitching' },
  { label: 'Measurement Error', value: 'measurement_error', process: 'stitching' },
  { label: 'Washing Shrinkage', value: 'washing_shrinkage', process: 'washing' },
  { label: 'Color Bleeding', value: 'color_bleeding', process: 'washing' },
  { label: 'Finishing Damage', value: 'finishing_damage', process: 'finishing' },
  { label: 'Packing Damage', value: 'packing_damage', process: 'packing' },
  { label: 'Job Work Loss', value: 'job_work_loss', process: 'job_work' },
  { label: 'Natural Evaporation', value: 'natural_evaporation', process: 'all' },
];

// ============================================================================
// ACCEPTABLE PROCESS LOSS PERCENTAGES
// ============================================================================

export const ACCEPTABLE_LOSS_PERCENTAGES = {
  cutting: 3, // 3% acceptable loss in cutting
  stitching: 2, // 2% rejection acceptable
  washing: 5, // 5% shrinkage acceptable
  finishing: 1, // 1% damage acceptable
  printing: 3, // 3% print rejection
  embroidery: 2, // 2% embroidery rejection
  packing: 0.5, // 0.5% packing damage
  job_work: 2, // 2% job work loss acceptable
};

// ============================================================================
// DAMAGED / REJECTED STOCK SOURCES
// ============================================================================

export const DAMAGED_STOCK_SOURCES = [
  { label: 'GRN QC Rejection', value: 'grn_qc_reject', category: 'inward' },
  { label: 'Inspection Failure', value: 'inspection_fail', category: 'inward' },
  { label: 'Job Work Damage', value: 'job_work_damage', category: 'processing' },
  { label: 'WIP Rejection - Cutting', value: 'wip_cutting_reject', category: 'wip' },
  { label: 'WIP Rejection - Stitching', value: 'wip_stitching_reject', category: 'wip' },
  { label: 'WIP Rejection - Washing', value: 'wip_washing_reject', category: 'wip' },
  { label: 'WIP Rejection - Finishing', value: 'wip_finishing_reject', category: 'wip' },
  { label: 'Packing Rejection', value: 'packing_reject', category: 'fg' },
  { label: 'Transit Damage', value: 'transit_damage', category: 'dispatch' },
  { label: 'Customer Return', value: 'customer_return', category: 'return' },
];

// ============================================================================
// RETURN TYPES
// ============================================================================

export const RETURN_TYPE_OPTIONS = [
  { label: 'Internal Return', value: 'internal', description: 'Excess material issued to production' },
  { label: 'Vendor Return', value: 'vendor', description: 'GRN rejection back to supplier' },
  { label: 'Job Work Return', value: 'job_work', description: 'Job work rejection' },
  { label: 'Sample Return', value: 'sample', description: 'Sample fabric return' },
];

export const RETURN_REASON_OPTIONS = [
  'Excess Issue',
  'Wrong Shade',
  'Wrong Item',
  'Quality Failure',
  'Production Complete',
  'Order Cancelled',
  'Measurement Mismatch',
  'Damage in Process',
];

// ============================================================================
// DEAD STOCK INDICATORS
// ============================================================================

export const DEAD_STOCK_INDICATORS = {
  NO_MOVEMENT_DAYS: 180, // 6 months no movement = dead stock
  AGING_WARNING_DAYS: 90, // 3 months warning
  SEASON_BLOCKING: true,
  AUTO_BLOCK_DEAD_STOCK: true,
};

export const SEASON_OPTIONS = [
  { label: 'Spring/Summer 2025', value: 'SS25', active: false },
  { label: 'Fall/Winter 2025', value: 'FW25', active: true },
  { label: 'Spring/Summer 2026', value: 'SS26', active: true },
  { label: 'Fall/Winter 2026', value: 'FW26', active: false },
];

// ============================================================================
// CYCLE COUNT STATUS
// ============================================================================

export const CYCLE_COUNT_STATUS = [
  { label: 'Planned', value: 'planned', color: 'default' },
  { label: 'In Progress', value: 'in_progress', color: 'processing' },
  { label: 'Completed', value: 'completed', color: 'success' },
  { label: 'Variance Found', value: 'variance_found', color: 'warning' },
  { label: 'Adjustment Pending', value: 'adjustment_pending', color: 'warning' },
  { label: 'Adjustment Approved', value: 'adjustment_approved', color: 'success' },
  { label: 'Cancelled', value: 'cancelled', color: 'error' },
];

// ============================================================================
// VARIANCE CATEGORIES
// ============================================================================

export const VARIANCE_CATEGORIES = [
  { label: 'Within Tolerance', value: 'within_tolerance', color: 'success' },
  { label: 'Minor Variance', value: 'minor_variance', color: 'warning' },
  { label: 'Major Variance', value: 'major_variance', color: 'error' },
  { label: 'Critical Variance', value: 'critical_variance', color: 'error' },
];

export const VARIANCE_TOLERANCE = {
  MINOR_PERCENTAGE: 2, // < 2% variance = minor
  MAJOR_PERCENTAGE: 5, // 2-5% variance = major
  CRITICAL_PERCENTAGE: 5, // > 5% variance = critical
};

// ============================================================================
// THRESHOLD VALUES
// ============================================================================

export const THRESHOLD_VALUES = {
  LOW_STOCK_DAYS: 7,
  AGING_STOCK_DAYS: 60,
  DEAD_STOCK_DAYS: 180,
  GSM_TOLERANCE_PERCENTAGE: 5,
  WIDTH_TOLERANCE_PERCENTAGE: 2,
  SHRINKAGE_MAX_PERCENTAGE: 10,
};

// ============================================================================
// SHORTCUTS
// ============================================================================

export const KEYBOARD_SHORTCUTS = {
  NEW_ENTRY: 'Ctrl+N',
  SAVE: 'Ctrl+S',
  SEARCH: 'Ctrl+F',
  CANCEL: 'Esc',
  PRINT: 'Ctrl+P',
};
