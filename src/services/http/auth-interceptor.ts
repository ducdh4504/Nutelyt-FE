import type { InternalAxiosRequestConfig } from "axios";

export type AuthTokenReader = () => Promise<string | null> | string | null;

const readAuthToken: AuthTokenReader = () => null;

export async function applyAuthToken(
  config: InternalAxiosRequestConfig,
): Promise<InternalAxiosRequestConfig> {
  const token = await readAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}
