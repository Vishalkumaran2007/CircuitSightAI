import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
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
      aria-label={darkMode ? "Switch to light white-black theme" : "Switch to dark black-blue theme"}
      title={darkMode ? "Switch to light white-black theme" : "Switch to dark black-blue theme"}
    >
      {darkMode ? <Sun size={15} /> : <Moon size={15} />}
      <span className="mono">{darkMode ? "LIGHT" : "DARK"}</span>
    </button>
  );
}
