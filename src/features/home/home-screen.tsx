import { View } from 'react-native';

import { ScreenContainer } from '@/src/components/layout';
import { Button, Card, Typography } from '@/src/components/ui';

export function HomeScreen() {
  return (
    <ScreenContainer scroll>
      <View className="gap-6">
        <View className="gap-2">
          <Typography tone="primary" variant="label">
            Nutelyt
          </Typography>
          <Typography variant="title">Your nutrition home base</Typography>
          <Typography tone="muted">
            Track meals, review insights, and prepare gentle nutrition alerts here later.
          </Typography>
        </View>

        <Card className="gap-4">
          <View className="gap-1">
            <Typography variant="subtitle">Today</Typography>
            <Typography tone="muted">
              This placeholder keeps the home screen ready for future dashboard cards.
            </Typography>
          </View>
          <Button>Log a meal</Button>
        </Card>

        <Card className="gap-3 border-warning-100 bg-warning-50">
          <Typography tone="warning" variant="label">
            Nutrition alerts
          </Typography>
          <Typography tone="muted">
            Warning states will use this color family for calories, allergens, and goal reminders.
          </Typography>
        </Card>
      </View>
    </ScreenContainer>
  );
}
