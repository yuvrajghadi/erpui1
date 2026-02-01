/**
 * Admin Dashboard Utilities
 * Helper functions for admin dashboard functionality
 */

import { CompanyOnboardingData, DashboardStats } from '../types/admin.types';

// Status color mapping for UI
export const getStatusColor = (status: CompanyOnboardingData['status']): string => {
  const statusColors = {
    pending: '#faad14', // orange
    approved: '#52c41a', // green
    rejected: '#ff4d4f', // red
    under_review: '#1890ff' // blue
  };
  return statusColors[status] || '#d9d9d9';
};

// Status text mapping
export const getStatusText = (status: CompanyOnboardingData['status']): string => {
  const statusTexts = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    under_review: 'Under Review'
  };
  return statusTexts[status] || 'Unknown';
};

// Format date for display
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Format relative time
export const formatRelativeTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInHours = Math.floor((now.getTime() - dateObj.getTime()) / (1000 * 60 * 60));
  
  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  if (diffInHours < 48) return 'Yesterday';
  return formatDate(dateObj);
};

// Calculate dashboard statistics
export const calculateDashboardStats = (companies: CompanyOnboardingData[]): DashboardStats => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

  return {
    totalApplications: companies.length,
    pendingApplications: companies.filter(c => c.status === 'pending').length,
    approvedApplications: companies.filter(c => c.status === 'approved').length,
    rejectedApplications: companies.filter(c => c.status === 'rejected').length,
    todayApplications: companies.filter(c => 
      new Date(c.submissionDate) >= today
    ).length,
    weeklyApplications: companies.filter(c => 
      new Date(c.submissionDate) >= weekAgo
    ).length,
    monthlyApplications: companies.filter(c => 
      new Date(c.submissionDate) >= monthAgo
    ).length
  };
};

// Filter companies based on filters
export const filterCompanies = (
  companies: CompanyOnboardingData[],
  filters: {
    status?: string[];
    dateRange?: [Date, Date];
    businessType?: string[];
    searchTerm?: string;
  }
): CompanyOnboardingData[] => {
  let filtered = [...companies];

  // Filter by status
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter(company => 
      filters.status!.includes(company.status)
    );
  }

  // Filter by date range
  if (filters.dateRange && filters.dateRange.length === 2) {
    const [startDate, endDate] = filters.dateRange;
    filtered = filtered.filter(company => {
      const submissionDate = new Date(company.submissionDate);
      return submissionDate >= startDate && submissionDate <= endDate;
    });
  }

  // Filter by business type
  if (filters.businessType && filters.businessType.length > 0) {
    filtered = filtered.filter(company =>
      filters.businessType!.includes(company.businessType)
    );
  }

  // Filter by search term
  if (filters.searchTerm && filters.searchTerm.trim()) {
    const searchLower = filters.searchTerm.toLowerCase();
    filtered = filtered.filter(company =>
      company.companyName.toLowerCase().includes(searchLower) ||
      company.contactEmail.toLowerCase().includes(searchLower) ||
      company.contactPerson.name.toLowerCase().includes(searchLower) ||
      company.businessType.toLowerCase().includes(searchLower)
    );
  }

  return filtered;
};

// Sort companies
export const sortCompanies = (
  companies: CompanyOnboardingData[],
  sortBy: string,
  sortOrder: 'asc' | 'desc'
): CompanyOnboardingData[] => {
  const sorted = [...companies];
  
  sorted.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy) {
      case 'companyName':
        aValue = a.companyName.toLowerCase();
        bValue = b.companyName.toLowerCase();
        break;
      case 'submissionDate':
        aValue = new Date(a.submissionDate);
        bValue = new Date(b.submissionDate);
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      case 'businessType':
        aValue = a.businessType.toLowerCase();
        bValue = b.businessType.toLowerCase();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
    if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
};

// Validate email format
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Generate mock data for development - Enhanced to match form structure
export const generateMockCompanyData = (): CompanyOnboardingData[] => {
  const firstNames = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'James', 'Anna'];
  const lastNames = ['Smith', 'Johnson', 'Brown', 'Davis', 'Miller', 'Wilson', 'Moore', 'Taylor', 'Anderson', 'Thomas'];
  const companyTypes = ['Private Limited', 'Public Limited', 'Partnership', 'LLP', 'Sole Proprietorship', 'OPC'];
  const industryTypes = ['IT', 'Finance', 'Healthcare', 'Manufacturing', 'Retail', 'Education', 'Real Estate', 'Consulting'];
  const statuses: CompanyOnboardingData['status'][] = ['pending', 'approved', 'rejected', 'under_review'];
  const planDurations = ['monthly', 'quarterly', 'semi_annual', 'annual', 'five_year'];
  const serviceOptions = ['inventory', 'accounts', 'hrms'];
  const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad'];
  const states = ['Maharashtra', 'Delhi', 'Karnataka', 'Tamil Nadu', 'Telangana', 'Gujarat', 'West Bengal'];
  
  return Array.from({ length: 50 }, (_, index) => {
    const firstName = firstNames[index % firstNames.length];
    const lastName = lastNames[index % lastNames.length];
    const companyName = `${firstName} ${lastName} Enterprises`;
    const companyEmail = `contact@${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const companyMobile = `9${String(Math.floor(Math.random() * 900000000) + 100000000)}`;
    const companyWebsite = `https://www.${companyName.toLowerCase().replace(/\s+/g, '')}.com`;
    const companyGST = `27${String.fromCharCode(65 + Math.floor(Math.random() * 26)).repeat(5)}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}A1Z${Math.floor(Math.random() * 10)}`;
    const employeeCount = Math.floor(Math.random() * 500) + 1;
    const selectedServices = serviceOptions.slice(0, Math.floor(Math.random() * 3) + 1);
    const planDuration = planDurations[index % planDurations.length];
    const status = statuses[index % statuses.length];
    
    // Calculate pricing
    const servicePricing = {
      inventory: { basePrice: 150, minPrice: 2500 },
      accounts: { basePrice: 200, minPrice: 3500 },
      hrms: { basePrice: 120, minPrice: 2000 }
    };
    
    const planDiscounts = {
      monthly: 0,
      quarterly: 5,
      semi_annual: 10,
      annual: 15,
      five_year: 25
    };
    
    let totalPrice = 0;
    const breakdown = selectedServices.map(service => {
      const price = Math.max(
        servicePricing[service as keyof typeof servicePricing].basePrice * employeeCount,
        servicePricing[service as keyof typeof servicePricing].minPrice
      );
      totalPrice += price;
      return { service, price };
    });
    
    const discount = (totalPrice * planDiscounts[planDuration as keyof typeof planDiscounts]) / 100;
    const finalPrice = totalPrice - discount;
    
    return {
      id: `company_${String(index + 1).padStart(3, '0')}`,
      
      // Personal Information
      firstName,
      lastName,
      
      // Company Information
      companyName,
      companyEmail,
      companyMobile,
      companyLandline: `022-${String(Math.floor(Math.random() * 90000000) + 10000000)}`,
      companyWebsite,
      companyGST,
      companyPAN: `${String.fromCharCode(65 + Math.floor(Math.random() * 26)).repeat(5)}${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      companyType: companyTypes[index % companyTypes.length],
      industryType: industryTypes[index % industryTypes.length],

      businessType: companyTypes[index % companyTypes.length],
      contactEmail: companyEmail,
      contactPhone: companyMobile,
      contactPerson: {
        name: `${firstName} ${lastName}`,
        designation: 'Owner',
        email: companyEmail,
        phone: companyMobile,
      },
      registrationNumber: `REG-${String(index + 1).padStart(6, '0')}`,
      taxId: companyGST,
      businessDetails: {
        yearEstablished: 2010 + (index % 14),
        industryType: industryTypes[index % industryTypes.length],
        employeeCount,
        annualRevenue: `₹${(Math.floor(Math.random() * 900) + 100).toLocaleString()}L`,
        websiteUrl: companyWebsite,
        description: `${companyName} operates in the ${industryTypes[index % industryTypes.length]} sector.`,
      },
      
      // Address Information
      companyAddress: `${Math.floor(Math.random() * 999) + 1}, Business Plaza, ${cities[index % cities.length]} Business District`,
      country: 'India',
      state: states[index % states.length],
      city: cities[index % cities.length],
      pincode: `${Math.floor(Math.random() * 900000) + 100000}`,

      address: {
        street: `${Math.floor(Math.random() * 999) + 1}, Business Plaza`,
        city: cities[index % cities.length],
        state: states[index % states.length],
        country: 'India',
        postalCode: `${Math.floor(Math.random() * 900000) + 100000}`,
      },
      
      // Service & Plan Information
      employees: employeeCount,
      planDuration,
      services: selectedServices,
      
      // System Information
      submissionDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
      status,
      adminNotes: status === 'under_review' ? 'Documents under verification' : 
                   status === 'rejected' ? 'GST verification failed' : undefined,
      rejectionReason: status === 'rejected' ? 'gst_invalid' : undefined,
      rejectionDetails: status === 'rejected' ? 'The provided GST number could not be verified with government records.' : undefined,
      processedBy: status !== 'pending' ? 'admin@erp.com' : undefined,
      processedDate: status !== 'pending' ? new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000) : undefined,
      
      // Pricing Details
      pricingDetails: {
        basePrice: totalPrice,
        totalPrice,
        discount,
        finalPrice,
        breakdown
      },

      ...(Math.random() > 0.6
        ? {
            bankDetails: {
              bankName: 'HDFC Bank',
              accountNumber: `${Math.floor(Math.random() * 9000000000) + 1000000000}`,
              routingNumber: `${Math.floor(Math.random() * 900000000) + 100000000}`,
              accountType: 'Current',
            },
          }
        : {}),
      
      documents: [
        {
          id: `doc_${index + 1}_1`,
          type: 'business_license',
          name: 'Business Registration Certificate.pdf',
          url: `/documents/business_license_${index + 1}.pdf`,
          uploadDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
          verified: Math.random() > 0.3
        },
        {
          id: `doc_${index + 1}_2`,
          type: 'tax_certificate',
          name: 'GST Registration Certificate.pdf',
          url: `/documents/gst_certificate_${index + 1}.pdf`,
          uploadDate: new Date(Date.now() - Math.random() * 10 * 24 * 60 * 60 * 1000),
          verified: Math.random() > 0.4
        }
      ]
    };
  });
};

// Export utility object
export const AdminUtils = {
  getStatusColor,
  getStatusText,
  formatDate,
  formatRelativeTime,
  calculateDashboardStats,
  filterCompanies,
  sortCompanies,
  isValidEmail,
  generateMockCompanyData
};
