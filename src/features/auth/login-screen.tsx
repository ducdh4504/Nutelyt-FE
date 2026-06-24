import { View } from 'react-native';

import { ScreenContainer } from '@/src/components/layout';
import { Button, Card, Input, Typography } from '@/src/components/ui';

export function LoginScreen() {
  return (
    <ScreenContainer>
      <View className="flex-1 justify-center gap-6">
        <View className="gap-2">
          <Typography variant="title">Log in</Typography>
          <Typography tone="muted">
            Authentication is not connected yet. This placeholder is only for layout planning.
          </Typography>
        </View>

        <Card className="gap-4">
          <Input
            autoCapitalize="none"
            keyboardType="email-address"
            label="Email"
            placeholder="you@example.com"
          />
          <Input label="Password" placeholder="Password" secureTextEntry />
          <Button>Continue</Button>
          <Button variant="ghost">Create an account later</Button>
        </Card>
      </View>
    </ScreenContainer>
  );
}
