import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { safeRequest } from '@/store/api/config/apiClient';

// Types for the form data
interface CompanyInfo {
  company_name?: string;
  company_type?: string;
  industry_type?: string;
  company_email?: string;
  company_mobile?: string;
  company_landline?: string;
  company_gst?: string;
  company_pan?: string;
  company_website?: string;
  company_address?: string;
  country?: string;
  state?: string;
  city?: string;
  pincode?: string;
  employees?: number;
}

interface ContactInfo {
  first_name?: string;
  last_name?: string;
}

interface ServiceInfo {
  services?: string[];
  plan_duration?: string;
}

interface CompanyOnboardingState {
  formData: {
    company_info: CompanyInfo;
    contact_info: ContactInfo;
    service_info: ServiceInfo;
  };
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  success: boolean;
  response: any | null;
  currentStep: number;
  completedSteps: number[];
}

// Initial state
const initialState: CompanyOnboardingState = {
  formData: {
    company_info: {},
    contact_info: {},
    service_info: {},
  },
  isLoading: false,
  isSubmitting: false,
  error: null,
  success: false,
  response: null,
  currentStep: 0,
  completedSteps: [],
};

// Async thunk for submitting onboarding request
export const submitOnboardingRequest = createAsyncThunk(
  'companyOnboarding/submit',
  async (formData: any, { rejectWithValue }) => {
    const result = await safeRequest<any>({
      method: 'post',
      url: '/api/company-onboarding',
      baseURL: '',
      data: formData,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!result.success || !result.payload) {
      return rejectWithValue(result.error || 'Failed to submit onboarding request');
    }

    return result.payload;
  }
);

// Create the slice
const companyOnboardingSlice = createSlice({
  name: 'companyOnboarding',
  initialState,
  reducers: {
    // Update company information
    updateCompanyInfo: (state, action: PayloadAction<Partial<CompanyInfo>>) => {
      state.formData.company_info = {
        ...state.formData.company_info,
        ...action.payload,
      };
    },

    // Update contact information
    updateContactInfo: (state, action: PayloadAction<Partial<ContactInfo>>) => {
      state.formData.contact_info = {
        ...state.formData.contact_info,
        ...action.payload,
      };
    },

    // Update service information
    updateServiceInfo: (state, action: PayloadAction<Partial<ServiceInfo>>) => {
      state.formData.service_info = {
        ...state.formData.service_info,
        ...action.payload,
      };
    },

    // Reset form
    resetForm: (state) => {
      state.formData = initialState.formData;
      state.error = null;
      state.success = false;
      state.response = null;
      state.currentStep = 0;
      state.completedSteps = [];
    },

    // Step management
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload;
    },

    goToNextStep: (state) => {
      if (!state.completedSteps.includes(state.currentStep)) {
        state.completedSteps.push(state.currentStep);
      }
      state.currentStep += 1;
    },

    goToPreviousStep: (state) => {
      if (state.currentStep > 0) {
        state.currentStep -= 1;
      }
    },

    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Clear success
    clearSuccess: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Submit onboarding request
      .addCase(submitOnboardingRequest.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitOnboardingRequest.fulfilled, (state, action) => {
        state.isSubmitting = false;
        state.success = true;
        state.response = action.payload;
        state.error = null;
      })
      .addCase(submitOnboardingRequest.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

// Export actions
export const {
  updateCompanyInfo,
  updateContactInfo,
  updateServiceInfo,
  resetForm,
  setCurrentStep,
  goToNextStep,
  goToPreviousStep,
  clearError,
  clearSuccess,
} = companyOnboardingSlice.actions;

// Export selectors
export const selectFormData = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.formData;

export const selectCompanyInfo = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.formData.company_info;

export const selectContactInfo = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.formData.contact_info;

export const selectServiceInfo = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.formData.service_info;

export const selectIsLoading = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.isLoading;

export const selectIsSubmitting = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.isSubmitting;

export const selectError = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.error;

export const selectSuccess = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.success;

export const selectResponse = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.response;

export const selectCurrentStep = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.currentStep;

export const selectCompletedSteps = (state: { companyOnboarding: CompanyOnboardingState }) => 
  state.companyOnboarding.completedSteps;

// Export reducer
export default companyOnboardingSlice.reducer;
