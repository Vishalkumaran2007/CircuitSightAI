import { describe, expect, it } from "vitest";
import { filterSavedAnalyses, getAnalysisDiscoveryStatus } from "../client/src/lib/analysisHistory";

const now = new Date(2026, 7, 18, 12, 0, 0);
const analyses = [
  { id: 1, title: "LED polarity trace", updatedAt: new Date(2026, 7, 18, 8, 0, 0) },
  { id: 2, title: "Breadboard ground path", updatedAt: new Date(2026, 7, 14, 9, 0, 0) },
  { id: 3, title: "Legacy resistor check", updatedAt: new Date(2026, 6, 10, 9, 0, 0) },
];

describe("filterSavedAnalyses", () => {
  it("matches real analysis titles without case sensitivity", () => {
    expect(filterSavedAnalyses(analyses, "GROUND", "all", now).map(analysis => analysis.id)).toEqual([2]);
  });

  it("filters saved analyses by the selected recency window", () => {
    expect(filterSavedAnalyses(analyses, "", "today", now).map(analysis => analysis.id)).toEqual([1]);
    expect(filterSavedAnalyses(analyses, "", "week", now).map(analysis => analysis.id)).toEqual([1, 2]);
    expect(filterSavedAnalyses(analyses, "", "month", now).map(analysis => analysis.id)).toEqual([1, 2]);
  });

  it("returns an honest empty result when no saved analysis matches", () => {
    expect(filterSavedAnalyses(analyses, "oscilloscope", "all", now)).toEqual([]);
  });

  it("returns all saved analyses when controls are reset", () => {
    const filtered = filterSavedAnalyses(analyses, "ground", "week", now);
    expect(filtered.map(analysis => analysis.id)).toEqual([2]);
    expect(filterSavedAnalyses(analyses, "", "all", now).map(analysis => analysis.id)).toEqual([1, 2, 3]);
  });

  it("reports saved, filtered, and zero-result states honestly", () => {
    expect(getAnalysisDiscoveryStatus(3, 3, false)).toEqual({ kind: "results", label: "3 SAVED" });
    expect(getAnalysisDiscoveryStatus(3, 1, true)).toEqual({ kind: "results", label: "1 / 3 MATCHES" });
    expect(getAnalysisDiscoveryStatus(3, 0, true)).toEqual({ kind: "no-match", label: "NO SIGNALS MATCH", detail: "Try another title or clear the date filter." });
    expect(getAnalysisDiscoveryStatus(0, 0, false)).toEqual({ kind: "empty-history", label: "NO SAVED ANALYSES YET" });
  });
});
