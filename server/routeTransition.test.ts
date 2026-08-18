import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { getRouteTransitionLabel } from "../client/src/components/RouteTransition";

const stylesheet = readFileSync(new URL("../client/src/index.css", import.meta.url), "utf8");

describe("shared route transition", () => {
  it("uses destination-aware signal-gate copy", () => {
    expect(getRouteTransitionLabel("/workspace")).toBe("OPENING ANALYSIS WORKSPACE");
    expect(getRouteTransitionLabel("/learning")).toBe("SYNCING LEARNING LOOP");
    expect(getRouteTransitionLabel("/auth")).toBe("SECURING SIGN-IN GATE");
    expect(getRouteTransitionLabel("/unknown")).toBe("ROUTING TO CIRCUITSIGHT");
  });

  it("defines responsive and reduced-motion contracts", () => {
    expect(stylesheet).toContain(".route-transition { position: fixed; z-index: 1000;");
    expect(stylesheet).toContain("@media (max-width: 560px) { .route-transition-content");
    expect(stylesheet).toContain("@media (prefers-reduced-motion: reduce) { .route-transition");
  });
});
