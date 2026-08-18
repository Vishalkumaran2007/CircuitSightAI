import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const homeSource = readFileSync(new URL("../client/src/pages/Home.tsx", import.meta.url), "utf8");

describe("Home route handoff contract", () => {
  it("keeps the public CTAs wired to real auth, workspace, and Learning Loop destinations", () => {
    expect(homeSource).toContain('setLocation("/learning")');
    expect(homeSource).toContain('target = user ? "workspace" : "auth"');
    expect(homeSource).toContain('const destination = target === "workspace" ? "/workspace" : "/auth"');
    expect(homeSource).toContain("setLocation(destination)");
  });
});
