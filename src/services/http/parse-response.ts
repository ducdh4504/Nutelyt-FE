import { z } from "zod";

import { ValidationError } from "@/services/http/api-error";

export function parseApiResponse<T>(schema: z.ZodType<T>, data: unknown): T {
  const result = schema.safeParse(data);

  if (!result.success) {
    throw new ValidationError(
      "API response validation failed",
      result.error.issues,
      result.error,
    );
  }

  return result.data;
}
