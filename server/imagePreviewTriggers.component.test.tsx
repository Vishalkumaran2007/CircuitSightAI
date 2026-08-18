import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ImagePreviewButton } from "../client/src/components/ImagePreviewButton";
import { ImagePreviewDialog } from "../client/src/components/ImagePreviewDialog";

describe("Circuit image preview entry points", () => {
  it("renders the public sample preview trigger", () => {
    const markup = renderToStaticMarkup(<ImagePreviewButton className="image-preview-trigger" label="PREVIEW IMAGE" onClick={() => undefined} />);
    expect(markup).toContain("image-preview-trigger");
    expect(markup).toContain("PREVIEW IMAGE");
  });

  it("renders the workspace uploaded-image preview trigger", () => {
    const markup = renderToStaticMarkup(<ImagePreviewButton className="composer-preview-button" label="PREVIEW" onClick={() => undefined} />);
    expect(markup).toContain("composer-preview-button");
    expect(markup).toContain("PREVIEW");
  });

  it("renders the opened preview surface used by both entry points", () => {
    const markup = renderToStaticMarkup(<ImagePreviewDialog src="blob:local-circuit" alt="Uploaded circuit" open onClose={() => undefined} />);
    expect(markup).toContain('role="dialog"');
    expect(markup).toContain('aria-label="Preview of Uploaded circuit"');
    expect(markup).toContain("CLOSE");
  });
});
