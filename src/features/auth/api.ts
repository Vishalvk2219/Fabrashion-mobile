import { apiGet, apiPost } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type { AuthResponse, AuthUser, LoginInput, RegisterInput } from './schema';

export function login(input: LoginInput): Promise<AuthResponse> {
  return apiPost<AuthResponse>(endpoints.auth.login, input);
}

export function register(input: RegisterInput): Promise<AuthResponse> {
  return apiPost<AuthResponse>(endpoints.auth.register, input);
}

export function fetchMe(): Promise<AuthUser> {
  return apiGet<AuthUser>(endpoints.auth.me);
}
