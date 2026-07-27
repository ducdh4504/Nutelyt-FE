import type { AxiosError, AxiosResponse } from "axios";

export async function handleFutureTokenRefresh(
  error: AxiosError,
): Promise<AxiosResponse> {
  return Promise.reject(error);
}
