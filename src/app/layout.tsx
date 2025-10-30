import type { Metadata } from 'next';
import Providers from './providers';
import './globals.css';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { AnimatedHeader } from '@/components/layout/animated-header';
import { pool } from '@/lib/db';

export const metadata: Metadata = { title: 'Gestifin', description: 'Gestion financière' };
export const dynamic = 'force-dynamic';

async function getUnreadAlertsCount(userId: number) {
  try {
    const [rows] = await pool.query(
      'SELECT COUNT(*) as count FROM alertes WHERE utilisateur_id = ? AND lue = 0',
      [userId]
    );
    return (rows as any[])[0]?.count || 0;
  } catch {
    return 0;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const userId = session?.user ? Number((session.user as any).id) : 0;
  const unreadAlerts = userId > 0 ? await getUnreadAlertsCount(userId) : 0;

  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 transition-colors duration-300">
        <Providers>
          {session ? <AnimatedHeader unreadAlerts={unreadAlerts} /> : null}
          <main id="main" role="main" className="mx-auto max-w-6xl px-4 py-6">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
