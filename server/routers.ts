import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

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
      },
      required: ["summary", "diagnosis", "confidence", "findings", "recommendedSteps", "uncertaintyNotice"],
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

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  circuit: router({
    analyze: protectedProcedure
      .input(z.object({
        question: z.string().trim().max(4000).optional(),
        imageDataUrl: z.string().max(16_000_000).optional(),
        imageMimeType: z.string().max(100).optional(),
      }).refine(input => Boolean(input.question || input.imageDataUrl), {
        message: "Provide a circuit question or upload an image.",
      }))
      .mutation(async ({ input }) => {
        const content: Array<{ type: "text"; text: string } | { type: "image_url"; image_url: { url: string; detail: "high" } }> = [
          {
            type: "text",
            text: `Analyze this electronics circuit for a learner.\n\nUser question: ${input.question || "Please inspect the uploaded circuit image."}\n\nReturn only the requested structured response. Identify visible components and connections, distinguish evidence from inference, and never claim a connection is verified when it is obscured or ambiguous. Recommend safe, low-risk inspection steps. Do not instruct the user to energize an uncertain circuit.`,
          },
        ];
        if (input.imageDataUrl) {
          content.push({ type: "image_url", image_url: { url: input.imageDataUrl, detail: "high" } });
        }

        const response = await invokeLLM({
          messages: [
            {
              role: "system",
              content: "You are CircuitSight AI, a cautious electronics debugging assistant. Favor visible evidence, clear confidence levels, and learner-friendly explanations. If the image is blurry, incomplete, or cannot establish electrical continuity, say so explicitly.",
            },
            { role: "user", content },
          ],
          response_format: circuitAnalysisResponseFormat,
          maxTokens: 1400,
        });

        const raw = getTextContent(response.choices[0]?.message?.content);
        if (!raw) throw new Error("The analysis service returned an empty response.");
        try {
          return JSON.parse(raw) as {
            summary: string;
            diagnosis: string;
            confidence: number;
            findings: Array<{ label: string; status: string; confidence: number; detail: string }>;
            recommendedSteps: string[];
            uncertaintyNotice: string;
          };
        } catch {
          throw new Error("The analysis service returned an unreadable response.");
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
