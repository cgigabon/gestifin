import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT 1 AS ok');
    const result = rows as unknown[];
    
    if (result.length > 0 && typeof result[0] === 'object' && result[0] !== null) {
      const firstRow = result[0] as Record<string, unknown>;
      return NextResponse.json({ db: firstRow.ok === 1 ? 'up' : 'unknown' });
    }
    
    return NextResponse.json({ db: 'unknown' });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : 'Unknown error';
    return NextResponse.json({ db: 'down', error: errorMessage }, { status: 500 });
  }
}