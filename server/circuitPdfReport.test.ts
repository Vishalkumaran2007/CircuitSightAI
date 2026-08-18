import { describe, expect, it } from "vitest";
import { buildCircuitReportContent, createCircuitPdfReport, getPdfImageFormat } from "../client/src/lib/circuitPdfReport";

const analysis = {
  summary: "The LED path is visible but the return route is uncertain.",
  diagnosis: "Inspect polarity and the ground rail before energizing.",
  confidence: 82,
  findings: [{ label: "WIRE PATH", status: "uncertain", confidence: 72, detail: "The lower return wire is partly obscured." }],
  recommendedSteps: ["Retake a top-down photograph.", "Check continuity with power disconnected."],
  uncertaintyNotice: "Some connections cannot be verified from this image.",
};

describe("circuit PDF report", () => {
  it("preserves the analysis fields and original-image inclusion status", () => {
    const content = buildCircuitReportContent({ analysis, title: "LED path scan", imageDataUrl: "data:image/png;base64,AAAA", imageMimeType: "image/png" });
    expect(content).toContain("LED path scan");
    expect(content).toContain("WIRE PATH / UNCERTAIN / 72% / The lower return wire is partly obscured.");
    expect(content).toContain("CHECK 1 / Retake a top-down photograph.");
    expect(content).toContain("ORIGINAL CIRCUIT IMAGE / EMBEDDED");
    expect(getPdfImageFormat("image/png")).toBe("PNG");
    expect(getPdfImageFormat("image/jpeg")).toBe("JPEG");
  });

  it("creates a valid PDF document for text-only analyses", () => {
    const pdf = createCircuitPdfReport({ analysis, title: "Text-only scan", imageDataUrl: null });
    const output = pdf.output("arraybuffer");
    expect(output.byteLength).toBeGreaterThan(500);
    expect(new TextDecoder().decode(output.slice(0, 5))).toBe("%PDF-");
  });
});
