'use client';

import { motion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { RegisterForm } from './RegisterForm';
import { CGILogo } from '@/components/branding/CGILogo';
import { ArrowLeft, UserPlus, Sparkles, Check } from 'lucide-react';

export default function RegisterPage() {
  const features = [
    'Gestion budgétaire intelligente',
    'Suivi des dépenses en temps réel',
    'Alertes personnalisées',
    'Rapports et analyses détaillés',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-orange-50 to-green-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -left-24 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: [-90, 0, -90] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-10"
          animate={{ scale: [1, 1.3, 1] }}
          transition={{ duration: 15, repeat: Infinity }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header avec CGI Logo */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <CGILogo size="md" animated={true} />
        </motion.div>

        {/* Carte d'inscription */}
        <div className="max-w-2xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Colonne gauche - Avantages */}
            <motion.div
              className="hidden md:flex flex-col justify-center"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="space-y-6">
                <div>
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent mb-2">
                    Rejoignez-nous !
                  </h2>
                  <p className="text-zinc-600">
                    Profitez d'une solution complète de gestion financière propulsée par l'innovation.
                  </p>
                </div>

                <div className="space-y-3">
                  {features.map((feature, index) => (
                    <motion.div
                      key={feature}
                      className="flex items-start gap-3 p-3 rounded-xl bg-white/50 backdrop-blur-sm"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-sm font-medium text-zinc-700">{feature}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <p className="text-sm text-zinc-700 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-orange-500" />
                    <strong>100% Gratuit</strong> - Aucune carte bancaire requise
                  </p>
                </motion.div>
              </div>
            </motion.div>

            {/* Colonne droite - Formulaire */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <Card className="backdrop-blur-sm bg-white/90 border-2 shadow-2xl">
                {/* Bandeau coloré */}
                <div className="h-2 bg-gradient-to-r from-blue-500 via-orange-500 to-green-500 rounded-t-3xl" />

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <UserPlus className="w-8 h-8 text-blue-600" />
                    </motion.div>
                    <div>
                      <CardTitle className="text-2xl">Créer un compte</CardTitle>
                      <CardDescription>Rejoignez GestiFin en 2 minutes</CardDescription>
                    </div>
                  </div>

                  {/* Features badges mobile */}
                  <div className="md:hidden flex flex-wrap gap-2 mb-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                      <Sparkles size={12} /> Gratuit
                    </span>
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      <Sparkles size={12} /> Sécurisé
                    </span>
                  </div>

        <RegisterForm />

                  <div className="mt-6 text-center">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-zinc-200" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-4 bg-white text-zinc-500">ou</span>
                      </div>
                    </div>
                  </div>

                  <motion.div
                    className="mt-6"
                    whileHover={{ x: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Link
                      href="/auth/login"
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-zinc-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all group"
                    >
                      <ArrowLeft className="w-4 h-4 text-zinc-400 group-hover:text-blue-600" />
                      <span className="font-medium text-zinc-700 group-hover:text-blue-700">
                        Déjà inscrit ? Connectez-vous
                      </span>
                    </Link>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Footer info */}
          <motion.div
            className="mt-8 text-center text-sm text-zinc-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <p>Propulsé par le Centre Gabonais de l'Innovation</p>
            <p className="mt-1 text-xs text-zinc-500">
              © 2025 CGI - Construisons un avenir meilleur
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
