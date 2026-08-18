/* Kinetic Circuit Brutalism: utility state uses dark lab ground, monospaced diagnostics, acid signal action, and PCB trace geometry. */
import { ArrowUpRight, Home, ScanLine } from "lucide-react";
import { Link } from "wouter";

const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";

export default function NotFound() {
  return (
    <main className="site-shell diagnostic-page">
      <header className="topbar">
        <Link href="/" className="brand" aria-label="Return to CircuitSight AI home">
          <img src={markImage} alt="" className="brand-mark" />
          <span>CIRCUITSIGHT <i>AI</i></span>
        </Link>
        <span className="mono diagnostic-header">ROUTE MONITOR / 404</span>
      </header>
      <section className="diagnostic-state" aria-labelledby="diagnostic-title">
        <div className="diagnostic-trace trace-left" aria-hidden="true"><span /><span /><span /></div>
        <div className="diagnostic-trace trace-right" aria-hidden="true"><span /><span /><span /></div>
        <div className="diagnostic-meta mono"><span><i className="live-dot" /> SIGNAL LOST</span><span>CONFIDENCE / 00%</span></div>
        <div className="diagnostic-content">
          <span className="diagnostic-code mono">ERR_ROUTE_NOT_FOUND / 404</span>
          <h1 id="diagnostic-title">ROUTE<br /><em>SIGNAL</em><br />LOST.</h1>
          <p>The requested path could not be traced through the CircuitSight system. Return to the scan field and pick up the signal again.</p>
          <Link className="button button-acid button-large" href="/"><Home size={17} /> RETURN TO SCAN <ArrowUpRight size={17} /></Link>
        </div>
        <div className="diagnostic-panel">
          <div className="diagnostic-panel-head mono"><span><ScanLine size={15} /> TRACE REPORT</span><span>01 / 01</span></div>
          <div className="diagnostic-readout"><strong>404</strong><span>NO VISIBLE CONNECTION</span></div>
          <div className="diagnostic-rule"><span /><span /> <span /></div>
          <p className="mono">The system can analyze what it can see. This route is outside the current frame.</p>
        </div>
      </section>
      <div className="marquee marquee-yellow"><div>RETURN TO SCAN <b>•</b> TRACE THE SIGNAL <b>•</b> PICK UP THE THREAD <b>•</b> RETURN TO SCAN <b>•</b> TRACE THE SIGNAL <b>•</b> PICK UP THE THREAD <b>•</b></div></div>
    </main>
  );
}
