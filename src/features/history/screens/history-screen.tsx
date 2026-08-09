import { useMemo, useState } from 'react';
import { SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { defaultHistoryFilters, filterHistoryEntries, groupHistoryEntries, hasActiveHistoryFilters } from '@/features/history/history-filtering';
import { HistoryEmptyState, HistoryEntryCard, HistoryFilterSheet, HistoryLoading, HistoryToolbar } from '@/features/history/history-ui';
import { useHistory } from '@/features/history/hooks/use-history';
import { useHistoryTime } from '@/features/history/hooks/use-history-time';
import type { HistoryFilters } from '@/features/history/history.types';

export function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const now = useHistoryTime();
  const historyQuery = useHistory(now);
  const [filters, setFilters] = useState<HistoryFilters>(defaultHistoryFilters);
  const [draftFilters, setDraftFilters] = useState<HistoryFilters>(defaultHistoryFilters);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const snapshot = historyQuery.data;
  const filteredEntries = useMemo(
    () => snapshot ? filterHistoryEntries(snapshot.entries, filters, now) : [],
    [filters, now, snapshot],
  );
  const sections = useMemo(() => groupHistoryEntries(filteredEntries, now), [filteredEntries, now]);
  const resetFilters = () => {
    setFilters(defaultHistoryFilters);
    setDraftFilters(defaultHistoryFilters);
  };
  const openFilters = () => {
    setDraftFilters(filters);
    setIsFilterOpen(true);
  };

  if (historyQuery.isPending) return <HistoryLoading />;
  if (!snapshot) return <HistoryEmptyState error onRetry={() => historyQuery.refetch()} />;
  if (snapshot.entries.length === 0) return <HistoryEmptyState />;

  return (
    <View className="flex-1 bg-background" style={styles.screen}>
      <SectionList
        ListEmptyComponent={<HistoryEmptyState filtered onReset={resetFilters} />}
        ListHeaderComponent={(
          <View className="gap-6" style={{ paddingTop: Math.max(insets.top + 18, 28) }}>
            <HistoryToolbar
              filters={filters}
              onCategoryChange={(category) => setFilters((current) => ({ ...current, category }))}
              onFilterPress={openFilters}
              onQueryChange={(query) => setFilters((current) => ({ ...current, query }))}
            />
            {hasActiveHistoryFilters(filters) ? <Text accessibilityLiveRegion="polite" className="-mb-1 text-sm font-medium text-muted">Đang hiển thị kết quả đã lọc</Text> : null}
          </View>
        )}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(insets.bottom + 110, 132), paddingHorizontal: 20 }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <HistoryEntryCard entry={item} />}
        renderSectionHeader={({ section }) => <Text className="mb-3 mt-6 text-sm font-semibold text-muted">{section.title}</Text>}
        sections={sections}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
      <HistoryFilterSheet
        draft={draftFilters}
        onApply={() => { setFilters(draftFilters); setIsFilterOpen(false); }}
        onClose={() => setIsFilterOpen(false)}
        onDraftChange={setDraftFilters}
        onReset={() => { setDraftFilters(defaultHistoryFilters); setFilters(defaultHistoryFilters); setIsFilterOpen(false); }}
        visible={isFilterOpen}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
