import { SAMPLE_RAW_STOCK, SAMPLE_FG_STOCK } from '../data/sampleData';
import type { StockLedgerEntry } from '../types';

const rawStock = [...SAMPLE_RAW_STOCK];
const fgStock = [...SAMPLE_FG_STOCK];
const ledger: StockLedgerEntry[] = [];
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ID-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function addToRawStock(item: any) {
  // find existing
  const existing = rawStock.find(r => r.itemId === item.itemId && r.lotNumber === item.lotNumber);
  if (existing) {
    existing.totalQty += item.quantity;
    existing.availableQty += item.quantity;
  } else {
    rawStock.push({
      id: createId(),
      itemType: 'fabric',
      itemId: item.itemId,
      itemName: item.itemName,
      lotNumber: item.lotNumber,
      totalQty: item.quantity,
      reservedQty: 0,
      availableQty: item.quantity,
      uom: item.uom || 'kg',
      warehouseId: '1',
      warehouseName: 'Raw Material Warehouse A',
      agingDays: 0,
      lastMovementDate: new Date(),
      status: 'available',
    });
  }
  ledger.unshift({
    id: createId(),
    transactionDate: new Date(),
    materialCode: item.itemId,
    materialName: item.itemName,
    lotNumber: item.lotNumber,
    referenceType: 'return',
    referenceNumber: item.reference || 'RETURN',
    inQuantity: item.quantity,
    outQuantity: 0,
    balanceQuantity: existing ? existing.availableQty : item.quantity,
    uom: item.uom || 'kg',
    warehouseId: '1',
    warehouseName: 'Raw Material Warehouse A',
    createdAt: new Date(),
  } as StockLedgerEntry);
}

export function addToDamagedStock(item: any) {
  ledger.unshift({
    id: createId(),
    transactionDate: new Date(),
    materialCode: item.itemId,
    materialName: item.itemName,
    lotNumber: item.lotNumber,
    referenceType: 'damaged',
    referenceNumber: item.reference || 'RETURN',
    inQuantity: 0,
    outQuantity: item.quantity,
    balanceQuantity: 0,
    uom: item.uom || 'kg',
    warehouseId: '1',
    warehouseName: 'Raw Material Warehouse A',
    createdAt: new Date(),
  } as StockLedgerEntry);
}

export function listStockLedger() {
  return ledger;
}

export default { addToRawStock, addToDamagedStock, listStockLedger };
