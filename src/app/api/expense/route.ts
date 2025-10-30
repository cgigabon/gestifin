import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth-options';
import { addExpenseWithSplits } from '@/server/transactions';

/**
 * 💸 API ROUTE: POST /api/expense
 * Enregistrer une nouvelle dépense avec allocations
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
    const { montant, description, date, allocations } = body;

    // Validation
    if (!allocations || !Array.isArray(allocations) || allocations.length === 0) {
      return NextResponse.json(
        { error: 'Allocations requises' },
        { status: 400 }
      );
    }

    const total = allocations.reduce((sum: number, a: any) => sum + (a.montant || 0), 0);
    if (total === 0) {
      return NextResponse.json(
        { error: 'Le total des allocations doit être supérieur à 0' },
        { status: 400 }
      );
    }

    // Formatter les allocations
    const formattedAllocations = allocations.map((a: any) => ({
      enveloppeId: Number(a.enveloppe_id),
      montant: Number(a.montant),
    }));

    // Enregistrer la dépense
    await addExpenseWithSplits({
      utilisateurId: userId,
      allocations: formattedAllocations,
      description: description || undefined,
      date: date || undefined,
    });

    return NextResponse.json({ 
      success: true,
      message: 'Dépense enregistrée avec succès'
    });

  } catch (error) {
    console.error('Erreur API expense:', error);
    return NextResponse.json(
      { error: 'Erreur lors de l\'enregistrement' },
      { status: 500 }
    );
  }
}


