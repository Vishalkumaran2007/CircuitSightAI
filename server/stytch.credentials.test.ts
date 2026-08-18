import { describe, expect, it } from "vitest";

describe("Stytch credentials", () => {
  it("can access the configured Stytch Consumer project", async () => {
    const projectId = process.env.STYTCH_PROJECT_ID;
    const secret = process.env.STYTCH_SECRET;
    expect(projectId, "STYTCH_PROJECT_ID must be configured").toBeTruthy();
    expect(secret, "STYTCH_SECRET must be configured").toBeTruthy();
    const apiBaseUrl = projectId?.startsWith("project-live-") ? "https://api.stytch.com" : "https://test.stytch.com";

    const response = await fetch(`${apiBaseUrl}/v1/otps/email/login_or_create`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${projectId}:${secret}`).toString("base64")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: "sandbox@stytch.com" }),
    });

    const detail = (await response.json().catch(() => ({}))) as { error_type?: string; error_message?: string };
    expect(
      response.status,
      `Stytch rejected the configured credentials: ${response.status} ${detail.error_type ?? ""} ${detail.error_message ?? ""}`.trim(),
    ).toBeLessThan(400);
  }, 15_000);
});
