import { useCallback, useEffect, useRef, useState } from "react";

import type { AuthFieldErrors, RegisterValues } from "../auth.types";
import { registerSchema } from "../schemas/auth.schemas";
import { registerWithCurrentContract } from "../services/auth-service";
import { mapIssuesToFieldErrors } from "./auth-form-utils";

const INITIAL_VALUES: RegisterValues = {
  confirmPassword: "",
  email: "",
  fullName: "",
  password: "",
};

export function useRegisterForm() {
  const [values, setValues] = useState<RegisterValues>(INITIAL_VALUES);
  const [fieldErrors, setFieldErrors] = useState<AuthFieldErrors<RegisterValues>>({});
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
    <Field extends keyof RegisterValues>(
      field: Field,
      value: RegisterValues[Field],
    ) => {
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

    const parsed = registerSchema.safeParse(values);
    if (!parsed.success) {
      setFieldErrors(mapIssuesToFieldErrors<RegisterValues>(parsed.error.issues));
      setSubmissionError("");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setFieldErrors({});
    setSubmissionError("");

    try {
      const result = await registerWithCurrentContract(parsed.data);
      if (isMounted.current && !result.success) setSubmissionError(result.message);
    } catch {
      if (isMounted.current) {
        setSubmissionError("Không thể đăng ký lúc này. Vui lòng thử lại.");
      }
    } finally {
      submissionLock.current = false;
      if (isMounted.current) setIsSubmitting(false);
    }
  }, [values]);

  return { fieldErrors, isSubmitting, setField, submissionError, submit, values };
}
