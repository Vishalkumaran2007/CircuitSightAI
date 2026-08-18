import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const authState = vi.hoisted(() => ({ value: { user: null as { id: string } | null, loading: false } }));
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState.value }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
  useLocation: () => ["/learning", vi.fn()],
}));

import Learning from "../client/src/pages/Learning";

beforeEach(() => { vi.clearAllMocks(); authState.value = { user: null, loading: false }; });

describe("Learning Loop page", () => {
  it("renders keyboard-reachable signed-out navigation and primary actions", () => {
    const markup = renderToStaticMarkup(<Learning />);
    expect(markup).toContain("THE LEARNING LOOP");
    expect(markup).toContain("SIGNAL WAITING.");
    expect(markup).toContain("YOUR PROFILE IS PRIVATE BY DESIGN.");
    expect(markup).toContain("SIGN-IN REQUIRED");
    expect(markup).toContain('href="/auth"');
    expect(markup).toContain('href="/workspace"');
    expect(markup).toContain("<button");
    expect(markup).toContain("SIGN IN TO START");
    expect(markup).toContain("CAPTURE");
    expect(markup).toContain("REMEMBER");
  });

  it("renders an honest loading state while the session is syncing", () => {
    authState.value = { user: null, loading: true };
    const markup = renderToStaticMarkup(<Learning />);
    expect(markup).toContain("SIGNAL SYNCING.");
    expect(markup).toContain("CHECKING YOUR SIGNAL.");
    expect(markup).not.toContain("SIGN-IN REQUIRED");
  });

  it("renders the private signed-in profile state and workspace action", () => {
    authState.value = { user: { id: "user-1" }, loading: false };
    const markup = renderToStaticMarkup(<Learning />);
    expect(markup).toContain("SIGNAL READY.");
    expect(markup).toContain("PRIVATE / ACTIVE");
    expect(markup).toContain("NO SAVED PATTERNS YET.");
    expect(markup).toContain("OPEN WORKSPACE");
    expect(markup).toContain('href="/dashboard"');
  });
});
