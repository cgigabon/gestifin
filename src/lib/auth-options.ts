import { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        const email = creds?.email as string;
        const password = creds?.password as string;
        if (!email || !password) return null;

        const [rows] = await pool.query(SQL.findUserByEmail, [email]);
        const user = Array.isArray(rows) ? (rows as any[])[0] : null;
        if (!user) return null;

        const ok = await bcrypt.compare(password, user.password_hash);
        if (!ok) return null;

        return { id: String(user.id), name: user.nom, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = (user as any).id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) (session.user as any).id = token.id;
      return session;
    },
  },
};


