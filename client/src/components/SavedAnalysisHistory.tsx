import { analysisDateRangeLabels, AnalysisDateRange, filterSavedAnalyses, getAnalysisDiscoveryStatus } from "@/lib/analysisHistory";
import { RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import React, { useMemo, useState } from "react";

export type SavedAnalysisHistoryThread = {
  id: number;
  title: string;
  updatedAt: Date | string | number;
};

type SavedAnalysisHistoryProps = {
  threads: SavedAnalysisHistoryThread[];
  isLoading: boolean;
  activeThreadId: number | null;
  onOpenThread: (threadId: number) => void;
  initialQuery?: string;
  initialRange?: AnalysisDateRange;
};

export function SavedAnalysisHistory({
  threads,
  isLoading,
  activeThreadId,
  onOpenThread,
  initialQuery = "",
  initialRange = "all",
}: SavedAnalysisHistoryProps) {
  const [historyQuery, setHistoryQuery] = useState(initialQuery);
  const [historyRange, setHistoryRange] = useState<AnalysisDateRange>(initialRange);
  const filteredThreads = useMemo(() => filterSavedAnalyses(threads, historyQuery, historyRange), [historyQuery, historyRange, threads]);
  const hasHistoryFilters = Boolean(historyQuery.trim()) || historyRange !== "all";
  const historyStatus = useMemo(() => getAnalysisDiscoveryStatus(threads.length, filteredThreads.length, hasHistoryFilters), [filteredThreads.length, hasHistoryFilters, threads.length]);

  const clearHistoryFilters = () => {
    setHistoryQuery("");
    setHistoryRange("all");
  };

  return (
    <>
      <div className="history-controls" aria-label="Search saved analyses">
        <label className="history-search"><Search size={14} aria-hidden="true" /><span className="sr-only">Search saved analyses</span><input type="search" value={historyQuery} onChange={event => setHistoryQuery(event.target.value)} placeholder="SEARCH SAVED WORK" aria-label="Search saved analyses by title" /></label>
        <div className="history-filter-row"><label className="history-filter"><SlidersHorizontal size={13} aria-hidden="true" /><span className="sr-only">Filter saved analyses by date</span><select value={historyRange} onChange={event => setHistoryRange(event.target.value as AnalysisDateRange)} aria-label="Filter saved analyses by date">{(Object.keys(analysisDateRangeLabels) as AnalysisDateRange[]).map(range => <option key={range} value={range}>{analysisDateRangeLabels[range]}</option>)}</select></label>{hasHistoryFilters && <button className="history-filter-reset" type="button" onClick={clearHistoryFilters} aria-label="Clear saved-analysis search and filter"><RotateCcw size={13} /> RESET</button>}</div>
        {!isLoading && historyStatus.kind === "results" && <span className="history-match-count mono">{historyStatus.label}</span>}
      </div>
      <div className="thread-list">{isLoading ? <span className="thread-empty mono">LOADING YOUR HISTORY…</span> : historyStatus.kind === "results" ? filteredThreads.map(thread => <button key={thread.id} className={`thread ${thread.id === activeThreadId ? "active" : ""}`} onClick={() => onOpenThread(thread.id)}><span className="thread-status" /> {thread.title}<small>{new Date(thread.updatedAt).toLocaleDateString()}</small></button>) : historyStatus.kind === "no-match" ? <div className="thread-empty history-empty"><strong className="mono">{historyStatus.label}</strong><span>{historyStatus.detail}</span><button type="button" onClick={clearHistoryFilters}>CLEAR CONTROLS <RotateCcw size={12} /></button></div> : <span className="thread-empty mono">{historyStatus.label}</span>}</div>
    </>
  );
}
