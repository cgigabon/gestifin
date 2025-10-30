import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';

export async function getUserIdOrThrow(): Promise<number> {
  const session = await getServerSession(authOptions);
  const id = Number((session as any)?.user?.id ?? 0);
  if (!id) throw new Error('Non connecté');
  return id;
}



