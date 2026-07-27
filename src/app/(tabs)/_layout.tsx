import { Tabs } from "expo-router";
import { Platform, StyleSheet, View } from "react-native";

import { BottomTabBar } from "@/components/navigation/bottom-tab-bar";

export default function MainTabsLayout() {
  return (
    <View style={styles.tabHost}>
      <Tabs
        backBehavior="none"
        initialRouteName="home"
        screenOptions={{
          headerShown: false,
          lazy: true,
          sceneStyle: styles.scene,
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen name="home" options={{ title: "Nhà" }} />
        <Tabs.Screen name="history" options={{ title: "Lịch sử" }} />
        <Tabs.Screen name="chat-ai" options={{ title: "Chat AI" }} />
        <Tabs.Screen name="profile" options={{ title: "Hồ sơ" }} />
      </Tabs>
    </View>
  );
}

const webShrink = Platform.OS === "web" ? { minHeight: 0 } : null;

const styles = StyleSheet.create({
  scene: {
    backgroundColor: "#FAFAF7",
    flex: 1,
    ...webShrink,
  },
  tabHost: {
    flex: 1,
    overflow: "hidden",
    ...webShrink,
  },
});
