import { SAMPLE_RAW_STOCK } from '../data/sampleData';
import type { IssueToProduction, IssueLedgerEntry, IssueStatus, ProcessTransfer } from '../types';
import wipStore from './wipStore';

const issues: IssueToProduction[] = [];
const ledger: IssueLedgerEntry[] = [];
const createId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `ID-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

export function createIssue(issue: Omit<IssueToProduction, 'id' | 'issueNumber' | 'createdAt' | 'issueDate'> & { issueDate?: Date }) {
  const id = createId();
  const issueNumber = `ISS-${Date.now().toString().slice(-6)}`;
  const issueDate = issue.issueDate || new Date();
  const newIssue: IssueToProduction = {
    ...issue,
    id,
    issueNumber,
    issueDate,
    createdAt: new Date(),
    status: (issue as any).status || 'draft',
  } as IssueToProduction;
  issues.unshift(newIssue);
  // create ledger entries per item
  (newIssue.items || []).forEach((it: any) => {
    const balance = it.issuedQuantity; // starting balance
    ledger.unshift({
      id: createId(),
      issueNumber,
      issueDate,
      materialCode: it.materialCode,
      materialName: it.materialName,
      lotNumber: it.lotNumber,
      rollNumber: it.rollNumber,
      issuedQty: it.issuedQuantity,
      returnedQty: 0,
      transferredQty: 0,
      balanceQty: balance,
      currentProcess: newIssue.processType as any,
      status: newIssue.status as IssueStatus,
      createdAt: new Date(),
    });
  });
  return newIssue;
}

export function listIssues() {
  return issues;
}

export function getIssue(issueNumber: string) {
  return issues.find(i => i.issueNumber === issueNumber);
}

export function getIssueLedger(issueNumber: string) {
  return ledger.filter(l => l.issueNumber === issueNumber);
}

export function approveIssue(issueNumber: string, approver: { id?: string; name?: string }) {
  const issue = getIssue(issueNumber);
  if (!issue) throw new Error('Issue not found');
  issue.status = 'approved';
  // update ledger status
  ledger.forEach(l => {
    if (l.issueNumber === issueNumber) l.status = 'approved';
  });
  return issue;
}

export function rejectIssue(issueNumber: string, reason?: string) {
  const issue = getIssue(issueNumber);
  if (!issue) throw new Error('Issue not found');
  issue.status = 'rejected';
  ledger.forEach(l => {
    if (l.issueNumber === issueNumber) l.status = 'rejected';
  });
  return issue;
}

export function recordReturnAgainstIssue(issueNumber: string, materialCode: string, returnedQty: number) {
  // find ledger entry and reduce balance
  const entry = ledger.find(l => l.issueNumber === issueNumber && l.materialCode === materialCode);
  if (!entry) throw new Error('Ledger entry not found');
  entry.returnedQty = (entry.returnedQty || 0) + returnedQty;
  entry.balanceQty = Math.max(0, entry.balanceQty - returnedQty);
  // route return: if rework -> send to WIP, if scrap -> mark as damaged (mock), else back to Raw stock (mock)
  return entry;
}

export default {
  createIssue,
  listIssues,
  getIssue,
  getIssueLedger,
  approveIssue,
  rejectIssue,
  recordReturnAgainstIssue,
};
