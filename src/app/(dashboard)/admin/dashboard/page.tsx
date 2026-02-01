'use client';

/**
 * Enhanced Admin Dashboard Page
 * Main dashboard with enhanced UI and full company onboarding data integration
 */

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Typography, Alert, message, Button, Space } from 'antd';
import { UserAddOutlined } from '@ant-design/icons';
import { useAdminAuth, useCompanyData, useDashboardStats, useModal } from '../hooks/useAdmin';
import AdminLayout from '../components/AdminLayout';
import StatsCards from './components/StatsCards';
import CompaniesTable from './components/CompaniesTableEnhanced';
import CompanyDetailModal from './modals/CompanyDetailModalEnhanced';
import RejectionModal from './modals/RejectionModal';
import CreateAdminModal from '../modals/CreateAdminModal';
import { CompanyOnboardingData, AdminUser } from '../types/admin.types';
import { ROUTES } from '@/config';
import '../styles/admin.scss';

const { Content } = Layout;
const { Title } = Typography;

/**
 * Enhanced Admin Dashboard Component
 */
const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAdminAuth();
  const { 
    companies, 
    loading: companiesLoading, 
    error: companiesError,
    fetchCompanies,
    updateCompanyStatus 
  } = useCompanyData();
  const stats = useDashboardStats(companies);
  const { visible: detailVisible, data: selectedCompany, openModal: openDetailModal, closeModal: closeDetailModal } = useModal();
  const { visible: rejectVisible, data: rejectCompany, openModal: openRejectModal, closeModal: closeRejectModal } = useModal();
  
  // Create Admin Modal State
  const [createAdminVisible, setCreateAdminVisible] = useState(false);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(ROUTES.adminLogin);
    }
  }, [authLoading, isAuthenticated, router]);

  // Show nothing if not authenticated (will redirect)
  if (!isAuthenticated || authLoading) {
    return null;
  }

  // Handle view company details
  const handleViewDetails = (company: CompanyOnboardingData) => {
    openDetailModal('view', company);
  };

  // Handle approve company
  const handleApproveCompany = async (company: CompanyOnboardingData) => {
    try {
      const result = await updateCompanyStatus(company.id, 'approved', 'Application approved by admin');
      if (result.success) {
        message.success(`${company.companyName} has been approved successfully`);
        closeDetailModal();
      } else {
        message.error(result.error || 'Failed to approve application');
      }
    } catch (error) {
      message.error('An error occurred while approving the application');
    }
  };

  // Handle reject company
  const handleRejectCompany = (company: CompanyOnboardingData) => {
    openRejectModal('reject', company);
    closeDetailModal();
  };

  // Handle rejection with reason
  const handleRejectWithReason = async (companyId: string, reason: string, details?: string) => {
    try {
      const result = await updateCompanyStatus(
        companyId, 
        'rejected', 
        details || `Application rejected: ${reason}`
      );
      
      if (result.success) {
        const company = companies.find(c => c.id === companyId);
        message.success(`${company?.companyName || 'Application'} has been rejected`);
        return { success: true };
      } else {
        message.error(result.error || 'Failed to reject application');
        return { success: false, error: result.error };
      }
    } catch (error) {
      message.error('An error occurred while rejecting the application');
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Handle refresh data
  const handleRefresh = () => {
    fetchCompanies();
  };

  // Handle Create Admin Modal
  const handleOpenCreateAdmin = () => {
    setCreateAdminVisible(true);
  };

  const handleCloseCreateAdmin = () => {
    setCreateAdminVisible(false);
  };

  const handleAdminCreated = (newAdmin: AdminUser) => {
    // Handle successful admin creation
    // In a real app, you might want to refresh admin list or show notification
    console.log('New admin created:', newAdmin);
    setCreateAdminVisible(false);
  };

  return (
    <AdminLayout onRefresh={handleRefresh} loading={companiesLoading}>
      <Content className="admin-content">
        {/* Error Alert */}
        {companiesError && (
          <Alert
            message="Error Loading Data"
            description={companiesError}
            type="error"
            closable
            style={{ marginBottom: 24 }}
          />
        )}

        {/* Dashboard Header */}
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <Title level={2} style={{ margin: 0, color: 'var(--text-color)' }}>
              Company Applications Dashboard
            </Title>
            <Typography.Text type="secondary" style={{ fontSize: 16 }}>
              Manage and review company onboarding applications.
            </Typography.Text>
          </div>
          <Space>
            <Button
              type="primary"
              size="large"
              icon={<UserAddOutlined />}
              onClick={handleOpenCreateAdmin}
              className="create-admin-button"
            >
              Create Admin
            </Button>
          </Space>
        </div>

        {/* Dashboard Statistics */}
        <StatsCards stats={stats} loading={companiesLoading} />

        {/* Companies Table */}
        <CompaniesTable
          companies={companies}
          loading={companiesLoading}
          onView={handleViewDetails}
          onApprove={handleApproveCompany}
          onReject={handleRejectCompany}
          onRefresh={handleRefresh}
        />

        {/* Company Detail Modal */}
        <CompanyDetailModal
          visible={detailVisible}
          company={selectedCompany}
          onClose={closeDetailModal}
          onApprove={handleApproveCompany}
          onReject={handleRejectCompany}
        />

        {/* Rejection Modal */}
        <RejectionModal
          visible={rejectVisible}
          company={rejectCompany}
          onReject={handleRejectWithReason}
          onCancel={closeRejectModal}
        />

        {/* Create Admin Modal */}
        <CreateAdminModal
          visible={createAdminVisible}
          onClose={handleCloseCreateAdmin}
          onSuccess={handleAdminCreated}
        />
      </Content>
    </AdminLayout>
  );
};

export default AdminDashboard;
