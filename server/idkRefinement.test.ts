import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

const read = (path: string) => readFileSync(resolve(process.cwd(), path), "utf8");

describe("IDK refinement contracts", () => {
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
