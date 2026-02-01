'use client';
import React, { useState } from 'react';
import { useDashboardData } from './hooks/useDashboardData';

// 1. Comment out all view imports for a moment
// import { OperationalView } from './views/OperationalView';
// import { DecisionView } from './views/DecisionView';
// import { DetailDrawer } from './drawer/DetailDrawer';

const InventoryDashboard: React.FC = () => {
  console.log("Rendering Dashboard...");

  // 2. Keep your state hooks
  const [dashboardView, setDashboardView] = useState('operational');
  const [detailDrawerVisible, setDetailDrawerVisible] = useState(false);
  const [drawerContent, setDrawerContent] = useState({ title: '', type: '', data: null });

  // 3. Keep your custom hook (This is the most likely suspect)
  const dashboardData = useDashboardData();

  console.log("Hooks passed successfully.");

  return (
    <div style={{ padding: 20 }}>
      <h1>Debug Mode</h1>
      <p>If you see this, the hooks in index.tsx and useDashboardData.ts are CORRECT.</p>
      
      {/* 4. Simple toggle to test re-renders */}
      <button onClick={() => setDashboardView(prev => prev === 'operational' ? 'decision' : 'operational')}>
        Current View: {dashboardView}
      </button>

      <pre>{JSON.stringify(dashboardData.kpiData, null, 2)}</pre>
    </div>
  );
};

export default InventoryDashboard;