/* Kinetic Circuit Brutalism: authenticated landing surface with explicit session loading, success signal, and lab controls. */
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { ArrowUpRight, CircleUserRound, Loader2, LogOut, ScanLine } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation } from "wouter";
import { toast } from "sonner";

const markImage = "/manus-storage/circuitsight-mark_2688ce17.png";

export default function Dashboard() {
  const { user, loading, error, logout } = useAuth();
  const [, setLocation] = useLocation();
  const { data: threads = [] } = trpc.circuit.listThreads.useQuery(undefined, { enabled: Boolean(user?.emailVerified) });

  useEffect(() => {
    if (loading) return;
    if (!user || !user.emailVerified) {
      setLocation("/auth");
      return;
    }

    const pending = sessionStorage.getItem("circuitsight:auth-pending");
    if (pending === "1") {
      sessionStorage.removeItem("circuitsight:auth-pending");
      toast.success("SIGNAL CONNECTED", {
        description: "Your CircuitSight lab session is ready.",
        duration: 4200,
      });
    }
  }, [loading, setLocation, user]);

  if (loading) {
    return <main className="dashboard-page dashboard-loading"><div className="dashboard-loader"><Loader2 className="spin" size={30} /><span className="mono">VERIFYING SESSION / 01</span><strong>CONNECTING<br /><em>THE LAB.</em></strong></div></main>;
  }

  if (error) {
    return <main className="dashboard-page dashboard-loading"><div className="dashboard-loader"><span className="dashboard-error mono">SESSION HANDSHAKE FAILED</span><strong>ROUTE<br /><em>SIGNAL LOST.</em></strong><Link className="button button-acid" href="/auth">RETURN TO SIGN IN <ArrowUpRight size={16} /></Link></div></main>;
  }

  if (!user || !user.emailVerified) return null;

  return (
    <main className="site-shell dashboard-page">
      <header className="topbar dashboard-topbar">
        <Link href="/" className="brand" aria-label="CircuitSight AI home"><img src={markImage} alt="" className="brand-mark" /><span>CIRCUITSIGHT <i>AI</i></span></Link>
        <div className="dashboard-user"><CircleUserRound size={16} /><span>{user.name || user.email || "LAB USER"}</span><button onClick={() => logout()} aria-label="Sign out"><LogOut size={15} /></button></div>
      </header>
      <section className="dashboard-hero">
        <div className="dashboard-kicker mono"><span className="live-dot" /> SESSION ACTIVE / DASHBOARD</div>
        <h1>WELCOME<br /><em>{user.name ? user.name.split(" ")[0].toUpperCase() : "BACK"}.</em></h1>
        <p>Your lab is ready. Start a new scan, inspect your correction history, or keep building the signal.</p>
        <div className="dashboard-actions"><Link className="button button-acid button-large" href="/workspace"><ScanLine size={18} /> START A SCAN <ArrowUpRight size={17} /></Link><Link className="text-link" href="/">RETURN TO HOME <ArrowUpRight size={17} /></Link></div>
      </section>
      <section className="dashboard-grid"><article className="dashboard-card dashboard-card-acid"><span className="mono">01 / NEW INPUT</span><h2>SCAN<br />A CIRCUIT.</h2><Link href="/workspace" aria-label="Start a new scan"><ArrowUpRight size={24} /></Link></article><article className="dashboard-card"><span className="mono">02 / YOUR SIGNALS</span><strong>{String(threads.length).padStart(2, "0")}</strong><h3>SAVED ANALYSES</h3><p>{threads.length ? "Your verified account has saved circuit analyses ready to reopen." : "No saved analyses yet. Your first submitted circuit will appear here."}</p></article><article className="dashboard-card"><span className="mono">03 / LEARNING LOOP</span><strong>—</strong><h3>LEARNING PATTERNS</h3><p>Patterns are calculated only after you submit real circuit analyses.</p></article></section>
      <div className="marquee marquee-yellow"><div>SESSION ACTIVE <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b> SESSION ACTIVE <b>•</b> SAVE THE SIGNAL <b>•</b> KEEP THE LESSON <b>•</b></div></div>
    </main>
  );
}
