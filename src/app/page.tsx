'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardTitle, CardDescription } from '@/components/ui/card';
import { CGILogo } from '@/components/branding/CGILogo';
import {
  Wallet,
  TrendingUp,
  Bell,
  BarChart3,
  Shield,
  Zap,
  Check,
  ArrowRight,
  Users,
  Target,
  Award,
} from 'lucide-react';

export default function HomePage() {
  const { data: session, status } = useSession();
  
  // Pendant le chargement, ne rien afficher pour éviter le flash
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <CGILogo size="lg" animated={true} />
          <p className="mt-4 text-zinc-600">Chargement...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: <Wallet className="w-8 h-8" />,
      title: 'Gestion par Enveloppes',
      description: 'Répartition automatique de vos revenus selon vos objectifs budgétaires',
      color: 'from-green-500 to-emerald-600',
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: 'Suivi en Temps Réel',
      description: 'Dashboard intuitif avec KPIs et graphiques pour suivre vos finances',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      icon: <Bell className="w-8 h-8" />,
      title: 'Alertes Intelligentes',
      description: 'Notifications automatiques pour soldes faibles et dépassements',
      color: 'from-orange-500 to-amber-600',
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: 'Analytics Avancés',
      description: 'Rapports mensuels, exports CSV/PDF et analyses détaillées',
      color: 'from-purple-500 to-violet-600',
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: 'Sécurité Maximale',
      description: 'Enveloppes protégées et validation à deux facteurs',
      color: 'from-red-500 to-rose-600',
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: 'Interface Rapide',
      description: 'Optimisée pour la réalité locale avec support XAF',
      color: 'from-yellow-500 to-orange-600',
    },
  ];

  const stats = [
    { icon: <Users />, value: '500+', label: 'Utilisateurs actifs' },
    { icon: <Target />, value: '99.9%', label: 'Disponibilité' },
    { icon: <Award />, value: '4.9/5', label: 'Satisfaction client' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background animations */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute -top-40 -left-40 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20"
            animate={{ scale: [1, 1.2, 1], x: [0, 50, 0] }}
            transition={{ duration: 20, repeat: Infinity }}
          />
          <motion.div
            className="absolute top-40 -right-40 w-96 h-96 bg-blue-200 rounded-full blur-3xl opacity-20"
            animate={{ scale: [1.2, 1, 1.2], y: [0, 50, 0] }}
            transition={{ duration: 15, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-40 left-1/2 w-96 h-96 bg-orange-200 rounded-full blur-3xl opacity-10"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 25, repeat: Infinity }}
          />
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16">
          {/* Logo CGI */}
          <motion.div
            className="mb-12"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <CGILogo size="lg" animated={true} />
          </motion.div>

          {/* Hero Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-center max-w-7xl mx-auto">
            {/* Left Column */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 rounded-full mb-6"
                whileHover={{ scale: 1.05 }}
              >
                <Zap className="w-4 h-4 text-orange-600" />
                <span className="text-sm font-semibold text-zinc-700">
                  Propulsé par le CGI
                </span>
              </motion.div>

              <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-orange-600 bg-clip-text text-transparent">
                  GestiFin
                </span>
                <br />
                <span className="text-zinc-800">
                  Maîtrisez vos finances
                </span>
          </h1>

              <p className="text-xl text-zinc-600 mb-8 leading-relaxed">
                Solution complète de gestion financière optimisée pour la réalité locale.
                Suivi temps réel, alertes intelligentes et rapports avancés en XAF.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4 mb-6">
            {!session && (
              <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/auth/register">
                        <Button
                          size="lg"
                          className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                        >
                          Créer mon compte <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/auth/login">
                        <Button size="lg" variant="outline" className="border-2">
                          Se connecter
                        </Button>
                      </Link>
                    </motion.div>
              </>
            )}
            {session && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Link href="/dashboard">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-lg"
                      >
                        Accéder au Dashboard <ArrowRight className="ml-2 w-4 h-4" />
                      </Button>
                    </Link>
                  </motion.div>
            )}
          </div>

              <div className="flex items-center gap-4 text-sm text-zinc-600">
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Gratuit sans CB</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span>Sécurisé 100%</span>
                </div>
              </div>
            </motion.div>

            {/* Right Column - Features Preview */}
            <motion.div
              className="grid gap-4"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-2 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white">
                    <Wallet className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="mb-2">Répartition Automatique</CardTitle>
                    <CardDescription>
                      Vos revenus sont automatiquement distribués selon vos pourcentages d'enveloppes
                    </CardDescription>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-yellow-500 flex items-center justify-center text-white">
                    <TrendingUp className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="mb-2">Analytics Puissants</CardTitle>
                    <CardDescription>
                      Graphiques interactifs et rapports PDF pour une vision claire de vos finances
                    </CardDescription>
                  </div>
                </div>
              </Card>

              <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 hover:shadow-xl transition-shadow">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white">
                    <Bell className="w-6 h-6" />
        </div>
        <div>
                    <CardTitle className="mb-2">Alertes Intelligentes</CardTitle>
                    <CardDescription>
                      Soyez notifié en temps réel des dépassements et soldes critiques
            </CardDescription>
                  </div>
                </div>
          </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <motion.section
        className="py-16 bg-gradient-to-r from-green-600 via-blue-600 to-orange-600"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                className="text-center text-white"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="flex justify-center mb-2">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-green-100">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Features Grid */}
      <section className="py-20 container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold mb-4">
            Fonctionnalités <span className="text-green-600">Complètes</span>
          </h2>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto">
            Tout ce dont vous avez besoin pour gérer vos finances efficacement
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="p-6 h-full hover:shadow-xl transition-all hover:-translate-y-1">
                <div
                  className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center text-white mb-4`}
                >
                  {feature.icon}
                </div>
                <CardTitle className="mb-3">{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
        </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      {!session && (
        <motion.section
          className="py-20 bg-gradient-to-br from-green-50 via-blue-50 to-orange-50"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              className="max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold mb-6">
                Prêt à transformer votre <span className="text-green-600">gestion financière</span> ?
              </h2>
              <p className="text-xl text-zinc-600 mb-8">
                Rejoignez des centaines d'utilisateurs qui font confiance à GestiFin
              </p>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/auth/register">
                  <Button
                    size="lg"
                    className="text-lg px-8 py-6 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white shadow-xl"
                  >
                    Commencer gratuitement <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>
      )}

      {/* Footer */}
      <footer className="py-12 border-t bg-white">
        <div className="container mx-auto px-4 text-center text-zinc-600">
          <p className="mb-2">
            <strong>Propulsé par le Centre Gabonais de l'Innovation</strong>
          </p>
          <p className="text-sm text-zinc-500">
            © 2025 CGI - Construisons un avenir meilleur
          </p>
        </div>
      </footer>
    </div>
  );
}
