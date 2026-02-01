import React from 'react';
import DashboardClientLayout from '@/components/shared/DashboardClientLayout';

interface HRPayrollLayoutProps {
  children: React.ReactNode;
}

/**
 * Server Component Layout for HR & Payroll Module
 * Uses DashboardClientLayout for client-side interactivity
 * This prevents the entire page from deopting into client-side rendering
 */
const HRPayrollLayout: React.FC<HRPayrollLayoutProps> = ({ children }) => {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
};

export default HRPayrollLayout;
