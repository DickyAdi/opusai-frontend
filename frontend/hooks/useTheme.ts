import { themeStore } from "@/lib/store/theme_store";


export function useTheme() {
  return themeStore(state => state.currentTheme)
}

export function useSetTheme() {
  return themeStore(state => state.setTheme)
}

export function useFont() {
  return themeStore(state => state.currentFont)
}

export function useSetFont() {
  return themeStore(state => state.setFont)
}