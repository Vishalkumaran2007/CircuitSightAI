import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("ImagePreviewDialog responsive contract", () => {
  it("defines a full-screen overlay and constrained desktop image canvas", () => {
    expect(stylesheet).toContain(".image-preview-overlay");
    expect(stylesheet).toContain(".image-preview-canvas img { display: block; max-width: 100%; max-height: 68vh;");
  });

  it("defines mobile padding, dialog height, and mobile image constraints", () => {
    expect(stylesheet).toContain("@media (max-width: 760px)");
    expect(stylesheet).toContain(".image-preview-dialog { max-height: 92vh;");
    expect(stylesheet).toContain(".image-preview-canvas img { max-height: 72vh; }");
  });
});
