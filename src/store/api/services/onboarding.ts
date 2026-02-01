import * as Sentry from '@sentry/nextjs';
import { safeRequest, SafeApiResponse } from '../config/apiClient';
import {
  CompanyOnboardingFormData,
  OnboardingApiResponse,
  FormFieldMapping,
  validateFormData,
  validateApiResponse,
  SERVICE_MAPPING,
  PLAN_MAPPING,
} from '../schemas/onboarding';

// API endpoint
const ONBOARDING_ENDPOINT = '/erphub/onboarding_companies/onboarding-company';

/**
 * Transform form data from the component format to API format
 */
export const transformFormDataToApiFormat = (formData: FormFieldMapping): CompanyOnboardingFormData => {
  try {
    // Handle selectedServices with null check and default to empty array
    const servicesArray = formData.selectedServices || [];
    
    // Map services from string array to number array
    const mappedServices = servicesArray.map(service => {
      const serviceId = SERVICE_MAPPING[service as keyof typeof SERVICE_MAPPING];
      if (!serviceId) {
        console.warn(`Invalid service: ${service}, defaulting to hrms`);
        return 1; // Default to hrms service
      }
      return serviceId;
    });

    // Ensure at least one service is selected (default to hrms if none)
    const finalServices = mappedServices.length > 0 ? mappedServices : [1];

    // Map plan from display format to API format with null check
    console.log('📅 Plan Mapping Details:');
    console.log('Original selectedPlan:', formData.selectedPlan);
    
    const mappedPlan = PLAN_MAPPING[formData.selectedPlan as keyof typeof PLAN_MAPPING];
    console.log('Mapped plan value:', mappedPlan);
    
    if (!mappedPlan) {
      console.warn(`Invalid plan: ${formData.selectedPlan}, defaulting to 3_months`);
      // Default to 3 months if plan is invalid
      const defaultPlan = '3_months' as const;
      return transformFormDataToApiFormat({
        ...formData,
        selectedPlan: 'quarterly'
      });
    }

    // Create the API payload
    const apiPayload: CompanyOnboardingFormData = {
      // Company Information
      company_name: formData.companyName,
      company_email: formData.companyEmail,
      company_address: formData.companyAddress,
      company_phone_number: formData.companyPhone,
      country: formData.country,
      state: formData.state,
      city: formData.city,
      pincode: formData.pincode,
      no_of_employees: formData.numberOfEmployees,
      company_gst_no: formData.gstNumber || '',
      company_pan_no: formData.panNumber || '',
      company_website: formData.website || '',
      company_type: formData.companyType,
      industry_type: formData.industryType,
      
      // Contact Person Information
      contact_person_name: `${formData.firstName} ${formData.lastName}`.trim(),
      contact_person_email: formData.contactEmail,
      contact_person_phone: formData.contactPhone,
      alternate_contact_phone: formData.alternatePhone || '',
      
      // Registration and Plan Information
      registrationDate: new Date().toString(), // Current timestamp
      termOfPlan: mappedPlan,
      services: finalServices,
    };

    console.log('🚀 Final API Payload:');
    console.log('termOfPlan:', apiPayload.termOfPlan);
    console.log('services:', apiPayload.services);
    console.log('Full payload:', apiPayload);

    // Validate the transformed data
    return validateFormData(apiPayload);
  } catch (error) {
    console.error('Error transforming form data:', error);
    Sentry.captureException(error, {
      tags: { function: 'transformFormDataToApiFormat' },
      extra: { formData },
    });
    throw error;
  }
};

/**
 * Submit company onboarding data to the API
 */
export const submitCompanyOnboarding = async (
  formData: FormFieldMapping
): Promise<SafeApiResponse<OnboardingApiResponse>> => {
  console.log('Starting company onboarding submission...');

  const apiPayload = transformFormDataToApiFormat(formData);

  console.log('Transformed API payload:', apiPayload);

  Sentry.addBreadcrumb({
    message: 'Company onboarding submission started',
    level: 'info',
    data: {
      company_name: apiPayload.company_name,
      services: apiPayload.services,
      termOfPlan: apiPayload.termOfPlan,
    },
  });

  const response = await safeRequest<OnboardingApiResponse>({
    method: 'post',
    url: ONBOARDING_ENDPOINT,
    data: apiPayload,
  });

  if (!response.success || !response.payload) {
    return {
      success: false,
      payload: null,
      error: response.error || 'Company onboarding submission failed',
      status: response.status,
    };
  }

  console.log('API response received:', response.payload);

  let validatedResponse: OnboardingApiResponse;
  try {
    validatedResponse = validateApiResponse(response.payload);
  } catch (error: any) {
    return {
      success: false,
      payload: null,
      error: error?.message || 'Invalid onboarding response',
      status: response.status,
    };
  }

  Sentry.addBreadcrumb({
    message: 'Company onboarding submission successful',
    level: 'info',
    data: {
      company_name: apiPayload.company_name,
      response_status: response.status,
    },
  });

  return {
    success: true,
    payload: validatedResponse,
    status: response.status,
  };
};

/**
 * Get company onboarding status (if needed for future use)
 */
export const getOnboardingStatus = async (
  companyId: string
): Promise<SafeApiResponse<OnboardingApiResponse>> => {
  const response = await safeRequest<OnboardingApiResponse>({
    method: 'get',
    url: `${ONBOARDING_ENDPOINT}/${companyId}`,
  });

  if (!response.success || !response.payload) {
    return {
      success: false,
      payload: null,
      error: response.error || 'Failed to get onboarding status',
      status: response.status,
    };
  }

  try {
    const validated = validateApiResponse(response.payload);
    return {
      success: true,
      payload: validated,
      status: response.status,
    };
  } catch (error: any) {
    console.error('Failed to validate onboarding status:', error);
    Sentry.captureException(error, {
      tags: { function: 'getOnboardingStatus' },
      extra: { companyId },
    });
    return {
      success: false,
      payload: null,
      error: error?.message || 'Invalid onboarding status response',
      status: response.status,
    };
  }
};
