import { Redirect } from 'expo-router';

import { routes } from '@/config/routes';

export default function SettingTabRoute() {
  return <Redirect href={routes.profile} />;
}
