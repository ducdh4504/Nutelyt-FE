import { useMemo, useState } from 'react';
import { Text, View } from 'react-native';

import { ChatComposer, ChatHeader, ChatMessageList, ChatWelcome, ChatWorkspaceShell, ConversationSidebar } from '@/features/ai-chat/chat-ui';
import { useChatWorkspace } from '@/features/ai-chat/hooks/use-chat-workspace';
import { getQuickPrompts } from '@/features/ai-chat/quick-prompts';
import type { ChatProfileContext } from '@/features/ai-chat/ai-chat.types';
import { resolveMealPeriod, useHomeLocalTime } from '@/features/home';
import { useMainProfile } from '@/features/profile';

const knownDiets = new Set(['standard', 'vegetarian', 'vegan', 'low-carb', 'high-protein', 'other']);

export function ChatAIScreen() {
  const { profile } = useMainProfile();
  const now = useHomeLocalTime();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [detailNotice, setDetailNotice] = useState<string | null>(null);
  const profileContext = useMemo<ChatProfileContext>(() => ({
    allergies: profile.allergies ?? profile.allergyText.split(',').map((item) => item.trim()).filter(Boolean),
    currentWeight: (profile.currentWeight ?? profile.weight) || null,
    diet: profile.diet && knownDiets.has(profile.diet) ? profile.diet as ChatProfileContext['diet'] : null,
    displayName: profile.fullName.trim() && profile.fullName !== 'Người dùng Nutelyt' ? profile.fullName.trim() : 'bạn',
    goalSpeed: profile.goalSpeed ?? null,
    targetWeight: profile.targetWeight ?? null,
  }), [profile]);
  const workspace = useChatWorkspace(profileContext);
  const prompts = getQuickPrompts(resolveMealPeriod(now));
  const isWelcome = workspace.messages.length === 0 && !workspace.isSending && !workspace.failedRequest;

  return (
    <ChatWorkspaceShell>
      <ChatHeader onNewConversation={() => { void workspace.createConversation(); }} onOpenSidebar={() => setIsSidebarOpen(true)} />
      <View className="flex-1">
        {workspace.conversationQuery.isPending ? (
          <View className="flex-1 items-center justify-center gap-3"><Text className="text-base text-muted">Đang mở cuộc trò chuyện...</Text></View>
        ) : isWelcome ? (
          <ChatWelcome displayName={profileContext.displayName} onPrompt={(prompt) => { void workspace.submit(prompt); }} prompts={prompts} />
        ) : (
          <ChatMessageList
            actionError={workspace.actionError}
            failed={Boolean(workspace.failedRequest)}
            isSending={workspace.isSending}
            messages={workspace.messages}
            onLogActivity={workspace.logActivity}
            onLogMeal={workspace.logMeal}
            onRetry={() => { void workspace.retry(); }}
            onSave={workspace.saveRecipe}
            onViewRecipe={() => setDetailNotice('Chi tiết công thức sẽ được bổ sung khi có thiết kế và tuyến đường được phê duyệt.')}
          />
        )}
        {detailNotice ? <Text accessibilityLiveRegion="polite" className="px-5 pb-2 text-center text-xs text-muted">{detailNotice}</Text> : null}
      </View>
      <ChatComposer disabled={workspace.isSending} onSend={workspace.submit} />
      <ConversationSidebar
        activeId={workspace.activeConversationId}
        conversations={workspace.listQuery.data ?? []}
        onClose={() => setIsSidebarOpen(false)}
        onCreate={() => { void workspace.createConversation(); setIsSidebarOpen(false); }}
        onSelect={workspace.selectConversation}
        visible={isSidebarOpen}
      />
    </ChatWorkspaceShell>
  );
}
