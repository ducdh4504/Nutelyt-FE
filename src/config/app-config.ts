export const appConfig = {
  api: {
    timeoutMs: 15_000,
  },
  pagination: {
    defaultPage: 1,
    defaultPageSize: 20,
  },
  query: {
    staleTimeMs: 5 * 60 * 1_000,
    gcTimeMs: 30 * 60 * 1_000,
    retryCount: 2,
    refetchOnMount: false,
    refetchOnReconnect: true,
    refetchOnWindowFocus: false,
  },
  images: {
    defaultQuality: 0.8,
    defaultResizeMode: "cover",
  },
  dates: {
    displayFormat: "dd/MM/yyyy",
    dateTimeFormat: "dd/MM/yyyy HH:mm",
  },
} as const;
