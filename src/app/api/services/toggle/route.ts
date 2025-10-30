import { NextResponse } from 'next/server';
import { toggleServiceActive } from '@/server/services';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await toggleServiceActive(body);
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error?.message || 'Erreur lors de la modification' },
      { status: 400 }
    );
  }
}

