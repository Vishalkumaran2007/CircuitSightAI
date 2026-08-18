import React from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowLeft, ArrowUpRight, BrainCircuit, CircleDot, LockKeyhole, ScanLine, Signal, Target } from "lucide-react";
import { Link, useLocation } from "wouter";

const loopStages = [
  { number: "01", label: "CAPTURE", detail: "Submit a real circuit photo and the question behind the build.", icon: ScanLine },
  { number: "02", label: "NOTICE", detail: "Separate visible evidence from uncertain wire paths and assumptions.", icon: Target },
  { number: "03", label: "CORRECT", detail: "Trace the recommended inspection path before changing the circuit.", icon: Signal },
  { number: "04", label: "REMEMBER", detail: "Your saved analyses become a private reference for the next build.", icon: BrainCircuit },
];

export default function Learning() {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();
  const isSignedIn = Boolean(user);

  return (
    <main className="learning-page site-shell">
      <header className="learning-topbar">
        <Link href="/" className="learning-brand"><span className="brand-dot" /> CIRCUITSIGHT <i>AI</i></Link>
        <nav className="learning-nav" aria-label="Learning navigation">
          <Link href="/">HOME</Link>
          <Link href="/workspace">WORKSPACE</Link>
          {isSignedIn ? <Link href="/dashboard">DASHBOARD</Link> : <Link href="/auth">SIGN IN</Link>}
        </nav>
      </header>

      <section className="learning-hero">
        <div className="learning-hero-copy">
          <span className="section-kicker"><span>( 03 )</span><span>THE LEARNING LOOP</span><span>BUILD / REPEAT</span></span>
          <p className="mono learning-eyebrow">PATTERN RECOGNITION / PERSONAL ELECTRONICS PROFILE</p>
          <h1>THE MISTAKE<br />IS THE <em>TEACHER.</em></h1>
          <p className="learning-hero-lede">CircuitSight turns every real scan into a sharper next attempt. Not a score. Not a streak. A record of what your circuit showed, what remained uncertain, and what to inspect next.</p>
          <div className="learning-hero-actions">
            <button type="button" className="button button-acid" onClick={() => setLocation(isSignedIn ? "/workspace" : "/auth")}><ScanLine size={17} /> {isSignedIn ? "RUN A NEW SCAN" : "SIGN IN TO START"} <ArrowUpRight size={16} /></button>
            <Link href="/" className="text-link"><ArrowLeft size={16} /> RETURN HOME</Link>
          </div>
        </div>
        <div className="learning-orbit" aria-label="Learning Loop stages">
          <div className="orbit-status mono"><span className="live-dot" /> LOOP STATUS / {loading ? "SYNCING" : isSignedIn ? "READY TO COLLECT" : "AWAITING SIGNAL"}</div>
          <div className="orbit-core"><CircleDot size={30} /><strong>TRACE<br /><i>THE PATTERN.</i></strong></div>
          <div className="orbit-ring orbit-ring-a" />
          <div className="orbit-ring orbit-ring-b" />
          <span className="orbit-label orbit-label-a">CAPTURE</span><span className="orbit-label orbit-label-b">NOTICE</span><span className="orbit-label orbit-label-c">CORRECT</span><span className="orbit-label orbit-label-d">REMEMBER</span>
        </div>
      </section>

      <section className="learning-loop-grid">
        <div className="learning-section-title"><span className="mono">HOW THE SIGNAL BECOMES A LESSON</span><h2>FOUR MOVES.<br /><em>ONE SHARPER BUILD.</em></h2></div>
        <div className="learning-stage-list">{loopStages.map(({ number, label, detail, icon: Icon }) => <article className="learning-stage" key={number}><span className="stage-number mono">{number}</span><Icon size={21} /><div><h3>{label}</h3><p>{detail}</p></div><ArrowUpRight size={16} /></article>)}</div>
      </section>

      <section className="learning-profile-panel">
        <div className="profile-panel-heading"><div><span className="mono">YOUR LEARNING PROFILE</span><h2>{loading ? "SIGNAL SYNCING." : isSignedIn ? "SIGNAL READY." : "SIGNAL WAITING."}</h2></div><span className="profile-lock mono">{loading ? "SYNCING / CHECKING SESSION" : isSignedIn ? "PRIVATE / ACTIVE" : <><LockKeyhole size={13} /> SIGN-IN REQUIRED</>}</span></div>
        {loading ? <div className="profile-empty profile-syncing"><div className="profile-empty-mark"><Signal size={24} /></div><div><strong>CHECKING YOUR SIGNAL.</strong><p>CircuitSight is confirming whether a private learning profile is available. Your saved-analysis state will appear when the session check completes.</p></div></div> : isSignedIn ? <div className="profile-empty"><div className="profile-empty-mark"><BrainCircuit size={24} /></div><div><strong>NO SAVED PATTERNS YET.</strong><p>Your profile will surface recurring observations after you submit real circuit analyses. Sample demonstrations never enter this record.</p></div><button type="button" className="text-link" onClick={() => setLocation("/workspace")}>OPEN WORKSPACE <ArrowUpRight size={16} /></button></div> : <div className="profile-empty"><div className="profile-empty-mark"><LockKeyhole size={24} /></div><div><strong>YOUR PROFILE IS PRIVATE BY DESIGN.</strong><p>Sign in to save analyses, notice recurring circuit mistakes, and build a learning record from your own work.</p></div><Link href="/auth" className="text-link">SIGN IN / SIGN UP <ArrowUpRight size={16} /></Link></div>}
      </section>

      <footer className="footer learning-footer"><div className="footer-brand"><span className="brand-dot" /> <span>CIRCUITSIGHT <i>AI</i></span></div><p>POINT. SCAN. UNDERSTAND. CORRECT.</p><span className="mono">© 2026 / SIGNAL LAB</span></footer>
    </main>
  );
}
