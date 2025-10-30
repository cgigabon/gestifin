import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { addIncome } from '@/server/transactions';

/**
 * 💰 API ROUTE: POST /api/income
 * Enregistrer un nouveau revenu
 */

export async function POST(req: Request) {
  try {
    // Vérifier l'authentification
    const session = await getServerSession(authOptions);
    const userId = Number((session as any)?.user?.id ?? 0);
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      );
    }

    // Parser les données
    const body = await req.json();
    const { montant, serviceId, description, date } = body;

    // Validation basique
    if (!montant || montant <= 0) {
      return NextResponse.json(
        { error: 'Montant invalide' },
        { status: 400 }
      );
    }

    // Enregistrer le revenu
    await addIncome({
      utilisateurId: userId,
      montant: Number(montant),
      serviceId: serviceId ? Number(serviceId) : undefined,
      date: date || undefined,
      note: description || undefined,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Revenu enregistré avec succès'
    });

  } catch (error) {
    console.error('Erreur API income:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}


