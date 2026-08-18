import React from "react";
import AccountPageFrame from "@/components/AccountPageFrame";
import { useTheme, type Palette } from "@/contexts/ThemeContext";
import { ArrowUpRight, Check, Contrast, Moon, Monitor, Palette as PaletteIcon, Sun } from "lucide-react";
import { Link } from "wouter";

type ThemeOption = { id: Palette; name: string; combination: string; primary: string; secondary: string; description: string };

const themes: ThemeOption[] = [
  { id: "obsidian", name: "OBSIDIAN", combination: "Black + White", primary: "#09090B", secondary: "#FAFAFA", description: "The original high-contrast IDK workspace." },
  { id: "lavender", name: "LAVENDER", combination: "Black + Lavender", primary: "#09090B", secondary: "#C4B5FD", description: "Technical precision with a softer accent." },
  { id: "electric", name: "ELECTRIC", combination: "Blue + Black", primary: "#0B1F3A", secondary: "#38BDF8", description: "High-energy engineering interface with an electric blue signal." },
  { id: "midnight", name: "MIDNIGHT", combination: "Navy + White", primary: "#0F172A", secondary: "#F8FAFC", description: "Deep technical workspace with a clean interface." },
  { id: "terminal", name: "TERMINAL", combination: "Black + Green", primary: "#09090B", secondary: "#4ADE80", description: "Classic diagnostic and engineering-console aesthetic." },
  { id: "volt", name: "VOLT", combination: "Black + Electric Yellow", primary: "#09090B", secondary: "#E8F000", description: "High-voltage visual language for circuit analysis." },
  { id: "cyber", name: "CYBER", combination: "Black + Cyan", primary: "#09090B", secondary: "#22D3EE", description: "Futuristic instrumentation-inspired interface." },
  { id: "plasma", name: "PLASMA", combination: "Black + Purple", primary: "#09090B", secondary: "#A855F7", description: "Bold technical interface with a deep purple signal." },
  { id: "ocean", name: "OCEAN", combination: "Deep Blue + Light Blue", primary: "#082F49", secondary: "#7DD3FC", description: "Calm but technical engineering workspace." },
  { id: "circuit", name: "CIRCUIT", combination: "Dark Green + White", primary: "#052E16", secondary: "#F0FDF4", description: "Inspired by PCB traces and electronics hardware." },
  { id: "signal", name: "SIGNAL", combination: "White + Red", primary: "#FAFAFA", secondary: "#DC2626", description: "Strong visual warnings and diagnostic emphasis." },
  { id: "graphite", name: "GRAPHITE", combination: "Dark Gray + White", primary: "#27272A", secondary: "#FAFAFA", description: "Softer than pure black while maintaining strong contrast." },
  { id: "ice", name: "ICE", combination: "White + Blue", primary: "#FAFAFA", secondary: "#2563EB", description: "Clean, bright engineering workspace." },
  { id: "sunset", name: "SUNSET", combination: "Black + Orange", primary: "#09090B", secondary: "#FB923C", description: "Warm diagnostic signal with strong contrast." },
  { id: "rose", name: "ROSE", combination: "Black + Pink", primary: "#09090B", secondary: "#F472B6", description: "Technical interface with a distinctive modern accent." },
  { id: "mono", name: "MONO", combination: "White + Black", primary: "#FAFAFA", secondary: "#09090B", description: "Minimal monochrome workspace." },
];

export default function VisualSignal() {
  const { theme, preference, setPreference, palette, setPalette, highContrast, toggleHighContrast } = useTheme();

  return <AccountPageFrame kicker="IDK / VISUAL SIGNAL" title={<>VISUAL<br /><em>SIGNAL.</em></>} description="Choose the visual language of your IDK workspace.">
    <Link className="visual-signal-back text-link" href="/settings">← BACK TO SETTINGS</Link>
    <div className="visual-signal-layout">
      <section className="visual-signal-card visual-signal-mode"><div className="visual-signal-heading"><Monitor size={20} /><span className="mono">01 / MODE</span></div><h2>LIGHT, DARK, OR SYSTEM.</h2><p>Choose the surface mode independently from the color signal. Current mode: <strong>{preference.toUpperCase()}</strong> / rendered <strong>{theme.toUpperCase()}</strong>.</p><div className="visual-signal-mode-grid"><button type="button" aria-pressed={preference === "light"} onClick={() => setPreference("light")}><Sun size={16} /> LIGHT {preference === "light" && <Check size={14} />}</button><button type="button" aria-pressed={preference === "dark"} onClick={() => setPreference("dark")}><Moon size={16} /> DARK {preference === "dark" && <Check size={14} />}</button><button type="button" aria-pressed={preference === "system"} onClick={() => setPreference("system")}><Monitor size={16} /> SYSTEM {preference === "system" && <Check size={14} />}</button></div></section>
      <section className="visual-signal-card visual-signal-wide"><div className="visual-signal-heading"><PaletteIcon size={20} /><span className="mono">02 / COLOR SIGNAL</span></div><h2>CHOOSE YOUR SIGNAL.</h2><p>Select a color combination for your IDK workspace. Theme changes apply immediately and persist on this device.</p><div className="palette-grid">{themes.map((item, index) => <button type="button" key={item.id} className={`palette-choice palette-choice-${item.id}`} aria-pressed={palette === item.id} aria-label={`Select ${item.name}, ${item.combination}`} onClick={() => setPalette(item.id)}><span className="palette-preview" style={{ "--preview-primary": item.primary, "--preview-secondary": item.secondary } as React.CSSProperties}><i /><i /><b>UI / 01</b></span><span className="palette-choice-copy"><strong>{String(index + 1).padStart(2, "0")} — {item.name}</strong><small>{item.combination}</small><em>{item.description}</em></span><span className="palette-choice-state">{palette === item.id ? <><Check size={14} /> ACTIVE</> : "SELECT"}</span></button>)}</div></section>
      <section className="visual-signal-card visual-signal-wide"><div className="visual-signal-heading"><Contrast size={20} /><span className="mono">03 / READABILITY</span></div><h2>HIGH CONTRAST IS A SIGNAL, TOO.</h2><p>Increase border, focus, and text separation when you need a stronger read. This preference remains available from this page and the Home appearance menu.</p><button className="button button-outline" type="button" aria-pressed={highContrast} onClick={toggleHighContrast}>{highContrast ? "DISABLE HIGH CONTRAST" : "ENABLE HIGH CONTRAST"} <ArrowUpRight size={15} /></button></section>
      <div className="visual-signal-footer"><Link className="text-link" href="/settings">← BACK TO SETTINGS <ArrowUpRight size={15} /></Link><Link className="text-link" href="/personalization">TUNE KERNEL BEHAVIOUR <ArrowUpRight size={15} /></Link></div>
    </div>
  </AccountPageFrame>;
}
