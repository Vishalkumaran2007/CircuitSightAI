import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("Learning Loop accessibility and responsive contract", () => {
  it("defines visible keyboard focus for links and buttons", () => {
    expect(stylesheet).toContain(".learning-page a:focus-visible, .learning-page button:focus-visible");
    expect(stylesheet).toContain("outline: 2px solid var(--acid)");
  });

  it("defines mobile Learning Loop layout rules", () => {
    expect(stylesheet).toContain("@media (max-width: 820px) { .learning-topbar");
    expect(stylesheet).toContain(".learning-hero { min-height: auto; padding: 58px 22px 42px; grid-template-columns: 1fr;");
    expect(stylesheet).toContain("@media (max-width: 480px) { .learning-nav a:nth-child(2) { display: none; }");
  });
});
