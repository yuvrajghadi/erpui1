import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { debugLogsEnabled } from '@/config';

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

// Define the expected request schema to match frontend form data
const OnboardingRequestSchema = z.object({
  // Company Information
  companyName: z.string().min(1, 'Company name is required'),
  companyEmail: z.string().email('Invalid email format'),
  companyAddress: z.string().min(1, 'Company address is required'),
  companyPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Company mobile number must be a valid 10-digit number starting with 6-9 (format: +91XXXXXXXXXX)'),
  country: z.string().min(1, 'Country is required'),
  state: z.string().min(1, 'State is required'),
  city: z.string().min(1, 'City is required'),
  pincode: z.string().min(1, 'Pincode is required'),
  numberOfEmployees: z.number().int().min(1, 'Number of employees must be at least 1'),
  gstNumber: z.string().optional(),
  panNumber: z.string().optional(),
  website: z.string().optional(),
  companyType: z.string().min(1, 'Company type is required'),
  industryType: z.string().min(1, 'Industry type is required'),
  
  // Contact Person Information
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  contactEmail: z.string().email('Invalid contact person email'),
  contactPhone: z.string().regex(/^\+91[6-9]\d{9}$/, 'Contact mobile number must be a valid 10-digit number starting with 6-9 (format: +91XXXXXXXXXX)'),
  alternatePhone: z.string().optional().refine(
    (val) => !val || val === '' || /^\+91\d{10,11}$/.test(val), 
    { message: 'Alternate phone must be a valid phone number with +91 prefix' }
  ),
  
  // Registration and Plan Information
  selectedPlan: z.string().min(1, 'Plan selection is required'),
  selectedServices: z.array(z.number().int().min(1).max(3)).min(1, 'At least one service must be selected'),
});

// POST handler for company onboarding
export async function POST(request: NextRequest) {
  try {
    log('🚀 Received onboarding request');
    
    // Parse the request body
    const body = await request.json();
    log('📝 Request body:', JSON.stringify(body, null, 2));
    
    // Log mobile number data for debugging
    log('📱 Mobile number validation debug:');
    log('  - companyPhone:', body.companyPhone);
    log('  - contactPhone:', body.contactPhone);
    log('  - alternatePhone:', body.alternatePhone);
    
    // Test regex patterns
    const mobileRegex = /^\+91[6-9]\d{9}$/;
    log('  - companyPhone regex test:', mobileRegex.test(body.companyPhone));
    log('  - contactPhone regex test:', mobileRegex.test(body.contactPhone));
    
    // Validate the request data
    const validatedData = OnboardingRequestSchema.parse(body);
    log('✅ Data validation successful');
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate a mock company ID
    const companyId = `COMP_${Date.now()}`;
    
    // Mock successful response
    const response = {
      success: true,
      message: 'Company onboarding submitted successfully',
      data: {
        id: companyId,
        companyName: validatedData.companyName,
        status: 'pending_approval',
        next_steps: [
          'Document verification',
          'Setup meeting with account manager',
          'System configuration'
        ],
        estimated_setup_time: '5-7 business days',
        contact_person: `${validatedData.firstName} ${validatedData.lastName}`,
        services_selected: validatedData.selectedServices,
        plan_duration: validatedData.selectedPlan,
        onboarding_checklist: [
          'Upload required documents',
          'Verify email address',
          'Complete payment setup',
          'Schedule training session'
        ]
      },
      timestamp: new Date().toISOString()
    };
    
    log('✅ Sending successful response:', response);
    
    return NextResponse.json(response, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
  } catch (error) {
    console.error('❌ Onboarding API error:', error);
    
    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message
        })),
        timestamp: new Date().toISOString()
      }, { status: 400 });
    }
    
    // Handle other errors
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'Company Onboarding API is running',
    endpoint: '/erphub/onboarding_companies/onboarding-company',
    methods: ['POST'],
    timestamp: new Date().toISOString()
  });
}
