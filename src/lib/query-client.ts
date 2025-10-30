import { QueryClient } from '@tanstack/react-query';

/**
 * 🔥 CONFIGURATION TANSTACK QUERY
 * Gestion optimale du cache et des requêtes
 */

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Garder les données en cache pendant 5 minutes
      staleTime: 1000 * 60 * 5,
      
      // Garder les données inactives pendant 10 minutes
      gcTime: 1000 * 60 * 10,
      
      // Retry en cas d'échec
      retry: 1,
      
      // Refetch automatique au focus de la fenêtre
      refetchOnWindowFocus: false,
      
      // Refetch au reconnect réseau
      refetchOnReconnect: true,
    },
    mutations: {
      // Retry des mutations échouées
      retry: 1,
    },
  },
});

/**
 * 🔑 QUERY KEYS
 * Clés standardisées pour le cache
 */
export const queryKeys = {
  // Dashboard
  dashboard: ['dashboard'] as const,
  
  // Enveloppes
  envelopes: ['envelopes'] as const,
  envelope: (id: number) => ['envelope', id] as const,
  
  // Transactions
  transactions: ['transactions'] as const,
  transaction: (id: number) => ['transaction', id] as const,
  
  // Analytics
  analytics: (month: string) => ['analytics', month] as const,
  
  // Alertes
  alerts: ['alerts'] as const,
  
  // Services
  services: ['services'] as const,
};


