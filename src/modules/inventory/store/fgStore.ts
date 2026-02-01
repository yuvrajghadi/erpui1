/**
 * Finished Goods in-memory store with ledger and basic workflows
 */

import { SAMPLE_FG_STOCK } from '../data/sampleData';
import type { ProcessType } from '../types';
import dayjs from 'dayjs';
import wipStore from './wipStore';

type FGStockEntry = any;
type FGLedgerEntry = any;

const stock: FGStockEntry[] = JSON.parse(JSON.stringify(SAMPLE_FG_STOCK || []));
const ledger: FGLedgerEntry[] = [];
const dispatches: any[] = [];
const blockedStyles: Record<string, { reason: string; by: any; at: string }> = {};

const currentBalanceFor = (style: string, color: string, size: string) => {
  const s = stock.find((x) => x.styleNumber === style && x.color === color);
  if (!s) return 0;
  const breakdown = s.sizeBreakdown || {};
  return breakdown[size] || 0;
};

const recordLedger = (entry: FGLedgerEntry) => {
  entry.id = `FGL-${Date.now()}`;
  entry.createdAt = new Date();
  ledger.unshift(entry);
};

const updateStock = (style: string, color: string, size: string, cartons: number, pieces: number, packingDate?: string, warehouse?: string) => {
  let s = stock.find((x) => x.styleNumber === style && x.color === color && x.warehouseName === warehouse);
  if (!s) {
    s = {
      id: `FG-${Date.now()}`,
      styleNumber: style,
      orderNumber: '',
      buyerName: '',
      description: '',
      color,
      cartonCount: cartons,
      totalPieces: pieces,
      sizeBreakdown: { [size]: pieces },
      warehouseName: warehouse || 'Main',
      packingDate: packingDate || new Date(),
      dispatchStatus: 'ready',
      status: 'in_stock',
    };
    stock.unshift(s);
  } else {
    s.cartonCount = (s.cartonCount || 0) + cartons;
    s.totalPieces = (s.totalPieces || 0) + pieces;
    s.sizeBreakdown = s.sizeBreakdown || {};
    s.sizeBreakdown[size] = (s.sizeBreakdown[size] || 0) + pieces;
  }
  return s;
};

const fgStore = {
  listStock: () => stock,
  listLedger: (filter?: any) => {
    if (!filter) return ledger;
    return ledger.filter((l) => {
      for (const k of Object.keys(filter)) {
        if (l[k] !== filter[k]) return false;
      }
      return true;
    });
  },
  recordPackingClose: (packingHeader: any, items: any[], user: any) => {
    const packingNo = packingHeader.packingNo || `PACK-${Date.now()}`;
    const entries: FGLedgerEntry[] = [];
    for (const it of items) {
      const e: FGLedgerEntry = {
        style: packingHeader.style,
        color: it.color,
        size: it.size,
        refType: 'Packing',
        refNo: packingNo,
        inCartons: 1,
        inPieces: it.qty || 0,
        outCartons: 0,
        outPieces: 0,
        balancePieces: 0,
        warehouse: packingHeader.warehouse || 'Main',
        user,
        packingDate: packingHeader.date || new Date(),
      };
      // update stock first
      const s = updateStock(e.style, e.color, e.size, e.inCartons, e.inPieces, e.packingDate, e.warehouse);
      e.balancePieces = s.totalPieces;
      recordLedger(e);
      entries.push(e);
    }
    // finance hook placeholder: capitalize FG
    if (typeof fgStore.onFinanceEvent === 'function') {
      fgStore.onFinanceEvent('packing_close', { packingNo, user, items, date: new Date() });
    }
    return entries;
  },
  blockStyle: (style: string, reason: string, user: any) => {
    blockedStyles[style] = { reason, by: user, at: new Date().toISOString() };
    recordLedger({ style, refType: 'Hold', refNo: `HOLD-${Date.now()}`, inCartons: 0, inPieces: 0, outCartons: 0, outPieces: 0, balancePieces: 0, warehouse: 'Main', user, note: reason });
  },
  unblockStyle: (style: string, user: any) => {
    delete blockedStyles[style];
    recordLedger({ style, refType: 'Unhold', refNo: `UNHOLD-${Date.now()}`, inCartons: 0, inPieces: 0, outCartons: 0, outPieces: 0, balancePieces: 0, warehouse: 'Main', user });
  },
  isStyleBlocked: (style: string) => !!blockedStyles[style],
  createDispatch: (dispatch: any, user: any) => {
    const d = { id: `DSP-${Date.now()}`, ...dispatch, status: 'Planned', createdBy: user, createdAt: new Date() };
    dispatches.push(d);
    return d;
  },
  confirmDispatch: (dispatchId: string, user: any) => {
    const d = dispatches.find(x => x.id === dispatchId);
    if (!d) throw new Error('Dispatch not found');
    // reduce stock for allocated cartons/items
    for (const alloc of d.allocations || []) {
      // find stock entry
      const s = stock.find(x => x.styleNumber === alloc.style && x.color === alloc.color && x.warehouseName === alloc.warehouse);
      if (s) {
        s.cartonCount = (s.cartonCount || 0) - (alloc.cartons || 0);
        s.totalPieces = (s.totalPieces || 0) - (alloc.pieces || 0);
        if (s.sizeBreakdown && alloc.size) {
          s.sizeBreakdown[alloc.size] = (s.sizeBreakdown[alloc.size] || 0) - (alloc.pieces || 0);
        }
      }
      recordLedger({ style: alloc.style, color: alloc.color, size: alloc.size, refType: 'Dispatch', refNo: d.id, inCartons: 0, inPieces: 0, outCartons: alloc.cartons || 0, outPieces: alloc.pieces || 0, balancePieces: s?.totalPieces || 0, warehouse: alloc.warehouse, user });
    }
    d.status = 'Dispatched';
    d.dispatchedAt = new Date();
    if (typeof fgStore.onFinanceEvent === 'function') fgStore.onFinanceEvent('dispatch_confirm', { dispatchId: d.id, user });
    return d;
  },
  processReturn: (dispatchNo: string, returns: any[], reason: string, action: 'FG' | 'WIP' | 'Scrap', user: any) => {
    // find dispatch
    const d = dispatches.find(x => x.id === dispatchNo || x.dispatchNo === dispatchNo);
    for (const r of returns) {
      if (action === 'FG') {
        // add back to FG
        const s = updateStock(r.style, r.color, r.size, 0, r.pieces, r.packingDate, r.warehouse);
        recordLedger({ style: r.style, color: r.color, size: r.size, refType: 'Return', refNo: dispatchNo, inCartons: 0, inPieces: r.pieces, outCartons: 0, outPieces: 0, balancePieces: s.totalPieces, warehouse: r.warehouse, user, note: reason });
      } else if (action === 'WIP') {
        // send to WIP as rework (best-effort)
        if (wipStore && typeof wipStore.reworkLot === 'function' && (r.wipLot || r.lotNumber)) {
          const lotNumber = r.wipLot || r.lotNumber;
          const fromProcess = (r.fromProcess || r.process || 'finishing') as ProcessType;
          const toProcess = (r.toProcess || r.process || 'finishing') as ProcessType;
          wipStore.reworkLot(lotNumber, fromProcess, toProcess, r.pieces || 0, reason);
        }
        recordLedger({ style: r.style, color: r.color, size: r.size, refType: 'Return-WIP', refNo: dispatchNo, inCartons: 0, inPieces: 0, outCartons: 0, outPieces: r.pieces, balancePieces: 0, warehouse: r.warehouse, user, note: reason });
      } else {
        // scrap
        recordLedger({ style: r.style, color: r.color, size: r.size, refType: 'Scrap', refNo: dispatchNo, inCartons: 0, inPieces: 0, outCartons: 0, outPieces: r.pieces, balancePieces: 0, warehouse: r.warehouse, user, note: reason });
      }
    }
    if (typeof fgStore.onFinanceEvent === 'function') fgStore.onFinanceEvent('return_processed', { dispatchNo, reason, action, user });
  },
  repackCarton: (packingNo: string, originalItems: any[], newItems: any[], user: any) => {
    // Compute deltas between original and new items and adjust stock + ledger
    for (const orig of originalItems) {
      const match = newItems.find(n => n.cartonNo === orig.cartonNo && n.size === orig.size && n.color === orig.color);
      const newQty = match ? (match.qty || 0) : 0;
      const delta = newQty - (orig.qty || 0);
      if (delta === 0) continue;
      if (delta > 0) {
        // added pieces to carton -> increase stock
        const s = updateStock(orig.style || orig.styleNumber || 'unknown', orig.color, orig.size, 0, delta, orig.packingDate, orig.warehouse);
        recordLedger({ style: orig.style || orig.styleNumber || 'unknown', color: orig.color, size: orig.size, refType: 'Repack', refNo: packingNo, inCartons: 0, inPieces: delta, outCartons: 0, outPieces: 0, balancePieces: s.totalPieces, warehouse: orig.warehouse, user, note: 'Repack add' });
      } else {
        // removed pieces -> decrease stock
        const remove = Math.abs(delta);
        const s = stock.find(x => x.styleNumber === (orig.style || orig.styleNumber || 'unknown') && x.color === orig.color && x.warehouseName === orig.warehouse);
        if (s) {
          s.totalPieces = (s.totalPieces || 0) - remove;
          if (s.sizeBreakdown && orig.size) s.sizeBreakdown[orig.size] = (s.sizeBreakdown[orig.size] || 0) - remove;
        }
        recordLedger({ style: orig.style || orig.styleNumber || 'unknown', color: orig.color, size: orig.size, refType: 'Repack', refNo: packingNo, inCartons: 0, inPieces: 0, outCartons: 0, outPieces: remove, balancePieces: s?.totalPieces || 0, warehouse: orig.warehouse, user, note: 'Repack remove' });
      }
    }
    if (typeof fgStore.onFinanceEvent === 'function') fgStore.onFinanceEvent('repack', { packingNo, user });
  },
  listDeadStock: () => {
    const now = dayjs();
    return stock.filter(s => {
      const pd = dayjs(s.packingDate || new Date());
      return now.diff(pd, 'day') > 90;
    });
  },
  computeAging: () => {
    const slabs = { '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 };
    const now = dayjs();
    for (const s of stock) {
      const pd = dayjs(s.packingDate || new Date());
      const days = now.diff(pd, 'day');
      const pieces = s.totalPieces || 0;
      if (days <= 30) slabs['0-30'] += pieces;
      else if (days <= 60) slabs['31-60'] += pieces;
      else if (days <= 90) slabs['61-90'] += pieces;
      else slabs['90+'] += pieces;
    }
    return slabs;
  },
  valuation: (method: 'cost' | 'standard' | 'order', priceMap?: any) => {
    // priceMap: { style: pricePerPiece }
    let total = 0;
    for (const s of stock) {
      const price = (priceMap && priceMap[s.styleNumber]) || 500;
      total += (s.totalPieces || 0) * price;
    }
    return { method, total };
  },
  onFinanceEvent: null as any,
};

export default fgStore;
