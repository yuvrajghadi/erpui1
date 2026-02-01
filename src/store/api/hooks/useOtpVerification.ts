import { useState, useCallback } from 'react';
import { message } from 'antd';
import * as Sentry from '@sentry/nextjs';
import { sendOtp, verifyOtp, validateOtpFormat, validateEmailFormat } from '../services/otp';

// OTP state interface
export interface OtpState {
  // Send OTP state
  isSendingOtp: boolean;
  otpSent: boolean;
  sessionId: string | null;
  
  // Verify OTP state
  isVerifyingOtp: boolean;
  otpVerified: boolean;
  
  // Error handling
  error: string | null;
  
  // OTP input
  otpValue: string;
}

// Initial state
const initialOtpState: OtpState = {
  isSendingOtp: false,
  otpSent: false,
  sessionId: null,
  isVerifyingOtp: false,
  otpVerified: false,
  error: null,
  otpValue: '',
};

/**
 * Custom hook for OTP verification workflow
 * Manages the complete OTP send and verify flow with proper state management
 */
export const useOtpVerification = () => {
  const [otpState, setOtpState] = useState<OtpState>(initialOtpState);

  /**
   * Send OTP to email address
   */
  const handleSendOtp = useCallback(async (email: string): Promise<boolean> => {
    try {
      // Validate email format
      if (!validateEmailFormat(email)) {
        const errorMsg = 'Please enter a valid email address';
        setOtpState(prev => ({ ...prev, error: errorMsg }));
        message.error(errorMsg);
        return false;
      }

      // Set loading state
      setOtpState(prev => ({
        ...prev,
        isSendingOtp: true,
        error: null,
        otpSent: false,
        sessionId: null,
      }));

      // Show loading message
      message.loading({
        content: 'Sending OTP to your email...',
        key: 'otp-send',
        duration: 0,
      });

      console.log('🚀 Initiating OTP send for email:', email);

      // Call API
      const result = await sendOtp(email);

      if (result.success && result.payload?.response?.success) {
        const { response, sessionId } = result.payload;
        // Update state with success
        setOtpState(prev => {
          const newState = {
            ...prev,
            isSendingOtp: false,
            otpSent: true,
            sessionId: sessionId || null,
            error: null,
          };
          console.log('🔍 [handleSendOtp] Updating state with sessionId:', sessionId);
          console.log('🔍 [handleSendOtp] New state:', newState);
          return newState;
        });

        // Show success message
        message.destroy('otp-send');
        message.success({
          content: 'OTP sent successfully! Please check your email.',
          duration: 5,
        });

        console.log('✅ OTP sent successfully, session ID:', sessionId);
        
        // Warn if sessionId is missing but don't fail
        if (!sessionId) {
          console.warn('⚠️ Session ID not found in response headers');
        }
        
        return true;

      } else {
        const errorMessage = result.error || result.payload?.response?.message || 'Failed to send OTP';
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('❌ Error in handleSendOtp:', error);

      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Failed to send OTP. Please try again.';

      // Update state with error
      setOtpState(prev => ({
        ...prev,
        isSendingOtp: false,
        error: errorMessage,
        otpSent: false,
        sessionId: null,
      }));

      // Show error message
      message.destroy('otp-send');
      message.error({
        content: errorMessage,
        duration: 5,
      });

      // Log error to Sentry
      Sentry.captureException(error, {
        tags: { hook: 'useOtpVerification', action: 'sendOtp' },
        extra: { email },
      });

      return false;
    }
  }, []);

  /**
   * Verify OTP with session ID
   * @param providedOtpValue - Optional OTP value to verify (if not provided, uses internal state)
   */
  const handleVerifyOtp = useCallback(async (providedOtpValue?: string): Promise<boolean> => {
    try {
      const { sessionId } = otpState;
      const otpValue = providedOtpValue || otpState.otpValue;

      console.log('🔍 [handleVerifyOtp] Starting verification...');
      console.log('🔍 [handleVerifyOtp] Complete otpState:', JSON.stringify(otpState, null, 2));
      console.log('🔍 [handleVerifyOtp] Session ID from state:', sessionId);
      console.log('🔍 [handleVerifyOtp] Session ID type:', typeof sessionId);
      console.log('🔍 [handleVerifyOtp] Session ID length:', sessionId?.length);
      console.log('🔍 [handleVerifyOtp] Provided OTP:', providedOtpValue);
      console.log('🔍 [handleVerifyOtp] Hook OTP state:', otpState.otpValue);
      console.log('🔍 [handleVerifyOtp] Final OTP to use:', otpValue);
      console.log('🔍 [handleVerifyOtp] OTP sent status:', otpState.otpSent);

      // Validate inputs
      if (!sessionId) {
        console.error('❌ [handleVerifyOtp] No session ID available');
        console.error('❌ [handleVerifyOtp] Complete OTP state:', otpState);
        console.error('❌ [handleVerifyOtp] Session ID from state:', otpState.sessionId);
        console.error('❌ [handleVerifyOtp] Session ID type:', typeof otpState.sessionId);
        console.error('❌ [handleVerifyOtp] Session ID length:', otpState.sessionId?.length);
        console.error('❌ [handleVerifyOtp] Provided OTP:', providedOtpValue);
        console.error('❌ [handleVerifyOtp] Hook OTP state:', otpState.otpValue);
        console.error('❌ [handleVerifyOtp] Final OTP to use:', otpValue);
        console.error('❌ [handleVerifyOtp] OTP sent status:', otpState.otpSent);
        console.error('❌ [handleVerifyOtp] Is sending OTP:', otpState.isSendingOtp);
        
        // Provide more helpful error message based on the state
        let detailedErrorMsg: string;
        if (!otpState.otpSent) {
          detailedErrorMsg = 'Please send an OTP first before attempting to verify.';
        } else if (otpState.isSendingOtp) {
          detailedErrorMsg = 'OTP is still being sent. Please wait a moment and try again.';
        } else {
          detailedErrorMsg = 'Session ID is missing from the OTP response. This indicates an issue with the OTP service. Please try sending a new OTP.';
        }
        
        setOtpState(prev => ({ ...prev, error: detailedErrorMsg }));
        message.error(detailedErrorMsg);
        return false;
      }

      if (!otpValue || !validateOtpFormat(otpValue)) {
        const errorMsg = 'Please enter a valid OTP (4-8 digits)';
        console.error('❌ [handleVerifyOtp] Invalid OTP format:', otpValue);
        setOtpState(prev => ({ ...prev, error: errorMsg }));
        message.error(errorMsg);
        return false;
      }

      // Set loading state
      setOtpState(prev => ({
        ...prev,
        isVerifyingOtp: true,
        error: null,
      }));

      // Show loading message
      message.loading({
        content: 'Verifying OTP...',
        key: 'otp-verify',
        duration: 0,
      });

      console.log('🔍 [handleVerifyOtp] Calling API with session ID:', sessionId, 'and OTP:', otpValue);

      // Call API
      const result = await verifyOtp(sessionId, otpValue);
      
      console.log('🔍 [handleVerifyOtp] API response received:', result);

      if (result.success && result.payload?.success && result.payload.data?.verified) {
        // Update state with success
        setOtpState(prev => ({
          ...prev,
          isVerifyingOtp: false,
          otpVerified: true,
          error: null,
        }));

        // Show success message
        message.destroy('otp-verify');
        message.success({
          content: 'OTP verified successfully!',
          duration: 3,
        });

        console.log('✅ OTP verified successfully');
        return true;

      } else {
        const errorMessage = result.error || result.payload?.message || 'Invalid OTP';
        throw new Error(errorMessage);
      }

    } catch (error: any) {
      console.error('❌ Error in handleVerifyOtp:', error);

      const errorMessage = error.response?.data?.message || 
                          error.message || 
                          'Invalid OTP. Please try again.';

      // Update state with error
      setOtpState(prev => ({
        ...prev,
        isVerifyingOtp: false,
        error: errorMessage,
      }));

      // Show error message
      message.destroy('otp-verify');
      message.error({
        content: errorMessage,
        duration: 5,
      });

      // Log error to Sentry
      Sentry.captureException(error, {
        tags: { hook: 'useOtpVerification', action: 'verifyOtp' },
        extra: { sessionId: otpState.sessionId },
      });

      return false;
    }
  }, [otpState]);

  /**
   * Update OTP input value
   */
  const updateOtpValue = useCallback((value: string) => {
    // Only allow numeric input and limit to 8 characters
    const numericValue = value.replace(/\D/g, '').slice(0, 8);
    setOtpState(prev => ({
      ...prev,
      otpValue: numericValue,
      error: null, // Clear error when user types
    }));
  }, []);

  /**
   * Reset OTP state to initial values
   */
  const resetOtpState = useCallback(() => {
    setOtpState(initialOtpState);
    message.destroy('otp-send');
    message.destroy('otp-verify');
  }, []);

  /**
   * Clear error state
   */
  const clearError = useCallback(() => {
    setOtpState(prev => ({ ...prev, error: null }));
  }, []);

  /**
   * Check if OTP can be sent (email validation)
   */
  const canSendOtp = useCallback((email: string): boolean => {
    return validateEmailFormat(email) && !otpState.isSendingOtp;
  }, [otpState.isSendingOtp]);

  /**
   * Check if OTP can be verified
   */
  const canVerifyOtp = useCallback((): boolean => {
    return !!(
      otpState.sessionId && 
      otpState.otpValue && 
      validateOtpFormat(otpState.otpValue) && 
      !otpState.isVerifyingOtp
    );
  }, [otpState.sessionId, otpState.otpValue, otpState.isVerifyingOtp]);

  return {
    // State
    otpState,
    
    // Actions
    sendOtp: handleSendOtp,
    verifyOtp: handleVerifyOtp,
    updateOtpValue,
    resetOtpState,
    clearError,
    
    // Computed properties
    canSendOtp,
    canVerifyOtp,
    
    // Convenience getters
    isLoading: otpState.isSendingOtp || otpState.isVerifyingOtp,
    isOtpSent: otpState.otpSent,
    isOtpVerified: otpState.otpVerified,
    hasError: !!otpState.error,
    sessionId: otpState.sessionId,
    otpValue: otpState.otpValue,
    error: otpState.error,
  };
};
