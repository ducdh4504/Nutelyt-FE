import { View } from 'react-native';

import { ScreenContainer } from '@/src/components/layout';
import { Button, Typography } from '@/src/components/ui';

export function LoginPlaceholderScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 justify-center gap-6">
        <View className="gap-3">
          <Typography tone="primary" variant="label">
            Nutelyt
          </Typography>
          <Typography variant="title">Login placeholder</Typography>
          <Typography tone="muted">
            The onboarding flow is ready. Login and account creation screens can be connected in the
            next task.
          </Typography>
        </View>

        <Button disabled>Authentication coming soon</Button>
      </View>
    </ScreenContainer>
  );
}
