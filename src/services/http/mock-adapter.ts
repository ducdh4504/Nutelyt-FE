import {
  AxiosHeaders,
  type AxiosAdapter,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

export function createMockAdapter<T>(readData: () => T): AxiosAdapter {
  return async (config: InternalAxiosRequestConfig) => {
    const response: AxiosResponse<T> = {
      config,
      data: readData(),
      headers: new AxiosHeaders({ "content-type": "application/json" }),
      status: 200,
      statusText: "OK",
    };

    return response;
  };
}
