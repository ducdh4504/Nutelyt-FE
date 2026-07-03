import type { ReactNode } from 'react';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import type { HealthProfileSummary, RouteProfileParams } from '../types';
import { getProfileFallback, parseHealthProfileParam, serializeProfile } from '../utils/health-profile';

type ProfileContextValue = {
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
  const profileParam = useMemo(() => serializeProfile(profile), [profile]);
  const value = useMemo(() => ({ profile, profileParam, setProfile }), [profile, profileParam]);

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
  const { profile, profileParam, setProfile } = useMainProfile();
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
    profile: activeProfile,
    profileParam: hasRouteProfile ? activeProfileParam : profileParam,
    saveProfile,
  };
}
