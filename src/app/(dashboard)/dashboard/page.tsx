'use client';

import React, { useEffect, useState } from 'react';
import { Layout, FloatButton, Row, Col } from 'antd';
import AppHeader from '@/modules/dashboard/header';
import AppContent from '@/modules/dashboard/content';
import AppFooter from '@/modules/dashboard/footer';
import Loader from '@/components/shared/loader/loader';
import AccountsDashboard from '@/modules/dashboard/accounts';
import HRPayrollDashboard from '@/modules/hr-payroll';
import Sidebar from '@/modules/dashboard/sidebar';

const AppLayout: React.FC = () => {
  const [collapsed, setCollapsed] = useState(true);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [activeModule, setActiveModule] = useState('dashboard');

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => {
      const compact = window.innerWidth <= 1024;
      setIsMobile(compact);
      if (compact) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (loading) return <Loader />;

  const renderContent = () => {
    switch (activeModule) {
      case 'hr':
        return <HRPayrollDashboard />;
      case 'dashboard':
      default:
        return (
          <div className="dashboard-content">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={18}>
                <AppContent />
              </Col>
              <Col xs={24} lg={6}>
                <AccountsDashboard />
              </Col>
            </Row>
          </div>
        );
    }
  };
  return (
    <Layout className="dashboard-container">
      <Sidebar 
        collapsed={collapsed} 
        isMobile={isMobile} 
        onModuleChange={setActiveModule}
        onMobileClose={() => setCollapsed(true)}
      />

      <Layout
        className="dashboard-layout"
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 250),
        }}
      >
        <AppHeader
          collapsed={collapsed} 
          setCollapsed={setCollapsed} 
          isMobile={isMobile}
        />
        {renderContent()}
        <AppFooter />
      </Layout>
      <FloatButton.BackTop />
    </Layout>
  );
};

export default AppLayout;
