import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';
import { SQL } from '@/lib/sql';
import bcrypt from 'bcryptjs';
import type { ResultSetHeader, RowDataPacket } from 'mysql2';

interface UserRow extends RowDataPacket {
  id: number;
  email: string;
  nom: string;
}

export async function POST(req: Request) {
  try {
    const { nom, email, password } = await req.json();
    if (!nom || !email || !password) {
      return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
    }

    // Vérifier si l'utilisateur existe déjà
    const [rows] = await pool.query<UserRow[]>(SQL.findUserByEmail, [email]);
    const exist = rows.length > 0;
    if (exist) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }

    // Créer le nouvel utilisateur
    const hash = await bcrypt.hash(password, 10);
    const [res] = await pool.query<ResultSetHeader>(SQL.insertUser, [nom, email, hash]);
    const id = res.insertId;

    return NextResponse.json({ id, nom, email }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Erreur serveur';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}