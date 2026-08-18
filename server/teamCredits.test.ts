import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("team credit portfolio interaction", () => {
  it("links only Vishalkumaran V to the requested portfolio", () => {
    const page = readFileSync(resolve(process.cwd(), "client/src/pages/Home.tsx"), "utf8");
    expect(page).toContain('href: "https://vishalkumaran2007.github.io/Portfolio/"');
    expect(page).toContain('{ number: "01", name: "SANKARPRASATH S"');
    expect(page).toContain('{ number: "02", name: "ROHINI S"');
    expect(page).toContain('{ number: "03", name: "VISHALKUMARAN V"');
    expect(page).toContain('{ number: "04", name: "SAYASREE T K"');
    expect(page).toContain('aria-label={`Open ${member.name} portfolio`}');
    expect(page).toContain('name: "SANKARPRASATH S"');
    expect(page).toContain('name: "ROHINI S"');
    expect(page).toContain('name: "SAYASREE T K"');
    expect(page).toContain('return member.href ? <a className="team-card team-card-link"');
    expect(page).toContain('<article className="team-card"');
  });

  it("preserves responsive and reduced-motion team-card contracts", () => {
    const css = readFileSync(resolve(process.cwd(), "client/src/index.css"), "utf8");
    expect(css).toContain(".team-grid { display: grid; grid-template-columns: repeat(4");
    expect(css).toContain("@media (max-width: 600px) { .team-heading");
    expect(css).toContain("@media (prefers-reduced-motion: reduce) { .team-card");
    expect(css).toContain(".team-card-link:hover, .team-card-link:focus-visible { background: var(--acid)");
  });
});
