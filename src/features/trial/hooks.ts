import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { orderKeys } from '@/features/orders/hooks';
import {
  cancelTrial,
  confirmTrialDev,
  createTrial,
  fetchEligibility,
  fetchTrial,
  fetchTrials,
  recordOutcome,
} from './api';
import type { CreateTrialInput, OutcomeInput, Trial } from './schema';

export const trialKeys = {
  root: ['trials'] as const,
  list: ['trials', 'list'] as const,
  detail: (id: string) => ['trials', 'detail', id] as const,
  eligibility: (variantIds: string[], addressId: string) =>
    ['trials', 'eligibility', variantIds.join(','), addressId] as const,
};

export function useTrialEligibility(variantIds: string[], addressId: string | undefined) {
  return useQuery({
    queryKey: trialKeys.eligibility(variantIds, addressId ?? ''),
    queryFn: () => fetchEligibility(variantIds, addressId!),
    enabled: variantIds.length > 0 && Boolean(addressId),
  });
}

export function useTrials() {
  return useQuery({ queryKey: trialKeys.list, queryFn: fetchTrials });
}

export function useTrial(id: string) {
  return useQuery({
    queryKey: trialKeys.detail(id),
    queryFn: () => fetchTrial(id),
    enabled: Boolean(id),
  });
}

/** Book + (in dev) capture the trial charge — the PhonePe sheet replaces the capture in 4c. */
export function useCreateTrial() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreateTrialInput): Promise<Trial> => {
      const booking = await createTrial(input);
      return __DEV__ ? confirmTrialDev(booking.id) : booking;
    },
    onSuccess: (trial) => {
      qc.setQueryData(trialKeys.detail(trial.id), trial);
      void qc.invalidateQueries({ queryKey: trialKeys.list });
    },
  });
}

export function useTrialOutcome(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: OutcomeInput) => recordOutcome(id, input),
    onSuccess: (trial) => {
      qc.setQueryData(trialKeys.detail(id), trial);
      void qc.invalidateQueries({ queryKey: trialKeys.list });
      void qc.invalidateQueries({ queryKey: orderKeys.list }); // kept pieces became an order
    },
  });
}

export function useCancelTrial(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: () => cancelTrial(id),
    onSuccess: (trial) => {
      qc.setQueryData(trialKeys.detail(id), trial);
      void qc.invalidateQueries({ queryKey: trialKeys.list });
    },
  });
}
