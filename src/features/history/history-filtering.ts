import type { HistoryEntry, HistoryFilters, HistorySection, HistoryTimeRange } from '@/features/history/history.types';

function atLocalStartOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function dateKey(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function normalize(value: string) {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLocaleLowerCase('vi-VN').trim();
}

function rangeStart(range: HistoryTimeRange, now: Date) {
  const start = atLocalStartOfDay(now);
  if (range === 'today') return start;
  start.setDate(start.getDate() - (range === 'last-7-days' ? 6 : 29));
  return start;
}

export const defaultHistoryFilters: HistoryFilters = {
  category: 'all',
  query: '',
  range: 'last-30-days',
};

export function filterHistoryEntries(entries: HistoryEntry[], filters: HistoryFilters, now: Date) {
  const normalizedQuery = normalize(filters.query);
  const start = rangeStart(filters.range, now);
  const end = new Date(atLocalStartOfDay(now));
  end.setDate(end.getDate() + 1);

  return entries.filter((entry) => {
    const occurredAt = new Date(entry.occurredAt);
    const inRange = occurredAt >= start && occurredAt < end;
    const hasCategory = filters.category === 'all' || entry.kind === filters.category;
    const hasQuery = !normalizedQuery || normalize(entry.title).includes(normalizedQuery);
    return inRange && hasCategory && hasQuery;
  });
}

export function groupHistoryEntries(entries: HistoryEntry[], now: Date): HistorySection[] {
  const today = atLocalStartOfDay(now);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const groups = new Map<string, HistoryEntry[]>();

  entries.forEach((entry) => {
    const key = dateKey(new Date(entry.occurredAt));
    groups.set(key, [...(groups.get(key) ?? []), entry]);
  });

  return [...groups.entries()]
    .sort(([left], [right]) => right.localeCompare(left))
    .map(([key, data]) => ({
      data: data.sort((left, right) => right.occurredAt.localeCompare(left.occurredAt)),
      title: key === dateKey(today) ? 'Hôm nay' : key === dateKey(yesterday) ? 'Hôm qua' : new Intl.DateTimeFormat('vi-VN', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${key}T12:00:00`)),
    }));
}

export function hasActiveHistoryFilters(filters: HistoryFilters) {
  return filters.category !== 'all' || filters.range !== 'last-30-days' || Boolean(filters.query.trim());
}

export function formatHistoryTime(value: string) {
  return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}
