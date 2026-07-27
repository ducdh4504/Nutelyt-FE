import { featureFlags } from "@/config/feature-flags";

type LogPayload = readonly unknown[];

function isEnabled() {
  return featureFlags.enableLogger;
}

export const logger = {
  debug(message: string, ...payload: LogPayload) {
    if (isEnabled()) {
      console.debug(message, ...payload);
    }
  },
  info(message: string, ...payload: LogPayload) {
    if (isEnabled()) {
      console.info(message, ...payload);
    }
  },
  warn(message: string, ...payload: LogPayload) {
    if (isEnabled()) {
      console.warn(message, ...payload);
    }
  },
  error(message: string, ...payload: LogPayload) {
    if (isEnabled()) {
      console.error(message, ...payload);
    }
  },
} as const;
