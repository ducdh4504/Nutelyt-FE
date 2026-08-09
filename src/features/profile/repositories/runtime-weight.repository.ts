import type { WeightMeasurement } from '@/features/profile/profile.types';

const measurements = new Map<string, WeightMeasurement>();
let sequence = 0;

export const runtimeWeightRepository = {
  create(weightKg: number, measuredAt: Date): WeightMeasurement {
    sequence += 1;
    const measurement = { id: `weight-${measuredAt.getTime()}-${sequence}`, measuredAt: measuredAt.toISOString(), weightKg };
    measurements.set(measurement.id, measurement);
    return measurement;
  },
  list(): WeightMeasurement[] {
    return [...measurements.values()].sort((left, right) => right.measuredAt.localeCompare(left.measuredAt));
  },
} as const;
