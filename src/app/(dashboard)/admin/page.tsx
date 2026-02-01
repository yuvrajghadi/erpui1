'use client';

/**
 * Admin Main Page
 * Entry point for the admin portal - handles routing based on authentication status
 */

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spin } from 'antd';
import { useAdminAuth } from './hooks/useAdmin';

const AdminPage: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAdminAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/admin/login');
      }
    }
  }, [isAuthenticated, loading, router]);

  // Show loading spinner while determining authentication state
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      background: 'var(--page-bg)'
    }}>
      <Spin size="large" />
    </div>
  );
};

export default AdminPage;
