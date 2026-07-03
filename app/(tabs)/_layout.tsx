import { Tabs } from 'expo-router';

import { BottomTabBar } from '@/src/features/main/components/bottom-tab-bar';

function firstParam(value: unknown) {
  return Array.isArray(value) ? value[0] : value;
}

function isHealthProfileReviewParam(value: unknown) {
  const profileParam = firstParam(value);

  if (typeof profileParam !== 'string') {
    return false;
  }

  try {
    const parsed = JSON.parse(profileParam) as {
      age?: unknown;
      dateOfBirth?: unknown;
      dietLabel?: unknown;
      diseases?: unknown;
      goalLabel?: unknown;
    };

    return (
      typeof parsed.dateOfBirth === 'string' &&
      typeof parsed.goalLabel === 'string' &&
      typeof parsed.dietLabel === 'string' &&
      typeof parsed.age === 'undefined' &&
      typeof parsed.diseases === 'undefined'
    );
  } catch {
    return false;
  }
}

export default function MainTabsLayout() {
  return (
    <Tabs
      backBehavior="none"
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => {
        const focusedRoute = props.state.routes[props.state.index];
        const focusedParams = focusedRoute.params as { mode?: unknown; profile?: unknown } | undefined;
        const mode = firstParam(focusedParams?.mode);
        const isProfileReview =
          focusedRoute.name === 'profile' &&
          (mode === 'review' || isHealthProfileReviewParam(focusedParams?.profile));

        return isProfileReview ? null : <BottomTabBar {...props} />;
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Nhà' }} />
      <Tabs.Screen name="history" options={{ title: 'Lịch sử' }} />
      <Tabs.Screen name="chat-ai" options={{ title: 'Chat AI' }} />
      <Tabs.Screen name="profile" options={{ title: 'Hồ sơ' }} />
    </Tabs>
  );
}
