import { beforeEach, describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

const { invokeLLMMock, dbMock } = vi.hoisted(() => ({
  invokeLLMMock: vi.fn(),
  dbMock: {
    createCircuitThread: vi.fn(),
    getCircuitThread: vi.fn(),
    addCircuitMessage: vi.fn(),
    getIdkPreferences: vi.fn().mockResolvedValue(undefined),
    listCircuitMessages: vi.fn().mockResolvedValue([]),
  },
}));
vi.mock("./_core/llm", () => ({ invokeLLM: invokeLLMMock }));
vi.mock("./db", () => dbMock);

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "circuit-user",
    email: "learner@example.com",
    name: "Circuit Learner",
    loginMethod: "google",
    emailVerified: true,
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const validAnalysis = {
  summary: "The LED path is visible but the ground return is not fully confirmed.",
  diagnosis: "Inspect the ground rail and the LED polarity before powering the circuit.",
  confidence: 78,
  findings: [
    { label: "LED polarity", status: "verified", confidence: 90, detail: "The longer lead appears to face the positive rail." },
    { label: "Ground return", status: "uncertain", confidence: 58, detail: "The image does not clearly show continuity into the ground rail." },
  ],
  recommendedSteps: ["Trace the ground wire to the rail.", "Check the LED orientation against its datasheet."],
  uncertaintyNotice: "Continuity cannot be confirmed from a single image.",
};

describe("circuit.analyze", () => {
  beforeEach(() => {
    invokeLLMMock.mockReset();
    dbMock.createCircuitThread.mockReset();
    dbMock.getCircuitThread.mockReset();
    dbMock.addCircuitMessage.mockReset();
    dbMock.getIdkPreferences.mockReset();
    dbMock.listCircuitMessages.mockReset();
    dbMock.createCircuitThread.mockImplementation(async (userId: number, title: string) => ({
      id: 999,
      userId,
      title,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    dbMock.getCircuitThread.mockResolvedValue({ id: 999, userId: 1, title: "Existing thread", createdAt: new Date(), updatedAt: new Date() });
    dbMock.addCircuitMessage.mockResolvedValue(undefined);
    dbMock.getIdkPreferences.mockResolvedValue({ explanationLevel: "advanced", responseStyle: "detailed", sarcasmEnabled: false, technicalTerminology: true, preferVisuals: true, suggestImprovements: true });
    dbMock.listCircuitMessages.mockResolvedValue([{ role: "assistant", content: "Earlier IDK note: the ground return was uncertain." }]);
  });

  it("returns a structured analysis for an authenticated text query", async () => {
    invokeLLMMock.mockResolvedValueOnce({
      choices: [{ message: { role: "assistant", content: JSON.stringify(validAnalysis) } }],
    });

    const caller = appRouter.createCaller(createContext());
    const result = await caller.circuit.analyze({ question: "Why is my LED not lighting?" });

    expect(result.analysis).toEqual(validAnalysis);
    expect(result.thread.title).toBe("Why is my LED not lighting?");
    expect(result.displayContent).toContain("Got it — I’ve checked the circuit.");
    expect(result.displayContent).toContain("I’m reasonably confident about the main diagnosis (~78%)");
    expect(result.displayContent).toContain("Want me to trace the current path step-by-step?");
    expect(result.displayContent).not.toContain("CONFIDENCE /");
    expect(result.displayContent).not.toContain("RECOMMENDED CHECKS");
    expect(invokeLLMMock).toHaveBeenCalledOnce();
    expect(invokeLLMMock.mock.calls[0]?.[0].response_format.type).toBe("json_schema");
    expect(invokeLLMMock.mock.calls[0]?.[0].messages[0].content).toContain("IDK (Intelligent Diagnostic Kernel)");
  });

  it("carries persisted preferences and prior thread context into IDK analysis", async () => {
    invokeLLMMock.mockResolvedValueOnce({ choices: [{ message: { role: "assistant", content: JSON.stringify(validAnalysis) } }] });
    const caller = appRouter.createCaller(createContext());
    await caller.circuit.analyze({ threadId: 999, question: "Continue the diagnosis." });
    const request = invokeLLMMock.mock.calls[0]?.[0];
    expect(request.messages[1].content[0].text).toContain("explanation level=advanced");
    expect(request.messages[1].content[0].text).toContain("response style=detailed");
    expect(request.messages[1].content[0].text).toContain("Earlier IDK note");
  });

  it("passes an uploaded circuit image as multimodal content", async () => {
    invokeLLMMock.mockResolvedValueOnce({
      choices: [{ message: { role: "assistant", content: JSON.stringify(validAnalysis) } }],
    });

    const caller = appRouter.createCaller(createContext());
    await caller.circuit.analyze({
      question: "Trace the ground return.",
      imageDataUrl: "data:image/png;base64,ZmFrZS1jaXJjdWl0",
      imageMimeType: "image/png",
    });

    const userMessage = invokeLLMMock.mock.calls[0]?.[0].messages[1];
    expect(Array.isArray(userMessage.content)).toBe(true);
    expect(userMessage.content).toContainEqual({
      type: "image_url",
      image_url: { url: "data:image/png;base64,ZmFrZS1jaXJjdWl0", detail: "high" },
    });
  });

  it("rejects an empty analysis response instead of presenting a false conclusion", async () => {
    invokeLLMMock.mockResolvedValueOnce({
      choices: [{ message: { role: "assistant", content: "" } }],
    });

    const caller = appRouter.createCaller(createContext());
    await expect(caller.circuit.analyze({ question: "Inspect this circuit" })).rejects.toThrow("empty response");
  });

  it("requires a question or image", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.circuit.analyze({})).rejects.toThrow();
    expect(invokeLLMMock).not.toHaveBeenCalled();
  });
});
