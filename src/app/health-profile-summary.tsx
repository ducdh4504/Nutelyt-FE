import { Redirect } from 'expo-router';

import { routes } from '@/config/routes';

export default function HealthProfileSummaryRoute() {
  return <Redirect href={routes.profile} />;
}
