'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Row, Col, Typography, Card, Button, Steps, Carousel, Space, Progress, Checkbox, Radio, Select, InputNumber, Input, message } from 'antd';
import './page.scss';
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  GlobalOutlined,
  HomeOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  FileTextOutlined,
  IdcardOutlined,
  DownOutlined,
  ContactsOutlined,
  ToolOutlined,
  ArrowLeftOutlined,
  SendOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  SafetyOutlined,
  BankOutlined,
  ShopOutlined,
  SettingOutlined,
  CalculatorOutlined,
  ShoppingCartOutlined,
  CustomerServiceOutlined,
  CalendarOutlined,
  LoadingOutlined
} from '@ant-design/icons';
import CustomInput from '@/components/ui/input';
import CommonButton from '@/components/ui/button';
import CommonStepper from '@/components/shared/stepper/stepper';
import OTPVerificationModal from '@/components/shared/modals/OTPVerificationModal';
import VerificationSuccessModal from '@/components/shared/modals/VerificationSuccessModal';
import { ROUTES } from '@/config';
// Redux imports
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  updateContactInfo,
  updateCompanyInfo,
  updateServiceInfo,
  selectFormData,
  selectIsLoading,
  selectError
} from '@/store/slices/companyOnboardingSlice';
// Custom hooks and utilities
import { useIndianStatesCities } from '@/utilities/hooks/useIndianStatesCities';

// API integration imports
import { useSubmitOnboarding } from '@/store/api/hooks/useOnboarding';
import { FormFieldMapping } from '@/store/api/schemas/onboarding';

// OTP integration imports
import { useOtpVerification } from '@/store/api/hooks/useOtpVerification';
import OTPVerification from './_components/OTPVerification';
// Form types
interface FormData {
  firstName: string;
  lastName: string;
  companyName: string;
  companyEmail: string;
  companyMobile: string;
  companyLandline?: string;
  companyGST: string;
  companyPAN?: string;
  companyType: string;
  industryType: string;
  companyAddress: string;
  country: string;
  state: string;
  city: string;
  pincode: string;
  employees: number;
  planDuration: string;
  services: string[];
  companyWebsite?: string;
}

const { Title, Text } = Typography;
const { Step } = Steps;

export default function CompanyOnboardingForm() {
  const router = useRouter();
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const isLoading = useAppSelector(selectIsLoading);
  const [currentStep, setCurrentStep] = useState(0);
  const carouselRef = useRef<any>(null);
  
  // Modal state management
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [successModalVisible, setSuccessModalVisible] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hook for onboarding submission
  const {
    mutate: submitOnboarding,
    isPending: isSubmittingAPI,
    error: submissionError
  } = useSubmitOnboarding();

  // OTP verification hook
  const {
    sendOtp,
    verifyOtp,
    updateOtpValue,
    resetOtpState,
    canSendOtp,
    canVerifyOtp,
    isLoading: isOtpLoading,
    isOtpSent,
    isOtpVerified,
    hasError: hasOtpError,
    sessionId,
    otpValue,
    error: otpError,
  } = useOtpVerification();

  // Indian States and Cities management
  const {
    stateOptions,
    cityOptions,
    selectedState,
    selectedCity,
    handleStateChange,
    handleCityChange,
    selectedStateData,
    selectedCityData
  } = useIndianStatesCities({
    defaultState: 'maharashtra', // Default to Maharashtra
    onStateChange: (stateId, stateName) => {
      console.log('🏛️ State changed:', { stateId, stateName });
      // Update form field value for state
      form.setFieldValue('state', stateName);
      // Clear city when state changes
      form.setFieldValue('city', undefined);
    },
    onCityChange: (cityId, cityName) => {
      console.log('🏙️ City changed:', { cityId, cityName });
      // Update form field value for city
      form.setFieldValue('city', cityName);
    }
  });

  // Country selection state
  const [selectedCountry, setSelectedCountry] = useState('India');

  // Form steps configuration
  const steps = [
    {
      title: 'Personal Information',
      icon: <UserOutlined />,
      description: 'Enter your personal details',
      content: 'personal'
    },
    {
      title: 'Company Information',
      icon: <HomeOutlined />,
      description: 'Company details and contact info',
      content: 'company'
    },
    {
      title: 'Email Verification',
      icon: <SafetyOutlined />,
      description: 'Verify your email address',
      content: 'otp'
    },
    {
      title: 'Address Information',
      icon: <EnvironmentOutlined />,
      description: 'Complete address details',
      content: 'address'
    },
    {
      title: 'Service & Plan',
      icon: <ToolOutlined />,
      description: 'Select services and plan',
      content: 'service'
    }
  ];

  // Carousel content for left side
  const carouselContent = [
    {
      title: "Personal Information",
      description: "Provide your personal details to get started with your account setup.",
      image: "/assets/img/personal-info.svg",
      features: ["First Name & Last Name", "Personal Contact Info", "Account Security"]
    },
    {
      title: "Company Information",
      description: "Enter your company details and business information for verification.",
      image: "/assets/img/company-info.svg",
      features: ["Company Name & Type", "GST & PAN Details", "Business Contact Info"]
    },
    {
      title: "Email Verification",
      description: "Verify your company email address to ensure secure communication.",
      image: "/assets/img/email-verification.svg",
      features: ["OTP Verification", "Email Security", "Account Protection"]
    },
    {
      title: "Address Information",
      description: "Complete address details for your company location and correspondence.",
      image: "/assets/img/address-info.svg",
      features: ["Complete Address", "Country & State", "City & Pincode"]
    },
    {
      title: "Service & Plan Selection",
      description: "Choose the services and plan that best fit your business needs.",
      image: "/assets/img/service-plan.svg",
      features: ["Service Selection", "Plan Duration", "Final Review"]
    }
  ];

  // Sync carousel with stepper on component mount and step change
  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.goTo(currentStep);
    }
  }, [currentStep]);

  // Restore form values when stepping back or navigating between steps
  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      console.log('🔄 Restoring form values on step change:', formData);
      form.setFieldsValue(formData);
    }
  }, [currentStep, form, formData]);

  // Monitor form data changes
  useEffect(() => {
    if (formData) {
      console.log('📊 Local form data updated:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        companyName: formData.companyName,
        companyEmail: formData.companyEmail
      });
    }
  }, [formData]);

  // ===== FORCE RED ASTERISKS ON ALL REQUIRED FIELDS =====
  // This effect will ensure asterisks appear regardless of CSS issues
  useEffect(() => {
    const forceAsterisks = () => {
      const requiredFields = [
        'firstName', 'lastName',
        'companyName', 'companyEmail', 'companyMobile', 'companyGST', 'companyType', 'industryType',
        'companyAddress', 'country', 'state', 'city', 'pincode',
        'employees', 'planDuration', 'services'
      ];

      requiredFields.forEach(fieldName => {
        // Find the label for this field
        const label = document.querySelector(`label[for="${fieldName}"]`);
        if (label && !label.textContent?.includes('*')) {
          // Add red asterisk if not already present
          const asterisk = document.createElement('span');
          asterisk.innerHTML = ' *';
          asterisk.style.color = '#ff4d4f';
          asterisk.style.fontWeight = 'bold';
          asterisk.style.marginLeft = '4px';
          label.appendChild(asterisk);
        }
      });

      // Also target by class
      const requiredLabels = document.querySelectorAll('.ant-form-item-required');
      requiredLabels.forEach(label => {
        if (!label.textContent?.includes('*')) {
          const asterisk = document.createElement('span');
          asterisk.innerHTML = ' *';
          asterisk.style.color = '#ff4d4f';
          asterisk.style.fontWeight = 'bold';
          asterisk.style.marginLeft = '4px';
          label.appendChild(asterisk);
        }
      });
    };

    // Run immediately
    forceAsterisks();

    // Run after form renders
    const timer1 = setTimeout(forceAsterisks, 100);
    const timer2 = setTimeout(forceAsterisks, 500);
    const timer3 = setTimeout(forceAsterisks, 1000);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [currentStep]); // Re-run when step changes

  // OTP verification wrapper to handle success callback
  const handleOtpVerification = async (providedOtpValue?: string) => {
    try {
      console.log('🔍 Starting OTP verification...');
      console.log('🔍 Provided OTP value:', providedOtpValue);
      console.log('🔍 Current hook OTP value:', otpValue);
      console.log('🔍 Current session ID:', sessionId);
      
      // Use the provided OTP value or fall back to hook's state
      const isVerified = await verifyOtp(providedOtpValue);
      if (isVerified) {
        console.log('✅ OTP verified successfully, advancing to next step');
        // Auto-advance to next step after successful verification
        setTimeout(() => {
          if (currentStep === 2) {
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            
            // Sync carousel with stepper
            if (carouselRef.current) {
              carouselRef.current.goTo(newStep);
            }
            
            console.log(`➡️ Auto-advancing to Step ${newStep + 1}: Address Information`);
          }
        }, 1000); // Small delay to show success message
      }
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
    }
  };

  // No API monitoring needed

  const handleFinish = async (values: any) => {
    console.log('🎯 ===== SUBMIT APPLICATION CLICKED =====');
    console.log('📋 Received Form Values:', values);
    
    // Use comprehensive data collection as fallback
    const comprehensiveData = getAllFormData();
    console.log('🔍 Comprehensive Form Data:', comprehensiveData);
    
    // Merge provided values with comprehensive data
    const finalData = { ...values };
    Object.keys(comprehensiveData).forEach(key => {
      if (finalData[key] === undefined || finalData[key] === null || finalData[key] === '') {
        finalData[key] = comprehensiveData[key];
      }
    });
    
    console.log('📋 Final Merged Data:', finalData);
    
    // Validate critical fields
    const criticalFields = ['companyName', 'companyEmail', 'firstName', 'lastName'];
    const missingFields = criticalFields.filter(field => !finalData[field]);
    
    if (missingFields.length > 0) {
      console.error('❌ Critical fields missing:', missingFields);
      message.error(`Missing required fields: ${missingFields.join(', ')}`);
      return;
    }
    
    try {
      // Set local form data for modals
      setFormData(finalData);
      setIsSubmitting(true);
      
      // Log mobile number validation details
      console.log('📱 Mobile Number Validation Details:');
      console.log('Raw companyMobile:', finalData.companyMobile);
      console.log('Raw companyLandline:', finalData.companyLandline);
      
      // Log plan duration and services details
      console.log('📅 Plan Duration & Services Details:');
      console.log('Selected Plan Duration:', finalData.planDuration);
      console.log('Selected Services:', finalData.services);
      
      // Validate mobile number format before API call
      const mobileRegex = /^[6-9]\d{9}$/;
      const isValidMobile = mobileRegex.test(finalData.companyMobile);
      console.log('Is companyMobile valid?', isValidMobile);
      
      if (!isValidMobile) {
        message.error('Please enter a valid 10-digit mobile number starting with 6-9');
        setIsSubmitting(false);
        return;
      }

      // Transform form data to API format using the mapping
      const apiPayload: FormFieldMapping = {
        companyName: finalData.companyName,
        companyEmail: finalData.companyEmail,
        companyAddress: finalData.companyAddress,
        companyPhone: `+91${finalData.companyMobile}`,
        country: finalData.country || 'India',
        state: finalData.state,
        city: finalData.city,
        pincode: finalData.pincode,
        numberOfEmployees: finalData.employees,
        gstNumber: finalData.companyGST,
        panNumber: finalData.companyPAN || '',
        website: finalData.companyWebsite || '',
        companyType: finalData.companyType,
        industryType: finalData.industryType,
        firstName: finalData.firstName,
        lastName: finalData.lastName,
        contactEmail: finalData.companyEmail, // Using company email as contact email
        contactPhone: `+91${finalData.companyMobile}`,
        alternatePhone: finalData.companyLandline ? `+91${finalData.companyLandline.replace(/-/g, '')}` : '',
        selectedPlan: finalData.planDuration,
        selectedServices: finalData.services || []
      };
      
      // Log the formatted phone numbers
      console.log('📞 Formatted Phone Numbers:');
      console.log('companyPhone:', apiPayload.companyPhone);
      console.log('contactPhone:', apiPayload.contactPhone);
      console.log('alternatePhone:', apiPayload.alternatePhone);
      
      console.log('🚀 API Payload:', apiPayload);
      
      // Submit to API using React Query mutation
      submitOnboarding(apiPayload, {
        onSuccess: (response) => {
          console.log('✅ API submission response:', response);
          setIsSubmitting(false);

          if (response.success && response.payload?.success) {
            setOtpModalVisible(true);
            message.success('Application submitted successfully!');
            return;
          }

          const errorMessage =
            response.error ||
            response.payload?.error ||
            response.payload?.message ||
            'An error occurred during form submission. Please try again.';

          message.error(errorMessage);
        },
        onError: (error: any) => {
          console.error('❌ API submission failed:', error);
          setIsSubmitting(false);
          
          // Handle different types of errors
          let errorMessage = 'An error occurred during form submission. Please try again.';
          
          if (error?.response?.data?.message) {
            errorMessage = error.response.data.message;
          } else if (error?.message) {
            errorMessage = error.message;
          }
          
          message.error(errorMessage);
        }
      });
      
    } catch (error) {
      console.error('❌ Error in form submission:', error);
      setIsSubmitting(false);
      message.error('An error occurred during form submission. Please try again.');
    }
  };

  const handleNext = async () => {
    try {
      // Get all current form values first (including previous steps)
      const allValues = form.getFieldsValue();
      console.log(`📊 All Form Values Before Validation:`, allValues);
      
      if (currentStep < steps.length - 1) {
        // Handle Company Information step - send OTP
        if (currentStep === 1) {
          // Company Information step - send OTP
          const stepFields = getCurrentStepFields();
          console.log(`🔍 Current Step ${currentStep + 1} Required Fields:`, stepFields);
          
          const values = await form.validateFields(stepFields);
          console.log(`✅ Step ${currentStep + 1} Validated Data:`, values);
          
          // Send OTP to company email
          const companyEmail = values.companyEmail || allValues.companyEmail;
          if (companyEmail) {
            console.log(`📧 Sending OTP to: ${companyEmail}`);
            
            try {
              // Attempt to send OTP
              await sendOtp(companyEmail);
              console.log(`✅ OTP sent successfully to: ${companyEmail}`);
            } catch (error) {
              console.log(`⚠️ OTP sending encountered an issue, but proceeding anyway:`, error);
            }
            
            // Always move to next step regardless of OTP result
            const newStep = currentStep + 1;
            setCurrentStep(newStep);
            
            // Sync carousel with stepper
            if (carouselRef.current) {
              carouselRef.current.goTo(newStep);
            }
            
            // Show success toast message
            message.success('OTP sent successfully! Please check your email.');
            console.log(`➡️ Moving to OTP Verification Step ${newStep + 1}`);
          } else {
            message.error('Company email is required to proceed');
          }
          return;
        }
        
        // Handle OTP verification step (step 2)
        if (currentStep === 2) {
          // OTP Verification step - verify OTP
          if (!isOtpVerified) {
            message.error('Please verify your email with OTP before proceeding');
            return;
          }
          
          const newStep = currentStep + 1;
          setCurrentStep(newStep);
          
          // Sync carousel with stepper
          if (carouselRef.current) {
            carouselRef.current.goTo(newStep);
          }
          
          console.log(`➡️ Moving to Step ${newStep + 1}: ${steps[newStep]?.title}`);
          return;
        }
        
        // For other non-final steps, validate only current step fields
        const stepFields = getCurrentStepFields();
        console.log(`🔍 Current Step ${currentStep + 1} Required Fields:`, stepFields);
        
        const values = await form.validateFields(stepFields);
        console.log(`✅ Step ${currentStep + 1} Validated Data:`, values);
        
        const newStep = currentStep + 1;
        setCurrentStep(newStep);
        
        // Sync carousel with stepper
        if (carouselRef.current) {
          carouselRef.current.goTo(newStep);
        }
        
        console.log(`➡️ Moving to Step ${newStep + 1}: ${steps[newStep]?.title}`);
      } else {
        // For final step (submission), validate ALL form fields and get ALL values
        console.log('🎯 Reached final step - triggering form submission');
        
        // First validate all required fields across all steps
        const allRequiredFields = [
          'firstName', 'lastName', // Step 1
          'companyName', 'companyEmail', 'companyMobile', 'companyGST', 'companyType', 'industryType', // Step 2
          'companyAddress', 'country', 'state', 'city', 'pincode', // Step 3
          'employees', 'planDuration', 'services' // Step 4
        ];
        
        console.log('🔍 Validating all required fields:', allRequiredFields);
        await form.validateFields(allRequiredFields);
        
        // Get all form values after validation
        const finalValues = form.getFieldsValue();
        console.log('📋 All Form Values After Validation:', finalValues);
        
        // Additional check to ensure we have values
        if (!finalValues.companyName || !finalValues.firstName) {
          console.error('❌ Critical values missing, forcing form re-validation');
          // Force set values and try again
          const formFields = form.getFieldsValue(true);
          console.log('🔧 Force fetched form fields:', formFields);
          handleFinish(formFields);
        } else {
          handleFinish(finalValues);
        }
      }
    } catch (error) {
      console.error('❌ Validation failed for step:', currentStep + 1, error);
      
      // If validation fails on final step, still try to get partial data for debugging
      if (currentStep === steps.length - 1) {
        const partialValues = form.getFieldsValue();
        console.log('⚠️ Partial form data on validation failure:', partialValues);
      }
    }
  };

  // Helper function to get current step required fields
  const getCurrentStepFields = () => {
    switch (currentStep) {
      case 0: // Personal Information
        return ['firstName', 'lastName'];
      case 1: // Company Information
        return ['companyName', 'companyEmail', 'companyMobile', 'companyGST', 'companyType', 'industryType'];
      case 2: // Email Verification (OTP)
        return []; // No form fields to validate, OTP verification is handled separately
      case 3: // Address Information
        return ['companyAddress', 'country', 'state', 'city', 'pincode'];
      case 4: // Service & Plan
        return ['employees', 'planDuration', 'services'];
      default:
        return [];
    }
  };

  // ===== COMPLETE LIST OF ALL REQUIRED FIELDS =====
  // This is the comprehensive list of all 16 required fields that should display red asterisks:
  // 
  // STEP 1 - Personal Information (2 fields):
  // ✅ firstName - First Name *
  // ✅ lastName - Last Name *
  // 
  // STEP 2 - Company Information (6 fields):
  // ✅ companyName - Company Name *
  // ✅ companyEmail - Company Email Address *
  // ✅ companyMobile - Company Mobile Number *
  // ✅ companyGST - Company GST Number *
  // ✅ companyType - Company Type *
  // ✅ industryType - Industry Type *
  // 
  // STEP 3 - Address Information (5 fields):
  // ✅ companyAddress - Company Address *
  // ✅ country - Country *
  // ✅ state - State *
  // ✅ city - City *
  // ✅ pincode - Pincode *
  // 
  // STEP 4 - Service & Plan (3 fields):
  // ✅ employees - Team Size *
  // ✅ planDuration - Billing Cycle *
  // ✅ services - Services *
  // 
  // TOTAL: 16 Required Fields
  // 
  // Optional Fields (no asterisk):
  // - companyLandline - Alternate Mobile Number (optional)
  // - companyWebsite - Company Website URL (optional)
  // - companyPAN - Company PAN Number (optional)
  // ===== END REQUIRED FIELDS LIST =====

  // Helper function to validate personal information
  const validatePersonalInfo = (data: any) => {
    const personalInfoFields = ['firstName', 'lastName'];
    const missingFields = personalInfoFields.filter(field => 
      !data[field] || data[field].toString().trim() === ''
    );
    
    return {
      isValid: missingFields.length === 0,
      missingFields,
      hasPartialData: personalInfoFields.some(field => 
        data[field] && data[field].toString().trim() !== ''
      )
    };
  };

  // Comprehensive form data collector
  const getAllFormData = () => {
    try {
      // Method 1: Get all field values
      const allValues = form.getFieldsValue();
      console.log('📊 Method 1 - getFieldsValue():', allValues);

      // Method 2: Get specific field values
      const specificFields = [
        'firstName', 'lastName',
        'companyName', 'companyEmail', 'companyMobile', 'companyLandline', 'companyGST', 'companyType', 'industryType',
        'companyAddress', 'country', 'state', 'city', 'pincode',
        'employees', 'planDuration', 'services'
      ];
      
      const specificValues = form.getFieldsValue(specificFields);
      console.log('📊 Method 2 - getFieldsValue(specific):', specificValues);

      // Method 3: Get individual field values
      const individualValues = {
        firstName: form.getFieldValue('firstName'),
        lastName: form.getFieldValue('lastName'),
        companyName: form.getFieldValue('companyName'),
        companyEmail: form.getFieldValue('companyEmail'),
        companyMobile: form.getFieldValue('companyMobile'),
        companyLandline: form.getFieldValue('companyLandline'),
        companyGST: form.getFieldValue('companyGST'),
        companyType: form.getFieldValue('companyType'),
        industryType: form.getFieldValue('industryType'),
        companyAddress: form.getFieldValue('companyAddress'),
        country: form.getFieldValue('country'),
        state: form.getFieldValue('state'),
        city: form.getFieldValue('city'),
        pincode: form.getFieldValue('pincode'),
        employees: form.getFieldValue('employees'),
        planDuration: form.getFieldValue('planDuration'),
        services: form.getFieldValue('services')
      };
      console.log('📊 Method 3 - individual getFieldValue:', individualValues);

      // Method 4: Get from local state (formData)
      const localStateValues = formData || {};
      console.log('📊 Method 4 - local state values:', localStateValues);

      // Combine all methods with priority: Individual > Specific > All > Local State
      // Higher priority values will override lower priority ones
      const combinedData = {
        ...localStateValues,    // Lowest priority (fallback values)
        ...allValues,          // Form.getFieldsValue() - current form state
        ...specificValues,     // Form.getFieldsValue(specificFields) - targeted fields
        ...individualValues    // Highest priority - individual field values
      };

      // Validate critical personal information fields
      const personalInfoValidation = validatePersonalInfo(combinedData);
      
      if (!personalInfoValidation.isValid) {
        console.warn('⚠️ Missing personal information fields:', personalInfoValidation.missingFields);
        
        // If we have partial data, log what we have
        if (personalInfoValidation.hasPartialData) {
          console.log('ℹ️ Partial personal information available');
        }
      } else {
        console.log('✅ Personal information validation passed');
      }

      console.log('🔍 Personal Info Verification:');
      console.log('  ➤ firstName final:', combinedData.firstName);
      console.log('  ➤ lastName final:', combinedData.lastName);
      console.log('📊 Final Combined Data:', combinedData);

      // Final validation - ensure we have at least some data
      const hasAnyData = Object.values(combinedData).some(value => 
        value !== null && value !== undefined && value !== ''
      );

      if (!hasAnyData) {
        console.warn('⚠️ No form data collected, falling back to local state');
        return formData || {};
      }

      return combinedData;
    } catch (error) {
      console.error('❌ Error collecting form data:', error);
      console.error('Error details:', error);
      
      // Fallback to local state or empty object
      const fallbackData = formData || {};
      console.log('🔄 Using fallback data:', fallbackData);
      
      return fallbackData;
    }
  };

  const handlePrevious = () => {
    const newStep = currentStep - 1;
    setCurrentStep(newStep);
    
    // Sync carousel with stepper
    if (carouselRef.current) {
      carouselRef.current.goTo(newStep);
    }
  };

  const handleOTPSuccess = () => {
    setOtpModalVisible(false);
    setSuccessModalVisible(true);
    // Simulate successful submission
    message.success('Company onboarding information submitted successfully!');
  };

  const handleOTPCancel = () => {
    setOtpModalVisible(false);
  };

  const handleSuccessModalClose = () => {
    setSuccessModalVisible(false);
  };

  const handleBackToHome = () => {
    router.push(ROUTES.home);
  };

  const handleNavigateToVerification = () => {
    setSuccessModalVisible(false);
    router.push(ROUTES.companyOnboardVerification);
  };

  // Render step content based on current step
  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="step-content">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={12}>
                <Form.Item 
                  name="firstName" 
                  label={
                    <span>
                      First Name
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'First name is required' },
                    { min: 2, message: 'First name must be at least 2 characters' },
                    { max: 50, message: 'First name cannot exceed 50 characters' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'First name can only contain letters' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter your first name" 
                    maxLength={50}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={12}>
                <Form.Item 
                  name="lastName" 
                  label={
                    <span>
                      Last Name
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Last name is required' },
                    { min: 2, message: 'Last name must be at least 2 characters' },
                    { max: 50, message: 'Last name cannot exceed 50 characters' },
                    { pattern: /^[a-zA-Z\s]+$/, message: 'Last name can only contain letters' }
                  ]}
                >
                  <Input 
                    prefix={<UserOutlined />} 
                    placeholder="Enter your last name" 
                    maxLength={50}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
        
      case 1:
        return (
          <div className="step-content">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyName" 
                  label={
                    <span>
                      Company Name
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Company name is required' },
                    { min: 2, message: 'Company name must be at least 2 characters' },
                    { max: 100, message: 'Company name cannot exceed 100 characters' }
                  ]}
                >
                  <Input 
                    prefix={<HomeOutlined />} 
                    placeholder="Enter company name" 
                    maxLength={100}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyEmail" 
                  label={
                    <span>
                      Company Email Address
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Company email is required' },
                    { type: 'email', message: 'Please enter a valid email address' },
                    { 
                      pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 
                      message: 'Please enter a valid email format' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />} 
                    placeholder="Enter company email address" 
                    type="email"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyMobile" 
                  label={
                    <span>
                      Company Mobile Number
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Company mobile number is required' },
                    { 
                      len: 10, 
                      message: 'Mobile number must be exactly 10 digits' 
                    },
                    { 
                      pattern: /^[6-9]\d{9}$/, 
                      message: 'Mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Enter 10-digit mobile number" 
                    maxLength={10}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyLandline" 
                  label="Alternate Mobile Number"
                  rules={[
                    { 
                      len: 10, 
                      message: 'Alternate mobile number must be exactly 10 digits' 
                    },
                    { 
                      pattern: /^[6-9]\d{9}$/, 
                      message: 'Alternate mobile number must start with 6, 7, 8, or 9 and be exactly 10 digits' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<PhoneOutlined />} 
                    placeholder="Enter 10-digit mobile number" 
                    size="large"
                    maxLength={10}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyWebsite" 
                  label="Company Website URL" 
                  rules={[
                    { 
                      pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/, 
                      message: 'Please enter a valid website URL' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<GlobalOutlined />} 
                    placeholder="https://www.example.com" 
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyGST" 
                  label={
                    <span>
                      Company GST Number
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Company GST number is required' },
                    { 
                      pattern: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 
                      message: 'Please enter a valid GST number' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<FileTextOutlined />} 
                    placeholder="22AAAAA0000A1Z5" 
                    maxLength={15}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyPAN" 
                  label="Company PAN Number"
                  rules={[
                    { 
                      pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 
                      message: 'Please enter a valid PAN number' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<IdcardOutlined />} 
                    placeholder="AAAAA0000A" 
                    maxLength={10}
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="companyType" 
                  label={
                    <span>
                      Company Type
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select a company type' }]}
                >
                  <Select 
                    placeholder="Select company type"
                    size="large"
                    options={[
                      { label: 'Private Limited Company', value: 'Private Limited' },
                      { label: 'Public Limited Company', value: 'Public Limited' },
                      { label: 'Partnership Firm', value: 'Partnership' },
                      { label: 'Limited Liability Partnership (LLP)', value: 'LLP' },
                      { label: 'Sole Proprietorship', value: 'Sole Proprietorship' },
                      { label: 'One Person Company (OPC)', value: 'OPC' },
                      { label: 'Section 8 Company (NGO)', value: 'Section 8' },
                      { label: 'Hindu Undivided Family (HUF)', value: 'HUF' }
                    ]}
                  />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Form.Item 
                  name="industryType" 
                  label={
                    <span>
                      Industry Type
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select an industry type' }]}
                >
                  <Select 
                    placeholder="Select industry type"
                    size="large"
                    options={[
                      { label: 'Information Technology (IT)', value: 'IT' },
                      { label: 'Financial Services', value: 'Finance' },
                      { label: 'Healthcare & Pharmaceuticals', value: 'Healthcare' },
                      { label: 'Manufacturing & Production', value: 'Manufacturing' },
                      { label: 'Retail & E-commerce', value: 'Retail' },
                      { label: 'Education & Training', value: 'Education' },
                      { label: 'Real Estate & Construction', value: 'Real Estate' },
                      { label: 'Automotive', value: 'Automotive' },
                      { label: 'Food & Beverage', value: 'Food' },
                      { label: 'Consulting Services', value: 'Consulting' },
                      { label: 'Media & Entertainment', value: 'Media' },
                      { label: 'Transportation & Logistics', value: 'Transportation' },
                      { label: 'Agriculture', value: 'Agriculture' },
                      { label: 'Telecommunications', value: 'Telecom' },
                      { label: 'Other', value: 'Other' }
                    ]}
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
        
      case 2:
        return (
          <div className="step-content">
            <OTPVerification
              email={formData?.companyEmail || form.getFieldValue('companyEmail') || ''}
              otpValue={otpValue}
              isVerifying={isOtpLoading}
              isVerified={isOtpVerified}
              error={otpError}
              onOtpChange={updateOtpValue}
              onVerifyOtp={handleOtpVerification}
              onResendOtp={sendOtp}
              title="Verify Your Email Address"
              subtitle="We've sent a verification code to your company email address"
            />
          </div>
        );
        
      case 3:
        return (
          <div className="step-content">
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Form.Item
                  name="companyAddress"
                  label={
                    <span>
                      Company Address
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Company address is required' },
                    { min: 10, message: 'Address must be at least 10 characters' },
                    { max: 500, message: 'Address cannot exceed 500 characters' }
                  ]}
                >
                  <Input.TextArea
                    placeholder="Enter complete company address"
                    maxLength={500}
                    rows={3}
                    showCount
                  />
                </Form.Item>
              </Col>
              
              {/* Location Information Helper */}
              {selectedCountry === 'India' && selectedStateData && (
                <Col xs={24}>
                  <div style={{ 
                    background: 'linear-gradient(135deg, var(--color-e6f7ff) 0%, var(--color-f0f5ff) 100%)', 
                    border: '1px solid var(--color-91d5ff)',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    marginBottom: '8px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <EnvironmentOutlined style={{ color: 'var(--color-1890ff)' }} />
                      <span style={{ fontWeight: '600', color: 'var(--color-1890ff)' }}>
                        Selected Location: {selectedStateData.name}
                      </span>
                      <span style={{ 
                        fontSize: '10px', 
                        color: 'var(--color-1890ff)', 
                        backgroundColor: 'var(--card-bg)',
                        padding: '2px 6px',
                        borderRadius: '8px',
                        border: '1px solid var(--color-91d5ff)'
                      }}>
                        {selectedStateData.type === 'state' ? 'State' : 'Union Territory'}
                      </span>
                    </div>
                    {selectedCityData && (
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                        📍 {selectedCityData.name}
                        {selectedCityData.district && ` (${selectedCityData.district} District)`}
                      </div>
                    )}
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {cityOptions.length} cities available in {selectedStateData.name}
                    </div>
                  </div>
                </Col>
              )}
              
              <Col xs={24} sm={12} md={6}>
                <Form.Item 
                  name="country" 
                  label={
                    <span>
                      Country
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[{ required: true, message: 'Please select a country' }]}
                  initialValue="India"
                >
                  <Select
                    placeholder="Select country"
                    size="large"
                    onChange={(value) => {
                      setSelectedCountry(value);
                      // Reset state and city when country changes
                      if (value !== 'India') {
                        form.setFieldValue('state', undefined);
                        form.setFieldValue('city', undefined);
                      }
                    }}
                    options={[
                      { 
                        label: (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span>🇮🇳</span>
                            <span>India</span>
                            <span style={{ 
                              fontSize: '10px', 
                              color: 'var(--color-52c41a)', 
                              backgroundColor: 'var(--color-f6ffed)',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              border: '1px solid var(--color-b7eb8f)'
                            }}>
                              Smart Form
                            </span>
                          </div>
                        ), 
                        value: 'India' 
                      },
                      { label: '🇺🇸 United States', value: 'USA' },
                      { label: '🇬🇧 United Kingdom', value: 'UK' },
                      { label: '🇨🇦 Canada', value: 'Canada' },
                      { label: '🇦🇺 Australia', value: 'Australia' },
                      { label: '🇸🇬 Singapore', value: 'Singapore' },
                      { label: '🇦🇪 United Arab Emirates', value: 'UAE' },
                      { label: '🇩🇪 Germany', value: 'Germany' },
                      { label: '🇫🇷 France', value: 'France' },
                      { label: '🌐 Other', value: 'Other' }
                    ]}
                  />
                </Form.Item>
              </Col>
              {selectedCountry === 'India' ? (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item 
                    name="state" 
                    label={
                      <span>
                        State/UT
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select a state or union territory' }
                    ]}
                  >
                    <Select
                      placeholder="Select state/UT"
                      size="large"
                      showSearch
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                      options={stateOptions.map(state => ({
                        ...state,
                        label: (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{state.label}</span>
                            <span style={{ 
                              fontSize: '10px', 
                              color: 'var(--text-muted)', 
                              backgroundColor: state.type === 'State' ? 'var(--color-e6f7ff)' : 'var(--color-fff7e6)',
                              padding: '2px 6px',
                              borderRadius: '8px',
                              border: `1px solid ${state.type === 'State' ? 'var(--color-91d5ff)' : 'var(--color-ffd591)'}`
                            }}>
                              {state.type}
                            </span>
                          </div>
                        )
                      }))}
                      onChange={(value) => {
                        handleStateChange(value);
                      }}
                      value={selectedState}
                      suffixIcon={<EnvironmentOutlined />}
                    />
                  </Form.Item>
                </Col>
              ) : (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item 
                    name="state" 
                    label={
                      <span>
                        State/Province
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'State/Province is required' },
                      { min: 2, message: 'State must be at least 2 characters' },
                      { max: 50, message: 'State cannot exceed 50 characters' }
                    ]}
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="Enter state/province" 
                      maxLength={50}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              )}
              {selectedCountry === 'India' ? (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item 
                    name="city" 
                    label={
                      <span>
                        City
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'Please select a city' }
                    ]}
                  >
                    <Select
                      placeholder={selectedState ? "Select city" : "Select state first"}
                      size="large"
                      showSearch
                      disabled={!selectedState}
                      filterOption={(input, option) =>
                        (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                      }
                      options={cityOptions.map(city => ({
                        ...city,
                        label: (
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span>{city.label}</span>
                            {city.district && (
                              <span style={{ 
                                fontSize: '10px', 
                                color: 'var(--text-muted)', 
                                backgroundColor: 'var(--table-header-bg)',
                                padding: '2px 6px',
                                borderRadius: '8px'
                              }}>
                                {city.district}
                              </span>
                            )}
                          </div>
                        )
                      }))}
                      onChange={(value) => {
                        handleCityChange(value);
                      }}
                      value={selectedCity}
                      suffixIcon={<EnvironmentOutlined />}
                      notFoundContent={
                        selectedState ? (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <EnvironmentOutlined style={{ fontSize: '24px', color: 'var(--border-color)', marginBottom: '8px' }} />
                            <div>No cities found</div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                              Try searching for a different term
                            </div>
                          </div>
                        ) : (
                          <div style={{ textAlign: 'center', padding: '20px' }}>
                            <EnvironmentOutlined style={{ fontSize: '24px', color: 'var(--border-color)', marginBottom: '8px' }} />
                            <div>Please select a state first</div>
                          </div>
                        )
                      }
                    />
                  </Form.Item>
                </Col>
              ) : (
                <Col xs={24} sm={12} md={6}>
                  <Form.Item 
                    name="city" 
                    label={
                      <span>
                        City
                        <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                      </span>
                    }
                    rules={[
                      { required: true, message: 'City is required' },
                      { min: 2, message: 'City must be at least 2 characters' },
                      { max: 50, message: 'City cannot exceed 50 characters' }
                    ]}
                  >
                    <Input 
                      prefix={<EnvironmentOutlined />} 
                      placeholder="Enter city" 
                      maxLength={50}
                      size="large"
                    />
                  </Form.Item>
                </Col>
              )}
              <Col xs={24} sm={12} md={6}>
                <Form.Item 
                  name="pincode" 
                  label={
                    <span>
                      Pincode
                      <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                    </span>
                  }
                  rules={[
                    { required: true, message: 'Pincode is required' },
                    { 
                      pattern: /^[1-9][0-9]{5}$/, 
                      message: 'Please enter a valid 6-digit pincode' 
                    }
                  ]}
                >
                  <Input 
                    prefix={<EnvironmentOutlined />} 
                    placeholder="Enter 6-digit pincode" 
                    maxLength={6}
                    size="large"
                  />
                </Form.Item>
              </Col>
            </Row>
          </div>
        );
        
      case 4:
        return (
          <div className="step-content">
            <div className="services-plan-section">
              {/* Configuration Section - One Line Layout */}
              <Row gutter={[24, 32]} className="configuration-row">
                {/* Team Size - Number Input */}
                <Col xs={24} md={8}>
                  <div className="config-container team-config">
                    <Form.Item 
                      name="employees"
                      label={
                        <span>
                          Team Size
                          <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                        </span>
                      }
                      rules={[
                        { required: true, message: 'Number of employees is required' },
                        { 
                          type: 'number', 
                          min: 1, 
                          max: 10000, 
                          message: 'Please enter a valid number between 1 and 10,000',
                          transform: (value: any) => Number(value)
                        }
                      ]}
                    >
                      <InputNumber
                        placeholder="Enter number of employees"
                        size="large"
                        min={1}
                        max={10000}
                        className="modern-input-number"
                        prefix={<TeamOutlined />}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                  </div>
                </Col>

                {/* Billing Cycle */}
                <Col xs={24} md={8}>
                  <div className="config-container billing-config">
                    <Form.Item 
                      name="planDuration"
                      label={
                        <span>
                          Billing Cycle
                          <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Please select a billing cycle' }]}
                    >
                      <Select
                        placeholder="Select billing cycle"
                        size="large"
                        className="modern-select billing-select"
                        suffixIcon={<DownOutlined />}
                        optionRender={(option) => (
                          <div className="select-option billing-option">
                            <div className="option-main">
                              <span className="option-title">{option.data.label}</span>
                              {option.data.discount > 0 && (
                                <span className="option-subtitle">Save {option.data.discount}% on total cost</span>
                              )}
                            </div>
                            {option.data.discount > 0 && (
                              <div className="option-badge">{option.data.discount}% OFF</div>
                            )}
                          </div>
                        )}
                        options={[
                          { 
                            label: '1 Month',
                            value: 'monthly',
                            months: 1,
                            discount: 0
                          },
                          { 
                            label: '3 Months',
                            value: 'quarterly',
                            months: 3,
                            discount: 5
                          },
                          { 
                            label: '6 Months',
                            value: 'semi_annual',
                            months: 6,
                            discount: 10
                          },
                          { 
                            label: '1 Year',
                            value: 'annual',
                            months: 12,
                            discount: 15
                          },
                          { 
                            label: '5 Years',
                            value: 'five_year',
                            months: 60,
                            discount: 25
                          }
                        ]}
                      />
                    </Form.Item>
                  </div>
                </Col>

                {/* Services */}
                <Col xs={24} md={8}>
                  <div className="config-container services-config">
                    <Form.Item 
                      name="services"
                      label={
                        <span>
                          Services
                          <span style={{ color: '#ff4d4f', fontWeight: 'bold', marginLeft: '4px' }}> *</span>
                        </span>
                      }
                      rules={[{ required: true, message: 'Please select at least one service' }]}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Select services"
                        size="large"
                        className="modern-select services-select"
                        suffixIcon={<DownOutlined />}
                        maxTagCount="responsive"
                        tagRender={(props) => {
                          const { label, value, closable, onClose } = props;
                          return (
                            <div className="service-tag">
                              <span className="tag-label">{label}</span>
                              {closable && (
                                <span className="tag-close" onClick={onClose}>×</span>
                              )}
                            </div>
                          );
                        }}
                        optionRender={(option) => (
                          <div className="select-option service-option">
                            <div className="service-icon">
                              {option.data.icon}
                            </div>
                            <div className="option-main">
                              <span className="option-title">{option.data.label}</span>
                              <span className="option-subtitle">₹{option.data.basePrice}/employee/month</span>
                            </div>
                            <div className="option-price">
                              Min ₹{option.data.minPrice}
                            </div>
                          </div>
                        )}
                        options={[
                          { 
                            label: 'Inventory',
                            value: 'inventory',
                            basePrice: 150,
                            minPrice: 2500,
                            icon: <ShoppingCartOutlined />
                          },
                          { 
                            label: 'Accounts',
                            value: 'accounts',
                            basePrice: 200,
                            minPrice: 3500,
                            icon: <CalculatorOutlined />
                          },
                          { 
                            label: 'HRMS',
                            value: 'hrms',
                            basePrice: 120,
                            minPrice: 2000,
                            icon: <UserOutlined />
                          }
                        ]}
                      />
                    </Form.Item>
                  </div>
                </Col>
              </Row>

              {/* Enhanced Pricing Summary Section */}
              <div className="pricing-summary-section">
                <Card className="pricing-summary-card">
                  <div className="summary-header">
                    <div className="summary-icon">
                      <CalculatorOutlined />
                    </div>
                    <div className="summary-title-section">
                      <h3 className="summary-title">Professional ERP Pricing</h3>
                      <Text className="summary-subtitle">
                        Enterprise-grade solution with transparent pricing
                      </Text>
                    </div>
                  </div>
                  
                  <div className="summary-content">
                    <Form.Item dependencies={['employees', 'planDuration', 'services']} noStyle>
                      {({ getFieldValue }) => {
                        const employees = getFieldValue('employees');
                        const planDuration = getFieldValue('planDuration');
                        const selectedServices = getFieldValue('services') || [];
                        
                        const serviceDetails = {
                          inventory: { name: 'Inventory Management', basePrice: 150, minPrice: 2500, icon: <ShoppingCartOutlined /> },
                          accounts: { name: 'Accounts & Finance', basePrice: 200, minPrice: 3500, icon: <CalculatorOutlined /> },
                          hrms: { name: 'Human Resource Management', basePrice: 120, minPrice: 2000, icon: <UserOutlined /> }
                        };
                        
                        const planDetails = {
                          monthly: { name: '1 Month', months: 1, discount: 0 },
                          quarterly: { name: '3 Months', months: 3, discount: 5 },
                          semi_annual: { name: '6 Months', months: 6, discount: 10 },
                          annual: { name: '1 Year', months: 12, discount: 15 },
                          five_year: { name: '5 Years', months: 60, discount: 25 }
                        };
                        
                        if (!employees || !planDuration || selectedServices.length === 0) {
                          return (
                            <div className="empty-state">
                              <div className="empty-icon">
                                <SettingOutlined />
                              </div>
                              <div className="empty-content">
                                <h4>Configure Your ERP Solution</h4>
                                <p>Complete the selection above to see your customized enterprise pricing</p>
                                <div className="empty-features">
                                  <div className="feature-item">
                                    <CheckCircleOutlined className="feature-icon" />
                                    <span>World-class ERP Platform</span>
                                  </div>
                                  <div className="feature-item">
                                    <CheckCircleOutlined className="feature-icon" />
                                    <span>24/7 Premium Support</span>
                                  </div>
                                  <div className="feature-item">
                                    <CheckCircleOutlined className="feature-icon" />
                                    <span>Free Implementation & Training</span>
                                  </div>
                                  <div className="feature-item">
                                    <CheckCircleOutlined className="feature-icon" />
                                    <span>Advanced Security & Compliance</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        }
                        
                        // Calculate pricing
                        const plan = planDetails[planDuration as keyof typeof planDetails];
                        let monthlyTotal = 0;
                        
                        const serviceBreakdown = selectedServices.map((service: string) => {
                          const serviceInfo = serviceDetails[service as keyof typeof serviceDetails];
                          if (!serviceInfo) return null;
                          
                          const servicePrice = Math.max(
                            serviceInfo.basePrice * employees,
                            serviceInfo.minPrice
                          );
                          monthlyTotal += servicePrice;
                          
                          return {
                            ...serviceInfo,
                            price: servicePrice
                          };
                        }).filter(Boolean);
                        
                        const subtotal = monthlyTotal * (plan?.months || 1);
                        const discountAmount = subtotal * ((plan?.discount || 0) / 100);
                        const afterDiscount = subtotal - discountAmount;
                        const gstRate = 18;
                        const gstAmount = afterDiscount * (gstRate / 100);
                        const finalTotal = afterDiscount + gstAmount;
                        
                        return (
                          <div className="pricing-breakdown">
                            {/* Configuration Summary Cards */}
                            <div className="config-summary-cards">
                              <div className="summary-card team-summary">
                                <div className="card-icon">
                                  <TeamOutlined />
                                </div>
                                <div className="card-content">
                                  <span className="card-label">Team Size</span>
                                  <span className="card-value">{employees} users</span>
                                </div>
                              </div>
                              
                              <div className="summary-card billing-summary">
                                <div className="card-icon">
                                  <CalendarOutlined />
                                </div>
                                <div className="card-content">
                                  <span className="card-label">Billing Plan</span>
                                  <span className="card-value">{plan?.name}</span>
                                  {(plan?.discount || 0) > 0 && (
                                    <span className="discount-badge">{plan?.discount}% OFF</span>
                                  )}
                                </div>
                              </div>
                              
                              <div className="summary-card services-summary">
                                <div className="card-icon">
                                  <SettingOutlined />
                                </div>
                                <div className="card-content">
                                  <span className="card-label">Modules</span>
                                  <span className="card-value">{selectedServices.length} selected</span>
                                </div>
                              </div>
                            </div>
                            
                            {/* Service Pricing Breakdown */}
                            <div className="services-pricing">
                              <h4 className="section-title">
                                <SettingOutlined className="section-icon" />
                                Module Pricing Breakdown
                              </h4>
                              <div className="services-list">
                                {serviceBreakdown.map((service: any, index: number) => (
                                  <div key={index} className="service-item">
                                    <div className="service-info">
                                      <span className="service-icon">{service.icon}</span>
                                      <div className="service-details">
                                        <span className="service-name">{service.name}</span>
                                        <span className="service-calculation">
                                          ₹{service.basePrice} × {employees} users = ₹{(service.basePrice * employees).toLocaleString('en-IN')}
                                          {service.price > (service.basePrice * employees) && (
                                            <span className="min-price"> (Min: ₹{service.minPrice.toLocaleString('en-IN')})</span>
                                          )}
                                        </span>
                                      </div>
                                    </div>
                                    <span className="service-price">₹{service.price.toLocaleString('en-IN')}/month</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                            
                            {/* Calculation Summary */}
                            <div className="calculation-section">
                              <div className="calculation-row subtotal">
                                <span className="calc-label">Monthly Subtotal:</span>
                                <span className="calc-value">₹{monthlyTotal.toLocaleString('en-IN')}</span>
                              </div>
                              <div className="calculation-row">
                                <span className="calc-label">Duration ({plan?.months} months):</span>
                                <span className="calc-value">₹{subtotal.toLocaleString('en-IN')}</span>
                              </div>
                              {(plan?.discount || 0) > 0 && (
                                <div className="calculation-row discount-row">
                                  <span className="calc-label">Plan Discount ({plan?.discount}%):</span>
                                  <span className="calc-value discount-amount">-₹{discountAmount.toLocaleString('en-IN')}</span>
                                </div>
                              )}
                              <div className="calculation-row">
                                <span className="calc-label">GST ({gstRate}%):</span>
                                <span className="calc-value">+₹{gstAmount.toLocaleString('en-IN')}</span>
                              </div>
                              
                              <div className="calculation-divider"></div>
                              
                              <div className="final-total">
                                <span className="total-label">Total Investment:</span>
                                <span className="total-amount">₹{finalTotal.toLocaleString('en-IN')}</span>
                              </div>
                              
                              <div className="pricing-note">
                                <div className="note-grid">
                                  <div className="note-item">
                                    <span className="note-label">Per User/Month:</span>
                                    <span className="note-value">
                                      ₹{Math.round(finalTotal / employees / (plan?.months || 1)).toLocaleString('en-IN')}
                                    </span>
                                  </div>
                                  <div className="note-item">
                                    <span className="note-label">Billing Period:</span>
                                    <span className="note-value">{plan?.months} month{(plan?.months || 0) > 1 ? 's' : ''}</span>
                                  </div>
                                </div>
                                {(plan?.discount || 0) > 0 && (
                                  <div className="savings-highlight">
                                    <span className="savings-icon">🎉</span>
                                    <span className="savings-text">
                                      You save ₹{discountAmount.toLocaleString('en-IN')} with {plan?.name} plan!
                                    </span>
                                  </div>
                                )}
                                <div className="enterprise-note">
                                  <span className="enterprise-badge">ENTERPRISE</span>
                                  <span className="enterprise-text">Professional ERP Solution • All taxes included</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      }}
                    </Form.Item>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <section className="company-onboarding-form">
      <div className="stepper-layout">
        <Row gutter={0} className="main-layout">
          {/* Left Side - 30% width - Carousel */}
          <Col xs={24} lg={7} xl={7} className="left-section">
            <div className="carousel-container">
              <Carousel 
                ref={carouselRef}
                initialSlide={currentStep}
                autoplay={false}
                effect="fade" 
                dots={false}
                pauseOnHover={false}
                afterChange={(current) => {
                  // Optional: sync stepper with carousel if needed
                }}
              >
                {carouselContent.map((content, index) => (
                  <div key={index} className="carousel-slide">
                    <div className="slide-content">
                      <div className="slide-header">
                        <div className="slide-icon">
                          <div className="icon-wrapper">
                            {steps[index]?.icon}
                          </div>
                        </div>
                        <Title level={2} className="slide-title">{content.title}</Title>
                        <Text className="slide-description">{content.description}</Text>
                      </div>
                      
                      <div className="slide-features">
                        {content.features.map((feature, idx) => (
                          <div key={idx} className="feature-item">
                            <CheckCircleOutlined className="feature-icon" />
                            <Text className="feature-text">{feature}</Text>
                          </div>
                        ))}
                      </div>
                      
                      <div className="slide-progress">
                        <Text className="progress-text">Step {index + 1} of {steps.length}</Text>
                        <Progress 
                          percent={((index + 1) / steps.length) * 100} 
                          showInfo={false}
                          strokeColor="#52c41a"
                          trailColor="rgba(255, 255, 255, 0.3)"
                          strokeWidth={8}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </Carousel>
            </div>
          </Col>

          {/* Right Side - 70% width - Form with Stepper */}
          <Col xs={24} lg={17} xl={17} className="right-section">
            <Card className="onboard-card">
              {/* Header */}
              <div className="company-header">
                <Title level={2} className="company-title">Company Onboarding</Title>
                <Text className="company-subtitle">Complete your registration in {steps.length} simple steps</Text>
              </div>

              {/* Steps Progress - Modern Design */}
              <div 
                className="steps-container"
                style={{
                  '--progress-width': `${((currentStep + 1) / steps.length) * 100}%`
                } as React.CSSProperties}
              >
                <div className="custom-stepper">
                  {steps.map((step, index) => (
                    <div 
                      key={index}
                      className={`stepper-item ${
                        index < currentStep ? 'completed' : 
                        index === currentStep ? 'active' : 
                        'pending'
                      }`}
                    >
                      <div className="stepper-icon-wrapper">
                        <div className="stepper-icon">
                          {index < currentStep ? (
                            <CheckCircleOutlined />
                          ) : (
                            step.icon
                          )}
                        </div>
                        {index < steps.length - 1 && (
                          <div className="stepper-line" />
                        )}
                      </div>
                      
                      <div className="stepper-content">
                        <div className="stepper-title">
                          {step.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Form */}
              <div className="form-container">
                <Form
                  form={form}
                  layout="vertical"
                  size="middle"
                  colon={false}
                  preserve={false}
                  initialValues={{
                    country: 'India',
                  }}
                  onValuesChange={(changedValues, allValues) => {
                    // Form state management for real-time updates
                    console.log('Form updated:', Object.keys(changedValues).join(', '));
                    
                    // Store values in local state for preservation across steps
                    setFormData((prev: any) => ({ ...prev, ...allValues }));
                    
                    // For personal information changes, also update Redux store immediately
                    if (changedValues.firstName || changedValues.lastName) {
                      const contactUpdates = {
                        ...(changedValues.firstName && { first_name: changedValues.firstName }),
                        ...(changedValues.lastName && { last_name: changedValues.lastName }),
                      };
                      dispatch(updateContactInfo(contactUpdates));
                      console.log('👤 Personal info updated in Redux:', contactUpdates);
                    }
                  }}
                >
                  <div className="step-content">
                    {renderStepContent()}
                  </div>
                </Form>
              </div>

              {/* Form Actions */}
              <div className="form-actions">
                <div className="actions-content">
                  {currentStep > 0 && (
                    <Button 
                      type="default" 
                      size="large" 
                      icon={<ArrowLeftOutlined />}
                      onClick={handlePrevious}
                      className="prev-button"
                    >
                      Previous
                    </Button>
                  )}
                  
                  {currentStep < steps.length - 1 ? (
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<ArrowRightOutlined />}
                      onClick={handleNext}
                      className="next-button"
                    >
                      {currentStep === 1 ? 'Send OTP' : currentStep === 2 ? 'Send' : 'Next Step'}
                    </Button>
                  ) : (
                    <Button 
                      type="primary" 
                      size="large" 
                      icon={<SendOutlined />}
                      onClick={handleNext}
                      className="submit-button"
                      loading={isSubmittingAPI || isSubmitting}
                      disabled={isSubmittingAPI || isSubmitting}
                    >
                      {(isSubmittingAPI || isSubmitting) ? 'Submitting...' : 'Submit Application'}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </div>

      {/* OTP Verification Modal */}
      <OTPVerificationModal
        visible={otpModalVisible}
        onCancel={handleOTPCancel}
        onSuccess={handleOTPSuccess}
        email={formData?.companyEmail || ''}
        companyName={formData?.companyName || ''}
      />

      {/* Success Modal */}
      <VerificationSuccessModal
        visible={successModalVisible}
        onClose={handleSuccessModalClose}
        onNavigateToVerification={handleNavigateToVerification}
        companyName={formData?.companyName || ''}
        email={formData?.companyEmail || ''}
      />
    </section>
  );
}
