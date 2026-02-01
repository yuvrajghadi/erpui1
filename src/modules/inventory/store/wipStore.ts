import type {
  WIPLot,
  WIPLedgerEntry,
  WIPConsumption,
  WIPRework,
  WIPTransfer,
  WIPCost,
  ProcessType,
  UOM,
} from '../types';
import { SAMPLE_WIP } from '../data/sampleData';

// Simple in-memory stores (mock)
const wipLots: Record<string, WIPLot> = {};
const ledger: WIPLedgerEntry[] = [];
const consumptions: WIPConsumption[] = [];
const reworks: WIPRework[] = [];
const transfers: WIPTransfer[] = [];
const costs: Record<string, WIPCost> = {};
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ID-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

// Helper: generate lot number from sample pattern
function generateWipLot(styleId: string, orderId?: string) {
  const suffix = orderId ? orderId.replace(/\s+/g, '').toUpperCase() : 'ORD';
  return `WIP-${styleId}-${suffix}-${Math.floor(Math.random() * 9000) + 1000}`;
}

// Initialize sample lots from SAMPLE_WIP
function initFromSample() {
  SAMPLE_WIP.forEach(s => {
    const lotNumber = generateWipLot(s.styleId || 'STYLE', s.styleId);
    const lot: WIPLot = {
      lotNumber,
      parentLot: undefined,
      wipNumber: `WIPNO-${lotNumber}`,
      styleId: s.styleId,
      styleName: s.styleName,
      color: s.color,
      size: s.size || 'M',
      uom: 'piece' as UOM,
      totalQty: s.quantity,
      balances: {
        cutting: s.currentProcess === 'cutting' ? s.quantity : 0,
        stitching: s.currentProcess === 'stitching' ? s.quantity : 0,
        washing: s.currentProcess === 'washing' ? s.quantity : 0,
        finishing: s.currentProcess === 'finishing' ? s.quantity : 0,
        printing: 0,
        embroidery: 0,
        packing: 0,
      } as Record<ProcessType, number>,
      currentProcess: s.currentProcess,
      processLocation: s.processLocation,
      status: s.status === 'in_progress' ? 'active' : s.status === 'on_hold' ? 'on_hold' : 'released',
      createdAt: s.entryDate || new Date(),
      entryDate: s.entryDate,
      expectedCompletionDate: s.expectedCompletionDate,
    };
    wipLots[lot.lotNumber] = lot;
    ledger.push({
      id: createId(),
      date: new Date(),
      wipLot: lot.lotNumber,
      action: 'issue',
      quantityIn: lot.totalQty,
      quantityOut: 0,
      balanceAfter: lot.totalQty,
      createdAt: new Date(),
    } as unknown as WIPLedgerEntry);
  });
}

initFromSample();

export function listWipLots() {
  return Object.values(wipLots);
}

export function getWipLot(lotNumber: string) {
  return wipLots[lotNumber];
}

export function recordLedger(entry: Omit<WIPLedgerEntry, 'id' | 'date'>) {
  const e: WIPLedgerEntry = { ...entry, id: createId(), date: new Date() };
  ledger.unshift(e);
  return e;
}

export function getLedgerForLot(lotNumber: string) {
  return ledger.filter(l => l.wipLot === lotNumber);
}

export function holdLot(lotNumber: string, reason: string, user?: { id?: string; name?: string }) {
  const lot = wipLots[lotNumber];
  if (!lot) throw new Error('Lot not found');
  lot.status = 'on_hold';
  lot.holdReason = reason;
  lot.holdDate = new Date();
  lot.updatedAt = new Date();
  recordLedger({ wipLot: lotNumber, action: 'hold', quantityOut: 0, quantityIn: 0, balanceAfter: lot.totalQty, userId: user?.id, userName: user?.name, reason });
  return lot;
}

export function releaseLot(lotNumber: string, user?: { id?: string; name?: string }) {
  const lot = wipLots[lotNumber];
  if (!lot) throw new Error('Lot not found');
  lot.status = 'released';
  lot.updatedAt = new Date();
  recordLedger({ wipLot: lotNumber, action: 'release', quantityOut: 0, quantityIn: 0, balanceAfter: lot.totalQty, userId: user?.id, userName: user?.name });
  return lot;
}

export function transferLot(lotNumber: string, toLine: string, qty: number, reason?: string, user?: { id?: string; name?: string }) {
  const lot = wipLots[lotNumber];
  if (!lot) throw new Error('Lot not found');
  // decrease from current process balance and increase to destination (mocked)
  const from = lot.currentProcess;
  // reduce from balance
  lot.balances[from] = Math.max(0, (lot.balances[from] || 0) - qty);
  // assign to a target process (assuming toLine maps to process name for demo)
  const toProcess = lot.currentProcess; // keep same process but record transfer
  lot.updatedAt = new Date();
  const t: WIPTransfer = {
    id: createId(),
    transferNumber: `TR-${Date.now()}`,
    transferDate: new Date(),
    fromLine: lot.processLocation,
    toLine,
    wipLot: lotNumber,
    qty,
    reason,
    status: 'in_transit',
    createdBy: user?.name,
  };
  transfers.push(t);
  recordLedger({ wipLot: lotNumber, action: 'transfer', fromProcess: from, toProcess: toProcess, quantityOut: qty, quantityIn: 0, balanceAfter: Object.values(lot.balances).reduce((s, v) => s + v, 0), userId: user?.id, userName: user?.name, reason });
  return t;
}

export function reworkLot(lotNumber: string, fromProcess: ProcessType, toProcess: ProcessType, qty: number, remarks?: string) {
  const lot = wipLots[lotNumber];
  if (!lot) throw new Error('Lot not found');
  const r: WIPRework = {
    id: createId(),
    wipLot: lotNumber,
    fromProcess,
    toProcess,
    qty,
    status: 'sent_for_rework',
    createdAt: new Date(),
    remarks,
  };
  reworks.push(r);
  // update balances: subtract from fromProcess, add to toProcess
  lot.balances[fromProcess] = Math.max(0, (lot.balances[fromProcess] || 0) - qty);
  lot.balances[toProcess] = (lot.balances[toProcess] || 0) + qty;
  recordLedger({ wipLot: lotNumber, action: 'rework', fromProcess, toProcess, quantityOut: qty, quantityIn: qty, balanceAfter: Object.values(lot.balances).reduce((s, v) => s + v, 0), reason: remarks });
  r.status = 'reworked';
  return r;
}

export function finishLot(lotNumber: string, finishedQty: number, user?: { id?: string; name?: string }) {
  const lot = wipLots[lotNumber];
  if (!lot) throw new Error('Lot not found');
  // subtract from current process
  lot.balances[lot.currentProcess] = Math.max(0, (lot.balances[lot.currentProcess] || 0) - finishedQty);
  const currentBalance = Object.values(lot.balances).reduce((s, v) => s + v, 0);
  recordLedger({ wipLot: lotNumber, action: 'finish', quantityOut: finishedQty, quantityIn: 0, balanceAfter: currentBalance, userId: user?.id, userName: user?.name });
  // if balance 0 -> auto-close and create FG reference (mock)
  if (currentBalance === 0) {
    lot.status = 'closed';
    lot.updatedAt = new Date();
    recordLedger({ wipLot: lotNumber, action: 'finish', quantityOut: 0, quantityIn: 0, balanceAfter: 0, reason: 'Auto-closed, converted to FG' });
  }
  return lot;
}

export function consumeMaterialForWip(wipLot: string, materialId: string, plannedQty: number, consumedQty: number, uom: UOM) {
  const varianceQty = plannedQty - consumedQty;
  const variancePercentage = plannedQty > 0 ? Math.round((varianceQty / plannedQty) * 10000) / 100 : 0;
  const c: WIPConsumption = {
    id: createId(),
    wipLot,
    materialId,
    plannedQty,
    consumedQty,
    uom,
    varianceQty,
    variancePercentage,
  };
  consumptions.push(c);
  // In real system: reduce RawMaterial stock and create stock ledger entries
  // Here: record a WIP ledger consumption entry
  const lot = wipLots[wipLot];
  const balance = lot ? Object.values(lot.balances).reduce((s, v) => s + v, 0) : 0;
  recordLedger({ wipLot, action: 'issue', quantityOut: consumedQty, quantityIn: 0, balanceAfter: balance, reason: `Material ${materialId} consumed` });
  return c;
}

export function listLedger() {
  return ledger;
}

export function listConsumptions() {
  return consumptions;
}

export function listReworks() {
  return reworks;
}

export function listTransfers() {
  return transfers;
}

export function listCosts() {
  return Object.values(costs);
}

export default {
  listWipLots,
  getWipLot,
  recordLedger,
  getLedgerForLot,
  holdLot,
  releaseLot,
  transferLot,
  reworkLot,
  finishLot,
  consumeMaterialForWip,
  listLedger,
  listConsumptions,
  listReworks,
  listTransfers,
  listCosts,
};

// =====================
// BOM / KPI Helpers
// =====================

export function linkBOMAndConsume(wipLot: string, bomItems: { materialId: string; plannedQty: number; uom: UOM }[]) {
  // For each BOM item, simulate consumption and return summary
  const results = bomItems.map(b => {
    // simulate consumed qty = planned +/- 0..2%
    const variance = Math.round((Math.random() * 4 - 2) * b.plannedQty / 100);
    const consumed = Math.max(0, b.plannedQty + variance);
    const c = consumeMaterialForWip(wipLot, b.materialId, b.plannedQty, consumed, b.uom);
    return c;
  });
  return results;
}

export function getWipKPIs() {
  // compute simple KPIs from existing lots
  const lots = listWipLots();
  const totalLots = lots.length;
  const totalQty = lots.reduce((s, l) => s + l.totalQty, 0);
  const reworkCount = reworks.length;
  const avgDays = Math.round(lots.reduce((s, l) => s + ((new Date().getTime() - (l.entryDate?.getTime() || l.createdAt.getTime())) / (1000 * 60 * 60 * 24)), 0) / Math.max(1, totalLots));
  // First pass yield approximation: (finished / (finished + rework + rejection)) - not fully tracked here => placeholder
  const fpy = Math.max(0, Math.round(((totalQty - reworks.reduce((s, r) => s + r.qty, 0)) / Math.max(1, totalQty)) * 100));
  return {
    totalLots,
    totalQty,
    reworkCount,
    avgDays: Math.round(avgDays),
    firstPassYield: `${fpy}%`,
  };
}

export function checkSLAforLot(lotNumber: string, slaByProcess: Record<ProcessType, number>) {
  const lot = getWipLot(lotNumber);
  if (!lot) return null;
  const ageDays = Math.floor((new Date().getTime() - (lot.entryDate?.getTime() || lot.createdAt.getTime())) / (1000 * 60 * 60 * 24));
  const sla = slaByProcess[lot.currentProcess] || 0;
  return {
    lotNumber,
    currentProcess: lot.currentProcess,
    ageDays,
    slaDays: sla,
    slaBreached: ageDays > sla,
    critical: ageDays > sla * 1.5,
  };
}
