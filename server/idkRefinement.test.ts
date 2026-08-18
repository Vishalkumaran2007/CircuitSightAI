import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("IDK refinement contracts", () => {
  it("keeps the loading transition readable in the light theme", () => {
    const css = read("client/src/index.css");
    expect(css).toContain(".light-theme .route-transition { background: rgba(250, 250, 250, .97); color: #09090b; }");
    expect(css).toContain(".light-theme .route-transition-content strong { color: #09090b; }");
    expect(css).toContain(".light-theme .route-transition-footer { color: #3f3f46; }");
  });

  it("keeps dashboard numbers visible in the light theme", () => {
    const css = read("client/src/index.css");
    expect(css).toContain(".light-theme .dashboard-hero:after { color: #000000; }");
    expect(css).toContain(".light-theme .dashboard-card strong { color: #000000; }");
    expect(css).toContain(".light-theme .dashboard-card > span { color: #333333; }");
  });

  it("preserves the exact TEAM / CREDITS responsibilities", () => {
    const home = read("client/src/pages/Home.tsx");
    const css = read("client/src/index.css");
    for (const credit of ["VISHALKUMARAN V", "DEVELOPER", "SANKARPRASATH S", "IDEA & CONCEPT", "ROHINI S", "UI/UX DESIGN", "SAYASREE T K", "R&D & PITCHING"]) expect(home).toContain(credit);
    expect(home).toContain("BUILT BY A TEAM OF ENGINEERS, DESIGNERS &amp; RESEARCHERS.");
    expect(css).toContain(".team-card:hover");
    expect(css).toContain("background: var(--acid)");
    expect(css).toContain("@media (prefers-reduced-motion: reduce)");
    expect(css).toContain(".team-grid { grid-template-columns: 1fr;");
  });

  it("keeps website support separate from circuit diagnosis", () => {
    const router = read("server/routers.ts");
    const help = read("client/src/pages/Help.tsx");
    expect(router).toContain("help: router({");
    expect(router).toContain("website-help assistant");
    expect(router).toContain("direct them to /workspace");
    expect(help).toContain("trpc.help.chat.useMutation");
  });

  it("defines all four Visual Signal palettes", () => {
    const page = read("client/src/pages/VisualSignal.tsx");
    const context = read("client/src/contexts/ThemeContext.tsx");
    for (const palette of ["lavender", "cyan", "amber", "mint"]) {
      expect(page).toContain(`id: "${palette}"`);
      expect(context).toContain(`palette-${palette}`);
    }
    expect(context).toContain("circuitsight-theme-palette");
  });

  it("limits appearance controls to Home and Visual Signal", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('if (location === "/") return <ThemeToggle homeDropdown={location === "/"} />;');
    expect(app).toContain('if (location === "/visual-signal") return <ThemeToggle />;');
    expect(app).toContain("return null;");
  });

  it("keeps Help and Visual Signal responsive contracts explicit", () => {
    const css = read("client/src/index.css");
    expect(css).toContain(".visual-signal-layout");
    expect(css).toContain("@media (max-width: 760px) { .visual-signal-layout");
    expect(css).toContain(".help-grid");
    expect(css).toContain("@media (max-width: 760px)");
  });

  it("stores user corrections as pending review records", () => {
    const schema = read("drizzle/schema.ts");
    const router = read("server/routers.ts");
    expect(schema).toContain('mysqlTable("circuit_feedback"');
    expect(schema).toContain('mysqlEnum("reviewStatus", ["pending", "accepted", "rejected"])');
    expect(router).toContain("submitFeedback: protectedProcedure");
    expect(router).toContain('feedbackType: z.enum(["correction", "confirmation", "clarification"])');
  });
});
