/**
 * Admin Dashboard Types
 * Defines TypeScript interfaces and types for the admin dashboard
 */

// Admin Login Types
export interface AdminLoginForm {
  email: string;
  password: string;
  remember?: boolean;
}

// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator';
  lastLogin?: Date;
  isActive: boolean;
}

// Types for admin creation (API format)
export interface CreateAdminForm {
  admin_username: string;
  admin_password: string;
  admin_email: string;
  status: 'active' | 'inactive';
  admin_roles: 'admin' | 'superadmin';
}

// Types for form UI (internal format)
export interface CreateAdminFormUI {
  username: string;
  password: string;
  email: string;
  status: 'active' | 'inactive';
  role: 'admin' | 'superadmin';
}

// Admin Creation Response
export interface AdminCreationResponse {
  success: boolean;
  data?: AdminUser;
  error?: string;
  message?: string;
}

// Company Onboarding Types - Enhanced to match form data
export interface CompanyOnboardingData {
  id: string;
  // Personal Information
  firstName: string;
  lastName: string;
  
  // Company Information
  companyName: string;
  companyEmail: string;
  companyMobile: string;
  companyLandline?: string;
  companyWebsite?: string;
  companyGST: string;
  companyPAN?: string;
  businessType: string;
  companyType: string;
  industryType: string;

  contactEmail: string;
  contactPhone: string;
  contactPerson: {
    name: string;
    designation?: string;
    email?: string;
    phone?: string;
  };
  registrationNumber: string;
  taxId: string;
  businessDetails: {
    yearEstablished: number | string;
    industryType: string;
    employeeCount: number;
    annualRevenue?: string;
    websiteUrl?: string;
    description: string;
  };
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
  };
  bankDetails?: {
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    accountType: string;
  };
  
  // Address Information
  companyAddress: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  
  // Service & Plan Information
  employees: number;
  planDuration: string;
  services: string[];
  
  // System Information
  submissionDate: Date;
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  adminNotes?: string;
  rejectionReason?: string;
  rejectionDetails?: string;
  processedBy?: string;
  processedDate?: Date;
  
  // Calculated pricing information
  pricingDetails?: {
    basePrice: number;
    totalPrice: number;
    discount: number;
    finalPrice: number;
    breakdown: {
      service: string;
      price: number;
    }[];
  };
  
  documents: CompanyDocument[];
}

// Document Types
export interface CompanyDocument {
  id: string;
  type: 'business_license' | 'tax_certificate' | 'bank_statement' | 'identity_proof' | 'other';
  name: string;
  url: string;
  uploadDate: Date;
  verified: boolean;
}

// Table Filter Types
export interface TableFilters {
  status?: string[];
  dateRange?: [Date, Date];
  businessType?: string[];
  searchTerm?: string;
}

// Dashboard Stats Types
export interface DashboardStats {
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
  todayApplications: number;
  weeklyApplications: number;
  monthlyApplications: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Pagination Types
export interface PaginationConfig {
  current: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  showQuickJumper: boolean;
}

// Action Types for Status Updates
export interface StatusUpdateAction {
  id: string;
  newStatus: CompanyOnboardingData['status'];
  adminNotes?: string;
  notifyCompany?: boolean;
}

// Rejection Reason Types
export interface RejectionReason {
  id: string;
  category: string;
  reason: string;
  description: string;
  requiresDetails: boolean;
}

export const REJECTION_REASONS: RejectionReason[] = [
  // Documentation Issues
  {
    id: 'doc_incomplete',
    category: 'Documentation',
    reason: 'Incomplete Documentation',
    description: 'Required documents are missing or incomplete',
    requiresDetails: true
  },
  {
    id: 'doc_invalid',
    category: 'Documentation',
    reason: 'Invalid Documents',
    description: 'Submitted documents are invalid or expired',
    requiresDetails: true
  },
  {
    id: 'doc_unclear',
    category: 'Documentation',
    reason: 'Unclear Documents',
    description: 'Documents are not clear or readable',
    requiresDetails: true
  },
  
  // Company Information Issues
  {
    id: 'company_info_invalid',
    category: 'Company Information',
    reason: 'Invalid Company Information',
    description: 'Company details provided are incorrect or cannot be verified',
    requiresDetails: true
  },
  {
    id: 'gst_invalid',
    category: 'Company Information',
    reason: 'Invalid GST Number',
    description: 'GST number is invalid or does not match company details',
    requiresDetails: false
  },
  {
    id: 'pan_invalid',
    category: 'Company Information',
    reason: 'Invalid PAN Number',
    description: 'PAN number is invalid or does not match company details',
    requiresDetails: false
  },
  
  // Business Verification Issues
  {
    id: 'business_not_verified',
    category: 'Business Verification',
    reason: 'Business Cannot Be Verified',
    description: 'Unable to verify the existence or legitimacy of the business',
    requiresDetails: true
  },
  {
    id: 'industry_not_supported',
    category: 'Business Verification',
    reason: 'Industry Not Supported',
    description: 'The business industry is not currently supported by our platform',
    requiresDetails: false
  },
  {
    id: 'business_suspended',
    category: 'Business Verification',
    reason: 'Business Suspended/Blacklisted',
    description: 'The business is suspended or blacklisted',
    requiresDetails: true
  },
  
  // Financial Issues
  {
    id: 'financial_concerns',
    category: 'Financial',
    reason: 'Financial Concerns',
    description: 'Financial stability concerns or credit issues',
    requiresDetails: true
  },
  {
    id: 'payment_history',
    category: 'Financial',
    reason: 'Poor Payment History',
    description: 'History of payment defaults or financial irregularities',
    requiresDetails: true
  },
  
  // Compliance Issues
  {
    id: 'regulatory_compliance',
    category: 'Compliance',
    reason: 'Regulatory Compliance Issues',
    description: 'Company does not meet regulatory compliance requirements',
    requiresDetails: true
  },
  {
    id: 'legal_issues',
    category: 'Compliance',
    reason: 'Legal Issues',
    description: 'Company has ongoing legal issues or disputes',
    requiresDetails: true
  },
  
  // Application Quality Issues
  {
    id: 'incomplete_application',
    category: 'Application Quality',
    reason: 'Incomplete Application',
    description: 'Application form is incomplete or has missing information',
    requiresDetails: true
  },
  {
    id: 'duplicate_application',
    category: 'Application Quality',
    reason: 'Duplicate Application',
    description: 'Company has already submitted an application',
    requiresDetails: false
  },
  {
    id: 'fraudulent_info',
    category: 'Application Quality',
    reason: 'Fraudulent Information',
    description: 'Suspected fraudulent or false information provided',
    requiresDetails: true
  },
  
  // Other
  {
    id: 'other',
    category: 'Other',
    reason: 'Other Reasons',
    description: 'Other specific reasons not covered above',
    requiresDetails: true
  }
];

// Modal Types
export interface ModalState {
  visible: boolean;
  type: 'view' | 'approve' | 'reject' | 'edit' | 'history';
  data?: CompanyOnboardingData;
}

export interface RejectionModalData {
  visible: boolean;
  companyId: string;
  companyName: string;
}

// Form State Types
export interface FormState<T> {
  data: T;
  loading: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Export combined types
export type AdminDashboardState = {
  user: AdminUser | null;
  companies: CompanyOnboardingData[];
  stats: DashboardStats;
  filters: TableFilters;
  pagination: PaginationConfig;
  loading: boolean;
  modal: ModalState;
};
