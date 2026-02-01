'use client';

import React, { useState } from 'react';
import { Row, Col, Button, DatePicker, Select } from 'antd';
import { DashboardOutlined, BarChartOutlined, RiseOutlined } from '@ant-design/icons';

import { useDashboardData } from './hooks/useDashboardData';
import { DetailDrawer } from './drawer/DetailDrawer';
import { OperationalView } from './views/OperationalView';
import { DecisionView } from './views/DecisionView';
import OnboardingDashboard from '../../components/onboarding/OnboardingDashboard'; // Assuming existing path

const { RangePicker } = DatePicker;

type DashboardViewType = 'operational' | 'decision' | 'onboarding';

const InventoryDashboard: React.FC = () => {
  const [dashboardView, setDashboardView] = useState<DashboardViewType>('operational');
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState<{ title: string; type: string; data: any }>({ title: '', type: '', data: null });

  // Custom hook for all data logic
  const {
    kpiData,
    wipFunnelData,
    consumptionVsPlanData,
    agingChartData,
    topAlerts,
    todaysActions,
    riskIndicators,
    todaysCashImpact,
    totalCashAtRisk,
    leakageData,
    styleProfitRiskData,
    turnoverVelocityData,
    details
  } = useDashboardData();

  const handleOpenDrawer = (title: string, type: string, data: any) => {
    setDrawerContent({ title, type, data });
    setDetailDrawerVisible(true);
  };

  return (
    <div className="inventory-dashboard" style={{ padding: '0', background: 'var(--color-f5f5f5)' }}>
      {/* Header */}
      <Row 
        className="inventory-dashboard-header"
        gutter={[16, 16]} 
        style={{ 
          marginBottom: 20,
          padding: '16px 20px',
          background: 'var(--color-ffffff)',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          border: '1px solid var(--color-e8e8e8)',
        }}
      >
        <Col xs={24} md={12} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <Button
              type={dashboardView === 'onboarding' ? 'primary' : 'default'}
              onClick={() => setDashboardView('onboarding')}
              icon={<RiseOutlined />}
            >
              Onboarding
            </Button>
            <Button
              type={dashboardView === 'operational' ? 'primary' : 'default'}
              onClick={() => setDashboardView('operational')}
              icon={<DashboardOutlined />}
            >
              Operational Dashboard
            </Button>
            <Button
              type={dashboardView === 'decision' ? 'primary' : 'default'}
              onClick={() => setDashboardView('decision')}
              icon={<BarChartOutlined />}
            >
              Decision / Management
            </Button>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
            <RangePicker size="middle" style={{ borderRadius: 8, minWidth: 260 }} />
            <Select defaultValue="all" style={{ width: 200 }} size="middle">
              <Select.Option value="all">All Warehouses</Select.Option>
              <Select.Option value="wh1">Warehouse A</Select.Option>
              <Select.Option value="wh2">Warehouse B</Select.Option>
            </Select>
          </div>
        </Col>
      </Row>

      {/* Main Content Area */}
      {dashboardView === 'operational' ? (
        <OperationalView
          kpiData={kpiData}
          wipFunnelData={wipFunnelData}
          consumptionVsPlanData={consumptionVsPlanData}
          agingChartData={agingChartData}
          topAlerts={topAlerts}
          todaysActions={todaysActions}
          riskIndicators={riskIndicators}
          todaysCashImpact={todaysCashImpact}
          totalCashAtRisk={totalCashAtRisk}
          onAction={handleOpenDrawer}
          details={details}
        />
      ) : dashboardView === 'decision' ? (
        <DecisionView
          kpiData={kpiData}
          leakageData={leakageData}
          styleProfitRiskData={styleProfitRiskData}
          turnoverVelocityData={turnoverVelocityData}
          onAction={handleOpenDrawer}
        />
      ) : (
        <OnboardingDashboard 
            onKPIClick={handleOpenDrawer} 
            onActionClick={handleOpenDrawer} 
        />
      )}

      {/* Shared Drawer */}
      <DetailDrawer 
        visible={detailDrawerVisible} 
        content={drawerContent} 
        onClose={() => setDetailDrawerVisible(false)} 
      />
    </div>
  );
};

export default InventoryDashboard;