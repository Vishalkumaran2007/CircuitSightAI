import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import TestRenderer, { act } from "react-test-renderer";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "../client/src/contexts/ThemeContext";
import Auth from "../client/src/pages/Auth";
import Dashboard from "../client/src/pages/Dashboard";
import Learning from "../client/src/pages/Learning";
import Workspace from "../client/src/pages/Workspace";
import Personalization from "../client/src/pages/Personalization";
import Profile from "../client/src/pages/Profile";
import Settings from "../client/src/pages/Settings";
import Help from "../client/src/pages/Help";
import SwitchAccount from "../client/src/pages/SwitchAccount";
import { AppearanceLayer } from "../client/src/App";

const routeState = vi.hoisted(() => ({ path: "/" }));
const authState = vi.hoisted(() => ({
  value: { user: { name: "Theme QA User", email: "theme@example.com" }, loading: false, error: null, logout: () => undefined },
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState.value }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => <a href={href} {...props}>{children}</a>,
  Route: () => null,
  Switch: () => null,
  useLocation: () => [routeState.path, () => undefined],
}));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    circuit: {
      listThreads: { useQuery: () => ({ data: [], refetch: () => undefined, isLoading: false }) },
      getThread: { useQuery: () => ({ data: null, isLoading: false }) },
      analyze: { useMutation: () => ({ mutateAsync: async () => undefined, isPending: false, error: null }) },
    },
    preferences: {
      get: { useQuery: () => ({ data: { explanationLevel: "intermediate", responseStyle: "balanced", sarcasmEnabled: false, technicalTerminology: true, preferVisuals: true, suggestImprovements: true }, isLoading: false }) },
      update: { useMutation: () => ({ mutateAsync: async (input: unknown) => input, isPending: false }) },
    },
    useUtils: () => ({ preferences: { get: { invalidate: () => undefined } } }),
  },
}));

function ThemeProbe() {
  const { theme } = useTheme();
  return <span data-theme={theme} className="theme-contract-probe" />;
}

const routes = [
  { name: "auth", Component: Auth, marker: "auth-page", text: "ENTER" },
  { name: "workspace", Component: Workspace, marker: "workspace-page", text: "WHAT ARE YOU" },
  { name: "dashboard", Component: Dashboard, marker: "dashboard-page", text: "WELCOME" },
  { name: "learning", Component: Learning, marker: "learning-page", text: "THE MISTAKE" },
  { name: "personalization", Component: Personalization, marker: "account-page", text: "TUNE" },
  { name: "profile", Component: Profile, marker: "account-page", text: "YOUR" },
  { name: "settings", Component: Settings, marker: "account-page", text: "WORKBENCH" },
  { name: "help", Component: Help, marker: "account-page", text: "TRACE" },
  { name: "switch-account", Component: SwitchAccount, marker: "account-page", text: "SWITCH" },
] as const;

describe("route theme rendering", () => {
  beforeEach(() => {
    authState.value = { user: { name: "Theme QA User", email: "theme@example.com" }, loading: false, error: null, logout: () => undefined };
  });

  for (const theme of ["dark", "light"] as const) {
    for (const route of routes) {
      it(`renders the ${route.name} surface with the ${theme} theme contract`, () => {
        const markup = renderToStaticMarkup(
          <ThemeProvider defaultTheme={theme} switchable>
            <ThemeProbe />
            <route.Component />
          </ThemeProvider>,
        );
        expect(markup).toContain(`data-theme="${theme}"`);
        expect(markup).toContain(route.marker);
        expect(markup).toContain(route.text);
      });
    }
  }

  it("renders home and workspace appearance controls through the app shell", () => {
    routeState.path = "/";
    const originalDocument = globalThis.document;
    const keyListeners: Array<(event: { key: string }) => void> = [];
    Object.defineProperty(globalThis, "document", { configurable: true, value: {
      documentElement: { classList: { toggle: () => undefined } },
      addEventListener: (_type: string, listener: (event: { key: string }) => void) => keyListeners.push(listener),
      removeEventListener: () => undefined,
    } });
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => {
      renderer = TestRenderer.create(<ThemeProvider defaultTheme="dark" switchable><AppearanceLayer /></ThemeProvider>);
    });
    expect(renderer!.root.findAllByProps({ className: "theme-dropdown-trigger theme-toggle" })).toHaveLength(1);
    const trigger = renderer!.root.findByProps({ className: "theme-dropdown-trigger theme-toggle" });
    act(() => trigger.props.onKeyDown({ key: "Enter", preventDefault: () => undefined }));
    expect(renderer!.root.findAll(node => node.props.role === "menuitemradio" || node.props.role === "menuitemcheckbox")).toHaveLength(4);
    act(() => keyListeners[0]?.({ key: "Escape" }));
    expect(renderer!.root.findAllByProps({ className: "theme-dropdown-option" })).toHaveLength(0);
    renderer!.unmount();
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });

    routeState.path = "/workspace";
    act(() => {
      renderer = TestRenderer.create(<ThemeProvider defaultTheme="dark" switchable><AppearanceLayer /></ThemeProvider>);
    });
    expect(renderer!.root.findAllByType("button")).toHaveLength(3);
    expect(renderer!.root.findAllByProps({ className: "theme-dropdown-trigger theme-toggle" })).toHaveLength(0);
    renderer!.unmount();
  });
});
