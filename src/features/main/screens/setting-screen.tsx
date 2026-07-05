import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, ScrollView, Switch, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useHydratedProfile } from "../context/profile-context";
import type { HealthProfileSummary, RouteProfileParams } from "../types";
import {
  parseHealthProfileParam,
  serializeProfile,
} from "../utils/health-profile";

const ui = {
  background: "#FAFAFA",
  card: "#F7F7F7",
  text: "#2F3430",
  muted: "#9CA3A0",
  border: "#E9E9E9",
  primary: "#064E22",
  green: "#0B6B2A",
  greenSoft: "#E5F4EA",
  danger: "#E11D48",
};

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function isHealthProfileReviewPayload(profileParam: string | undefined) {
  if (!profileParam) {
    return false;
  }

  try {
    const parsed = JSON.parse(profileParam) as {
      dateOfBirth?: unknown;
      goalLabel?: unknown;
      dietLabel?: unknown;
      age?: unknown;
      diseases?: unknown;
    };

    return (
      typeof parsed.dateOfBirth === "string" &&
      typeof parsed.goalLabel === "string" &&
      typeof parsed.dietLabel === "string" &&
      typeof parsed.age === "undefined" &&
      typeof parsed.diseases === "undefined"
    );
  } catch {
    return false;
  }
}

function getProfileDisplay(profile: HealthProfileSummary) {
  const fullName = profile.fullName.trim();
  const fallback = "Người dùng Nutelyt";
  const displayName =
    !fullName || fullName === fallback ? "Người dùng Nutelyt" : fullName;

  const genderRaw = (profile.gender ?? "").trim();
  const gender = genderRaw && genderRaw !== "--" ? genderRaw : "Chưa cập nhật";

  const age =
    profile.age && profile.age !== "--"
      ? profile.age
      : profile.dateOfBirth
        ? calculateAgeString(profile.dateOfBirth)
        : "Chưa cập nhật";

  return {
    fullName: displayName,
    gender,
    age,
    initials: getInitials(displayName),
  };
}

function calculateAgeString(dateOfBirth: string) {
  const [year, month, day] = dateOfBirth.split("-").map(Number);
  if (!year || !month || !day) {
    return "Chưa cập nhật";
  }
  const today = new Date();
  let age = today.getFullYear() - year;
  const hasHadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  if (!hasHadBirthday) {
    age -= 1;
  }
  return age > 0 ? `${age} tuổi` : "Chưa cập nhật";
}

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const last = parts.at(-1) ?? "";
  return (last.charAt(0) || "N").toLocaleUpperCase("vi-VN");
}

function Header({ onBack }: { onBack: () => void }) {
  return (
    <View className="h-[56px] flex-row items-center px-5">
      <Pressable
        accessibilityLabel="Quay lại"
        accessibilityRole="button"
        className="h-11 w-10 items-start justify-center"
        onPress={onBack}
      >
        <Feather color="#0F172A" name="chevron-left" size={24} />
      </Pressable>

      <Text className="text-[20px] font-medium text-black">Cài đặt</Text>
    </View>
  );
}

function ProfileHeader({ profile }: { profile: HealthProfileSummary }) {
  const { fullName, gender, age, initials } = getProfileDisplay(profile);

  return (
    <View className="items-center pb-5 pt-5">
      <View className="relative">
        <View className="h-[112px] w-[112px] items-center justify-center overflow-hidden rounded-full bg-[#D9DEDB]">
          <View className="absolute inset-0 items-center justify-center">
            <Text className="text-[40px] font-bold text-white">{initials}</Text>
          </View>
        </View>

        <View className="absolute bottom-2 right-0 h-9 w-9 items-center justify-center rounded-full border-[3px] border-white bg-[#006D2F]">
          <Feather color="#FFFFFF" name="check-circle" size={17} />
        </View>
      </View>

      <Text className="mt-4 text-[22px] font-bold leading-7 text-[#444444]">
        {fullName}
      </Text>

      <View className="mt-3 rounded-full bg-[#E1F2E6] px-5 py-2">
        <Text className="text-[13px] font-medium text-[#6CA87E]">
          {`${gender} • ${age}`}
        </Text>
      </View>
    </View>
  );
}

function SectionTitle({ title }: { title: string }) {
  return (
    <Text className="mb-3 px-2 text-[17px] font-semibold leading-6 text-[#3D4A3F]">
      {title}
    </Text>
  );
}

function SettingsCard({ children }: { children: React.ReactNode }) {
  return (
    <View
      className="overflow-hidden rounded-[12px] bg-card"
      style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.04)" }}
    >
      {children}
    </View>
  );
}

function Divider() {
  return <View className="ml-[54px] h-px bg-[#ECECEC]" />;
}

function SettingRow({
  icon,
  title,
  value,
  danger,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  title: string;
  value?: string;
  danger?: boolean;
  onPress?: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="min-h-[58px] flex-row items-center px-5"
      onPress={onPress}
    >
      <View className="w-[34px]">
        <Feather
          color={danger ? ui.danger : ui.primary}
          name={icon}
          size={21}
        />
      </View>

      <Text
        className="flex-1 text-[15px] font-medium leading-5"
        style={{ color: danger ? ui.danger : "#3D4A3F" }}
      >
        {title}
      </Text>

      {value ? (
        <Text className="mr-5 text-[14px] leading-5 text-[#9CA3A0]">
          {value}
        </Text>
      ) : null}

      <Feather color="#9CA3A0" name="chevron-right" size={20} />
    </Pressable>
  );
}

function SwitchRow({
  enabled,
  onChange,
  title,
}: {
  enabled: boolean;
  onChange: (value: boolean) => void;
  title: string;
}) {
  return (
    <View className="min-h-[58px] flex-row items-center px-5">
      <View className="w-[34px]">
        <Feather color={ui.primary} name="shield" size={21} />
      </View>

      <Text className="flex-1 text-[15px] font-medium leading-5 text-[#3D4A3F]">
        {title}
      </Text>

      <Switch
        ios_backgroundColor="#D1D5DB"
        onValueChange={onChange}
        thumbColor="#FFFFFF"
        trackColor={{
          false: "#D1D5DB",
          true: "#006D2F",
        }}
        value={enabled}
      />
    </View>
  );
}

export function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<
    RouteProfileParams & { mode?: string | string[] }
  >();

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  const profileParamValue = firstParam(params.profile);
  const routeMode = firstParam(params.mode);
  const isReviewMode =
    routeMode === "review" ||
    (!routeMode && isHealthProfileReviewPayload(profileParamValue));

  const { profile, profileParam } = useHydratedProfile(params);
  const activeProfile = useMemo(
    () => parseHealthProfileParam({ profile: profileParam }),
    [profileParam],
  );

  const displayProfile = isReviewMode ? activeProfile : profile;

  const profileParamString = useMemo(
    () => serializeProfile(displayProfile),
    [displayProfile],
  );

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: "/profile",
      params: { profile: profileParamString },
    } as unknown as Href);
  };

  const openEditProfile = () => {
    router.push({
      pathname: "/health-profile",
      params: { profile: profileParamString },
    } as unknown as Href);
  };

  const openProfile = () => {
    router.push({
      pathname: "/health-profile-summary",
      params: { profile: profileParamString },
    } as unknown as Href);
  };

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: ui.background,
        paddingTop: insets.top,
      }}
    >
      <Header onBack={goBack} />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: Math.max(insets.bottom + 34, 64),
          paddingHorizontal: 24,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader profile={displayProfile} />

        <View className="mt-1">
          <SectionTitle title="Tài khoản" />

          <SettingsCard>
            <SettingRow
              icon="user"
              title="Hồ sơ"
              value={displayProfile.fullName.trim() || "Người dùng"}
              onPress={openProfile}
            />
            <Divider />

            <SettingRow
              icon="edit-2"
              title="Thông tin cá nhân"
              onPress={openEditProfile}
            />
            <Divider />

            <SettingRow
              icon="heart"
              title="Hồ sơ sức khỏe"
              onPress={openEditProfile}
            />
          </SettingsCard>
        </View>

        <View className="mt-6">
          <SectionTitle title="Bảo mật" />

          <SettingsCard>
            <SwitchRow
              enabled={twoFactorEnabled}
              onChange={setTwoFactorEnabled}
              title="Xác thực hai lớp"
            />
            <Divider />

            <SettingRow icon="monitor" title="Thiết bị đã đăng nhập" />
          </SettingsCard>
        </View>

        <View className="mt-6">
          <SectionTitle title="Dữ liệu và quyền riêng tư" />

          <SettingsCard>
            <SettingRow icon="download" title="Xuất dữ liệu dinh dưỡng" />
            <Divider />

            <SettingRow danger icon="loader" title="Xóa toàn bộ lịch sử" />
          </SettingsCard>
        </View>

        <View className="mt-6">
          <SectionTitle title="Hỗ trợ" />

          <SettingsCard>
            <SettingRow icon="help-circle" title="Trung tâm trợ giúp" />
            <Divider />

            <SettingRow icon="message-square" title="Gửi phản hồi" />
            <Divider />

            <SettingRow icon="star" title="Đánh giá ứng dụng" />
          </SettingsCard>
        </View>

        <View className="mt-7 overflow-hidden rounded-[12px] bg-card">
          <SettingRow danger icon="slash" title="Xóa tài khoản" />
          <Divider />

          <SettingRow icon="log-out" title="Đăng xuất" />
        </View>
      </ScrollView>
    </View>
  );
}
