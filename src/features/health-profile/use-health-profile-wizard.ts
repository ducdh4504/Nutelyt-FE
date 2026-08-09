import { useCallback, useMemo, useRef, useState } from 'react';
import type { ZodIssue } from 'zod';

import { useMainProfile } from '@/features/profile/context/profile-context';

import { healthProfileValuesSchema, healthProfileStepSchemas } from './schemas/health-profile.schemas';
import type { HealthProfileValues, HealthProfileWizardState } from './health-profile.types';
import { toHealthProfileSummary } from './utils/health-profile';

const totalSteps = 4;

const initialValues: HealthProfileValues = {
  allergies: [],
  birthday: '',
  currentWeight: '',
  diet: null,
  fullName: '',
  gender: null,
  goalSpeed: 'balanced',
  height: '',
  targetWeight: '',
};

function toFieldErrors(issues: ZodIssue[]) {
  return issues.reduce<Partial<Record<keyof HealthProfileValues, string>>>((errors, issue) => {
    const field = issue.path[0];
    if (typeof field === 'string' && !(field in errors)) {
      errors[field as keyof HealthProfileValues] = issue.message;
    }
    return errors;
  }, {});
}

export function useHealthProfileWizard() {
  const { markHealthProfileCompleted, setProfile } = useMainProfile();
  const [state, setState] = useState<HealthProfileWizardState>({
    fieldErrors: {},
    isSubmitting: false,
    step: 0,
    values: initialValues,
  });
  const navigationLock = useRef(false);
  const submitLock = useRef(false);

  const releaseNavigationLock = useCallback(() => {
    setTimeout(() => {
      navigationLock.current = false;
    }, 220);
  }, []);

  const setValue = useCallback(<Field extends keyof HealthProfileValues>(field: Field, value: HealthProfileValues[Field]) => {
    setState((current) => ({
      ...current,
      fieldErrors: { ...current.fieldErrors, [field]: undefined },
      values: { ...current.values, [field]: value },
    }));
  }, []);

  const validate = useCallback((step: number) => {
    const normalizedStep = Math.min(Math.max(step, 0), totalSteps - 1);
    const result = healthProfileStepSchemas[normalizedStep].safeParse(state.values);
    if (result.success) {
      setState((current) => ({ ...current, fieldErrors: {} }));
      return true;
    }
    setState((current) => ({ ...current, fieldErrors: toFieldErrors(result.error.issues) }));
    return false;
  }, [state.values]);

  const next = useCallback(() => {
    if (navigationLock.current || !validate(state.step)) return false;
    navigationLock.current = true;
    setState((current) => ({ ...current, step: Math.min(current.step + 1, totalSteps - 1) }));
    releaseNavigationLock();
    return true;
  }, [releaseNavigationLock, state.step, validate]);

  const previous = useCallback(() => {
    if (navigationLock.current) return;
    navigationLock.current = true;
    setState((current) => ({ ...current, fieldErrors: {}, step: Math.max(current.step - 1, 0) }));
    releaseNavigationLock();
  }, [releaseNavigationLock]);

  const edit = useCallback((step: number) => {
    if (navigationLock.current) return;
    navigationLock.current = true;
    setState((current) => ({ ...current, fieldErrors: {}, step: Math.min(Math.max(step, 0), totalSteps - 1) }));
    releaseNavigationLock();
  }, [releaseNavigationLock]);

  const toggleAllergy = useCallback((allergy: string) => {
    setState((current) => {
      const isSelected = current.values.allergies.includes(allergy);
      return {
        ...current,
        fieldErrors: { ...current.fieldErrors, allergies: undefined },
        values: {
          ...current.values,
          allergies: isSelected
            ? current.values.allergies.filter((item) => item !== allergy)
            : [...current.values.allergies, allergy],
        },
      };
    });
  }, []);

  const finish = useCallback(() => {
    if (submitLock.current || !validate(totalSteps - 1)) return false;
    const result = healthProfileValuesSchema.safeParse(state.values);
    if (!result.success) {
      setState((current) => ({ ...current, fieldErrors: toFieldErrors(result.error.issues), step: 0 }));
      return false;
    }

    submitLock.current = true;
    setState((current) => ({ ...current, isSubmitting: true }));
    try {
      setProfile(toHealthProfileSummary(result.data));
      markHealthProfileCompleted();
      return true;
    } catch {
      submitLock.current = false;
      setState((current) => ({
        ...current,
        isSubmitting: false,
        fieldErrors: { ...current.fieldErrors, fullName: 'Không thể lưu hồ sơ. Vui lòng thử lại.' },
      }));
      return false;
    }
  }, [markHealthProfileCompleted, setProfile, state.values, validate]);

  return useMemo(() => ({
    edit,
    finish,
    next,
    previous,
    setValue,
    state,
    toggleAllergy,
    totalSteps,
  }), [edit, finish, next, previous, setValue, state, toggleAllergy]);
}
