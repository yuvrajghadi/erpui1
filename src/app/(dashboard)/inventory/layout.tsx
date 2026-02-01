import React from 'react';
import DashboardClientLayout from '@/components/shared/DashboardClientLayout';

interface InventoryLayoutProps {
  children: React.ReactNode;
}

/**
 * Server Component Layout for Inventory Module
 * Uses DashboardClientLayout for client-side interactivity
 * This prevents the entire page from deopting into client-side rendering
 */
const InventoryLayout: React.FC<InventoryLayoutProps> = ({ children }) => {
  return <DashboardClientLayout>{children}</DashboardClientLayout>;
};

export default InventoryLayout;
