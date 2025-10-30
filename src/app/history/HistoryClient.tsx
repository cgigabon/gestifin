'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  History,
  Search,
  Filter,
  ArrowUpCircle,
  ArrowDownCircle,
  Shuffle,
  Wallet,
  Wrench,
  Settings,
  Trash2,
  Edit,
  Archive,
  CheckCircle,
  XCircle,
  AlertCircle,
  Clock,
  Calendar,
  TrendingUp,
  DollarSign,
  Package,
  Lock,
  Unlock,
  Plus,
  Minus,
  ChevronRight,
} from 'lucide-react';
import { listContainer, listItem } from '@/lib/animations';
import { format, formatDistanceToNow, isToday, isYesterday, parseISO } from 'date-fns';
import { fr } from 'date-fns/locale';
import type { EnrichedAuditLog } from './page';

interface HistoryClientProps {
  logs: EnrichedAuditLog[];
}

// Configuration des actions pour affichage
const ACTION_CONFIG: Record<string, { 
  icon: React.ReactNode; 
  label: string; 
  color: string;
  bgColor: string;
  gradient: string;
}> = {
  // Transactions
  'transaction.create': { 
    icon: <DollarSign size={18} />, 
    label: 'Transaction créée', 
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  'transaction.delete': { 
    icon: <Trash2 size={18} />, 
    label: 'Transaction supprimée', 
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    gradient: 'from-red-500/10 to-rose-500/10'
  },
  'income.create': { 
    icon: <ArrowUpCircle size={18} />, 
    label: 'Entrée enregistrée', 
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  'expense.create': { 
    icon: <ArrowDownCircle size={18} />, 
    label: 'Dépense enregistrée', 
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    gradient: 'from-red-500/10 to-rose-500/10'
  },
  'transfer.create': { 
    icon: <Shuffle size={18} />, 
    label: 'Transfert effectué', 
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500/10 to-cyan-500/10'
  },
  
  // Enveloppes
  'envelope.create': { 
    icon: <Plus size={18} />, 
    label: 'Enveloppe créée', 
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    gradient: 'from-purple-500/10 to-pink-500/10'
  },
  'envelope.update': { 
    icon: <Edit size={18} />, 
    label: 'Enveloppe modifiée', 
    color: 'text-orange-700 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-900/20',
    gradient: 'from-orange-500/10 to-amber-500/10'
  },
  'envelope.delete': { 
    icon: <Trash2 size={18} />, 
    label: 'Enveloppe supprimée', 
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    gradient: 'from-red-500/10 to-rose-500/10'
  },
  'envelope.archive': { 
    icon: <Archive size={18} />, 
    label: 'Enveloppe archivée', 
    color: 'text-zinc-700 dark:text-zinc-400',
    bgColor: 'bg-zinc-50 dark:bg-zinc-900/20',
    gradient: 'from-zinc-500/10 to-slate-500/10'
  },
  'envelope.percentages': { 
    icon: <TrendingUp size={18} />, 
    label: 'Pourcentages ajustés', 
    color: 'text-blue-700 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    gradient: 'from-blue-500/10 to-indigo-500/10'
  },
  
  // Services
  'service.create': { 
    icon: <Plus size={18} />, 
    label: 'Service créé', 
    color: 'text-indigo-700 dark:text-indigo-400',
    bgColor: 'bg-indigo-50 dark:bg-indigo-900/20',
    gradient: 'from-indigo-500/10 to-violet-500/10'
  },
  'service.toggle': { 
    icon: <CheckCircle size={18} />, 
    label: 'Service modifié', 
    color: 'text-yellow-700 dark:text-yellow-400',
    bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    gradient: 'from-yellow-500/10 to-amber-500/10'
  },
  'service.delete': { 
    icon: <Trash2 size={18} />, 
    label: 'Service supprimé', 
    color: 'text-red-700 dark:text-red-400',
    bgColor: 'bg-red-50 dark:bg-red-900/20',
    gradient: 'from-red-500/10 to-rose-500/10'
  },
  
  // Configuration
  'config.onboarding': { 
    icon: <Settings size={18} />, 
    label: 'Configuration initiale', 
    color: 'text-teal-700 dark:text-teal-400',
    bgColor: 'bg-teal-50 dark:bg-teal-900/20',
    gradient: 'from-teal-500/10 to-cyan-500/10'
  },
  'config.budget': { 
    icon: <Wallet size={18} />, 
    label: 'Budget configuré', 
    color: 'text-purple-700 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-900/20',
    gradient: 'from-purple-500/10 to-fuchsia-500/10'
  },
  'config.revenue': { 
    icon: <TrendingUp size={18} />, 
    label: 'Baseline revenus', 
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-900/20',
    gradient: 'from-green-500/10 to-emerald-500/10'
  },
  
  // Défaut
  'default': { 
    icon: <AlertCircle size={18} />, 
    label: 'Action', 
    color: 'text-zinc-700 dark:text-zinc-400',
    bgColor: 'bg-zinc-50 dark:bg-zinc-900/20',
    gradient: 'from-zinc-500/10 to-slate-500/10'
  },
};

// Catégories pour le filtre
const CATEGORIES = [
  { value: 'all', label: 'Toutes les actions', icon: <Package size={14} /> },
  { value: 'transaction', label: 'Transactions', icon: <DollarSign size={14} /> },
  { value: 'envelope', label: 'Enveloppes', icon: <Wallet size={14} /> },
  { value: 'service', label: 'Services', icon: <Wrench size={14} /> },
  { value: 'config', label: 'Configurations', icon: <Settings size={14} /> },
];

// Formater un montant en XAF
function formatAmount(amount: number | null | undefined): string {
  if (!amount) return '—';
  return new Intl.NumberFormat('fr-GA', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount) + ' XAF';
}

// Formater une date de manière intelligente
function formatSmartDate(dateString: string | Date): { relative: string; absolute: string } {
  // Gérer à la fois les strings ISO et les objets Date
  const date = typeof dateString === 'string' ? parseISO(dateString) : new Date(dateString);
  
  let relative = '';
  if (isToday(date)) {
    relative = `Aujourd'hui à ${format(date, 'HH:mm', { locale: fr })}`;
  } else if (isYesterday(date)) {
    relative = `Hier à ${format(date, 'HH:mm', { locale: fr })}`;
  } else {
    relative = formatDistanceToNow(date, { addSuffix: true, locale: fr });
  }
  
  const absolute = format(date, "dd MMMM yyyy 'à' HH:mm", { locale: fr });
  
  return { relative, absolute };
}

// Composant pour afficher les détails enrichis
function EnrichedDetails({ log }: { log: EnrichedAuditLog }) {
  // Parser les métadonnées si disponibles
  const parseMetaIfNeeded = () => {
    if (!log.meta) return null;
    if (typeof log.meta === 'string') {
      try {
        return JSON.parse(log.meta);
      } catch {
        return null;
      }
    }
    return log.meta;
  };

  // Vérifier si le texte est du JSON (pour ne pas l'afficher brut)
  const isJsonString = (text: string | null): boolean => {
    if (!text) return false;
    const trimmed = text.trim();
    return (trimmed.startsWith('{') && trimmed.endsWith('}')) || 
           (trimmed.startsWith('[') && trimmed.endsWith(']'));
  };

  // Obtenir des détails lisibles (pas de JSON brut)
  const getReadableDetails = (): string | null => {
    if (!log.details) return null;
    if (isJsonString(log.details)) return null; // Masquer le JSON brut
    return log.details;
  };

  const renderDetails = () => {
    // Transactions
    if (log.action === 'income.create' || log.action === 'expense.create' || log.action === 'transaction.create') {
      return (
        <div className="space-y-3">
          {log.transaction_montant && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Montant</span>
              <span className={`text-xl font-bold ${
                log.transaction_type === 'ENTREE' 
                  ? 'text-green-700 dark:text-green-400' 
                  : 'text-red-700 dark:text-red-400'
              }`}>
                {log.transaction_type === 'ENTREE' ? '+' : '-'} {formatAmount(log.transaction_montant)}
              </span>
            </div>
          )}
          {log.transaction_service && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Service</span>
              <Badge variant="default" className="font-medium">
                <Wrench size={12} className="mr-1" />
                {log.transaction_service}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    // Transferts
    if (log.action === 'transfer.create') {
      const meta = parseMetaIfNeeded();
      const amount = log.transfer_amount || meta?.montant || meta?.amount;
      const fromEnv = log.from_envelope || meta?.sourceId || meta?.from;
      const toEnv = log.to_envelope || meta?.targetId || meta?.to;

      return (
        <div className="space-y-3">
          {amount && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Montant transféré</span>
              <span className="text-xl font-bold text-blue-700 dark:text-blue-400">
                {formatAmount(amount)}
              </span>
            </div>
          )}
          {(fromEnv || toEnv) && (
            <div className="flex items-center justify-center gap-3 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800">
              <Badge variant="default" className="px-3 py-1.5 text-sm font-semibold">
                {fromEnv || 'Source'}
              </Badge>
              <ChevronRight size={20} className="text-blue-600 dark:text-blue-400" />
              <Badge variant="default" className="px-3 py-1.5 text-sm font-semibold">
                {toEnv || 'Destination'}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    // Enveloppes
    if (log.entity === 'envelope') {
      return (
        <div className="space-y-3">
          {log.envelope_name && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Nom de l'enveloppe</span>
              <Badge variant="default" className="font-semibold text-sm px-3 py-1.5">
                <Wallet size={14} className="mr-1.5" />
                {log.envelope_name}
              </Badge>
            </div>
          )}
          {log.envelope_budget && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Budget mensuel</span>
              <span className="text-lg font-bold text-purple-700 dark:text-purple-400">
                {formatAmount(log.envelope_budget)}
              </span>
            </div>
          )}
        </div>
      );
    }

    // Services
    if (log.entity === 'service') {
      return (
        <div className="space-y-3">
          {log.service_name && (
            <div className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">Nom du service</span>
              <Badge variant="default" className="font-semibold text-sm px-3 py-1.5">
                <Wrench size={14} className="mr-1.5" />
                {log.service_name}
              </Badge>
            </div>
          )}
        </div>
      );
    }

    // Configuration
    if (log.entity === 'config') {
      const meta = parseMetaIfNeeded();
      
      if (meta) {
        return (
          <div className="space-y-2 p-3 rounded-lg bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 border border-teal-200 dark:border-teal-800">
            {Object.entries(meta).map(([key, value]: [string, any]) => {
              // Ignorer les clés système
              if (key === 'timestamp' || key === 'user_id') return null;
              
              return (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-teal-700 dark:text-teal-300 font-medium capitalize">
                    {key.replace(/_/g, ' ')}
                  </span>
                  <span className="text-teal-900 dark:text-teal-100 font-semibold">
                    {typeof value === 'number' ? formatAmount(value) : String(value)}
                  </span>
                </div>
              );
            })}
          </div>
        );
      }
    }

    // Ne rien afficher si pas de données pertinentes
    return null;
  };

  const details = renderDetails();
  
  if (!details) return null;

  return <div className="mt-3">{details}</div>;
}

export function HistoryClient({ logs }: HistoryClientProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Filtrage des logs
  const filteredLogs = useMemo(() => {
    let filtered = logs;

    // Filtre par catégorie
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(log => log.entity === categoryFilter);
    }

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(log => 
        log.action.toLowerCase().includes(search) ||
        log.entity.toLowerCase().includes(search) ||
        log.details?.toLowerCase().includes(search) ||
        log.entity_id?.toLowerCase().includes(search) ||
        log.transaction_service?.toLowerCase().includes(search) ||
        log.envelope_name?.toLowerCase().includes(search) ||
        log.service_name?.toLowerCase().includes(search)
      );
    }

    // Filtre par date
    if (dateFilter !== 'all') {
      const now = new Date();
      filtered = filtered.filter(log => {
        // Gérer à la fois string et Date
        const logDate = typeof log.created_at === 'string' 
          ? new Date(log.created_at) 
          : new Date(log.created_at);
        const diffMs = now.getTime() - logDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);

        if (dateFilter === 'today') return diffDays < 1;
        if (dateFilter === 'week') return diffDays < 7;
        if (dateFilter === 'month') return diffDays < 30;
        return true;
      });
    }

    return filtered;
  }, [logs, searchTerm, categoryFilter, dateFilter]);

  const getActionConfig = (action: string) => {
    return ACTION_CONFIG[action] || ACTION_CONFIG['default'];
  };

  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête amélioré */}
      <AnimatedCard delay={0}>
        <div className="flex items-start gap-4 mb-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 flex items-center justify-center shadow-lg">
            <History className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-1">
              Historique des Actions
            </h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Traçabilité complète de toutes vos opérations dans GestiFin
            </p>
          </div>
        </div>

        {/* Statistiques rapides améliorées */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border border-blue-200 dark:border-blue-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Package size={16} className="text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-medium text-blue-600 dark:text-blue-400">Total</span>
            </div>
            <div className="text-3xl font-bold text-blue-700 dark:text-blue-300">{logs.length}</div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <DollarSign size={16} className="text-green-600 dark:text-green-400" />
              <span className="text-xs font-medium text-green-600 dark:text-green-400">Transactions</span>
            </div>
            <div className="text-3xl font-bold text-green-700 dark:text-green-300">
              {logs.filter(l => l.entity === 'transaction').length}
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wallet size={16} className="text-purple-600 dark:text-purple-400" />
              <span className="text-xs font-medium text-purple-600 dark:text-purple-400">Enveloppes</span>
            </div>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-300">
              {logs.filter(l => l.entity === 'envelope').length}
            </div>
          </motion.div>

          <motion.div 
            className="p-4 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border border-orange-200 dark:border-orange-800"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <Wrench size={16} className="text-orange-600 dark:text-orange-400" />
              <span className="text-xs font-medium text-orange-600 dark:text-orange-400">Services</span>
            </div>
            <div className="text-3xl font-bold text-orange-700 dark:text-orange-300">
              {logs.filter(l => l.entity === 'service').length}
            </div>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Filtres améliorés */}
      <AnimatedCard delay={0.1}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recherche */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
              <Search size={16} className="text-blue-500" />
              <span className="font-semibold">Rechercher</span>
            </Label>
            <Input
              placeholder="Action, service, montant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700"
            />
          </div>

          {/* Filtre par catégorie */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
              <Filter size={16} className="text-purple-500" />
              <span className="font-semibold">Catégorie</span>
            </Label>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-purple-500 transition-all"
            >
              {CATEGORIES.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Filtre par date */}
          <div>
            <Label className="flex items-center gap-2 mb-2 text-zinc-700 dark:text-zinc-300">
              <Calendar size={16} className="text-orange-500" />
              <span className="font-semibold">Période</span>
            </Label>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full h-10 px-3 rounded-xl border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 focus:ring-2 focus:ring-orange-500 transition-all"
            >
              <option value="all">Toutes les dates</option>
              <option value="today">Aujourd'hui</option>
              <option value="week">Cette semaine</option>
              <option value="month">Ce mois</option>
            </select>
          </div>
        </div>

        {/* Actions rapides */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
          <Button
            size="sm"
            variant="default"
            onClick={() => {
              setSearchTerm('');
              setCategoryFilter('all');
              setDateFilter('all');
            }}
          >
            Réinitialiser les filtres
          </Button>
          <div className="flex items-center gap-2">
            <Badge variant="default" className="text-sm">
              {filteredLogs.length} résultat{filteredLogs.length > 1 ? 's' : ''}
            </Badge>
          </div>
        </div>
      </AnimatedCard>

      {/* Liste des actions AMÉLIORÉE */}
      <AnimatedCard delay={0.2} enableHover={false}>
        <div className="space-y-3">
          <AnimatePresence>
            {filteredLogs.map((log, index) => {
              const config = getActionConfig(log.action);
              const { relative, absolute } = formatSmartDate(log.created_at);

              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ scale: 1.01 }}
                  className="group"
                >
                  <div className={`relative p-5 rounded-2xl border-2 border-zinc-200 dark:border-zinc-700 bg-gradient-to-br ${config.gradient} hover:shadow-lg transition-all duration-300`}>
                    {/* Timeline indicator */}
                    <div className="absolute -left-px top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-zinc-300 dark:via-zinc-600 to-transparent group-hover:via-blue-500 transition-colors" />
                    
                    <div className="flex items-start gap-4">
                      {/* Icône animée */}
                      <motion.div 
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bgColor} border-2 border-white dark:border-zinc-800 shadow-sm`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                      >
                        <span className={config.color}>
                          {config.icon}
                        </span>
                      </motion.div>

                      {/* Contenu */}
                      <div className="flex-1 min-w-0">
                        {/* En-tête */}
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div className="flex-1">
                            <h3 className={`text-lg font-bold ${config.color} mb-1`}>
                              {config.label}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="default" className="text-xs font-medium">
                                {log.entity}
                              </Badge>
                              {log.entity_id && (
                                <span className="text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                                  #{log.entity_id}
                                </span>
                              )}
                            </div>
                          </div>
                          
                          {/* Date et heure */}
                          <div className="text-right flex-shrink-0">
                            <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-1">
                              <Clock size={12} />
                              <span>{relative}</span>
                            </div>
                            <div className="text-xs text-zinc-500 dark:text-zinc-500">
                              {absolute}
                            </div>
                          </div>
                        </div>

                        {/* Détails enrichis */}
                        <EnrichedDetails log={log} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Message si aucun résultat */}
          {filteredLogs.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16"
            >
              <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-700 flex items-center justify-center">
                <History className="w-10 h-10 text-zinc-400 dark:text-zinc-600" />
              </div>
              <p className="text-xl font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                Aucune action trouvée
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mb-4">
                Essayez de modifier vos filtres ou votre recherche
              </p>
              <Button
                variant="default"
                onClick={() => {
                  setSearchTerm('');
                  setCategoryFilter('all');
                  setDateFilter('all');
                }}
              >
                Réinitialiser les filtres
              </Button>
            </motion.div>
          )}
        </div>
      </AnimatedCard>

      {/* Info améliorée */}
      <motion.div
        className="p-5 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl text-sm text-blue-900 dark:text-blue-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start gap-3">
          <AlertCircle size={20} className="mt-0.5 flex-shrink-0 text-blue-600 dark:text-blue-400" />
          <div>
            <h4 className="font-bold mb-1">💡 Historique Complet & Détaillé</h4>
            <p className="text-blue-800 dark:text-blue-200">
              Toutes vos actions sont enregistrées automatiquement avec leurs détails complets (montants, services, enveloppes).
              Utilisez les filtres pour retrouver rapidement une opération spécifique. Les données sont conservées pendant 1 an.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
