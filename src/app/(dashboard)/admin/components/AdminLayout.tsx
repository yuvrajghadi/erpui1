'use client';

/**
 * Admin Layout Component
 * Provides header, navigation, and layout structure for admin pages
 */

import React from 'react';
import { Layout, Typography, Button, Space } from 'antd';
import { LogoutOutlined, UserOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAdminAuth } from '../hooks/useAdmin';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/config';

const { Header } = Layout;
const { Title, Text } = Typography;

interface AdminLayoutProps {
  children: React.ReactNode;
  onRefresh?: () => void;
  loading?: boolean;
}

/**
 * Admin Layout Component with Header and User Info
 */
const AdminLayout: React.FC<AdminLayoutProps> = ({ children, onRefresh, loading }) => {
  const { user, logout } = useAdminAuth();
  const router = useRouter();

  // Handle user logout
  const handleLogout = () => {
    logout();
    router.push(ROUTES.adminLogin);
  };

  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <Layout className="admin-dashboard-layout">
      {/* Header */}
      <Header className="admin-header">
        <div className="admin-header-content">
          {/* Logo */}
          <div className="admin-logo">
            <Title level={3} style={{ margin: 0, color: '#1890ff' }}>
              ERP Admin Portal
            </Title>
          </div>

          {/* User Menu */}
          <div className="admin-user-menu">
            <div className="admin-user-info">
              <div className="admin-user-avatar">
                {user ? getUserInitials(user.name) : <UserOutlined />}
              </div>
              <div>
                <div style={{ fontWeight: 500 }}>{user?.name || 'Admin'}</div>
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  {user?.role || 'Administrator'}
                </Text>
              </div>
            </div>
            
            <Space>
              {onRefresh && (
                <Button
                  icon={<ReloadOutlined />}
                  onClick={onRefresh}
                  loading={loading}
                  title="Refresh Data"
                />
              )}
              
              <Button
                type="default"
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                title="Logout"
              >
                Logout
              </Button>
            </Space>
          </div>
        </div>
      </Header>

      {/* Main Content */}
      {children}
    </Layout>
  );
};

export default AdminLayout;
