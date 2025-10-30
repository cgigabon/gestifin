'use client';
import { SessionProvider } from 'next-auth/react';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/toast';
import { Toaster } from '@/components/ui/toaster';
import { Toaster as HotToaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { useState } from 'react';

export default function Providers({ children }: { children: ReactNode }) {
  // Créer le QueryClient dans le composant pour éviter les problèmes SSR
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
        retry: 1,
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <SessionProvider>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ToastProvider>
            {children}
            <Toaster />
            {/* React Hot Toast pour les notifications premium */}
            <HotToaster
              position="top-right"
              reverseOrder={false}
              gutter={8}
              containerStyle={{
                top: 80,
              }}
              toastOptions={{
                duration: 4000,
                style: {
                  fontFamily: 'inherit',
                },
              }}
            />
          </ToastProvider>
          {/* DevTools uniquement en dev */}
          <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
