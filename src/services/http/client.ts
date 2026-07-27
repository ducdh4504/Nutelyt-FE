import { create } from "axios";

import { appConfig } from "@/config/app-config";
import { env } from "@/config/env";
import { attachHttpInterceptors } from "@/services/http/interceptors";

export const httpClient = create({
  baseURL: env.apiBaseUrl,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
  timeout: appConfig.api.timeoutMs,
});

attachHttpInterceptors(httpClient);
