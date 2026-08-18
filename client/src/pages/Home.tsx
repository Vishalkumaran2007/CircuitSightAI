/* Kinetic Circuit Brutalism: asymmetric editorial layout, acid signal actions, hard borders, candid confidence states. */
import { useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Download, Menu, ScanLine, Upload, X, Zap } from "lucide-react";

const heroImage = "/manus-storage/circuitsight-hero_3e01ea1e.png";
const scannerImage = "/manus-storage/circuitsight-scanner_401035d5.png";
const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";

const steps = [
  { no: "01", title: "CAPTURE", body: "Photograph or upload the physical circuit. A top-down angle gives the clearest read." },
  { no: "02", title: "ANALYZE", body: "AI maps visible components, traces connections, and attaches a confidence score to every finding." },
  { no: "03", title: "DEBUG", body: "See the suspected fault, understand why it matters, and compare the path against your reference." },
  { no: "04", title: "LEARN", body: "Turn each mistake into a lesson. CircuitSight remembers patterns so your next build gets sharper." },
];

const findings = [
  { label: "LED DETECTED", value: "98%", tone: "verified" },
  { label: "RESISTOR DETECTED", value: "96%", tone: "verified" },
  { label: "GROUND CONNECTION", value: "91%", tone: "verified" },
  { label: "WIRE PATH", value: "73%", tone: "warning" },
];

const teamCredits = [
  { number: "01", name: "SANKARPRASATH S", role: "IDEA & CONCEPT", responsibility: "Originated the core idea behind CircuitSight AI; defined the initial problem statement and project concept; contributed to the project's vision and direction." },
  { number: "02", name: "ROHINI S", role: "UI/UX DESIGN", responsibility: "UI/UX selection and design direction; visual design decisions; user experience and interface planning." },
  { number: "03", name: "VISHALKUMARAN V", role: "DEVELOPER", responsibility: "Full-stack development and technical implementation; AI integration and application architecture; circuit analysis workflow and platform development.", href: "https://vishalkumaran2007.github.io/Portfolio/" },
  { number: "04", name: "SAYASREE T K", role: "R&D & PITCHING", responsibility: "Research and development work; project research and concept validation; pitch preparation and presentation strategy." },
];

function downloadCorrectionReport() {
  const generatedAt = new Date().toLocaleString();
  const findingsMarkup = findings.map((item) => `<tr><td>${item.label}</td><td>${item.value}</td><td>${item.tone === "warning" ? "UNCERTAIN" : "VERIFIED"}</td></tr>`).join("");
  const report = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>CircuitSight AI Correction Report</title><style>body{background:#09090b;color:#fafafa;font:16px Arial,sans-serif;max-width:820px;margin:0 auto;padding:48px}h1{font-size:48px;line-height:.95;letter-spacing:-.06em;margin:12px 0 28px}h1 span{color:#dfe104}h2{border-top:2px solid #3f3f46;padding-top:18px;margin-top:44px;font-size:18px;letter-spacing:.08em}p{color:#c4c4c9;line-height:1.55}.meta{color:#a1a1aa;font:12px monospace;letter-spacing:.08em}.score{font:700 64px monospace;color:#dfe104;margin:18px 0}table{border-collapse:collapse;width:100%;margin-top:18px}td{border-bottom:1px solid #3f3f46;padding:14px 8px;text-align:left}td:last-child{color:#dfe104;font-family:monospace}.warning{border-left:4px solid #f5b83d;padding:14px 18px;background:#17171a;color:#f5b83d}.footer{border-top:2px solid #3f3f46;margin-top:54px;padding-top:18px;color:#a1a1aa;font:11px monospace}</style></head><body><div class="meta">CIRCUITSIGHT AI / CORRECTION REPORT</div><h1>SCAN <span>07</span><br>ANALYSIS.</h1><div class="meta">GENERATED ${generatedAt}</div><div class="score">92%</div><div class="meta">OVERALL CONFIDENCE</div><h2>DETECTED FINDINGS</h2><table><thead><tr><td>FINDING</td><td>CONFIDENCE</td><td>STATUS</td></tr></thead><tbody>${findingsMarkup}</tbody></table><h2>RECOMMENDED CORRECTION</h2><p>Inspect the visible wire path around the ground connection. Re-photograph the circuit from a top-down angle with all component labels and wire junctions visible before making a permanent correction.</p><div class="warning"><strong>UNCERTAINTY NOTICE</strong><br><br>Some connections cannot be verified confidently from this image. Treat the wire-path result as a lead for inspection, not a confirmed electrical fact.</div><h2>LEARNING NOTE</h2><p>Use this scan to practice tracing signal flow from source to ground. Confirm polarity, resistor placement, and continuity visually before powering the circuit.</p><div class="footer">POINT. SCAN. UNDERSTAND. CORRECT. / CIRCUITSIGHT AI</div></body></html>`;
  const blob = new Blob([report], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "circuitsight-correction-report.html";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function Home() {
  const { user, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "complete">("idle");
  const [routeTarget, setRouteTarget] = useState<"auth" | "workspace" | null>(null);
  const reduceMotion = useReducedMotion();

  const openWorkspace = () => {
    if (authLoading || routeTarget) return;
    const target = user?.emailVerified ? "workspace" : "auth";
    setRouteTarget(target);
    const destination = target === "workspace" ? "/workspace" : "/auth";
    window.setTimeout(() => setLocation(destination), reduceMotion ? 0 : 280);
  };

  const startScan = () => {
    setScanState("scanning");
    window.setTimeout(() => setScanState("complete"), 1400);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className={`site-shell ${routeTarget ? "is-routing" : ""}`}>
      {routeTarget && (
        <div className="route-transition" role="status" aria-live="polite">
          <div className="route-transition-grid" aria-hidden="true" />
          <span className="mono">SIGNAL PATH / {routeTarget === "workspace" ? "WORKSPACE" : "AUTH"}</span>
          <strong>{routeTarget === "workspace" ? "OPENING THE LAB." : "OPENING ACCESS GATE."}</strong>
          <div className="route-transition-meter" aria-hidden="true"><i /></div>
        </div>
      )}
      <div className="noise" aria-hidden="true" />
      <header className="topbar">
        <button className="brand" onClick={() => scrollTo("top")} aria-label="CircuitSight AI home">
          <img src={markImage} alt="" className="brand-mark" />
          <span>CIRCUITSIGHT <i>AI</i></span>
        </button>
        <nav className={`nav-links ${menuOpen ? "is-open" : ""}`} aria-label="Primary navigation">
          <button onClick={() => scrollTo("product")}>PRODUCT</button>
          <button onClick={() => scrollTo("how-it-works")}>HOW IT WORKS</button>
          <button onClick={() => scrollTo("lab")}>LAB</button>
          <button onClick={() => scrollTo("learning")}>LEARNING</button>
          <div className="mobile-nav-actions">
            <button className="nav-quiet" onClick={() => { window.location.href = "/auth"; }}>SIGN IN</button>
            <button className="button button-acid" onClick={openWorkspace} aria-disabled={authLoading}>START SCANNING <ArrowUpRight size={16} /></button>
          </div>
        </nav>
        <div className="nav-actions">
          <button className="nav-quiet" onClick={() => { window.location.href = "/auth"; }}>SIGN IN</button>
          <button className="button button-acid nav-cta" onClick={openWorkspace} aria-disabled={authLoading}>START SCANNING <ArrowUpRight size={16} /></button>
          <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu" aria-expanded={menuOpen}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-trace trace-one" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero-trace trace-two" aria-hidden="true"><span /><span /><span /></div>
        <div className="hero-copy">
          <p className="eyebrow"><span className="live-dot" /> COMPUTER VISION / ELECTRONICS LAB 01</p>
          <h1 id="hero-title">YOUR<br /><em>CIRCUIT</em><br />IS TALKING.</h1>
          <p className="hero-lede">Photograph your physical circuit. CircuitSight AI identifies components, traces visible connections, detects likely mistakes, explains the problem, and guides you toward the correct circuit.</p>
          <div className="hero-actions">
            <button className="button button-acid button-large" onClick={openWorkspace} aria-disabled={authLoading}>SCAN A CIRCUIT <ArrowUpRight size={19} /></button>
            <button className="text-link" onClick={() => scrollTo("how-it-works")}>SEE HOW IT WORKS <ArrowDownRight size={18} /></button>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroImage} alt="Top-down electronics circuit with an AI trace overlay" />
          <div className="hero-stamp"><span>READ<br />THE<br />SIGNAL</span><Zap size={18} /></div>
          <div className="hero-readout"><span>VISION STATUS</span><strong>READY</strong><small>CONFIDENCE MODEL / 01</small></div>
        </div>
        <div className="hero-index mono">01 / 04</div>
      </section>

      <div className="marquee marquee-yellow" aria-label="Product capabilities"><div>DETECT <b>•</b> TRACE <b>•</b> DEBUG <b>•</b> CORRECT <b>•</b> LEARN <b>•</b> DETECT <b>•</b> TRACE <b>•</b> DEBUG <b>•</b> CORRECT <b>•</b> LEARN <b>•</b></div></div>

      <section id="product" className="manifesto section-dark">
        <div className="section-kicker"><span>( 00 )</span><span>THE POINT</span><span>↓</span></div>
        <div className="manifesto-grid">
          <p className="manifesto-label mono">CIRCUITSIGHT / CORE PRINCIPLE</p>
          <h2>DON'T JUST<br /><span>TELL ME</span><br />IT'S WRONG.</h2>
          <div className="manifesto-note"><div className="signal-line" /><p>Show me where. Explain why. Teach me how to correct it.</p><small>— THE DIFFERENCE BETWEEN A WARNING AND A LESSON</small></div>
        </div>
      </section>

      <section id="how-it-works" className="process section-dark">
        <div className="section-kicker"><span>( 01 )</span><span>HOW IT WORKS</span><span>4 STAGES</span></div>
        <div className="process-head"><h2>FROM PHOTO<br /><i>TO UNDERSTANDING.</i></h2><p>Every read is a probability, not a promise. We show our work so you can make the final call.</p></div>
        <div className="step-list">{steps.map((step, index) => <motion.article className="step" key={step.no} initial={reduceMotion ? false : { opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ delay: index * 0.08 }}><span className="step-no mono">{step.no}</span><h3>{step.title}</h3><p>{step.body}</p><ChevronRight className="step-arrow" /></motion.article>)}</div>
      </section>

      <section id="lab" className="lab-section">
        <div className="section-kicker lab-kicker"><span>( 02 )</span><span>THE CIRCUIT LAB</span><span>SAMPLE CIRCUIT DEMO</span></div>
        <div className="lab-heading"><h2>POINT.<br />SCAN.<br /><i>UNDERSTAND.</i></h2><div className="lab-side-note"><span className="mono">SAMPLE CIRCUIT / NOT SAVED</span><p>This teaching sample shows how CircuitSight presents an analysis. It is not user data and is never saved to your account.</p><button className="button button-outline" onClick={startScan}><ScanLine size={17} /> {scanState === "idle" ? "RUN SAMPLE DEMO" : scanState === "scanning" ? "ANALYZING SAMPLE..." : "SAMPLE COMPLETE"}</button></div></div>
        <div className="scanner-frame">
          <div className="scanner-image"><img src={scannerImage} alt="Circuit board prepared for scanning" /><div className={`scan-beam ${scanState !== "idle" ? "active" : ""}`} /><div className="scan-target target-a" /><div className="scan-target target-b" /><div className="scan-target target-c" /><div className="image-label mono">INPUT / BREADBOARD_07.JPG</div></div>
          <aside className="analysis-panel"><div className="analysis-top"><span>SAMPLE ANALYSIS / DEMO</span><span className={`status ${scanState === "complete" ? "complete" : ""}`}><span />{scanState === "complete" ? "COMPLETE" : "READY"}</span></div><div className="confidence-block"><strong>{scanState === "complete" ? "92" : "86"}<sup>%</sup></strong><span>SAMPLE CONFIDENCE</span></div><div className="finding-list">{findings.map((item) => <div className="finding" key={item.label}><span><i className={`tone-${item.tone}`} />{item.label}</span><b className="mono">{item.value}</b></div>)}</div><div className="analysis-warning"><span className="warning-icon">!</span><div><strong>WIRE PATH / UNCERTAIN</strong><p>Sample output only. Submit your own photo in the workspace for a saved analysis.</p></div></div><button className="upload-row" onClick={openWorkspace}><Upload size={17} /><span>ANALYZE YOUR CIRCUIT</span><ArrowUpRight size={16} /></button><button className="report-row" onClick={downloadCorrectionReport} disabled={scanState !== "complete"}><Download size={17} /><span>{scanState === "complete" ? "DOWNLOAD SAMPLE REPORT" : "SAMPLE REPORT AVAILABLE AFTER DEMO"}</span><span className="mono">HTML</span></button></aside>
        </div>
      </section>

      <div className="marquee marquee-dark" aria-label="Analysis promise"><div>SCAN <b>•</b> ANALYZE <b>•</b> UNDERSTAND <b>•</b> CORRECT <b>•</b> LEARN <b>•</b> SCAN <b>•</b> ANALYZE <b>•</b> UNDERSTAND <b>•</b> CORRECT <b>•</b> LEARN <b>•</b></div></div>

      <section id="learning" className="learning section-dark"><div className="section-kicker"><span>( 03 )</span><span>THE LEARNING LOOP</span><span>BUILD / REPEAT</span></div><div className="learning-grid"><div><h2>THE MISTAKE<br />IS THE <i>TEACHER.</i></h2><p className="learning-lede">CircuitSight keeps a record of recurring mistakes — reversed polarity, floating grounds, missing resistors — and turns the pattern into a personal electronics learning profile.</p><button className="text-link" onClick={() => alert("Learning profile preview coming soon.")}>EXPLORE THE LEARNING LOOP <ArrowUpRight size={18} /></button></div><div className="learning-graphic"><div className="giant-number">03</div><div className="loop-node node-1">CAPTURE</div><div className="loop-node node-2">NOTICE</div><div className="loop-node node-3">CORRECT</div><div className="loop-node node-4">REMEMBER</div><svg viewBox="0 0 440 330" aria-hidden="true"><path d="M220 28 C370 28 410 100 370 180 C330 260 118 290 65 190 C12 90 105 26 220 28Z" /></svg></div></div></section>

      <section id="team" className="team-section" aria-labelledby="team-title"><div className="section-kicker"><span>( 04 )</span><span>TEAM / CREDITS</span><span>BUILT BY</span></div><div className="team-heading"><h2 id="team-title">THE <i>TEAM.</i></h2><p>Four distinct disciplines. One diagnostic signal.</p></div><div className="team-grid">{teamCredits.map((member) => { const card = <div className="team-card-inner"><span className="team-number mono">{member.number}</span><div className="team-card-heading"><h3>{member.name}</h3><span>{member.role}</span></div><p>{member.responsibility}</p><ArrowUpRight className="team-card-arrow" size={18} /></div>; return member.href ? <a className="team-card team-card-link" href={member.href} target="_blank" rel="noreferrer" key={member.number} aria-label={`Open ${member.name} portfolio`}>{card}</a> : <article className="team-card" key={member.number}>{card}</article>; })}</div><p className="team-footer mono">BUILT BY A TEAM OF ENGINEERS, DESIGNERS &amp; RESEARCHERS.</p></section>

      <footer className="footer"><div className="footer-brand"><img src={markImage} alt="" /><span>CIRCUITSIGHT <i>AI</i></span></div><p>POINT. SCAN. UNDERSTAND. CORRECT.</p><span className="mono">© 2026 / SIGNAL LAB</span></footer>
    </main>
  );
}
