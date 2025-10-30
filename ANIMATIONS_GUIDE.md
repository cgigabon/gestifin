# 🎨 Guide des Animations GestiFin

## 📦 Packages Installés

```bash
✅ framer-motion (v12.23.24)    # Animations avancées
✅ sonner (v2.0.7)               # Notifications toast élégantes
✅ @formkit/auto-animate (v0.9)  # Animations automatiques
```

---

## 🎯 Composants Animés Disponibles

### 1. **AnimatedCard** - Cartes avec animations

```tsx
import { AnimatedCard } from '@/components/ui/animated-card';

// Carte basique avec animation d'entrée
<AnimatedCard delay={0.2}>
  <CardTitle>Mon Titre</CardTitle>
  <CardDescription>Description</CardDescription>
</AnimatedCard>

// Sans effet hover
<AnimatedCard enableHover={false}>
  Contenu statique
</AnimatedCard>

// Différentes animations d'entrée
<AnimatedCard variant="scale">...</AnimatedCard>
<AnimatedCard variant="slideUp">...</AnimatedCard>
<AnimatedCard variant="slideLeft">...</AnimatedCard>
```

### 2. **AnimatedButton** - Boutons interactifs

```tsx
import { AnimatedButton } from '@/components/ui/animated-button';

// Bouton avec micro-interactions
<AnimatedButton>Cliquez-moi</AnimatedButton>

// Avec état de chargement
<AnimatedButton isLoading={isSubmitting}>
  Soumettre
</AnimatedButton>
```

### 3. **Toaster & Notifications** - Feedback utilisateur

```tsx
import { toast } from 'sonner';

// Success
toast.success('Transaction enregistrée avec succès !');

// Error
toast.error('Erreur lors de la sauvegarde');

// Info
toast.info('Budget mis à jour');

// Warning
toast.warning('Attention : Budget bientôt dépassé');

// Avec action
toast('Budget dépassé', {
  description: 'Voulez-vous ajuster votre enveloppe ?',
  action: {
    label: 'Ajuster',
    onClick: () => router.push('/envelopes/1')
  }
});

// Toast personnalisé avec durée
toast.success('Opération réussie', {
  duration: 5000, // 5 secondes
});
```

---

## 🎭 Bibliothèque d'Animations (`lib/animations.ts`)

### Animations de base

```tsx
import { fadeInUp, fadeInDown, fadeInLeft, fadeInRight } from '@/lib/animations';
import { motion } from 'framer-motion';

<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Contenu qui apparaît du bas
</motion.div>
```

### Animations pour listes (stagger)

```tsx
import { listContainer, listItem } from '@/lib/animations';

<motion.ul variants={listContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.li key={item.id} variants={listItem}>
      {item.name}
    </motion.li>
  ))}
</motion.ul>
```

### Animations de montants (effet compteur)

```tsx
// Composant personnalisé disponible dans DashboardClient
function AnimatedAmount({ value }: { value: number }) {
  // Anime un nombre de 0 à value
}

<AnimatedAmount value={15000} />
```

### Barre de progression animée

```tsx
import { motion } from 'framer-motion';

<div className="h-2 w-full bg-zinc-200 rounded-full overflow-hidden">
  <motion.div
    initial={{ width: '0%' }}
    animate={{ width: `${percentage}%` }}
    transition={{ duration: 1, ease: 'easeOut' }}
    className="h-full bg-green-500"
  />
</div>
```

---

## 💡 Exemples d'Utilisation

### ✅ Dashboard (Déjà implémenté)

Le dashboard utilise :
- ✨ Animations de cartes KPI avec effet compteur
- ✨ Cascade d'enveloppes (stagger)
- ✨ Barres de progression animées
- ✨ Hover effects sur toutes les cartes
- ✨ Animations des badges et alertes

### 🎯 Exemple : Page de Transaction avec Feedback

```tsx
'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';

export function TransactionForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Votre logique API
      await saveTransaction();
      
      // Succès avec animation
      toast.success('Transaction enregistrée !', {
        description: 'Votre solde a été mis à jour',
      });
    } catch (error) {
      toast.error('Erreur', {
        description: 'Impossible de sauvegarder la transaction',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AnimatedCard delay={0.1}>
      <form onSubmit={handleSubmit}>
        {/* Vos champs de formulaire */}
        
        <AnimatedButton 
          type="submit" 
          isLoading={isSubmitting}
        >
          Enregistrer
        </AnimatedButton>
      </form>
    </AnimatedCard>
  );
}
```

### 🎯 Exemple : Liste animée de transactions

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { listContainer, listItem } from '@/lib/animations';

export function TransactionList({ transactions }) {
  return (
    <motion.div 
      variants={listContainer} 
      initial="hidden" 
      animate="visible"
    >
      <AnimatePresence>
        {transactions.map((tx, index) => (
          <motion.div
            key={tx.id}
            variants={listItem}
            whileHover={{ scale: 1.02, x: 4 }}
            className="p-4 border rounded-xl mb-2"
          >
            <div className="flex justify-between">
              <span>{tx.description}</span>
              <span className="font-bold">{tx.amount} XAF</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}
```

### 🎯 Exemple : Boutons d'action rapide

```tsx
import { motion } from 'framer-motion';
import Link from 'next/link';

export function QuickActions() {
  return (
    <div className="flex gap-2">
      {actions.map((action, i) => (
        <Link key={action.href} href={action.href}>
          <motion.button
            whileHover={{ scale: 1.05, rotate: 2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.1 }}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl"
          >
            {action.icon}
            {action.label}
          </motion.button>
        </Link>
      ))}
    </div>
  );
}
```

---

## 🎨 Variants Disponibles

| Nom | Description | Usage |
|-----|-------------|-------|
| `fadeInUp` | Apparition depuis le bas | Sections de page |
| `fadeInDown` | Apparition depuis le haut | Headers, titres |
| `fadeInLeft` | Apparition depuis la gauche | Navigation latérale |
| `fadeInRight` | Apparition depuis la droite | Panneaux latéraux |
| `scaleIn` | Zoom d'apparition | Modales, popups |
| `popIn` | Bounce élastique | Éléments importants |
| `cardHover` | Effet lift au survol | Cartes interactives |
| `listContainer` | Conteneur pour listes | Parent des listes |
| `listItem` | Item de liste animé | Enfant de liste |
| `progressBar` | Barre de progression | Indicateurs de progression |
| `transactionSlide` | Animation de transaction | Lignes de transactions |
| `alertSlide` | Animation d'alerte | Notifications |
| `pageTransition` | Transition de page | Changements de route |

---

## 🚀 Micro-interactions

### Effets au survol

```tsx
<motion.div
  whileHover={{ scale: 1.05, rotate: 2 }}
  transition={{ duration: 0.2 }}
>
  Survolez-moi
</motion.div>
```

### Effets au clic

```tsx
<motion.button
  whileTap={{ scale: 0.95 }}
>
  Cliquez-moi
</motion.button>
```

### Rotation d'icône

```tsx
<motion.div
  whileHover={{ rotate: 15 }}
  transition={{ duration: 0.2 }}
>
  <Bell />
</motion.div>
```

### Shake (attention)

```tsx
<motion.div
  animate={{ x: [0, -10, 10, -10, 10, 0] }}
  transition={{ duration: 0.5 }}
>
  Attention !
</motion.div>
```

---

## ⚙️ Configuration & Performance

### Désactiver les animations sur mobile

```tsx
import { useMediaQuery } from '@/hooks/useMediaQuery';

function MyComponent() {
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
  
  return (
    <motion.div
      animate={prefersReducedMotion ? {} : { opacity: 1, y: 0 }}
    >
      Contenu
    </motion.div>
  );
}
```

### Optimisation des performances

```tsx
// Utilisez layout animations pour les changements de position
<motion.div layout>
  {items.map(item => (
    <motion.div key={item.id} layout>
      {item.name}
    </motion.div>
  ))}
</motion.div>
```

---

## 🎯 Prochaines Étapes

### Animations à ajouter aux autres pages :

1. **Page Income** - Formulaire avec animations + toast de confirmation
2. **Page Expense** - Allocateur animé + feedback visuel
3. **Page Transfer** - Animation de flèche entre enveloppes
4. **Page Analytics** - Graphiques animés (Recharts)
5. **Page Alerts** - Liste animée avec suppression fluide

### Composants à créer :

- `AnimatedInput` - Champs de formulaire avec validation animée
- `AnimatedSelect` - Dropdown avec animations
- `AnimatedModal` - Modales avec overlay animé
- `AnimatedTable` - Tableaux avec tri animé

---

## 📚 Ressources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Sonner Docs](https://sonner.emilkowal.ski/)
- [Auto-Animate Docs](https://auto-animate.formkit.com/)

---

✨ **Votre application est maintenant beaucoup plus vivante et engageante !**


