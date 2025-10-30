'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { AnimatedCard } from '@/components/ui/animated-card';
import { AnimatedButton } from '@/components/ui/animated-button';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Wrench, 
  Plus, 
  Power, 
  Trash2, 
  AlertTriangle, 
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { successToast, errorToast, warningToast, celebrationToast } from '@/lib/toast-utils';
import { listContainer, listItem } from '@/lib/animations';
import { useRouter } from 'next/navigation';

interface Service {
  id: number;
  nom: string;
  actif: 0 | 1;
  created_at: string;
  usage_count: number;
}

interface ServicesClientProps {
  services: Service[];
  userId: number;
}

export function ServicesClient({ services, userId }: ServicesClientProps) {
  const router = useRouter();
  const [newServiceName, setNewServiceName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Statistiques
  const activeCount = services.filter(s => s.actif).length;
  const inactiveCount = services.filter(s => !s.actif).length;
  const totalUsage = services.reduce((sum, s) => sum + s.usage_count, 0);

  // Ajouter un service
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim()) {
      errorToast('Le nom du service est requis');
      return;
    }

    setIsAdding(true);
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utilisateurId: userId, nom: newServiceName }),
      });

      if (!res.ok) throw new Error('Erreur lors de la création');

      celebrationToast('🎉 Service créé avec succès !');
      setNewServiceName('');
      router.refresh();
    } catch (error) {
      errorToast('Erreur lors de la création du service');
    } finally {
      setIsAdding(false);
    }
  };

  // Activer/Désactiver
  const handleToggle = async (id: number, currentState: 0 | 1) => {
    try {
      const res = await fetch('/api/services/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utilisateurId: userId, id, actif: !currentState }),
      });

      if (!res.ok) throw new Error('Erreur lors de la modification');

      successToast(currentState ? '✅ Service désactivé' : '✅ Service activé');
      router.refresh();
    } catch (error) {
      errorToast('Erreur lors de la modification');
    }
  };

  // Supprimer
  const handleDelete = async (id: number, nom: string, usageCount: number) => {
    if (usageCount > 0) {
      warningToast(`⚠️ "${nom}" est utilisé dans ${usageCount} transaction(s). Désactivez-le plutôt.`);
      return;
    }

    if (deleteConfirm !== id) {
      setDeleteConfirm(id);
      warningToast('⚠️ Cliquez à nouveau pour confirmer la suppression');
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      const res = await fetch('/api/services/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ utilisateurId: userId, id }),
      });

      if (!res.ok) throw new Error('Erreur lors de la suppression');

      successToast('🗑️ Service supprimé');
      setDeleteConfirm(null);
      router.refresh();
    } catch (error) {
      errorToast('Erreur lors de la suppression');
    }
  };

  return (
    <motion.div
      className="grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* Statistiques */}
      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={listItem}
      >
        <AnimatedCard delay={0} enableHover={false}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-zinc-600">Services actifs</div>
              <div className="text-2xl font-bold text-green-700">{activeCount}</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.1} enableHover={false}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
              <XCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-zinc-600">Services inactifs</div>
              <div className="text-2xl font-bold text-orange-700">{inactiveCount}</div>
            </div>
          </div>
        </AnimatedCard>

        <AnimatedCard delay={0.2} enableHover={false}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-sm text-zinc-600">Utilisations totales</div>
              <div className="text-2xl font-bold text-blue-700">{totalUsage}</div>
            </div>
          </div>
        </AnimatedCard>
      </motion.section>

      {/* Ajouter un service */}
      <AnimatedCard delay={0.3}>
        <div className="flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Wrench className="w-6 h-6 text-blue-600" />
          </motion.div>
          <CardTitle>Ajouter un service</CardTitle>
        </div>
        <CardDescription className="mb-4">
          Ex : Tresses, Coiffure, Vente produits, Consultation…
        </CardDescription>

        <form onSubmit={handleAdd} className="flex gap-3">
          <div className="flex-1">
            <Label htmlFor="nom">Nom du service</Label>
            <Input
              id="nom"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              placeholder="Ex: Tresses afro"
              required
            />
          </div>
          <div className="flex items-end">
            <AnimatedButton type="submit" isLoading={isAdding} className="gap-2">
              <Plus size={16} /> Ajouter
            </AnimatedButton>
          </div>
        </form>
      </AnimatedCard>

      {/* Liste des services */}
      <AnimatedCard delay={0.4}>
        <CardTitle className="mb-6">📋 Mes services ({services.length})</CardTitle>

        <div className="grid gap-3">
          <AnimatePresence>
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <Card className="p-4 hover:shadow-lg transition-all border-2 hover:border-blue-300">
                  <div className="flex items-center justify-between gap-4">
                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Wrench className={`w-5 h-5 ${service.actif ? 'text-green-600' : 'text-zinc-400'}`} />
                        <h3 className="font-semibold text-lg">{service.nom}</h3>
                        <Badge variant={service.actif ? 'info' : 'default'}>
                          {service.actif ? 'Actif' : 'Inactif'}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-zinc-600">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(service.created_at).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <TrendingUp size={14} />
                          <span>{service.usage_count} utilisation{service.usage_count > 1 ? 's' : ''}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {/* Toggle */}
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          size="sm"
                          variant={service.actif ? 'secondary' : 'default'}
                          onClick={() => handleToggle(service.id, service.actif)}
                          className="gap-2"
                        >
                          <Power size={14} />
                          {service.actif ? 'Désactiver' : 'Activer'}
                        </Button>
                      </motion.div>

                      {/* Supprimer */}
                      <motion.button
                        type="button"
                        onClick={() => handleDelete(service.id, service.nom, service.usage_count)}
                        className={`p-2 rounded-lg transition-colors ${
                          deleteConfirm === service.id
                            ? 'bg-red-100 text-red-600'
                            : 'opacity-0 group-hover:opacity-100 hover:bg-red-50 text-red-500'
                        }`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        {deleteConfirm === service.id ? (
                          <AlertTriangle size={18} />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>

          {services.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-zinc-500"
            >
              <Wrench className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Aucun service créé</p>
              <p className="text-sm">Ajoutez votre premier service ci-dessus</p>
            </motion.div>
          )}
        </div>
      </AnimatedCard>

      {/* Aide */}
      <motion.div
        className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
          <div>
            <strong>💡 Astuce :</strong> Les services utilisés dans des transactions ne peuvent pas être supprimés.
            Désactivez-les plutôt pour les masquer des formulaires tout en conservant l'historique.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

