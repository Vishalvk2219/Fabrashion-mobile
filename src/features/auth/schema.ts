import { z } from 'zod';

/** Login form (email/password method). Phone-OTP login lands with backend Phase 1. */
export const loginSchema = z.object({
  email: z.email('Enter a valid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type LoginInput = z.infer<typeof loginSchema>;

/** Registration form. Mirrors `POST /auth/register` (email, phone, password, fullName). */
export const registerSchema = z.object({
  fullName: z.string().min(2, 'Enter your name'),
  email: z.email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});
export type RegisterInput = z.infer<typeof registerSchema>;

export type UserRole = 'CUSTOMER' | 'STAFF' | 'ADMIN';

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
