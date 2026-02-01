import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import * as Sentry from '@sentry/nextjs';
import { otpStorage } from '../storage';
import { debugLogsEnabled } from '@/config';

// Validation schema for OTP verify request
const OtpVerifySchema = z.object({
  sessionId: z.string().min(1, 'Session ID is required'),
  otp: z.string().min(4, 'OTP must be at least 4 digits').max(8, 'OTP must be at most 8 digits'),
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
    log('🔍 OTP Verify API called');

    // Parse request body
    requestBody = await request.json();
    log('📋 Request body:', requestBody);

    // Validate request data
    const validatedData = OtpVerifySchema.parse(requestBody);
    const { sessionId, otp } = validatedData;

    log(`🔑 Verifying OTP for session: ${sessionId}`);

    // Get stored OTP data
    const storedData = otpStorage.get(sessionId);

    if (!storedData) {
      log('❌ Session not found or expired');
      return NextResponse.json({
        success: false,
        message: 'Session expired or invalid. Please request a new OTP.',
        data: { verified: false },
      }, { status: 400 });
    }

    // Increment verification attempts
    const attempts = otpStorage.incrementAttempts(sessionId);

    // Check if max attempts reached
    if (otpStorage.isMaxAttemptsReached(sessionId)) {
      log('❌ Max verification attempts reached');
      return NextResponse.json({
        success: false,
        message: 'Too many failed attempts. Please request a new OTP.',
        data: { verified: false },
      }, { status: 400 });
    }

    // Verify OTP
    if (storedData.otp !== otp) {
      log(`❌ Invalid OTP (Attempt ${attempts}/3)`);
      return NextResponse.json({
        success: false,
        message: `Invalid OTP. ${3 - attempts} attempts remaining.`,
        data: { verified: false },
      }, { status: 400 });
    }

    // OTP is valid - clean up and return success
    otpStorage.remove(sessionId);
    log('✅ OTP verified successfully');

    // Log success to Sentry
    Sentry.addBreadcrumb({
      message: 'OTP verified successfully',
      level: 'info',
      data: { email: storedData.email, sessionId },
    });

    const response = {
      success: true,
      message: 'OTP verified successfully',
      data: {
        verified: true,
        sessionId,
        email: storedData.email,
      },
    };

    return NextResponse.json(response, {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });

  } catch (error: any) {
    console.error('❌ OTP Verify API error:', error);

    // Log error to Sentry
    Sentry.captureException(error, {
      tags: { api_endpoint: 'verify-otp' },
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
        data: { verified: false },
      }, { status: 400 });
    }

    // Handle other errors
    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to verify OTP',
      error: error.message,
      data: { verified: false },
    }, { status: 500 });
  }
}

// GET handler for testing
export async function GET() {
  return NextResponse.json({
    message: 'OTP Verify API is running',
    endpoint: '/erphub/otp/verify-otp',
    methods: ['POST'],
    timestamp: new Date().toISOString(),
  });
}
