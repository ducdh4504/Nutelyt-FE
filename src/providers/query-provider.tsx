import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { appConfig } from "@/config/app-config";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: appConfig.query.gcTimeMs,
      refetchOnMount: appConfig.query.refetchOnMount,
      refetchOnReconnect: appConfig.query.refetchOnReconnect,
      refetchOnWindowFocus: appConfig.query.refetchOnWindowFocus,
      retry: appConfig.query.retryCount,
      staleTime: appConfig.query.staleTimeMs,
    },
  },
});

export function QueryProvider({ children }: { children: ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
