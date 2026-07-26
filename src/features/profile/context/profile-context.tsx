import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { getProfileFallback, parseHealthProfileParam, serializeProfile } from '@/src/features/health-profile/utils/health-profile';

import type { HealthProfileSummary, RouteProfileParams } from '../profile.types';

type ProfileContextValue = {
  hasCompletedHealthProfileThisRuntime: boolean;
  markHealthProfileCompleted: () => void;
  profile: HealthProfileSummary;
  profileParam: string;
  setProfile: (profile: HealthProfileSummary) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function MainProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<HealthProfileSummary>(() => getProfileFallback());
  const [hasCompletedHealthProfileThisRuntime, setHasCompletedHealthProfileThisRuntime] = useState(false);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const markHealthProfileCompleted = useCallback(() => {
    setHasCompletedHealthProfileThisRuntime(true);
  }, []);
  const value = useMemo(
    () => ({
      hasCompletedHealthProfileThisRuntime,
      markHealthProfileCompleted,
      profile,
      profileParam,
      setProfile,
    }),
    [hasCompletedHealthProfileThisRuntime, markHealthProfileCompleted, profile, profileParam]
  );

  return <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>;
}

export function useMainProfile() {
  const context = useContext(ProfileContext);

  if (!context) {
    throw new Error('useMainProfile must be used inside MainProfileProvider');
  }

  return context;
}

export function useHydratedProfile(params: RouteProfileParams) {
  const {
    hasCompletedHealthProfileThisRuntime,
    markHealthProfileCompleted,
    profile,
    profileParam,
    setProfile,
  } = useMainProfile();
  const routeProfileParam = firstParam(params.profile);
  const routeProfile = useMemo(
    () => parseHealthProfileParam({ profile: routeProfileParam }),
    [routeProfileParam]
  );
  const hasRouteProfile = Boolean(routeProfileParam);

  useEffect(() => {
    if (hasRouteProfile) {
      setProfile(routeProfile);
    }
  }, [hasRouteProfile, routeProfile, setProfile]);

  const activeProfile = hasRouteProfile ? routeProfile : profile;
  const activeProfileParam = useMemo(() => serializeProfile(activeProfile), [activeProfile]);
  const saveProfile = useCallback(
    (nextProfile: HealthProfileSummary) => {
      setProfile(nextProfile);
    },
    [setProfile]
  );

  return {
    hasCompletedHealthProfileThisRuntime,
    markHealthProfileCompleted,
    profile: activeProfile,
    profileParam: hasRouteProfile ? activeProfileParam : profileParam,
    saveProfile,
  };
}
