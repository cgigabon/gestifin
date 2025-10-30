'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Settings, 
  ArrowLeftRight, 
  LayoutDashboard, 
  Bell, 
  ChevronDown, 
  Wrench, 
  Wallet, 
  TrendingUp, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Shuffle, 
  BarChart3, 
  CalendarCheck2,
  Home,
  Menu,
  X,
  User,
  LogOut,
  Sun,
  Moon,
  Clock,
} from 'lucide-react';

/**
 * 🎨 NAVIGATION PREMIUM AMÉLIORÉE
 * Avec sous-menus animés et dark mode
 */

interface DropdownMenuProps {
  label: string;
  icon: React.ReactNode;
  items: Array<{
    href: string;
    label: string;
    icon: React.ReactNode;
    badge?: string;
  }>;
}

function DropdownMenu({ label, icon, items }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="text-sm inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100">
        {icon}
        <span className="font-medium">{label}</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="opacity-60" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute left-0 mt-1 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="w-56 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 shadow-lg">
              {items.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all group"
                  >
                    <div className="flex items-center gap-2 text-zinc-900 dark:text-zinc-100">
                      <div className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/**
 * 👤 MENU UTILISATEUR
 */
function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();
  
  const userName = (session?.user as any)?.name || 'Utilisateur';
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
          {userInitial}
        </div>
        <span className="hidden sm:inline text-sm font-medium text-zinc-900 dark:text-zinc-100">{userName}</span>
        <ChevronDown size={14} className="opacity-60 text-zinc-600 dark:text-zinc-400" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute right-0 mt-1 z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            <div className="w-64 rounded-2xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-2 shadow-lg">
              {/* Profile Link */}
              <Link
                href="/profile"
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all group"
              >
                <div className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  <User size={16} />
                </div>
                <div className="flex-1">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">Mon profil</div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">Paramètres & préférences</div>
                </div>
              </Link>

              <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleTheme}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/30 dark:hover:to-purple-900/30 transition-all group"
              >
                <div className="text-zinc-600 dark:text-zinc-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                  {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                </div>
                <div className="flex-1 text-left">
                  <div className="font-medium text-zinc-900 dark:text-zinc-100">
                    {theme === 'dark' ? 'Mode clair' : 'Mode sombre'}
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Basculer l'apparence
                  </div>
                </div>
              </button>

              <div className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

              {/* Logout */}
              <button
                onClick={() => {
                  // Déconnexion avec redirection vers la landing page
                  fetch('/api/auth/signout', { method: 'POST' })
                    .then(() => window.location.href = '/');
                }}
                className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-900/20 transition-all group text-red-600 dark:text-red-400"
              >
                <LogOut size={16} />
                <div className="font-medium">Se déconnecter</div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface AnimatedHeaderProps {
  unreadAlerts?: number;
}

export function AnimatedHeader({ unreadAlerts = 0 }: AnimatedHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.header
      role="banner"
      className="sticky top-0 z-40 border-b border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md shadow-sm transition-colors duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold shadow-md">
              G
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GestiFin
            </span>
          </motion.div>
        </Link>

        {/* Navigation Desktop - ORDRE: Configuration - Transaction - Analyse - Alertes - Accueil */}
        <nav className="hidden md:flex items-center gap-1">
          {/* Configuration */}
          <DropdownMenu
            label="Configuration"
            icon={<Settings size={16} />}
            items={[
              {
                href: '/onboarding',
                label: 'Configuration initiale',
                icon: <Settings size={14} />,
              },
              {
                href: '/services',
                label: 'Services',
                icon: <Wrench size={14} />,
              },
              {
                href: '/settings/budget',
                label: 'Budget & Enveloppes',
                icon: <Wallet size={14} />,
              },
              {
                href: '/settings/revenue',
                label: 'Baseline revenus',
                icon: <TrendingUp size={14} />,
              },
            ]}
          />

          {/* Transactions */}
          <DropdownMenu
            label="Transactions"
            icon={<ArrowLeftRight size={16} />}
            items={[
              {
                href: '/transactions',
                label: 'Toutes les transactions',
                icon: <ArrowLeftRight size={14} />,
              },
              {
                href: '/income',
                label: 'Nouvelle entrée',
                icon: <ArrowUpCircle size={14} />,
              },
              {
                href: '/expense',
                label: 'Nouvelle dépense',
                icon: <ArrowDownCircle size={14} />,
              },
              {
                href: '/transfer',
                label: 'Nouveau transfert',
                icon: <Shuffle size={14} />,
              },
            ]}
          />

          {/* Analyse */}
          <DropdownMenu
            label="Analyse"
            icon={<BarChart3 size={16} />}
            items={[
              {
                href: '/analytics',
                label: 'Analytique',
                icon: <TrendingUp size={14} />,
              },
              {
                href: '/close-month',
                label: 'Clôture mensuelle',
                icon: <CalendarCheck2 size={14} />,
              },
              {
                href: '/history',
                label: 'Historique',
                icon: <Clock size={14} />,
              },
            ]}
          />

          {/* Alertes */}
          <Link href="/alerts">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors relative text-zinc-900 dark:text-zinc-100"
            >
              <motion.div whileHover={{ rotate: 15 }} transition={{ duration: 0.2 }}>
                <Bell size={16} />
              </motion.div>
              <span className="font-medium">Alertes</span>
              {unreadAlerts > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center"
                >
                  {unreadAlerts > 99 ? '99+' : unreadAlerts}
                </motion.span>
              )}
            </motion.div>
          </Link>

          {/* Accueil */}
          <Link href="/dashboard">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="text-sm inline-flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100"
            >
              <Home size={16} />
              <span className="font-medium">Accueil</span>
            </motion.div>
          </Link>
        </nav>

        {/* Actions Desktop */}
        <div className="hidden md:flex items-center gap-2">
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="p-4 space-y-2">
              {/* Menu mobile - ORDRE: Configuration - Transaction - Analyse - Alertes - Accueil */}
              
              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Configuration</div>
                <Link href="/onboarding" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <Settings size={14} /> Configuration initiale
                </Link>
                <Link href="/services" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <Wrench size={14} /> Services
                </Link>
                <Link href="/settings/budget" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <Wallet size={14} /> Budget & Enveloppes
                </Link>
                <Link href="/settings/revenue" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <TrendingUp size={14} /> Baseline revenus
                </Link>
              </div>

              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Transactions</div>
                <Link href="/transactions" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <ArrowLeftRight size={14} /> Toutes les transactions
                </Link>
                <Link href="/income" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <ArrowUpCircle size={14} /> Nouvelle entrée
                </Link>
                <Link href="/expense" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <ArrowDownCircle size={14} /> Nouvelle dépense
                </Link>
                <Link href="/transfer" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <Shuffle size={14} /> Transfert
                </Link>
              </div>

              <div className="space-y-1">
                <div className="px-3 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase">Analyse</div>
                <Link href="/analytics" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <TrendingUp size={14} /> Analytique
                </Link>
                <Link href="/close-month" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <CalendarCheck2 size={14} /> Clôture mensuelle
                </Link>
                <Link href="/history" className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-zinc-100" onClick={() => setMobileMenuOpen(false)}>
                  <Clock size={14} /> Historique
                </Link>
              </div>

              <Link
                href="/alerts"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Bell size={16} />
                <span className="font-medium">Alertes</span>
                {unreadAlerts > 0 && (
                  <span className="ml-auto px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {unreadAlerts > 99 ? '99+' : unreadAlerts}
                  </span>
                )}
              </Link>

              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                <Home size={16} />
                <span className="font-medium">Accueil</span>
              </Link>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-zinc-900 dark:text-zinc-100 mb-2"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User size={16} />
                  <span className="font-medium">Mon profil</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    fetch('/api/auth/signout', { method: 'POST' })
                      .then(() => window.location.href = '/');
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors text-red-600 dark:text-red-400"
                >
                  <LogOut size={16} />
                  <span className="font-medium">Se déconnecter</span>
                </button>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
