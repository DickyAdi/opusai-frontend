import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "dark" | "light" | "nord" | "dracula" | "solarized" | "monokai"
type Font = "Geist" | "Inter"

interface ThemeStore {
  currentTheme: Theme;
  currentFont: Font
  setTheme: (theme:Theme) => void;
  setFont: (font:Font) => void;
}

const ALL_THEMES: Theme[] = ["dark", "light", "nord", "dracula", "solarized", "monokai"];
const ALL_FONTS: Font[] = ["Geist", "Inter"]


function applyTheme(theme: Theme) {
  if (typeof window === "undefined") return;

  const root = document.documentElement
  // root.classList.remove("dark", "light", "nord", "dracula", "solarized", "monokai")
  // root.classList.add(theme)
  ALL_THEMES.forEach(t => root.classList.remove(t))
  root.classList.add(theme)
}

function applyFont(font:Font) {
  if (typeof window === "undefined") return;

  const root = document.documentElement
  ALL_FONTS.forEach(t => root.classList.remove(t))
  root.classList.add(font)
}


export const themeStore = create<ThemeStore>()(
  persist(
    (set) => ({
      currentTheme: "light",
      currentFont: "Inter",
      setTheme: (theme:Theme) =>
        set((state) => {
          applyTheme(theme);
          return { currentTheme: theme };
        }),
      setFont: (font:Font) => set((state) => {
        applyFont(font)
        return {currentFont: font}
      })
    }),
    {
      name: "theme-mode-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          applyTheme(state.currentTheme);
          applyFont(state.currentFont)
        }
      },
    }
  )
);
