import { describe, expect, it } from "vitest";

describe("Supabase Auth credentials", () => {
  it("can read the email-auth configuration", async () => {
    const projectUrl = process.env.VITE_SUPABASE_URL;
    const anonKey = process.env.VITE_SUPABASE_ANON_KEY;
    expect(projectUrl, "VITE_SUPABASE_URL must be configured").toBeTruthy();
    expect(anonKey, "VITE_SUPABASE_ANON_KEY must be configured").toBeTruthy();

    const response = await fetch(`${projectUrl}/auth/v1/settings`, {
      headers: { apikey: anonKey! },
    });

    expect(response.status, `Supabase rejected the configured credentials: ${response.status}`).toBeLessThan(400);
  }, 15_000);
});
