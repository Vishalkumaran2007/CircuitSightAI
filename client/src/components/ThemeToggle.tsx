import React, { useEffect, useRef, useState } from "react";
import { Check, Contrast, Monitor, Moon, Settings2, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

type ThemeToggleProps = {
  homeDropdown?: boolean;
};

export default function ThemeToggle({ homeDropdown = false }: ThemeToggleProps) {
  const { theme, preference, toggleTheme, setPreference, highContrast, toggleHighContrast } = useTheme();
  const [open, setOpen] = useState(() => homeDropdown && typeof window !== "undefined" && new URLSearchParams(window.location.search).get("appearance") === "menu");
  const menuRef = useRef<HTMLDivElement>(null);
  const darkMode = theme === "dark";
  const systemSelected = preference === "system";

  useEffect(() => {
    if (!homeDropdown || !open || typeof document === "undefined") return;
    const handlePointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [homeDropdown, open]);

  if (homeDropdown) {
    const chooseTheme = (nextPreference: "light" | "dark" | "system") => {
      setPreference(nextPreference);
      setOpen(false);
    };

    return (
      <div ref={menuRef} className="theme-dropdown theme-controls" aria-label="Appearance preferences">
        <button
          type="button"
          className="theme-dropdown-trigger theme-toggle"
          aria-label="Open appearance preferences"
          aria-expanded={open}
          aria-haspopup="menu"
          title="Appearance preferences"
          onClick={() => setOpen(current => !current)}
          onKeyDown={event => {
            if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
              event.preventDefault();
              setOpen(true);
            }
          }}
        >
          <Settings2 size={16} aria-hidden="true" />
        </button>
        {open && (
          <div className="theme-dropdown-menu" role="menu" aria-label="Choose appearance">
            <button type="button" role="menuitemradio" aria-checked={preference === "light"} className="theme-dropdown-option" onClick={() => chooseTheme("light")}>
              <Sun size={14} aria-hidden="true" /><span>LIGHT</span>{preference === "light" && <Check size={13} aria-hidden="true" />}
            </button>
            <button type="button" role="menuitemradio" aria-checked={preference === "dark"} className="theme-dropdown-option" onClick={() => chooseTheme("dark")}>
              <Moon size={14} aria-hidden="true" /><span>DARK</span>{preference === "dark" && <Check size={13} aria-hidden="true" />}
            </button>
            <button type="button" role="menuitemradio" aria-checked={systemSelected} className="theme-dropdown-option" onClick={() => chooseTheme("system")}>
              <Monitor size={14} aria-hidden="true" /><span>SYSTEM</span>{systemSelected && <Check size={13} aria-hidden="true" />}
            </button>
            <button type="button" role="menuitemcheckbox" aria-checked={highContrast} className="theme-dropdown-option" onClick={() => { toggleHighContrast(); setOpen(false); }}>
              <Contrast size={14} aria-hidden="true" /><span>HIGH CONTRAST</span>{highContrast && <Check size={13} aria-hidden="true" />}
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="theme-controls" aria-label="Appearance preferences">
      <button
        type="button"
        className="theme-toggle"
        onClick={toggleTheme}
        onKeyDown={event => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            toggleTheme();
          }
        }}
        aria-label={darkMode ? "Switch to light white-black theme" : "Switch to dark black-lavender theme"}
        title={darkMode ? "Switch to light white-black theme" : "Switch to dark black-lavender theme"}
      >
        {darkMode ? <Sun size={15} /> : <Moon size={15} />}
        <span className="mono">{darkMode ? "LIGHT" : "DARK"}</span>
      </button>
      <button type="button" className="theme-toggle theme-toggle-system" onClick={() => setPreference(systemSelected ? theme : "system")} aria-pressed={systemSelected} aria-label={systemSelected ? "Stop following operating system theme" : "Follow operating system theme"} title={systemSelected ? "Stop following operating system theme" : "Follow operating system theme"}>
        <Monitor size={14} /><span className="mono">SYSTEM</span>
      </button>
      <button type="button" className="theme-toggle theme-toggle-contrast" onClick={toggleHighContrast} aria-pressed={highContrast} aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"} title={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}>
        <Contrast size={14} /><span className="mono">A11Y</span>
      </button>
    </div>
  );
}
