import { Link } from 'expo-router';
import { View } from 'react-native';

import { ScreenContainer } from '@/src/components/layout';
import { Button, Card, Typography } from '@/src/components/ui';

export function WelcomeScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 justify-between gap-8">
        <View className="gap-4">
          <Typography tone="primary" variant="label">
            Welcome
          </Typography>
          <Typography variant="title">Build healthier food habits with Nutelyt</Typography>
          <Typography tone="muted">
            This is a simple onboarding placeholder. The final visual design can come from Figma
            later without changing the app structure.
          </Typography>
        </View>

        <Card className="gap-4">
          <Typography variant="subtitle">Frontend foundation</Typography>
          <Typography tone="muted">
            Reusable components, design tokens, and feature folders are ready for the next screens.
          </Typography>
          <Link asChild href="../login">
            <Button>Continue</Button>
          </Link>
        </Card>
      </View>
    </ScreenContainer>
  );
}
