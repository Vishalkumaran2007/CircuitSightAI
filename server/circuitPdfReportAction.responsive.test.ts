import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("CircuitPdfReportAction responsive contract", () => {
  it("defines the desktop export action layout and hover affordance", () => {
    expect(stylesheet).toContain(".report-actions { margin-top: 18px;");
    expect(stylesheet).toContain(".report-actions button { border: 2px solid var(--acid);");
    expect(stylesheet).toContain(".report-actions button span { flex: 1; }");
  });

  it("defines the mobile export action wrapping behavior", () => {
    expect(stylesheet).toContain("@media (max-width: 760px) { .report-actions");
    expect(stylesheet).toContain(".report-actions button { align-items: flex-start; flex-wrap: wrap; }");
    expect(stylesheet).toContain(".report-actions button small { width: 100%; padding-left: 23px; }");
  });
});
