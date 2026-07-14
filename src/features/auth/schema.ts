import { z } from 'zod';

/** A 10-digit Indian mobile number (without +91). The only login credential. */
export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number');

/** OTP verify input — mirrors `POST /auth/otp/verify`. */
export const otpVerifySchema = z.object({
  phone: phoneSchema,
  code: z.string().regex(/^\d{4}$/, 'Enter the 4-digit code'),
});
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;

/** Response of `POST /auth/otp/request`. `devCode` is dev-only (no SMS provider yet). */
export type OtpRequestResponse = {
  expiresInSec: number;
  devCode?: string;
};

export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

/** The role is stored on the account (admin-seeded) and returned by the backend after the same
 * phone-OTP login everyone uses — it is never chosen at login. It selects which app shell renders. */
export const isStaff = (role: UserRole | undefined): boolean => role === 'STAFF';
export const isAdmin = (role: UserRole | undefined): boolean => role === 'ADMIN';
/** Staff or Admin — the back-office shells (not the customer app). */
export const isBackOffice = (role: UserRole | undefined): boolean => isStaff(role) || isAdmin(role);

export type AuthUser = {
  id: string;
  fullName: string;
  email: string | null;
  phone: string | null;
  role: UserRole;
};

/** Response of `POST /auth/login` and `/auth/register` (Phase 1 contract). */
export type AuthResponse = {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
};
