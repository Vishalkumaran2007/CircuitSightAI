import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import TestRenderer, { act } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import ThemeToggle from "../client/src/components/ThemeToggle";
import { ThemeProvider } from "../client/src/contexts/ThemeContext";

describe("CircuitSight theme toggle", () => {
  it("renders the blue-theme destination from the default yellow mode", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider defaultTheme="yellow" switchable>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(markup).toContain("Switch to blue signal theme");
    expect(markup).toContain(">BLUE</span>");
    expect(markup).toContain("lucide-moon");
  });

  it("renders the yellow-theme destination from blue mode", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider defaultTheme="blue" switchable>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(markup).toContain("Switch to yellow signal theme");
    expect(markup).toContain(">YELLOW</span>");
    expect(markup).toContain("lucide-sun");
  });

  it("toggles the palette label and preserves keyboard reachability", () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ThemeProvider defaultTheme="yellow" switchable>
          <ThemeToggle />
        </ThemeProvider>,
      );
    });
    const button = renderer!.root.findByType("button");
    expect(button.props.type).toBe("button");
    expect(button.props["aria-label"]).toBe("Switch to blue signal theme");
    expect(button.props.tabIndex ?? 0).toBeGreaterThanOrEqual(0);
    let prevented = false;
    act(() => button.props.onKeyDown({ key: "Enter", preventDefault: () => { prevented = true; } }));
    expect(prevented).toBe(true);
    expect(renderer!.root.findByType("button").props["aria-label"]).toBe("Switch to yellow signal theme");
    act(() => button.props.onKeyDown({ key: " ", preventDefault: () => undefined }));
    expect(renderer!.root.findByType("button").props["aria-label"]).toBe("Switch to blue signal theme");
    renderer!.unmount();
  });

  it("keeps the palette and responsive toggle contract in the stylesheet", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain(":root.blue-theme");
    expect(css).toContain("--acid: #42A5FF");
    expect(css).toContain("--acid-rgb: 66,165,255");
    expect(css).toContain(".theme-toggle");
    expect(css).toContain("@media (max-width: 860px) { .theme-toggle");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("button:focus-visible");
    expect(css).toContain('--display-font: "Space Grotesk", sans-serif');
    expect(css).not.toContain("Bebas Neue");
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(html).not.toContain("Bebas+Neue");
  });
});
