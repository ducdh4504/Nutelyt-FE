import { useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";

import { routes } from "@/config/routes";
import { useMainProfile } from "@/features/profile";

import type { AuthFieldErrors, LoginValues } from "../auth.types";
import { loginSchema } from "../schemas/auth.schemas";
import { authenticateWithCurrentContract } from "../services/auth-service";
import { mapIssuesToFieldErrors } from "./auth-form-utils";

const INITIAL_VALUES: LoginValues = { email: "", password: "" };

export function useLoginForm() {
  const router = useRouter();
  const { hasCompletedHealthProfileThisRuntime } = useMainProfile();
  const [values, setValues] = useState<LoginValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors<LoginValues>>({});
  const [submissionError, setSubmissionError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMounted = useRef(true);
  const submissionLock = useRef(false);

  useEffect(
    () => () => {
      isMounted.current = false;
    },
    [],
  );

  const setField = useCallback(
    <Field extends keyof LoginValues>(field: Field, value: LoginValues[Field]) => {
      setValues((current) => ({ ...current, [field]: value }));
      setFieldErrors((current) => {
        if (!current[field]) return current;
        const next = { ...current };
        delete next[field];
        return next;
      });
      setSubmissionError("");
    },
    [],
  );

  const submit = useCallback(async () => {
    if (submissionLock.current) return;

    const parsed = loginSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(mapIssuesToFieldErrors<LoginValues>(parsed.error.issues));
      setSubmissionError("");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setFieldErrors({});
    setSubmissionError("");

    try {
      const result = await authenticateWithCurrentContract(parsed.data);
      if (!isMounted.current) return;

      if (!result.success) {
        setSubmissionError(result.message);
        return;
      }

      router.replace(
        hasCompletedHealthProfileThisRuntime ? routes.home : routes.healthProfile,
      );
    } catch {
      if (isMounted.current) {
        setSubmissionError("Không thể đăng nhập lúc này. Vui lòng thử lại.");
      }
    } finally {
      submissionLock.current = false;
      if (isMounted.current) setIsSubmitting(false);
    }
  }, [hasCompletedHealthProfileThisRuntime, router, values]);

  return { fieldErrors, isSubmitting, setField, submissionError, submit, values };
}
