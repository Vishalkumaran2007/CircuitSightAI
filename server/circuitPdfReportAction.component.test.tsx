import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { CircuitPdfReportAction } from "../client/src/components/CircuitPdfReportAction";

const analysis = {
  summary: "Visible LED path requires inspection.",
  diagnosis: "The return route is uncertain.",
  confidence: 80,
  findings: [],
  recommendedSteps: ["Inspect the ground rail."],
  uncertaintyNotice: "The image does not prove continuity.",
};

describe("CircuitPdfReportAction", () => {
  it("does not render before an analysis is complete", () => {
    expect(renderToStaticMarkup(<CircuitPdfReportAction report={null} />)).toBe("");
  });

  it("renders the PDF action and embedded-image status after analysis", () => {
    const markup = renderToStaticMarkup(<CircuitPdfReportAction report={{ analysis, title: "LED scan", imageDataUrl: "data:image/png;base64,AAAA", imageMimeType: "image/png" }} />);
    expect(markup).toContain("DOWNLOAD PDF REPORT");
    expect(markup).toContain("ORIGINAL IMAGE EMBEDDED");
    expect(markup).toContain("PDF EXPORT / FINDINGS + CONFIDENCE + UNCERTAINTY");
  });
});
