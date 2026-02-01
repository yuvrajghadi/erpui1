/**
 * Job Work in-memory store
 * Provides ledger, settlement, billing and SLA helpers for job work flows
 */

import dayjs from 'dayjs';

type JWOutward = any;
type JWInward = any;
type JWLedger = any;

const outwards: JWOutward[] = [];
const inwards: JWInward[] = [];
const ledger: JWLedger[] = [];
const bills: any[] = [];

const recordLedger = (entry: JWLedger) => {
  entry.id = `JWL-${Date.now()}`;
  entry.date = new Date();
  ledger.unshift(entry);
};

const createOutward = (header: any, items: any[], user: any) => {
  const ch = { id: `JWO-${Date.now()}`, challanNo: `JWO-${String(outwards.length + 1).padStart(6, '0')}`, ...header, items, status: 'Sent', createdBy: user, createdAt: new Date() };
  outwards.unshift(ch);
  // ledger per vendor/process
  for (const it of items) {
    recordLedger({ vendor: header.vendor, process: header.processType, refType: 'Outward', refNo: ch.challanNo, challanNo: ch.challanNo, qtySent: it.qtySent || 0, qtyReceived: 0, damageQty: 0, balanceWithVendor: it.qtySent || 0, status: 'Sent', user, material: it.material });
  }
  return ch;
};

const submitInward = (header: any, items: any[], user: any) => {
  const iw = { id: `JWI-${Date.now()}`, inwardNo: `JWI-${String(inwards.length + 1).padStart(6, '0')}`, ...header, items, status: 'Submitted', createdBy: user, createdAt: new Date() };
  inwards.unshift(iw);
  // reconcile ledger entries: decrease vendor balance
  for (const it of items) {
    // find pending ledger rows for vendor+material
    const pending = ledger.find(l => l.vendor === header.vendor && l.material === it.material && l.refType === 'Outward' && (l.qtySent - (l.qtyReceived || 0) - (l.damageQty || 0)) > 0);
    const received = it.receivedQty || 0;
    // create inward ledger row
    recordLedger({ vendor: header.vendor, process: header.processType, refType: 'Inward', refNo: iw.inwardNo, challanNo: header.challanNo, qtySent: 0, qtyReceived: received, damageQty: it.damageQty || 0, balanceWithVendor: (pending ? (pending.qtySent - (pending.qtyReceived || 0) - (pending.damageQty || 0) - received) : 0), status: 'Received', user, material: it.material });
  }
  return iw;
};

const settleShortage = (vendor: string, challanNo: string, material: string, qty: number, settlementType: 'Debit Vendor' | 'Accept Loss' | 'Recover Next', user: any) => {
  recordLedger({ vendor, process: '', refType: 'ShortageSettlement', refNo: challanNo, challanNo, qtySent: 0, qtyReceived: 0, damageQty: qty, balanceWithVendor: 0, status: settlementType, user, material, note: settlementType });
};

const createBill = (vendor: string, challanNos: string[], rateMap: any, user: any) => {
  // rateMap: { material: rate }
  const selected = outwards.filter(o => challanNos.includes(o.challanNo));
  const billItems: any[] = [];
  for (const o of selected) {
    for (const it of o.items) {
      const rate = (rateMap && rateMap[it.material]) || it.rate || 0;
      const amount = (it.approvedQty || it.qtySent || 0) * rate;
      billItems.push({ material: it.material, qty: it.approvedQty || it.qtySent || 0, rate, amount, sourceChallan: o.challanNo });
    }
  }
  const b = { id: `JWB-${Date.now()}`, billNo: `JWB-${String(bills.length + 1).padStart(6, '0')}`, vendor, items: billItems, status: 'Draft', createdBy: user, createdAt: new Date() };
  bills.unshift(b);
  return b;
};

const computeSLA = (vendor: string) => {
  const rows = ledger.filter(l => l.vendor === vendor && (l.refType === 'Outward' || l.refType === 'Inward'));
  let total = 0, onTime = 0;
  for (const r of rows) {
    if (!r.challanNo) continue;
    const out = outwards.find(o => o.challanNo === r.challanNo);
    const inward = inwards.find(i => i.challanNo === r.challanNo || i.challanNo === r.refNo);
    if (!out || !inward) continue;
    total++;
    const expected = dayjs(out.expectedReturn || out.expectedReturnDate || out.expectedDate);
    const actual = dayjs(inward.date || inward.createdAt);
    if (actual.isBefore(expected) || actual.isSame(expected)) onTime++;
  }
  return { total, onTime, onTimePct: total ? Math.round((onTime / total) * 100) : 0 };
};

const computeAging = () => {
  const slabs = { '0-7': 0, '8-15': 0, '16-30': 0, '30+': 0 };
  const now = dayjs();
  for (const o of outwards) {
    const pd = dayjs(o.date || o.createdAt);
    const days = now.diff(pd, 'day');
    const qty = o.items?.reduce((s: number, it: any) => s + (it.qtySent || 0), 0) || 0;
    if (days <= 7) slabs['0-7'] += qty;
    else if (days <= 15) slabs['8-15'] += qty;
    else if (days <= 30) slabs['16-30'] += qty;
    else slabs['30+'] += qty;
  }
  return slabs;
};

const jobWorkStore = {
  listOutwards: () => outwards,
  listInwards: () => inwards,
  listLedger: () => ledger,
  createOutward,
  submitInward,
  settleShortage,
  createBill,
  computeSLA,
  computeAging,
  reverseInward: (inwardNo: string, approvedBy: any) => {
    // mark reversal and add negated ledger rows
    const iw = inwards.find(i => i.inwardNo === inwardNo);
    if (!iw) throw new Error('Inward not found');
    for (const it of iw.items) {
      recordLedger({ vendor: iw.vendor, process: iw.processType, refType: 'InwardReversal', refNo: inwardNo, challanNo: iw.challanNo, qtySent: 0, qtyReceived: -(it.receivedQty || 0), damageQty: -(it.damageQty || 0), balanceWithVendor: 0, status: 'Reversed', user: approvedBy, material: it.material });
    }
    iw.status = 'Reversed';
    return iw;
  },
  bills,
};

export default jobWorkStore;
