import { Tabs } from "expo-router";

import { BottomTabBar } from "@/src/features/main/components/bottom-tab-bar";

export default function MainTabsLayout() {
  return (
    <Tabs
      backBehavior="none"
      initialRouteName="home"
      screenOptions={{
        headerShown: false,
        lazy: true,
      }}
      tabBar={(props) => <BottomTabBar {...props} />}
    >
      <Tabs.Screen name="home" options={{ title: "Nhà" }} />
      <Tabs.Screen name="history" options={{ title: "Lịch sử" }} />
      <Tabs.Screen name="chat-ai" options={{ title: "Chat AI" }} />
      <Tabs.Screen
        name="profile"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          headerShown: false,
          tabBarStyle: { display: "none" },
        }}
      />
      
    </Tabs>
  );
}
