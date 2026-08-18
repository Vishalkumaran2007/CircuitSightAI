import React from "react";
import { Contrast, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, preference, toggleTheme, setPreference, highContrast, toggleHighContrast } = useTheme();
  const darkMode = theme === "dark";
  const systemSelected = preference === "system";

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
      <button
        type="button"
        className="theme-toggle theme-toggle-system"
        onClick={() => setPreference(systemSelected ? theme : "system")}
        aria-pressed={systemSelected}
        aria-label={systemSelected ? "Stop following operating system theme" : "Follow operating system theme"}
        title={systemSelected ? "Stop following operating system theme" : "Follow operating system theme"}
      >
        <Monitor size={14} />
        <span className="mono">SYSTEM</span>
      </button>
      <button
        type="button"
        className="theme-toggle theme-toggle-contrast"
        onClick={toggleHighContrast}
        aria-pressed={highContrast}
        aria-label={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
        title={highContrast ? "Disable high contrast mode" : "Enable high contrast mode"}
      >
        <Contrast size={14} />
        <span className="mono">A11Y</span>
      </button>
    </div>
  );
}
