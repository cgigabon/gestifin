'use client';

import { motion } from 'framer-motion';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { LoginForm } from './LoginForm';
import { CGILogo } from '@/components/branding/CGILogo';
import { ArrowRight, Shield, Sparkles } from 'lucide-react';

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-orange-50 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-24 -left-24 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
          animate={{ scale: [1.2, 1, 1.2], rotate: [90, 0, 90] }}
          transition={{ duration: 20, repeat: Infinity }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-10"
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

        {/* Carte de connexion */}
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <Card className="backdrop-blur-sm bg-white/80 border-2 shadow-2xl">
              {/* Bandeau coloré */}
              <div className="h-2 bg-gradient-to-r from-green-500 via-blue-500 to-orange-500 rounded-t-3xl" />

              <div className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                  >
                    <Shield className="w-8 h-8 text-green-600" />
                  </motion.div>
                  <div>
                    <CardTitle className="text-2xl">Connexion</CardTitle>
                    <CardDescription>Accédez à votre espace GestiFin</CardDescription>
                  </div>
                </div>

                {/* Features badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <motion.span
                    className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles size={12} /> Sécurisé
                  </motion.span>
                  <motion.span
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Sparkles size={12} /> Innovation CGI
                  </motion.span>
                </div>

        <LoginForm />

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
                  whileHover={{ x: 5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href="/auth/register"
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 border-2 border-dashed border-zinc-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all group"
                  >
                    <span className="font-medium text-zinc-700 group-hover:text-green-700">
                      Créer un nouveau compte
                    </span>
                    <ArrowRight className="w-4 h-4 text-zinc-400 group-hover:text-green-600" />
                  </Link>
                </motion.div>
              </div>
            </Card>
          </motion.div>

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
