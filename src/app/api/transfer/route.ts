import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { createTransfer } from '@/server/transfers';

/**
 * 🔄 API ROUTE: POST /api/transfer
 * Créer un transfert entre enveloppes
 */

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = Number((session as any)?.user?.id ?? 0);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { montant, source_id, destination_id, description, date } = body;

    // Validation
    if (!montant || montant <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    if (!source_id || !destination_id) {
      return NextResponse.json(
        { error: 'Enveloppes source et destination requises' },
        { status: 400 }
      );
    }

    if (source_id === destination_id) {
      return NextResponse.json(
        { error: 'Les enveloppes source et destination doivent être différentes' },
        { status: 400 }
      );
    }

    // Créer le transfert
    await createTransfer({
      utilisateurId: userId,
      sourceId: Number(source_id),
      targetId: Number(destination_id),
      montant: Number(montant),
      date: date || undefined,
      note: description || undefined,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Transfert effectué avec succès'
    });

  } catch (error) {
    console.error('Erreur API transfer:', error);
    return NextResponse.json(
      { error: 'Erreur lors du transfert' },
      { status: 500 }
    );
  }
}


