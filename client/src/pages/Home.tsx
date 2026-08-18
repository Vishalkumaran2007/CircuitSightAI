/* Kinetic Circuit Brutalism: asymmetric editorial layout, acid signal actions, hard borders, candid confidence states. */
import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, ChevronRight, Menu, ScanLine, Upload, X, Zap } from "lucide-react";

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

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scanState, setScanState] = useState<"idle" | "scanning" | "complete">("idle");
  const reduceMotion = useReducedMotion();

  const startScan = () => {
    setScanState("scanning");
    window.setTimeout(() => setScanState("complete"), 1400);
  };

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="site-shell">
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
            <button className="nav-quiet" onClick={() => alert("Sign in is coming soon.")}>SIGN IN</button>
            <button className="button button-acid" onClick={() => scrollTo("lab")}>START SCANNING <ArrowUpRight size={16} /></button>
          </div>
        </nav>
        <div className="nav-actions">
          <button className="nav-quiet" onClick={() => alert("Sign in is coming soon.")}>SIGN IN</button>
          <button className="button button-acid nav-cta" onClick={() => scrollTo("lab")}>START SCANNING <ArrowUpRight size={16} /></button>
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
            <button className="button button-acid button-large" onClick={() => scrollTo("lab")}>SCAN A CIRCUIT <ArrowUpRight size={19} /></button>
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
        <div className="section-kicker lab-kicker"><span>( 02 )</span><span>THE CIRCUIT LAB</span><span>LIVE PREVIEW</span></div>
        <div className="lab-heading"><h2>POINT.<br />SCAN.<br /><i>UNDERSTAND.</i></h2><div className="lab-side-note"><span className="mono">SCAN / 0007</span><p>Upload a circuit to see how the system turns visible hardware into a readable explanation.</p><button className="button button-outline" onClick={startScan}><ScanLine size={17} /> {scanState === "idle" ? "RUN DEMO SCAN" : scanState === "scanning" ? "ANALYZING..." : "SCAN COMPLETE"}</button></div></div>
        <div className="scanner-frame">
          <div className="scanner-image"><img src={scannerImage} alt="Circuit board prepared for scanning" /><div className={`scan-beam ${scanState !== "idle" ? "active" : ""}`} /><div className="scan-target target-a" /><div className="scan-target target-b" /><div className="scan-target target-c" /><div className="image-label mono">INPUT / BREADBOARD_07.JPG</div></div>
          <aside className="analysis-panel"><div className="analysis-top"><span>ANALYSIS</span><span className={`status ${scanState === "complete" ? "complete" : ""}`}><span />{scanState === "complete" ? "COMPLETE" : "READY"}</span></div><div className="confidence-block"><strong>{scanState === "complete" ? "92" : "86"}<sup>%</sup></strong><span>OVERALL CONFIDENCE</span></div><div className="finding-list">{findings.map((item) => <div className="finding" key={item.label}><span><i className={`tone-${item.tone}`} />{item.label}</span><b className="mono">{item.value}</b></div>)}</div><div className="analysis-warning"><span className="warning-icon">!</span><div><strong>WIRE PATH / UNCERTAIN</strong><p>Some connections cannot be verified confidently from this image. Retake from top-down with labels visible.</p></div></div><button className="upload-row" onClick={startScan}><Upload size={17} /><span>UPLOAD REFERENCE CIRCUIT</span><ArrowUpRight size={16} /></button></aside>
        </div>
      </section>

      <div className="marquee marquee-dark" aria-label="Analysis promise"><div>SCAN <b>•</b> ANALYZE <b>•</b> UNDERSTAND <b>•</b> CORRECT <b>•</b> LEARN <b>•</b> SCAN <b>•</b> ANALYZE <b>•</b> UNDERSTAND <b>•</b> CORRECT <b>•</b> LEARN <b>•</b></div></div>

      <section id="learning" className="learning section-dark"><div className="section-kicker"><span>( 03 )</span><span>THE LEARNING LOOP</span><span>BUILD / REPEAT</span></div><div className="learning-grid"><div><h2>THE MISTAKE<br />IS THE <i>TEACHER.</i></h2><p className="learning-lede">CircuitSight keeps a record of recurring mistakes — reversed polarity, floating grounds, missing resistors — and turns the pattern into a personal electronics learning profile.</p><button className="text-link" onClick={() => alert("Learning profile preview coming soon.")}>EXPLORE THE LEARNING LOOP <ArrowUpRight size={18} /></button></div><div className="learning-graphic"><div className="giant-number">03</div><div className="loop-node node-1">CAPTURE</div><div className="loop-node node-2">NOTICE</div><div className="loop-node node-3">CORRECT</div><div className="loop-node node-4">REMEMBER</div><svg viewBox="0 0 440 330" aria-hidden="true"><path d="M220 28 C370 28 410 100 370 180 C330 260 118 290 65 190 C12 90 105 26 220 28Z" /></svg></div></div></section>

      <footer className="footer"><div className="footer-brand"><img src={markImage} alt="" /><span>CIRCUITSIGHT <i>AI</i></span></div><p>POINT. SCAN. UNDERSTAND. CORRECT.</p><span className="mono">© 2026 / SIGNAL LAB</span></footer>
    </main>
  );
}
