# 📖 GUIDE D'UTILISATION - GESTIFIN

## 🌟 Guide Visuel Complet de Votre Application

Bienvenue dans votre application de gestion financière personnelle ultra-moderne ! Ce guide vous explique comment utiliser chaque fonctionnalité.

---

## 🎯 Table des Matières

1. [Dashboard](#-dashboard)
2. [Ajouter un Revenu](#-ajouter-un-revenu)
3. [Créer une Dépense](#-créer-une-dépense)
4. [Transférer de l'Argent](#-transférer-de-largent)
5. [Consulter une Enveloppe](#-consulter-une-enveloppe)
6. [Analyser vos Finances](#-analyser-vos-finances)
7. [Gérer vos Services](#-gérer-vos-services)
8. [Paramètres](#-paramètres)

---

## 🏠 Dashboard

**URL** : `http://localhost:3000/dashboard`

### Vue d'ensemble

Le dashboard est votre centre de contrôle financier. Il affiche :

#### 1. KPIs Animés (4 métriques clés)

```
┌─────────────────────┬─────────────────────┐
│ 💰 Solde Total      │ 📈 Revenus Mois     │
│ 125,000 XAF         │ 75,000 XAF          │
│ ▲ 12% ce mois      │ ▲ 8% vs mois dernier│
├─────────────────────┼─────────────────────┤
│ 💸 Dépenses Mois    │ 📊 Marge            │
│ 50,000 XAF          │ 25,000 XAF          │
│ ▼ 5% vs mois dernier│ ▲ 20% ce mois      │
└─────────────────────┴─────────────────────┘
```

**Animations** :
- ✨ Les chiffres comptent de 0 → valeur réelle (1.2s)
- 🎨 Hover effect : léger agrandissement

#### 2. Actions Rapides

```
┌──────────────────────────────────────────────┐
│ [💰 Revenus] [💸 Dépenses] [🔄 Transferts]  │
└──────────────────────────────────────────────┘
```

**Raccourcis** :
- **Revenus** → `/income`
- **Dépenses** → `/expense`
- **Transferts** → `/transfer`

#### 3. Mini Graphique (7 derniers jours)

```
📈 Évolution du solde (7 jours)
─────────────────────────────────────
      ●──●
     /    \
    ●      ●──●
           
J-7  J-5  J-3  J-1  Auj
```

**Features** :
- Tooltip au survol : date + montant exact
- Animation : ligne se dessine en 1.5s

#### 4. Enveloppes Principales

```
┌─────────────────────────────────────────┐
│ 🏠 Logement                    35,000 XAF│
│ ▓▓▓▓▓▓▓▓▓▓▓░░░░ 70%                    │
│ Budget : 50,000 XAF                      │
├─────────────────────────────────────────┤
│ 🍔 Alimentation                12,500 XAF│
│ ▓▓▓▓▓▓░░░░░░░░░ 50%                    │
│ Budget : 25,000 XAF                      │
└─────────────────────────────────────────┘
```

**Animations** :
- Cascade : apparition de haut en bas (0.1s de décalage)
- Barres : remplissage animé (1s)
- Hover : surélévation

#### 5. Dernières Transactions

```
📋 Dernières transactions (10)

[🟢 ENTRÉE ] Salaire       75,000 XAF  28/10
[🔴 SORTIE ] Courses       12,000 XAF  27/10
[🔵 TRANSF.] Loyer → Épargne 5,000 XAF  26/10
```

#### 6. Alertes

```
🔔 Alertes (5 non lues)

⚠️ Logement à 85% du budget
⚠️ Alimentation dépassée de 2,500 XAF
```

---

## 💰 Ajouter un Revenu

**URL** : `http://localhost:3000/income`

### Étapes

#### 1. Remplir le Formulaire

```
┌────────────────────────────────────────┐
│ 💰 Montant de l'entrée (XAF)          │
│ ┌────────────────────────────────────┐ │
│ │ 50000                              │ │
│ └────────────────────────────────────┘ │
│ Minimum 100 XAF                        │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 💼 Source de revenu (optionnel)       │
│ ┌────────────────────────────────────┐ │
│ │ [Sélectionner]   ▼                 │ │
│ └────────────────────────────────────┘ │
│ • Salaire                              │
│ • Freelance                            │
│ • Autre                                │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 📅 Date                                │
│ ┌────────────────────────────────────┐ │
│ │ 2025-10-28                         │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ 📝 Description (optionnel)             │
│ ┌────────────────────────────────────┐ │
│ │ Salaire du mois d'octobre...       │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

#### 2. Prévisualisation Animée

Dès que vous tapez un montant, vous voyez :

```
┌─────────────────────────────────────────┐
│ 📊 Répartition estimée :                │
│                                          │
│ Logement (35%)       17,500 XAF          │
│ Alimentation (25%)   12,500 XAF          │
│ Transport (15%)       7,500 XAF          │
│ Loisirs (10%)         5,000 XAF          │
│ Épargne (15%)         7,500 XAF          │
│                                          │
│ TOTAL              50,000 XAF            │
└─────────────────────────────────────────┘
```

**Features** :
- Calcul en temps réel
- Formatage automatique (séparateurs de milliers)

#### 3. Soumettre

```
[Enregistrer l'entrée] ← Bouton animé
```

**Animation** :
- Loading spinner pendant l'envoi
- Toast de succès : "✅ Entrée enregistrée avec succès !"
- Redirection auto vers `/dashboard`

---

## 💸 Créer une Dépense

**URL** : `http://localhost:3000/expense`

### Interface Révolutionnaire : Allocateur Visuel

#### 1. Montant Total

```
┌────────────────────────────────────────┐
│ 💸 Montant total de la dépense         │
│ ┌────────────────────────────────────┐ │
│ │ 25000                              │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘
```

#### 2. Allocateur Visuel ⭐

```
┌──────────────────────────────────────────────────┐
│ 🎯 Allocateur de dépenses                        │
│                                                   │
│ [Répartir équitablement]  [+ Ajouter]           │
│                                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Enveloppe : [Logement ▼]   Montant : 15000  │ │
│ │ ▓▓▓▓▓▓▓▓▓▓▓▓░░░░ 60% du total              │ │
│ │                                         [X]  │ │
│ └──────────────────────────────────────────────┘ │
│                                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Enveloppe : [Aliment. ▼]   Montant : 10000  │ │
│ │ ▓▓▓▓▓▓▓▓░░░░░░░░ 40% du total              │ │
│ │                                         [X]  │ │
│ └──────────────────────────────────────────────┘ │
│                                                   │
│ ┌──────────────────────────────────────────────┐ │
│ │ Total alloué  : 25,000 XAF          ✅       │ │
│ │ Reste à allouer : 0 XAF                      │ │
│ └──────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────┘
```

**Features** :
- ➕ **Ajouter** : Ajouter une allocation
- ❌ **Supprimer** : Supprimer (minimum 1)
- ⚖️ **Répartir équitablement** : Divise le montant équitablement

**Animations** :
- Apparition : slide de gauche + scale
- Disparition : slide vers droite + fade
- Barres : remplissage progressif

#### 3. Graphique Répartition

```
🥧 Répartition de la dépense

      Logement
       60%
         ●
        / \
       /   \
      ●─────●
  Aliment.  Autres
    40%
```

**Interactif** :
- Tooltip : nom + montant + %
- Légende cliquable

#### 4. Soumettre

```
[Enregistrer la dépense]  [Annuler]
```

**Validations** :
- ❌ Total alloué = 0 → Erreur
- ⚠️ Total alloué ≠ Montant saisi → Warning
- ✅ Tout OK → Toast succès

---

## 🔄 Transférer de l'Argent

**URL** : `http://localhost:3000/transfer`

### Animation de Flèche Visuelle ⭐

#### 1. Formulaire

```
┌────────────────────────────────────────┐
│ 💰 Montant à transférer                │
│ ┌────────────────────────────────────┐ │
│ │ 5000                               │ │
│ └────────────────────────────────────┘ │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Depuis l'enveloppe                      │
│ [Logement (35,000 XAF) ▼]              │
└────────────────────────────────────────┘

┌────────────────────────────────────────┐
│ Vers l'enveloppe                        │
│ [Alimentation (12,500 XAF) ▼]          │
└────────────────────────────────────────┘
```

#### 2. Prévisualisation Animée ⭐

```
┌──────────────────────────────────────────────────┐
│ 🔄 Prévisualisation du transfert                │
│                                                   │
│  ┌──────────┐      ┌──────┐      ┌──────────┐  │
│  │ LOGEMENT │ ──→  │ 💰   │  ──→ │ALIMENTAT.│  │
│  │          │      │5000  │      │          │  │
│  │ 35,000   │      └──────┘      │ 12,500   │  │
│  └──────────┘                    └──────────┘  │
│                                                   │
│  Après:                           Après:         │
│  30,000 XAF ↓                    17,500 XAF ↑   │
└──────────────────────────────────────────────────┘
```

**Animations** :
- 🔴 Source : bordure rouge
- 🟢 Destination : bordure verte
- ➡️ Flèche : mouvement de va-et-vient infini
- 💰 Badge montant : apparition en scale

**Validation** :
- ⚠️ Montant > Solde source → Message warning

#### 3. Soumettre

```
[Effectuer le transfert]  [Annuler]
```

---

## 📦 Consulter une Enveloppe

**URL** : `http://localhost:3000/envelopes/1`

### Vue Détaillée Complète

#### 1. En-tête

```
← Retour au dashboard

┌─────────────────────────────────────────┐
│ 🏠 LOGEMENT              [🔒 Protégée]  │
└─────────────────────────────────────────┘
```

#### 2. Métriques Principales

```
┌───────────┬───────────┬───────────┬──────────┐
│ Budget    │ Solde     │ Dépenses  │ Util.    │
│ Mensuel   │ Actuel    │ Totales   │          │
├───────────┼───────────┼───────────┼──────────┤
│ 50,000    │ 35,000    │ 125,000   │ 70%      │
│ XAF       │ XAF       │ XAF       │          │
│ 35% rev.  │ ▲ Positif │ Tout      │ ▓▓▓▓▓▓░░ │
└───────────┴───────────┴───────────┴──────────┘
```

**Code couleur** :
- 🔵 Budget : bleu
- 🟢 Solde positif : vert
- 🔴 Solde négatif : rouge
- 🟠 Dépenses : orange
- 🟣 Utilisation : violet

#### 3. Barre de Progression

```
Progression du budget                      70%
▓▓▓▓▓▓▓▓▓▓▓▓▓▓░░░░░░
```

**Couleurs** :
- < 70% : vert
- 70-90% : orange
- > 90% : rouge

#### 4. Graphique Évolution (6 mois)

```
📈 Flux des 6 derniers mois

30K ─┐    ●
    │   / \
20K ─┤  /   ●──●
    │ /
10K ─●──────────────
    └──┬──┬──┬──┬──
     Mai Jun Jul Aou Sep Oct

─── Entrées (vert)
─── Dépenses (rouge)
```

#### 5. Historique Transactions

```
📋 Historique des transactions

┌──────────────────────────────────────────────┐
│ [🟢 Entrée]  28/10/2025                      │
│ Salaire                                      │
│ Total: 75,000 XAF  →  +26,250 XAF reçu       │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ [🔴 Dépense]  26/10/2025                     │
│ Loyer                                        │
│ Total: 15,000 XAF                            │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ [🔵 Transfert]  25/10/2025                   │
│ Vers Épargne                                 │
│ Total: 5,000 XAF                             │
└──────────────────────────────────────────────┘
```

**Pagination** :
```
[1] [2] [3] ... [10]  (20 transactions/page)
```

---

## 📊 Analyser vos Finances

**URL** : `http://localhost:3000/analytics`

### Interface Analytique Complète

#### 1. Filtre par Mois

```
┌─────────────────────────────────────┐
│ 📅 Filtrer par mois                 │
│                                      │
│ Mois : [2025-10 ▼]    [Afficher]   │
└─────────────────────────────────────┘
```

#### 2. KPIs Comparatifs

```
┌──────────┬──────────┬──────────┬──────────┐
│ Revenus  │ Dépenses │ Marge    │ Taux     │
├──────────┼──────────┼──────────┼──────────┤
│ 75,000   │ 50,000   │ 25,000   │ 33%      │
│ ▲ 12%    │ ▼ 5%     │ ▲ 20%    │ ▲ 8%     │
└──────────┴──────────┴──────────┴──────────┘
```

**Légende** :
- ▲ vert : hausse vs mois précédent
- ▼ rouge : baisse vs mois précédent

#### 3. Graphique d'Évolution (6 mois)

```
📈 Évolution Mensuelle (6 derniers mois)

80K ─┐       ●──●
    │      /    
60K ─┤     ●     
    │    /      
40K ─┤   ●       
    │  /        
20K ─●──────────────
    └─┬──┬──┬──┬──
    Mai Jun Jul Aou Sep Oct

─── Revenus (vert)
─── Dépenses (rouge)
```

**Interactif** :
- Hover → Tooltip avec valeurs exactes
- Légende cliquable → masquer/afficher

#### 4. Comparaison Bar Chart

```
📊 Comparaison Revenus vs Dépenses (Oct)

Revenus   ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  75,000
Dépenses  ▓▓▓▓▓▓▓▓▓▓       50,000

         0K    25K    50K    75K   100K
```

#### 5. Pie Chart Top 6 Enveloppes

```
🥧 Répartition des Dépenses (Oct)

        Logement
          30%
          ●
         / \
        /   \
       ●─────●
   Aliment. Transport
     25%      20%
```

#### 6. Tableau Détaillé

```
┌───────────────┬──────────┬──────────┐
│ Enveloppe     │ Entrées  │ Sorties  │
├───────────────┼──────────┼──────────┤
│ Logement      │ 26,250   │ 15,000   │
│ Alimentation  │ 18,750   │ 12,500   │
│ Transport     │ 11,250   │ 10,000   │
│ Loisirs       │  7,500   │  5,000   │
│ Épargne       │ 11,250   │  2,500   │
└───────────────┴──────────┴──────────┘
```

#### 7. Export

```
📥 Exporter les données

[Télécharger CSV]  [Générer PDF]
```

---

## 🛠️ Gérer vos Services

**URL** : `http://localhost:3000/services`

### Liste des Services

```
┌─────────────────────────────────────────┐
│ 💼 Mes Sources de Revenus               │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ 💰 Salaire                       │   │
│ │ Principal                        │   │
│ │                          [Éditer]│   │
│ └──────────────────────────────────┘   │
│                                          │
│ ┌──────────────────────────────────┐   │
│ │ 💻 Freelance                     │   │
│ │ Occasionnel                      │   │
│ │                          [Éditer]│   │
│ └──────────────────────────────────┘   │
│                                          │
│ [+ Nouveau Service]                     │
└─────────────────────────────────────────┘
```

### Créer un Service

```
┌─────────────────────────────────────┐
│ Nom du service                      │
│ ┌─────────────────────────────────┐ │
│ │ Freelance Web                   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘

[Créer]  [Annuler]
```

---

## ⚙️ Paramètres

### Budget (`/settings/budget`)

```
┌─────────────────────────────────────────┐
│ 💼 Gestion des Enveloppes               │
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ 🏠 Logement                          ││
│ │ Budget: 50,000 XAF     35%           ││
│ │ [Éditer]                             ││
│ └──────────────────────────────────────┘│
│                                          │
│ ┌──────────────────────────────────────┐│
│ │ 🍔 Alimentation                      ││
│ │ Budget: 25,000 XAF     25%           ││
│ │ [Éditer]                             ││
│ └──────────────────────────────────────┘│
│                                          │
│ TOTAL: 100%                              │
│                                          │
│ [+ Nouvelle Enveloppe]                  │
└─────────────────────────────────────────┘
```

### Revenus (`/settings/revenue`)

```
┌─────────────────────────────────────────┐
│ 💰 Configuration des Revenus            │
│                                          │
│ Pourcentages par défaut :                │
│                                          │
│ Logement      : [35] %                   │
│ Alimentation  : [25] %                   │
│ Transport     : [15] %                   │
│ Loisirs       : [10] %                   │
│ Épargne       : [15] %                   │
│                                          │
│ TOTAL         : 100%  ✅                │
│                                          │
│ [Sauvegarder]                           │
└─────────────────────────────────────────┘
```

---

## 🎨 Raccourcis Clavier (Prochainement)

```
Ctrl + D  → Dashboard
Ctrl + I  → Income
Ctrl + E  → Expense
Ctrl + T  → Transfer
Ctrl + A  → Analytics
Ctrl + /  → Recherche
```

---

## 📱 Version Mobile (Responsive)

L'application est **100% responsive** :

### Mobile

```
┌───────────────┐
│ ☰  GestiFin   │
├───────────────┤
│               │
│  💰 Solde     │
│  125,000      │
│               │
│  ▼            │
│               │
│  Enveloppes   │
│  [Liste]      │
│               │
│  ▼            │
│               │
│  Transactions │
│  [Liste]      │
│               │
└───────────────┘
```

### Tablet

```
┌───────────────────────────┐
│ GestiFin          [Menu]  │
├───────────────────────────┤
│ ┌─────────┬─────────┐     │
│ │ KPI 1   │ KPI 2   │     │
│ ├─────────┼─────────┤     │
│ │ KPI 3   │ KPI 4   │     │
│ └─────────┴─────────┘     │
│                            │
│ Enveloppes [Grille]       │
│                            │
│ Transactions [Liste]      │
└───────────────────────────┘
```

---

## 🎯 Bonnes Pratiques

### 1. Enregistrer vos Revenus

✅ **Quand** : Dès réception (salaire, freelance, etc.)

✅ **Pourquoi** : Allocation automatique dans les enveloppes

### 2. Catégoriser vos Dépenses

✅ **Toujours** utiliser l'allocateur visuel

✅ **Fractionner** les dépenses mixtes

**Exemple** :
```
Courses 25,000 XAF :
• Alimentation : 20,000
• Hygiène      : 5,000
```

### 3. Transférer Intelligemment

✅ Éviter les découverts

✅ Privilégier épargne → enveloppes (pas l'inverse)

### 4. Consulter Analytics

✅ **1x/semaine** : Vérifier tendances

✅ **Fin de mois** : Analyser détails

---

## 🆘 Dépannage

### Problème : "Solde insuffisant"

**Solution** :
1. Vérifier solde source
2. Réduire montant
3. OU transférer depuis autre enveloppe

### Problème : "Allocations incorrectes"

**Solution** :
1. Utiliser "Répartir équitablement"
2. Ajuster manuellement
3. Vérifier total = 100%

### Problème : "Graphiques ne chargent pas"

**Solution** :
1. Rafraîchir la page (F5)
2. Vider cache navigateur
3. Vérifier connexion internet

---

## 🎊 Conseils Pro

### 💎 Optimiser votre Budget

1. **Règle 50/30/20** :
   - 50% Besoins (logement, aliment.)
   - 30% Envies (loisirs)
   - 20% Épargne

2. **Enveloppes Protégées** :
   - Marquer épargne comme "protégée"
   - Éviter transferts impulsifs

3. **Révision Mensuelle** :
   - Ajuster pourcentages selon dépenses réelles
   - Identifier postes à réduire

### 📊 Utiliser les Graphiques

1. **Line Chart** : Tendances long terme
2. **Bar Chart** : Comparaisons mensuelles
3. **Pie Chart** : Répartition dépenses

### ⚡ Gestes Rapides

1. **Dashboard** : Cliquer KPI → Page détaillée
2. **Enveloppes** : Cliquer nom → Vue détaillée
3. **Transactions** : Hover → Actions rapides

---

## 🌟 Fonctionnalités à Explorer

### Déjà Disponibles

✅ Animations fluides partout  
✅ Graphiques interactifs  
✅ Allocateur visuel dépenses  
✅ Transferts animés  
✅ Vues détaillées enveloppes  
✅ Analytics complet  
✅ Export CSV/PDF  

### Prochainement (Optionnel)

🔜 Dark mode  
🔜 Multi-devises  
🔜 Objectifs d'épargne  
🔜 Budgets prévisionnels  
🔜 Notifications push  
🔜 Export Excel avancé  

---

## 📞 Support

### Documentation

- **Animations** : `ANIMATIONS_GUIDE.md`
- **Graphiques** : `GRAPHIQUES_GUIDE.md`
- **Formulaires** : `PHASE3_GUIDE.md`
- **Récapitulatif** : `PROJET_COMPLETE.md`

### Ressources Externes

- Framer Motion : https://www.framer.com/motion/
- Recharts : https://recharts.org/
- React Hook Form : https://react-hook-form.com/
- TanStack Query : https://tanstack.com/query/

---

## 🎉 Profitez de GestiFin !

Votre application est **prête** et **optimisée** pour gérer vos finances comme un pro ! 🚀

**Bon budget ! 💰✨**


