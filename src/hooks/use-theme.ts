
import { create } from "zustand";

type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: 
    typeof window !== "undefined" 
      ? (localStorage.getItem("theme") as Theme) || 
        (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
      : "light",
  setTheme: (theme) => {
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
      document.documentElement.classList.toggle("dark", theme === "dark");
    }
    set({ theme });
  },
}));
