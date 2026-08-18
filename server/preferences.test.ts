import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const dbMock = vi.hoisted(() => ({
  getIdkPreferences: vi.fn(),
  upsertIdkPreferences: vi.fn(),
}));
vi.mock("./db", () => dbMock);

function context(): TrpcContext {
  return {
    user: { id: 7, openId: "pref-user", name: "Preference User", email: "pref@example.com", emailVerified: true, loginMethod: "oauth", role: "user", createdAt: new Date(), updatedAt: new Date(), lastSignedIn: new Date() },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("IDK preferences", () => {
  it("returns honest defaults when the user has no saved preferences", async () => {
    dbMock.getIdkPreferences.mockResolvedValueOnce(undefined);
    const result = await appRouter.createCaller(context()).preferences.get();
    expect(result.explanationLevel).toBe("intermediate");
    expect(result.responseStyle).toBe("balanced");
    expect(result.preferVisuals).toBe(true);
  });

  it("persists the documented personalization controls for the authenticated user", async () => {
    const input = { explanationLevel: "advanced" as const, responseStyle: "detailed" as const, sarcasmEnabled: false, technicalTerminology: true, preferVisuals: true, suggestImprovements: false };
    dbMock.upsertIdkPreferences.mockResolvedValueOnce({ id: 3, userId: 7, ...input, createdAt: new Date(), updatedAt: new Date() });
    const result = await appRouter.createCaller(context()).preferences.update(input);
    expect(dbMock.upsertIdkPreferences).toHaveBeenCalledWith(7, input);
    expect(result.explanationLevel).toBe("advanced");
    expect(result.suggestImprovements).toBe(false);
  });
});
