'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { signOut } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimatedCard } from '@/components/ui/animated-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Mail,
  Calendar,
  BarChart3,
  Wallet,
  Wrench,
  LogOut,
  Sun,
  Moon,
  Shield,
  Activity,
  Clock,
} from 'lucide-react';
import { listContainer, listItem } from '@/lib/animations';
import { successToast, celebrationToast } from '@/lib/toast-utils';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ProfileClientProps {
  profile: {
    id: number;
    nom: string;
    email: string;
    created_at: string;
    total_transactions: number;
    total_envelopes: number;
    total_services: number;
  };
}

export function ProfileClient({ profile }: ProfileClientProps) {
  const { theme, toggleTheme } = useTheme();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    celebrationToast('👋 À bientôt !');
    
    setTimeout(async () => {
      await fetch('/api/auth/signout', { method: 'POST' });
      window.location.href = '/';
    }, 1000);
  };

  const memberSince = format(new Date(profile.created_at), 'd MMMM yyyy', { locale: fr });
  const daysSince = Math.floor(
    (new Date().getTime() - new Date(profile.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  const stats = [
    {
      icon: <BarChart3 className="w-6 h-6" />,
      label: 'Transactions',
      value: profile.total_transactions,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      textColor: 'text-blue-700 dark:text-blue-300',
    },
    {
      icon: <Wallet className="w-6 h-6" />,
      label: 'Enveloppes',
      value: profile.total_envelopes,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      textColor: 'text-green-700 dark:text-green-300',
    },
    {
      icon: <Wrench className="w-6 h-6" />,
      label: 'Services',
      value: profile.total_services,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      textColor: 'text-purple-700 dark:text-purple-300',
    },
  ];

  return (
    <motion.div
      className="max-w-4xl mx-auto grid gap-6"
      initial="hidden"
      animate="visible"
      variants={listContainer}
    >
      {/* En-tête avec avatar */}
      <AnimatedCard delay={0} className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 dark:from-blue-500/20 dark:via-purple-500/20 dark:to-pink-500/20" />
        
        <motion.div
          className="relative flex flex-col sm:flex-row items-center gap-6 p-6"
          variants={listItem}
        >
          {/* Avatar */}
          <motion.div
            className="relative"
            whileHover={{ scale: 1.05, rotate: 5 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-zinc-900 flex items-center justify-center">
                <span className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-purple-600">
                  {profile.nom.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
            <motion.div
              className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center border-4 border-white dark:border-zinc-900"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              <Shield className="w-5 h-5 text-white" />
            </motion.div>
          </motion.div>

          {/* Info utilisateur */}
          <div className="flex-1 text-center sm:text-left">
            <motion.h1
              className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {profile.nom}
            </motion.h1>
            
            <motion.div
              className="flex flex-col sm:flex-row items-center gap-3 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
                <Mail className="w-4 h-4" />
                <span>{profile.email}</span>
              </div>
              <Badge variant="info" className="gap-1">
                <Activity className="w-3 h-3" />
                Actif
              </Badge>
            </motion.div>

            <motion.div
              className="flex items-center gap-2 text-sm text-zinc-500 dark:text-zinc-500"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <Clock className="w-4 h-4" />
              <span>Membre depuis {memberSince} ({daysSince} jours)</span>
            </motion.div>
          </div>
        </motion.div>
      </AnimatedCard>

      {/* Statistiques */}
      <motion.section
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        variants={listContainer}
      >
        {stats.map((stat, index) => (
          <motion.div key={stat.label} variants={listItem}>
            <AnimatedCard delay={0.1 + index * 0.1} enableHover className={stat.bgColor}>
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                  {stat.icon}
                </div>
                <div>
                  <div className="text-sm text-zinc-600 dark:text-zinc-400">{stat.label}</div>
                  <div className={`text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
                </div>
              </div>
            </AnimatedCard>
          </motion.div>
        ))}
      </motion.section>

      {/* Paramètres */}
      <AnimatedCard delay={0.4}>
        <motion.h2
          className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-6 flex items-center gap-2"
          variants={listItem}
        >
          <Shield className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          Paramètres
        </motion.h2>

        <div className="space-y-4">
          {/* Dark Mode Toggle */}
          <motion.div
            className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700"
            variants={listItem}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                theme === 'dark' 
                  ? 'bg-gradient-to-br from-indigo-500 to-purple-600' 
                  : 'bg-gradient-to-br from-orange-400 to-yellow-500'
              }`}>
                {theme === 'dark' ? (
                  <Moon className="w-6 h-6 text-white" />
                ) : (
                  <Sun className="w-6 h-6 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Mode {theme === 'dark' ? 'Sombre' : 'Clair'}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  {theme === 'dark' 
                    ? 'Reposez vos yeux avec le thème sombre' 
                    : 'Profitez d\'une interface lumineuse'}
                </p>
              </div>
            </div>
            
            <motion.button
              onClick={() => {
                toggleTheme();
                successToast(theme === 'dark' ? '☀️ Mode clair activé' : '🌙 Mode sombre activé');
              }}
              className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${
                theme === 'dark' 
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600' 
                  : 'bg-gradient-to-r from-orange-400 to-yellow-500'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-md"
                animate={{ left: theme === 'dark' ? '36px' : '4px' }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            </motion.button>
          </motion.div>

          {/* Informations du compte */}
          <motion.div
            className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
            variants={listItem}
          >
            <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informations du compte
            </h3>
            <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">ID utilisateur:</span>
                <span className="font-mono font-medium">#{profile.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Inscrit le:</span>
                <span className="font-medium">{memberSince}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600 dark:text-blue-400">Jours actifs:</span>
                <span className="font-medium">{daysSince} jours</span>
              </div>
            </div>
          </motion.div>
        </div>
      </AnimatedCard>

      {/* Déconnexion */}
      <AnimatedCard delay={0.5} className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1">
              Se déconnecter
            </h3>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              Terminez votre session en toute sécurité
            </p>
          </div>
          
          <Button
            variant="destructive"
            size="lg"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="gap-2 min-w-[180px]"
          >
            <LogOut className="w-5 h-5" />
            {isLoggingOut ? 'Déconnexion...' : 'Se déconnecter'}
          </Button>
        </div>
      </AnimatedCard>

      {/* Info card */}
      <motion.div
        className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 text-sm text-purple-900 dark:text-purple-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="flex items-start gap-2">
          <Shield className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <strong>💡 Astuce :</strong> Vos données sont synchronisées en temps réel et sécurisées.
            Utilisez le mode sombre pour réduire la fatigue visuelle lors de longues sessions.
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

