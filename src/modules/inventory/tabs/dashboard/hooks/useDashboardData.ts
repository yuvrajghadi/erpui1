import { useState } from 'react';
import { SAMPLE_KPI } from '../../../data/sampleData';
import { 
  getFabricStockDetails, 
  getWipDetails, 
  LOW_STOCK_DETAILS, 
  DEAD_STOCK_DETAILS,
  TOP_ALERTS,
  TODAYS_ACTIONS,
  RISK_INDICATORS
} from '../constant';

export const useDashboardData = () => {
  const [kpiData] = useState(SAMPLE_KPI);

  // WIP Flow Funnel Data
  const wipFunnelData = [
    { name: 'Cutting', value: 5000, avgDays: 2, delay: 0, fill: 'var(--color-1890ff)' },
    { name: 'Stitching', value: 4200, avgDays: 5, delay: 1, fill: 'var(--color-13c2c2)' },
    { name: 'Washing', value: 3800, avgDays: 3, delay: 0, fill: 'var(--color-52c41a)' },
    { name: 'Finishing', value: 3500, avgDays: 2, delay: 0, fill: 'var(--color-faad14)' },
  ];

  // Fabric Consumption vs Plan
  const consumptionVsPlanData = [
    { month: 'Jan', planned: 2400, actual: 2200, variance: -200 },
    { month: 'Feb', planned: 2800, actual: 2850, variance: 50 },
    { month: 'Mar', planned: 3200, actual: 3100, variance: -100 },
    { month: 'Apr', planned: 2900, actual: 3200, variance: 300 },
    { month: 'May', planned: 3500, actual: 3400, variance: -100 },
    { month: 'Jun', planned: 3800, actual: 3750, variance: -50 },
  ];

  // Stock Aging for Donut
  const agingChartData = [
    { name: '0-30 Days', value: 5500, fill: 'var(--color-52c41a)' },
    { name: '31-60 Days', value: 2800, fill: 'var(--color-1890ff)' },
    { name: '60+ Days', value: 1200, fill: 'var(--color-faad14)' },
  ];

  // Leakage Heatmap Data
  const leakageData = [
    { process: 'Cutting', planned: 1000, actual: 980, loss: 2.0, color: 'var(--color-52c41a)' },
    { process: 'Stitching', planned: 980, actual: 960, loss: 2.04, color: 'var(--color-52c41a)' },
    { process: 'Washing', planned: 960, actual: 920, loss: 4.17, color: 'var(--color-faad14)' },
    { process: 'Job Work', planned: 920, actual: 880, loss: 4.35, color: 'var(--color-faad14)' },
  ];

  // Style Profit Risk Data
  const styleProfitRiskData = [
    { style: 'ST-401', fabricIssued: 1200, wipQty: 800, fgQty: 350, variance: 'High Risk', varianceColor: 'error' },
    { style: 'ST-402', fabricIssued: 950, wipQty: 600, fgQty: 320, variance: 'Medium Risk', varianceColor: 'warning' },
    { style: 'ST-403', fabricIssued: 1100, wipQty: 900, fgQty: 180, variance: 'Low Risk', varianceColor: 'success' },
    { style: 'ST-404', fabricIssued: 800, wipQty: 650, fgQty: 140, variance: 'On Track', varianceColor: 'success' },
  ];

  // Inventory Turnover Velocity
  const turnoverVelocityData = [
    { category: 'Fast-moving', value: 4500, fill: 'var(--color-52c41a)' },
    { category: 'Medium', value: 2800, fill: 'var(--color-1890ff)' },
    { category: 'Slow', value: 1200, fill: 'var(--color-faad14)' },
    { category: 'Dead Stock', value: 500, fill: 'var(--color-ff4d4f)' },
  ];

  // Today's Cash Impact
  const todaysCashImpact = {
    qcPending: 240000,
    jobWork: 180000,
    deadStock: 120000,
    shortage: 85000,
  };

  const totalCashAtRisk = Object.values(todaysCashImpact).reduce((sum, val) => sum + val, 0);

  // Drilldown Data
  const fabricStockDetails = getFabricStockDetails();
  const wipDetails = getWipDetails();

  return {
    kpiData,
    wipFunnelData,
    consumptionVsPlanData,
    agingChartData,
    topAlerts: TOP_ALERTS,
    todaysActions: TODAYS_ACTIONS,
    riskIndicators: RISK_INDICATORS,
    leakageData,
    styleProfitRiskData,
    turnoverVelocityData,
    todaysCashImpact,
    totalCashAtRisk,
    details: {
      fabricStockDetails,
      wipDetails,
      lowStockDetails: LOW_STOCK_DETAILS,
      deadStockDetails: DEAD_STOCK_DETAILS
    }
  };
};