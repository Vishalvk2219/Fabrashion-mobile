import { apiClient, apiGet } from '@/api/client';
import { endpoints } from '@/api/endpoints';
import type {
  CreateTrialInput,
  OutcomeInput,
  PaginatedTrials,
  Trial,
  TrialEligibility,
} from './schema';

export function fetchEligibility(variantIds: string[], addressId: string): Promise<TrialEligibility> {
  const qs = `variantIds=${variantIds.join(',')}&addressId=${addressId}`;
  return apiGet<TrialEligibility>(`${endpoints.trials.eligibility}?${qs}`);
}

export async function createTrial(input: CreateTrialInput): Promise<Trial> {
  const { data } = await apiClient.post<Trial>(endpoints.trials.root, input);
  return data;
}

export function fetchTrials(): Promise<PaginatedTrials> {
  return apiGet<PaginatedTrials>(`${endpoints.trials.root}?limit=50`);
}

export function fetchTrial(id: string): Promise<Trial> {
  return apiGet<Trial>(endpoints.trials.detail(id));
}

export async function recordOutcome(id: string, input: OutcomeInput): Promise<Trial> {
  const { data } = await apiClient.post<Trial>(endpoints.trials.outcome(id), input);
  return data;
}

export async function cancelTrial(id: string): Promise<Trial> {
  const { data } = await apiClient.post<Trial>(endpoints.trials.cancel(id));
  return data;
}

/** DEV-only stand-in for the PhonePe trial capture (see plan 19; real charge in 4c). */
export async function confirmTrialDev(id: string): Promise<Trial> {
  const { data } = await apiClient.post<Trial>(endpoints.trials.confirmDev(id));
  return data;
}
