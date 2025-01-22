import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TenStackQueryDevelopmentTools from './utils/development-tools/TenStackQueryDevelopmentTools';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'sonner';
import { ThemeProvider } from './theme-provider';

// Provider Props
type ProviderProps = { children: React.ReactNode };
// client for queries
const queryClient = new QueryClient();
const Provider = (props: ProviderProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <Toaster richColors={true} />
          {props.children}
          {/* <TenStackQueryDevelopmentTools /> */}
        </QueryClientProvider>
      </HelmetProvider>
    </ThemeProvider>
  );
};

export default Provider;
