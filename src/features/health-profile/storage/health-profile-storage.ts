import type { HealthProfileSummary } from '../health-profile.types';

/**
 * Feature-owned storage boundary. A durable native storage dependency is not
 * installed in this project, so this intentionally supports the current app
 * runtime only. UI code never reaches into a platform storage API directly.
 */
let savedProfile: HealthProfileSummary | null = null;

export const healthProfileStorage = {
  clear() {
    savedProfile = null;
  },
  read() {
    return savedProfile;
  },
  save(profile: HealthProfileSummary) {
    savedProfile = profile;
  },
};
