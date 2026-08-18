import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const blueMode = theme === "blue";
  return (
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
      aria-label={blueMode ? "Switch to yellow signal theme" : "Switch to blue signal theme"}
      title={blueMode ? "Switch to yellow signal theme" : "Switch to blue signal theme"}
    >
      {blueMode ? <Sun size={15} /> : <Moon size={15} />}
      <span className="mono">{blueMode ? "YELLOW" : "BLUE"}</span>
    </button>
  );
}
