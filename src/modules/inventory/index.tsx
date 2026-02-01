/**
 * Main Inventory Module
 * Textile & Garment ERP Inventory Management
 * Comprehensive inventory tracking from raw materials to finished goods
 */

'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { Card, Skeleton } from 'antd';
import ModuleBreadcrumb from '@/components/shared/ModuleBreadcrumb';
import { InboxOutlined } from '@ant-design/icons';
import { useSearchParams } from 'next/navigation';
import { getInventoryBreadcrumbItems, getInventorySectionKey } from '@/modules/inventory/config/menu';

// Dashboard
import InventoryDashboard from './tabs/dashboard/Dashboard';

// Masters
import FabricMaster from './tabs/masters/FabricMaster';
import QualityMaster from './tabs/masters/QualityMaster';
import WidthMaster from './tabs/masters/WidthMaster';
import DesignMaster from './tabs/masters/DesignMaster';
import GradeMaster from './tabs/masters/GradeMaster';
import TrimMaster from './tabs/masters/TrimMaster';
import WarehouseMaster from './tabs/masters/WarehouseMaster';
import SupplierMaster from './tabs/masters/SupplierMaster';
import BOMListScreen from './tabs/masters/BOMList';
import ShadeMaster from './tabs/masters/ShadeMaster';
import UOMMaster from './tabs/masters/UOMMaster';
import ProcessMaster from './tabs/masters/ProcessMaster';
import MaterialCategoryMaster from './tabs/masters/MaterialCategoryMaster';
import WarehouseZoneMaster from './tabs/masters/WarehouseZoneMaster';

// Procurement
import PurchaseRequisition from './tabs/procurement/PurchaseRequisition';
import PurchaseOrder from './tabs/procurement/PurchaseOrder';

// Inward
import FabricGRN from './tabs/inward/FabricGRN';
import TrimsGRN from './tabs/inward/TrimsGRN';
import InspectionQC from './tabs/inward/InspectionQC';

// Stock
import RawMaterialStock from './tabs/stock/RawMaterialStock';
import ReservedStock from './tabs/stock/ReservedStock';
import DamagedStock from './tabs/stock/DamagedStock';
import StockLedger from './tabs/stock/StockLedger';
import StockAdjustment from './tabs/stock/StockAdjustment';
import StockTransfer from './tabs/stock/StockTransfer';
import PhysicalCount from './tabs/stock/PhysicalCount';

// WIP
import WIPCutting from './tabs/wip/WIPCutting';
import WIPStitching from './tabs/wip/WIPStitching';
import WIPWashing from './tabs/wip/WIPWashing';
import WIPFinishing from './tabs/wip/WIPFinishing';

// Issue & Return
import IssueToCutting from './tabs/issue-return/IssueToCutting';
import ProcessTransfers from './tabs/issue-return/ProcessTransfers';
import Returns from './tabs/issue-return/Returns';

// Finished Goods
import FGStock from './tabs/finished-goods/FGStock';
import PackingEntry from './tabs/finished-goods/PackingEntry';

// Job Work
import JobWorkOutward from './tabs/job-work/JobWorkOutward';
import JobWorkInward from './tabs/job-work/JobWorkInward';

// Physical Inventory
import CycleCount from './tabs/physical-inventory/CycleCount';
import VarianceReview from './tabs/physical-inventory/VarianceReview';

// Reports - Stock
import StockSummaryReport from './tabs/reports/stock/StockSummaryReport';
import StockAgingReport from './tabs/reports/stock/StockAgingReport';
import ReservedVsAvailableReport from './tabs/reports/stock/ReservedVsAvailableReport';
import StockLedgerReport from './tabs/reports/stock/StockLedgerReport';
import ReservationAgingReport from './tabs/reports/stock/ReservationAgingReport';
import InventoryValuationSnapshotReport from './tabs/reports/stock/InventoryValuationSnapshotReport';

// Reports - Consumption
import FabricConsumptionByStyleReport from './tabs/reports/consumption/FabricConsumptionByStyleReport';
import ProcessWiseConsumptionReport from './tabs/reports/consumption/ProcessWiseConsumptionReport';

// Reports - Variance
import PhysicalInventoryVarianceReport from './tabs/reports/variance/PhysicalInventoryVarianceReport';
import GRNShortageRejectionReport from './tabs/reports/variance/GRNShortageRejectionReport';

// Reports - WIP
import WIPStatusReport from './tabs/reports/wip/WIPStatusReport';
import WIPAgingReport from './tabs/reports/wip/WIPAgingReport';
import BOMVsWIPConsumptionVarianceReport from './tabs/reports/wip/BOMVsWIPConsumptionVarianceReport';

// Reports - Job Work
import JobWorkOutstandingReport from './tabs/reports/jobwork/JobWorkOutstandingReport';
import JobWorkLossReport from './tabs/reports/jobwork/JobWorkLossReport';
import JobWorkTurnaroundTimeReport from './tabs/reports/jobwork/JobWorkTurnaroundTimeReport';

// Reports - Finished Goods
import FGStockReport from './tabs/reports/finished-goods/FGStockReport';
import DispatchSummaryReport from './tabs/reports/finished-goods/DispatchSummaryReport';
import FinishedGoodsAgingReport from './tabs/reports/finished-goods/FinishedGoodsAgingReport';

import './styles/inventory.scss';

/**
 * Inner Inventory Module content that uses useSearchParams
 * Wrapped in Suspense to prevent CSR deopt warnings
 */
const InventoryModuleContent: React.FC = () => {
  const searchParams = useSearchParams();
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const section = searchParams.get('section');
    if (section) {
      setActiveSection(section);
    } else {
      setActiveSection('dashboard');
    }
  }, [searchParams]);

  const wrapContent = (content: React.ReactNode) => (
    <div style={{ padding: '16px' }}>
      {content}
    </div>
  );

  const sectionMap: Record<string, React.ReactNode> = {
    dashboard: <InventoryDashboard />,
    masters: <QualityMaster />,
    'quality-master': <QualityMaster />,
    'width-master': <WidthMaster />,
    'design-master': <DesignMaster />,
    'grade-master': <GradeMaster />,
    'fabric-master': <FabricMaster />,
    'trim-master': <TrimMaster />,
    'warehouse-master': <WarehouseMaster />,
    'supplier-master': <SupplierMaster />,
    'shade-master': <ShadeMaster />,
    'uom-master': <UOMMaster />,
    'warehouse-zone-master': <WarehouseZoneMaster />,
    'process-master': <ProcessMaster />,
    'material-category-master': <MaterialCategoryMaster />,
    'bom-master': <BOMListScreen />,
    procurement: <PurchaseRequisition />,
    'purchase-requisition': <PurchaseRequisition />,
    'purchase-order': <PurchaseOrder />,
    inward: <FabricGRN />,
    'fabric-grn': <FabricGRN />,
    'trims-grn': <TrimsGRN />,
    'inspection-qc': <InspectionQC />,
    stock: <RawMaterialStock />,
    'raw-material-stock': <RawMaterialStock />,
    'reserved-stock': <ReservedStock />,
    'damaged-rejected': <DamagedStock />,
    'stock-ledger': <StockLedger />,
    'stock-adjustments': <StockAdjustment />,
    'stock-transfers': <StockTransfer />,
    'stock-cycle-count': <PhysicalCount />,
    wip: <WIPCutting />,
    'wip-cutting': <WIPCutting />,
    'wip-stitching': <WIPStitching />,
    'wip-washing': <WIPWashing />,
    'wip-finishing': <WIPFinishing />,
    'issue-return': <IssueToCutting />,
    'issue-to-cutting': <IssueToCutting />,
    'process-transfers': <ProcessTransfers />,
    returns: <Returns />,
    'finished-goods': <PackingEntry />,
    packing: <PackingEntry />,
    'fg-stock': <FGStock />,
    'job-work': <JobWorkOutward />,
    'job-work-outward': <JobWorkOutward />,
    'job-work-inward': <JobWorkInward />,
    'physical-inventory': <CycleCount />,
    'cycle-count': <CycleCount />,
    'variance-review': <VarianceReview />,
    reports: <StockSummaryReport />,
    'reports-stock': <StockSummaryReport />,
    'reports-stock-summary': <StockSummaryReport />,
    'reports-stock-ledger': <StockLedgerReport />,
    'reports-stock-valuation': <InventoryValuationSnapshotReport />,
    'reports-stock-aging': <StockAgingReport />,
    'reports-reserved-vs-available': <ReservedVsAvailableReport />,
    'reports-reservation-aging': <ReservationAgingReport />,
    'reports-consumption': <FabricConsumptionByStyleReport />,
    'reports-fabric-consumption': <FabricConsumptionByStyleReport />,
    'reports-process-consumption': <ProcessWiseConsumptionReport />,
    'reports-variance': <PhysicalInventoryVarianceReport />,
    'reports-physical-variance': <PhysicalInventoryVarianceReport />,
    'reports-grn-variance': <GRNShortageRejectionReport />,
    'reports-wip': <WIPStatusReport />,
    'reports-wip-status': <WIPStatusReport />,
    'reports-bom-variance': <BOMVsWIPConsumptionVarianceReport />,
    'reports-wip-aging': <WIPAgingReport />,
    'reports-jobwork': <JobWorkOutstandingReport />,
    'reports-jobwork-outstanding': <JobWorkOutstandingReport />,
    'reports-jobwork-loss': <JobWorkLossReport />,
    'reports-jobwork-tat': <JobWorkTurnaroundTimeReport />,
    'reports-finished-goods': <FGStockReport />,
    'reports-fg-stock': <FGStockReport />,
    'reports-fg-aging': <FinishedGoodsAgingReport />,
    'reports-dispatch-summary': <DispatchSummaryReport />,
  };

  const renderSection = () => {
    const content = sectionMap[activeSection];
    return wrapContent(content || <InventoryDashboard />);
  };

  return (
    <div
      className="inventory-module"
    >
      <ModuleBreadcrumb items={getInventoryBreadcrumbItems(activeSection)} />
      <div
        style={{padding: 0 }}
        // title={
        //   <div className="invn-man">
        //     <InboxOutlined style={{ fontSize: 20 }} />
        //     <span style={{ fontSize: 18, fontWeight: 600 }}>
        //       Inventory Management
        //     </span>
        //   </div>
        // }
        // style={{ margin: '16px' }}
        
      >
        {renderSection()}
      </div>
    </div>
  );
};

/**
 * Inventory Module with Suspense boundary
 * Prevents CSR deopt warnings when using useSearchParams
 */
const InventoryModule: React.FC = () => {
  return (
    <Suspense fallback={
      <div className="inventory-module" style={{ padding: 16 }}>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
        <Card>
          <Skeleton active paragraph={{ rows: 10 }} />
        </Card>
      </div>
    }>
      <InventoryModuleContent />
    </Suspense>
  );
};

export default InventoryModule;
