import * as Sentry from '@sentry/nextjs';
import { safeRequest, safeRequestWithHeaders, SafeApiResponse } from '../config/apiClient';
import { debugLogsEnabled } from '@/config';

// OTP API endpoints
const OTP_SEND_ENDPOINT = '/erphub/otp/send-otp';
const OTP_VERIFY_ENDPOINT = '/erphub/otp/verify-otp';

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

const warn = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.warn(...args);
};

// Type definitions for OTP operations
export interface OtpSendRequest {
  email: string;
}

export interface OtpSendResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  session_id?: string;
  data?: {
    sessionId?: string;
    session_id?: string;
    expiresAt?: string;
  };
}

export interface OtpVerifyRequest {
  sessionId: string;
  otp: string;
}

export interface OtpVerifyResponse {
  success: boolean;
  message: string;
  data?: {
    verified: boolean;
    sessionId?: string;
  };
}

/**
 * Send OTP to the provided email address
 * @param email - Company email address
 * @returns Promise with OTP send response and session ID from headers
 */
export const sendOtp = async (
  email: string
): Promise<SafeApiResponse<{ response: OtpSendResponse; sessionId: string | null }>> => {
  log('🚀 Sending OTP to email:', email);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return {
      success: false,
      payload: null,
      error: 'Invalid email format',
    };
  }

  const payload: OtpSendRequest = { email };

  Sentry.addBreadcrumb({
    message: 'OTP send request initiated',
    level: 'info',
    data: { email },
  });

  const apiResponse = await safeRequestWithHeaders<OtpSendResponse>({
    method: 'post',
    url: OTP_SEND_ENDPOINT,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!apiResponse.success || !apiResponse.payload) {
    return {
      success: false,
      payload: null,
      error: apiResponse.error || 'Failed to send OTP',
      status: apiResponse.status,
    };
  }

  const responseData = apiResponse.payload.data;
  if (!responseData) {
    return {
      success: false,
      payload: null,
      error: 'Empty OTP response payload',
      status: apiResponse.status,
    };
  }

  const headers = apiResponse.payload.headers || {};
  let sessionId =
    headers['session-id'] ||
    headers['Session-Id'] ||
    headers['sessionid'] ||
    headers['SessionId'] ||
    headers['sessionId'] ||
    null;

  if (!sessionId) {
    if (responseData.data?.sessionId) {
      sessionId = responseData.data.sessionId;
    } else if (responseData.sessionId) {
      sessionId = responseData.sessionId;
    } else if (responseData.data?.session_id) {
      sessionId = responseData.data.session_id;
    } else if (responseData.session_id) {
      sessionId = responseData.session_id;
    }
  }

  log('✅ OTP sent successfully');
  log('🔍 Full API Response:', JSON.stringify(responseData, null, 2));
  log('🔍 Response headers:', headers);
  log('🔍 Extracted sessionId:', sessionId);
  log('🔍 SessionId type:', typeof sessionId);
  log('🔍 SessionId length:', sessionId ? sessionId.length : 'null');

  if (!sessionId) {
    warn('⚠️ No sessionId found in response headers or body');
    warn('⚠️ Available headers:', Object.keys(headers));
  } else {
    log(`✅ SessionId extracted successfully: ${sessionId} (length: ${sessionId.length})`);
  }

  Sentry.addBreadcrumb({
    message: 'OTP sent successfully',
    level: 'info',
    data: {
      email,
      sessionId,
      response: responseData,
    },
  });

  return {
    success: true,
    payload: {
      response: responseData,
      sessionId,
    },
    status: apiResponse.status,
  };
};

/**
 * Verify OTP with session ID
 * @param sessionId - Session ID from OTP send response
 * @param otp - User entered OTP
 * @returns Promise with OTP verification response
 */
export const verifyOtp = async (
  sessionId: string,
  otp: string
): Promise<SafeApiResponse<OtpVerifyResponse>> => {
  console.log('🔍 Verifying OTP with session ID:', sessionId);

  if (!sessionId || !otp) {
    return {
      success: false,
      payload: null,
      error: 'Session ID and OTP are required',
    };
  }

  if (otp.length < 4 || otp.length > 8) {
    return {
      success: false,
      payload: null,
      error: 'OTP must be between 4 and 8 characters',
    };
  }

  const payload: OtpVerifyRequest = {
    sessionId,
    otp,
  };

  Sentry.addBreadcrumb({
    message: 'OTP verification request initiated',
    level: 'info',
    data: { sessionId, otpLength: otp.length },
  });

  const apiResponse = await safeRequest<OtpVerifyResponse>({
    method: 'post',
    url: OTP_VERIFY_ENDPOINT,
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!apiResponse.success || !apiResponse.payload) {
    return {
      success: false,
      payload: null,
      error: apiResponse.error || 'OTP verification failed',
      status: apiResponse.status,
    };
  }

  console.log('✅ OTP verification response:', apiResponse.payload);

  Sentry.addBreadcrumb({
    message: 'OTP verification completed',
    level: 'info',
    data: {
      sessionId,
      verified: apiResponse.payload.data?.verified,
      response: apiResponse.payload,
    },
  });

  return {
    success: true,
    payload: apiResponse.payload,
    status: apiResponse.status,
  };
};

/**
 * Utility function to validate OTP format
 * @param otp - OTP string to validate
 * @returns boolean indicating if OTP is valid
 */
export const validateOtpFormat = (otp: string): boolean => {
  // OTP should be numeric and between 4-8 digits
  const otpRegex = /^\d{4,8}$/;
  return otpRegex.test(otp);
};

/**
 * Utility function to validate email format
 * @param email - Email string to validate
 * @returns boolean indicating if email is valid
 */
export const validateEmailFormat = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
