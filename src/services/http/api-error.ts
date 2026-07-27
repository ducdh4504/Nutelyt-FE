import { isAxiosError } from "axios";

export type ApiErrorDetails = Record<string, unknown> | readonly unknown[] | null;

export class ApiError extends Error {
  readonly code?: string;
  readonly details?: ApiErrorDetails;
  readonly originalError?: unknown;
  readonly status?: number;

  constructor(
    message: string,
    options: {
      code?: string;
      details?: ApiErrorDetails;
      originalError?: unknown;
      status?: number;
    } = {},
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code;
    this.details = options.details;
    this.originalError = options.originalError;
    this.status = options.status;
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, details?: ApiErrorDetails, originalError?: unknown) {
    super(message, { code: "VALIDATION_ERROR", details, originalError });
    this.name = "ValidationError";
  }
}

export class NetworkError extends ApiError {
  constructor(message = "Network request failed", originalError?: unknown) {
    super(message, { code: "NETWORK_ERROR", originalError });
    this.name = "NetworkError";
  }
}

export class UnknownError extends ApiError {
  constructor(message = "An unknown error occurred", originalError?: unknown) {
    super(message, { code: "UNKNOWN_ERROR", originalError });
    this.name = "UnknownError";
  }
}

type ErrorResponseBody = {
  code?: string;
  details?: ApiErrorDetails;
  message?: string;
};

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (!isAxiosError<ErrorResponseBody>(error)) {
    return new UnknownError(undefined, error);
  }

  if (!error.response) {
    return new NetworkError(error.message, error);
  }

  return new ApiError(
    error.response.data?.message ?? error.message ?? "API request failed",
    {
      code: error.response.data?.code,
      details: error.response.data?.details,
      originalError: error,
      status: error.response.status,
    },
  );
}
