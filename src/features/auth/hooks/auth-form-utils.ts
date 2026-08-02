import type { ZodIssue } from "zod";

import type { AuthFieldErrors } from "../auth.types";

export function mapIssuesToFieldErrors<T extends Record<string, string>>(
  issues: ZodIssue[],
): AuthFieldErrors<T> {
  const errors: AuthFieldErrors<T> = {};

  issues.forEach((issue) => {
    const field = issue.path[0];

    if (typeof field === "string" && !(field in errors)) {
      errors[field as keyof T] = issue.message;
    }
  });

  return errors;
}
