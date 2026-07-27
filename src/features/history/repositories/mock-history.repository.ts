import { historySections } from "@/features/history/data/mock-history";
import { historySectionsSchema } from "@/features/history/schemas/history.schema";
import { createMockAdapter } from "@/services/http/mock-adapter";

const history = historySectionsSchema.parse(historySections);

export const historyMockRepository = {
  getHistory: () => history,
} as const;

export const historyMockAdapter = createMockAdapter(
  historyMockRepository.getHistory,
);
