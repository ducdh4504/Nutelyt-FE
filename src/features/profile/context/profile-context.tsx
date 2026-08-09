import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { healthProfileStorage } from '@/features/health-profile/storage/health-profile-storage';
import {
  getProfileFallback,
  parseHealthProfileParam,
  serializeProfile,
} from '@/features/health-profile/utils/health-profile';
import type { HealthProfileSummary } from '@/features/health-profile/health-profile.types';
import type { RouteProfileParams } from '@/types/navigation.types';
import { getFirstRouteParam } from '@/utils/route-params';

type ProfileContextValue = {
  hasCompletedHealthProfileThisRuntime: boolean;
  markHealthProfileCompleted: () => void;
  profile: HealthProfileSummary;
  profileParam: string;
  setProfile: (profile: HealthProfileSummary) => void;
};

const ProfileContext = createContext<ProfileContextValue | null>(null);

export function MainProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfileState] = useState<HealthProfileSummary>(
    () => healthProfileStorage.read() ?? getProfileFallback()
  );
  const [hasCompletedHealthProfileThisRuntime, setHasCompletedHealthProfileThisRuntime] = useState(false);
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const setProfile = useCallback((nextProfile: HealthProfileSummary) => {
    healthProfileStorage.save(nextProfile);
    setProfileState(nextProfile);
  }, []);
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
    [hasCompletedHealthProfileThisRuntime, markHealthProfileCompleted, profile, profileParam, setProfile]
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
  const routeProfileParam = getFirstRouteParam(params.profile);
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
