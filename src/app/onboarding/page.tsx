import { getUserIdOrThrow } from '@/lib/auth';
import { saveOnboarding } from '@/server/onboarding';
import { OnboardingClient } from './OnboardingClient';

export default async function OnboardingPage() {
  const userId = await getUserIdOrThrow();
  async function action(payload: any) {
    'use server';
    await saveOnboarding({ utilisateurId: userId, envelopes: payload.envelopes });
    // revenues payload accepted but not persisted yet (can be extended later)
    return { ok: true };
  }
  return <OnboardingClient save={action} />;
}