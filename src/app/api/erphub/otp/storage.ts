// Shared OTP storage service
// In production, this should be replaced with Redis or a database

import { debugLogsEnabled } from '@/config';

const log = (...args: unknown[]) => {
  if (!debugLogsEnabled) {
    return;
  }
  console.log(...args);
};

export interface OtpData {
  otp: string;
  email: string;
  expiresAt: Date;
  attempts: number;
}

class OtpStorageService {
  private storage = new Map<string, OtpData>();
  private readonly MAX_ATTEMPTS = 3;
  private readonly OTP_EXPIRY_MINUTES = 10;

  // Store OTP data
  store(sessionId: string, otp: string, email: string): void {
    const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000);
    
    this.storage.set(sessionId, {
      otp,
      email,
      expiresAt,
      attempts: 0,
    });

    log(`💾 Stored OTP for session ${sessionId}, expires at ${expiresAt.toISOString()}`);
  }

  // Get OTP data
  get(sessionId: string): OtpData | null {
    const data = this.storage.get(sessionId);
    
    if (!data) {
      log(`❌ No OTP data found for session ${sessionId}`);
      return null;
    }

    // Check if expired
    if (new Date() > data.expiresAt) {
      log(`⏰ OTP expired for session ${sessionId}`);
      this.storage.delete(sessionId);
      return null;
    }

    return data;
  }

  // Increment verification attempts
  incrementAttempts(sessionId: string): number {
    const data = this.storage.get(sessionId);
    if (data) {
      data.attempts += 1;
      log(`🔢 Attempt ${data.attempts}/${this.MAX_ATTEMPTS} for session ${sessionId}`);
      
      if (data.attempts >= this.MAX_ATTEMPTS) {
        log(`🚫 Max attempts reached for session ${sessionId}, removing`);
        this.storage.delete(sessionId);
      }
      
      return data.attempts;
    }
    return 0;
  }

  // Remove OTP data
  remove(sessionId: string): void {
    this.storage.delete(sessionId);
    log(`🗑️ Removed OTP data for session ${sessionId}`);
  }

  // Check if max attempts reached
  isMaxAttemptsReached(sessionId: string): boolean {
    const data = this.storage.get(sessionId);
    return data ? data.attempts >= this.MAX_ATTEMPTS : false;
  }

  // Clean up expired OTPs (should be called periodically)
  cleanup(): void {
    const now = new Date();
    let cleanedCount = 0;

    for (const [sessionId, data] of this.storage.entries()) {
      if (now > data.expiresAt) {
        this.storage.delete(sessionId);
        cleanedCount++;
      }
    }

    if (cleanedCount > 0) {
      log(`🧹 Cleaned up ${cleanedCount} expired OTP sessions`);
    }
  }

  // Get storage stats (for debugging)
  getStats(): { totalSessions: number; activeSessions: number } {
    this.cleanup(); // Clean up first
    return {
      totalSessions: this.storage.size,
      activeSessions: this.storage.size,
    };
  }
}

// Export singleton instance
export const otpStorage = new OtpStorageService();

// Utility functions
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function generateSessionId(): string {
  return `otp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Simulate email sending (replace with actual email service in production)
export async function sendEmailOTP(email: string, otp: string): Promise<boolean> {
  try {
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    log(`📧 [SIMULATED EMAIL] Sending OTP to ${email}`);
    log(`📧 Email Subject: Your Verification Code`);
    log(`📧 Email Body: Your verification code is: ${otp}`);
    log(`📧 This code will expire in 10 minutes.`);
    log(`📧 If you didn't request this code, please ignore this email.`);
    
    return true;
  } catch (error) {
    console.error('❌ Failed to send email:', error);
    return false;
  }
}

// Periodic cleanup (run every 5 minutes)
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => {
    otpStorage.cleanup();
  }, 5 * 60 * 1000);
}
