import React from "react";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import TestRenderer, { act } from "react-test-renderer";
import { describe, expect, it } from "vitest";
import ThemeToggle from "../client/src/components/ThemeToggle";
import { ThemeProvider, useTheme } from "../client/src/contexts/ThemeContext";

function PreferenceProbe() {
  const { theme, preference, highContrast } = useTheme();
  return <span className="preference-probe" data-theme={theme} data-preference={preference} data-contrast={String(highContrast)} />;
}

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
    expect(markup).toContain("Follow operating system theme");
    expect(markup).toContain("Enable high contrast mode");
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
    const button = renderer!.root.findAllByType("button")[0];
    expect(button.props.type).toBe("button");
    expect(button.props["aria-label"]).toBe("Switch to light white-black theme");
    expect(button.props.tabIndex ?? 0).toBeGreaterThanOrEqual(0);
    let prevented = false;
    act(() => button.props.onKeyDown({ key: "Enter", preventDefault: () => { prevented = true; } }));
    expect(prevented).toBe(true);
    expect(renderer!.root.findAllByType("button")[0].props["aria-label"]).toBe("Switch to dark black-lavender theme");
    act(() => button.props.onKeyDown({ key: " ", preventDefault: () => undefined }));
    expect(renderer!.root.findAllByType("button")[0].props["aria-label"]).toBe("Switch to light white-black theme");
    const buttons = renderer!.root.findAllByType("button");
    expect(buttons).toHaveLength(3);
    act(() => buttons[1].props.onClick());
    expect(renderer!.root.findAllByType("button")[1].props["aria-pressed"]).toBe(true);
    act(() => buttons[2].props.onClick());
    expect(renderer!.root.findAllByType("button")[2].props["aria-pressed"]).toBe(true);
    renderer!.unmount();
  });

  it("renders the home-only dropdown with four options and preserves workspace controls", () => {
    let homeRenderer: TestRenderer.ReactTestRenderer;
    act(() => {
      homeRenderer = TestRenderer.create(
        <ThemeProvider defaultTheme="dark" switchable>
          <ThemeToggle homeDropdown />
        </ThemeProvider>,
      );
    });
    const homeTrigger = homeRenderer!.root.findByProps({ className: "theme-dropdown-trigger theme-toggle" });
    expect(homeRenderer!.root.findAllByProps({ className: "theme-toggle-system" })).toHaveLength(0);
    act(() => homeTrigger.props.onKeyDown({ key: "Enter", preventDefault: () => undefined }));
    const homeOptions = homeRenderer!.root.findAll(node => node.props.role === "menuitemradio" || node.props.role === "menuitemcheckbox");
    expect(homeOptions).toHaveLength(4);
    expect(homeOptions.map(option => option.findByType("span").children.join(""))).toEqual(["LIGHT", "DARK", "SYSTEM", "HIGH CONTRAST"]);
    const homeMenuButton = homeRenderer!.root.findByProps({ className: "theme-dropdown-trigger theme-toggle" });
    act(() => homeMenuButton.props.onKeyDown({ key: " ", preventDefault: () => undefined }));
    act(() => homeOptions[3].props.onClick());
    expect(homeRenderer!.root.findAllByProps({ className: "theme-dropdown-option" })).toHaveLength(0);
    homeRenderer!.unmount();

    let workspaceRenderer: TestRenderer.ReactTestRenderer;
    act(() => {
      workspaceRenderer = TestRenderer.create(
        <ThemeProvider defaultTheme="dark" switchable>
          <ThemeToggle />
        </ThemeProvider>,
      );
    });
    expect(workspaceRenderer!.root.findAllByType("button")).toHaveLength(3);
    expect(workspaceRenderer!.root.findAllByProps({ className: "theme-dropdown-trigger theme-toggle" })).toHaveLength(0);
    workspaceRenderer!.unmount();
  });

  it("keeps the palette and responsive toggle contract in the stylesheet", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain(":root.light-theme");
    expect(css).toContain("--acid: #C4B5FD");
    expect(css).toContain("--background: #FFFFFF");
    expect(css).toContain("--foreground: #000000");
    expect(css).toContain("--surface-0: #000000");
    expect(css).toContain("--surface-1: #FFFFFF");
    expect(css).toContain("--text-inverse: #000000");
    expect(css).toContain("--text-inverse: #FFFFFF");
    expect(css).toContain(".light-theme .button-acid");
    expect(css).toContain(".light-theme .new-analysis");
    expect(css).toContain(".light-theme .composer-send");
    expect(css).toContain(".light-theme .workspace-mark");
    expect(css).toContain(".account-avatar { width: 26px");
    expect(css).toContain(".light-theme .account-avatar { background: #000000; color: #FFFFFF; }");
    expect(css).toContain(".dark .workspace-sidebar, .dark .workspace-topbar");
    expect(css).toContain(".dark .workspace-nav-label");
    expect(css).toContain(".light-theme .workspace-sidebar, .light-theme .workspace-topbar");
    expect(css).toContain(".light-theme .workspace-nav-label");
    expect(css).toContain("color: #FFFFFF");
    expect(css).toContain(".light-theme .hero-stamp");
    expect(css).toContain(".section-dark { background: var(--surface-0)");
    expect(css).toContain("background: var(--surface-1)");
    for (const selector of [".site-shell", ".auth-page", ".workspace-page", ".dashboard-page", ".learning-page", ".diagnostic-page"]) {
      expect(css).toContain(selector);
    }
    expect(css).toContain("--acid-rgb: 196,181,253");
    expect(css).toContain(".theme-controls");
    expect(css).toContain(".theme-dropdown");
    expect(css).toContain(".theme-dropdown-option");
    const toggleSource = readFileSync(resolve(process.cwd(), "client/src/components/ThemeToggle.tsx"), "utf8");
    expect(toggleSource).toContain("LIGHT");
    expect(toggleSource).toContain("DARK");
    expect(toggleSource).toContain("SYSTEM");
    expect(toggleSource).toContain("HIGH CONTRAST");
    expect(toggleSource).toContain('event.key === "Escape"');
    const appSource = readFileSync(resolve(process.cwd(), "client/src/App.tsx"), "utf8");
    expect(appSource).toContain('homeDropdown={location === "/"}');
    expect(css).toContain(".theme-toggle");
    expect(css).toContain(".high-contrast");
    expect(css).toContain("color: var(--text-inverse)");
    const themeContext = readFileSync(resolve(process.cwd(), "client/src/contexts/ThemeContext.tsx"), "utf8");
    expect(themeContext).toContain('matchMedia("(prefers-color-scheme: light)")');
    expect(themeContext).toContain("circuitsight-theme-preference");
    expect(themeContext).toContain("circuitsight-high-contrast");
    expect(css).toContain("@media (max-width: 860px) { .theme-controls");
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

  it("follows system changes, persists preferences, and synchronizes DOM classes", () => {
    const classNames = new Set<string>();
    const listeners: Array<() => void> = [];
    const values = new Map<string, string>([["circuitsight-theme-preference", "system"]]);
    const media = {
      matches: true,
      addEventListener: (_event: string, listener: () => void) => listeners.push(listener),
      removeEventListener: () => undefined,
    };
    const originalWindow = globalThis.window;
    const originalDocument = globalThis.document;
    Object.defineProperty(globalThis, "window", { configurable: true, value: {
      location: { search: "" },
      matchMedia: () => media,
      localStorage: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) },
    } });
    Object.defineProperty(globalThis, "document", { configurable: true, value: { documentElement: { classList: { toggle: (name: string, enabled: boolean) => enabled ? classNames.add(name) : classNames.delete(name) } } } });

    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(
        <ThemeProvider defaultTheme="dark" switchable>
          <PreferenceProbe />
          <ThemeToggle />
        </ThemeProvider>,
      );
    });
    const probe = () => renderer!.root.findByProps({ className: "preference-probe" });
    expect(probe().props["data-theme"]).toBe("light");
    expect(probe().props["data-preference"]).toBe("system");
    expect(classNames.has("light-theme")).toBe(true);
    expect(values.get("circuitsight-theme")).toBe("light");

    act(() => { media.matches = false; listeners[0]?.(); });
    expect(probe().props["data-theme"]).toBe("dark");
    expect(classNames.has("dark")).toBe(true);

    const buttons = renderer!.root.findAllByType("button");
    act(() => buttons[2].props.onClick());
    expect(probe().props["data-contrast"]).toBe("true");
    expect(classNames.has("high-contrast")).toBe(true);
    expect(values.get("circuitsight-high-contrast")).toBe("true");
    renderer!.unmount();
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  });
});
