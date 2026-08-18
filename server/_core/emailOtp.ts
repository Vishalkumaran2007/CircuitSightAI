import type { Express, Request, Response } from "express";
import { COOKIE_NAME } from "@shared/const";
import * as db from "../db";
import { getSessionCookieOptions } from "./cookies";
import { ENV } from "./env";
import { sdk } from "./sdk";

type SupabaseUser = {
  id?: string;
  email?: string;
  email_confirmed_at?: string | null;
  user_metadata?: { full_name?: string; name?: string };
};

export function registerEmailOtpRoutes(app: Express) {
  app.post("/api/email-auth/complete", async (req: Request, res: Response) => {
    const authorization = req.headers.authorization;
    const accessToken = typeof authorization === "string" && authorization.startsWith("Bearer ")
      ? authorization.slice(7)
      : "";

    if (!accessToken || !ENV.supabaseUrl || !ENV.supabaseAnonKey) {
      res.status(400).json({ error: "Verified email session is required." });
      return;
    }

    try {
      const userResponse = await fetch(`${ENV.supabaseUrl}/auth/v1/user`, {
        headers: {
          apikey: ENV.supabaseAnonKey,
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!userResponse.ok) {
        res.status(401).json({ error: "The email verification session is invalid or expired." });
        return;
      }

      const emailUser = await userResponse.json() as SupabaseUser;
      if (!emailUser.id || !emailUser.email || !emailUser.email_confirmed_at) {
        res.status(403).json({ error: "A verified email address is required before entering the workspace." });
        return;
      }

      const name = emailUser.user_metadata?.full_name || emailUser.user_metadata?.name || emailUser.email.split("@")[0] || "CircuitSight user";
      const openId = `supabase:${emailUser.id}`;
      await db.upsertUser({
        openId,
        name,
        email: emailUser.email,
        emailVerified: true,
        loginMethod: "email_otp",
        lastSignedIn: new Date(),
      });

      const sessionToken = await sdk.createSessionToken(openId, { name });
      res.cookie(COOKIE_NAME, sessionToken, { ...getSessionCookieOptions(req), maxAge: 365 * 24 * 60 * 60 * 1000 });
      res.json({ success: true, user: { name, email: emailUser.email } });
    } catch (error) {
      console.error("[Email OTP] Session completion failed", error);
      res.status(500).json({ error: "The verified email session could not be completed." });
    }
  });
}
