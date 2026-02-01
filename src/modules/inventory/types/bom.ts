/**
 * BOM Types - Bill of Materials / Design Card
 */

export enum BOMStatus {
  DRAFT = 'Draft',
  APPROVED = 'Approved',
}

export enum BOMVersion {
  V1 = 'v1',
  V2 = 'v2',
  V3 = 'v3',
  V4 = 'v4',
  V5 = 'v5',
}

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL',
}

export interface FabricBOMItem {
  id: string;
  fabricCode: string;
  fabricName: string;
  gsm: number;
  width: number;
  consumptionPerPiece: number;
  wastagePercent: number;
  effectiveConsumption: number;
  remarks?: string;
}

export interface TrimBOMItem {
  id: string;
  trimCode: string;
  trimName: string;
  uom: string;
  quantityPerPiece: number;
  wastagePercent?: number;
  remarks?: string;
}

export interface SizeRatioItem {
  size: Size;
  ratio: number;
}

export interface ProcessFlags {
  requiresWashing: boolean;
  requiresPrinting: boolean;
  requiresEmbroidery: boolean;
  jobWorkRequired: boolean;
  expectedProcessLossPercent?: number;
}

export interface BOMHeader {
  bomCode: string;
  style: string;
  buyer?: string;
  season?: string;
  garmentType: string;
  bomVersion: BOMVersion;
  status: BOMStatus;
  remarks?: string;
  createdDate: Date;
  createdBy: string;
  lastModifiedDate: Date;
  lastModifiedBy: string;
}

export interface BOM {
  id: string;
  header: BOMHeader;
  fabricBOM: FabricBOMItem[];
  trimsBOM: TrimBOMItem[];
  sizeRatio: SizeRatioItem[];
  processFlags: ProcessFlags;
}

export interface BOMListItem {
  id: string;
  bomCode: string;
  style: string;
  buyer?: string;
  season?: string;
  version: BOMVersion;
  status: BOMStatus;
  createdDate: Date;
  createdBy: string;
}
