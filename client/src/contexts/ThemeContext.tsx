import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "yellow" | "blue";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

export function ThemeProvider({ children, defaultTheme = "yellow", switchable = true }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined" || !switchable) return defaultTheme;
    const queryTheme = new URLSearchParams(window.location.search).get("theme");
    if (queryTheme === "blue" || queryTheme === "yellow") return queryTheme;
    const stored = window.localStorage.getItem("circuitsight-theme");
    return stored === "blue" || stored === "yellow" ? stored : defaultTheme;
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.add("dark");
      root.classList.toggle("blue-theme", theme === "blue");
    }
    if (switchable && typeof window !== "undefined") window.localStorage.setItem("circuitsight-theme", theme);
  }, [theme, switchable]);

  const toggleTheme = () => setTheme(current => current === "yellow" ? "blue" : "yellow");

  return <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
