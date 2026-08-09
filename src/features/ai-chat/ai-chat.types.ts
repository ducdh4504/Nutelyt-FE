import type { ImageSource } from 'expo-image';

export type ConversationRole = 'user' | 'assistant';
export type ConversationMessageStatus = 'sent' | 'failed';

export type TextContent = {
  kind: 'text';
  text: string;
};

export type RecipeRecommendationContent = {
  calories: number;
  description: string;
  image: number | ImageSource;
  kind: 'recipe-recommendation';
  personalizationNote: string;
  proteinGrams: number;
  recommendationId: string;
  tags: string[];
  title: string;
  warning: string;
};

export type FoodAnalysisContent = {
  calories: number;
  cautions: string[];
  image: number | ImageSource;
  kind: 'food-analysis';
  portion: string;
  proteinGrams: number;
  recommendationId: string;
  strengths: string[];
  suitability: 'suitable-with-notes' | 'less-suitable';
  title: string;
};

export type ActivitySuggestionContent = {
  caloriesEstimate: number;
  durationMinutes: number;
  id: string;
  instructions: string;
  intensity: 'light';
  kind: 'activity-suggestion';
  title: string;
};

export type ChatMessageContent = TextContent | RecipeRecommendationContent | FoodAnalysisContent | ActivitySuggestionContent;

export type ChatMessage = {
  content: ChatMessageContent;
  conversationId: string;
  createdAt: string;
  id: string;
  role: ConversationRole;
  status: ConversationMessageStatus;
};

export type Conversation = {
  createdAt: string;
  id: string;
  messages: ChatMessage[];
  title: string;
  updatedAt: string;
};

export type ConversationListItem = Omit<Conversation, 'messages'>;

export type ChatProfileContext = {
  allergies: string[];
  currentWeight: string | null;
  diet: 'standard' | 'vegetarian' | 'vegan' | 'low-carb' | 'high-protein' | 'other' | null;
  displayName: string;
  goalSpeed: 'mild' | 'balanced' | 'aggressive' | null;
  targetWeight: string | null;
};

export type SendMessageInput = {
  conversationId: string;
  messageId: string;
  now: Date;
  profile: ChatProfileContext;
  text: string;
};

export type SendMessageResult = {
  conversation: Conversation;
};
