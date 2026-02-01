import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { otpStorage, generateOTP, generateSessionId, sendEmailOTP } from '../storage';
import { debugLogsEnabled } from '@/config';

// Validation schema for OTP send request
const OtpSendSchema = z.object({
  email: z.string().email('Invalid email format'),
});

export async function POST(request: NextRequest) {
  const log = (...args: unknown[]) => {
    if (!debugLogsEnabled) {
      return;
    }
    console.log(...args);
  };

  let requestBody: unknown = null;

  try {
    log('🚀 OTP Send API called');

    // Parse request body
    requestBody = await request.json();
    log('📋 Request body:', requestBody);

    // Validate request data
    const validatedData = OtpSendSchema.parse(requestBody);
    const { email } = validatedData;

    log(`📧 Sending OTP to email: ${email}`);

    // Generate OTP and session ID
    const otp = generateOTP();
    const sessionId = generateSessionId();

    // Store OTP using shared storage service
    otpStorage.store(sessionId, otp, email);

    log(`🔑 Generated OTP: ${otp} for session: ${sessionId}`);

    // Send email (simulated)
    const emailSent = await sendEmailOTP(email, otp);

    if (!emailSent) {
      throw new Error('Failed to send email');
    }

    // Log success to Sentry
    Sentry.addBreadcrumb({
      message: 'OTP sent successfully',
      level: 'info',
      data: { email, sessionId },
    });

    // Prepare response
    const response = {
      success: true,
      message: 'OTP sent successfully',
      data: {
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
    };

    log('✅ OTP sent successfully');

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Session-Id': sessionId, // Send session ID in header
      },
    });

  } catch (error: any) {
    console.error('❌ OTP Send API error:', error);

    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { api_endpoint: 'send-otp' },
      extra: { hasRequestBody: !!requestBody },
    });

    // Handle validation errors
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        message: 'Validation failed',
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
        })),
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to send OTP',
      error: error.message,
    }, { status: 500 });
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'OTP Send API is running',
    endpoint: '/erphub/otp/send-otp',
    methods: ['POST'],
    timestamp: new Date().toISOString(),
  });
}
