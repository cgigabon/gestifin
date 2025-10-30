import { z } from 'zod';

/**
 * 🛡️ SCHÉMAS DE VALIDATION ZOD
 * Validation type-safe pour tous les formulaires
 */

// ─────────────────────────────────────────────────────────
// 💰 REVENUS (INCOME)
// ─────────────────────────────────────────────────────────

export const incomeSchema = z.object({
  montant: z
    .number({ message: 'Le montant est requis' })
    .positive('Le montant doit être positif')
    .min(100, 'Minimum 100 XAF'),
  
  serviceId: z
    .number()
    .optional(),
  
  description: z
    .string()
    .min(3, 'Minimum 3 caractères')
    .max(200, 'Maximum 200 caractères')
    .optional()
    .or(z.literal('')),
  
  date: z
    .string({ message: 'La date est requise' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
});

export type IncomeFormData = z.infer<typeof incomeSchema>;

// ─────────────────────────────────────────────────────────
// 💸 DÉPENSES (EXPENSE)
// ─────────────────────────────────────────────────────────

export const expenseSchema = z.object({
  montant: z
    .number({ message: 'Le montant est requis' })
    .positive('Le montant doit être positif')
    .min(100, 'Minimum 100 XAF'),
  
  description: z
    .string()
    .min(3, 'Minimum 3 caractères')
    .max(200, 'Maximum 200 caractères')
    .optional()
    .or(z.literal('')),
  
  date: z
    .string({ message: 'La date est requise' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
  
  allocations: z
    .array(
      z.object({
        enveloppe_id: z.number(),
        montant: z.number().nonnegative(),
      })
    )
    .min(1, 'Au moins une allocation est requise')
    .refine(
      (allocations) => {
        const total = allocations.reduce((sum, a) => sum + a.montant, 0);
        return total > 0;
      },
      { message: 'Le total des allocations doit être supérieur à 0' }
    ),
});

export type ExpenseFormData = z.infer<typeof expenseSchema>;

// ─────────────────────────────────────────────────────────
// 🔄 TRANSFERT
// ─────────────────────────────────────────────────────────

export const transferSchema = z.object({
  montant: z
    .number({ message: 'Le montant est requis' })
    .positive('Le montant doit être positif')
    .min(100, 'Minimum 100 XAF'),
  
  source_id: z
    .number({ message: 'Enveloppe source requise' })
    .positive('Sélectionnez une enveloppe source'),
  
  destination_id: z
    .number({ message: 'Enveloppe destination requise' })
    .positive('Sélectionnez une enveloppe destination'),
  
  description: z
    .string()
    .max(200, 'Maximum 200 caractères')
    .optional()
    .or(z.literal('')),
  
  date: z
    .string({ message: 'La date est requise' })
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Format de date invalide'),
}).refine(
  (data) => data.source_id !== data.destination_id,
  {
    message: 'Les enveloppes source et destination doivent être différentes',
    path: ['destination_id'],
  }
);

export type TransferFormData = z.infer<typeof transferSchema>;

// ─────────────────────────────────────────────────────────
// 📦 ENVELOPPE
// ─────────────────────────────────────────────────────────

export const envelopeSchema = z.object({
  nom: z
    .string({ message: 'Le nom est requis' })
    .min(2, 'Minimum 2 caractères')
    .max(50, 'Maximum 50 caractères'),
  
  budget_mensuel: z
    .number({ message: 'Le budget est requis' })
    .nonnegative('Le budget ne peut pas être négatif'),
  
  pourcentage: z
    .number()
    .min(0, 'Minimum 0%')
    .max(100, 'Maximum 100%'),
  
  protegee: z.boolean(),
});

export type EnvelopeFormData = z.infer<typeof envelopeSchema>;

// ─────────────────────────────────────────────────────────
// 🔐 AUTHENTIFICATION
// ─────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z
    .string({ message: 'L\'email est requis' })
    .email('Email invalide'),
  
  password: z
    .string({ message: 'Le mot de passe est requis' })
    .min(6, 'Minimum 6 caractères'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  nom: z
    .string({ message: 'Le nom est requis' })
    .min(2, 'Minimum 2 caractères')
    .max(100, 'Maximum 100 caractères'),
  
  email: z
    .string({ message: 'L\'email est requis' })
    .email('Email invalide'),
  
  password: z
    .string({ message: 'Le mot de passe est requis' })
    .min(6, 'Minimum 6 caractères')
    .max(100, 'Maximum 100 caractères'),
  
  confirmPassword: z
    .string({ message: 'Confirmez le mot de passe' }),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  }
);

export type RegisterFormData = z.infer<typeof registerSchema>;

// ─────────────────────────────────────────────────────────
// 🛠️ UTILITAIRES
// ─────────────────────────────────────────────────────────

/**
 * Formater les erreurs Zod pour affichage
 */
export function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  
  error.issues.forEach((err) => {
    const path = err.path.join('.');
    errors[path] = err.message;
  });
  
  return errors;
}

