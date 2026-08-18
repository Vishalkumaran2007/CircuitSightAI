import { renderToStaticMarkup } from "react-dom/server";
import React from "react";
import { describe, expect, it } from "vitest";
import { SavedAnalysisHistory } from "../client/src/components/SavedAnalysisHistory";

const threads = [
  { id: 30001, title: "Check the circuit", updatedAt: new Date(2026, 7, 18, 12, 35, 24) },
];

describe("SavedAnalysisHistory", () => {
  it("renders search, date filtering, live saved count, and the user’s persisted analysis title", () => {
    const markup = renderToStaticMarkup(<SavedAnalysisHistory threads={threads} isLoading={false} activeThreadId={null} onOpenThread={() => undefined} />);

    expect(markup).toContain("SEARCH SAVED WORK");
    expect(markup).toContain("Filter saved analyses by date");
    expect(markup).toContain("1 SAVED");
    expect(markup).toContain("Check the circuit");
  });

  it("renders the reset action and honest zero-results message for an unmatched query", () => {
    const markup = renderToStaticMarkup(<SavedAnalysisHistory threads={threads} isLoading={false} activeThreadId={null} onOpenThread={() => undefined} initialQuery="oscilloscope" />);

    expect(markup).toContain("RESET");
    expect(markup).toContain("NO SIGNALS MATCH");
    expect(markup).toContain("Try another title or clear the date filter.");
    expect(markup).toContain("CLEAR CONTROLS");
  });
});
