/**
 * In-memory Physical Inventory store
 * Handles cycle count adjustments, approvals, ledger updates and audit trail
 */

type AdjStatus = 'Draft' | 'Submitted' | 'Approved' | 'Posted' | 'Locked' | 'Reversed';

interface Adjustment {
  id: string;
  warehouse: string;
  item: string;
  lotShade: string;
  uom: string;
  qty: number; // positive = increase, negative = decrease
  reasonCode?: string;
  remarks?: string;
  refNo?: string; // reference to variance or cycle count id
  status: AdjStatus;
  createdBy: any;
  createdAt: Date;
  audit: { action: string; by: any; at: Date; note?: string }[];
  postingStatus?: 'Posted' | 'Reversed' | 'Pending';
  ledgerRef?: string;
  approvedBy?: any;
  approvedAt?: Date;
}

interface LedgerEntry {
  id: string;
  date: Date;
  itemName: string;
  itemType: string;
  lotShade: string;
  warehouse: string;
  refType: string;
  refNo: string;
  inQty: number;
  outQty: number;
  balanceQty: number;
  uom: string;
  userDepartment: string;
}

const adjustments: Adjustment[] = [];
const ledger: LedgerEntry[] = [];

// Simple in-memory stock master for balances keyed by item|lot|warehouse
const stockMaster: Record<string, number> = {};

const stockKey = (item: string, lot: string, warehouse: string) => `${item}||${lot}||${warehouse}`;

const updateStockMaster = (item: string, lot: string, warehouse: string, delta: number) => {
  const k = stockKey(item, lot, warehouse);
  const prev = stockMaster[k] || 0;
  const next = prev + delta;
  stockMaster[k] = next;
  return next;
};

const recordLedger = (entry: LedgerEntry) => {
  entry.id = `PHL-${Date.now()}-${Math.floor(Math.random()*1000)}`;
  entry.date = new Date();
  // apply balance from stock master
  const balance = updateStockMaster(entry.itemName, entry.lotShade, entry.warehouse, entry.inQty - entry.outQty);
  entry.balanceQty = balance;
  ledger.unshift(entry);
};

const createAdjustmentDraft = (payload: any, user: any) => {
  const adj: Adjustment = {
    id: `PADJ-${String(adjustments.length + 1).padStart(6, '0')}`,
    warehouse: payload.warehouse,
    item: payload.item,
    lotShade: payload.lotShade,
    uom: payload.uom || 'Nos',
    qty: payload.qty,
    reasonCode: payload.reasonCode,
    remarks: payload.remarks,
    refNo: payload.refNo,
    status: 'Draft',
    createdBy: user,
    createdAt: new Date(),
    audit: [{ action: 'Created', by: user, at: new Date(), note: 'Draft created' }],
    postingStatus: 'Pending',
  };
  adjustments.unshift(adj);
  return adj;
};

const submitAdjustment = (id: string, user: any) => {
  const a = adjustments.find(x => x.id === id);
  if (!a) throw new Error('Adjustment not found');
  if (a.status !== 'Draft') throw new Error('Only Draft can be submitted');
  a.status = 'Submitted';
  a.audit.push({ action: 'Submitted', by: user, at: new Date(), note: 'Submitted for approval' });
  return a;
};

const approveAdjustment = (id: string, user: any) => {
  const a = adjustments.find(x => x.id === id);
  if (!a) throw new Error('Adjustment not found');
  if (a.status !== 'Submitted') throw new Error('Only Submitted can be approved');
  a.status = 'Approved';
  a.audit.push({ action: 'Approved', by: user, at: new Date(), note: 'Approved by Inventory Manager' });
  a.approvedBy = user;
  a.approvedAt = new Date();
  return a;
};

const postAndLockAdjustment = (id: string, user: any) => {
  const a = adjustments.find(x => x.id === id);
  if (!a) throw new Error('Adjustment not found');
  if (a.status !== 'Approved') throw new Error('Only Approved can be posted');
  // prevent duplicate posting for same refNo
  if (a.refNo) {
    const already = adjustments.find(x => x.refNo === a.refNo && (x.status === 'Posted' || x.status === 'Locked'));
    if (already && already.id !== a.id) throw new Error('An adjustment has already been posted for this reference');
  }
  // create ledger entry
  const inQty = a.qty > 0 ? a.qty : 0;
  const outQty = a.qty < 0 ? Math.abs(a.qty) : 0;
  const entry: LedgerEntry = {
    id: '',
    date: new Date(),
    itemName: a.item,
    itemType: 'Unknown',
    lotShade: a.lotShade,
    warehouse: a.warehouse,
    refType: 'Physical Adjustment',
    refNo: a.id,
    inQty,
    outQty,
    balanceQty: 0,
    uom: a.uom,
    userDepartment: `${user?.dept || 'Inventory'} / ${user?.name || 'System'}`,
  };
  recordLedger(entry);
  a.ledgerRef = entry.id;
  a.postingStatus = 'Posted';
  a.status = 'Posted';
  a.audit.push({ action: 'Posted', by: user, at: new Date(), note: 'Posted to ledger' });
  // lock
  a.status = 'Locked';
  a.audit.push({ action: 'Locked', by: user, at: new Date(), note: 'Final locked' });
  a.status = 'Locked';
  return a;
};

const findAdjustmentByRef = (refNo?: string) => adjustments.find(a => a.refNo === refNo);

const listAdjustments = () => adjustments;
const listLedger = () => ledger;
const getAdjustmentById = (id: string) => adjustments.find(a => a.id === id);

const physicalInventoryStore = {
  createAdjustmentDraft,
  submitAdjustment,
  approveAdjustment,
  postAndLockAdjustment,
  listAdjustments,
  listLedger,
  getAdjustmentById,
  findAdjustmentByRef,
  // expose stock master read for UI
  _stockMaster: stockMaster,
};

export default physicalInventoryStore;
