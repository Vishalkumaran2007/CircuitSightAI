import { useAuth } from "@/_core/hooks/useAuth";
import React from "react";
import { startLogin } from "@/const";
import { ArrowLeft, ArrowUpRight, Check, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";

export default function Auth() {
  const { user, loading, error } = useAuth();
  const [startingLogin, setStartingLogin] = useState(false);

  const handleLogin = () => {
    setStartingLogin(true);
    startLogin();
  };

  return (
    <main className="site-shell auth-page">
      <header className="topbar auth-topbar">
        <Link href="/" className="brand" aria-label="Return to CircuitSight AI home"><img src={markImage} alt="" className="brand-mark" /><span>CIRCUITSIGHT <i>AI</i></span></Link>
        <Link href="/" className="auth-back"><ArrowLeft size={15} /> RETURN TO LAB</Link>
      </header>
      <section className="auth-layout">
        <div className="auth-copy">
          <div className="auth-kicker mono"><span className="live-dot" /> ACCESS GATE / SECURE SESSION</div>
          <h1>ENTER<br /><em>THE LAB.</em></h1>
          <p>Sign in securely to save circuit scans, export correction reports, and build a private learning record from the circuits you analyze.</p>
          <div className="auth-signal-list"><div><Check size={14} /> SECURE SESSION</div><div><Check size={14} /> PRIVATE SCAN HISTORY</div><div><Check size={14} /> PERSONAL LEARNING LOOP</div></div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-head mono"><span>AUTH / 01</span><span>SECURE SIGN-IN</span></div>
          {user ? (
            <div className="auth-success"><ShieldCheck size={30} /><span className="mono">SESSION ACTIVE</span><h2>WELCOME<br /><em>{user.name || "BACK"}.</em></h2><p>Your CircuitSight session is active. Continue to your private circuit workspace.</p><Link className="button button-acid button-large" href="/workspace">OPEN WORKSPACE <ArrowUpRight size={17} /></Link></div>
          ) : (
            <div className="auth-form email-auth-form">
              <span className="auth-form-label mono">SIGN IN TO CONTINUE</span><h2>KEEP<br /><em>THE SIGNAL.</em></h2>
              <p>Use the configured secure sign-in method to create your private CircuitSight session. No email codes are required.</p>
              <button className="email-auth-button" type="button" onClick={handleLogin} disabled={loading || startingLogin}>{loading || startingLogin ? <Loader2 className="spin" size={18} /> : <LogIn size={18} />}<span>{loading ? "CHECKING SESSION..." : startingLogin ? "OPENING SIGN-IN..." : "CONTINUE WITH SECURE SIGN-IN"}</span><ArrowUpRight size={16} /></button>
              {error && <div className="auth-error" role="alert"><strong>SIGN-IN STATUS UNAVAILABLE</strong><span>Please return to the lab and try the secure sign-in action again.</span></div>}
              <div className="auth-legal mono">YOUR SESSION PROTECTS YOUR SAVED ANALYSES. SIGN OUT WHEN YOU FINISH.</div>
            </div>
          )}
        </div>
      </section>
      <div className="marquee marquee-yellow"><div>CONNECT <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b> CONNECT <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b></div></div>
    </main>
  );
}
