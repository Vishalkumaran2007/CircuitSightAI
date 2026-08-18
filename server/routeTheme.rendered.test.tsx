import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ThemeProvider, useTheme } from "../client/src/contexts/ThemeContext";
import Auth from "../client/src/pages/Auth";
import Dashboard from "../client/src/pages/Dashboard";
import Learning from "../client/src/pages/Learning";
import Workspace from "../client/src/pages/Workspace";

const authState = vi.hoisted(() => ({
  value: { user: { name: "Theme QA User", email: "theme@example.com" }, loading: false, error: null, logout: () => undefined },
}));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState.value }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => <a href={href} {...props}>{children}</a>,
  useLocation: () => ["/", () => undefined],
}));
vi.mock("@/lib/trpc", () => ({
  trpc: {
    circuit: {
      listThreads: { useQuery: () => ({ data: [], refetch: () => undefined, isLoading: false }) },
      getThread: { useQuery: () => ({ data: null, isLoading: false }) },
      analyze: { useMutation: () => ({ mutateAsync: async () => undefined, isPending: false, error: null }) },
    },
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
});
