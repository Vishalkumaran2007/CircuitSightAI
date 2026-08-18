import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ImagePreviewDialog } from "../client/src/components/ImagePreviewDialog";

describe("ImagePreviewDialog", () => {
  it("renders an accessible preview when opened", () => {
    const markup = renderToStaticMarkup(<ImagePreviewDialog src="/sample-circuit.png" alt="Sample circuit" open onClose={() => undefined} />);
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-label="Preview of Sample circuit"');
    expect(markup).toContain('alt="Sample circuit"');
    expect(markup).toContain("ESC TO CLOSE");
  });

  it("renders nothing when closed or when no image source exists", () => {
    expect(renderToStaticMarkup(<ImagePreviewDialog src="/sample-circuit.png" alt="Sample circuit" open={false} onClose={() => undefined} />)).toBe("");
    expect(renderToStaticMarkup(<ImagePreviewDialog src={null} alt="Sample circuit" open onClose={() => undefined} />)).toBe("");
  });
});
