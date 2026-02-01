import React from 'react';
import DashboardClientLayout from '@/components/shared/DashboardClientLayout';

interface AccountingLayoutProps {
  children: React.ReactNode;
}

/**
 * Server Component Layout for Accounting Module
 * Uses DashboardClientLayout for client-side interactivity
 * This prevents the entire page from deopting into client-side rendering
 */
const AccountingLayout: React.FC<AccountingLayoutProps> = ({ children }) => {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
};

export default AccountingLayout;
