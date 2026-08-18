import React, { useEffect } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import AccountMenu from "./AccountMenu";

type AccountPageFrameProps = {
  kicker: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
};

export default function AccountPageFrame({ kicker, title, description, children }: AccountPageFrameProps) {
  const { user, loading } = useAuth();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!loading && !user) setLocation("/auth");
  }, [loading, setLocation, user]);

  if (loading) return <main className="dashboard-page dashboard-loading"><div className="dashboard-loader"><Loader2 className="spin" size={30} /><span className="mono">CHECKING SESSION / IDK</span><strong>OPENING<br /><em>ACCOUNT.</em></strong></div></main>;
  if (!user) return null;

  return (
    <main className="account-page site-shell">
      <header className="topbar account-topbar">
        <Link href="/workspace" className="brand" aria-label="Return to IDK workspace"><span className="workspace-mark">I</span><span>IDK <i>INTELLIGENT DIAGNOSTIC KERNEL</i></span></Link>
        <nav className="account-topnav" aria-label="Account navigation"><Link href="/workspace">WORKSPACE</Link><Link href="/dashboard">DASHBOARD</Link><Link href="/help">HELP</Link></nav>
        <AccountMenu compact />
      </header>
      <section className="account-hero"><div className="dashboard-kicker mono"><span className="live-dot" /> {kicker}</div><h1>{title}</h1><p>{description}</p><Link className="text-link" href="/workspace">RETURN TO WORKSPACE <ArrowUpRight size={16} /></Link></section>
      <section className="account-content">{children}</section>
    </main>
  );
}
