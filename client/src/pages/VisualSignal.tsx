import React from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { useTheme, type Palette } from "@/contexts/ThemeContext";
import { ArrowUpRight, Check, Contrast, Moon, Monitor, Palette as PaletteIcon, Sun } from "lucide-react";
import { Link } from "wouter";

const palettes: Array<{ id: Palette; name: string; detail: string; dark: string; light: string }> = [
  { id: "lavender", name: "BLACK / LAVENDER", detail: "Default diagnostic signal", dark: "#000000", light: "#C4B5FD" },
  { id: "cyan", name: "BLACK / CYAN", detail: "Cool instrumentation", dark: "#000000", light: "#67E8F9" },
  { id: "amber", name: "BLACK / AMBER", detail: "Bench warning signal", dark: "#000000", light: "#FBBF24" },
  { id: "mint", name: "BLACK / MINT", detail: "Low-noise learning signal", dark: "#000000", light: "#86EFAC" },
];

export default function VisualSignal() {
  const { theme, preference, setPreference, palette, setPalette, highContrast, toggleHighContrast } = useTheme();
  return <AccountPageFrame kicker="IDK / VISUAL SIGNAL" title={<>TUNE THE<br /><em>SIGNAL.</em></>} description="Choose how IDK’s interface reads on your screen. Palette changes are local to this account session and persist on this device; they do not change circuit-analysis conclusions.">
    <div className="visual-signal-layout">
      <section className="visual-signal-card visual-signal-mode"><div className="visual-signal-heading"><Monitor size={20} /><span className="mono">01 / MODE</span></div><h2>LIGHT, DARK, OR SYSTEM.</h2><p>Choose the surface mode independently from the accent palette. Current mode: <strong>{preference.toUpperCase()}</strong> / rendered <strong>{theme.toUpperCase()}</strong>.</p><div className="visual-signal-mode-grid"><button type="button" aria-pressed={preference === "light"} onClick={() => setPreference("light")}><Sun size={16} /> LIGHT {preference === "light" && <Check size={14} />}</button><button type="button" aria-pressed={preference === "dark"} onClick={() => setPreference("dark")}><Moon size={16} /> DARK {preference === "dark" && <Check size={14} />}</button><button type="button" aria-pressed={preference === "system"} onClick={() => setPreference("system")}><Monitor size={16} /> SYSTEM {preference === "system" && <Check size={14} />}</button></div></section>
      <section className="visual-signal-card"><div className="visual-signal-heading"><PaletteIcon size={20} /><span className="mono">02 / PALETTE</span></div><h2>CHOOSE YOUR SIGNAL.</h2><p>The accent appears on focus states, findings, controls, and navigation markers.</p><div className="palette-grid">{palettes.map(item => <button type="button" key={item.id} className={`palette-choice palette-choice-${item.id}`} aria-pressed={palette === item.id} onClick={() => setPalette(item.id)}><span className="palette-swatch" style={{ background: item.light, color: item.dark }}><span>V</span></span><span><strong>{item.name}</strong><small>{item.detail}</small></span>{palette === item.id && <Check size={15} />}</button>)}</div></section>
      <section className="visual-signal-card visual-signal-wide"><div className="visual-signal-heading"><Contrast size={20} /><span className="mono">03 / READABILITY</span></div><h2>HIGH CONTRAST IS A SIGNAL, TOO.</h2><p>Increase border, focus, and text separation when you need a stronger read. This preference remains available from this page and the Home appearance menu.</p><button className="button button-outline" type="button" aria-pressed={highContrast} onClick={toggleHighContrast}>{highContrast ? "DISABLE HIGH CONTRAST" : "ENABLE HIGH CONTRAST"} <ArrowUpRight size={15} /></button></section>
      <div className="visual-signal-footer"><Link className="text-link" href="/settings">RETURN TO SETTINGS <ArrowUpRight size={15} /></Link><Link className="text-link" href="/personalization">TUNE KERNEL BEHAVIOUR <ArrowUpRight size={15} /></Link></div>
    </div>
  </AccountPageFrame>;
}
