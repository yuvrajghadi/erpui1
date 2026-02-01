'use client';

import React, { useState, useEffect } from 'react';
import { Layout } from 'antd';
import AppHeader from '@/modules/dashboard/header';
import AppFooter from '@/modules/dashboard/footer';
import Sidebar from '@/modules/dashboard/sidebar';

const { Content } = Layout;

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

/**
 * Shared client layout component for dashboard pages
 * This component handles all client-side state management (sidebar, mobile detection)
 * Layouts that use this component can remain as server components
 */
const DashboardClientLayout: React.FC<DashboardClientLayoutProps> = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 1024;
      setIsMobile(mobile);
      if (mobile) {
        setCollapsed(true);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleModuleChange = () => {
    // Module change logic without forcing sidebar state
  };

  const handleMobileClose = () => {
    if (isMobile) {
      setCollapsed(true);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sidebar
        collapsed={collapsed}
        isMobile={isMobile}
        onModuleChange={handleModuleChange}
        onMobileClose={handleMobileClose}
      />
      <Layout
        style={{
          marginLeft: isMobile ? 0 : (collapsed ? 80 : 250),
          transition: 'all 0.3s ease-in-out'
        }}
      >
        <AppHeader
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          isMobile={isMobile}
        />
        <Content
          style={{
            padding: '24px',
            minHeight: 280,
            overflow: 'initial'
          }}
        >
          {children}
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
};

export default DashboardClientLayout;
