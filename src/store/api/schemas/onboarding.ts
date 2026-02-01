import { z } from 'zod';

// Term of plan enum
export const TermOfPlanSchema = z.enum(['1_month', '3_months', '6_months', '1_year', '2_year', '5_year']);

// Services enum (hrms=1, accounts=2, inventory=3)
export const ServicesSchema = z.array(z.number().int().min(1).max(3));

// Company onboarding form data schema
export const CompanyOnboardingFormSchema = z.object({
  // Company Information
  company_name: z.string().min(1, 'Company name is required').max(255),
  company_email: z.string().email('Invalid email format'),
  company_address: z.string().min(1, 'Company address is required'),
  company_phone_number: z.string().min(10, 'Phone number must be at least 10 digits'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  no_of_employees: z.number().int().min(1, 'Number of employees must be at least 1'),
  company_gst_no: z.string().optional(),
  company_pan_no: z.string().optional(),
  company_website: z.string().url().optional().or(z.literal('')),
  company_type: z.string().min(1, 'Company type is required'),
  industry_type: z.string().min(1, 'Industry type is required'),
  
  // Contact Person Information
  contact_person_name: z.string().min(1, 'Contact person name is required'),
  contact_person_email: z.string().email('Invalid contact person email'),
  contact_person_phone: z.string().min(10, 'Contact person phone must be at least 10 digits'),
  alternate_contact_phone: z.string().optional(),
  
  // Registration and Plan Information
  registrationDate: z.string().min(1, 'Registration date is required'),
  termOfPlan: TermOfPlanSchema,
  services: ServicesSchema.min(1, 'At least one service must be selected'),
});

// API Response schema
export const OnboardingApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    id: z.string().or(z.number()),
    company_name: z.string(),
    status: z.string().optional(),
  }).optional(),
  error: z.string().optional(),
});

// Form field mapping for transformation
export const FormFieldMappingSchema = z.object({
  // Company details from form
  companyName: z.string(),
  companyEmail: z.string(),
  companyAddress: z.string(),
  companyPhone: z.string(),
  country: z.string(),
  state: z.string(),
  city: z.string(),
  pincode: z.string(),
  numberOfEmployees: z.number(),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  website: z.string().optional(),
  companyType: z.string(),
  industryType: z.string(),
  
  // Contact person details from form
  firstName: z.string(),
  lastName: z.string(),
  contactEmail: z.string(),
  contactPhone: z.string(),
  alternatePhone: z.string().optional(),
  
  // Plan and services from form
  selectedPlan: z.string(),
  selectedServices: z.array(z.string()),
});

// Type exports
export type CompanyOnboardingFormData = z.infer<typeof CompanyOnboardingFormSchema>;
export type OnboardingApiResponse = z.infer<typeof OnboardingApiResponseSchema>;
export type FormFieldMapping = z.infer<typeof FormFieldMappingSchema>;
export type TermOfPlan = z.infer<typeof TermOfPlanSchema>;

// Service mapping from form values to API format
export const SERVICE_MAPPING = {
  'hrms': 1,        // HR Management System
  'accounts': 2,    // Accounts & Finance
  'inventory': 3    // Inventory Management
} as const;

// Plan mapping from form values to API format
export const PLAN_MAPPING = {
  'monthly': '1_month',        // 1 Month
  'quarterly': '3_months',     // 3 Months
  'semi_annual': '6_months',   // 6 Months
  'annual': '1_year',          // 1 Year
  'five_year': '5_year'        // 5 Years
} as const;

// Validation helper functions
export const validateFormData = (data: unknown): CompanyOnboardingFormData => {
  return CompanyOnboardingFormSchema.parse(data);
};

export const validateApiResponse = (data: unknown): OnboardingApiResponse => {
  return OnboardingApiResponseSchema.parse(data);
};