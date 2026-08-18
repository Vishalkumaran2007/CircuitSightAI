import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const routeState = vi.hoisted(() => ({ value: "/" }));
vi.mock("wouter", () => ({ useLocation: () => [routeState.value, vi.fn()] }));

import RouteTransition from "../client/src/components/RouteTransition";

beforeEach(() => {
  vi.useFakeTimers();
  routeState.value = "/";
  (globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.window = { location: { search: "" }, matchMedia: () => ({ matches: false }), setTimeout: globalThis.setTimeout, clearTimeout: globalThis.clearTimeout } as unknown as Window & typeof globalThis;
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("RouteTransition location changes", () => {
  it("shows the workspace gate after a real location change and dismisses it", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<RouteTransition />); });
    expect(renderer!.toJSON()).toBeNull();

    routeState.value = "/workspace";
    await act(async () => { renderer!.update(<RouteTransition />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain("OPENING ANALYSIS WORKSPACE");

    await act(async () => { vi.advanceTimersByTime(430); });
    expect(renderer!.toJSON()).toBeNull();
    renderer!.unmount();
  });

  it("updates destination copy for the Learning Loop handoff", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<RouteTransition />); });
    routeState.value = "/learning";
    await act(async () => { renderer!.update(<RouteTransition />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain("SYNCING LEARNING LOOP");
    renderer!.unmount();
  });

  it("shows and dismisses the auth gate on an auth handoff", async () => {
    let renderer: TestRenderer.ReactTestRenderer;
    await act(async () => { renderer = TestRenderer.create(<RouteTransition />); });
    routeState.value = "/auth";
    await act(async () => { renderer!.update(<RouteTransition />); });
    expect(JSON.stringify(renderer!.toJSON())).toContain("SECURING SIGN-IN GATE");
    await act(async () => { vi.advanceTimersByTime(430); });
    expect(renderer!.toJSON()).toBeNull();
    renderer!.unmount();
  });
});
