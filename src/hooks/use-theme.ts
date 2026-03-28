"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store/theme-store";

export function useTheme() {
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);

  useEffect(() => {
    const stored = localStorage.getItem("orbis-theme") as "light" | "dark" | null;
    const initial = stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    if (initial !== theme) {
      setTheme(initial);
    } else {
      document.documentElement.classList.toggle("dark", initial === "dark");
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { theme, setTheme, toggleTheme };
}
