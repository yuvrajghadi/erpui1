'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layout,
  theme,
  Typography,
  Avatar,
  Badge,
  Dropdown,
  Space,
  Menu,
  Button,
  Select,
  Drawer,
  Divider,
  Tooltip,
  Tag,
  Modal,
} from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  DownOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  DownloadOutlined,
  FilterOutlined,
  GlobalOutlined,
  TeamOutlined,
  ShoppingOutlined,
  FileTextOutlined,
  QuestionCircleOutlined,
  RocketOutlined,
  CrownOutlined,
  StarOutlined,
  FireOutlined,
  TrophyOutlined,
  WalletOutlined,
  DesktopOutlined,
  InfoCircleOutlined,
  FileOutlined,
  InboxOutlined,
  UploadOutlined,
  AppstoreAddOutlined,
  FileSyncOutlined,
  FileDoneOutlined,
  ShoppingCartOutlined,
  ContainerOutlined,
  FileProtectOutlined,
  CheckSquareOutlined,
  BarsOutlined,
  MoonOutlined,
} from '@ant-design/icons';
import ThemeToggle from '@/components/ThemeToggle';

const { Header } = Layout;
const { Text, Title } = Typography;
const { useToken } = theme;
const { Option } = Select;

interface AppHeaderProps {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  isMobile: boolean;
}

// Sample Control Codes data
const controlCodes = [
  { value: '001', label: 'Control Code 001' },
  { value: '002', label: 'Control Code 002' },
  { value: '003', label: 'Control Code 003' },
];

// Sample notifications data
const notifications = [
  { id: 1, title: 'New Order Received', time: '5 min ago', priority: 'high', category: 'sales' },
  { id: 2, title: 'Inventory Alert', time: '1 hour ago', priority: 'medium', category: 'inventory' },
  { id: 3, title: 'System Update', time: '2 hours ago', priority: 'low', category: 'system' },
];

// Sample financial years data
const financialYears = [
  { value: '2023-2024', label: '12-2023 - 12-2024', daysLeft: 250 },
  { value: '2022-2023', label: '12-2022 - 12-2023', daysLeft: 0 },
  { value: '2021-2022', label: '12-2021 - 12-2022', daysLeft: 0 },
];

const AppHeader: React.FC<AppHeaderProps> = ({ 
  collapsed, 
  setCollapsed, 
  isMobile,
}) => {
  const { token } = useToken();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [currentFinancialYear, setCurrentFinancialYear] = useState(financialYears[0].value);

  const userMenu = {
    items: [
      { key: 'profile', icon: <UserOutlined />, label: 'Profile' },
      { key: 'settings', icon: <SettingOutlined />, label: 'Settings' },
      isMobile && {
        key: 'theme-switch',
        icon: <MoonOutlined />,
        label: (
          <Space style={{ width: '100%', justifyContent: 'space-between' }}>
            <span>Theme</span>
            <ThemeToggle stopPropagation />
          </Space>
        ),
      },
      { type: 'divider' },
      { key: 'logout', icon: <LogoutOutlined />, label: 'Logout', danger: true },
    ].filter(Boolean) as MenuProps['items']
  };

  const notificationModal = (
    <Modal
      title={<Title level={4} style={{ margin: 0, color: token.colorText }}>Notifications</Title>}
      open={isNotificationsOpen}
      onCancel={() => setIsNotificationsOpen(false)}
      footer={null}
      width={400}
      centered
      styles={{
        content: { backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 8, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' },
        mask: { backgroundColor: 'rgba(0, 0, 0, 0.4)' },
      }}
    >
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
        <Tag color="blue">{notifications.length} New</Tag>
        <Button type="link">Mark all as read</Button>
      </Space>
      {
        notifications.length > 0 ? (
          notifications.map((notification) => (
            <div
              key={notification.id}
              style={{
                padding: '12px 16px',
                cursor: 'pointer',
                transition: 'background-color 0.3s',
                borderLeft: `3px solid ${
                  notification.priority === 'high' ? '#ff4d4f' :
                  notification.priority === 'medium' ? '#faad14' : '#52c41a'
                }`,
                borderRadius: 4,
                marginBottom: 8,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
              }}
            >
              <Space direction="vertical" size={4} style={{ width: '100%' }}>
                <Space style={{ width: '100%', justifyContent: 'space-between' }}>
                  <Text strong>{notification.title}</Text>
                  <Tag color={
                    notification.category === 'sales' ? 'blue' :
                    notification.category === 'inventory' ? 'green' : 'purple'
                  }>
                    {notification.category}
                  </Tag>
                </Space>
                <Text type="secondary" style={{ fontSize: '12px' }}>{notification.time}</Text>
              </Space>
            </div>
          ))
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0', color: token.colorTextSecondary }}>
            No new notifications.
          </div>
        )
      }
      <Divider style={{ margin: '8px 0' }} />
      <div style={{ textAlign: 'center', padding: '8px 0' }}>
        <Button type="link">View All Notifications</Button>
      </div>
    </Modal>
  );

  return (
    <>
      <Header
        style={{
          background: 'var(--page-bg)',
          padding: isMobile ? '0 12px' : '0 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: isMobile ? 'space-between' : 'flex-end',
          height: isMobile ? 56 : 64,
          boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
          position: 'fixed',
          top: 0,
          left: isMobile ? 0 : (collapsed ? 80 : 250),
          right: 0,
          zIndex: 1000,
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: `0.5px solid ${token.colorBorder}`,
          transition: 'all 0.3s ease-in-out',
          gap: isMobile ? 8 : 16,
          flexWrap: 'nowrap',
          overflow: 'hidden',
        }}
        className="app-header-responsive"
      >
        {isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Button
              type="text"
              icon={<BarsOutlined style={{ fontSize: 18, color: token.colorText }} />}
              onClick={() => setCollapsed(!collapsed)}
              style={{ width: 36, height: 36, padding: 0 }}
            />
          </div>
        )}
        {/* Right Section - Main Actions */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 8 : 16,
          height: isMobile ? 40 : 45,
          minWidth: 0,
          flex: '0 1 auto',
        }} className="header-right-actions">
          {/* Financial Year Display */}
          {!isMobile && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', minWidth: 0 }} className="financial-year-display">
              <WalletOutlined style={{ fontSize: 20, color: token.colorPrimary, flexShrink: 0 }} />
              <Space direction="vertical" size={0} style={{ lineHeight: '1', minWidth: 0 }}>
                <Text strong style={{ fontSize: 12 }}>Financial Years</Text>
                <Select
                  value={currentFinancialYear}
                  onChange={setCurrentFinancialYear}
                  variant="borderless"
                  style={{ width: 140, padding: 0, margin: 0, height: 'auto' }}
                  popupMatchSelectWidth={false}
                  size="small"
                  options={financialYears.map(year => ({ value: year.value, label: year.label }))}
                  suffixIcon={<DownOutlined style={{ fontSize: 10, color: token.colorTextSecondary }} />}
                />
              </Space>
              {(() => {
                const selectedYear = financialYears.find(year => year.value === currentFinancialYear);
                return selectedYear && selectedYear.daysLeft > 0 && (
                  <Tooltip title={`${selectedYear.daysLeft} days left to close`}>
                    <Tag color="processing" style={{ marginLeft: 4, fontSize: 11 }}>
                      {selectedYear.daysLeft}d
                    </Tag>
                  </Tooltip>
                );
              })()}
            </div>
          )}

          {/* Notifications */}
          <Badge count={notifications.length} size="small" style={{ flexShrink: 0 }}>
            <Button
              type="text"
              icon={<BellOutlined style={{ fontSize: isMobile ? 16 : 20 }} />}
              style={{ width: isMobile ? 36 : 40, height: isMobile ? 36 : 40, padding: 0 }}
              onClick={() => setIsNotificationsOpen(true)}
              size={isMobile ? 'small' : 'middle'}
            />
          </Badge>

          {!isMobile && (
            <Space size="small" className="theme-switch-container" style={{ flexShrink: 0 }}>
              <ThemeToggle />
            </Space>
          )}

          {/* User Profile */}
          <Dropdown menu={userMenu} placement="bottomRight" trigger={['click']}>
            <div>
              <Space size={isMobile ? 4 : 8} style={{ cursor: 'pointer', minWidth: 0 }} className="user-profile-dropdown">
                <Avatar
                  icon={<UserOutlined />}
                  size={isMobile ? 32 : 40}
                  style={{
                    backgroundColor: token.colorPrimary,
                    boxShadow: '0 2px 8px rgba(24,144,255,0.15)',
                    flexShrink: 0,
                  }}
                />
                {!isMobile && (
                  <>
                    <Text strong style={{ fontSize: 13 }}>
                      Admin User
                    </Text>
                    <DownOutlined style={{ fontSize: 12 }} />
                  </>
                )}
              </Space>
            </div>
          </Dropdown>
        </div>
      </Header>
      {notificationModal}
    </>
  );
};

export default AppHeader;
