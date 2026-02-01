/**
 * Onboarding System Types
 * Type definitions for Textile ERP Onboarding
 */

export type MasterStatus = 'not-started' | 'in-progress' | 'completed';

export interface MasterCard {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: MasterStatus;
  recordCount: number;
  excelTemplate: string;
  color: string;
  route?: string;
  isMandatory?: boolean;
  dependencies?: string[]; // IDs of masters that must be completed first
}

export interface ExcelUploadStep {
  step: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  title: string;
  status: 'wait' | 'process' | 'finish' | 'error';
}

export type ConflictResolutionAction = 'map-existing' | 'create-new' | 'skip';

export interface ConflictItem {
  rowIndex: number;
  excelValue: string;
  field: string;
  existingOptions: Array<{ id: string; label: string }>;
  suggestedMatch?: string;
  resolution?: ConflictResolutionAction;
  selectedExistingId?: string;
}

export interface ColumnMapping {
  excelColumn: string;
  systemField: string;
  isRequired: boolean;
  autoMapped: boolean;
  synonyms?: string[];
}

export interface ValidationIssue {
  row: number;
  column: string;
  value: any;
  issue: string;
  severity: 'error' | 'warning';
}

// Fabric Master
export interface FabricMaster {
  fabricCode?: string;
  type: string;
  construction: string;
  composition: string;
  gsm: number;
  widthM: number;
  shrinkagePercent?: number;
  defaultUOM: string;
  shadeGroup?: string;
  status: 'Active' | 'Inactive';
}

// Trim & Accessories Master
export interface TrimAccessoriesMaster {
  itemCode?: string;
  itemName: string;
  category: string;
  subCategory?: string;
  supplier?: string;
  defaultUOM: string;
  minStock?: number;
  reorderLevel?: number;
  status: 'Active' | 'Inactive';
}

// Shade Master
export interface ShadeMaster {
  shadeCode?: string;
  shadeName: string;
  shadeGroup?: string;
  status: 'Active' | 'Inactive';
  createdDate?: string;
}

// UOM Master
export interface UOMMaster {
  uomCode?: string;
  uomName: string;
  conversionBase?: string;
  status: 'Active' | 'Inactive';
  createdDate?: string;
}

// Warehouse Zone Master
export interface WarehouseZoneMaster {
  zoneCode?: string;
  zoneName: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

// Supplier Master
export interface SupplierMaster {
  supplierCode?: string;
  supplierName: string;
  type: string[];
  contactPerson?: string;
  phone?: string;
  email?: string;
  gstNumber?: string;
  paymentTerms?: string;
  leadTimeDays?: number;
  status: 'Active' | 'Inactive';
}

// Process / Operation Master
export interface ProcessOperationMaster {
  processCode?: string;
  processName: string;
  isJobWork: boolean;
  expectedLossPercent?: number;
  status: 'Active' | 'Inactive';
}

// Material Category Master
export interface MaterialCategoryMaster {
  categoryCode?: string;
  categoryName: string;
  description?: string;
  status: 'Active' | 'Inactive';
}

// BOM / Design Card Master
export interface BOMMaster {
  bomCode?: string;
  style: string;
  buyer?: string;
  season?: string;
  version: string;
  status: 'Draft' | 'Approved' | 'Archived';
  createdDate?: string;
}

export interface OnboardingProgress {
  totalMasters: number;
  completedMasters: number;
  inProgressMasters: number;
  totalRecords: number;
  mandatoryCompleted: number;
  mandatoryTotal: number;
  canGoLive: boolean;
}

// Audit Log
export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: 'import' | 'upload' | 'publish' | 'update' | 'delete';
  masterType: string;
  recordCount: number;
  status: 'success' | 'failed' | 'partial';
  successCount?: number;
  errorCount?: number;
  errorMessage?: string;
  fileName?: string;
}

// Opening Stock
export interface OpeningStock {
  materialCode: string;
  materialName: string;
  lotNumber?: string;
  shadeCode?: string;
  warehouseCode: string;
  zoneCode?: string;
  binCode?: string;
  quantity: number;
  uom: string;
  rate?: number;
  value?: number;
  expiryDate?: string;
  remarks?: string;
}
