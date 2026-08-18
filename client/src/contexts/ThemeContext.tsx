import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";

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

export function ThemeProvider({ children, defaultTheme = "dark", switchable = true }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined" || !switchable) return defaultTheme;
    const queryTheme = new URLSearchParams(window.location.search).get("theme");
    if (queryTheme === "dark" || queryTheme === "blue") return "dark";
    if (queryTheme === "light" || queryTheme === "yellow") return "light";
    const stored = window.localStorage.getItem("circuitsight-theme");
    if (stored === "dark" || stored === "blue") return "dark";
    if (stored === "light" || stored === "yellow") return "light";
    return defaultTheme;
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light-theme", theme === "light");
    }
    if (switchable && typeof window !== "undefined") window.localStorage.setItem("circuitsight-theme", theme);
  }, [theme, switchable]);

  const toggleTheme = () => setTheme(current => current === "dark" ? "light" : "dark");

  return <ThemeContext.Provider value={{ theme, toggleTheme, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
