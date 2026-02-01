/**
 * Inventory Module - Utility Functions
 * Helper functions for calculations, conversions, and formatting
 */

import { useEffect, useState } from 'react';
import { UOM } from '../types';

// ============================================================================
// UOM CONVERSION
// ============================================================================

/**
 * Convert between Kg and Meters for fabric
 * Formula: Weight (Kg) = Length (M) × Width (M) × GSM / 1000
 */
export const convertKgToMeters = (
  weightKg: number,
  widthMeters: number,
  gsm: number
): number => {
  if (widthMeters === 0 || gsm === 0) return 0;
  return (weightKg * 1000) / (widthMeters * gsm);
};

export const convertMetersToKg = (
  lengthMeters: number,
  widthMeters: number,
  gsm: number
): number => {
  return (lengthMeters * widthMeters * gsm) / 1000;
};

/**
 * Convert meters to yards and vice versa
 */
export const metersToYards = (meters: number): number => {
  return meters * 1.09361;
};

export const yardsToMeters = (yards: number): number => {
  return yards * 0.9144;
};

// ============================================================================
// VARIANCE CALCULATIONS
// ============================================================================

export const calculateVariance = (
  actual: number,
  expected: number
): number => {
  return actual - expected;
};

export const calculateVariancePercentage = (
  actual: number,
  expected: number
): number => {
  if (expected === 0) return 0;
  return ((actual - expected) / expected) * 100;
};

export const isWithinTolerance = (
  actual: number,
  expected: number,
  tolerancePercentage: number
): boolean => {
  const variance = Math.abs(calculateVariancePercentage(actual, expected));
  return variance <= tolerancePercentage;
};

// ============================================================================
// STOCK CALCULATIONS
// ============================================================================

export const calculateAvailableStock = (
  totalStock: number,
  reservedStock: number,
  damagedStock: number = 0
): number => {
  return Math.max(0, totalStock - reservedStock - damagedStock);
};

export const calculateStockValue = (
  quantity: number,
  rate: number
): number => {
  return quantity * rate;
};

export const calculateStockTurnoverRatio = (
  costOfGoodsSold: number,
  averageInventoryValue: number
): number => {
  if (averageInventoryValue === 0) return 0;
  return costOfGoodsSold / averageInventoryValue;
};

// ============================================================================
// AGING CALCULATIONS
// ============================================================================

export type FromDateInput = Date | string | number | undefined | null;

export const calculateAgingDays = (fromDate: FromDateInput): number => {
  if (!fromDate) return 0;

  let d: Date;
  if (fromDate instanceof Date) {
    d = fromDate;
  } else if (typeof fromDate === 'number') {
    d = new Date(fromDate);
  } else if (typeof fromDate === 'string') {
    const parsed = Date.parse(fromDate);
    if (isNaN(parsed)) return 0;
    d = new Date(parsed);
  } else {
    return 0;
  }

  if (isNaN(d.getTime())) return 0;

  const now = new Date();
  const diff = now.getTime() - d.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

export const getAgingCategory = (
  days: number
): '0-30' | '30-60' | '60-90' | '90+' => {
  if (days <= 30) return '0-30';
  if (days <= 60) return '30-60';
  if (days <= 90) return '60-90';
  return '90+';
};


// ============================================================================
// BARCODE GENERATION
// ============================================================================

export const generateRollBarcode = (
  fabricCode: string,
  lotNumber: string,
  rollNumber: string
): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${fabricCode}-${lotNumber}-${rollNumber}-${timestamp}`;
};

export const generateCartonBarcode = (
  styleCode: string,
  color: string,
  cartonNumber: string
): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  return `${styleCode}-${color}-${cartonNumber}-${timestamp}`;
};

// ============================================================================
// VALIDATION
// ============================================================================

export const validateGSM = (
  actual: number,
  expected: number,
  tolerance: number = 5
): { isValid: boolean; variance: number; message?: string } => {
  const variance = calculateVariancePercentage(actual, expected);
  const isValid = Math.abs(variance) <= tolerance;

  return {
    isValid,
    variance,
    message: isValid
      ? undefined
      : `GSM variance ${variance.toFixed(2)}% exceeds tolerance of ${tolerance}%`,
  };
};

export const validateWidth = (
  actual: number,
  expected: number,
  tolerance: number = 2
): { isValid: boolean; variance: number; message?: string } => {
  const variance = calculateVariancePercentage(actual, expected);
  const isValid = Math.abs(variance) <= tolerance;

  return {
    isValid,
    variance,
    message: isValid
      ? undefined
      : `Width variance ${variance.toFixed(2)}% exceeds tolerance of ${tolerance}%`,
  };
};

export const validateQuantity = (
  quantity: number,
  minQty: number = 0,
  maxQty?: number
): { isValid: boolean; message?: string } => {
  if (quantity < minQty) {
    return {
      isValid: false,
      message: `Quantity must be at least ${minQty}`,
    };
  }

  if (maxQty !== undefined && quantity > maxQty) {
    return {
      isValid: false,
      message: `Quantity cannot exceed ${maxQty}`,
    };
  }

  return { isValid: true };
};

// ============================================================================
// FORMATTING
// ============================================================================

export const formatUOM = (value: number, uom: UOM): string => {
  const uomLabels: Record<UOM, string> = {
    kg: 'Kg',
    meter: 'M',
    piece: 'Pcs',
    yard: 'Yd',
    roll: 'Rolls',
  };

  return `${value.toFixed(2)} ${uomLabels[uom] || uom}`;
};

export const formatPercentage = (value: number, decimals: number = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

export const formatVariance = (variance: number): string => {
  const sign = variance > 0 ? '+' : '';
  return `${sign}${variance.toFixed(2)}`;
};

// ============================================================================
// SORTING
// ============================================================================

export const sortByDate = <T extends { date?: Date; createdAt?: Date }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    const dateA = a.date || a.createdAt || new Date(0);
    const dateB = b.date || b.createdAt || new Date(0);

    if (order === 'asc') {
      return dateA.getTime() - dateB.getTime();
    }
    return dateB.getTime() - dateA.getTime();
  });
};

export const sortByAgingDays = <T extends { agingDays: number }>(
  items: T[],
  order: 'asc' | 'desc' = 'desc'
): T[] => {
  return [...items].sort((a, b) => {
    if (order === 'asc') {
      return a.agingDays - b.agingDays;
    }
    return b.agingDays - a.agingDays;
  });
};

// ============================================================================
// FILTERING
// ============================================================================

export const filterLowStock = <
  T extends { availableQty: number; minStock?: number; reorderLevel?: number }
>(
  items: T[]
): T[] => {
  return items.filter((item) => {
    const threshold = item.minStock || item.reorderLevel || 0;
    return item.availableQty <= threshold;
  });
};

export const filterByAgingDays = <T extends { agingDays: number }>(
  items: T[],
  minDays: number,
  maxDays?: number
): T[] => {
  return items.filter((item) => {
    if (maxDays !== undefined) {
      return item.agingDays >= minDays && item.agingDays <= maxDays;
    }
    return item.agingDays >= minDays;
  });
};

// ============================================================================
// AGGREGATION
// ============================================================================

export const sumQuantities = <T extends { quantity?: number; qty?: number }>(
  items: T[]
): number => {
  return items.reduce((sum, item) => sum + (item.quantity || item.qty || 0), 0);
};

export const sumValues = <T extends { amount?: number; value?: number }>(
  items: T[]
): number => {
  return items.reduce((sum, item) => sum + (item.amount || item.value || 0), 0);
};

export const groupBy = <T extends Record<string, any>>(
  items: T[],
  key: keyof T
): Record<string, T[]> => {
  return items.reduce((groups, item) => {
    const groupKey = String(item[key]);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

// ============================================================================
// AUTO-NUMBER GENERATION
// ============================================================================

export const generateDocumentNumber = (
  prefix: string,
  lastNumber: number,
  length: number = 6
): string => {
  const nextNumber = lastNumber + 1;
  const paddedNumber = String(nextNumber).padStart(length, '0');
  return `${prefix}${paddedNumber}`;
};

export const generateGRNNumber = (lastNumber: number): string => {
  return generateDocumentNumber('GRN', lastNumber, 6);
};

export const generatePONumber = (lastNumber: number): string => {
  return generateDocumentNumber('PO', lastNumber, 6);
};

export const generateIssueNumber = (lastNumber: number): string => {
  return generateDocumentNumber('ISS', lastNumber, 6);
};

export const generateChallanNumber = (lastNumber: number): string => {
  return generateDocumentNumber('CHL', lastNumber, 6);
};

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceType = (): DeviceType => {
  const getDeviceType = (): DeviceType => {
    if (typeof window === 'undefined') return 'desktop';
    const width = window.innerWidth;
    if (width <= 768) return 'mobile';
    if (width <= 1024) return 'tablet';
    return 'desktop';
  };

  const [deviceType, setDeviceType] = useState<DeviceType>(getDeviceType);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setDeviceType(getDeviceType());
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return deviceType;
};

// ============================================================================
// VARIANCE ANALYSIS (Critical 10% Enhancement)
// ============================================================================

/**
 * Calculate variance with sign (+ for excess, - for shortage)
 */
export const calculateSignedVariance = (
  actual: number,
  expected: number
): number => {
  return actual - expected;
};

/**
 * Calculate absolute variance
 */
export const calculateAbsoluteVariance = (
  actual: number,
  expected: number
): number => {
  return Math.abs(actual - expected);
};

/**
 * Determine variance category based on percentage
 */
export const getVarianceCategory = (
  variancePercentage: number
): 'within_tolerance' | 'minor_variance' | 'major_variance' | 'critical_variance' => {
  const absVariance = Math.abs(variancePercentage);
  
  if (absVariance <= 2) return 'within_tolerance';
  if (absVariance <= 5) return 'minor_variance';
  if (absVariance <= 10) return 'major_variance';
  return 'critical_variance';
};

/**
 * Check if variance is within acceptable tolerance
 */
export const isVarianceAcceptable = (
  variancePercentage: number,
  tolerance: number = 2
): boolean => {
  return Math.abs(variancePercentage) <= tolerance;
};

/**
 * Determine if GRN variance requires debit note
 */
export const requiresDebitNote = (
  varianceQty: number,
  varianceReason?: string
): boolean => {
  if (varianceQty >= 0) return false; // Excess doesn't need debit note
  
  const debitNoteReasons = ['short_supply', 'quality_issue', 'transit_damage'];
  return debitNoteReasons.includes(varianceReason || '');
};

/**
 * Determine if GRN excess requires approval
 */
export const requiresApproval = (
  varianceQty: number,
  variancePercentage: number
): boolean => {
  return varianceQty > 0 && Math.abs(variancePercentage) > 2;
};

// ============================================================================
// PROCESS LOSS CALCULATIONS
// ============================================================================

/**
 * Calculate process loss percentage
 */
export const calculateProcessLoss = (
  sentQty: number,
  receivedQty: number
): { lossQty: number; lossPercentage: number } => {
  const lossQty = sentQty - receivedQty;
  const lossPercentage = sentQty > 0 ? (lossQty / sentQty) * 100 : 0;
  
  return { lossQty, lossPercentage };
};

/**
 * Check if process loss exceeds acceptable limit
 */
export const hasExcessLoss = (
  actualLossPercentage: number,
  acceptableLossPercentage: number
): boolean => {
  return actualLossPercentage > acceptableLossPercentage;
};

/**
 * Get acceptable loss percentage for a process
 */
export const getAcceptableLoss = (
  processType: string
): number => {
  const lossMap: Record<string, number> = {
    cutting: 3,
    stitching: 2,
    washing: 5,
    finishing: 1,
    printing: 3,
    embroidery: 2,
    packing: 0.5,
    job_work: 2,
  };
  
  return lossMap[processType] || 2; // Default 2%
};

/**
 * Calculate loss value in currency
 */
export const calculateLossValue = (
  lossQty: number,
  rate: number
): number => {
  return lossQty * rate;
};

/**
 * Calculate WIP process efficiency
 */
export const calculateProcessEfficiency = (
  inputQty: number,
  outputQty: number
): number => {
  if (inputQty === 0) return 0;
  return (outputQty / inputQty) * 100;
};

// ============================================================================
// DEAD STOCK DETECTION
// ============================================================================

/**
 * Calculate days since last movement
 */
export const calculateDaysSinceMovement = (
  lastMovementDate: Date
): number => {
  const today = new Date();
  const diffTime = Math.abs(today.getTime() - lastMovementDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Check if stock is dead (no movement for X days)
 */
export const isDeadStock = (
  lastMovementDate: Date,
  threshold: number = 180
): boolean => {
  const daysSinceMovement = calculateDaysSinceMovement(lastMovementDate);
  return daysSinceMovement >= threshold;
};

/**
 * Check if stock is aging (warning threshold)
 */
export const isAgingStock = (
  lastMovementDate: Date,
  warningThreshold: number = 90,
  deadThreshold: number = 180
): boolean => {
  const daysSinceMovement = calculateDaysSinceMovement(lastMovementDate);
  return daysSinceMovement >= warningThreshold && daysSinceMovement < deadThreshold;
};

/**
 * Get stock aging category
 */
export const getStockAgingCategory = (
  daysSinceMovement: number
): '0-30' | '31-60' | '61-90' | '91-180' | '180+' => {
  if (daysSinceMovement <= 30) return '0-30';
  if (daysSinceMovement <= 60) return '31-60';
  if (daysSinceMovement <= 90) return '61-90';
  if (daysSinceMovement <= 180) return '91-180';
  return '180+';
};

/**
 * Check if season is active
 */
export const isSeasonActive = (
  season: string,
  activeSeason: string[]
): boolean => {
  return activeSeason.includes(season);
};

// ============================================================================
// STOCK VALUATION WITH DEAD STOCK
// ============================================================================

/**
 * Calculate stock value considering dead stock markdown
 */
export const calculateStockValueWithMarkdown = (
  quantity: number,
  rate: number,
  isDead: boolean,
  markdownPercentage: number = 50
): { fullValue: number; realizedValue: number; markdown: number } => {
  const fullValue = quantity * rate;
  const markdown = isDead ? fullValue * (markdownPercentage / 100) : 0;
  const realizedValue = fullValue - markdown;
  
  return { fullValue, realizedValue, markdown };
};

// ============================================================================
// TOLERANCE CHECKS (GSM, WIDTH, etc.)
// ============================================================================

/**
 * Check if GSM is within tolerance
 */
export const isGSMWithinTolerance = (
  actualGSM: number,
  expectedGSM: number,
  tolerancePercent: number = 5
): boolean => {
  return isWithinTolerance(actualGSM, expectedGSM, tolerancePercent);
};

/**
 * Check if width is within tolerance
 */
export const isWidthWithinTolerance = (
  actualWidth: number,
  expectedWidth: number,
  tolerancePercent: number = 2
): boolean => {
  return isWithinTolerance(actualWidth, expectedWidth, tolerancePercent);
};

/**
 * Calculate GSM variance percentage
 */
export const calculateGSMVariance = (
  actualGSM: number,
  expectedGSM: number
): { variance: number; percentage: number; withinTolerance: boolean } => {
  const variance = actualGSM - expectedGSM;
  const percentage = calculateVariancePercentage(actualGSM, expectedGSM);
  const withinTolerance = isGSMWithinTolerance(actualGSM, expectedGSM);
  
  return { variance, percentage, withinTolerance };
};

/**
 * Calculate width variance percentage
 */
export const calculateWidthVariance = (
  actualWidth: number,
  expectedWidth: number
): { variance: number; percentage: number; withinTolerance: boolean } => {
  const variance = actualWidth - expectedWidth;
  const percentage = calculateVariancePercentage(actualWidth, expectedWidth);
  const withinTolerance = isWidthWithinTolerance(actualWidth, expectedWidth);
  
  return { variance, percentage, withinTolerance };
};

// ============================================================================
// CYCLE COUNT VARIANCE ANALYSIS
// ============================================================================

/**
 * Analyze cycle count variance and determine action
 */
export const analyzeCycleCountVariance = (
  bookStock: number,
  physicalStock: number,
  itemValue: number
): {
  varianceQty: number;
  variancePercentage: number;
  varianceValue: number;
  category: string;
  requiresApproval: boolean;
  suggestedAction: 'adjust' | 'recount' | 'investigate';
} => {
  const varianceQty = physicalStock - bookStock;
  const variancePercentage = calculateVariancePercentage(physicalStock, bookStock);
  const varianceValue = varianceQty * itemValue;
  const category = getVarianceCategory(variancePercentage);
  
  // Determine approval requirement
  const requiresApproval = 
    Math.abs(variancePercentage) > 5 || 
    Math.abs(varianceValue) > 10000;
  
  // Suggest action based on variance
  let suggestedAction: 'adjust' | 'recount' | 'investigate';
  
  if (Math.abs(variancePercentage) <= 2) {
    suggestedAction = 'adjust'; // Minor variance, adjust directly
  } else if (Math.abs(variancePercentage) <= 5) {
    suggestedAction = 'recount'; // Recount to verify
  } else {
    suggestedAction = 'investigate'; // Major variance, needs investigation
  }
  
  return {
    varianceQty,
    variancePercentage,
    varianceValue,
    category,
    requiresApproval,
    suggestedAction,
  };
};

// ============================================================================
// PACKING VARIANCE ANALYSIS
// ============================================================================

/**
 * Analyze FG packing variance
 */
export const analyzePackingVariance = (
  plannedQty: number,
  packedQty: number
): {
  shortQty: number;
  excessQty: number;
  variancePercentage: number;
  hasVariance: boolean;
  varianceType: 'short' | 'excess' | 'none';
} => {
  const variance = packedQty - plannedQty;
  const variancePercentage = calculateVariancePercentage(packedQty, plannedQty);
  
  return {
    shortQty: variance < 0 ? Math.abs(variance) : 0,
    excessQty: variance > 0 ? variance : 0,
    variancePercentage,
    hasVariance: variance !== 0,
    varianceType: variance < 0 ? 'short' : variance > 0 ? 'excess' : 'none',
  };
};

// ============================================================================
// REPORT UTILITIES
// ============================================================================

/**
 * Filter items by date range
 */
export const filterByDateRange = <T extends { date?: Date; createdAt?: Date }>(
  items: T[],
  dateFrom: Date,
  dateTo: Date
): T[] => {
  return items.filter((item) => {
    const itemDate = item.date || item.createdAt;
    if (!itemDate) return false;
    
    const date = new Date(itemDate);
    return date >= dateFrom && date <= dateTo;
  });
};

/**
 * Calculate summary statistics for variance report
 */
export const calculateVarianceSummary = (
  items: Array<{ varianceQty: number; variancePercentage: number; varianceValue?: number }>
): {
  totalItems: number;
  totalVarianceQty: number;
  avgVariancePercentage: number;
  totalVarianceValue: number;
  itemsWithVariance: number;
} => {
  const totalItems = items.length;
  const totalVarianceQty = items.reduce((sum, item) => sum + item.varianceQty, 0);
  const avgVariancePercentage = 
    items.reduce((sum, item) => sum + item.variancePercentage, 0) / totalItems || 0;
  const totalVarianceValue = 
    items.reduce((sum, item) => sum + (item.varianceValue || 0), 0);
  const itemsWithVariance = items.filter(item => item.varianceQty !== 0).length;
  
  return {
    totalItems,
    totalVarianceQty,
    avgVariancePercentage,
    totalVarianceValue,
    itemsWithVariance,
  };
};

// ============================================================================
// BARCODE UTILITIES
// ============================================================================

/**
 * Generate unique barcode ID for fabric rolls
 * Format: ROLL-{YYYYMMDD}-{COUNTER}
 */
export const generateBarcodeId = (counter: number = 1): string => {
  const now = new Date();
  const dateStr = now.toISOString().slice(0, 10).replace(/-/g, '');
  const paddedCounter = String(counter).padStart(6, '0');
  return `ROLL-${dateStr}-${paddedCounter}`;
};

/**
 * Parse barcode data string
 * Format: BARCODEID|FABRIC|LOT|SHADE|GSM|QTY|LOCATION|GRN
 */
export const parseBarcodeData = (barcodeString: string): Record<string, string> | null => {
  try {
    const parts = barcodeString.split('|');
    if (parts.length < 8) return null;

    return {
      rollBarcodeId: parts[0],
      fabricCode: parts[1],
      lotNumber: parts[2],
      shade: parts[3],
      gsmActual: parts[4],
      rollQty: parts[5],
      locationDisplay: parts[6],
      grnReference: parts[7],
    };
  } catch {
    return null;
  }
};

/**
 * Validate barcode ID format
 */
export const isValidBarcodeId = (barcodeId: string): boolean => {
  // Check format: ROLL-YYYYMMDD-NNNNNN
  const pattern = /^ROLL-\d{8}-\d{6}$/;
  return pattern.test(barcodeId);
};

/**
 * Check if barcode is already consumed
 */
export const isBarcodeConsumed = (
  barcodeId: string,
  consumedBarcodes: string[]
): boolean => {
  return consumedBarcodes.includes(barcodeId);
};

/**
 * Validate barcode lot/shade/GSM consistency
 */
export const validateBarcodeConsistency = (
  barcodes: Array<{ lotNumber: string; shade: string; gsmActual: number }>,
  allowMixedLot: boolean = false,
  allowMixedShade: boolean = false,
  allowMixedGSM: boolean = false
): { valid: boolean; message?: string } => {
  if (barcodes.length === 0) return { valid: true };

  const firstBarcode = barcodes[0];

  // Check lot consistency
  if (!allowMixedLot) {
    const differentLot = barcodes.some(b => b.lotNumber !== firstBarcode.lotNumber);
    if (differentLot) {
      return { valid: false, message: 'Mixed lots not allowed. All rolls must be from the same lot.' };
    }
  }

  // Check shade consistency
  if (!allowMixedShade) {
    const differentShade = barcodes.some(b => b.shade !== firstBarcode.shade);
    if (differentShade) {
      return { valid: false, message: 'Mixed shades not allowed. All rolls must have the same shade.' };
    }
  }

  // Check GSM consistency
  if (!allowMixedGSM) {
    const differentGSM = barcodes.some(b => b.gsmActual !== firstBarcode.gsmActual);
    if (differentGSM) {
      return { valid: false, message: 'Mixed GSM not allowed. All rolls must have the same GSM.' };
    }
  }

  return { valid: true };
};

/**
 * Format location display for barcode label
 */
export const formatBarcodeLocation = (
  warehouseId: string,
  rackId?: string,
  binId?: string
): string => {
  const parts = [warehouseId];
  if (rackId) parts.push(`Rack ${rackId}`);
  if (binId) parts.push(`Bin ${binId}`);
  return parts.join(' → ');
};

/**
 * Search barcodes by multiple criteria
 */
export const searchBarcodes = (
  barcodes: any[],
  searchTerm: string
): any[] => {
  if (!searchTerm) return barcodes;

  const term = searchTerm.toLowerCase();
  return barcodes.filter(barcode => 
    barcode.rollBarcodeId?.toLowerCase().includes(term) ||
    barcode.fabricCode?.toLowerCase().includes(term) ||
    barcode.lotNumber?.toLowerCase().includes(term) ||
    barcode.shade?.toLowerCase().includes(term) ||
    barcode.grnReference?.toLowerCase().includes(term)
  );
};

/**
 * Calculate total quantity from scanned barcodes
 */
export const calculateBarcodeTotal = (
  barcodes: Array<{ rollQty: number; rollQtyUnit: string }>
): { totalKg: number; totalMeters: number; totalRolls: number } => {
  const totalKg = barcodes
    .filter(b => b.rollQtyUnit === 'kg')
    .reduce((sum, b) => sum + b.rollQty, 0);
  
  const totalMeters = barcodes
    .filter(b => b.rollQtyUnit === 'meter')
    .reduce((sum, b) => sum + b.rollQty, 0);
  
  return {
    totalKg,
    totalMeters,
    totalRolls: barcodes.length,
  };
};

/**
 * Group barcodes by fabric/lot/shade
 */
export const groupBarcodesByAttributes = (
  barcodes: Array<{ fabricCode: string; lotNumber: string; shade: string; rollQty: number }>
): Record<string, { count: number; totalQty: number; barcodes: any[] }> => {
  return barcodes.reduce((groups, barcode) => {
    const key = `${barcode.fabricCode}-${barcode.lotNumber}-${barcode.shade}`;
    if (!groups[key]) {
      groups[key] = { count: 0, totalQty: 0, barcodes: [] };
    }
    groups[key].count++;
    groups[key].totalQty += barcode.rollQty;
    groups[key].barcodes.push(barcode);
    return groups;
  }, {} as Record<string, { count: number; totalQty: number; barcodes: any[] }>);
};

