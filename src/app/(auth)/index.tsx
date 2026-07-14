import { Redirect } from 'expo-router';

import { storage } from '@/lib/storage';

/** Show the splash + onboarding once; returning users land straight on login. */
export default function AuthIndex() {
  const onboarded = storage.get('app.onboarded', false);
  return <Redirect href={onboarded ? '/login' : '/splash'} />;
}
