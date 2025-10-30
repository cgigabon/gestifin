import { getUserIdOrThrow } from '@/lib/auth';
import { pool } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { ProfileClient } from './ProfileClient';

export const dynamic = 'force-dynamic';

interface UserProfile {
  id: number;
  nom: string;
  email: string;
  created_at: string;
  total_transactions: number;
  total_envelopes: number;
  total_services: number;
}

async function getUserProfile(userId: number): Promise<UserProfile> {
  const [[userRow], [statsRows]] = await Promise.all([
    pool.query(
      'SELECT id, nom, email, created_at FROM utilisateurs WHERE id = ?',
      [userId]
    ),
    pool.query(
      `SELECT 
        (SELECT COUNT(*) FROM transactions WHERE utilisateur_id = ?) as total_transactions,
        (SELECT COUNT(*) FROM enveloppes WHERE utilisateur_id = ? AND actif = 1) as total_envelopes,
        (SELECT COUNT(*) FROM services WHERE utilisateur_id = ? AND actif = 1) as total_services`,
      [userId, userId, userId]
    ),
  ]);

  const user = (userRow as any[])[0];
  const stats = (statsRows as any[])[0];

  return {
    id: user.id,
    nom: user.nom,
    email: user.email,
    created_at: user.created_at,
    total_transactions: stats.total_transactions || 0,
    total_envelopes: stats.total_envelopes || 0,
    total_services: stats.total_services || 0,
  };
}

export default async function ProfilePage() {
  const userId = await getUserIdOrThrow();
  const session = await getServerSession(authOptions);
  const profile = await getUserProfile(userId);

  return <ProfileClient profile={profile} />;
}

