export type AnalysisDateRange = "all" | "today" | "week" | "month";

export type SavedAnalysisRecord = {
  id: number;
  title: string;
  updatedAt: Date | string | number;
};

export const analysisDateRangeLabels: Record<AnalysisDateRange, string> = {
  all: "ALL TIME",
  today: "TODAY",
  week: "LAST 7 DAYS",
  month: "LAST 30 DAYS",
};

export type AnalysisDiscoveryStatus = {
  kind: "empty-history" | "results" | "no-match";
  label: string;
  detail?: string;
};

export function getAnalysisDiscoveryStatus(total: number, visible: number, hasFilters: boolean): AnalysisDiscoveryStatus {
  if (total === 0) return { kind: "empty-history", label: "NO SAVED ANALYSES YET" };
  if (visible === 0) return { kind: "no-match", label: "NO SIGNALS MATCH", detail: "Try another title or clear the date filter." };
  return { kind: "results", label: hasFilters ? `${visible} / ${total} MATCHES` : `${total} SAVED` };
}

function startOfDay(date: Date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function getCutoff(range: Exclude<AnalysisDateRange, "all">, now: Date) {
  const cutoff = startOfDay(now);
  if (range === "today") return cutoff;
  cutoff.setDate(cutoff.getDate() - (range === "week" ? 6 : 29));
  return cutoff;
}

export function filterSavedAnalyses<T extends SavedAnalysisRecord>(
  analyses: T[],
  query: string,
  range: AnalysisDateRange,
  now = new Date(),
): T[] {
  const normalizedQuery = query.trim().toLocaleLowerCase();
  const cutoff = range === "all" ? null : getCutoff(range, now);

  return analyses.filter(analysis => {
    const matchesQuery = !normalizedQuery || analysis.title.toLocaleLowerCase().includes(normalizedQuery);
    if (!matchesQuery || !cutoff) return matchesQuery;

    const updatedAt = new Date(analysis.updatedAt);
    return !Number.isNaN(updatedAt.valueOf()) && updatedAt >= cutoff;
  });
}
