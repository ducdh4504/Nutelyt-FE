import { z } from "zod";

function booleanEnvironmentValue(defaultValue: boolean) {
  return z
    .enum(["true", "false"])
    .optional()
    .transform((value) => (value === undefined ? defaultValue : value === "true"));
}

const environmentSchema = z.object({
  apiBaseUrl: z.url().default("http://localhost:3000"),
  environment: z
    .enum(["development", "staging", "production", "test"])
    .default("development"),
  enableLogger: booleanEnvironmentValue(true),
  enableDevtools: booleanEnvironmentValue(false),
  enableMockApi: booleanEnvironmentValue(true),
});

const rawEnvironment = {
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  environment: process.env.EXPO_PUBLIC_ENV,
  enableLogger: process.env.EXPO_PUBLIC_ENABLE_LOGGER,
  enableDevtools: process.env.EXPO_PUBLIC_ENABLE_DEVTOOLS,
  enableMockApi: process.env.EXPO_PUBLIC_ENABLE_MOCK_API,
};

const parsedEnvironment = environmentSchema.safeParse(rawEnvironment);

if (!parsedEnvironment.success) {
  throw new Error(
    `Invalid public environment configuration: ${z.prettifyError(parsedEnvironment.error)}`,
  );
}

if (
  parsedEnvironment.data.environment === "production" &&
  !rawEnvironment.apiBaseUrl
) {
  throw new Error(
    "EXPO_PUBLIC_API_BASE_URL is required when EXPO_PUBLIC_ENV is production.",
  );
}

export const env = Object.freeze(parsedEnvironment.data);
