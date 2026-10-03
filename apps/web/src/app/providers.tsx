import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState, type PropsWithChildren } from 'react';
import { PreferenceProvider } from '../platform/preferences/preferenceStore';
import { TaskDataProvider } from '../data/repositories/TaskDataProvider';

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1 },
    },
  }));
  return (
    <QueryClientProvider client={queryClient}>
      <PreferenceProvider>
        <TaskDataProvider>{children}</TaskDataProvider>
      </PreferenceProvider>
    </QueryClientProvider>
  );
}
