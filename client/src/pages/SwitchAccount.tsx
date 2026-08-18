import React, { useEffect } from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { useAuth } from "@/_core/hooks/useAuth";
import { ArrowUpRight, LogOut, UserRound } from "lucide-react";
import { Link, useLocation } from "wouter";

export default function SwitchAccount() {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  useEffect(() => { if (!user) setLocation("/auth"); }, [setLocation, user]);
  return <AccountPageFrame kicker="IDK / ACCOUNT MANAGEMENT" title={<>SWITCH<br /><em>SIGNAL.</em></>} description="This session supports one active OAuth account at a time. IDK will not pretend that multiple accounts are available simultaneously.">
    <section className="switch-account-card"><div className="switch-account-current"><UserRound size={22} /><div><span className="mono">CURRENT ACCOUNT</span><strong>{user?.name || "LAB USER"}</strong><small>{user?.email || "SIGNED-IN ACCOUNT"}</small></div></div><p>To use another account, sign out of this session first. Your saved circuit analyses remain stored with the current account and are not deleted by logout.</p><div className="switch-account-actions"><button className="button button-acid button-large" type="button" onClick={() => { logout(); setLocation("/auth"); }}><LogOut size={17} /> LOG OUT & SWITCH <ArrowUpRight size={16} /></button><Link className="button button-outline button-large" href="/workspace">KEEP THIS ACCOUNT</Link></div></section>
  </AccountPageFrame>;
}
