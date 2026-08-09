import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { logoutWithCurrentContract } from '@/features/auth';
import { calculateAgeFromBirthDate, healthProfileValuesSchema, toHealthProfileSummary } from '@/features/health-profile';
import { useMainProfile } from '@/features/profile/context/profile-context';
import { runtimeWeightRepository } from '@/features/profile/repositories/runtime-weight.repository';
import type { HealthProfileDraft, PersonalProfileDraft } from '@/features/profile/profile.types';

function toHealthDraft(profile: ReturnType<typeof useMainProfile>['profile']): HealthProfileDraft {
  const gender = profile.gender === 'Nam' || profile.gender === 'Nữ' || profile.gender === 'Khác' ? profile.gender : 'Khác';
  const diet = profile.diet === 'standard' || profile.diet === 'vegetarian' || profile.diet === 'vegan' || profile.diet === 'low-carb' || profile.diet === 'high-protein' || profile.diet === 'other' ? profile.diet : 'standard';
  const goalSpeed = profile.goalSpeed === 'mild' || profile.goalSpeed === 'balanced' || profile.goalSpeed === 'aggressive' ? profile.goalSpeed : 'balanced';
  return { allergies: profile.allergies ?? profile.allergyText.split(',').map((item) => item.trim()).filter(Boolean), birthday: profile.birthday ?? profile.dateOfBirth, currentWeight: profile.currentWeight ?? profile.weight, diet, fullName: profile.fullName, gender, goalSpeed, height: profile.height, targetWeight: profile.targetWeight ?? profile.weight };
}

export function useProfileManagement() {
  const queryClient = useQueryClient();
  const { profile, setProfile } = useMainProfile();
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => { if (active) setStatus('ready'); }).catch(() => { if (active) { setError('Không thể tải hồ sơ.'); setStatus('error'); } });
    return () => { active = false; };
  }, []);
  const retry = useCallback(() => { setError(null); setStatus('loading'); Promise.resolve().then(() => setStatus('ready')); }, []);
  const updatePersonal = useCallback(async (draft: PersonalProfileDraft) => {
    setProfile({ ...profile, age: calculateAgeFromBirthDate(draft.birthday), birthday: draft.birthday, dateOfBirth: draft.birthday, fullName: draft.fullName.trim(), gender: draft.gender ?? 'Khác' });
  }, [profile, setProfile]);
  const updateHealth = useCallback(async (draft: HealthProfileDraft) => {
    const values = healthProfileValuesSchema.parse(draft);
    setProfile(toHealthProfileSummary(values));
    await queryClient.invalidateQueries({ queryKey: ['home', 'snapshot'] });
  }, [queryClient, setProfile]);
  const recordWeight = useCallback(async (weightText: string) => {
    const parsed = healthProfileValuesSchema.shape.currentWeight.parse(weightText);
    const measurement = runtimeWeightRepository.create(Number(parsed), new Date());
    setProfile({ ...profile, currentWeight: parsed, weight: parsed });
    await queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    return measurement;
  }, [profile, queryClient, setProfile]);
  const initialPersonalDraft = useMemo<PersonalProfileDraft>(() => ({ birthday: profile.birthday ?? profile.dateOfBirth, fullName: profile.fullName, gender: profile.gender === 'Nam' || profile.gender === 'Nữ' || profile.gender === 'Khác' ? profile.gender : null }), [profile]);
  const initialHealthDraft = useMemo(() => toHealthDraft(profile), [profile]);
  return { error, initialHealthDraft, initialPersonalDraft, logout: logoutWithCurrentContract, profile, recordWeight, retry, status, updateHealth, updatePersonal };
}
