import { apiGet, apiPost } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { AuthResponse, AuthUser, OtpRequestResponse, OtpVerifyInput } from './schema';

/** Step 1 — request a login OTP for a phone number (10-digit, no +91). */
export function requestOtp(phone: string): Promise<OtpRequestResponse> {
  return apiPost<OtpRequestResponse>(endpoints.auth.otpRequest, { phone });
}

/** Step 2 — verify the code and sign in. Creates a CUSTOMER account on first login. */
export function verifyOtp(input: OtpVerifyInput): Promise<AuthResponse> {
  return apiPost<AuthResponse>(endpoints.auth.otpVerify, input);
}

export function fetchMe(): Promise<AuthUser> {
  return apiGet<AuthUser>(endpoints.auth.me);
}
