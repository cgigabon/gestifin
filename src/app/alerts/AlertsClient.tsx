'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { AnimatedPieChart } from '@/components/charts/AnimatedPieChart';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, AlertTriangle, Info, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { listContainer, listItem } from '@/lib/animations';

/**
 * 🔔 PAGE ALERTS AMÉLIORÉE
 * Avec animations et graphiques
 */

interface Alert {
  id: number;
  type: 'CRITIQUE' | 'ATTENTION' | 'INFO';
  titre: string;
  description: string | null;
  created_at: string;
  lue: 0 | 1;
}

interface AlertsClientProps {
  alerts: Alert[];
  filter: string;
}

export function AlertsClient({ alerts: initialAlerts, filter }: AlertsClientProps) {
  const [alerts, setAlerts] = useState(initialAlerts);
  const [selectedFilter, setSelectedFilter] = useState(filter);

  // Statistiques
  const total = alerts.length;
  const unread = alerts.filter(a => a.lue === 0).length;
  const critiques = alerts.filter(a => a.type === 'CRITIQUE').length;
  const attentions = alerts.filter(a => a.type === 'ATTENTION').length;
  const infos = alerts.filter(a => a.type === 'INFO').length;

  // Données pour pie chart
  const pieData = [
    { name: 'Critiques', value: critiques },
    { name: 'Attention', value: attentions },
    { name: 'Info', value: infos },
  ].filter(d => d.value > 0);

  const pieColors = ['#ef4444', '#f59e0b', '#3b82f6'];

  // Filtrer les alertes
  const filteredAlerts = alerts.filter(a => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return a.lue === 0;
    return a.type === selectedFilter;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'CRITIQUE':
        return <AlertTriangle className="text-red-600" size={20} />;
      case 'ATTENTION':
        return <AlertTriangle className="text-orange-600" size={20} />;
      case 'INFO':
        return <Info className="text-blue-600" size={20} />;
      default:
        return <Bell size={20} />;
    }
  };

  const getBadgeVariant = (type: string): any => {
    switch (type) {
      case 'CRITIQUE':
        return 'destructive';
      case 'ATTENTION':
        return 'warning';
      case 'INFO':
        return 'info';
      default:
        return 'default';
    }
  };

  const markAsRead = async (id: number) => {
    try {
      const response = await fetch('/api/alerts/mark-read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAlerts(alerts.map(a => a.id === id ? { ...a, lue: 1 } : a));
        toast.success('Alerte marquée comme lue');
      }
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const deleteAlert = async (id: number) => {
    try {
      const response = await fetch('/api/alerts/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setAlerts(alerts.filter(a => a.id !== id));
        toast.success('Alerte supprimée');
      }
    } catch (error) {
      toast.error('Erreur lors de la suppression');
    }
  };

  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête avec stats */}
      <AnimatedCard delay={0.1} enableHover={false}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Bell size={28} />
              Alertes
            </h1>
            <p className="text-sm text-zinc-600 mt-1">
              {total} alerte(s) • {unread} non lue(s)
            </p>
          </div>

          {/* Filtres */}
          <div className="flex flex-wrap gap-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('all')}
            >
              <Badge variant={'default'}>
                Toutes ({total})
              </Badge>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('unread')}
            >
              <Badge variant={selectedFilter === 'unread' ? 'warning' : 'default'}>
                Non lues ({unread})
              </Badge>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('CRITIQUE')}
            >
              <Badge variant={selectedFilter === 'CRITIQUE' ? 'destructive' : 'default'}>
                Critiques ({critiques})
              </Badge>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('ATTENTION')}
            >
              <Badge variant={selectedFilter === 'ATTENTION' ? 'warning' : 'default'}>
                Attention ({attentions})
              </Badge>
            </motion.button>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedFilter('INFO')}
            >
              <Badge variant={selectedFilter === 'INFO' ? 'info' : 'default'}>
                Info ({infos})
              </Badge>
            </motion.button>
          </div>
        </div>
      </AnimatedCard>

      {/* Graphique répartition */}
      {pieData.length > 0 && (
        <AnimatedCard delay={0.2} enableHover={false}>
          <AnimatedPieChart
            data={pieData}
            dataKey="value"
            nameKey="name"
            title="📊 Répartition des alertes"
            height={250}
            colors={pieColors}
          />
        </AnimatedCard>
      )}

      {/* Liste des alertes */}
      <AnimatedCard delay={0.3} enableHover={false}>
        <h2 className="text-lg font-semibold mb-4">
          {filteredAlerts.length} alerte(s) affichée(s)
        </h2>

        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {filteredAlerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className={`p-4 rounded-xl border-2 ${
                  alert.lue === 0
                    ? 'bg-amber-50/50 border-amber-200'
                    : 'bg-white border-zinc-200'
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* Icône */}
                  <div className="mt-1">{getIcon(alert.type)}</div>

                  {/* Contenu */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={getBadgeVariant(alert.type)}>
                        {alert.type}
                      </Badge>
                      {alert.lue === 0 && (
                        <Badge variant="warning">Non lu</Badge>
                      )}
                    </div>

                    <h3 className="font-semibold text-base mb-1">
                      {alert.titre}
                    </h3>

                    {alert.description && (
                      <p className="text-sm text-zinc-600 mb-2">
                        {alert.description}
                      </p>
                    )}

                    <p className="text-xs text-zinc-500">
                      {new Date(alert.created_at).toLocaleString('fr-FR', {
                        dateStyle: 'long',
                        timeStyle: 'short',
                      })}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {alert.lue === 0 && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsRead(alert.id)}
                        className="p-2 rounded-lg bg-green-100 text-green-700 hover:bg-green-200"
                        title="Marquer comme lu"
                      >
                        <CheckCircle size={18} />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteAlert(alert.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {filteredAlerts.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-500"
            >
              <Bell size={48} className="mx-auto mb-4 opacity-30" />
              <p>Aucune alerte pour ce filtre.</p>
            </motion.div>
          )}
        </div>
      </AnimatedCard>
    </motion.div>
  );
}


