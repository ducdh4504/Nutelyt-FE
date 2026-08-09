import { Redirect } from 'expo-router';

import { routes } from '@/config/routes';

export default function HealthProfileReviewRoute() {
  return <Redirect href={routes.profile} />;
}
