import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter, type Href } from "expo-router";
import { useMemo } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { routes } from "@/src/config/routes";
import { useHydratedProfile } from "../context/profile-context";
import type { HealthProfileSummary, RouteProfileParams } from "../types";
import {
  parseHealthProfileParam,
  serializeProfile,
} from "../utils/health-profile";

const ui = {
  background: "#FAFAFA",
  card: "#FFFFFF",
  text: "#2F3430",
  muted: "#9CA3A0",
  border: "#ECEFEC",
  primary: "#27AE60",
  primaryDark: "#0B6B2A",
  primarySoft: "#E5F4EA",
};

const cardShadow = {
  shadowColor: "#0F172A",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.04,
  shadowRadius: 8,
  elevation: 1,
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

function formatDate(date?: string) {
  if (!date || date === "--") {
    return "Chưa cập nhật";
  }

  const [year, month, day] = date.split("-");

  if (!year || !month || !day) {
    return date;
  }

  return `${day}/${month}/${year}`;
}

function getInitials(name: string) {
  const parts = name.split(/\s+/).filter(Boolean);
  const last = parts.at(-1) ?? "";

  return (last.charAt(0) || "N").toLocaleUpperCase("vi-VN");
}

function getProfileDisplay(profile: HealthProfileSummary) {
  const fullName = profile.fullName?.trim();
  const displayName = fullName || "Người dùng Nutelyt";

  const genderRaw = (profile.gender ?? "").trim();
  const gender = genderRaw && genderRaw !== "--" ? genderRaw : "Chưa cập nhật";

  const age =
    profile.age && profile.age !== "--"
      ? profile.age
      : profile.dateOfBirth
        ? calculateAgeString(profile.dateOfBirth)
        : "Chưa cập nhật";

  const height =
    profile.height && profile.height !== "--" ? `${profile.height}cm` : "--";

  const weight =
    profile.weight && profile.weight !== "--" ? `${profile.weight}kg` : "--";

  const goal = profile.goalLabel || profile.goal || "Chưa cập nhật";
  const disease = profile.diseases.join(", ") || "Không có";
  const allergy = profile.allergyText || "Không có";
  const diet = profile.dietLabel || profile.diet || "Chưa cập nhật";
  const activity = profile.conditionLabels.join(", ") || "Chưa cập nhật";

  return {
    fullName: displayName,
    email: "admin@gmail.com",
    gender,
    age,
    height,
    weight,
    dateOfBirth: formatDate(profile.dateOfBirth),
    goal,
    disease,
    allergy,
    diet,
    activity,
    initials: getInitials(displayName),
  };
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

      <Text className="text-[18px] font-medium text-black">
        Hồ sơ sức khỏe
      </Text>
    </View>
  );
}

function ProfileHeader({ profile }: { profile: HealthProfileSummary }) {
  const { fullName, email, gender, age, initials } = getProfileDisplay(profile);

  return (
    <View className="items-center pb-5 pt-7">
      <View className="relative">
        <View className="h-[100px] w-[100px] items-center justify-center rounded-full bg-[#DDE3DF]">
          <View className="h-[86px] w-[86px] items-center justify-center rounded-full bg-[#9CA3A0]">
            <Text className="text-[36px] font-bold text-white">
              {initials}
            </Text>
          </View>
        </View>

        <View className="absolute bottom-1 right-0 h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#006D2F]">
          <Feather color="#FFFFFF" name="check-circle" size={16} />
        </View>
      </View>

      <Text className="mt-4 text-[20px] font-bold leading-7 text-[#444444]">
        {fullName}
      </Text>

      <Text className="mt-1 text-[13px] leading-5 text-[#9CA3A0]">
        {email}
      </Text>

      <View className="mt-2 rounded-full bg-[#E1F2E6] px-4 py-1.5">
        <Text className="text-[12px] font-medium text-[#6CA87E]">
          {gender} • {age}
        </Text>
      </View>
    </View>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View
      className="h-[82px] flex-1 items-center justify-center rounded-[10px] border"
      style={[
        cardShadow,
        {
          backgroundColor: ui.card,
          borderColor: ui.border,
        },
      ]}
    >
      {icon ? (
        <View className="mb-1 h-8 w-8 items-center justify-center rounded-[8px] bg-[#E7F4EC]">
          <Feather color={ui.primaryDark} name={icon} size={17} />
        </View>
      ) : null}

      <Text className="text-[11px] leading-4 text-[#A0A0A0]">{label}</Text>

      <Text className="mt-0.5 text-[13px] font-bold leading-5 text-[#555555]">
        {value}
      </Text>
    </View>
  );
}

function DateCard({ value }: { value: string }) {
  return (
    <View
      className="h-[76px] justify-center rounded-[10px] border px-5"
      style={[
        cardShadow,
        {
          backgroundColor: ui.card,
          borderColor: ui.border,
        },
      ]}
    >
      <Text className="text-[11px] leading-4 text-[#A0A0A0]">Ngày sinh</Text>

      <Text className="mt-1 text-[13px] font-semibold leading-5 text-[#555555]">
        {value}
      </Text>
    </View>
  );
}

function SectionHeader({
  title,
  action,
}: {
  title: string;
  action?: string;
}) {
  return (
    <View className="mb-3 flex-row items-center justify-between px-1">
      <Text className="text-[16px] font-medium leading-6 text-[#5F665F]">
        {title}
      </Text>

      {action ? (
        <Text className="text-[12px] leading-4 text-[#6B8F78]">{action}</Text>
      ) : null}
    </View>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View className="min-h-[58px] flex-row items-center px-4">
      <View className="w-9">
        <Feather color="#47785C" name={icon} size={18} />
      </View>

      <Text className="flex-1 text-[13px] leading-5 text-[#9CA3A0]">
        {label}
      </Text>

      <Text className="max-w-[135px] text-right text-[12px] font-semibold leading-5 text-[#6A706B]">
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View className="ml-[52px] h-px bg-[#ECECEC]" />;
}

function HealthInfoCard({ profile }: { profile: HealthProfileSummary }) {
  const display = getProfileDisplay(profile);

  return (
    <View
      className="overflow-hidden rounded-[14px] border bg-white"
      style={[
        cardShadow,
        {
          borderColor: ui.border,
        },
      ]}
    >
      <InfoRow icon="target" label="Mục tiêu" value={display.goal} />
      <Divider />

      <InfoRow icon="briefcase" label="Bệnh nền" value={display.disease} />
      <Divider />

      <InfoRow icon="thermometer" label="Dị ứng" value={display.allergy} />
      <Divider />

      <InfoRow icon="sliders" label="Chế độ ăn" value={display.diet} />
      <Divider />

      <InfoRow icon="activity" label="Mức vận động" value={display.activity} />
    </View>
  );
}

function PrimaryButton({
  icon,
  label,
  onPress,
}: {
  icon?: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-[56px] flex-row items-center justify-center gap-2 rounded-[10px]"
      onPress={onPress}
      style={{ backgroundColor: ui.primary }}
    >
      {icon ? <Feather color="#FFFFFF" name={icon} size={18} /> : null}

      <Text className="text-[15px] font-bold leading-6 text-white">
        {label}
      </Text>
    </Pressable>
  );
}

function OutlineButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      className="h-[54px] flex-row items-center justify-center gap-2 rounded-[10px] border"
      onPress={onPress}
      style={{
        backgroundColor: "#FFFFFF",
        borderColor: ui.primary,
      }}
    >
      <Feather color={ui.primary} name={icon} size={18} />

      <Text className="text-[14px] font-bold leading-5 text-[#27AE60]">
        {label}
      </Text>
    </Pressable>
  );
}

export function HealthProfileSummaryScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const params = useLocalSearchParams<
    RouteProfileParams & { mode?: string | string[] }
  >();

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

  const display = getProfileDisplay(displayProfile);

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace({
      pathname: routes.profileSettings,
      params: { profile: profileParamString },
    } as unknown as Href);
  };

  const openEditProfile = () => {
    router.push({
      pathname: routes.healthProfile,
      params: { profile: profileParamString },
    });
  };

  const openDashboard = () => {
    router.push({
      pathname: routes.dashboard,
      params: { profile: profileParamString },
    });
  };

  const openSubscription = () => {
    router.push(routes.subscription);
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
          paddingBottom: Math.max(insets.bottom + 34, 72),
          paddingHorizontal: 16,
        }}
        showsVerticalScrollIndicator={false}
      >
        <ProfileHeader profile={displayProfile} />

        <View className="mt-1 flex-row gap-3">
          <MetricCard label="Chiều cao" value={display.height} />
          <MetricCard icon="activity" label="Cân nặng" value={display.weight} />
        </View>

        <View className="mt-3">
          <DateCard value={display.dateOfBirth} />
        </View>

        <View className="mt-5">
          <SectionHeader title="Hồ sơ sức khỏe" action="Xem tất cả" />
          <HealthInfoCard profile={displayProfile} />
        </View>

        <View className="mt-4 gap-3">
          <PrimaryButton label="Chỉnh sửa hồ sơ" onPress={openEditProfile} />

          <OutlineButton
            icon="bar-chart-2"
            label="Xem dashboard sức khỏe"
            onPress={openDashboard}
          />

          <OutlineButton
            icon="award"
            label="Nâng cấp Premium"
            onPress={openSubscription}
          />
        </View>
      </ScrollView>
    </View>
  );
}
