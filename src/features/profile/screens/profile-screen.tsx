import { useRouter } from 'expo-router';
import { useState } from 'react';

import { routes } from '@/config/routes';
import { ActionDialog, HealthEditor, PersonalEditor, ProfileError, ProfileLoading, ProfileOverview, WeightCheckIn } from '@/features/profile/profile-ui';
import { useProfileManagement } from '@/features/profile/use-profile-management';

type ProfileView = 'overview' | 'personal' | 'health';

export function ProfileScreen() {
  const router = useRouter();
  const management = useProfileManagement();
  const [view, setView] = useState<ProfileView>('overview');
  const [isWeightOpen, setIsWeightOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  if (management.status === 'loading') return <ProfileLoading />;
  if (management.status === 'error') return <ProfileError onRetry={management.retry} />;
  if (view === 'personal') return <PersonalEditor initialValue={management.initialPersonalDraft} onBack={() => setView('overview')} onSave={management.updatePersonal} />;
  if (view === 'health') return <HealthEditor initialValue={management.initialHealthDraft} onBack={() => setView('overview')} onConfirm={management.updateHealth} />;
  const confirmLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    try { await management.logout(); router.replace(routes.login); } finally { setIsLoggingOut(false); }
  };

  return <>
    <ProfileOverview
      onDashboard={() => router.navigate(routes.dashboard)}
      onEditHealth={() => setView('health')}
      onEditPersonal={() => setView('personal')}
      onLogout={() => setIsLogoutOpen(true)}
      onPremium={() => router.navigate(routes.subscription)}
      onWeight={() => setIsWeightOpen(true)}
      profile={management.profile}
    />
    <WeightCheckIn currentWeight={management.profile.currentWeight ?? management.profile.weight} onClose={() => setIsWeightOpen(false)} onSave={async (weight) => { await management.recordWeight(weight); }} visible={isWeightOpen} />
    <ActionDialog body="Bạn có chắc muốn đăng xuất khỏi phiên làm việc hiện tại?" confirmLabel={isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'} onCancel={() => setIsLogoutOpen(false)} onConfirm={() => { void confirmLogout(); }} title="Đăng xuất" visible={isLogoutOpen} />
  </>;
}
