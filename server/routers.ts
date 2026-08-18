import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import * as db from "./db";

const circuitFindingSchema = {
  type: "object",
  properties: {
    label: { type: "string", description: "Short finding label" },
    status: { type: "string", enum: ["verified", "uncertain", "not_visible"] },
    confidence: { type: "integer", minimum: 0, maximum: 100 },
    detail: { type: "string", description: "Evidence-based explanation" },
  },
  required: ["label", "status", "confidence", "detail"],
  additionalProperties: false,
};

const circuitAnalysisResponseFormat = {
  type: "json_schema" as const,
  json_schema: {
    name: "circuit_analysis",
    strict: true,
    schema: {
      type: "object",
      properties: {
        summary: { type: "string" },
        diagnosis: { type: "string" },
        confidence: { type: "integer", minimum: 0, maximum: 100 },
        findings: { type: "array", items: circuitFindingSchema },
        recommendedSteps: { type: "array", items: { type: "string" } },
        uncertaintyNotice: { type: "string" },
        currentPath: { type: "string" },
        signalPath: { type: "string" },
        faultTrace: { type: "string" },
        visualGuidance: { type: "array", items: { type: "string" } },
      },
      required: ["summary", "diagnosis", "confidence", "findings", "recommendedSteps", "uncertaintyNotice", "currentPath", "signalPath", "faultTrace", "visualGuidance"],
      additionalProperties: false,
    },
  },
};

const getTextContent = (content: unknown) => {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .filter((part): part is { type: "text"; text: string } => typeof part === "object" && part !== null && "type" in part && part.type === "text" && "text" in part)
      .map(part => part.text)
      .join("\n");
  }
  return "";
};

type CircuitAnalysis = {
  summary: string;
  diagnosis: string;
  confidence: number;
  findings: Array<{ label: string; status: string; confidence: number; detail: string }>;
  recommendedSteps: string[];
  uncertaintyNotice: string;
  currentPath: string;
  signalPath: string;
  faultTrace: string;
  visualGuidance: string[];
};

const formatIdkResponse = (analysis: CircuitAnalysis, question?: string) => {
  const normalizedQuestion = question?.toLowerCase() ?? "";
  const greeting = /^(hi|hello|hey)\b/.test(normalizedQuestion) && !analysis.findings.length
    ? "Hey — I’m IDK, the Intelligent Diagnostic Kernel. Upload a circuit image or schematic and I’ll inspect the components, connections, topology, and likely faults."
    : "Got it — I’ve checked the circuit.";
  const confidence = analysis.confidence >= 85
    ? `I’m highly confident about the visible evidence here (~${analysis.confidence}%).`
    : analysis.confidence >= 60
      ? `I’m reasonably confident about the main diagnosis (~${analysis.confidence}%), although some of the wiring is not completely clear.`
      : `I can only make a tentative call here (~${analysis.confidence}%), so I don’t want to pretend the image proves more than it does.`;
  const findings = analysis.findings.length
    ? analysis.findings.map(finding => {
      if (finding.status === "uncertain" || finding.status === "not_visible") return `The ${finding.label.toLowerCase()} is not fully settled: ${finding.detail}`;
      return `I can see ${finding.label.toLowerCase()}: ${finding.detail}`;
    }).join("\n\n")
    : "I didn’t get a clear enough visual finding to call out a specific component or connection.";
  const recommendations = analysis.recommendedSteps.length
    ? `If you’re testing this physically, I’d start with ${analysis.recommendedSteps[0].toLowerCase()}${analysis.recommendedSteps.length > 1 ? ` Then I’d also ${analysis.recommendedSteps.slice(1).join(" Also, ").toLowerCase()}` : ""}`
    : "I’d take a clearer, top-down photo before making a physical correction.";
  const currentPath = analysis.currentPath || "A current path could not be established from the supplied evidence.";
  const signalPath = analysis.signalPath || "A signal path could not be established from the supplied evidence.";
  const faultTrace = analysis.faultTrace || "No fault trace was confirmed beyond the findings above.";
  const visualGuidance = (analysis.visualGuidance ?? []).length ? `\n\nVisual guidance: ${(analysis.visualGuidance ?? []).join(" ")}` : "";
  return `${greeting}\n\n${analysis.summary}\n\nHere’s what I think is happening: ${analysis.diagnosis}\n\n${findings}\n\nCurrent path: ${currentPath}\n\nSignal path: ${signalPath}\n\nFault trace: ${faultTrace}\n\n${confidence}\n\n${analysis.uncertaintyNotice}\n\n${recommendations}${visualGuidance}\n\nWant me to trace the current path step-by-step?`;
};

export const appRouter = router({
  system: systemRouter,
  preferences: router({
    get: protectedProcedure.query(async ({ ctx }) => {
      const preferences = await db.getIdkPreferences(ctx.user.id);
      return preferences ?? {
        explanationLevel: "intermediate" as const,
        responseStyle: "balanced" as const,
        sarcasmEnabled: false,
        technicalTerminology: true,
        preferVisuals: true,
        suggestImprovements: true,
      };
    }),
    update: protectedProcedure.input(z.object({
      explanationLevel: z.enum(["beginner", "intermediate", "advanced"]),
      responseStyle: z.enum(["concise", "balanced", "detailed"]),
      sarcasmEnabled: z.boolean(),
      technicalTerminology: z.boolean(),
      preferVisuals: z.boolean(),
      suggestImprovements: z.boolean(),
    })).mutation(({ ctx, input }) => db.upsertIdkPreferences(ctx.user.id, input)),
  }),
  help: router({
    chat: protectedProcedure.input(z.object({
      messages: z.array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().trim().min(1).max(4000) })).max(12),
    })).mutation(async ({ input }) => {
      const transcript = input.messages.map(message => `${message.role.toUpperCase()}: ${message.content}`).join("\\n\\n");
      const response = await invokeLLM({
        messages: [
          {
            role: "system",
            content: "You are IDK Support, the website-help assistant for IDK (Intelligent Diagnostic Kernel). Answer only questions about this website's navigation, account routes, workspace workflow, uploads, saved analyses, correction reports, Personalization / TUNE THE KERNEL, Visual Signal palettes, appearance modes, accessibility, authentication, and learning-loop concepts. Use the conversation context. Be concise, practical, and specific. If the user asks you to diagnose a circuit, interpret a schematic, or solve an electronics problem, do not analyze it here: explain that the Help assistant is for website workflows and direct them to /workspace to ask IDK. Never invent a feature that is not described in the question or the product context. Do not request passwords, OAuth tokens, or sensitive circuit data.",
          },
          { role: "user", content: `Website-help conversation:\\n${transcript}` },
        ],
        maxTokens: 700,
      });
      const content = getTextContent(response.choices[0]?.message?.content).trim();
      if (!content) throw new Error("The help service returned an empty response.");
      return { content };
    }),
  }),
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  circuit: router({
    listThreads: protectedProcedure.query(({ ctx }) => db.listCircuitThreads(ctx.user.id)),
    getThread: protectedProcedure.input(z.object({ threadId: z.number().int().positive() })).query(async ({ ctx, input }) => {
      const thread = await db.getCircuitThread(ctx.user.id, input.threadId);
      if (!thread) throw new Error("Circuit thread was not found.");
      const messages = await db.listCircuitMessages(ctx.user.id, input.threadId);
      return { thread, messages };
    }),
    submitFeedback: protectedProcedure.input(z.object({
      threadId: z.number().int().positive(),
      messageId: z.number().int().positive().optional(),
      feedbackType: z.enum(["correction", "confirmation", "clarification"]),
      correctionText: z.string().trim().min(3).max(4000),
      evidenceNotes: z.string().trim().max(4000).optional(),
    })).mutation(({ ctx, input }) => db.addCircuitFeedback({ ...input, userId: ctx.user.id, evidenceNotes: input.evidenceNotes || null, messageId: input.messageId ?? null })),
    analyze: protectedProcedure
      .input(z.object({
        threadId: z.number().int().positive().optional(),
        question: z.string().trim().max(4000).optional(),
        imageDataUrl: z.string().max(16_000_000).optional(),
        imageMimeType: z.string().max(100).optional(),
        attachmentName: z.string().max(255).optional(),
      }).refine(input => Boolean(input.question || input.imageDataUrl), {
        message: "Provide a circuit question or upload an image.",
      }))
      .mutation(async ({ ctx, input }) => {
        const titleSeed = input.question?.trim() || input.attachmentName || "Circuit analysis";
        const priorMessages = input.threadId ? await db.listCircuitMessages(ctx.user.id, input.threadId) : [];
        const thread = input.threadId
          ? await db.getCircuitThread(ctx.user.id, input.threadId)
          : await db.createCircuitThread(ctx.user.id, titleSeed.slice(0, 180));
        if (!thread) throw new Error("Circuit thread was not found.");
        const preferences = await db.getIdkPreferences(ctx.user.id) ?? {
          explanationLevel: "intermediate" as const,
          responseStyle: "balanced" as const,
          sarcasmEnabled: false,
          technicalTerminology: true,
          preferVisuals: true,
          suggestImprovements: true,
        };
        const userContent = input.question?.trim() || "Analyze this circuit image.";
        await db.addCircuitMessage({ userId: ctx.user.id, threadId: thread.id, role: "user", content: userContent, attachmentName: input.attachmentName });
        const conversationContext = priorMessages.slice(-8).map(message => `${message.role.toUpperCase()}: ${message.content}`).join("\n\n");
        const content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail: "high" } }> = [
          {
            type: "text",
            text: `Analyze this electronics circuit as IDK, the Intelligent Diagnostic Kernel.\n\nUser question: ${input.question || "Please inspect the uploaded circuit image."}\n\nConversation context from this thread:\n${conversationContext || "No earlier context."}\n\nUser preferences: explanation level=${preferences.explanationLevel}; response style=${preferences.responseStyle}; technical terminology=${preferences.technicalTerminology ? "preferred" : "avoid"}; visual explanations=${preferences.preferVisuals ? "preferred" : "not requested"}; circuit improvement suggestions=${preferences.suggestImprovements ? "enabled" : "disabled"}; sarcasm=${preferences.sarcasmEnabled ? "allowed sparingly" : "disabled"}.\n\nReturn only the requested structured response. Identify visible components and connections, distinguish evidence from inference, adapt vocabulary and detail to the preferences, ask for clarification in the uncertainty notice when additional information would materially improve the diagnosis, and never claim a connection is verified when it is obscured or ambiguous. For large or complex schematics and PCB layouts, partition the board into functional blocks, name the inspected region, trace current and signal paths only where supported by visible topology, and describe a fault trace from evidence to hypothesis. Populate visualGuidance with concrete, non-fabricated suggestions such as which node or region should be annotated, highlighted, or compared. Recommend safe, low-risk inspection steps. Do not instruct the user to energize an uncertain circuit.`,
          },
        ];
        if (input.imageDataUrl) {
          content.push({ type: "image_url", image_url: { url: input.imageDataUrl, detail: "high" } });
        }

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are IDK (Intelligent Diagnostic Kernel), a friendly adaptive electronics diagnostic assistant. Maintain continuity with the provided thread context. Observe, understand, explain, diagnose, recommend, ask clarifying questions when evidence is insufficient, and engage conversationally. Return the requested structured JSON, but ground every statement in visible circuit data and user-provided information. Adapt terminology and detail to the user preferences. Use subtle wit only when permitted and never when it compromises technical accuracy or safety. Never invent components, connections, measurements, voltage, current, resistance, or electrical behavior. Support simple and complex circuit reasoning, current-path and signal-path explanations, fault tracing, schematics, breadboards, PCB layouts, analog, digital, and mixed-signal contexts when the supplied evidence supports them. For a dense image, reason in regions and state what was not inspected or cannot be resolved. If the image is blurry, incomplete, or cannot establish electrical continuity, say so explicitly.",
            },
            { role: "user", content },
          ],
          response_format: circuitAnalysisResponseFormat,
          maxTokens: 1400,
        });

        const raw = getTextContent(response.choices[0]?.message?.content);
        if (!raw) throw new Error("The analysis service returned an empty response.");
        try {
          const analysis = JSON.parse(raw) as CircuitAnalysis;
          const displayContent = formatIdkResponse(analysis, input.question);
          await db.addCircuitMessage({ userId: ctx.user.id, threadId: thread.id, role: "assistant", content: displayContent });
          return { thread, analysis, displayContent };
        } catch {
          throw new Error("The analysis service returned an unreadable response.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
