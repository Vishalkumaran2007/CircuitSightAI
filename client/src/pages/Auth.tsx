/* Kinetic Circuit Brutalism: separate auth surface, acid signal CTA, hard diagnostics, and explicit loading/error states. */
import { useAuth } from "@/_core/hooks/useAuth";
import { useState } from "react";
import { startLogin } from "@/const";
import { ArrowLeft, ArrowUpRight, Check, Loader2, ShieldCheck } from "lucide-react";
import { Link } from "wouter";

const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";

export default function Auth() {
  const { user, loading, error } = useAuth();
  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleLogin = () => {
    setIsRedirecting(true);
    sessionStorage.setItem("circuitsight:auth-pending", "1");
    startLogin();
  };

  return (
    <main className="site-shell auth-page">
      <header className="topbar auth-topbar">
        <Link href="/" className="brand" aria-label="Return to CircuitSight AI home">
          <img src={markImage} alt="" className="brand-mark" />
          <span>CIRCUITSIGHT <i>AI</i></span>
        </Link>
        <Link href="/" className="auth-back"><ArrowLeft size={15} /> RETURN TO LAB</Link>
      </header>
      <section className="auth-layout">
        <div className="auth-copy">
          <div className="auth-kicker mono"><span className="live-dot" /> ACCESS GATE / OAUTH PROVIDER</div>
          <h1>ENTER<br /><em>THE LAB.</em></h1>
          <p>Sign in to save circuit scans, export correction reports, and build a learning profile from the mistakes you keep finding.</p>
          <div className="auth-signal-list">
            <div><Check size={14} /> PRIVATE SCAN HISTORY</div>
            <div><Check size={14} /> CORRECTION REPORTS</div>
            <div><Check size={14} /> PERSONAL LEARNING LOOP</div>
          </div>
        </div>
        <div className="auth-panel">
          <div className="auth-panel-head mono"><span>AUTH / 01</span><span>SECURE HANDSHAKE</span></div>
          {user ? (
            <div className="auth-success"><ShieldCheck size={30} /><span className="mono">SESSION ACTIVE</span><h2>WELCOME<br /><em>{user.name || "BACK"}.</em></h2><p>You are already signed in to CircuitSight AI.</p><Link className="button button-acid button-large" href="/">ENTER THE LAB <ArrowUpRight size={17} /></Link></div>
          ) : (
            <div className="auth-form">
              <span className="auth-form-label mono">SIGN IN / SIGN UP</span>
              <h2>ONE SIGNAL.<br /><em>ONE ACCOUNT.</em></h2>
              <p>Use the configured secure sign-in provider to continue. Your account keeps your scan history and learning progress together.</p>
              <button className={`google-button ${isRedirecting ? "is-redirecting" : ""}`} onClick={handleLogin} disabled={loading || isRedirecting} aria-busy={loading || isRedirecting}>
                {loading ? <Loader2 className="spin" size={18} /> : <span className="google-g">G</span>}
                <span>{loading || isRedirecting ? "OPENING SECURE GATE..." : "CONTINUE TO SECURE SIGN-IN"}</span>
                {!loading && <ArrowUpRight size={16} />}
              </button>
              {error && <div className="auth-error" role="alert"><strong>HANDSHAKE FAILED</strong><span>We could not complete the sign-in request. Try again or return to the lab.</span></div>}
              <div className="auth-legal mono">BY CONTINUING, YOU AGREE TO USE CIRCUITSIGHT FOR LEARNING, DEBUGGING, AND RESPONSIBLE HARDWARE TESTING.</div>
            </div>
          )}
        </div>
      </section>
      <div className="marquee marquee-yellow"><div>CONNECT <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b> CONNECT <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b></div></div>
    </main>
  );
}
