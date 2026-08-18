import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "dark" | "light";
type ThemePreference = Theme | "system";
export type Palette = "lavender" | "cyan" | "amber" | "mint";

interface ThemeContextType {
  theme: Theme;
  preference: ThemePreference;
  systemTheme: Theme;
  toggleTheme: () => void;
  setPreference: (preference: ThemePreference) => void;
  highContrast: boolean;
  toggleHighContrast: () => void;
  palette: Palette;
  setPalette: (palette: Palette) => void;
  switchable: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

function readSystemTheme(): Theme {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return "dark";
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function readStoredPreference(): ThemePreference {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("circuitsight-theme-preference") ?? window.localStorage.getItem("circuitsight-theme");
  if (stored === "system") return "system";
  if (stored === "light" || stored === "yellow") return "light";
  return "dark";
}

export function ThemeProvider({ children, defaultTheme = "dark", switchable = true }: ThemeProviderProps) {
  const [systemTheme, setSystemTheme] = useState<Theme>(() => readSystemTheme());
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    if (typeof window === "undefined" || !switchable) return defaultTheme;
    const queryTheme = new URLSearchParams(window.location.search).get("theme");
    if (queryTheme === "system") return "system";
    if (queryTheme === "dark" || queryTheme === "blue") return "dark";
    if (queryTheme === "light" || queryTheme === "yellow") return "light";
    return readStoredPreference();
  });
  const [palette, setPaletteState] = useState<Palette>(() => {
    if (typeof window === "undefined") return "lavender";
    const stored = window.localStorage.getItem("circuitsight-theme-palette");
    return stored === "cyan" || stored === "amber" || stored === "mint" ? stored : "lavender";
  });
  const [highContrast, setHighContrast] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem("circuitsight-high-contrast") === "true";
  });
  const theme: Theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const media = window.matchMedia("(prefers-color-scheme: light)");
    const handleChange = () => setSystemTheme(media.matches ? "light" : "dark");
    handleChange();
    media.addEventListener?.("change", handleChange);
    return () => media.removeEventListener?.("change", handleChange);
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const root = document.documentElement;
      root.classList.toggle("dark", theme === "dark");
      root.classList.toggle("light-theme", theme === "light");
      root.classList.toggle("high-contrast", highContrast);
      if (typeof root.classList.remove === "function") root.classList.remove("palette-lavender", "palette-cyan", "palette-amber", "palette-mint");
      if (typeof root.classList.add === "function") root.classList.add(`palette-${palette}`);
    }
    if (switchable && typeof window !== "undefined") {
      window.localStorage.setItem("circuitsight-theme-preference", preference);
      window.localStorage.setItem("circuitsight-theme", theme);
      window.localStorage.setItem("circuitsight-high-contrast", String(highContrast));
      window.localStorage.setItem("circuitsight-theme-palette", palette);
    }
  }, [theme, preference, highContrast, palette, switchable]);

  const toggleTheme = () => setPreferenceState(current => (current === "dark" ? "light" : "dark"));
  const setPreference = (nextPreference: ThemePreference) => setPreferenceState(nextPreference);
  const toggleHighContrast = () => setHighContrast(current => !current);
  const setPalette = (nextPalette: Palette) => setPaletteState(nextPalette);

  return <ThemeContext.Provider value={{ theme, preference, systemTheme, toggleTheme, setPreference, highContrast, toggleHighContrast, palette, setPalette, switchable }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
}
