import type {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

import { logger } from "@/services/logger/logger";

export function logRequest(config: InternalAxiosRequestConfig) {
  logger.debug(`[HTTP] ${config.method?.toUpperCase() ?? "REQUEST"} ${config.url ?? ""}`);
  return config;
}

export function logResponse(response: AxiosResponse) {
  logger.debug(
    `[HTTP] ${response.status} ${response.config.method?.toUpperCase() ?? "RESPONSE"} ${response.config.url ?? ""}`,
  );
  return response;
}

export function logResponseError(error: AxiosError) {
  logger.warn(
    `[HTTP] ${error.response?.status ?? "NETWORK"} ${error.config?.method?.toUpperCase() ?? "REQUEST"} ${error.config?.url ?? ""}`,
  );
  return error;
}
