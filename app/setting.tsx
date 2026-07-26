import { Redirect, type Href } from "expo-router";

import { routes } from "@/src/config/routes";

export default function LegacySettingRedirect() {
  return <Redirect href={routes.profileSettings as Href} />;
}
