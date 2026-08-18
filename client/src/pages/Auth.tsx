import { useAuth } from "@/_core/hooks/useAuth";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { ArrowLeft, ArrowUpRight, Check, Loader2, MailCheck, ShieldCheck } from "lucide-react";
import { FormEvent, useState } from "react";
import { Link, useLocation } from "wouter";

const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export default function Auth() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"email" | "verify">("email");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const sendOtp = async (event: FormEvent) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail || !supabaseUrl || !supabaseAnonKey) {
      setError("Enter a valid email address. Email verification is not configured if this message persists.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/otp`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail, create_user: true }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) throw new Error("We could not send a verification code. Check the address and try again.");
      setEmail(normalizedEmail);
      setStep("verify");
      setNotice(`A six-digit code was sent to ${normalizedEmail}.`);
    } catch (cause) {
      const message = cause instanceof Error && cause.name === "TimeoutError"
        ? "Code delivery took too long. Wait a minute, confirm the Supabase email template is saved, then try again."
        : cause instanceof Error ? cause.message : "The verification code could not be sent.";
      setError(message);
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async (event: FormEvent) => {
    event.preventDefault();
    if (otp.length !== 6 || !supabaseUrl || !supabaseAnonKey) {
      setError("Enter the six-digit code from your email.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const verifyResponse = await fetch(`${supabaseUrl}/auth/v1/verify`, {
        method: "POST",
        headers: { apikey: supabaseAnonKey, "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", email, token: otp }),
      });
      const verified = await verifyResponse.json() as { access_token?: string; error_description?: string };
      if (!verifyResponse.ok || !verified.access_token) throw new Error(verified.error_description || "That code is invalid or expired. Request another code and try again.");

      const sessionResponse = await fetch("/api/email-auth/complete", {
        method: "POST",
        headers: { Authorization: `Bearer ${verified.access_token}` },
      });
      if (!sessionResponse.ok) throw new Error("Your email was verified, but CircuitSight could not open a secure session.");
      sessionStorage.setItem("circuitsight:auth-pending", "1");
      setNotice("EMAIL VERIFIED. OPENING YOUR WORKSPACE...");
      window.setTimeout(() => setLocation("/workspace"), 420);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The code could not be verified.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="site-shell auth-page">
      <header className="topbar auth-topbar">
        <Link href="/" className="brand" aria-label="Return to CircuitSight AI home"><img src={markImage} alt="" className="brand-mark" /><span>CIRCUITSIGHT <i>AI</i></span></Link>
        <Link href="/" className="auth-back"><ArrowLeft size={15} /> RETURN TO LAB</Link>
      </header>
      <section className="auth-layout">
        <div className="auth-copy">
          <div className="auth-kicker mono"><span className="live-dot" /> ACCESS GATE / EMAIL VERIFICATION</div>
          <h1>ENTER<br /><em>THE LAB.</em></h1>
          <p>Verify your email to save circuit scans, export correction reports, and build a private learning record from the circuits you analyze.</p>
          <div className="auth-signal-list"><div><Check size={14} /> VERIFIED EMAIL ONLY</div><div><Check size={14} /> PRIVATE SCAN HISTORY</div><div><Check size={14} /> PERSONAL LEARNING LOOP</div></div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-head mono"><span>AUTH / 01</span><span>EMAIL OTP</span></div>
          {user?.emailVerified ? (
            <div className="auth-success"><ShieldCheck size={30} /><span className="mono">VERIFIED SESSION ACTIVE</span><h2>WELCOME<br /><em>{user.name || "BACK"}.</em></h2><p>Your verified email session is active. Continue to your private circuit workspace.</p><Link className="button button-acid button-large" href="/workspace">OPEN WORKSPACE <ArrowUpRight size={17} /></Link></div>
          ) : step === "email" ? (
            <form className="auth-form email-auth-form" onSubmit={sendOtp}>
              <span className="auth-form-label mono">SIGN UP / SIGN IN</span><h2>ONE EMAIL.<br /><em>ONE CODE.</em></h2>
              <p>Enter your email address. We will send a one-time verification code; only a verified match can enter the workspace.</p>
              <label className="email-auth-label" htmlFor="auth-email">EMAIL ADDRESS</label>
              <input id="auth-email" className="email-auth-input" type="email" autoComplete="email" value={email} onChange={event => setEmail(event.target.value)} placeholder="you@example.com" disabled={busy || loading} required />
              <button className="email-auth-button" type="submit" disabled={busy || loading}>{busy ? <Loader2 className="spin" size={18} /> : <MailCheck size={18} />}<span>{busy ? "SENDING CODE..." : "SEND VERIFICATION CODE"}</span><ArrowUpRight size={16} /></button>
              {error && <div className="auth-error" role="alert"><strong>CODE DELIVERY FAILED</strong><span>{error}</span></div>}
              <div className="auth-legal mono">A CODE IS VALID ONLY FOR THE EMAIL ADDRESS THAT REQUESTED IT. DO NOT SHARE IT.</div>
            </form>
          ) : (
            <form className="auth-form email-auth-form" onSubmit={verifyOtp}>
              <span className="auth-form-label mono">EMAIL CODE / 02</span><h2>CHECK<br /><em>YOUR INBOX.</em></h2>
              <p>{notice || `Enter the six-digit code sent to ${email}.`}</p>
              <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={busy} containerClassName="otp-input" aria-label="Six digit email verification code"><InputOTPGroup>{[0, 1, 2, 3, 4, 5].map(index => <InputOTPSlot key={index} index={index} />)}</InputOTPGroup></InputOTP>
              <button className="email-auth-button" type="submit" disabled={busy || otp.length !== 6}>{busy ? <Loader2 className="spin" size={18} /> : <ShieldCheck size={18} />}<span>{busy ? "VERIFYING EMAIL..." : "VERIFY AND ENTER"}</span><ArrowUpRight size={16} /></button>
              <button className="auth-text-button" type="button" disabled={busy} onClick={() => { setOtp(""); setStep("email"); setNotice(""); setError(""); }}>USE A DIFFERENT EMAIL</button>
              {error && <div className="auth-error" role="alert"><strong>VERIFICATION FAILED</strong><span>{error}</span></div>}
            </form>
          )}
        </div>
      </section>
      <div className="marquee marquee-yellow"><div>VERIFY <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b> VERIFY <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b></div></div>
    </main>
  );
}
