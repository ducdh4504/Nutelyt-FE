import { Feather } from '@expo/vector-icons';
import { useRouter, type Href } from 'expo-router';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { FeatherName, MainTab } from '../types';

const tabs: { id: MainTab; icon: FeatherName; label: string; path: string }[] = [
  { id: 'home', icon: 'home', label: 'Nhà', path: '/dashboard' },
  { id: 'history', icon: 'clock', label: 'Lịch sử', path: '/scan-history' },
  { id: 'chatAi', icon: 'message-circle', label: 'Chat AI', path: '/chat-ai' },
  { id: 'profile', icon: 'user', label: 'Hồ sơ', path: '/profile' },
];

export function BottomTabBar({ active, profileParam }: { active: MainTab; profileParam?: string }) {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View
      className="absolute bottom-0 left-0 right-0 flex-row items-center gap-2 bg-card px-6 pt-3"
      style={{
        boxShadow: '0 -4px 8px rgba(0, 0, 0, 0.06)',
        paddingBottom: Math.max(insets.bottom, 10),
      }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id || (active === 'scan' && tab.id === 'chatAi');
        return (
          <Pressable
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            className={`min-w-[68px] flex-1 items-center justify-center gap-1 rounded-[12px] py-2 ${
              isActive ? 'bg-primary-50' : ''
            }`}
            key={tab.id}
            onPress={() =>
              router.push({
                pathname: tab.path,
                params: profileParam ? { profile: profileParam } : undefined,
              } as unknown as Href)
            }
          >
            <Feather color={isActive ? '#006D37' : '#3D4A3F'} name={tab.icon} size={19} />
            <Text
              className={`text-center text-xs font-semibold leading-4 ${
                isActive ? 'text-primary-700' : 'text-muted'
              }`}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
