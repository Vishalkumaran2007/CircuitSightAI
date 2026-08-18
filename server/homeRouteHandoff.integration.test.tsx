import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routeState = vi.hoisted(() => ({ value: "/" }));
const authState = vi.hoisted(() => ({ user: null as { id: string } | null, loading: false }));

vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => authState }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => <a href={href} {...props}>{children}</a>,
  useLocation: () => [routeState.value, (destination: string) => { routeState.value = destination; }],
}));
vi.mock("framer-motion", () => {
  const passthrough = (tag: string) => (props: Record<string, unknown>) => React.createElement(tag, props, props.children as React.ReactNode);
  return { motion: new Proxy({}, { get: (_, tag) => passthrough(String(tag)) }), useReducedMotion: () => false };
});

import Home from "../client/src/pages/Home";
import RouteTransition from "../client/src/components/RouteTransition";

function mockBrowser() {
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.window = { location: { search: "" }, matchMedia: () => ({ matches: false }), setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout } as unknown as Window & typeof globalThis;
}

function childText(value: unknown): string {
  if (typeof value === "string") return value;
  if (Array.isArray(value)) return value.map(childText).join(" ");
  if (value && typeof value === "object" && "props" in value) return childText((value as { props?: { children?: unknown } }).props?.children);
  return "";
}

function findButton(renderer: TestRenderer.ReactTestRenderer, text: string) {
  return renderer.root.findAllByType("button").find(button => childText(button.props.children).includes(text));
}

function findSharedOverlay(renderer: TestRenderer.ReactTestRenderer) {
  return renderer.root.findAll(node => node.props?.["aria-live"] === "polite" && typeof node.props?.["aria-label"] === "string");
}

function mountApp() {
  return TestRenderer.create(<><Home /><RouteTransition /></>);
}

beforeEach(() => {
  vi.useFakeTimers();
  routeState.value = "/";
  authState.user = null;
  authState.loading = false;
  mockBrowser();
});

afterEach(() => { vi.useRealTimers(); vi.restoreAllMocks(); });

describe("Home CTA route handoffs", () => {
  it("routes Explore the Learning Loop through the shared transition", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = mountApp(); });
    const button = findButton(renderer!, "EXPLORE THE LEARNING LOOP");
    expect(button).toBeDefined();
    await act(async () => { button!.props.onClick(); renderer!.update(<><Home /><RouteTransition /></>); });
    expect(routeState.value).toBe("/learning");
    expect(JSON.stringify(renderer!.toJSON())).toContain("SYNCING LEARNING LOOP");
    await act(async () => { vi.advanceTimersByTime(430); });
    expect(findSharedOverlay(renderer!)).toHaveLength(0);
    renderer!.unmount();
  });

  it("routes the signed-out scanner CTA to auth through the shared transition", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = mountApp(); });
    const button = findButton(renderer!, "START SCANNING");
    expect(button).toBeDefined();
    await act(async () => { button!.props.onClick(); vi.advanceTimersByTime(280); renderer!.update(<><Home /><RouteTransition /></>); });
    expect(routeState.value).toBe("/auth");
    expect(JSON.stringify(renderer!.toJSON())).toContain("SECURING SIGN-IN GATE");
    await act(async () => { vi.advanceTimersByTime(430); });
    expect(findSharedOverlay(renderer!)).toHaveLength(0);
    renderer!.unmount();
  });

  it("routes the signed-in scanner CTA to workspace through the shared transition", async () => {
    authState.user = { id: "user-1" };
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = mountApp(); });
    const button = findButton(renderer!, "START SCANNING");
    expect(button).toBeDefined();
    await act(async () => { button!.props.onClick(); vi.advanceTimersByTime(280); renderer!.update(<><Home /><RouteTransition /></>); });
    expect(routeState.value).toBe("/workspace");
    expect(JSON.stringify(renderer!.toJSON())).toContain("OPENING ANALYSIS WORKSPACE");
    await act(async () => { vi.advanceTimersByTime(430); });
    expect(findSharedOverlay(renderer!)).toHaveLength(0);
    renderer!.unmount();
  });
});
