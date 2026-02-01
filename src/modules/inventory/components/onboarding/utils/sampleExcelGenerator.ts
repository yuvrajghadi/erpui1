/**
 * Sample Excel Generator Utility
 * Column-Driven Sample Excel Generation for Textile & Garment ERP
 * Generates Excel files that EXACTLY match UI table columns
 */

import * as XLSX from 'xlsx';

interface SampleDataConfig {
  masterId: string;
  masterName: string;
  columns: string[];
  sampleRows: any[][];
}

/**
 * ALL 11 MASTER SUB-TABS
 * Sample Excel structure matches UI table columns EXACTLY
 * No fake IDs, no auto-codes, textile-realistic data only
 */
const TEXTILE_SAMPLE_DATA: Record<string, SampleDataConfig> = {
  // 1. FABRIC MASTER
  fabric: {
    masterId: 'fabric',
    masterName: 'Fabric Master',
    columns: [
      'Fabric Code',
      'Type',
      'Construction',
      'Composition',
      'GSM',
      'Width (M)',
      'Shrinkage %',
      'Default UOM',
      'Shade Group',
      'Status',
    ],
    sampleRows: [
      ['FAB-001', 'Knitted', 'Single Jersey', '100% Cotton', 180, 1.8, 2.5, 'Meter', 'Solid', 'Active'],
      ['FAB-002', 'Woven', 'Plain Weave', '65% Poly 35% Cotton', 220, 1.5, 1.5, 'Meter', 'Solid', 'Active'],
      ['FAB-003', 'Knitted', 'Rib 1x1', '95% Cotton 5% Elastane', 200, 1.7, 3.0, 'Meter', 'Heather', 'Active'],
    ],
  },

  // 2. TRIM & ACCESSORIES MASTER
  trim: {
    masterId: 'trim',
    masterName: 'Trim & Accessories Master',
    columns: [
      'Trim Code',
      'Trim Name',
      'Trim Type',
      'Default UOM',
      'Status',
    ],
    sampleRows: [
      ['TRM-001', 'Button 4-Hole 15mm White', 'Button', 'Pieces', 'Active'],
      ['TRM-002', 'Zipper 5" Metal Silver', 'Zipper', 'Pieces', 'Active'],
      ['TRM-003', 'Woven Main Label 50x25mm', 'Label', 'Pieces', 'Active'],
    ],
  },

  // 3. SHADE MASTER
  shade: {
    masterId: 'shade',
    masterName: 'Shade Master',
    columns: [
      'Shade Code',
      'Shade Name',
      'Shade Group',
      'Status',
    ],
    sampleRows: [
      ['SHD-001', 'White', 'Solid', 'Active'],
      ['SHD-002', 'Navy Blue', 'Solid', 'Active'],
      ['SHD-003', 'Charcoal Heather', 'Heather', 'Active'],
    ],
  },

  // 4. UOM MASTER
  uom: {
    masterId: 'uom',
    masterName: 'UOM Master',
    columns: [
      'UOM Code',
      'UOM Name',
      'Conversion Base',
      'Status',
    ],
    sampleRows: [
      ['MTR', 'Meter', 'Base', 'Active'],
      ['KG', 'Kilogram', 'Base', 'Active'],
      ['PCS', 'Pieces', 'Base', 'Active'],
    ],
  },

  // 5. WAREHOUSE MASTER
  warehouse: {
    masterId: 'warehouse',
    masterName: 'Warehouse Master',
    columns: [
      'Warehouse Code',
      'Warehouse Name',
      'Location',
      'Status',
    ],
    sampleRows: [
      ['WH-001', 'Main Warehouse', 'Ground Floor, Building A', 'Active'],
      ['WH-002', 'Finished Goods Store', 'First Floor, Building B', 'Active'],
      ['WH-003', 'Quarantine Area', 'Ground Floor, Building A', 'Active'],
    ],
  },

  // 6. WAREHOUSE RACK / BIN (not in current onboarding but specified)
  'warehouse-rack': {
    masterId: 'warehouse-rack',
    masterName: 'Warehouse Rack Bin',
    columns: [
      'Warehouse',
      'Rack Code',
      'Rack Name',
      'Bin Code',
      'Bin Name',
      'Capacity',
      'Status',
    ],
    sampleRows: [
      ['WH-001', 'R-A01', 'Rack A01', 'B-001', 'Bin 001', '500 Kg', 'Active'],
      ['WH-001', 'R-A02', 'Rack A02', 'B-002', 'Bin 002', '500 Kg', 'Active'],
      ['WH-002', 'R-B01', 'Rack B01', 'B-003', 'Bin 003', '1000 Kg', 'Active'],
    ],
  },

  // 7. WAREHOUSE ZONES
  'warehouse-zone': {
    masterId: 'warehouse-zone',
    masterName: 'Warehouse Zones',
    columns: [
      'Warehouse',
      'Zone Code',
      'Zone Name',
      'Description',
      'Status',
    ],
    sampleRows: [
      ['WH-001', 'ZONE-A', 'Fabric Storage Zone', 'Raw fabric rolls storage area', 'Active'],
      ['WH-001', 'ZONE-B', 'Trims Storage Zone', 'Buttons, zippers, labels storage', 'Active'],
      ['WH-002', 'ZONE-FG', 'Finished Goods Zone', 'Packed finished garments', 'Active'],
    ],
  },

  // 8. SUPPLIER / JOB WORKER MASTER
  supplier: {
    masterId: 'supplier',
    masterName: 'Supplier Job Worker Master',
    columns: [
      'Party Code',
      'Party Name',
      'Party Type',
      'Contact Person',
      'Phone',
      'GST Number',
      'Status',
    ],
    sampleRows: [
      ['SUP-001', 'ABC Fabrics Pvt Ltd', 'Supplier', 'Rajesh Kumar', '9876543210', '27ABCDE1234F1Z5', 'Active'],
      ['SUP-002', 'XYZ Trims Co', 'Supplier', 'Priya Sharma', '9123456780', '27XYZAB5678G2Z1', 'Active'],
      ['JOB-001', 'Quality Stitching House', 'Job Worker', 'Amit Patel', '9988776655', '27JOBWK9012H3Z7', 'Active'],
    ],
  },

  // 9. PROCESS / OPERATION MASTER
  process: {
    masterId: 'process',
    masterName: 'Process Operation Master',
    columns: [
      'Process Code',
      'Process Name',
      'Is Job Work',
      'Expected Loss %',
      'Status',
    ],
    sampleRows: [
      ['PRC-001', 'Cutting', 'No', 2.0, 'Active'],
      ['PRC-002', 'Stitching', 'Yes', 1.0, 'Active'],
      ['PRC-003', 'Washing & Dyeing', 'Yes', 3.0, 'Active'],
    ],
  },

  // 10. MATERIAL CATEGORY MASTER
  category: {
    masterId: 'category',
    masterName: 'Material Category Master',
    columns: [
      'Category Code',
      'Category Name',
      'Description',
      'Status',
    ],
    sampleRows: [
      ['CAT-001', 'Raw Fabric', 'Main fabric materials for garment production', 'Active'],
      ['CAT-002', 'Trims & Accessories', 'Buttons, zippers, labels, tags', 'Active'],
      ['CAT-003', 'Packaging Materials', 'Poly bags, cartons, hangers', 'Active'],
    ],
  },

  // 11. BOM / DESIGN CARD MASTER
  bom: {
    masterId: 'bom',
    masterName: 'BOM Design Card Master',
    columns: [
      'Style Code',
      'Buyer',
      'Season',
      'Material Name',
      'Material Type',
      'Consumption Qty',
      'UOM',
      'Process Stage',
      'Remarks',
      'Status',
    ],
    sampleRows: [
      ['STY-001', 'H&M', 'SS2026', 'Cotton Single Jersey', 'Fabric', 1.5, 'Meter', 'Cutting', 'Body fabric', 'Draft'],
      ['STY-001', 'H&M', 'SS2026', 'Button 4H White 15mm', 'Trim', 5, 'Pieces', 'Stitching', 'Front placket', 'Draft'],
      ['STY-002', 'Zara', 'AW2026', 'Denim Stretch', 'Fabric', 1.8, 'Meter', 'Cutting', 'Main fabric', 'Draft'],
    ],
  },

  // OPENING STOCK (Special case for onboarding)
  'opening-stock': {
    masterId: 'opening-stock',
    masterName: 'Opening Stock',
    columns: [
      'Material Code',
      'Material Name',
      'Lot Number',
      'Shade Code',
      'Warehouse',
      'Zone',
      'Quantity',
      'UOM',
      'Rate',
      'Value',
    ],
    sampleRows: [
      ['FAB-001', 'Cotton Single Jersey 180 GSM', 'LOT-2026-001', 'SHD-001', 'WH-001', 'ZONE-A', 500, 'Meter', 150, 75000],
      ['TRM-001', 'Button 4H White 15mm', 'LOT-2026-002', '', 'WH-001', 'ZONE-B', 5000, 'Pieces', 2, 10000],
      ['FAB-002', 'Poly Cotton Twill 220 GSM', 'LOT-2026-003', 'SHD-002', 'WH-001', 'ZONE-A', 300, 'Meter', 180, 54000],
    ],
  },
};

/**
 * Generate Sample Excel from table column configuration
 * This is the PRIMARY method - column-driven approach
 */
export const generateSampleExcelFromColumns = (
  masterName: string,
  columns: Array<{ title: string }>,
  sampleRows: any[][]
): void => {
  // Extract column headers from table config
  const headers = columns.map((col) => col.title);

  // Create worksheet data
  const wsData = [headers, ...sampleRows];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = headers.map((header) => ({ wch: Math.max(header.length + 5, 15) }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Data');

  // Generate file name
  const fileName = `${masterName.replace(/\s+/g, '_')}_Sample.xlsx`;

  // Download file
  XLSX.writeFile(wb, fileName);
};

/**
 * Generate Sample Excel from preset config (fallback method)
 * Use this when you don't have direct access to column config
 */
export const generateSampleExcel = (masterId: string): void => {
  const config = TEXTILE_SAMPLE_DATA[masterId];

  if (!config) {
    console.error(`No sample data config for master: ${masterId}`);
    return;
  }

  // Create worksheet data
  const wsData = [config.columns, ...config.sampleRows];

  // Create workbook
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  const colWidths = config.columns.map((col) => ({ wch: Math.max(col.length + 5, 15) }));
  ws['!cols'] = colWidths;

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Sample Data');

  // Generate file name
  const fileName = `${config.masterName.replace(/\s+/g, '_')}_Sample.xlsx`;

  // Download file
  XLSX.writeFile(wb, fileName);
};

/**
 * Get preset sample data configuration
 */
export const getSampleDataConfig = (masterId: string): SampleDataConfig | null => {
  return TEXTILE_SAMPLE_DATA[masterId] || null;
};

/**
 * Get sample rows for a specific master type
 * Use this to get realistic textile data for your table
 */
export const getSampleRows = (masterId: string): any[][] => {
  const config = TEXTILE_SAMPLE_DATA[masterId];
  return config ? config.sampleRows : [];
};
