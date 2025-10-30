import { getUserIdOrThrow } from '@/lib/auth';
import { setRevenueBaseline, getCurrentConfig } from '@/server/revenue';
import { revalidatePath } from 'next/cache';
import { RevenueSettingsClient } from './RevenueSettingsClient';

export const dynamic = 'force-dynamic';

async function saveAction(formData: FormData) {
  'use server';
  const userId = await getUserIdOrThrow();
  const monthsWindow = Number(formData.get('monthsWindow') || 3);
  const effectiveFrom = String(formData.get('effectiveFrom') || '');
  const note = (formData.get('note') as string) || undefined;
  const avgIncome = formData.get('avgIncome')
    ? Number(formData.get('avgIncome'))
    : undefined;

  const months: { mois: string; montant: number }[] = [];
  for (let i = 1; i <= 6; i++) {
    const m = String(formData.get(`m${i}`) || '');
    const v = Number(formData.get(`v${i}`) || 0);
    if (m && v > 0) months.push({ mois: m, montant: v });
  }

  await setRevenueBaseline(userId, {
    monthsWindow,
    months: months.length ? months : undefined,
    avgIncome,
    effectiveFrom,
    note,
  });
  revalidatePath('/settings/revenue');
}

export default async function RevenueSettingsPage() {
  const userId = await getUserIdOrThrow();
  const { current, next, currentMonths, nextMonths } = await getCurrentConfig(userId);

  const today = new Date();
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 1, 1);
  const ymDefault = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`;

  // Formatter les dates côté serveur
  const formatDate = (d: any) => {
    if (!d) return '—';
    if (typeof d === 'string') return d.slice(0, 10);
    try { return new Date(d).toISOString().slice(0, 10); } catch { return '—'; }
  };

  // Formater les données avant de les passer au client
  const formattedCurrent = current ? {
    ...current,
    effective_from: formatDate(current.effective_from),
  } : null;

  const formattedNext = next ? {
    ...next,
    effective_from: formatDate(next.effective_from),
  } : null;

  return (
    <RevenueSettingsClient
      current={formattedCurrent}
      next={formattedNext}
      currentMonths={currentMonths}
      nextMonths={nextMonths}
      ymDefault={ymDefault}
      saveAction={saveAction}
    />
  );
}


