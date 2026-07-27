import { isAxiosError, isCancel, type AxiosInstance } from "axios";

import { applyAuthToken } from "@/services/http/auth-interceptor";
import { toApiError } from "@/services/http/api-error";
import {
  logRequest,
  logResponse,
  logResponseError,
} from "@/services/http/logging-interceptor";
import { handleFutureTokenRefresh } from "@/services/http/refresh-interceptor";

export function attachHttpInterceptors(client: AxiosInstance) {
  client.interceptors.request.use(async (config) => {
    const authenticatedConfig = await applyAuthToken(config);
    return logRequest(authenticatedConfig);
  });

  client.interceptors.response.use(logResponse, async (error: unknown) => {
    if (isCancel(error)) {
      return Promise.reject(error);
    }

    if (isAxiosError(error)) {
      const loggedError = logResponseError(error);

      try {
        return await handleFutureTokenRefresh(loggedError);
      } catch (refreshError) {
        return Promise.reject(toApiError(refreshError));
      }
    }

    return Promise.reject(toApiError(error));
  });
}
