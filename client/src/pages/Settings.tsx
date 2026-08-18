import React from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { useTheme } from "@/contexts/ThemeContext";
import { Link } from "wouter";
import { ArrowUpRight, MonitorCog, SlidersHorizontal } from "lucide-react";

export default function Settings() {
  const { preference, highContrast } = useTheme();
  return <AccountPageFrame kicker="IDK / SETTINGS" title={<>SET THE<br /><em>WORKBENCH.</em></>} description="Review the application preferences that shape your IDK workspace. Controls with account impact are linked to real flows; local appearance state stays on this device.">
    <div className="settings-grid">
      <section className="settings-card"><div className="settings-card-head"><MonitorCog size={19} /><span className="mono">APPEARANCE</span></div><h2>VISUAL SIGNAL</h2><p>Current theme preference: <strong>{preference.toUpperCase()}</strong>. High contrast: <strong>{highContrast ? "ON" : "OFF"}</strong>.</p><Link className="button button-outline" href="/visual-signal">OPEN VISUAL SIGNAL <ArrowUpRight size={15} /></Link></section>
      <section className="settings-card"><div className="settings-card-head"><SlidersHorizontal size={19} /><span className="mono">ANALYSIS / AI</span></div><h2>KERNEL BEHAVIOR</h2><p>Explanation depth, response style, technical vocabulary, visual guidance, and improvement suggestions are managed in Personalization.</p><Link className="button button-outline" href="/personalization">TUNE THE KERNEL <ArrowUpRight size={15} /></Link></section>
      {[
        ["NOTIFICATIONS", "Notification settings are not connected to a delivery channel in this account yet."],
        ["LANGUAGE", "IDK currently operates in English. Language selection will appear when localized response support is available."],
        ["PRIVACY", "Circuit images and analyses remain scoped to your authenticated workspace. Do not upload sensitive personal information."],
        ["ACCOUNT", "Profile identity is supplied by secure OAuth. Review account details or switch the active session from the account menu."]
      ].map(([label, copy]) => <section className="settings-card" key={label}><span className="mono">{label}</span><p>{copy}</p>{label === "ACCOUNT" && <Link className="text-link" href="/profile">VIEW PROFILE <ArrowUpRight size={15} /></Link>}</section>)}
    </div>
  </AccountPageFrame>;
}
