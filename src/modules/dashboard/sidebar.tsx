'use client';

import React, { Suspense, useEffect, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Layout, Menu, Skeleton } from 'antd';
import type { MenuProps } from 'antd';
import { BarsOutlined, DashboardOutlined, AccountBookOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { getMenuItems } from '@/modules/inventory/config/menu';
import { useTheme } from '@/theme/themeContext';

const { Sider } = Layout;

interface SidebarProps {
  collapsed: boolean;
  isMobile: boolean;
  onModuleChange: (module: string) => void;
  onMobileClose?: () => void;
}

/**
 * Inner Sidebar component that uses useSearchParams
 * Wrapped in Suspense to prevent CSR deopt
 */
const SidebarContent: React.FC<SidebarProps> = ({ collapsed, isMobile, onModuleChange, onMobileClose }) => {
  const { theme } = useTheme();
  const isDarkMode = theme === 'dark';
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedKey, setSelectedKey] = useState<string>('dashboard');

  const isInventoryRoute = pathname.startsWith('/inventory');

  const moduleRoutes = [
    {
      key: 'inventory',
      icon: <BarsOutlined />,
      label: 'Inventory',
      path: '/inventory',
      module: 'inventory',
    },
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Dashboard',
      path: '/dashboard',
      module: 'dashboard',
    },
    {
      key: 'accounting',
      icon: <AccountBookOutlined />,
      label: 'Accounting',
      path: '/accounting',
      module: 'accounting',
    },
    {
      key: 'hr',
      icon: <UserSwitchOutlined />,
      label: 'HR/Payroll',
      path: '/hr-payroll',
      module: 'hr',
    },
  ];

  const moduleMenuItems: MenuProps['items'] = moduleRoutes.map((item) => ({
    key: item.key,
    icon: item.icon,
    label: item.label,
  }));

  const inventoryMenuItems: MenuProps['items'] = getMenuItems();

  useEffect(() => {
    if (isInventoryRoute) {
      const section = searchParams.get('section') || 'dashboard';
      setSelectedKey(section);
    } else if (pathname.includes('/inventory')) {
      setSelectedKey('inventory');
    } else if (pathname.includes('/accounting')) {
      setSelectedKey('accounting');
    } else if (pathname.includes('/hr-payroll')) {
      setSelectedKey('hr');
    } else {
      setSelectedKey('dashboard');
    }
  }, [isInventoryRoute, pathname, searchParams]);

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (isInventoryRoute) {
      const sectionKey = String(key);
      setSelectedKey(sectionKey);
      onModuleChange('inventory');
      router.push(`/inventory?section=${sectionKey}`);
      if (isMobile) onMobileClose?.();
      return;
    }

    const target = moduleRoutes.find((item) => item.key === key);
    if (!target) return;
    setSelectedKey(target.key);
    onModuleChange(target.module);
    router.push(target.path);
    if (isMobile) onMobileClose?.();
  };

  const menuItems = isInventoryRoute ? inventoryMenuItems : moduleMenuItems;

  const titleText = isInventoryRoute ? 'Inventory' : 'Modules';

  const sidebarBackground = 'var(--sidebar-bg)';
  const sidebarSurface = isDarkMode ? 'var(--page-bg)' : 'var(--sidebar-bg)';
  const sidebarBlur = isDarkMode ? 'blur(28px)' : undefined;

  return (
    <>
      <style jsx global>{`
        .custom-sidebar-menu .ant-menu-item,
        .custom-sidebar-menu .ant-menu-submenu-title {
          height: auto !important;
          min-height: 56px !important;
          padding: 0 !important;
          display: flex !important;
          flex-direction: column !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center;
          margin-bottom: 4px !important;
          border-radius: 8px !important;
          color: var(--sidebar-text) !important;
        }
        
        .custom-sidebar-menu .ant-menu-item .ant-menu-item-icon,
        .custom-sidebar-menu .ant-menu-submenu-title .ant-menu-item-icon {
          font-size: 20px !important;
          margin-bottom: 4px !important;
          min-width: 0 !important;
          display: flex !important;
          align-items: center;
          justify-content: center;
          color: var(--sidebar-text) !important;
        }

        .custom-sidebar-menu .ant-menu-item .ant-menu-title-content,
        .custom-sidebar-menu .ant-menu-submenu-title .ant-menu-title-content {
          margin-inline-start: 0 !important;
          font-size: 11px !important;
          line-height: 1.2 !important;
          white-space: normal !important;
          display: block !important;
          opacity: 1 !important;
          font-weight: 500;
        }
        
        .custom-sidebar-menu .ant-menu-item-selected,
        .custom-sidebar-menu .ant-menu-submenu-selected > .ant-menu-submenu-title {
          background-color: var(--sidebar-active-bg) !important;
          color: var(--sidebar-active-text) !important;
          margin: 0 auto;
        }

        .custom-sidebar-menu .ant-menu-item-selected .ant-menu-item-icon,
        .custom-sidebar-menu .ant-menu-submenu-selected .ant-menu-item-icon {
          color: var(--sidebar-active-text) !important;
        }

        .custom-sidebar-menu {
          background: var(--page-bg) !important;
        }

        .custom-sidebar-menu.ant-menu-vertical .ant-menu-submenu-arrow {
          display: none;
        }

        .ant-menu-inline-collapsed-tooltip {
          display: none !important;
        }

        .ant-menu-submenu-popup {
          border-radius: 8px;
          overflow: hidden;
        }

        .ant-menu-submenu-popup .ant-menu {
          background-color: var(--page-bg) !important;
          color: var(--popup-text) !important;
          border: 1px solid var(--border-color);
          box-shadow: var(--popup-shadow);
        }

        .ant-menu-submenu-popup .ant-menu-item-selected {
          background-color: var(--sidebar-active-bg) !important;
          color: var(--sidebar-active-text) !important;
        }
      `}</style>
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        theme={isDarkMode ? 'dark' : 'light'}
        width={isMobile ? 120 : 100}
        collapsedWidth={isMobile ? 0 : 80}
        style={{
          transition: 'all 0.3s ease-in-out',
          height: '100vh',
          minHeight: '100vh',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: isMobile && !collapsed ? 1100 : 1000,
          overflowX: 'hidden',
          position: 'fixed',
          boxShadow: 'var(--sidebar-shadow)',
          background: sidebarBackground,
          backgroundColor: sidebarSurface,
          backdropFilter: sidebarBlur,
          WebkitBackdropFilter: sidebarBlur,
          borderRight: isDarkMode ? '0.5px solid rgba(255, 255, 255, 0.12)' : '0.5px solid rgba(5, 5, 5, 0.06)',
        }}
        className={`sidebar ${isMobile ? 'mobile' : ''}`}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            paddingTop: 8,
            paddingBottom: 8,
          }}
        >
          <div
            className="logo"
            role="button"
            tabIndex={0}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              height: 44,
              borderRadius: 8,
              color: 'var(--sidebar-text)',
              fontWeight: 700,
              background: 'var(--sidebar-logo-bg)',
              boxShadow: '0 2px 8px rgba(5, 30, 70, 0.12)',
              cursor: 'pointer',
              width: 44,
            }}
            onClick={() => router.push('/dashboard')}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                router.push('/dashboard');
              }
            }}
          >
            <span className="brand-text" style={{ fontSize: 16 }}>OG</span>
          </div>

          {!collapsed && (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
              <div
                style={{
                  background: 'var(--sidebar-label-bg)',
                  padding: '4px 8px',
                  borderRadius: 6,
                  color: 'var(--sidebar-text)',
                  fontWeight: 600,
                  fontSize: 11,
                }}
              >
                {titleText}
              </div>
            </div>
          )}
        </div>

        <Menu
          theme={isDarkMode ? 'dark' : 'light'}
          mode={isInventoryRoute ? 'vertical' : 'inline'}
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={handleMenuClick}
          triggerSubMenuAction="hover"
          className="custom-sidebar-menu"
          style={{
            borderInlineEnd: 'none',
            padding: '0',
          }}
        />
      </Sider>
    </>
  );
};

/**
 * Sidebar component with Suspense boundary
 * Prevents CSR deopt warnings when using useSearchParams
 */
const Sidebar: React.FC<SidebarProps> = (props) => {
  return (
    <Suspense fallback={
      <Sider
        width={props.collapsed ? 80 : 250}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
        }}
      >
        <Skeleton active paragraph={{ rows: 8 }} style={{ padding: 16 }} />
      </Sider>
    }>
      <SidebarContent {...props} />
    </Suspense>
  );
};

export default Sidebar;
