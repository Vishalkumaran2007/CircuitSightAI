import React from "react";
import TestRenderer, { act } from "react-test-renderer";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import AccountMenu from "../client/src/components/AccountMenu";

const logoutMock = vi.fn();
vi.mock("@/_core/hooks/useAuth", () => ({ useAuth: () => ({ user: { name: "Circuit Learner", email: "learner@example.com" }, logout: logoutMock }) }));
vi.mock("wouter", () => ({ Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => <a href={href} {...props}>{children}</a> }));

describe("IDK account menu", () => {
  it("renders the exact documented item order and account identity", () => {
    const markup = renderToStaticMarkup(<AccountMenu />);
    expect(markup).toContain("Circuit Learner");
    expect(markup).toContain("learner@example.com");
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => { renderer = TestRenderer.create(<AccountMenu />); });
    const trigger = renderer!.root.findByProps({ className: "workspace-account account-menu-trigger" });
    act(() => trigger.props.onClick());
    const items = renderer!.root.findAllByProps({ role: "menuitem" });
    const labels = ["PERSONALIZATION", "PROFILE", "SETTINGS", "HELP", "SWITCH ACCOUNT", "LOG OUT"];
    const itemText = items.map(item => item.children.filter((child): child is string => typeof child === "string").join(" ").trim()).filter(Boolean);
    expect(itemText).toEqual(labels);
    renderer!.unmount();
  });

  it("opens, closes with Escape/outside click, and calls logout", () => {
    const originalDocument = globalThis.document;
    const listeners: Record<string, Array<(event: { key?: string; target?: unknown }) => void>> = {};
    Object.defineProperty(globalThis, "document", { configurable: true, value: {
      addEventListener: (type: string, listener: (event: { key?: string; target?: unknown }) => void) => { (listeners[type] ||= []).push(listener); },
      removeEventListener: () => undefined,
    } });
    let renderer: TestRenderer.ReactTestRenderer;
    act(() => { renderer = TestRenderer.create(<AccountMenu />); });
    const trigger = renderer!.root.findByProps({ className: "workspace-account account-menu-trigger" });
    act(() => trigger.props.onClick());
    expect(renderer!.root.findByProps({ role: "menu" })).toBeTruthy();
    const logout = renderer!.root.findAllByProps({ role: "menuitem" }).at(-1);
    expect(logout).toBeTruthy();
    act(() => listeners.keydown?.[0]?.({ key: "Escape" }));
    expect(renderer!.root.findAllByProps({ role: "menu" })).toHaveLength(0);
    act(() => trigger.props.onClick());
    act(() => listeners.mousedown?.[0]?.({ target: {} }));
    expect(renderer!.root.findAllByProps({ role: "menu" })).toHaveLength(0);
    act(() => trigger.props.onClick());
    const menuButtons = renderer!.root.findAllByProps({ role: "menuitem" });
    act(() => menuButtons[menuButtons.length - 1].props.onClick());
    expect(logoutMock).toHaveBeenCalled();
    act(() => renderer!.unmount());
    Object.defineProperty(globalThis, "document", { configurable: true, value: originalDocument });
  });
});
