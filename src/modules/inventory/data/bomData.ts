/**
 * Sample BOM Data
 */

import type { BOM, BOMListItem } from '../types/bom';
import { BOMStatus, BOMVersion, Size } from '../types/bom';

export const SAMPLE_BOM_LIST: BOMListItem[] = [
  {
    id: 'bom-001',
    bomCode: 'BOM-260101-0001',
    style: 'SH-001',
    buyer: 'GLOBAL BRANDS',
    season: 'Spring/Summer',
    version: BOMVersion.V1,
    status: BOMStatus.APPROVED,
    createdDate: new Date('2025-12-15'),
    createdBy: 'John Doe',
  },
  {
    id: 'bom-002',
    bomCode: 'BOM-260102-0002',
    style: 'PT-002',
    buyer: 'FASHION CORP',
    season: 'Spring/Summer',
    version: BOMVersion.V1,
    status: BOMStatus.DRAFT,
    createdDate: new Date('2025-12-18'),
    createdBy: 'Jane Smith',
  },
  {
    id: 'bom-003',
    bomCode: 'BOM-260105-0003',
    style: 'TSH-003',
    buyer: 'CASUAL WEAR',
    season: 'Summer',
    version: BOMVersion.V1,
    status: BOMStatus.APPROVED,
    createdDate: new Date('2026-01-05'),
    createdBy: 'Mike Johnson',
  },
];

export const SAMPLE_BOM_SH001: BOM = {
  id: 'bom-001',
  header: {
    bomCode: 'BOM-260101-0001',
    style: 'SH-001',
    buyer: 'GLOBAL BRANDS',
    season: 'Spring/Summer',
    garmentType: 'Shirt',
    bomVersion: BOMVersion.V1,
    status: BOMStatus.APPROVED,
    remarks: 'Standard men shirt with collar and cuffs',
    createdDate: new Date('2025-12-15'),
    createdBy: 'John Doe',
    lastModifiedDate: new Date('2025-12-20'),
    lastModifiedBy: 'John Doe',
  },
  fabricBOM: [
    {
      id: 'fab-item-001',
      fabricCode: 'CTN-100',
      fabricName: 'Cotton 100%',
      gsm: 150,
      width: 58,
      consumptionPerPiece: 1.8,
      wastagePercent: 5,
      effectiveConsumption: 1.89,
      remarks: 'Main body fabric',
    },
    {
      id: 'fab-item-002',
      fabricCode: 'RIB-CUFF',
      fabricName: 'Rib (Cuff)',
      gsm: 120,
      width: 32,
      consumptionPerPiece: 0.3,
      wastagePercent: 8,
      effectiveConsumption: 0.324,
      remarks: 'Collar and cuff reinforcement',
    },
  ],
  trimsBOM: [
    {
      id: 'trim-item-001',
      trimCode: 'BTN-WH-14',
      trimName: 'Button White 14mm',
      uom: 'Pcs',
      quantityPerPiece: 6,
      wastagePercent: 2,
      remarks: 'Front placket buttons',
    },
    {
      id: 'trim-item-002',
      trimCode: 'THREAD-BLK',
      trimName: 'Thread Black',
      uom: 'Meter',
      quantityPerPiece: 150,
      wastagePercent: 5,
      remarks: 'All stitching',
    },
  ],
  sizeRatio: [
    { size: Size.S, ratio: 20 },
    { size: Size.M, ratio: 30 },
    { size: Size.L, ratio: 30 },
    { size: Size.XL, ratio: 20 },
  ],
  processFlags: {
    requiresWashing: true,
    requiresPrinting: false,
    requiresEmbroidery: false,
    jobWorkRequired: false,
    expectedProcessLossPercent: 2,
  },
};
