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
      <ThemeProvider defaultTheme="dark" switchable>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(markup).toContain("Switch to light white-black theme");
    expect(markup).toContain(">LIGHT</span>");
    expect(markup).toContain("lucide-sun");
  });

  it("renders the yellow-theme destination from blue mode", () => {
    const markup = renderToStaticMarkup(
      <ThemeProvider defaultTheme="light" switchable>
        <ThemeToggle />
      </ThemeProvider>,
    );
    expect(markup).toContain("Switch to dark black-lavender theme");
    expect(markup).toContain(">DARK</span>");
    expect(markup).toContain("lucide-moon");
  });

  it("toggles the palette label and preserves keyboard reachability", () => {
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ThemeProvider defaultTheme="dark" switchable>
          <ThemeToggle />
        </ThemeProvider>,
      );
    });
    const button = renderer!.root.findByType("button");
    expect(button.props.type).toBe("button");
    expect(button.props["aria-label"]).toBe("Switch to light white-black theme");
    expect(button.props.tabIndex ?? 0).toBeGreaterThanOrEqual(0);
    let prevented = false;
    act(() => button.props.onKeyDown({ key: "Enter", preventDefault: () => { prevented = true; } }));
    expect(prevented).toBe(true);
    expect(renderer!.root.findByType("button").props["aria-label"]).toBe("Switch to dark black-lavender theme");
    act(() => button.props.onKeyDown({ key: " ", preventDefault: () => undefined }));
    expect(renderer!.root.findByType("button").props["aria-label"]).toBe("Switch to light white-black theme");
    renderer!.unmount();
  });

  it("keeps the palette and responsive toggle contract in the stylesheet", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain(":root.light-theme");
    expect(css).toContain("--acid: #C4B5FD");
    expect(css).toContain("--background: #FFFFFF");
    expect(css).toContain("--foreground: #000000");
    expect(css).toContain("--surface-0: #000000");
    expect(css).toContain("--surface-1: #FFFFFF");
    expect(css).toContain(".light-theme .button-acid");
    expect(css).toContain(".light-theme .hero-stamp");
    expect(css).toContain(".section-dark { background: var(--surface-0)");
    expect(css).toContain("background: var(--surface-1)");
    for (const selector of [".site-shell", ".auth-page", ".workspace-page", ".dashboard-page", ".learning-page", ".diagnostic-page"]) {
      expect(css).toContain(selector);
    }
    expect(css).toContain("--acid-rgb: 196,181,253");
    expect(css).toContain(".theme-toggle");
    expect(css).toContain("@media (max-width: 860px) { .theme-toggle");
    expect(css).toContain("prefers-reduced-motion: reduce");
    expect(css).toContain("button:focus-visible");
    expect(css).toContain('--display-font: "Space Grotesk", sans-serif');
    expect(css).not.toContain("Bebas Neue");
    const html = readFileSync(resolve(process.cwd(), "client/index.html"), "utf8");
    expect(html).not.toContain("Bebas+Neue");
    const home = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(home).toContain('classList.contains("light-theme")');
    expect(home).toContain('accent: "#C4B5FD"');
    expect(home).not.toContain("background:#09090b");
    for (const route of ["Auth", "Workspace", "Dashboard", "Learning"]) {
      const routeSource = readFileSync(resolve(process.cwd(), `client/src/pages/${route}.tsx`), "utf8");
      expect(routeSource).not.toMatch(/#09090B|#09090b|#111113|#17171a|#DFE104/);
    }
  });
});
